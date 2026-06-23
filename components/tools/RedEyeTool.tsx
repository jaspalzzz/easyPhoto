"use client";

import * as React from "react";
import { Download, Share2, Undo2, Scissors, Minimize2, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, type ToolSource } from "./ImageToolShell";
import { downloadBlob, shareFile } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { track, deviceClass } from "@/lib/analytics";

type Brush = "S" | "M" | "L";

// Brush radius as a fraction of the image's shorter edge — keeps the fix the
// right size whether the photo is 600px or 4000px wide.
const BRUSH_FRACTION: Record<Brush, number> = { S: 0.02, M: 0.035, L: 0.055 };

/**
 * Reduce red-eye inside a circle: any strongly red pixel (the flash glow on the
 * retina) has its red channel pulled down to the green/blue average, which turns
 * the glow back into a natural dark pupil without touching skin or background.
 */
function fixRedEyeAt(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
): boolean {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const x1 = Math.min(ctx.canvas.width, Math.ceil(cx + radius));
  const y1 = Math.min(ctx.canvas.height, Math.ceil(cy + radius));
  const w = x1 - x0;
  const h = y1 - y0;
  if (w <= 0 || h <= 0) return false;

  const img = ctx.getImageData(x0, y0, w, h);
  const d = img.data;
  const r2 = radius * radius;
  let changed = false;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x0 + x - cx;
      const dy = y0 + y - cy;
      if (dx * dx + dy * dy > r2) continue;
      const i = (y * w + x) * 4;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      // Red glow = red clearly dominant over green and blue.
      if (r > 60 && r > g * 1.4 && r > b * 1.4) {
        const avg = (g + b) >> 1;
        d[i] = avg;
        changed = true;
      }
    }
  }
  if (changed) ctx.putImageData(img, x0, y0);
  return changed;
}

function Body({ source, reset }: { source: ToolSource; reset: () => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [brush, setBrush] = React.useState<Brush>("M");
  const [edited, setEdited] = React.useState(false);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = source.size.width;
    canvas.height = source.size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source.image, 0, 0);
  }, [source]);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "red-eye" });
  }, []);

  React.useEffect(() => {
    draw();
    setEdited(false);
    setResultBlob(null);
  }, [draw]);

  const handleTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const radius = Math.max(
      6,
      Math.round(Math.min(canvas.width, canvas.height) * BRUSH_FRACTION[brush])
    );
    const changed = fixRedEyeAt(ctx, cx, cy, radius);
    if (changed) {
      setEdited(true);
      setResultBlob(null);
    }
  };

  const undoAll = () => {
    draw();
    setEdited(false);
    setResultBlob(null);
  };

  const finish = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob(
        (blob) => {
          setResultBlob(blob);
          resolve(blob);
        },
        "image/jpeg",
        0.94
      );
    });

  const handleDownload = async () => {
    const blob = resultBlob ?? (await finish());
    if (!blob) return;
    downloadBlob(blob, "red-eye-fixed.jpg");
    track({ name: "download", tool: "red-eye", format: "jpg" });
    track({ name: "tool_success", tool: "red-eye", device: deviceClass() });
  };

  const handleShare = async () => {
    const blob = resultBlob ?? (await finish());
    if (!blob) return;
    await shareFile(blob, "red-eye-fixed.jpg", "Red-eye fixed photo");
  };

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-hairline bg-accent/30 px-4 py-2 text-sm text-muted-foreground">
        Tap directly on each red pupil to fix it. Tap again to strengthen, or
        adjust the brush size if the eye is larger.
      </p>

      <fieldset>
        <legend className="eyebrow mb-2 block text-xs">Brush size</legend>
        <div className="flex gap-2">
          {(["S", "M", "L"] as Brush[]).map((b) => (
            <button
              key={b}
              onClick={() => setBrush(b)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                brush === b
                  ? "border-brand bg-brand text-white"
                  : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
              }`}
            >
              {b === "S" ? "Small" : b === "M" ? "Medium" : "Large"}
            </button>
          ))}
        </div>
      </fieldset>

      <canvas
        ref={canvasRef}
        onClick={handleTap}
        onTouchEnd={(e) => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          if (touch) handleTap({ clientX: touch.clientX, clientY: touch.clientY, currentTarget: e.currentTarget } as unknown as React.MouseEvent<HTMLCanvasElement>);
        }}
        className="w-full max-w-md cursor-crosshair rounded-lg border border-hairline shadow-sm touch-none"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="cta" size="sm" onClick={handleDownload} disabled={!edited}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG
        </Button>
        {"share" in navigator && (
          <Button variant="outline" size="sm" onClick={handleShare} disabled={!edited}>
            <Share2 className="h-4 w-4" strokeWidth={1.75} /> Share
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={undoAll} disabled={!edited}>
          <Undo2 className="h-4 w-4" strokeWidth={1.75} /> Undo all
        </Button>
        <button
          onClick={reset}
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Use different photo
        </button>
      </div>
      {edited && (
        <WorkflowNextSteps
          getBlob={async () => {
            const b = resultBlob ?? (await finish());
            if (!b) throw new Error("No output");
            return b;
          }}
          filename="red-eye-fixed.jpg"
          steps={[
            {
              slug: "background-removal",
              label: "Remove Background",
              hint: "AI removes the background from your fixed photo",
              icon: <Scissors className="h-4 w-4" strokeWidth={1.75} />,
            },
            {
              slug: "image-crop",
              label: "Crop to Size",
              hint: "Trim to passport, square, or custom dimensions",
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
      )}
    </div>
  );
}

export function RedEyeTool() {
  return (
    <ImageToolShell uploaderTitle="photo" uploaderHint="Upload a photo with red-eye">
      {(source, reset) => <Body source={source} reset={reset} />}
    </ImageToolShell>
  );
}
