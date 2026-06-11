"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

function Body({ source }: { source: ToolSource }) {
  const [padding, setPadding] = React.useState(12);
  const [threshold, setThreshold] = React.useState(200);
  // Full-pixel bbox scan per change is too heavy for live slider ticks —
  // recompute only after the user pauses.
  const dPadding = useDebouncedValue(padding, 180);
  const dThreshold = useDebouncedValue(threshold, 180);
  const [out, setOut] = React.useState<{ url: string; canvas: HTMLCanvasElement; w: number; h: number } | null>(null);
  const [empty, setEmpty] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      setBusy(true);
      // Yield to the browser so the spinner can paint before heavy work begins
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (cancelled) return;
      const canvas = imageToCanvas(source.image, source.size.width, source.size.height);
      const { canvas: cropped, bbox } = trimToContent(canvas, {
        mode: "luma",
        threshold: dThreshold,
        padding: dPadding,
      });
      if (cancelled) return;
      if (!bbox) {
        setEmpty(true);
        setOut(null);
      } else {
        setEmpty(false);
        setOut({
          url: cropped.toDataURL("image/png"),
          canvas: cropped,
          w: cropped.width,
          h: cropped.height,
        });
      }
      setBusy(false);
    }
    run();
    return () => { cancelled = true; };
  }, [source, dPadding, dThreshold]);

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
            <div className="relative inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out?.url ?? source.url} alt="Cropped signature" className="max-h-[220px] w-auto rounded" />
              {busy && (
                <div className="absolute inset-0 overflow-hidden rounded bg-white/40">
                  {/* Brand scan-line sweeps the signature preview (transform-only). */}
                  <span aria-hidden className="ep-scan-sweep">
                    <span className="ep-scan-glow" />
                    <span className="ep-scan-line" />
                  </span>
                  <span className="sr-only" aria-live="polite">
                    Processing…
                  </span>
                </div>
              )}
            </div>
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
          <Button variant="cta" size="sm" disabled={busy} onClick={() => onDownload("image/png")}>
            <Download className="h-4 w-4" strokeWidth={1.75} /> PNG
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => onDownload("image/jpeg")}>
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
