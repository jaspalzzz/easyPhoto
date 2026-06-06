"use client";

import * as React from "react";
import { Download, Printer, Globe, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { effectivePrintMm, type CountrySpec } from "@/lib/countrySpecs";
import type { Preset } from "@/store/useToolStore";
import { compressToCap, encode } from "@/lib/compress";
import { generatePrintSheet, maxCopiesPerSheet } from "@/lib/printSheet";
import { downloadBlob as download } from "@/lib/download";
import { formatKb } from "@/lib/utils";

interface ExportPanelProps {
  spec: CountrySpec;
  print: Preset;
  digital: Preset;
}

export function ExportPanel({ spec, print, digital }: ExportPanelProps) {
  const [busy, setBusy] = React.useState<string | null>(null);
  const [digitalInfo, setDigitalInfo] = React.useState<string | null>(null);

  const capKb = spec.digital.fileSizeKb?.max ?? null;
  const base = spec.id;
  const photoMm = effectivePrintMm(spec);
  const sheetCopies = maxCopiesPerSheet(photoMm);

  const onPrintJpg = async () => {
    setBusy("print-jpg");
    try {
      const blob = await encode(print.canvas, "image/jpeg", 0.95);
      download(blob, `${base}-passport-print-${print.dpi}dpi.jpg`);
    } finally {
      setBusy(null);
    }
  };

  const onPrintPng = async () => {
    setBusy("print-png");
    try {
      const blob = await encode(print.canvas, "image/png");
      download(blob, `${base}-passport-print-${print.dpi}dpi.png`);
    } finally {
      setBusy(null);
    }
  };

  const onSheet = async () => {
    setBusy("sheet");
    try {
      const blob = await generatePrintSheet({
        canvas: print.canvas,
        photoMm,
        copies: sheetCopies,
      });
      download(blob, `${base}-passport-print-sheet-4x6.pdf`);
    } finally {
      setBusy(null);
    }
  };

  const onDigital = async () => {
    setBusy("digital");
    setDigitalInfo(null);
    try {
      if (capKb) {
        const res = await compressToCap(digital.canvas, capKb, {
          minDimensions: spec.digital.pxMin,
        });
        download(res.blob, `${base}-passport-digital.jpg`);
        const downscaled =
          res.scale < 1 ? `, resized to ${res.width}×${res.height}px` : "";
        setDigitalInfo(
          res.underCap
            ? `${formatKb(res.bytes)} (under ${capKb} KB cap, quality ${res.quality.toFixed(2)}${downscaled})`
            : `⚠ ${formatKb(res.bytes)} — can't get under the ${capKb} KB cap without going below the required ${spec.digital.pxMin?.width}×${spec.digital.pxMin?.height}px minimum. Use a simpler background or check the portal's limits.`
        );
      } else {
        const blob = await encode(digital.canvas, "image/jpeg", 0.92);
        download(blob, `${base}-passport-digital.jpg`);
        setDigitalInfo(`${formatKb(blob.size)} (no portal size cap on record)`);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Download</h3>

      <div className="rounded-md border p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Printer className="h-4 w-4" /> Print
          <span className="font-normal text-muted-foreground">
            {print.result.output.width}×{print.result.output.height}px ·{" "}
            {print.dpi} DPI · {photoMm.width}×{photoMm.height}mm
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onPrintJpg} disabled={busy !== null}>
            <Download className="h-4 w-4" /> JPG
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onPrintPng}
            disabled={busy !== null}
          >
            <Download className="h-4 w-4" /> PNG
          </Button>
          {sheetCopies > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSheet}
              disabled={busy !== null}
            >
              <LayoutGrid className="h-4 w-4" /> 4×6″ sheet ({sheetCopies})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Globe className="h-4 w-4" /> Online upload
          <span className="font-normal text-muted-foreground">
            {digital.result.output.width}×{digital.result.output.height}px ·{" "}
            {digital.dpi} DPI
            {capKb ? ` · ≤ ${capKb} KB` : ""}
          </span>
        </div>
        <Button size="sm" onClick={onDigital} disabled={busy !== null}>
          <Download className="h-4 w-4" /> JPG for upload
        </Button>
        {digitalInfo && (
          <p className="mt-2 text-xs text-muted-foreground">{digitalInfo}</p>
        )}
      </div>
    </div>
  );
}
