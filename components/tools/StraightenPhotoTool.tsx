"use client";

import * as React from "react";
import { Download, Share2, Loader2, RotateCcw, Scissors, Crop, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, type ToolSource } from "./ImageToolShell";
import { detectFace, disposeLandmarker } from "@/lib/faceDetection";
import { downloadBlob, shareFile } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { track, deviceClass } from "@/lib/analytics";

const MAX_NUDGE = 15; // clamp the slider to a sensible ±range (degrees)

function Body({ source, reset }: { source: ToolSource; reset: () => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [detecting, setDetecting] = React.useState(true);
  const [detectedRoll, setDetectedRoll] = React.useState<number | null>(null);
  const [angle, setAngle] = React.useState(0); // applied rotation, degrees

  React.useEffect(() => {
    track({ name: "tool_view", tool: "straighten-photo" });
  }, []);

  // Draw the source rotated by `deg` onto an expanded white canvas (no clipping).
  const draw = React.useCallback(
    (deg: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = source.size.width;
      const h = source.size.height;
      const rad = (deg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const nw = Math.max(1, Math.round(w * cos + h * sin));
      const nh = Math.max(1, Math.round(w * sin + h * cos));
      canvas.width = nw;
      canvas.height = nh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, nw, nh);
      ctx.save();
      ctx.translate(nw / 2, nh / 2);
      ctx.rotate(rad);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(source.image, -w / 2, -h / 2, w, h);
      ctx.restore();
    },
    [source]
  );

  // Detect the tilt once, set the auto-correction angle.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setDetecting(true);
      try {
        const det = await detectFace(source.image, source.size);
        if (cancelled) return;
        setDetectedRoll(det.rollDeg);
        const corr = Math.max(-MAX_NUDGE, Math.min(MAX_NUDGE, -det.rollDeg));
        setAngle(Number(corr.toFixed(1)));
        track({ name: "tool_success", tool: "straighten-photo", device: deviceClass() });
      } catch {
        if (cancelled) return;
        setDetectedRoll(null);
        setAngle(0);
      } finally {
        // Free MediaPipe memory promptly (mobile budgets are tight).
        disposeLandmarker();
        if (!cancelled) setDetecting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  // Redraw whenever the angle changes (after detection completes).
  React.useEffect(() => {
    if (!detecting) draw(angle);
  }, [angle, detecting, draw]);

  const toBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.94);
    });

  const handleDownload = async () => {
    const blob = await toBlob();
    if (!blob) return;
    downloadBlob(blob, "straightened.jpg");
    track({ name: "download", tool: "straighten-photo", format: "jpg" });
  };

  const handleShare = async () => {
    const blob = await toBlob();
    if (!blob) return;
    await shareFile(blob, "straightened.jpg", "Straightened photo");
  };

  const resetToAuto = () => {
    const corr =
      detectedRoll == null
        ? 0
        : Math.max(-MAX_NUDGE, Math.min(MAX_NUDGE, -detectedRoll));
    setAngle(Number(corr.toFixed(1)));
  };

  return (
    <div className="space-y-4">
      {detecting ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> Detecting
          tilt…
        </p>
      ) : detectedRoll == null ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          No face detected — straighten manually with the slider below.
        </p>
      ) : (
        <p className="rounded-lg border border-hairline bg-accent/30 px-4 py-2 text-sm text-muted-foreground">
          Detected tilt: <span className="font-mono text-foreground">{Math.abs(detectedRoll).toFixed(1)}°</span>
          {Math.abs(detectedRoll) <= 1 ? " — already straight." : " — auto-corrected below."}
        </p>
      )}

      <canvas
        ref={canvasRef}
        className="mx-auto max-h-[360px] w-auto rounded-lg border border-hairline bg-white shadow-sm"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="rotate" className="eyebrow text-xs">
            Rotation
          </label>
          <span className="font-mono text-sm text-foreground">
            {angle > 0 ? "+" : ""}
            {angle.toFixed(1)}°
          </span>
        </div>
        <input
          id="rotate"
          type="range"
          min={-MAX_NUDGE}
          max={MAX_NUDGE}
          step={0.5}
          value={angle}
          disabled={detecting}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full accent-brand"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="cta" size="sm" onClick={handleDownload} disabled={detecting}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG
        </Button>
        {"share" in navigator && (
          <Button variant="outline" size="sm" onClick={handleShare} disabled={detecting}>
            <Share2 className="h-4 w-4" strokeWidth={1.75} /> Share
          </Button>
        )}
        {detectedRoll != null && (
          <Button variant="outline" size="sm" onClick={resetToAuto} disabled={detecting}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} /> Reset to auto
          </Button>
        )}
        <button
          onClick={reset}
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Use different photo
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Straightening adds a small white border at the corners. Crop to your
        exam&apos;s size afterwards with the resize tools.
      </p>
      <WorkflowNextSteps
        getBlob={async () => {
          const b = await toBlob();
          if (!b) throw new Error("No output");
          return b;
        }}
        filename="straightened.jpg"
        steps={[
          {
            slug: "background-removal",
            label: "Remove Background",
            hint: "AI removes the background from your straightened photo",
            icon: <Scissors className="h-4 w-4" strokeWidth={1.75} />,
          },
          {
            slug: "image-crop",
            label: "Crop to Size",
            hint: "Trim the white border corners to your exact dimensions",
            icon: <Crop className="h-4 w-4" strokeWidth={1.75} />,
          },
          {
            slug: "resize-kb",
            label: "Compress to KB",
            hint: "Hit exact file size limits for exam and visa portals",
            icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
          },
        ]}
      />
    </div>
  );
}

export function StraightenPhotoTool() {
  return (
    <ImageToolShell uploaderTitle="photo" uploaderHint="Upload a tilted photo to straighten">
      {(source, reset) => <Body source={source} reset={reset} />}
    </ImageToolShell>
  );
}
