"use client";

import * as React from "react";
import Link from "next/link";
import { FileImage, Loader2, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { detectFace } from "@/lib/faceDetection";

type Status = "centered" | "slightly-off" | "off";

interface Analysis {
  previewUrl: string;
  imageW: number;
  imageH: number;
  /** Face bounding box in image pixels */
  faceBox: { x: number; y: number; w: number; h: number } | null;
  faceCenterX: number | null;
  /** 0 = perfect center; 1 = fully at edge */
  offsetRatio: number | null;
  status: Status;
  rollDeg: number | null;
}

function statusLabel(s: Status) {
  if (s === "centered") return "Face is well-centred ✓";
  if (s === "slightly-off") return "Slightly off-centre — may still be accepted";
  return "Off-centre — likely to be rejected";
}

function statusCls(s: Status) {
  if (s === "centered") return "text-emerald-700 dark:text-emerald-400";
  if (s === "slightly-off") return "text-amber-700 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function barCls(s: Status) {
  if (s === "centered") return "bg-emerald-500";
  if (s === "slightly-off") return "bg-amber-400";
  return "bg-red-500";
}

export function FaceCenteringTool() {
  const [dragging, setDragging] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<Analysis | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const prevUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "face-centering" });
  }, []);

  React.useEffect(() => {
    const prev = prevUrlRef.current;
    prevUrlRef.current = analysis?.previewUrl ?? null;
    if (prev && prev !== analysis?.previewUrl) URL.revokeObjectURL(prev);
  }, [analysis]);
  React.useEffect(() => {
    return () => { if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current); };
  }, []);

  // Draw overlay on canvas whenever analysis changes
  React.useEffect(() => {
    if (!analysis || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = analysis.imageW;
      canvas.height = analysis.imageH;
      ctx.drawImage(img, 0, 0);

      if (analysis.faceBox) {
        const { x, y, w, h } = analysis.faceBox;
        // Face bounding box
        ctx.strokeStyle = analysis.status === "centered" ? "#10b981" : analysis.status === "slightly-off" ? "#f59e0b" : "#ef4444";
        ctx.lineWidth = Math.max(2, analysis.imageW * 0.004);
        ctx.strokeRect(x, y, w, h);

        // Face center crosshair
        const cx = x + w / 2;
        const cy = y + h / 2;
        const arm = h * 0.15;
        ctx.beginPath();
        ctx.moveTo(cx - arm, cy);
        ctx.lineTo(cx + arm, cy);
        ctx.moveTo(cx, cy - arm);
        ctx.lineTo(cx, cy + arm);
        ctx.stroke();
      }

      // Image center vertical line
      ctx.strokeStyle = "rgba(99,102,241,0.6)";
      ctx.lineWidth = Math.max(1, analysis.imageW * 0.002);
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(analysis.imageW / 2, 0);
      ctx.lineTo(analysis.imageW / 2, analysis.imageH);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    img.src = analysis.previewUrl;
  }, [analysis]);

  const analyse = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a JPG or PNG image.");
      return;
    }
    setBusy(true);
    setError(null);
    setAnalysis(null);

    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    }).catch(() => null);

    if (!img) {
      URL.revokeObjectURL(url);
      setBusy(false);
      setError("Could not decode the image.");
      return;
    }

    try {
      const size = { width: img.naturalWidth, height: img.naturalHeight };
      const det = await detectFace(img, size).catch(() => null);

      if (!det) {
        setAnalysis({
          previewUrl: url,
          imageW: size.width,
          imageH: size.height,
          faceBox: null,
          faceCenterX: null,
          offsetRatio: null,
          status: "off",
          rollDeg: null,
        });
        track({ name: "tool_success", tool: "face-centering" });
        return;
      }

      const faceCenterX = det.faceCenterX;
      const offsetRatio = Math.abs(faceCenterX / size.width - 0.5) * 2; // 0–1

      let status: Status;
      if (offsetRatio <= 0.12) status = "centered";
      else if (offsetRatio <= 0.25) status = "slightly-off";
      else status = "off";

      // Build a rough face bounding box from landmarks
      const faceH = det.chinY - det.crownY;
      const faceW = det.faceXSpan.max - det.faceXSpan.min;
      const faceBox = {
        x: det.faceXSpan.min,
        y: det.crownY,
        w: Math.max(faceW, faceH * 0.75),
        h: faceH,
      };

      setAnalysis({
        previewUrl: url,
        imageW: size.width,
        imageH: size.height,
        faceBox,
        faceCenterX,
        offsetRatio,
        status,
        rollDeg: det.rollDeg,
      });
      track({ name: "tool_success", tool: "face-centering" });
    } catch {
      URL.revokeObjectURL(url);
      setError("Face analysis failed. Please try a clearer front-facing photo.");
      track({ name: "tool_failure", tool: "face-centering" });
    } finally {
      setBusy(false);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) analyse(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) analyse(f);
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  if (analysis) {
    const { status, faceBox, offsetRatio, rollDeg } = analysis;
    const offsetPct = offsetRatio != null ? Math.round(offsetRatio * 50) : null;
    const centerPct = offsetRatio != null ? Math.round((1 - offsetRatio) * 100) : 0;

    return (
      <div className="space-y-5">
        {/* Canvas overlay preview */}
        <div className="overflow-hidden rounded-xl border border-hairline">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "auto", display: "block" }}
            aria-label="Face centering overlay"
          />
        </div>

        {/* Result cards */}
        <div className="space-y-3">
          {/* Centering status */}
          <div className="rounded-xl border border-hairline p-4">
            <p className={`text-sm font-semibold ${statusCls(status)}`}>{statusLabel(status)}</p>
            {faceBox && offsetPct != null && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Centering score</span>
                  <span className="font-semibold text-ink">{centerPct}/100</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all ${barCls(status)}`} style={{ width: `${centerPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Face not detected */}
          {!faceBox && (
            <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              No face was detected in this photo. Make sure you upload a front-facing photo with your full face visible and even lighting.
            </p>
          )}

          {/* Roll / tilt */}
          {rollDeg != null && (
            <div className="flex items-center gap-2 rounded-xl border border-hairline px-4 py-3">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${Math.abs(rollDeg) <= 5 ? "bg-emerald-500" : Math.abs(rollDeg) <= 10 ? "bg-amber-400" : "bg-red-500"}`} />
              <p className="text-sm text-ink">
                <span className="font-medium">Head tilt: </span>
                {Math.abs(rollDeg) <= 5
                  ? `${Math.round(Math.abs(rollDeg))}° — eyes are level`
                  : `${Math.round(Math.abs(rollDeg))}° tilt — ${Math.abs(rollDeg) <= 10 ? "slight tilt, may warn" : "significant tilt, may be rejected"}`}
              </p>
            </div>
          )}

          {/* Offset detail */}
          {faceBox && offsetPct != null && offsetPct > 4 && (
            <div className="rounded-lg border border-amber-200/60 bg-amber-50/40 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              Your face centre is about <strong>{offsetPct}% off-centre</strong>. Re-crop the photo so the face sits in the middle.
              Try the{" "}
              <Link href="/tools/image-crop/" className="underline underline-offset-2">image crop tool</Link>{" "}
              or{" "}
              <Link href="/tools/auto-crop/" className="underline underline-offset-2">auto-crop to spec</Link>.
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={reset}>
          <RefreshCcw className="mr-2 h-4 w-4" strokeWidth={1.75} />
          Analyse another photo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload photo to check face centering"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-brand bg-brand-soft/20" : "border-hairline hover:border-brand/50"
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInput} />
        {busy ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-medium text-ink">Detecting face…</p>
          </div>
        ) : (
          <>
            <FileImage className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-ink">Drop your photo here to check centering</p>
              <p className="mt-1 text-sm text-muted-foreground">JPG or PNG · nothing is uploaded</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        Face detection runs entirely on your device — nothing is uploaded.
      </p>
    </div>
  );
}
