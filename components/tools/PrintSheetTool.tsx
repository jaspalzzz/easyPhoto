"use client";

import * as React from "react";
import { Download, Share2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell } from "./ImageToolShell";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

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
  scale: number
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

  const srcW = source.size.width;
  const srcH = source.size.height;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = MARGIN + col * (cellW + GAP);
    const y = MARGIN + row * (cellH + GAP);

    // Cover-fit the source image into the cell.
    const fit = Math.max(cellW / srcW, cellH / srcH);
    const drawW = srcW * fit;
    const drawH = srcH * fit;
    const ox = (cellW - drawW) / 2;
    const oy = (cellH - drawH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, cellW, cellH);
    ctx.clip();
    ctx.drawImage(source.image, x + ox, y + oy, drawW, drawH);
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

  React.useEffect(() => {
    track({ name: "tool_view", tool: "print-sheet" });
  }, []);

  const p = PAPER[paper];
  const layout = gridLayout(count, p.widthPx, p.heightPx);

  // Live preview — recompose a lightweight (640px-wide) sheet whenever the photo,
  // paper size, or count changes. Debounced so rapid toggles don't thrash, and
  // it shows immediately on first load (no "Generate" click needed).
  React.useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      try {
        const previewScale = 640 / PAPER[paper].widthPx;
        const canvas = composeSheet(source, paper, count, previewScale);
        if (!cancelled) setPreviewUrl(canvas.toDataURL("image/jpeg", 0.85));
      } catch (e) {
        console.error(e);
      }
    }, 80);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [source, paper, count]);

  const handleDownload = async () => {
    setJpgBusy(true);
    try {
      const canvas = composeSheet(source, paper, count, 1); // full 300 DPI
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
      const canvas = composeSheet(source, paper, count, 1); // full 300 DPI
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
      const canvas = composeSheet(source, paper, count, 1);
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
