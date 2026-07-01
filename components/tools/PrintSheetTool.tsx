"use client";

import * as React from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Download, Share2, FileDown, Crop, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell } from "./ImageToolShell";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";
import type { CropRect } from "@/lib/headPositioning";

/** Per-photo refinements applied before tiling: an optional crop sub-rect (in
 *  source pixels) plus brightness/contrast as percentages (100 = unchanged). */
interface SheetAdjust {
  cropRect: CropRect | null;
  brightness: number;
  contrast: number;
}

const NO_ADJUST: SheetAdjust = { cropRect: null, brightness: 100, contrast: 100 };

type PaperSize = "a4" | "a5" | "4x6" | "5x6" | "4x4";
type Count = 4 | 6 | 8;

// All dimensions in pixels at 300 DPI (print-shop standard).
const PAPER: Record<PaperSize, { label: string; widthPx: number; heightPx: number }> = {
  a4:  { label: "A4 (210×297 mm)", widthPx: 2480, heightPx: 3508 },
  a5:  { label: "A5 (148×210 mm)", widthPx: 1748, heightPx: 2480 },
  "4x6": { label: "4×6 inch",      widthPx: 1200, heightPx: 1800 },
  "5x6": { label: "5×6 inch",      widthPx: 1500, heightPx: 1800 },
  "4x4": { label: "4×4 inch",      widthPx: 1200, heightPx: 1200 },
};

const PAPER_SIZES = Object.keys(PAPER) as PaperSize[];

const COUNTS: Count[] = [4, 6, 8];

// Gap between photos in pixels (at 300 DPI, 2 mm = ~24 px)
const GAP = 24;
// Margin around the sheet in pixels (~5 mm = 59 px)
const MARGIN = 59;

function gridLayout(
  count: Count,
  paperW: number,
  paperH: number
): { cols: number; rows: number; cellW: number; cellH: number } {
  const candidates: Array<{ cols: number; rows: number }> = [
    { cols: 2, rows: 2 },
    { cols: 2, rows: 3 },
    { cols: 2, rows: 4 },
    { cols: 3, rows: 2 },
    { cols: 4, rows: 2 },
  ];
  for (const c of candidates) {
    if (c.cols * c.rows === count) {
      const cellW = Math.floor((paperW - 2 * MARGIN - (c.cols - 1) * GAP) / c.cols);
      const cellH = Math.floor((paperH - 2 * MARGIN - (c.rows - 1) * GAP) / c.rows);
      return { ...c, cellW, cellH };
    }
  }
  // fallback 2×2
  const cols = 2, rows = Math.ceil(count / 2);
  const cellW = Math.floor((paperW - 2 * MARGIN - (cols - 1) * GAP) / cols);
  const cellH = Math.floor((paperH - 2 * MARGIN - (rows - 1) * GAP) / rows);
  return { cols, rows, cellW, cellH };
}

/**
 * Compose the print sheet onto a canvas. `scale` lets the same layout math drive
 * both a cheap live preview (scale < 1, fast) and the full-resolution export
 * (scale = 1, true 300 DPI) — so what you see is exactly what downloads.
 */
function composeSheet(
  source: import("./ImageToolShell").ToolSource,
  paper: PaperSize,
  count: Count,
  scale: number,
  adjust: SheetAdjust = NO_ADJUST
): HTMLCanvasElement {
  const p = PAPER[paper];
  const { cols, rows, cellW, cellH } = gridLayout(count, p.widthPx, p.heightPx);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(p.widthPx * scale));
  canvas.height = Math.max(1, Math.round(p.heightPx * scale));
  const ctx = canvas.getContext("2d")!;
  // Draw in full-resolution coordinates; the scale transform maps them down.
  ctx.scale(scale, scale);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, p.widthPx, p.heightPx);

  // Crop sub-rect (source px) drives both the cover-fit math and the draw
  // source rectangle, so every tile shows exactly the cropped framing.
  const cr = adjust.cropRect;
  const sx0 = cr ? cr.sx : 0;
  const sy0 = cr ? cr.sy : 0;
  const srcW = cr ? cr.sw : source.size.width;
  const srcH = cr ? cr.sh : source.size.height;
  const filterStr =
    adjust.brightness !== 100 || adjust.contrast !== 100
      ? `brightness(${adjust.brightness}%) contrast(${adjust.contrast}%)`
      : "none";

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = MARGIN + col * (cellW + GAP);
    const y = MARGIN + row * (cellH + GAP);

    // Contain-fit the (cropped) source image into the cell — the whole photo
    // must stay visible. Cells aren't always the photo's aspect ratio (e.g. a
    // square paper split into a 2x3 grid gives wide, non-square cells), and a
    // cover-fit there would crop off the top/bottom of the face to fill the
    // cell. Contain-fit only ever adds white padding, never trims the photo.
    const fit = Math.min(cellW / srcW, cellH / srcH);
    const drawW = srcW * fit;
    const drawH = srcH * fit;
    const ox = (cellW - drawW) / 2;
    const oy = (cellH - drawH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, cellW, cellH);
    ctx.clip();
    // Brightness/contrast live in the saved state so the cut-guide stroke
    // below (after restore) is never tinted.
    ctx.filter = filterStr;
    ctx.drawImage(
      source.image,
      sx0, sy0, srcW, srcH,
      x + ox, y + oy, drawW, drawH
    );
    ctx.restore();

    // Thin cut-guide around each cell.
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = Math.max(1, 1 / scale);
    ctx.strokeRect(x, y, cellW, cellH);
  }

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/jpeg", 0.94)
  );
}

function Body({ source, reset }: { source: import("./ImageToolShell").ToolSource; reset: () => void }) {
  const [paper, setPaper] = React.useState<PaperSize>("a4");
  const [count, setCount] = React.useState<Count>(6);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = React.useState(false);
  const [jpgBusy, setJpgBusy] = React.useState(false);

  // Per-photo refinements applied before tiling.
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);
  const [cropRect, setCropRect] = React.useState<CropRect | null>(null);
  const [cropping, setCropping] = React.useState(false);
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const adjust = React.useMemo<SheetAdjust>(
    () => ({ cropRect, brightness, contrast }),
    [cropRect, brightness, contrast]
  );
  const adjusted = !!cropRect || brightness !== 100 || contrast !== 100;

  React.useEffect(() => {
    track({ name: "tool_view", tool: "print-sheet" });
  }, []);

  const p = PAPER[paper];
  const layout = gridLayout(count, p.widthPx, p.heightPx);

  const applyCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const d = cropper.getData(true); // rounded, natural-image coordinates
    // Guard against a degenerate / out-of-bounds selection.
    const sw = Math.max(1, Math.min(d.width, source.size.width));
    const sh = Math.max(1, Math.min(d.height, source.size.height));
    const sx = Math.min(Math.max(0, d.x), source.size.width - sw);
    const sy = Math.min(Math.max(0, d.y), source.size.height - sh);
    setCropRect({ sx, sy, sw, sh });
    setCropping(false);
  };

  const resetAdjust = () => {
    setCropRect(null);
    setBrightness(100);
    setContrast(100);
  };

  // Live preview — recompose a lightweight (640px-wide) sheet whenever the photo,
  // paper size, or count changes. Debounced so rapid toggles don't thrash, and
  // it shows immediately on first load (no "Generate" click needed).
  React.useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      try {
        const previewScale = 640 / PAPER[paper].widthPx;
        const canvas = composeSheet(source, paper, count, previewScale, adjust);
        if (!cancelled) setPreviewUrl(canvas.toDataURL("image/jpeg", 0.85));
      } catch (e) {
        console.error(e);
      }
    }, 80);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [source, paper, count, adjust]);

  const handleDownload = async () => {
    setJpgBusy(true);
    try {
      const canvas = composeSheet(source, paper, count, 1, adjust); // full 300 DPI
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob, `photo-sheet-${count}up-${paper}.jpg`);
      track({ name: "download", tool: "print-sheet", format: "jpg" });
    } catch (e) {
      console.error(e);
      track({ name: "tool_failure", tool: "print-sheet", device: deviceClass(), reason: "render-error" });
    } finally {
      setJpgBusy(false);
    }
  };

  const handleDownloadPdf = async () => {
    setPdfBusy(true);
    try {
      const canvas = composeSheet(source, paper, count, 1, adjust); // full 300 DPI
      const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
      const { jsPDF } = await import("jspdf");
      // px @ 300 DPI → mm, so the page is the true physical paper size.
      const wMm = (p.widthPx / 300) * 25.4;
      const hMm = (p.heightPx / 300) * 25.4;
      const doc = new jsPDF({ unit: "mm", format: [wMm, hMm], orientation: "portrait" });
      doc.addImage(dataUrl, "JPEG", 0, 0, wMm, hMm);
      downloadBlob(doc.output("blob"), `photo-sheet-${count}up-${paper}.pdf`);
      track({ name: "download", tool: "print-sheet", format: "pdf" });
    } catch (e) {
      console.error(e);
      track({ name: "tool_failure", tool: "print-sheet", device: deviceClass(), reason: "pdf-error" });
    } finally {
      setPdfBusy(false);
    }
  };

  const handleShare = async () => {
    try {
      const canvas = composeSheet(source, paper, count, 1, adjust);
      const blob = await canvasToBlob(canvas);
      await shareFile(blob, `photo-sheet-${count}up.jpg`, "Photo print sheet");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow text-xs">Preview</span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {p.label} · {count} photos · {layout.cols}×{layout.rows}
          </span>
        </div>
        {cropping ? (
          <div className="space-y-3 rounded-xl border border-hairline bg-accent/20 p-4">
            <p className="text-xs text-muted-foreground">
              Drag to choose what appears in every photo on the sheet.
            </p>
            <Cropper
              ref={cropperRef}
              src={source.url}
              style={{ height: "min(440px, 56vh)", width: "100%" }}
              viewMode={1}
              dragMode="move"
              autoCropArea={1}
              background={false}
              responsive
              checkOrientation={false}
              guides
              // Seed the box from any existing crop so re-cropping is additive.
              ready={() => {
                const cropper = cropperRef.current?.cropper;
                if (cropper && cropRect) {
                  cropper.setData({
                    x: cropRect.sx,
                    y: cropRect.sy,
                    width: cropRect.sw,
                    height: cropRect.sh,
                  });
                }
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="cta" onClick={applyCrop}>
                <Check className="h-4 w-4" strokeWidth={1.75} /> Apply crop
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCropping(false)}>
                <X className="h-4 w-4" strokeWidth={1.75} /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center rounded-xl border border-hairline bg-accent/20 p-4">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={`Print sheet preview — ${count} photos on ${p.label}`}
                  className="ep-fade-in max-h-[440px] w-auto rounded-md bg-white object-contain shadow-sm ring-1 ring-hairline"
                />
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center text-sm text-muted-foreground">
                  Building preview…
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              300 DPI · print-ready · grey guide lines mark the cut edges
            </p>
          </>
        )}
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="space-y-5">
        <fieldset>
          <legend className="eyebrow mb-2 block text-xs">Paper size</legend>
          <div className="flex flex-wrap gap-2">
            {PAPER_SIZES.map((ps) => (
              <button
                key={ps}
                onClick={() => setPaper(ps)}
                aria-pressed={paper === ps}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  paper === ps
                    ? "border-brand bg-brand text-white"
                    : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                }`}
              >
                {PAPER[ps].label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow mb-2 block text-xs">Number of photos</legend>
          <div className="flex flex-wrap gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  count === n
                    ? "border-brand bg-brand text-white"
                    : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                }`}
              >
                {n} photos
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-hairline pt-4">
          <legend className="eyebrow mb-2 flex w-full items-center justify-between text-xs">
            <span>Adjust photo</span>
            {adjusted && (
              <button
                type="button"
                onClick={resetAdjust}
                className="inline-flex items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" strokeWidth={1.75} /> Reset
              </button>
            )}
          </legend>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setCropping(true)}
            disabled={cropping}
          >
            <Crop className="h-4 w-4" strokeWidth={1.75} />
            {cropRect ? "Re-crop photo" : "Crop photo"}
          </Button>

          <div className="mt-3 space-y-3">
            <label className="block text-xs">
              <span className="mb-1 flex items-center justify-between text-muted-foreground">
                <span className="font-semibold uppercase tracking-wide text-[10px]">Brightness</span>
                <span className="tabular-nums">{brightness}%</span>
              </span>
              <input
                type="range"
                min={80}
                max={120}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full cursor-pointer accent-brand"
                aria-label="Brightness"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 flex items-center justify-between text-muted-foreground">
                <span className="font-semibold uppercase tracking-wide text-[10px]">Contrast</span>
                <span className="tabular-nums">{contrast}%</span>
              </span>
              <input
                type="range"
                min={80}
                max={120}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full cursor-pointer accent-brand"
                aria-label="Contrast"
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            Changes apply to every photo on the sheet. Keep edits light for ID
            photos — strong adjustments can get a submission rejected.
          </p>
        </fieldset>

        <div className="space-y-2 border-t border-hairline pt-4">
          <Button variant="cta" className="w-full" onClick={handleDownload} disabled={jpgBusy}>
            <Download className="h-4 w-4" strokeWidth={1.75} />
            {jpgBusy ? "Preparing…" : "Download JPG"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleDownloadPdf} disabled={pdfBusy}>
            <FileDown className="h-4 w-4" strokeWidth={1.75} />
            {pdfBusy ? "Building PDF…" : "Download PDF"}
          </Button>
          {"share" in navigator && (
            <Button variant="outline" className="w-full" onClick={handleShare}>
              <Share2 className="h-4 w-4" strokeWidth={1.75} />
              Share / WhatsApp
            </Button>
          )}
          <button
            onClick={reset}
            className="block w-full pt-1 text-center text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Use a different photo
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrintSheetTool() {
  return (
    <ImageToolShell uploaderTitle="passport photo" uploaderHint="Upload any photo — we'll tile it">
      {(source, reset) => <Body source={source} reset={reset} />}
    </ImageToolShell>
  );
}
