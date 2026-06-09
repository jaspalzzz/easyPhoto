"use client";

import * as React from "react";
import { Loader2, Download, FileUp, Trash2, CheckCircle2, AlertCircle, FileImage, Archive, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canvasToBlob } from "@/lib/imaging";
import { ensureDecodable } from "@/lib/heic";
import { downloadBlob } from "@/lib/download";
import { formatKb, generateBatchFilename } from "@/lib/utils";

type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

interface BatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
  resultBlob?: Blob;
  resultUrl?: string;
}

export function FormatConverterTool({
  defaultTarget = "image/jpeg",
}: {
  /** Pre-selected output format — set by per-pair landing pages (e.g. /convert/heic-to-jpg/). */
  defaultTarget?: ImageFormat;
} = {}) {
  const [items, setItems] = React.useState<BatchItem[]>([]);
  const [targetFormat, setTargetFormat] = React.useState<ImageFormat>(defaultTarget);
  const [quality, setQuality] = React.useState(0.92);
  const [namingTemplate, setNamingTemplate] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Keep ref of items for cleanup on unmount
  const itemsRef = React.useRef<BatchItem[]>([]);
  itemsRef.current = items;

  React.useEffect(() => {
    return () => {
      itemsRef.current.forEach((it) => {
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      });
    };
  }, []);

  // Fix 2: When targetFormat changes, revoke stale object URLs and reset completed
  // items back to pending so they are re-converted with the new format.
  React.useEffect(() => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.status !== "completed") return it;
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
        return { ...it, status: "pending", resultBlob: undefined, resultUrl: undefined };
      })
    );
  }, [targetFormat]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (filesList: File[]) => {
    setError(null);
    const imageFiles = filesList.filter((f) => {
      const type = f.type.toLowerCase();
      const name = f.name.toLowerCase();
      return (
        type.startsWith("image/") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png") ||
        name.endsWith(".webp") ||
        name.endsWith(".heic") ||
        name.endsWith(".heif")
      );
    });

    if (imageFiles.length === 0) {
      setError("Please select valid image files (JPG, PNG, WebP, HEIC).");
      return;
    }

    const newItems: BatchItem[] = imageFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: "pending",
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.resultUrl) {
        URL.revokeObjectURL(target.resultUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const clearQueue = () => {
    items.forEach((it) => {
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
    });
    setItems([]);
    setError(null);
  };

  const convertBatch = async () => {
    // Fix 3: Guard against double-invocation — if a conversion is already running,
    // exit early. Also read current item state from itemsRef to avoid stale closure.
    if (busy) return;
    if (items.length === 0) return;
    setBusy(true);
    setError(null);

    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i];
      if (item.status === "completed") continue;

      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "processing" } : it))
      );

      try {
        // HEIC conversion if needed
        const decodableFile = await ensureDecodable(item.file);

        // Load image in browser
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.src = URL.createObjectURL(decodableFile);
          image.onload = () => {
            URL.revokeObjectURL(image.src);
            resolve(image);
          };
          image.onerror = (err) => {
            URL.revokeObjectURL(image.src);
            reject(err);
          };
        });

        // Setup canvas
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not acquire 2D canvas context.");

        // Draw and flatten transparency to white for JPEG format
        if (targetFormat === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        // Compress
        const blob = await canvasToBlob(
          canvas,
          targetFormat,
          targetFormat === "image/png" ? undefined : quality
        );

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "completed",
                  resultBlob: blob,
                  resultUrl: URL.createObjectURL(blob),
                }
              : it
          )
        );
      } catch (err: any) {
        console.error("Error converting file:", item.name, err);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "failed",
                  error: err?.message || "Conversion failed.",
                }
              : it
          )
        );
      }
    }
    setBusy(false);
  };

  const downloadSingle = (item: BatchItem, index: number) => {
    if (!item.resultBlob) return;
    const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/png" ? "png" : "webp";
    let finalName = item.name.replace(/\.[^/.]+$/, "") + "." + ext;
    if (namingTemplate.trim()) {
      finalName = generateBatchFilename(namingTemplate.trim(), index, ext);
    }
    downloadBlob(item.resultBlob, finalName);
  };

  const downloadZip = async () => {
    const completed = items.filter((it) => it.status === "completed" && it.resultBlob);
    if (completed.length === 0) return;

    setBusy(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      completed.forEach((item, index) => {
        const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/png" ? "png" : "webp";
        let finalName = item.name.replace(/\.[^/.]+$/, "") + "." + ext;
        if (namingTemplate.trim()) {
          finalName = generateBatchFilename(namingTemplate.trim(), index, ext);
        }
        zip.file(finalName, item.resultBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "converted-images.zip");
    } catch (err) {
      console.error(err);
      setError("Could not package files into a ZIP. Try downloading files individually.");
    } finally {
      setBusy(false);
    }
  };

  const getFormatLabel = (fmt: ImageFormat) => {
    if (fmt === "image/jpeg") return "JPG";
    if (fmt === "image/png") return "PNG";
    return "WebP";
  };

  const completedCount = items.filter((it) => it.status === "completed").length;

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {/* Upload Zone */}
        {items.length === 0 && (
          <div
            id="converter-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) {
                addFiles(Array.from(e.dataTransfer.files));
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight">Select images, or drop them here</p>
            <p className="text-xs text-muted-foreground">Upload multiple JPG, PNG, WebP, or iPhone HEIC photos to convert.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed 100% locally
            </p>
            <input
              id="converter-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        {items.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Left Column: Queue List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <h4 className="font-semibold text-sm">Conversion Queue ({items.length} files)</h4>
                <div className="flex gap-2">
                  <Button id="converter-clear-btn" variant="outline" size="sm" onClick={clearQueue} disabled={busy}>
                    Clear All
                  </Button>
                  <Button
                    id="converter-run-btn"
                    variant={items.some((it) => it.status !== "completed") ? "cta" : "outline"}
                    size="sm"
                    onClick={convertBatch}
                    disabled={busy || !items.some((it) => it.status !== "completed")}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Converting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" /> Convert All
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 border border-hairline rounded-md bg-paper p-3 hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileImage className="h-5 w-5 text-brand shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold truncate leading-tight">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatKb(item.size)}
                          {item.status === "completed" && item.resultBlob && (
                            <span className="text-brand font-semibold">
                              {" "}
                              → {formatKb(item.resultBlob.size)} ({getFormatLabel(targetFormat)})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "processing" && (
                        <Loader2 className="h-4 w-4 animate-spin text-brand" />
                      )}
                      {item.status === "completed" && (
                        <span className="text-emerald-600 flex items-center gap-1 text-xs font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          Ready
                        </span>
                      )}
                      {item.status === "failed" && (
                        <span className="text-destructive flex flex-col items-end gap-0.5 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            Failed
                          </span>
                          {item.error && (
                            <span className="text-[10px] font-normal text-destructive/80 max-w-[140px] text-right leading-tight">
                              {item.error}
                            </span>
                          )}
                        </span>
                      )}

                      {item.status === "completed" && (
                        <Button
                          id={`converter-dl-btn-${index}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-brand"
                          onClick={() => downloadSingle(item, index)}
                          title="Download converted image"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        id={`converter-remove-btn-${index}`}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        disabled={busy}
                        onClick={() => removeItem(item.id)}
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Settings */}
            <div className="space-y-4">
              <div className="bg-paper p-4 border border-hairline rounded-md space-y-4">
                <span className="text-[11px] font-semibold eyebrow uppercase tracking-wider text-brand block">
                  Settings
                </span>

                {/* Target Format */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground block">Format</span>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label="Output format">
                    {(["image/jpeg", "image/png", "image/webp"] as const).map((fmt) => (
                      <button
                        id={`converter-fmt-btn-${getFormatLabel(fmt).toLowerCase()}`}
                        key={fmt}
                        type="button"
                        aria-pressed={targetFormat === fmt}
                        onClick={() => setTargetFormat(fmt)}
                        className={`rounded-md border py-2 text-xs font-semibold transition-colors ${
                          targetFormat === fmt
                            ? "bg-brand/10 border-brand text-brand"
                            : "bg-background border-hairline hover:bg-accent/40"
                        }`}
                      >
                        {getFormatLabel(fmt)}
                      </button>
                    ))}
                  </div>
                  {targetFormat === "image/jpeg" && (
                    <p className="text-[10px] leading-normal text-amber-700">
                      JPG has no transparency — transparent areas (from PNG/WebP)
                      are filled with white. Pick PNG or WebP to keep transparency.
                    </p>
                  )}
                </div>

                {/* Quality */}
                {targetFormat !== "image/png" && (
                  <label className="block text-sm space-y-1">
                    <span className="mb-1 flex items-center justify-between">
                      <span className="eyebrow text-xs">Quality</span>
                      <span className="font-mono text-xs text-brand font-semibold">{Math.round(quality * 100)}%</span>
                    </span>
                    <input
                      id="converter-quality-slider"
                      type="range"
                      min={0.2}
                      max={1.0}
                      step={0.01}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </label>
                )}

                {/* Naming Template */}
                <label className="block text-sm space-y-1">
                  <span className="eyebrow text-xs">Naming Template</span>
                  <input
                    id="converter-naming-template"
                    type="text"
                    value={namingTemplate}
                    onChange={(e) => setNamingTemplate(e.target.value)}
                    placeholder="e.g. photo_###"
                    className="h-9 w-full rounded-md border border-hairline-strong bg-background px-3 text-xs"
                  />
                  <span className="text-[10px] text-muted-foreground block leading-normal">
                    Optional. Use # for padded numbers (e.g., <code className="font-mono text-[9px]">doc_###</code> gives <code className="font-mono text-[9px]">doc_001.jpg</code>).
                  </span>
                </label>
              </div>

              {/* Batch Download ZIP */}
              {completedCount > 0 && (
                <div className="space-y-2">
                  <Button id="converter-zip-btn" variant="cta" className="w-full" onClick={downloadZip} disabled={busy}>
                    <Archive className="h-4 w-4" /> Download ZIP ({completedCount} files)
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground leading-normal">
                    Compresses all ready conversions into a ZIP for convenient download.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
