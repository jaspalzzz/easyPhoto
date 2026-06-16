"use client";

import * as React from "react";
import { Loader2, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import {
  detectFace,
  disposeLandmarker,
  FaceDetectionError,
} from "@/lib/faceDetection";
import {
  computeSquareFaceCrop,
  centerSquareCrop,
  type SquareCropRect,
} from "@/lib/squareFaceCrop";
import { picaResizeTo, canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

/** LinkedIn supports 400×400 (min) up to very large; these cover real use. */
const SIZES = [400, 800, 1000] as const;

/** Crop a source rect to its own native-size canvas (high-quality sampling). */
function cropToCanvas(
  img: CanvasImageSource,
  c: SquareCropRect
): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = c.sw;
  cv.height = c.sh;
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, c.sw, c.sh);
  return cv;
}

function Body({ source }: { source: ToolSource }) {
  const [side, setSide] = React.useState<number>(400);
  const [busy, setBusy] = React.useState(true);
  const [out, setOut] = React.useState<{
    url: string;
    canvas: HTMLCanvasElement;
  } | null>(null);
  const [note, setNote] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(
    async (target: number) => {
      setBusy(true);
      setError(null);
      setNote(null);
      track({ name: "tool_start", tool: "linkedin-photo", device: deviceClass() });
      try {
        let crop: SquareCropRect;
        let warn: string | null = null;
        try {
          const det = await detectFace(source.image, source.size);
          const result = computeSquareFaceCrop(det, source.size, { side: target });
          crop = result.crop;
          warn = result.warnings[0] ?? null;
        } catch (e) {
          if (!(e instanceof FaceDetectionError)) throw e;
          // No face → centred square so the tool still produces something useful.
          crop = centerSquareCrop(source.size);
          warn =
            "We couldn't detect a face, so we used a centred square crop. For best results, use a clear, front-facing photo.";
          track({
            name: "tool_failure",
            tool: "linkedin-photo",
            device: deviceClass(),
            reason: "no-face",
          });
        }

        const cropped = cropToCanvas(source.image, crop);
        const canvas =
          crop.sw === target ? cropped : await picaResizeTo(cropped, target, target);
        canvas.toBlob((blob) => {
          if (!blob) return;
          setOut({ url: URL.createObjectURL(blob), canvas });
        }, "image/png");
        setNote(warn);
        track({ name: "tool_success", tool: "linkedin-photo", device: deviceClass() });
      } catch {
        setError("Couldn't process this photo. Re-exporting it as a plain JPG (or taking a fresh one with your camera app) usually fixes it.");
        track({
          name: "tool_failure",
          tool: "linkedin-photo",
          device: deviceClass(),
          reason: "process-error",
        });
      } finally {
        setBusy(false);
        // Free MediaPipe memory (matters on mobile) — re-created on next run.
        void disposeLandmarker();
      }
    },
    [source]
  );

  // Auto-run once per loaded image; guard against React strict double-mount.
  const lastUrl = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (lastUrl.current === source.url) return;
    lastUrl.current = source.url;
    void run(side);
  }, [source, run]);

  // Revoke previous blob URL to free memory whenever out changes.
  React.useEffect(() => {
    const url = out?.url;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [out?.url]);

  const onSize = (s: number) => {
    setSide(s);
    void run(s);
  };

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!out) return;
    const blob = await canvasToBlob(out.canvas, type, 0.95);
    downloadBlob(
      blob,
      `linkedin-photo-${side}x${side}.${type === "image/png" ? "png" : "jpg"}`
    );
    track({
      name: "download",
      tool: "linkedin-photo",
      format: type === "image/png" ? "png" : "jpg",
    });
  };

  return (
    <div className="space-y-4">
      <PreviewFrame>
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={out?.url ?? source.url}
            alt="LinkedIn profile photo preview"
            className="h-[300px] w-[300px] rounded-md object-cover"
          />
          {/* Show how LinkedIn displays the square as a circle. */}
          {out && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand/50"
            />
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-paper/70 p-4">
              <span className="flex flex-col items-center gap-2 text-center text-sm text-ink-soft">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  Detecting face…
                </span>
                <span className="text-xs text-ink-faint">
                  First run sets up the AI — a few seconds, instant after that.
                  Your photo never leaves your device.
                </span>
              </span>
            </div>
          )}
        </div>
      </PreviewFrame>

      {out && (
        <p className="text-center text-xs text-ink-faint">
          LinkedIn shows your photo inside a circle — keep your face centred.
        </p>
      )}
      {out && (
        <p className="text-center text-xs text-ink-soft">{side}×{side}px</p>
      )}

      {note && (
        <p className="flex items-start gap-2 rounded-md border border-brand/10 bg-brand-soft/30 p-3 text-xs leading-relaxed text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
          {note}
        </p>
      )}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <span className="eyebrow mb-1 block">Output size</span>
          <div className="flex gap-1.5">
            {SIZES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={side === s ? "cta" : "outline"}
                aria-pressed={side === s}
                onClick={() => onSize(s)}
                disabled={busy}
              >
                {s}×{s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {out && !busy && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onDownload("image/jpeg")}>
            <Download className="h-4 w-4" strokeWidth={1.75} /> JPG
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDownload("image/png")}>
            <Download className="h-4 w-4" strokeWidth={1.75} /> PNG
          </Button>
        </div>
      )}
    </div>
  );
}

export function LinkedInPhotoTool() {
  React.useEffect(() => {
    track({ name: "tool_view", tool: "linkedin-photo" });
  }, []);
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
