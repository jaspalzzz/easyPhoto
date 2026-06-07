"use client";

import * as React from "react";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";

type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

function Body({ source }: { source: ToolSource }) {
  const [targetFormat, setTargetFormat] = React.useState<ImageFormat>("image/jpeg");
  const [quality, setQuality] = React.useState(0.92);
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<{
    url: string;
    blob: Blob;
    bytes: number;
    w: number;
    h: number;
    format: string;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const convert = async () => {
      setBusy(true);
      try {
        const canvas = imageToCanvas(source.image, source.size.width, source.size.height);
        
        // Flatten background to white if converting transparent image to Jpeg
        if (targetFormat === "image/jpeg") {
          const flatCanvas = document.createElement("canvas");
          flatCanvas.width = canvas.width;
          flatCanvas.height = canvas.height;
          const ctx = flatCanvas.getContext("2d")!;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(canvas, 0, 0);
          
          const blob = await canvasToBlob(flatCanvas, targetFormat, quality);
          if (cancelled) return;
          setOut({
            url: URL.createObjectURL(blob),
            blob,
            bytes: blob.size,
            w: flatCanvas.width,
            h: flatCanvas.height,
            format: "JPEG",
          });
        } else {
          const blob = await canvasToBlob(canvas, targetFormat, targetFormat === "image/webp" ? quality : undefined);
          if (cancelled) return;
          setOut({
            url: URL.createObjectURL(blob),
            blob,
            bytes: blob.size,
            w: canvas.width,
            h: canvas.height,
            format: targetFormat === "image/webp" ? "WebP" : "PNG",
          });
        }
      } catch (err) {
        console.error("Conversion error:", err);
      } finally {
        if (!cancelled) setBusy(false);
      }
    };

    convert();

    return () => {
      cancelled = true;
    };
  }, [source, targetFormat, quality]);

  // Clean up ObjectURL on unmount
  React.useEffect(() => {
    return () => {
      if (out?.url) URL.revokeObjectURL(out.url);
    };
  }, [out]);

  const onDownload = () => {
    if (!out) return;
    const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/png" ? "png" : "webp";
    downloadBlob(out.blob, `converted-image.${ext}`);
  };

  const getFormatLabel = (fmt: ImageFormat) => {
    if (fmt === "image/jpeg") return "JPG";
    if (fmt === "image/png") return "PNG";
    return "WebP";
  };

  return (
    <div className="space-y-4">
      <PreviewFrame>
        {busy || !out ? (
          <div className="flex flex-col items-center justify-center py-20 text-sm text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-brand" />
            <p className="mt-2">Converting format...</p>
          </div>
        ) : (
          <img
            src={out.url}
            alt="Converted"
            className="max-h-[300px] w-auto rounded-md object-contain"
          />
        )}
      </PreviewFrame>

      {/* Settings Row */}
      <div className="bg-paper p-4 border border-hairline rounded-md space-y-4">
        {/* Output Format Picker */}
        <div className="space-y-2">
          <span className="text-xs font-semibold eyebrow uppercase tracking-wider text-muted-foreground block">Convert to format</span>
          <div className="grid grid-cols-3 gap-2">
            {(["image/jpeg", "image/png", "image/webp"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
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
        </div>

        {/* Quality slider (only for JPG and WebP) */}
        {targetFormat !== "image/png" && (
          <label className="block text-sm">
            <span className="mb-1 flex items-center justify-between">
              <span className="eyebrow">Compression Quality</span>
              <span className="font-mono text-xs text-brand font-semibold">{Math.round(quality * 100)}%</span>
            </span>
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.01}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              Lower quality reduces file size; higher quality retains sharp details.
            </span>
          </label>
        )}
      </div>

      {out && !busy && (
        <div className="rounded-md border border-hairline bg-paper p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Result format: <strong className="text-foreground text-sm">{out.format}</strong></span>
            <span>Size: <strong className="text-foreground text-sm">{formatKb(out.bytes)}</strong></span>
            <span>Dimensions: <strong className="text-foreground text-sm">{out.w}×{out.h}px</strong></span>
          </div>

          <Button variant="cta" className="w-full" onClick={onDownload}>
            <Download className="h-4 w-4" /> Download converted {getFormatLabel(targetFormat)}
          </Button>
        </div>
      )}
    </div>
  );
}

export function FormatConverterTool() {
  return (
    <ImageToolShell>
      {(source) => <Body source={source} />}
    </ImageToolShell>
  );
}
