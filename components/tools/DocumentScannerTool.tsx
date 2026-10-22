"use client";

import * as React from "react";
import { Camera, FileText, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, ToolCard } from "@/components/ui/card";
import { CornerAdjuster } from "@/components/tools/CornerAdjuster";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { pdfNextSteps } from "@/components/site/pdfNextSteps";
import { warpQuadToCanvas, isConvexQuad, type Quad } from "@/lib/perspective";
import { enhancePixels, type ScanMode } from "@/lib/scanEnhance";
import { loadImageFromFile } from "@/lib/pipeline";
import { imagesToPdf } from "@/lib/imagesToPdf";
import { ensureDecodable } from "@/lib/heic";
import { downloadBlob } from "@/lib/download";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

/**
 * Turn phone photographs of a document into a flat, evenly-lit PDF.
 *
 * Corners are placed by hand rather than detected automatically. That is a
 * deliberate first cut: automatic edge detection fails on low-contrast desks
 * and shadowed corners, and a wrong guess the user must undo is worse than a
 * handle they simply drag. Auto-detection belongs on top of this later, as a
 * suggestion that pre-positions these handles — never as the only path.
 *
 * Everything runs in the browser. People scan Aadhaar cards, marksheets and
 * bank documents here; nothing is uploaded.
 */

/** Preview resolution — small enough to re-warp smoothly while dragging. */
const PREVIEW_MAX_EDGE = 900;
/** Export resolution — readable text without exhausting mobile memory. */
const EXPORT_MAX_EDGE = 2200;
/** Default corner inset, as a fraction of each dimension. */
const DEFAULT_INSET = 0.06;
const JPEG_QUALITY = 0.9;

interface ScannedPage {
  id: string;
  name: string;
  image: HTMLImageElement;
  url: string;
  width: number;
  height: number;
  quad: Quad;
  mode: ScanMode;
}

const MODE_OPTIONS: { value: ScanMode; label: string; hint: string }[] = [
  { value: "colour", label: "Colour", hint: "Flatten lighting, keep colour" },
  { value: "greyscale", label: "Greyscale", hint: "Neutral grey" },
  { value: "blackwhite", label: "Black & white", hint: "Crispest text" },
  { value: "original", label: "Original", hint: "No enhancement" },
];

function defaultQuad(width: number, height: number): Quad {
  const insetX = width * DEFAULT_INSET;
  const insetY = height * DEFAULT_INSET;
  return [
    { x: insetX, y: insetY },
    { x: width - insetX, y: insetY },
    { x: width - insetX, y: height - insetY },
    { x: insetX, y: height - insetY },
  ];
}

/** Warp to a rectangle, then enhance. Shared by preview and export. */
function renderPage(page: ScannedPage, maxDimension: number): HTMLCanvasElement {
  const canvas = warpQuadToCanvas(page.image, page.quad, { maxDimension });
  if (page.mode === "original") return canvas;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  const source = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const enhanced = enhancePixels(
    source.data,
    source.width,
    source.height,
    page.mode
  );
  ctx.putImageData(new ImageData(enhanced, source.width, source.height), 0, 0);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode the page.")),
      "image/jpeg",
      JPEG_QUALITY
    );
  });
}

export function DocumentScannerTool() {
  const [pages, setPages] = React.useState<ScannedPage[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [addWarning, setAddWarning] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const previewRef = React.useRef<HTMLCanvasElement>(null);

  // Revoke every object URL on unmount; the ref keeps the cleanup current.
  const pagesRef = React.useRef(pages);
  pagesRef.current = pages;
  React.useEffect(
    () => () => pagesRef.current.forEach((p) => URL.revokeObjectURL(p.url)),
    []
  );

  const selected = pages.find((p) => p.id === selectedId) ?? null;

  // Debounce the quad so dragging stays smooth: the handles update at pointer
  // rate while the (much heavier) re-warp runs once the user pauses.
  const debouncedQuad = useDebouncedValue(selected?.quad, 120);

  React.useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !selected) return;
    if (!isConvexQuad(selected.quad)) return;
    try {
      const rendered = renderPage(selected, PREVIEW_MAX_EDGE);
      canvas.width = rendered.width;
      canvas.height = rendered.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(rendered, 0, 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not render the preview."
      );
    }
    // `debouncedQuad` is the trigger; `selected` carries the values used.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuad, selected?.id, selected?.mode]);

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const images = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name)
    );
    const added: ScannedPage[] = [];
    const failed: string[] = [];

    for (const file of images) {
      try {
        const decodable = await ensureDecodable(file); // iPhone HEIC → JPEG
        const { image, size, url } = await loadImageFromFile(decodable);
        added.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          image,
          url,
          width: size.width,
          height: size.height,
          quad: defaultQuad(size.width, size.height),
          // Inherit the last page's look so a multi-page scan stays consistent.
          mode: pagesRef.current.at(-1)?.mode ?? "colour",
        });
      } catch {
        failed.push(file.name);
      }
    }

    if (failed.length) {
      setAddWarning(
        `${failed.length} ${failed.length === 1 ? "file" : "files"} could not be opened: ${failed.join(", ")}`
      );
    }
    if (added.length) {
      setPages((prev) => [...prev, ...added]);
      setSelectedId((current) => current ?? added[0].id);
      setResultBlob(null);
    }
  };

  const updateSelected = (patch: Partial<ScannedPage>) => {
    if (!selectedId) return;
    setPages((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, ...patch } : p))
    );
    setResultBlob(null);
  };

  const removePage = (id: string) => {
    setPages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      const next = prev.filter((p) => p.id !== id);
      setSelectedId((current) =>
        current === id ? (next[0]?.id ?? null) : current
      );
      return next;
    });
    setResultBlob(null);
  };

  const exportPdf = async () => {
    setBusy(true);
    setError(null);
    try {
      const invalid = pages.filter((p) => !isConvexQuad(p.quad));
      if (invalid.length) {
        throw new Error(
          `Fix the corner outline on ${invalid.length} ${invalid.length === 1 ? "page" : "pages"} before exporting.`
        );
      }
      const files: File[] = [];
      for (const [index, page] of pages.entries()) {
        const blob = await canvasToBlob(renderPage(page, EXPORT_MAX_EDGE));
        files.push(
          new File([blob], `page-${index + 1}.jpg`, { type: "image/jpeg" })
        );
      }
      const pdf = await imagesToPdf(files);
      setResultBlob(pdf);
      downloadBlob(pdf, "scan.pdf");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create the PDF."
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadCurrentPage = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await canvasToBlob(renderPage(selected, EXPORT_MAX_EDGE));
      downloadBlob(blob, "scan.jpg");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export the page.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolCard>
      <CardContent className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void addFiles(e.dataTransfer.files);
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <Plus className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight">Add pages</p>
            <p className="text-sm text-ink-soft">
              JPG, PNG or HEIC — drag and drop, or browse
            </p>
          </div>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <Camera className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight">Take a photo</p>
            <p className="text-sm text-ink-soft">Use your phone&apos;s camera</p>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          hidden
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {pages.length > 0 && (
          <div className="flex flex-wrap gap-2" role="list" aria-label="Scanned pages">
            {pages.map((page, index) => (
              <div key={page.id} role="listitem" className="relative">
                <button
                  type="button"
                  onClick={() => setSelectedId(page.id)}
                  aria-current={page.id === selectedId}
                  aria-label={`Page ${index + 1}${page.id === selectedId ? ", selected" : ""}`}
                  className={`h-20 w-16 overflow-hidden rounded-md border-2 transition-colors ${
                    page.id === selectedId
                      ? "border-brand"
                      : "border-hairline-strong hover:border-brand/50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => removePage(page.id)}
                  aria-label={`Remove page ${index + 1}`}
                  className="absolute -right-1.5 -top-1.5 rounded-full border border-hairline-strong bg-paper p-1 text-ink-soft shadow-sm hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-tight">
                Drag the corners onto the page edges
              </p>
              <CornerAdjuster
                src={selected.url}
                width={selected.width}
                height={selected.height}
                value={selected.quad}
                onChange={(quad) => updateSelected({ quad })}
                disabled={busy}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold tracking-tight">Result</p>
              <canvas
                ref={previewRef}
                aria-label="Flattened and enhanced preview of the current page"
                className="w-full rounded-lg border border-hairline-strong bg-paper"
              />
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold tracking-tight">
                  Enhancement
                </legend>
                <div className="flex flex-wrap gap-2">
                  {MODE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateSelected({ mode: option.value })}
                      aria-pressed={selected.mode === option.value}
                      title={option.hint}
                      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                        selected.mode === option.value
                          ? "border-brand bg-brand/10 font-semibold text-brand"
                          : "border-hairline-strong hover:bg-accent/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        )}

        {addWarning && (
          <div className="flex items-start justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            <span>{addWarning}</span>
            <button
              onClick={() => setAddWarning(null)}
              aria-label="Dismiss warning"
              className="mt-0.5 shrink-0 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="mt-0.5 shrink-0 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="cta"
            onClick={exportPdf}
            disabled={busy || pages.length === 0}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
            ) : (
              <FileText className="h-4 w-4" strokeWidth={1.75} />
            )}
            Download PDF ({pages.length}{" "}
            {pages.length === 1 ? "page" : "pages"})
          </Button>
          {selected && (
            <Button
              variant="outline"
              onClick={downloadCurrentPage}
              disabled={busy}
            >
              Download this page as JPG
            </Button>
          )}
        </div>

        {resultBlob && (
          <WorkflowNextSteps
            getBlob={async () => resultBlob}
            filename="scan.pdf"
            assetKind="pdf"
            steps={pdfNextSteps("document-scanner")}
          />
        )}
      </CardContent>
    </ToolCard>
  );
}
