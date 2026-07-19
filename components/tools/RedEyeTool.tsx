"use client";

import * as React from "react";
import { WORKFLOW_PHOTO_KINDS } from "@/lib/workflowHandoff";
import { Download, Share2, Undo2, Scissors, Minimize2, Crop, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, type ToolSource } from "./ImageToolShell";
import { downloadBlob, shareFile } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { track, deviceClass } from "@/lib/analytics";
import { detectFace, disposeLandmarker, type Point } from "@/lib/faceDetection";

type Brush = "S" | "M" | "L";

// Brush radius as a fraction of the image's shorter edge — keeps the fix the
// right size whether the photo is 600px or 4000px wide.
const BRUSH_FRACTION: Record<Brush, number> = { S: 0.02, M: 0.035, L: 0.055 };

const MIN_RED_CLUSTER_FRACTION = 0.004;
const INNER_CLUSTER_FRACTION = 0.35;

export function redEyeReplacement(r: number, g: number, b: number): number | null {
  const maxOther = Math.max(g, b);
  const minOther = Math.min(g, b);
  const redDominance = r - maxOther;

  // Skin, eyelids and warm hair are reddish, but true flash red-eye has a
  // much stronger red-channel spike with green/blue both well below red.
  if (
    r < 120 ||
    redDominance < 55 ||
    r - minOther < 75 ||
    g > r * 0.48 ||
    b > r * 0.55 ||
    r < g * 1.55 ||
    r < b * 1.55
  ) {
    return null;
  }

  // Pull the glow into a neutral dark pupil. Lowering only the red channel
  // leaves green/blue behind, which was causing visible green marks.
  const neutral = Math.round(((g + b) / 2) * 0.65);
  return Math.max(14, Math.min(92, neutral));
}

/**
 * Reduce red-eye inside a circle: a real cluster of strongly red pixels (the
 * flash glow on the retina) is replaced with neutral dark pupil pixels without
 * touching ordinary skin, eyelid, iris or background colours.
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
  const innerR2 = Math.max(4, radius * INNER_CLUSTER_FRACTION) ** 2;
  const candidates: Array<{ i: number; v: number }> = [];
  let innerCandidates = 0;
  let circlePixels = 0;
  let changed = false;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x0 + x - cx;
      const dy = y0 + y - cy;
      if (dx * dx + dy * dy > r2) continue;
      circlePixels++;
      const i = (y * w + x) * 4;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const replacement = redEyeReplacement(r, g, b);
      if (replacement !== null) {
        candidates.push({ i, v: replacement });
        if (dx * dx + dy * dy <= innerR2) innerCandidates++;
      }
    }
  }

  const minCluster = Math.max(10, Math.round(circlePixels * MIN_RED_CLUSTER_FRACTION));
  const minInnerCluster = Math.max(3, Math.round(minCluster * 0.25));
  if (candidates.length < minCluster || innerCandidates < minInnerCluster) return false;

  for (const { i, v } of candidates) {
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    changed = true;
  }
  if (changed) ctx.putImageData(img, x0, y0);
  return changed;
}

/** How far a tap may land from a detected eye centre and still count as "on
 *  the eye" — scaled to the inter-eye distance so it works at any face size. */
const EYE_TAP_TOLERANCE_FRACTION = 0.35;

type FaceState =
  | { status: "detecting" }
  | { status: "found"; left: Point; right: Point; tolerance: number }
  | { status: "not-found" };

function Body({ source, reset }: { source: ToolSource; reset: () => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [brush, setBrush] = React.useState<Brush>("M");
  const [edited, setEdited] = React.useState(false);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const [faceState, setFaceState] = React.useState<FaceState>({ status: "detecting" });
  const [missedTap, setMissedTap] = React.useState(false);
  const [noRedTap, setNoRedTap] = React.useState(false);

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

  // Without this, any strongly-red pixel anywhere in the photo (reddish-brown
  // hair, warm skin tones) passes the crude colour heuristic below and gets
  // "fixed" — visibly discolouring hair/skin on photos that don't show eyes
  // at all, which is exactly what makes the tool look broken rather than
  // just declining to do anything.
  React.useEffect(() => {
    let cancelled = false;
    setFaceState({ status: "detecting" });
    setMissedTap(false);
    setNoRedTap(false);
    detectFace(source.image, source.size)
      .then((det) => {
        if (cancelled) return;
        const eyeDist = Math.hypot(
          det.rightEyeCenter.x - det.leftEyeCenter.x,
          det.rightEyeCenter.y - det.leftEyeCenter.y
        );
        setFaceState({
          status: "found",
          left: det.leftEyeCenter,
          right: det.rightEyeCenter,
          tolerance: Math.max(20, eyeDist * EYE_TAP_TOLERANCE_FRACTION),
        });
      })
      .catch(() => {
        if (!cancelled) setFaceState({ status: "not-found" });
      })
      .finally(() => {
        // Model + wasm memory is heavy — free it once this tool is done with
        // it rather than keeping it resident for the rest of the session.
        void disposeLandmarker();
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  const handleTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // No detected face means no known eye position to validate against — and
    // with no face, there's no red eye to fix. Rather than fall through to
    // the old unguarded pixel-colour heuristic (which is what let this tool
    // "fix" random reddish hair/skin pixels on photos with no eyes at all),
    // decline entirely and point at the warning banner explaining why.
    if (faceState.status === "detecting" || faceState.status === "not-found") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Gate the tap against the actual detected eye positions when we have
    // them — a face was found, so we know where the eyes are, and a tap far
    // from both isn't a red pupil no matter what the pixel colours say.
    if (faceState.status === "found") {
      const dLeft = Math.hypot(cx - faceState.left.x, cy - faceState.left.y);
      const dRight = Math.hypot(cx - faceState.right.x, cy - faceState.right.y);
      if (dLeft > faceState.tolerance && dRight > faceState.tolerance) {
        setMissedTap(true);
        setNoRedTap(false);
        return;
      }
    }
    setMissedTap(false);
    setNoRedTap(false);

    const radius = Math.max(
      6,
      Math.round(Math.min(canvas.width, canvas.height) * BRUSH_FRACTION[brush])
    );
    const changed = fixRedEyeAt(ctx, cx, cy, radius);
    if (changed) {
      setEdited(true);
      setResultBlob(null);
    } else {
      setNoRedTap(true);
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
        {faceState.status === "detecting"
          ? "Checking the photo for a face…"
          : "Tap directly on a red flash pupil. Normal dark/brown eyes will not change."}
      </p>

      {faceState.status === "not-found" && (
        <p className="flex items-start gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          No face was detected in this photo, so there&apos;s nothing to check
          eye positions against. Tapping is disabled here — upload a clear
          photo with the eyes visible to use this tool.
        </p>
      )}

      {missedTap && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          That doesn&apos;t look like an eye — tap directly on the red pupil.
        </p>
      )}

      {noRedTap && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          No red-eye was found at that spot. This tool only changes red flash
          pupils, so normal eye colour and eyelids are left alone.
        </p>
      )}

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
        className={`w-full max-w-md rounded-lg border border-hairline shadow-sm touch-none ${
          faceState.status === "found" ? "cursor-crosshair" : "cursor-not-allowed"
        }`}
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
          assetKind="photo"
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
    <ImageToolShell acceptedWorkflowKinds={WORKFLOW_PHOTO_KINDS} uploaderTitle="photo" uploaderHint="Upload a photo with red-eye">
      {(source, reset) => <Body source={source} reset={reset} />}
    </ImageToolShell>
  );
}
