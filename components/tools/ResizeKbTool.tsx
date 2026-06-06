"use client";

import * as React from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas } from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";

function Body({ source }: { source: ToolSource }) {
  const [targetKb, setTargetKb] = React.useState(200);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{
    url: string;
    bytes: number;
    width: number;
    height: number;
    quality: number;
    scale: number;
    underCap: boolean;
    blob: Blob;
  } | null>(null);

  const run = async () => {
    setBusy(true);
    try {
      const canvas = imageToCanvas(
        source.image,
        source.size.width,
        source.size.height
      );
      // Allow dimension downscaling (to 10%) so small KB targets are reachable.
      const res = await compressToCap(canvas, targetKb, { minScale: 0.1 });
      // Revoke the previous result URL before replacing it (avoid blob leaks).
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({
        url: URL.createObjectURL(res.blob),
        bytes: res.bytes,
        width: res.width,
        height: res.height,
        quality: res.quality,
        scale: res.scale,
        underCap: res.underCap,
        blob: res.blob,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <PreviewFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result?.url ?? source.url}
          alt="To resize"
          className="max-h-[320px] w-auto rounded"
        />
      </PreviewFrame>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Target size (KB)</span>
          <input
            type="number"
            min={5}
            value={targetKb}
            onChange={(e) => setTargetKb(Math.max(5, Number(e.target.value) || 0))}
            className="h-10 w-32 rounded-md border border-input bg-background px-3"
          />
        </label>
        <Button onClick={run} disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Compress to size"
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-2 rounded-md border p-3 text-sm">
          <p>
            Result: <strong>{formatKb(result.bytes)}</strong> ·{" "}
            {result.width}×{result.height}px · quality{" "}
            {result.quality.toFixed(2)}
            {result.scale < 1 ? ` · resized to fit` : ""}
          </p>
          {!result.underCap && (
            <p className="text-amber-700">
              Couldn&apos;t get under {targetKb} KB even at minimum quality — this
              is the smallest achievable. Try a lower target or smaller image.
            </p>
          )}
          <Button
            size="sm"
            onClick={() => downloadBlob(result.blob, `resized-${targetKb}kb.jpg`)}
          >
            <Download className="h-4 w-4" /> Download JPG
          </Button>
        </div>
      )}
    </div>
  );
}

export function ResizeKbTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
