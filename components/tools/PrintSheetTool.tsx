"use client";

import * as React from "react";
import { WORKFLOW_PHOTO_KINDS } from "@/lib/workflowHandoff";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Download, Share2, FileDown, Crop, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell } from "./ImageToolShell";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";
import type { CropRect } from "@/lib/headPositioning";
import { PAPER_DIMENSIONS, sheetPlacements } from "@/lib/printSheet";
import { setBlobDensityDpi } from "@/lib/jpegDensity";
import { SupportInline } from "@/components/site/SupportInline";

/** Per-photo refinements applied before tiling: an optional crop sub-rect (in
 *  source pixels) plus brightness/contrast as percentages (100 = unchanged). */
interface SheetAdjust {
  cropRect: CropRect | null;
  brightness: number;
  contrast: number;
}

const NO_ADJUST: SheetAdjust = { cropRect: null, brightness: 100, contrast: 100 };

type PaperSize = "a4" | "a5" | "4x6" | "5x6" | "4x4";
type Count = 4 | 6 | 8 | "fill";
type PhotoSize = "35x45" | "51x51" | "fit";

const PAPER: Record<PaperSize, { label: string }> = {
  a4:  { label: "A4 (210×297 mm)" },
  a5:  { label: "A5 (148×210 mm)" },
  "4x6": { label: "4×6 inch" },
  "5x6": { label: "5×6 inch" },
  "4x4": { label: "4×4 inch" },
};

const PAPER_SIZES = Object.keys(PAPER) as PaperSize[];

/**
 * Physical photo size printed on the sheet. The tool used to shrink each photo
 * to fill (paper ÷ count), so "6 on A4" printed 73×94 mm photos — nowhere near
 * passport size. Fixed sizes print at the exact millimetres; "fit" keeps the
 * old fill-the-grid behaviour for anyone who wants larger prints.
 */
const PHOTO_SIZES: Record<PhotoSize, { label: string; hint: string; mm: { width: number; height: number } | null }> = {
  "35x45": { label: "35 × 45 mm", hint: "Indian passport, exam & most visa forms", mm: { width: 35, height: 45 } },
  "51x51": { label: "2 × 2 inch", hint: "US passport & visa (50.8 × 50.8 mm)", mm: { width: 50.8, height: 50.8 } },
  fit:     { label: "Fill the grid", hint: "No fixed size — photos fill the paper", mm: null },
};

const PHOTO_SIZE_KEYS = Object.keys(PHOTO_SIZES) as PhotoSize[];

const COUNTS: Count[] = [4, 6, 8, "fill"];

const DPI = 300;
const PX_PER_MM = DPI / 25.4;
// Sheet margin and gap between photos, in mm.
const MARGIN_MM = 5;
const GAP_MM = 2;

// Legacy fill-the-grid mode, in pixels at 300 DPI.
const GAP = Math.round(GAP_MM * PX_PER_MM);
const MARGIN = Math.round(MARGIN_MM * PX_PER_MM);

// Both grid orientations per count (e.g. 8 as 2×4 or 4×2) — which one wastes
// less paper depends on how the resulting cell shape matches the source
// photo's aspect ratio, so gridLayout picks between them per-photo rather
// than always taking the first entry.
const ORIENTATIONS: Record<4 | 6 | 8, Array<{ cols: number; rows: number }>> = {
  4: [{ cols: 2, rows: 2 }],
  6: [
    { cols: 2, rows: 3 },
    { cols: 3, rows: 2 },
  ],
  8: [
    { cols: 2, rows: 4 },
    { cols: 4, rows: 2 },
  ],
};

/** Sheet size in whole pixels at 300 DPI for a sheet in mm. */
function sheetPx(sheetMm: { w: number; h: number }) {
  return { w: Math.round(sheetMm.w * PX_PER_MM), h: Math.round(sheetMm.h * PX_PER_MM) };
}

/** Fraction of a cell's area the photo actually covers once contain-fit — the
 *  rest is the white padding a print shop pays paper for and cuts away. */
function cellUtilization(cellW: number, cellH: number, photoAspect: number): number {
  if (cellW <= 0 || cellH <= 0) return 0;
  const fit = Math.min(cellW / photoAspect, cellH);
  const drawW = photoAspect * fit;
  const drawH = fit;
  return (drawW * drawH) / (cellW * cellH);
}

function gridLayout(
  count: 4 | 6 | 8,
  paperW: number,
  paperH: number,
  photoAspect: number
): { cols: number; rows: number; cellW: number; cellH: number } {
  let best: { cols: number; rows: number; cellW: number; cellH: number; score: number } | null = null;
  for (const c of ORIENTATIONS[count]) {
    const cellW = Math.floor((paperW - 2 * MARGIN - (c.cols - 1) * GAP) / c.cols);
    const cellH = Math.floor((paperH - 2 * MARGIN - (c.rows - 1) * GAP) / c.rows);
    const score = cellUtilization(cellW, cellH, photoAspect);
    if (!best || score > best.score) best = { ...c, cellW, cellH, score };
  }
  // ORIENTATIONS covers every Count value, so best is always set.
  const { cols, rows, cellW, cellH } = best!;
  return { cols, rows, cellW, cellH };
}

/** Source rectangle to draw, after the user's crop and (for a fixed print
 *  size) a centred cover-crop to that size's aspect ratio. */
function sourceRect(
  source: import("./ImageToolShell").ToolSource,
  adjust: SheetAdjust,
  targetAspect: number | null
): { sx: number; sy: number; sw: number; sh: number; trimmed: boolean } {
  const cr = adjust.cropRect;
  let sx = cr ? cr.sx : 0;
  let sy = cr ? cr.sy : 0;
  let sw = cr ? cr.sw : source.size.width;
  let sh = cr ? cr.sh : source.size.height;
  if (!targetAspect) return { sx, sy, sw, sh, trimmed: false };
  const aspect = sw / sh;
  const trimmed = Math.abs(aspect - targetAspect) / targetAspect > 0.02;
  if (aspect > targetAspect) {
    const nw = sh * targetAspect;
    sx += (sw - nw) / 2;
    sw = nw;
  } else if (aspect < targetAspect) {
    const nh = sw / targetAspect;
    sy += (sh - nh) / 2;
    sh = nh;
  }
  return { sx, sy, sw, sh, trimmed };
}

interface SheetPlan {
  /** Sheet size in px at 300 DPI. */
  sheet: { w: number; h: number };
  /** Photo boxes in px at 300 DPI. */
  boxes: { x: number; y: number; w: number; h: number }[];
  /** Copies that fit on the paper (fixed sizes); count otherwise. */
  capacity: number;
  cols: number;
  rows: number;
  /** Contain-fit into each box (fill mode) vs exact cover-fit (fixed sizes). */
  contain: boolean;
}

function planSheet(paper: PaperSize, size: PhotoSize, count: Count, photoAspect: number): SheetPlan {
  const photoMm = PHOTO_SIZES[size].mm;
  if (photoMm) {
    const { layout, placements } = sheetPlacements(photoMm, {
      paperSize: paper,
      marginMm: MARGIN_MM,
      gapMm: GAP_MM,
      copies: count === "fill" ? undefined : count,
    });
    const w = photoMm.width * PX_PER_MM;
    const h = photoMm.height * PX_PER_MM;
    return {
      sheet: sheetPx(layout.sheet),
      boxes: placements.map((p) => ({ x: p.x * PX_PER_MM, y: p.y * PX_PER_MM, w, h })),
      capacity: layout.capacity,
      cols: layout.cols,
      rows: layout.rows,
      contain: false,
    };
  }
  // Fill-the-grid: the photo shrinks to fit paper ÷ count.
  const n: 4 | 6 | 8 = count === "fill" ? 8 : count;
  const sheet = sheetPx(PAPER_DIMENSIONS[paper]);
  const { cols, rows, cellW, cellH } = gridLayout(n, sheet.w, sheet.h, photoAspect);
  const boxes = Array.from({ length: n }, (_, i) => ({
    x: MARGIN + (i % cols) * (cellW + GAP),
    y: MARGIN + Math.floor(i / cols) * (cellH + GAP),
    w: cellW,
    h: cellH,
  }));
  return { sheet, boxes, capacity: n, cols, rows, contain: true };
}

/**
 * Compose the print sheet onto a canvas. `scale` lets the same layout math drive
 * both a cheap live preview (scale < 1, fast) and the full-resolution export
 * (scale = 1, true 300 DPI) — so what you see is exactly what downloads.
 */
function composeSheet(
  source: import("./ImageToolShell").ToolSource,
  paper: PaperSize,
  size: PhotoSize,
  count: Count,
  scale: number,
  adjust: SheetAdjust = NO_ADJUST
): HTMLCanvasElement {
  const photoMm = PHOTO_SIZES[size].mm;
  const src = sourceRect(source, adjust, photoMm ? photoMm.width / photoMm.height : null);
  const plan = planSheet(paper, size, count, src.sw / src.sh);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(plan.sheet.w * scale));
  canvas.height = Math.max(1, Math.round(plan.sheet.h * scale));
  const ctx = canvas.getContext("2d")!;
  // Draw in full-resolution coordinates; the scale transform maps them down.
  ctx.scale(scale, scale);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, plan.sheet.w, plan.sheet.h);

  const filterStr =
    adjust.brightness !== 100 || adjust.contrast !== 100
      ? `brightness(${adjust.brightness}%) contrast(${adjust.contrast}%)`
      : "none";

  for (const box of plan.boxes) {
    // Fixed sizes: the (aspect-matched) source fills the exact mm box. Fill
    // mode: contain-fit so the whole photo stays visible — cells aren't always
    // the photo's shape, and a cover-fit there would crop off the face.
    const fit = plan.contain ? Math.min(box.w / src.sw, box.h / src.sh) : 1;
    const drawW = plan.contain ? src.sw * fit : box.w;
    const drawH = plan.contain ? src.sh * fit : box.h;
    const ox = (box.w - drawW) / 2;
    const oy = (box.h - drawH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.w, box.h);
    ctx.clip();
    // Brightness/contrast live in the saved state so the cut-guide stroke
    // below (after restore) is never tinted.
    ctx.filter = filterStr;
    ctx.drawImage(source.image, src.sx, src.sy, src.sw, src.sh, box.x + ox, box.y + oy, drawW, drawH);
    ctx.restore();

    // Thin cut-guide around each photo.
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = Math.max(1, 1 / scale);
    ctx.strokeRect(box.x, box.y, box.w, box.h);
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
  const [size, setSize] = React.useState<PhotoSize>("35x45");
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
  const photoMm = PHOTO_SIZES[size].mm;
  const src = sourceRect(source, adjust, photoMm ? photoMm.width / photoMm.height : null);
  const plan = planSheet(paper, size, count, src.sw / src.sh);
  // Copies that fit this paper at the chosen size ("Fill sheet" = all of them).
  const capacity = photoMm ? planSheet(paper, size, "fill", 1).capacity : 8;
  const placed = plan.boxes.length;
  const countFits = (n: Count) => n === "fill" || !photoMm || n <= capacity;

  // Keep the selected count valid when paper/size changes shrink capacity.
  React.useEffect(() => {
    if (!photoMm && count === "fill") setCount(6); // "Fill sheet" only exists for fixed sizes
    else if (!countFits(count)) setCount("fill");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper, size]);

  const fileBase = `photo-sheet-${photoMm ? `${photoMm.width}x${photoMm.height}mm-` : ""}${placed}up-${paper}`;

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
        const previewScale = 640 / planSheet(paper, size, count, 1).sheet.w;
        const canvas = composeSheet(source, paper, size, count, previewScale, adjust);
        if (!cancelled) setPreviewUrl(canvas.toDataURL("image/jpeg", 0.85));
      } catch (e) {
        console.error(e);
      }
    }, 80);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [source, paper, size, count, adjust]);

  const handleDownload = async () => {
    setJpgBusy(true);
    try {
      const canvas = composeSheet(source, paper, size, count, 1, adjust); // full 300 DPI
      // Tag 300 DPI so "print at actual size" reproduces the true mm sizes.
      const blob = await setBlobDensityDpi(await canvasToBlob(canvas), DPI);
      downloadBlob(blob, `${fileBase}.jpg`);
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
      const canvas = composeSheet(source, paper, size, count, 1, adjust); // full 300 DPI
      const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
      const { jsPDF } = await import("jspdf");
      // px @ 300 DPI → mm, so the page is the true physical paper size.
      const wMm = canvas.width / PX_PER_MM;
      const hMm = canvas.height / PX_PER_MM;
      const doc = new jsPDF({ unit: "mm", format: [wMm, hMm], orientation: wMm > hMm ? "landscape" : "portrait" });
      doc.addImage(dataUrl, "JPEG", 0, 0, wMm, hMm);
      downloadBlob(doc.output("blob"), `${fileBase}.pdf`);
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
      const canvas = composeSheet(source, paper, size, count, 1, adjust);
      const blob = await setBlobDensityDpi(await canvasToBlob(canvas), DPI);
      await shareFile(blob, `${fileBase}.jpg`, "Photo print sheet");
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
            {p.label} · {placed} photos
            {photoMm ? ` · each ${photoMm.width}×${photoMm.height} mm` : ` · ${plan.cols}×${plan.rows}`}
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
              // Lock the crop to the printed photo's shape so nothing is trimmed.
              aspectRatio={photoMm ? photoMm.width / photoMm.height : NaN}
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
              300 DPI · print at &ldquo;actual size&rdquo; (100%, not &ldquo;fit to page&rdquo;) · grey guide
              lines mark the cut edges
            </p>
            {src.trimmed && (
              <p role="status" className="text-xs text-amber-700 dark:text-amber-400">
                Your photo isn&apos;t {PHOTO_SIZES[size].label} in shape, so its edges are trimmed to fit.
                Use &ldquo;Crop photo&rdquo; to choose the framing.
              </p>
            )}
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
          <legend className="eyebrow mb-2 block text-xs">Photo size</legend>
          <div className="flex flex-col gap-2">
            {PHOTO_SIZE_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSize(k)}
                aria-pressed={size === k}
                className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  size === k
                    ? "border-brand bg-brand text-white"
                    : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                }`}
              >
                <span className="block font-medium">{PHOTO_SIZES[k].label}</span>
                <span className={`block text-xs ${size === k ? "text-white/85" : "text-muted-foreground"}`}>
                  {PHOTO_SIZES[k].hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow mb-2 block text-xs">Number of photos</legend>
          <div className="flex flex-wrap gap-2">
            {COUNTS.filter((n) => n !== "fill" || photoMm).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                disabled={!countFits(n)}
                aria-pressed={count === n}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  count === n
                    ? "border-brand bg-brand text-white"
                    : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                }`}
              >
                {n === "fill" ? `Fill sheet (${capacity})` : `${n} photos`}
              </button>
            ))}
          </div>
          {photoMm && (
            <p className="mt-2 text-xs text-muted-foreground">
              Up to {capacity} fit on {p.label} at {PHOTO_SIZES[size].label}.
            </p>
          )}
        </fieldset>

        <fieldset className="border-t border-hairline pt-4">
          <legend className="eyebrow mb-2 flex w-full items-center justify-between text-xs">
            <span>Adjust photo</span>
            {adjusted && (
              <button
                type="button"
                onClick={resetAdjust}
                className="inline-flex items-center gap-1 text-xs font-medium normal-case tracking-normal text-muted-foreground hover:text-foreground"
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
                <span className="font-semibold uppercase tracking-wide text-xs">Brightness</span>
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
                <span className="font-semibold uppercase tracking-wide text-xs">Contrast</span>
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
          <p className="mt-2 text-xs leading-snug text-muted-foreground">
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
          <SupportInline />
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
    <ImageToolShell acceptedWorkflowKinds={WORKFLOW_PHOTO_KINDS} uploaderTitle="passport photo" uploaderHint="Upload any photo — we'll tile it">
      {(source, reset) => <Body source={source} reset={reset} />}
    </ImageToolShell>
  );
}
