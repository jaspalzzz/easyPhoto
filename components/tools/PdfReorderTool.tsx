"use client";

import * as React from "react";
import {
  Download,
  FileUp,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Trash2,
  RefreshCw,
  Undo2,
} from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pdfToCanvases, PdfEncryptedError } from "@/lib/pdfToImages";
import { downloadBlob } from "@/lib/download";

// Fix 1: originalCanvas removed — canvases live in canvasesRef, not in state.
interface PageItem {
  id: string;
  originalIndex: number; // 0-based index of the page in the original PDF
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
  const [srcFile, setSrcFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string>("");
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Fix 1: canvases stored in a ref — keyed by originalIndex — never in state.
  const canvasesRef = React.useRef<HTMLCanvasElement[]>([]);

  // Fix 2: soft-delete — set of page ids pending confirmation.
  const [pendingDelete, setPendingDelete] = React.useState<Set<string>>(new Set());

  // Cleanup canvases on unmount.
  React.useEffect(() => {
    return () => {
      canvasesRef.current = [];
    };
  }, []);

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
    // Fix 1: clear canvasesRef on reload.
    canvasesRef.current = [];
    setPendingDelete(new Set());
    setSrcFile(file);
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

      // Fix 1: store canvases in ref, not in state.
      canvasesRef.current = canvases;

      const items: PageItem[] = canvases.map((canvas, index) => {
        const thumbUrl = makeThumbnail(canvas);
        return {
          id: Math.random().toString(36).substring(2, 9),
          originalIndex: index,
          thumbnailUrl: thumbUrl,
          rotation: 0,
        };
      });

      setPages(items);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof PdfEncryptedError) {
        setError("encrypted");
      } else {
        setError((err instanceof Error && err.message) || "Could not load the PDF. Ensure it is not encrypted or corrupted.");
      }
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

    // Fix 1: read original canvas from ref by originalIndex.
    const originalCanvas = canvasesRef.current[item.originalIndex];
    const rotatedCanvas = rotateCanvas(originalCanvas, newRotation);
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

  // Fix 2: two-step soft delete — first click marks pending, second click removes.
  const removePage = (id: string) => {
    if (pendingDelete.has(id)) {
      // Confirmed — actually remove the page.
      setPages((prev) => prev.filter((p) => p.id !== id));
      setPendingDelete((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      // First click — mark as pending, asking for confirmation.
      setPendingDelete((prev) => new Set(prev).add(id));
    }
  };

  const cancelDelete = (id: string) => {
    setPendingDelete((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const runExport = async () => {
    if (pages.length === 0 || !srcFile) {
      setError("No pages to export.");
      return;
    }
    setBusy(true);
    setProgress("Compiling PDF document...");
    setError(null);
    try {
      // LOSSLESS: rebuild from the ORIGINAL pages via pdf-lib (text/vectors
      // preserved). The on-screen thumbnails stay rasterized for preview only;
      // the exported file copies + rotates the real pages in the chosen order.
      const { reorderPdf } = await import("@/lib/pdfEdit");
      const pdfBlob = await reorderPdf(
        srcFile,
        pages.map((p) => ({ originalIndex: p.originalIndex, rotation: p.rotation }))
      );

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
    // Fix 1: clear canvasesRef on reset.
    canvasesRef.current = [];
    setPendingDelete(new Set());
    setSrcFile(null);
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
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.dataset.dragging = "1";
            }}
            onDragLeave={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
            onDropCapture={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
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
            {error === "encrypted" ? (
              <>
                This PDF is password-protected. Please unlock it first using the{" "}
                <a href="/tools/unlock-pdf" className="underline font-medium">Unlock PDF tool</a>.
              </>
            ) : error}
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
                {/* Fix 3: disable Save PDF when no pages remain. */}
                <Button
                  id="pdf-reorder-save-btn"
                  variant="cta"
                  size="sm"
                  onClick={runExport}
                  disabled={busy || pages.length === 0}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="h-4 w-4" /> Save PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((item, index) => {
                const isPendingDelete = pendingDelete.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col border rounded-md bg-paper overflow-hidden hover:shadow-md transition-shadow ${
                      isPendingDelete
                        ? "border-destructive ring-1 ring-destructive/40"
                        : "border-hairline"
                    }`}
                  >
                    {/* Thumbnail area */}
                    <div className="relative flex items-center justify-center p-3 bg-accent/5 aspect-[3/4]">
                      <img
                        src={item.thumbnailUrl}
                        alt={`Page ${index + 1}`}
                        className={`max-h-full max-w-full object-contain shadow-sm border border-hairline/50 rounded transition-opacity ${
                          isPendingDelete ? "opacity-40" : ""
                        }`}
                      />
                      <div className="absolute top-2 left-2 bg-background/90 text-[10px] font-mono px-1.5 py-0.5 rounded border border-hairline font-semibold">
                        #{index + 1}
                      </div>
                      {item.rotation !== 0 && (
                        <div className="absolute top-2 right-2 bg-brand/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                          <RefreshCw className="h-2.5 w-2.5 animate-spin-slow" /> {item.rotation}°
                        </div>
                      )}
                      {/* Fix 2: pending-delete overlay with undo affordance. */}
                      {isPendingDelete && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 gap-1">
                          <p className="text-[10px] font-semibold text-destructive text-center px-2">
                            Delete page {index + 1}?
                          </p>
                          <button
                            type="button"
                            className="text-[10px] underline text-destructive font-bold"
                            onClick={() => removePage(item.id)}
                            aria-label={`Confirm delete page ${index + 1}`}
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions area */}
                    <div className="flex flex-col border-t border-hairline p-2 gap-2 bg-background">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          {/* Fix 4: aria-label with page number context. */}
                          <Button
                            id={`pdf-reorder-ccw-btn-${index}`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-ink-soft hover:bg-accent/40"
                            onClick={() => rotatePage(index, "ccw")}
                            title="Rotate CCW (90° Left)"
                            aria-label={`Rotate page ${index + 1} counter-clockwise`}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            id={`pdf-reorder-cw-btn-${index}`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-ink-soft hover:bg-accent/40"
                            onClick={() => rotatePage(index, "cw")}
                            title="Rotate CW (90° Right)"
                            aria-label={`Rotate page ${index + 1} clockwise`}
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Fix 2 + Fix 4: delete button toggles pending; undo cancels it. */}
                        {isPendingDelete ? (
                          <Button
                            id={`pdf-reorder-undo-delete-btn-${index}`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-ink-soft hover:bg-accent/40"
                            onClick={() => cancelDelete(item.id)}
                            title="Undo Delete"
                            aria-label={`Undo delete page ${index + 1}`}
                          >
                            <Undo2 className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <Button
                            id={`pdf-reorder-delete-btn-${index}`}
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-destructive hover:bg-destructive/10"
                            onClick={() => removePage(item.id)}
                            title="Delete Page"
                            aria-label={`Delete page ${index + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-hairline/40 pt-1.5 gap-1">
                        {/* Fix 4: aria-label with page number context on move buttons. */}
                        <Button
                          id={`pdf-reorder-left-btn-${index}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-ink-soft hover:bg-accent/40 flex-1"
                          disabled={index === 0}
                          onClick={() => movePage(index, "left")}
                          title="Move Left"
                          aria-label={`Move page ${index + 1} left`}
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
                          className="h-10 w-10 text-ink-soft hover:bg-accent/40 flex-1"
                          disabled={index === pages.length - 1}
                          onClick={() => movePage(index, "right")}
                          title="Move Right"
                          aria-label={`Move page ${index + 1} right`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fix 3: contextual message when all pages have been removed. */}
        {pages.length === 0 && !busy && srcFile && (
          <p className="text-sm text-muted-foreground text-center py-3">
            All pages have been removed — reset to start over.
          </p>
        )}

        {busy && <ProcessingState label={progress ?? "Processing PDF…"} />}
      </CardContent>
    </Card>
  );
}
