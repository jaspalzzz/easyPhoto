"use client";

import * as React from "react";
import { Download, Maximize, ShieldCheck, Scissors, Palette, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { cn } from "@/lib/utils";

interface Rect { x: number; y: number; w: number; h: number }
type Aspect = "free" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
type Corner = "tl" | "tr" | "bl" | "br";
type Grab =
  | { kind: "move"; rect: Rect; startX: number; startY: number }
  | { kind: "resize"; corner: Corner; rect: Rect }
  | { kind: "draw"; startX: number; startY: number };

const MIN_CROP = 10;

const ASPECT_OPTIONS: { label: string; value: Aspect }[] = [
  { label: "Free",  value: "free"  },
  { label: "1∶1",  value: "1:1"   },
  { label: "4∶3",  value: "4:3"   },
  { label: "3∶4",  value: "3:4"   },
  { label: "16∶9", value: "16:9"  },
  { label: "9∶16", value: "9:16"  },
];

function aspectRatio(a: Aspect): number | null {
  if (a === "1:1")  return 1;
  if (a === "4:3")  return 4 / 3;
  if (a === "3:4")  return 3 / 4;
  if (a === "16:9") return 16 / 9;
  if (a === "9:16") return 9 / 16;
  return null;
}

function clamp(r: Rect, imgW: number, imgH: number): Rect {
  const w = Math.min(Math.max(0, r.w), imgW);
  const h = Math.min(Math.max(0, r.h), imgH);
  const x = Math.max(0, Math.min(r.x, imgW - w));
  const y = Math.max(0, Math.min(r.y, imgH - h));
  return { x, y, w, h };
}

function Body({ source }: { source: ToolSource }) {
  const baseCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRef     = React.useRef<HTMLCanvasElement>(null);
  const grab          = React.useRef<Grab | null>(null);
  const scaleRef      = React.useRef(1);

  const [crop, setCrop]           = React.useState<Rect | null>(null);
  const [aspect, setAspect]       = React.useState<Aspect>("free");
  const [preview, setPreview]     = React.useState<string | null>(null);
  const [previewKb, setPreviewKb] = React.useState<number | null>(null);

  const dCrop = useDebouncedValue(crop, 160);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "image-crop" });
  }, []);

  // Build base canvas and seed a centered 80% crop box on load.
  React.useEffect(() => {
    const base = imageToCanvas(source.image, source.size.width, source.size.height);
    baseCanvasRef.current = base;
    const pad = 0.1;
    setCrop({
      x: Math.round(base.width  * pad),
      y: Math.round(base.height * pad),
      w: Math.round(base.width  * (1 - pad * 2)),
      h: Math.round(base.height * (1 - pad * 2)),
    });
    track({ name: "tool_start", tool: "image-crop", device: deviceClass() });
  }, [source]);

  // Handle size in image-px for the corner grab targets (stays ≥ 14px on screen).
  const handleImg = React.useCallback(() => Math.max(14, 24 * scaleRef.current), []);

  // Redraw: base image → dim outside → rule-of-thirds grid → border → handles.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const base   = baseCanvasRef.current;
    if (!canvas || !base) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width  = base.width;
    canvas.height = base.height;
    const bRect = canvas.getBoundingClientRect();
    if (bRect.width > 0) scaleRef.current = canvas.width / bRect.width;

    ctx.drawImage(base, 0, 0);
    if (!crop) return;

    const { x, y, w, h } = crop;

    // Dim the four regions outside the crop.
    ctx.fillStyle = "rgba(10, 20, 40, 0.58)";
    ctx.fillRect(0, 0, canvas.width, y);
    ctx.fillRect(0, y + h, canvas.width, canvas.height - (y + h));
    ctx.fillRect(0, y, x, h);
    ctx.fillRect(x + w, y, canvas.width - (x + w), h);

    // Rule-of-thirds grid lines inside the crop box.
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = Math.max(1, scaleRef.current * 0.75);
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(x + (w / 3) * i, y); ctx.lineTo(x + (w / 3) * i, y + h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + (h / 3) * i); ctx.lineTo(x + w, y + (h / 3) * i); ctx.stroke();
    }

    // Crop border.
    const lw = Math.max(2, scaleRef.current * 1.5);
    ctx.strokeStyle = "#163A6B";
    ctx.lineWidth = lw;
    ctx.strokeRect(x, y, w, h);

    // Corner handles — navy square with white core.
    const hs = handleImg();
    for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]] as [number, number][]) {
      ctx.fillStyle = "#163A6B";
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.fillStyle = "#fff";
      ctx.fillRect(cx - hs / 6, cy - hs / 6, hs / 3, hs / 3);
    }
  }, [crop, handleImg]);

  const toImageCoords = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const r      = canvas.getBoundingClientRect();
    const sx = r.width  > 0 ? canvas.width  / r.width  : 1;
    const sy = r.height > 0 ? canvas.height / r.height : 1;
    scaleRef.current = sx;
    return {
      x: Math.max(0, Math.min(canvas.width,  (e.clientX - r.left) * sx)),
      y: Math.max(0, Math.min(canvas.height, (e.clientY - r.top)  * sy)),
    };
  };

  const cornerAt = (cx: number, cy: number): Corner | null => {
    if (!crop) return null;
    const hs = handleImg();
    const near = (px: number, py: number) =>
      Math.abs(cx - px) <= hs && Math.abs(cy - py) <= hs;
    if (near(crop.x,         crop.y        )) return "tl";
    if (near(crop.x + crop.w, crop.y        )) return "tr";
    if (near(crop.x,         crop.y + crop.h)) return "bl";
    if (near(crop.x + crop.w, crop.y + crop.h)) return "br";
    return null;
  };

  const insideCrop = (cx: number, cy: number) =>
    !!crop && cx >= crop.x && cx <= crop.x + crop.w &&
              cy >= crop.y && cy <= crop.y + crop.h;

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { x, y } = toImageCoords(e);
    const corner = cornerAt(x, y);
    if (corner && crop) { grab.current = { kind: "resize", corner, rect: crop }; return; }
    if (insideCrop(x, y) && crop) { grab.current = { kind: "move", rect: crop, startX: x, startY: y }; return; }
    grab.current = { kind: "draw", startX: x, startY: y };
    setCrop({ x, y, w: 0, h: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = grab.current;
    if (!g) return;
    const canvas = canvasRef.current!;
    const { x, y } = toImageCoords(e);
    const ratio = aspectRatio(aspect);

    if (g.kind === "draw") {
      const nw = Math.abs(x - g.startX);
      const nh = ratio ? nw / ratio : Math.abs(y - g.startY);
      setCrop(clamp({ x: Math.min(g.startX, x), y: Math.min(g.startY, y), w: nw, h: nh }, canvas.width, canvas.height));
    } else if (g.kind === "move") {
      const nx = Math.max(0, Math.min(canvas.width  - g.rect.w, g.rect.x + (x - g.startX)));
      const ny = Math.max(0, Math.min(canvas.height - g.rect.h, g.rect.y + (y - g.startY)));
      setCrop({ ...g.rect, x: nx, y: ny });
    } else {
      // Resize: hold the opposite corner fixed.
      const r  = g.rect;
      const fx = g.corner === "tl" || g.corner === "bl" ? r.x + r.w : r.x;
      const fy = g.corner === "tl" || g.corner === "tr" ? r.y + r.h : r.y;
      const nw = Math.max(MIN_CROP, Math.abs(fx - x));
      const nh = ratio ? nw / ratio : Math.max(MIN_CROP, Math.abs(fy - y));
      const nx = Math.min(fx, x);
      const fixedYIsTop = g.corner === "bl" || g.corner === "br";
      const ny = ratio ? (fixedYIsTop ? fy : fy - nh) : Math.min(fy, y);
      setCrop(clamp({ x: Math.max(0, nx), y: Math.max(0, ny), w: nw, h: nh }, canvas.width, canvas.height));
    }
  };

  const onPointerUp = () => {
    const g = grab.current;
    grab.current = null;
    if (g?.kind === "draw") setCrop((c) => (c && (c.w < MIN_CROP || c.h < MIN_CROP) ? null : c));
  };

  // Reshape the existing crop box to the new aspect ratio (keep centre).
  React.useEffect(() => {
    const base = baseCanvasRef.current;
    if (!crop || !base) return;
    const ratio = aspectRatio(aspect);
    if (!ratio) return;
    const cx = crop.x + crop.w / 2;
    const cy = crop.y + crop.h / 2;
    const nw = crop.w;
    const nh = nw / ratio;
    setCrop(clamp({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh }, base.width, base.height));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  const resetBox = () => {
    const base = baseCanvasRef.current;
    if (!base) return;
    const pad = 0.1;
    const nw  = Math.round(base.width * (1 - pad * 2));
    const ratio = aspectRatio(aspect);
    const nh  = ratio ? nw / ratio : Math.round(base.height * (1 - pad * 2));
    setCrop(clamp({ x: Math.round(base.width * pad), y: Math.round(base.height * pad), w: nw, h: nh }, base.width, base.height));
  };

  const cropCanvas = React.useCallback((white: boolean): HTMLCanvasElement | null => {
    const base = baseCanvasRef.current;
    if (!base || !crop || crop.w < 1 || crop.h < 1) return null;
    const w = Math.round(crop.w), h = Math.round(crop.h);
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    if (white) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(base, Math.round(crop.x), Math.round(crop.y), w, h, 0, 0, w, h);
    return out;
  }, [crop]);

  // Debounced live preview — shows exactly what will download.
  React.useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    async function run() {
      const out = cropCanvas(true);
      if (!out) { setPreview(null); setPreviewKb(null); return; }
      const blob = await canvasToBlob(out, "image/jpeg", 0.85);
      if (cancelled) return;
      url = URL.createObjectURL(blob);
      setPreview(url);
      setPreviewKb(blob.size);
    }
    run();
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dCrop]);

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    const out = cropCanvas(type === "image/jpeg");
    if (!out) return;
    const blob = await canvasToBlob(out, type, 0.95);
    const ext = type === "image/png" ? "png" : "jpg";
    downloadBlob(blob, `image-cropped.${ext}`);
    track({ name: "download", tool: "image-crop", format: ext });
  };

  const hasCrop = !!crop && crop.w >= MIN_CROP && crop.h >= MIN_CROP;

  return (
    <div className="space-y-4">
      {/* Aspect ratio selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11.5px] font-semibold text-muted-foreground">Aspect ratio:</span>
        <div className="flex flex-wrap gap-1">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAspect(opt.value)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                aspect === opt.value
                  ? "border-brand bg-brand text-white"
                  : "border-hairline bg-card text-muted-foreground hover:bg-accent hover:text-ink"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive canvas — touch-none required for drag-to-crop on mobile */}
      <PreviewFrame>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="block max-h-[450px] w-auto max-w-full cursor-crosshair touch-none select-none rounded"
        />
      </PreviewFrame>
      {/* Mobile scroll affordance — not touch-none, gives a reliable swipe target */}
      <div
        className="flex min-h-[44px] items-center justify-center gap-1.5 sm:hidden"
        aria-hidden="true"
      >
        <div className="h-1 w-8 rounded-full bg-foreground/20" />
        <span className="text-[11px] text-muted-foreground">swipe here to scroll</span>
        <div className="h-1 w-8 rounded-full bg-foreground/20" />
      </div>

      {hasCrop && (
        <p className="text-center font-mono text-[11px] text-muted-foreground">
          {Math.round(crop!.w)} × {Math.round(crop!.h)} px
        </p>
      )}

      <Button variant="outline" size="sm" onClick={resetBox}>
        <Maximize className="h-4 w-4" strokeWidth={1.75} /> Reset box
      </Button>

      {/* Live result preview */}
      {hasCrop && preview && (
        <div className="space-y-2">
          <p className="eyebrow text-ink-soft">Cropped result</p>
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Cropped result" className="max-h-[260px] w-auto rounded" />
          </PreviewFrame>
          {previewKb !== null && (
            <p className="text-center text-[11px] text-muted-foreground">
              {Math.round(crop!.w)}×{Math.round(crop!.h)} px · ~{formatKb(previewKb)} (JPEG est.)
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="cta" size="sm" disabled={!hasCrop} onClick={() => onDownload("image/png")}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> Download PNG
        </Button>
        <Button size="sm" variant="outline" disabled={!hasCrop} onClick={() => onDownload("image/jpeg")}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> JPG
        </Button>
      </div>

      {hasCrop && (
        <WorkflowNextSteps
          getBlob={async () => {
            const out = cropCanvas(true);
            if (!out) throw new Error("No crop output");
            return canvasToBlob(out, "image/jpeg", 0.95);
          }}
          filename="image-cropped.jpg"
          steps={[
            {
              slug: "background-removal",
              label: "Remove Background",
              hint: "AI removes the background from your cropped photo",
              icon: <Scissors className="h-4 w-4" strokeWidth={1.75} />,
            },
            {
              slug: "white-background",
              label: "Add White Background",
              hint: "Replace background with white or any solid color",
              icon: <Palette className="h-4 w-4" strokeWidth={1.75} />,
            },
            {
              slug: "resize-kb",
              label: "Compress to KB",
              hint: "Hit exact file size limits for exam portals",
              icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
            },
          ]}
        />
      )}

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Cropping runs entirely in your browser — your image is never uploaded.
      </p>
    </div>
  );
}

export function ImageCropTool() {
  return (
    <ImageToolShell
      uploaderTitle="Upload an image to crop"
      uploaderHint="JPG, PNG, WebP or HEIC — any size."
    >
      {(source) => <Body source={source} />}
    </ImageToolShell>
  );
}
