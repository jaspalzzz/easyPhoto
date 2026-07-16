"use client";

import * as React from "react";
import { Download, Minimize2, Scissors, FilePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob, flattenForJpeg } from "@/lib/imaging";
import { trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { track, deviceClass } from "@/lib/analytics";

const TOOL = "signature-crop";

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
    track({ name: "tool_start", tool: TOOL, device: deviceClass() });
  }, [source]);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      setBusy(true);
      // Yield to the browser so the spinner can paint before heavy work begins
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (cancelled) return;
      try {
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
          track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "no-ink" });
        } else {
          setEmpty(false);
          const blob = await canvasToBlob(cropped, "image/png");
          if (cancelled) return;
          setOut({
            url: URL.createObjectURL(blob),
            canvas: cropped,
            w: cropped.width,
            h: cropped.height,
          });
          track({ name: "tool_success", tool: TOOL, device: deviceClass() });
        }
      } catch {
        if (!cancelled) {
          track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "crop" });
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [source, dPadding, dThreshold]);

  // Revoke the preview's object URL when replaced or on unmount.
  React.useEffect(() => {
    const url = out?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [out?.url]);

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!out) return;
    const src = type === "image/jpeg" ? flattenForJpeg(out.canvas) : out.canvas;
    const blob = await canvasToBlob(src, type, 0.95);
    downloadBlob(blob, `signature-cropped.${type === "image/png" ? "png" : "jpg"}`, TOOL);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source.url}
              alt="Original signature"
              width={source.size.width}
              height={source.size.height}
              className="max-h-[220px] w-auto rounded"
            />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-xs text-ink-soft">
            Before · {source.size.width}×{source.size.height}px
          </figcaption>
        </figure>
        <figure className="space-y-1.5">
          <PreviewFrame>
            <div className="relative inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={out?.url ?? source.url}
                alt="Cropped signature"
                width={out?.w ?? source.size.width}
                height={out?.h ?? source.size.height}
                className="max-h-[220px] w-auto rounded"
              />
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
          <figcaption className="text-center font-mono text-xs text-ink-soft">
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
        <>
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
          <WorkflowNextSteps
            getBlob={async () => canvasToBlob(out.canvas, "image/png")}
            filename="signature-cropped.png"
            steps={[
              {
                slug: "signature-resize",
                label: "Compress to KB",
                hint: "Hit the exact KB limit required by exam portals",
                icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "transparent-signature",
                label: "Remove Background",
                hint: "Make the signature background transparent",
                icon: <Scissors className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "sign-image",
                label: "Sign a Photo",
                hint: "Overlay this signature onto any photo or document",
                icon: <FilePen className="h-4 w-4" strokeWidth={1.75} />,
              },
            ]}
          />
        </>
      )}
    </div>
  );
}

export function SignatureCropTool() {
  React.useEffect(() => {
    track({ name: "tool_view", tool: TOOL });
  }, []);
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
