"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";

function Body({ source }: { source: ToolSource }) {
  const [padding, setPadding] = React.useState(12);
  const [threshold, setThreshold] = React.useState(200);
  const [out, setOut] = React.useState<{ url: string; canvas: HTMLCanvasElement; w: number; h: number } | null>(null);
  const [empty, setEmpty] = React.useState(false);

  React.useEffect(() => {
    const canvas = imageToCanvas(source.image, source.size.width, source.size.height);
    const { canvas: cropped, bbox } = trimToContent(canvas, {
      mode: "luma",
      threshold,
      padding,
    });
    if (!bbox) {
      setEmpty(true);
      setOut(null);
      return;
    }
    setEmpty(false);
    setOut({
      url: cropped.toDataURL("image/png"),
      canvas: cropped,
      w: cropped.width,
      h: cropped.height,
    });
  }, [source, padding, threshold]);

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!out) return;
    const blob = await canvasToBlob(out.canvas, type, 0.95);
    downloadBlob(blob, `signature-cropped.${type === "image/png" ? "png" : "jpg"}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source.url} alt="Original signature" className="max-h-[220px] w-auto rounded" />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-[11px] text-ink-soft">
            Before · {source.size.width}×{source.size.height}px
          </figcaption>
        </figure>
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={out?.url ?? source.url} alt="Cropped signature" className="max-h-[220px] w-auto rounded" />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-[11px] text-ink-soft">
            {out ? `After · ${out.w}×${out.h}px` : "After"}
          </figcaption>
        </figure>
      </div>

      {empty && (
        <p className="border-l-2 border-amber-500 pl-3 text-sm text-amber-700">
          Couldn&apos;t find dark content. Try raising the sensitivity, or use a
          clearer scan of the signature.
        </p>
      )}

      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 flex items-center justify-between">
            <span className="eyebrow">Edge padding</span>
            <span className="font-mono text-[13px] text-ink-soft">{padding}px</span>
          </span>
          <input
            type="range"
            min={0}
            max={60}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 flex items-center justify-between">
            <span className="eyebrow">Sensitivity (ink darkness)</span>
            <span className="font-mono text-[13px] text-ink-soft">{threshold}</span>
          </span>
          <input
            type="range"
            min={80}
            max={250}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      {out && (
        <div className="flex items-center gap-2">
          <Button variant="cta" size="sm" onClick={() => onDownload("image/png")}>
            <Download className="h-4 w-4" strokeWidth={1.75} /> PNG
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDownload("image/jpeg")}>
            <Download className="h-4 w-4" strokeWidth={1.75} /> JPG
          </Button>
          <span className="font-mono text-[13px] text-ink-soft">
            {out.w}×{out.h}px
          </span>
        </div>
      )}
    </div>
  );
}

export function SignatureCropTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
