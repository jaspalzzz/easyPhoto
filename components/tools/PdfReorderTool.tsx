"use client";

import * as React from "react";
import {
  Loader2,
  Download,
  FileUp,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pdfToCanvases } from "@/lib/pdfToImages";
import { downloadBlob } from "@/lib/download";

interface PageItem {
  id: string;
  originalIndex: number; // 0-based index of the page in the original PDF
  originalCanvas: HTMLCanvasElement; // High-res canvas of the original unrotated page
  thumbnailUrl: string; // low-res thumbnail data URL of the page with current rotation applied
  rotation: number; // 0, 90, 180, 270
}

function rotateCanvas(canvas: HTMLCanvasElement, rotation: number): HTMLCanvasElement {
  if (rotation === 0) return canvas;
  const angle = (rotation * Math.PI) / 180;
  const rotated = document.createElement("canvas");
  if (rotation === 90 || rotation === 270) {
    rotated.width = canvas.height;
    rotated.height = canvas.width;
  } else {
    rotated.width = canvas.width;
    rotated.height = canvas.height;
  }
  const ctx = rotated.getContext("2d");
  if (!ctx) return canvas;
  ctx.translate(rotated.width / 2, rotated.height / 2);
  ctx.rotate(angle);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return rotated;
}

function makeThumbnail(canvas: HTMLCanvasElement, maxDim = 300): string {
  const thumb = document.createElement("canvas");
  const scale = Math.min(maxDim / canvas.width, maxDim / canvas.height);
  if (scale >= 1) return canvas.toDataURL("image/jpeg", 0.75);
  thumb.width = canvas.width * scale;
  thumb.height = canvas.height * scale;
  const ctx = thumb.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/jpeg", 0.75);
  ctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
  return thumb.toDataURL("image/jpeg", 0.75);
}

export function PdfReorderTool() {
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [fileName, setFileName] = React.useState<string>("");
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadPdf(e.target.files[0]);
    }
  };

  const loadPdf = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }
    setError(null);
    setBusy(true);
    setPages([]);
    setFileName(file.name);
    setProgress("Loading PDF pages...");
    try {
      const canvases = await pdfToCanvases(file, {
        scale: 1.5,
        maxPages: 100, // Allow up to 100 pages for reordering/rotation
        onProgress: (current, total) => {
          setProgress(`Rendering page ${current} of ${total}...`);
        },
      });

      const items: PageItem[] = canvases.map((canvas, index) => {
        const thumbUrl = makeThumbnail(canvas);
        return {
          id: Math.random().toString(36).substring(2, 9),
          originalIndex: index,
          originalCanvas: canvas,
          thumbnailUrl: thumbUrl,
          rotation: 0,
        };
      });

      setPages(items);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not load the PDF. Ensure it is not encrypted or corrupted.");
      setFileName("");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const rotatePage = (index: number, direction: "cw" | "ccw") => {
    const updated = [...pages];
    const item = updated[index];
    const change = direction === "cw" ? 90 : -90;
    let newRotation = (item.rotation + change) % 360;
    if (newRotation < 0) newRotation += 360;

    const rotatedCanvas = rotateCanvas(item.originalCanvas, newRotation);
    const newThumbUrl = makeThumbnail(rotatedCanvas);

    updated[index] = {
      ...item,
      rotation: newRotation,
      thumbnailUrl: newThumbUrl,
    };
    setPages(updated);
  };

  const movePage = (index: number, direction: "left" | "right") => {
    const nextIndex = direction === "left" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= pages.length) return;

    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setPages(updated);
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const runExport = async () => {
    if (pages.length === 0) {
      setError("No pages to export.");
      return;
    }
    setBusy(true);
    setProgress("Compiling PDF document...");
    setError(null);
    try {
      const { jsPDF } = await import("jspdf");
      let doc: import("jspdf").jsPDF | null = null;

      for (let i = 0; i < pages.length; i++) {
        const item = pages[i];
        setProgress(`Adding page ${i + 1} of ${pages.length}...`);

        // Get rotated canvas
        const canvas = rotateCanvas(item.originalCanvas, item.rotation);
        const w = canvas.width;
        const h = canvas.height;
        const orientation: "p" | "l" = w >= h ? "l" : "p";

        // Convert pixels to mm: mm = (px / 150) * 25.4 (since scale = 1.5 in pdfToCanvases)
        const mmW = (w / 150) * 25.4;
        const mmH = (h / 150) * 25.4;

        if (!doc) {
          doc = new jsPDF({
            unit: "mm",
            format: [mmW, mmH],
            orientation,
          });
        } else {
          doc.addPage([mmW, mmH], orientation);
        }

        // Draw rotated canvas onto PDF
        const dataUrl = canvas.toDataURL("image/jpeg", 0.90);
        doc.addImage(dataUrl, "JPEG", 0, 0, mmW, mmH);
      }

      if (!doc) throw new Error("Could not construct PDF document.");
      const pdfBlob = doc.output("blob");

      // Save file name with indicator
      const baseName = fileName.replace(/\.[^/.]+$/, "");
      downloadBlob(pdfBlob, `${baseName}-modified.pdf`);
    } catch (err) {
      console.error(err);
      setError("Could not compile the PDF. Please try again.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const reset = () => {
    setPages([]);
    setFileName("");
    setError(null);
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {pages.length === 0 && !busy && (
          <div
            id="pdf-reorder-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                loadPdf(e.dataTransfer.files[0]);
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight">Select PDF file, or drop it here</p>
            <p className="text-xs text-muted-foreground">Upload a PDF to reorder, rotate, or delete individual pages.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed 100% locally
            </p>
            <input
              id="pdf-reorder-file-input"
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {pages.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-hairline pb-3">
              <div>
                <h4 className="font-semibold text-sm truncate max-w-md" title={fileName}>
                  {fileName}
                </h4>
                <p className="text-xs text-muted-foreground">{pages.length} pages in document</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button id="pdf-reorder-reset-btn" variant="outline" size="sm" onClick={reset} disabled={busy}>
                  Reset
                </Button>
                <Button id="pdf-reorder-save-btn" variant="cta" size="sm" onClick={runExport} disabled={busy} className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4" /> Save PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col border border-hairline rounded-md bg-paper overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail area */}
                  <div className="relative flex items-center justify-center p-3 bg-accent/5 aspect-[3/4]">
                    <img
                      src={item.thumbnailUrl}
                      alt={`Page ${index + 1}`}
                      className="max-h-full max-w-full object-contain shadow-sm border border-hairline/50 rounded"
                    />
                    <div className="absolute top-2 left-2 bg-background/90 text-[10px] font-mono px-1.5 py-0.5 rounded border border-hairline font-semibold">
                      #{index + 1}
                    </div>
                    {item.rotation !== 0 && (
                      <div className="absolute top-2 right-2 bg-brand/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                        <RefreshCw className="h-2.5 w-2.5 animate-spin-slow" /> {item.rotation}°
                      </div>
                    )}
                  </div>

                  {/* Actions area */}
                  <div className="flex flex-col border-t border-hairline p-2 gap-2 bg-background">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <Button
                          id={`pdf-reorder-ccw-btn-${index}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-ink-soft hover:bg-accent/40"
                          onClick={() => rotatePage(index, "ccw")}
                          title="Rotate CCW (90° Left)"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          id={`pdf-reorder-cw-btn-${index}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-ink-soft hover:bg-accent/40"
                          onClick={() => rotatePage(index, "cw")}
                          title="Rotate CW (90° Right)"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <Button
                        id={`pdf-reorder-delete-btn-${index}`}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => removePage(index)}
                        title="Delete Page"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline/40 pt-1.5 gap-1">
                      <Button
                        id={`pdf-reorder-left-btn-${index}`}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-ink-soft hover:bg-accent/40 flex-1"
                        disabled={index === 0}
                        onClick={() => movePage(index, "left")}
                        title="Move Left"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-[10px] text-muted-foreground px-1 font-mono select-none font-semibold">
                        Orig: #{item.originalIndex + 1}
                      </span>
                      <Button
                        id={`pdf-reorder-right-btn-${index}`}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-ink-soft hover:bg-accent/40 flex-1"
                        disabled={index === pages.length - 1}
                        onClick={() => movePage(index, "right")}
                        title="Move Right"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-ink-soft border border-hairline rounded-md bg-accent/5">
            <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={1.75} />
            <p className="text-sm font-medium">{progress ?? "Processing PDF…"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
