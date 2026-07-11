"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Printer, Globe, LayoutGrid, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { effectivePrintMm, type CountrySpec } from "@/lib/countrySpecs";
import type { Preset } from "@/store/useToolStore";
import { compressToCap, encode } from "@/lib/compress";
import { generatePrintSheet, getSheetLayout, maxCopiesPerSheet } from "@/lib/printSheet";
import { downloadBlob as download, shareFile } from "@/lib/download";
import { formatKb } from "@/lib/utils";

interface ExportPanelProps {
  spec: CountrySpec;
  print: Preset;
  digital: Preset;
}

export function ExportPanel({ spec, print, digital }: ExportPanelProps) {
  const [busy, setBusy] = React.useState<string | null>(null);
  const [digitalInfo, setDigitalInfo] = React.useState<
    { text: string; warn: boolean } | null
  >(null);

  // Print Sheet Customizer States
  const [paperSize, setPaperSize] = React.useState<"4x6" | "5x7" | "a4" | "letter">("4x6");
  const [marginMm, setMarginMm] = React.useState(4);
  const [gapMm, setGapMm] = React.useState(3);

  const capKb = spec.digital.fileSizeKb?.max ?? null;
  const base = spec.id;
  const photoMm = effectivePrintMm(spec);
  
  // Calculate dynamic capacity based on custom margins and size
  const maxCapacity = maxCopiesPerSheet(photoMm, { paperSize, marginMm, gapMm });
  const [copies, setCopies] = React.useState(() => maxCapacity);

  // Keep copies count locked to maximum capacity when layout size changes
  React.useEffect(() => {
    setCopies(maxCapacity);
  }, [maxCapacity]);

  // Live sheet-layout preview — same grid math generatePrintSheet() uses, so
  // what the user sees here matches the PDF exactly (not a rough approximation).
  const sheetLayout = React.useMemo(
    () => getSheetLayout(photoMm, { paperSize, marginMm, gapMm }),
    [photoMm.width, photoMm.height, paperSize, marginMm, gapMm]
  );
  const tileImageUrl = React.useMemo(
    () => print.canvas.toDataURL("image/jpeg", 0.7),
    [print.canvas]
  );

  // Tile positions in mm, centred on the sheet — mirrors generatePrintSheet()'s
  // placement loop exactly so the preview matches the downloaded PDF.
  const previewTiles = React.useMemo(() => {
    const { cols, rows, sheet } = sheetLayout;
    const pw = photoMm.width;
    const ph = photoMm.height;
    const blockW = cols * pw + (cols - 1) * gapMm;
    const blockH = rows * ph + (rows - 1) * gapMm;
    const startX = (sheet.w - blockW) / 2;
    const startY = (sheet.h - blockH) / 2;
    const tiles: { x: number; y: number; filled: boolean }[] = [];
    let placed = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tiles.push({
          x: startX + c * (pw + gapMm),
          y: startY + r * (ph + gapMm),
          filled: placed < copies,
        });
        placed++;
      }
    }
    return tiles;
  }, [sheetLayout, photoMm.width, photoMm.height, gapMm, copies]);

  // Scale the mm sheet down to a small on-screen preview (longer side ≈ 180px).
  const PREVIEW_MAX_PX = 180;
  const previewScale =
    PREVIEW_MAX_PX / Math.max(sheetLayout.sheet.w, sheetLayout.sheet.h);
  const previewWidthPx = sheetLayout.sheet.w * previewScale;
  const previewHeightPx = sheetLayout.sheet.h * previewScale;

  const onPrintJpg = async () => {
    setBusy("print-jpg");
    try {
      const blob = await encode(print.canvas, "image/jpeg", 0.95);
      download(blob, `${base}-passport-print-${print.dpi}dpi.jpg`, "passport-photo");
    } finally {
      setBusy(null);
    }
  };

  const onPrintPng = async () => {
    setBusy("print-png");
    try {
      const blob = await encode(print.canvas, "image/png");
      download(blob, `${base}-passport-print-${print.dpi}dpi.png`, "passport-photo");
    } finally {
      setBusy(null);
    }
  };

  const onSheet = async () => {
    if (copies < 1) return;
    setBusy("sheet");
    try {
      const blob = await generatePrintSheet({
        canvas: print.canvas,
        photoMm,
        copies,
        paperSize,
        marginMm,
        gapMm,
      });
      download(blob, `${base}-passport-${paperSize}-print-sheet.pdf`, "passport-photo");
    } finally {
      setBusy(null);
    }
  };

  const [digitalBlob, setDigitalBlob] = React.useState<Blob | null>(null);

  const onDigital = async () => {
    setBusy("digital");
    setDigitalInfo(null);
    try {
      if (capKb) {
        const res = await compressToCap(digital.canvas, capKb, {
          minDimensions: spec.digital.pxMin,
        });
        setDigitalBlob(res.blob);
        download(res.blob, `${base}-passport-digital.jpg`, "passport-photo");
        const downscaled =
          res.scale < 1 ? `, resized to ${res.width}×${res.height}px` : "";
        setDigitalInfo(
          res.underCap
            ? {
                text: `${formatKb(res.bytes)} (under ${capKb} KB cap, quality ${res.quality.toFixed(2)}${downscaled})`,
                warn: false,
              }
            : {
                text: `${formatKb(res.bytes)}. Can't get under the ${capKb} KB cap without going below the required ${spec.digital.pxMin?.width}×${spec.digital.pxMin?.height}px minimum. Use a simpler background or check the portal's limits.`,
                warn: true,
              }
        );
      } else {
        const blob = await encode(digital.canvas, "image/jpeg", 0.92);
        setDigitalBlob(blob);
        download(blob, `${base}-passport-digital.jpg`, "passport-photo");
        setDigitalInfo({
          text: `${formatKb(blob.size)} (no portal size cap on record)`,
          warn: false,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  const onShareDigital = async () => {
    if (!digitalBlob) return;
    await shareFile(digitalBlob, `${base}-passport-digital.jpg`, "Passport photo for upload");
  };

  return (
    <div className="space-y-3.5">
      <h3 className="eyebrow">Download</h3>

      {/* Online upload — first on mobile; this is the primary need for portal applicants */}
      <div className="rounded-md border border-hairline">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-2 text-[13px] font-semibold">
          <Globe className="h-4 w-4 text-ink-soft" strokeWidth={1.75} /> Online upload
        </div>
        <div className="px-3 py-3">
          <p className="spec mb-2.5 normal-case tracking-[0.06em]">
            {digital.result.output.width}×{digital.result.output.height}px ·{" "}
            {digital.dpi} dpi{capKb ? ` · ≤ ${capKb} KB` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              id="digital-jpg-download-btn"
              size="sm"
              onClick={onDigital}
              disabled={busy !== null}
              aria-busy={busy === "digital"}
              aria-label={busy === "digital" ? "Generating JPG for upload…" : "Download JPG for upload"}
            >
              {busy === "digital" ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : <Download className="h-4 w-4" strokeWidth={1.75} />} JPG for upload
            </Button>
            {digitalBlob && "share" in navigator && (
              <Button
                size="sm"
                variant="outline"
                onClick={onShareDigital}
                aria-label="Share JPG for upload"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.75} /> Share
              </Button>
            )}
          </div>
          {digitalInfo && (
            <p
              className={`mt-2 text-xs leading-relaxed ${
                digitalInfo.warn ? "text-amber-700" : "text-muted-foreground"
              }`}
            >
              {digitalInfo.text}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-md border border-hairline">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-2 text-[13px] font-semibold">
          <Printer className="h-4 w-4 text-ink-soft" strokeWidth={1.75} /> Print
        </div>
        <div className="px-3 py-3">
          <p className="spec mb-2.5 normal-case tracking-[0.06em]">
            {print.result.output.width}×{print.result.output.height}px ·{" "}
            {print.dpi} dpi · {photoMm.width}×{photoMm.height}mm
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              id="print-jpg-download-btn"
              size="sm"
              variant="outline"
              onClick={onPrintJpg}
              disabled={busy !== null}
              aria-busy={busy === "print-jpg"}
              aria-label={busy === "print-jpg" ? "Generating JPG…" : "Download JPG"}
            >
              {busy === "print-jpg" ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : <Download className="h-4 w-4" strokeWidth={1.75} />} JPG
            </Button>
            <Button
              id="print-png-download-btn"
              size="sm"
              variant="outline"
              onClick={onPrintPng}
              disabled={busy !== null}
              aria-busy={busy === "print-png"}
              aria-label={busy === "print-png" ? "Generating PNG…" : "Download PNG"}
            >
              {busy === "print-png" ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : <Download className="h-4 w-4" strokeWidth={1.75} />} PNG
            </Button>
          </div>
        </div>

        {/* Printable sheet customizer settings */}
        <div className="pt-3.5 pb-4 px-3 border-t border-hairline space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
            PDF Print Sheet Layout
          </span>

          {/* Live preview — mirrors generatePrintSheet()'s exact tile placement,
              so what's shown here is what the downloaded PDF looks like. */}
          <div className="flex justify-center rounded-md border border-hairline bg-accent/20 py-3">
            <div
              className="relative bg-white shadow-sm"
              style={{ width: previewWidthPx, height: previewHeightPx }}
            >
              {previewTiles.map((tile, i) => (
                <div
                  key={i}
                  className={
                    tile.filled
                      ? "absolute border border-dashed border-ink-faint/60 bg-cover bg-center"
                      : "absolute border border-dashed border-ink-faint/25"
                  }
                  style={{
                    left: tile.x * previewScale,
                    top: tile.y * previewScale,
                    width: photoMm.width * previewScale,
                    height: photoMm.height * previewScale,
                    backgroundImage: tile.filled ? `url(${tileImageUrl})` : undefined,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            {sheetLayout.cols}×{sheetLayout.rows} grid on{" "}
            {paperSize === "4x6" ? "4×6″" : paperSize === "5x7" ? "5×7″" : paperSize === "a4" ? "A4" : "Letter"} ·{" "}
            {copies} of {maxCapacity} slots used
          </p>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <label className="block">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">Paper Size</span>
              <select
                id="print-sheet-paper-size"
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as "4x6" | "5x7" | "a4" | "letter")}
                className="w-full rounded border border-hairline bg-background p-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="4x6">4×6″ Photo Sheet</option>
                <option value="5x7">5×7″ Photo Sheet</option>
                <option value="a4">A4 Page</option>
                <option value="letter">Letter Page</option>
              </select>
            </label>

            <label className="block">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">Copies ({copies})</span>
              <input
                id="print-sheet-copies-input"
                type="number"
                inputMode="numeric"
                min={1}
                max={maxCapacity}
                value={copies}
                onChange={(e) => setCopies(Math.max(1, Math.min(maxCapacity, Number(e.target.value) || 1)))}
                className="w-full rounded border border-hairline bg-background p-1 text-xs font-semibold font-mono focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <label className="block">
              <span className="text-muted-foreground block mb-0.5 text-[10px] uppercase font-semibold">Margin: {marginMm}mm</span>
              <input
                id="print-sheet-margin-slider"
                type="range"
                min={4}
                max={20}
                value={marginMm}
                onChange={(e) => setMarginMm(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </label>
            <label className="block">
              <span className="text-muted-foreground block mb-0.5 text-[10px] uppercase font-semibold">Gap: {gapMm}mm</span>
              <input
                id="print-sheet-gap-slider"
                type="range"
                min={0}
                max={10}
                value={gapMm}
                onChange={(e) => setGapMm(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </label>
          </div>

          {maxCapacity > 0 && (
            <Button
              id="print-sheet-pdf-download-btn"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5"
              onClick={onSheet}
              disabled={busy !== null}
              aria-busy={busy === "sheet"}
              aria-label={busy === "sheet" ? "Generating PDF Print Sheet…" : `Download PDF Print Sheet (${copies} copies)`}
            >
              {busy === "sheet" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
              ) : (
                <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.75} />
              )}
              Download PDF Print Sheet ({copies} copies)
            </Button>
          )}
        </div>
      </div>

      {/* Cross-promotion CTA */}
      <div className="rounded-md border border-hairline-strong bg-brand/5 p-3.5 text-xs space-y-1.5 mt-1.5">
        <span className="font-semibold text-brand block">Need a specific file size?</span>
        <p className="text-muted-foreground leading-normal">
          If your application portal has a strict file-size limit, compress this photo to an exact target (e.g., 20 KB or 50 KB) in one click.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Link
            id="promo-compress-20kb"
            href="/photo-resize-to-20kb/"
            className="inline-flex min-h-10 items-center rounded-md px-3 py-2 bg-card border border-hairline hover:bg-accent/50 font-medium text-xs text-foreground transition-colors"
          >
            Compress to 20 KB
          </Link>
          <Link
            id="promo-compress-50kb"
            href="/photo-resize-to-50kb/"
            className="inline-flex min-h-10 items-center rounded-md px-3 py-2 bg-card border border-hairline hover:bg-accent/50 font-medium text-xs text-foreground transition-colors"
          >
            Compress to 50 KB
          </Link>
          <Link
            id="promo-compress-custom"
            href="/tools/resize-kb/"
            className="inline-flex min-h-10 items-center rounded-md px-3 py-2 bg-card border border-hairline hover:bg-accent/50 font-medium text-xs text-brand transition-colors"
          >
            Custom Size
          </Link>
        </div>
      </div>
    </div>
  );
}
