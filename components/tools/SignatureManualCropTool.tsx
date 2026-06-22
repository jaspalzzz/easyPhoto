"use client";

import * as React from "react";
import { Download, Wand2, Maximize, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { detectInkBBox } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Which part of the crop box a pointer grabbed. */
type Grab =
  | { kind: "move"; rect: Rect; startX: number; startY: number }
  | { kind: "resize"; corner: Corner; rect: Rect }
  | { kind: "draw"; startX: number; startY: number };

type Corner = "tl" | "tr" | "bl" | "br";

const MIN_CROP = 16; // image px — smallest sensible crop

function Body({ source }: { source: ToolSource }) {
  const baseCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const grab = React.useRef<Grab | null>(null);
  // Display→image scale (canvas.width / cssWidth), refreshed on every coord
  // conversion — used both for hit-testing and for finger-sized handles.
  const scaleRef = React.useRef(1);

  const [crop, setCrop] = React.useState<Rect | null>(null);
  const [size, setSize] = React.useState<{ bytes: number; type: "png" | "jpeg" } | null>(null);
  const [autoMsg, setAutoMsg] = React.useState<string | null>(null);

  const dCrop = useDebouncedValue(crop, 200);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "signature-manual-crop" });
  }, []);

  // Build the base image canvas once per source, and seed the crop box from an
  // auto-detect so the user lands on a useful starting rectangle, not a blank
  // one. If detection fails (a dark photo with no clear paper), start with a
  // centred box covering most of the image — still obvious and easy to adjust.
  React.useEffect(() => {
    const base = imageToCanvas(source.image, source.size.width, source.size.height);
    baseCanvasRef.current = base;
    const detected = detectInkBBox(base, { padding: Math.round(Math.min(base.width, base.height) * 0.02) });
    if (detected) {
      setCrop({ x: detected.x, y: detected.y, w: detected.width, h: detected.height });
      setAutoMsg(null);
    } else {
      const m = 0.12;
      setCrop({
        x: Math.round(base.width * m),
        y: Math.round(base.height * m),
        w: Math.round(base.width * (1 - m * 2)),
        h: Math.round(base.height * (1 - m * 2)),
      });
      setAutoMsg("Couldn't auto-detect the ink — drag the box around your signature.");
    }
    track({ name: "tool_start", tool: "signature-manual-crop", device: deviceClass() });
  }, [source]);

  // Finger-sized corner handle, in IMAGE pixels (≈ fixed screen size).
  const handleImg = React.useCallback(() => Math.max(14, 24 * scaleRef.current), []);

  // Redraw: base image, a dimming veil over everything OUTSIDE the crop (this is
  // the "instant difference" — bright = kept, dim = removed), then the crop
  // border and corner handles.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const base = baseCanvasRef.current;
    if (!canvas || !base) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = base.width;
    canvas.height = base.height;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) scaleRef.current = canvas.width / rect.width;

    ctx.drawImage(base, 0, 0);
    if (!crop) return;

    const { x, y, w, h } = crop;
    // Dim the four regions around the crop.
    ctx.fillStyle = "rgba(15, 23, 27, 0.55)";
    ctx.fillRect(0, 0, canvas.width, y); // top
    ctx.fillRect(0, y + h, canvas.width, canvas.height - (y + h)); // bottom
    ctx.fillRect(0, y, x, h); // left
    ctx.fillRect(x + w, y, canvas.width - (x + w), h); // right

    // Crop border.
    const line = Math.max(2, scaleRef.current * 1.5);
    ctx.strokeStyle = "#163A6B";
    ctx.lineWidth = line;
    ctx.strokeRect(x, y, w, h);

    // Corner handles (solid brand squares with a white core for contrast).
    const hs = handleImg();
    const corners: [number, number][] = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillStyle = "#163A6B";
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.fillStyle = "#fff";
      ctx.fillRect(cx - hs / 6, cy - hs / 6, hs / 3, hs / 3);
    }
  }, [crop, handleImg]);

  /** Map a pointer event to natural-image coordinates (and refresh the scale). */
  const toImageCoords = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    scaleRef.current = scaleX;
    return {
      x: Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * scaleY)),
    };
  };

  const cornerAt = (cx: number, cy: number): Corner | null => {
    if (!crop) return null;
    const hs = handleImg();
    const near = (px: number, py: number) =>
      Math.abs(cx - px) <= hs && Math.abs(cy - py) <= hs;
    if (near(crop.x, crop.y)) return "tl";
    if (near(crop.x + crop.w, crop.y)) return "tr";
    if (near(crop.x, crop.y + crop.h)) return "bl";
    if (near(crop.x + crop.w, crop.y + crop.h)) return "br";
    return null;
  };

  const insideCrop = (cx: number, cy: number) =>
    !!crop && cx >= crop.x && cx <= crop.x + crop.w && cy >= crop.y && cy <= crop.y + crop.h;

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { x, y } = toImageCoords(e);

    const corner = cornerAt(x, y);
    if (corner && crop) {
      grab.current = { kind: "resize", corner, rect: crop };
      return;
    }
    if (insideCrop(x, y) && crop) {
      grab.current = { kind: "move", rect: crop, startX: x, startY: y };
      return;
    }
    // Empty space → start drawing a fresh box.
    grab.current = { kind: "draw", startX: x, startY: y };
    setCrop({ x, y, w: 0, h: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = grab.current;
    if (!g) return;
    const canvas = canvasRef.current!;
    const { x, y } = toImageCoords(e);

    if (g.kind === "draw") {
      setCrop({
        x: Math.min(g.startX, x),
        y: Math.min(g.startY, y),
        w: Math.abs(x - g.startX),
        h: Math.abs(y - g.startY),
      });
    } else if (g.kind === "move") {
      const dx = x - g.startX;
      const dy = y - g.startY;
      const nx = Math.max(0, Math.min(canvas.width - g.rect.w, g.rect.x + dx));
      const ny = Math.max(0, Math.min(canvas.height - g.rect.h, g.rect.y + dy));
      setCrop({ ...g.rect, x: nx, y: ny });
    } else {
      // resize — keep the OPPOSITE corner fixed, move the grabbed one to pointer.
      const r = g.rect;
      const fixedX = g.corner === "tl" || g.corner === "bl" ? r.x + r.w : r.x;
      const fixedY = g.corner === "tl" || g.corner === "tr" ? r.y + r.h : r.y;
      const nx = Math.min(fixedX, x);
      const ny = Math.min(fixedY, y);
      const nw = Math.abs(fixedX - x);
      const nh = Math.abs(fixedY - y);
      setCrop({ x: nx, y: ny, w: nw, h: nh });
    }
  };

  const onPointerUp = () => {
    const g = grab.current;
    grab.current = null;
    // Discard a too-tiny draw (an accidental tap on empty space).
    if (g?.kind === "draw") {
      setCrop((c) => (c && (c.w < MIN_CROP || c.h < MIN_CROP) ? null : c));
    }
  };

  const autoDetect = () => {
    const base = baseCanvasRef.current;
    if (!base) return;
    const detected = detectInkBBox(base, {
      padding: Math.round(Math.min(base.width, base.height) * 0.02),
    });
    if (detected) {
      setCrop({ x: detected.x, y: detected.y, w: detected.width, h: detected.height });
      setAutoMsg(null);
    } else {
      setAutoMsg("Couldn't auto-detect the ink — drag the box around your signature.");
    }
  };

  const resetBox = () => {
    const base = baseCanvasRef.current;
    if (!base) return;
    setCrop({ x: 0, y: 0, w: base.width, h: base.height });
    setAutoMsg(null);
  };

  /** Produce the cropped canvas at full resolution (white fill for JPEG). */
  const cropCanvas = React.useCallback(
    (white: boolean): HTMLCanvasElement | null => {
      const base = baseCanvasRef.current;
      if (!base || !crop || crop.w < 1 || crop.h < 1) return null;
      const w = Math.round(crop.w);
      const h = Math.round(crop.h);
      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const ctx = out.getContext("2d");
      if (!ctx) return null;
      if (white) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(base, Math.round(crop.x), Math.round(crop.y), w, h, 0, 0, w, h);
      return out;
    },
    [crop]
  );

  // Live result preview (debounced) — a small image of exactly what downloads,
  // plus its real file size, so there's no "before/after" guesswork.
  const [preview, setPreview] = React.useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    async function run() {
      const out = cropCanvas(false);
      if (!out) {
        setPreview(null);
        setSize(null);
        return;
      }
      const blob = await canvasToBlob(out, "image/png");
      if (cancelled) return;
      url = URL.createObjectURL(blob);
      setPreview(url);
      setSize({ bytes: blob.size, type: "png" });
    }
    run();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // dCrop is the debounced crop; cropCanvas closes over `crop` so it changes
    // with it. Keying on dCrop keeps the heavy encode off every drag tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dCrop]);

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    const out = cropCanvas(type === "image/jpeg");
    if (!out) return;
    const blob = await canvasToBlob(out, type, 0.95);
    downloadBlob(blob, `signature-cropped.${type === "image/png" ? "png" : "jpg"}`);
    track({ name: "download", tool: "signature-manual-crop", format: type === "image/png" ? "png" : "jpg" });
  };

  const hasCrop = !!crop && crop.w >= MIN_CROP && crop.h >= MIN_CROP;

  return (
    <div className="space-y-4">
      <p className="rounded-md border border-brand/25 bg-brand-soft/20 p-3 text-sm text-foreground">
        <strong>Drag the box</strong> around your signature — everything dimmed is
        removed, the bright area is kept. Drag a corner to resize, drag the middle
        to move, or draw a new box on empty space. Tap{" "}
        <strong>Auto-detect</strong> to snap it to the ink.
      </p>

      {/* Canvas is touch-none so drag-to-crop never triggers page scroll. */}
      <PreviewFrame>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="block max-h-[300px] w-auto max-w-full cursor-crosshair touch-none select-none rounded"
        />
      </PreviewFrame>
      {/* Mobile scroll affordance — not touch-none, reliable swipe target */}
      <div
        className="flex min-h-[44px] items-center justify-center gap-1.5 sm:hidden"
        aria-hidden="true"
      >
        <div className="h-1 w-8 rounded-full bg-foreground/20" />
        <span className="text-[11px] text-muted-foreground">swipe here to scroll</span>
        <div className="h-1 w-8 rounded-full bg-foreground/20" />
      </div>

      {autoMsg && (
        <p className="border-l-2 border-amber-500 pl-3 text-sm text-amber-700">{autoMsg}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={autoDetect}>
          <Wand2 className="h-4 w-4" strokeWidth={1.75} /> Auto-detect
        </Button>
        <Button variant="outline" size="sm" onClick={resetBox}>
          <Maximize className="h-4 w-4" strokeWidth={1.75} /> Whole image
        </Button>
      </div>

      {/* Live result — the actual output, no toggle to interpret. */}
      {hasCrop && preview && (
        <div className="space-y-2">
          <p className="eyebrow text-ink-soft">Cropped result</p>
          <PreviewFrame checker>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Cropped signature" className="max-h-[180px] w-auto rounded" />
          </PreviewFrame>
          <p className="text-center font-mono text-[11px] text-ink-soft">
            {Math.round(crop!.w)}×{Math.round(crop!.h)}px
            {size ? ` · ${formatKb(size.bytes)}` : ""}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="cta" size="sm" disabled={!hasCrop} onClick={() => onDownload("image/png")}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> Download PNG
        </Button>
        <Button size="sm" variant="outline" disabled={!hasCrop} onClick={() => onDownload("image/jpeg")}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> JPG
        </Button>
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Cropping runs entirely in your browser — your signature is never uploaded.
      </p>
    </div>
  );
}

export function SignatureManualCropTool() {
  return (
    <ImageToolShell
      uploaderTitle="Upload your signature"
      uploaderHint="A scan or a phone photo of your signature on paper. JPG, PNG or HEIC."
    >
      {(source) => <Body source={source} />}
    </ImageToolShell>
  );
}
