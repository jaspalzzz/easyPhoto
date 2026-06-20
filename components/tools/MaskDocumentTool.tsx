"use client";

import * as React from "react";
import { Download, ShieldCheck, Undo2, Trash2, FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureDecodable } from "@/lib/heic";
import { downloadBlob } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

interface Box {
  id: number;
  /** Natural-image coordinates. */
  x: number;
  y: number;
  w: number;
  h: number;
}

type Mode = "draw" | "move" | "resize";

/**
 * Draw-to-redact masking tool. The user covers sensitive parts of a document
 * (e.g. the first 8 digits of an Aadhaar number, per UIDAI guidance) and
 * downloads a flattened, masked copy. Everything is client-side — the document
 * is never uploaded, which is the whole point for an ID.
 *
 * Mobile-friendly editor: drag on empty space to draw a box, tap a box to
 * select it, drag its body to move it, drag the corner handle to resize, and
 * remove it with one tap on the × (or the Delete button). Touch targets are
 * sized in SCREEN pixels (scaled into image space) so fingers can hit them.
 */
export function MaskDocumentTool() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [boxes, setBoxes] = React.useState<Box[]>([]);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drag = React.useRef<{
    mode: Mode;
    startX: number;
    startY: number;
    orig: Box;
    moved: boolean;
  } | null>(null);
  const nextId = React.useRef(1);
  // Display→image scale (canvas.width / cssWidth), kept fresh for hit-testing
  // and for drawing finger-sized handles. Set on every coord conversion / draw.
  const scaleRef = React.useRef(1);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "mask-document" });
  }, []);

  // Finger-sized handle/border, expressed in IMAGE pixels (≈ a fixed screen size
  // regardless of how far the photo is zoomed to fit).
  const handleImg = () => Math.max(10, 22 * scaleRef.current);

  // Redraw the canvas whenever the image, boxes, or selection change.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) scaleRef.current = canvas.width / rect.width;

    ctx.drawImage(img, 0, 0);
    for (const b of boxes) {
      ctx.fillStyle = "#000";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    // Selection chrome: a dashed outline + a solid corner handle so it reads as
    // editable. Drawn after the black fills so it stays visible.
    const sel = boxes.find((b) => b.id === selectedId);
    if (sel && sel.w > 0 && sel.h > 0) {
      const hs = handleImg();
      const line = Math.max(2, scaleRef.current * 1.5);
      ctx.save();
      ctx.strokeStyle = "#163A6B";
      ctx.lineWidth = line;
      ctx.setLineDash([hs * 0.5, hs * 0.4]);
      ctx.strokeRect(sel.x, sel.y, sel.w, sel.h);
      ctx.setLineDash([]);
      // Bottom-right resize handle
      ctx.fillStyle = "#163A6B";
      ctx.fillRect(sel.x + sel.w - hs, sel.y + sel.h - hs, hs, hs);
      ctx.fillStyle = "#fff";
      ctx.fillRect(
        sel.x + sel.w - hs * 0.66,
        sel.y + sel.h - hs * 0.66,
        hs * 0.33,
        hs * 0.33
      );
      ctx.restore();
    }

    // Per-box "×" remove badge — one tap on any black area deletes it, so an
    // accidental or over-broad mask is trivial to undo on a phone.
    for (const b of boxes) {
      if (b.w <= 0 || b.h <= 0) continue;
      const { cx, cy, r } = badgeCenter(b);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#DC2626";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(2, r * 0.2);
      const k = r * 0.42;
      ctx.beginPath();
      ctx.moveTo(cx - k, cy - k);
      ctx.lineTo(cx + k, cy + k);
      ctx.moveTo(cx + k, cy - k);
      ctx.lineTo(cx - k, cy + k);
      ctx.stroke();
    }
  }, [img, boxes, selectedId]);

  const onFile = async (file: File) => {
    setError(null);
    try {
      const decodable = await ensureDecodable(file);
      const url = URL.createObjectURL(decodable);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        setImg(image);
        setBoxes([]);
        setSelectedId(null);
        track({ name: "tool_start", tool: "mask-document", device: deviceClass() });
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        setError("Couldn't read that file. Try a JPG or PNG.");
      };
      image.src = url;
    } catch {
      setError("Couldn't read that file. Try a JPG or PNG.");
    }
  };

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

  const inResizeHandle = (b: Box, x: number, y: number) => {
    const hs = handleImg();
    const cx = b.x + b.w;
    const cy = b.y + b.h;
    return x >= cx - hs && x <= cx + hs * 0.4 && y >= cy - hs && y <= cy + hs * 0.4;
  };

  const boxAt = (x: number, y: number): Box | undefined => {
    // Topmost first (last drawn is on top).
    for (let i = boxes.length - 1; i >= 0; i--) {
      const b = boxes[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
    }
    return undefined;
  };

  // The "×" remove badge sits at each box's top-right corner. Visual radius is
  // kept small (~7px screen) so it doesn't obscure masked content; the TAP zone
  // is 2.5× the visual radius so fingers can still hit it reliably.
  const badgeCenter = (b: Box) => {
    const canvas = canvasRef.current!;
    const r = Math.max(5, 7 * scaleRef.current);
    return { cx: Math.min(b.x + b.w, canvas.width - r), cy: Math.max(b.y, r), r };
  };
  const badgeAt = (x: number, y: number): Box | undefined => {
    for (let i = boxes.length - 1; i >= 0; i--) {
      const b = boxes[i];
      if (b.w <= 0 || b.h <= 0) continue;
      const { cx, cy, r } = badgeCenter(b);
      // Tap tolerance ~2.5× visual radius → small badge, finger-friendly target.
      if ((x - cx) ** 2 + (y - cy) ** 2 <= (r * 2.5) ** 2) return b;
    }
    return undefined;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return;
    e.preventDefault();
    const { x, y } = toImageCoords(e);

    // 0) Tap on a box's "×" badge → delete that box (no capture/draw).
    const badge = badgeAt(x, y);
    if (badge) {
      setBoxes((bs) => bs.filter((b) => b.id !== badge.id));
      setSelectedId((s) => (s === badge.id ? null : s));
      return;
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // 1) Resize the selected box if the handle was grabbed.
    const sel = boxes.find((b) => b.id === selectedId);
    if (sel && inResizeHandle(sel, x, y)) {
      drag.current = { mode: "resize", startX: x, startY: y, orig: sel, moved: false };
      return;
    }
    // 2) Move/select an existing box if one was tapped.
    const hit = boxAt(x, y);
    if (hit) {
      setSelectedId(hit.id);
      drag.current = { mode: "move", startX: x, startY: y, orig: hit, moved: false };
      return;
    }
    // 3) Otherwise start drawing a new box.
    const box: Box = { id: nextId.current++, x, y, w: 0, h: 0 };
    setBoxes((bs) => [...bs, box]);
    setSelectedId(box.id);
    drag.current = { mode: "draw", startX: x, startY: y, orig: box, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const { x, y } = toImageCoords(e);
    const canvas = canvasRef.current!;
    d.moved = true;

    if (d.mode === "draw") {
      const nx = Math.min(d.startX, x);
      const ny = Math.min(d.startY, y);
      const nw = Math.abs(x - d.startX);
      const nh = Math.abs(y - d.startY);
      setBoxes((bs) => bs.map((b) => (b.id === d.orig.id ? { ...b, x: nx, y: ny, w: nw, h: nh } : b)));
    } else if (d.mode === "move") {
      const dx = x - d.startX;
      const dy = y - d.startY;
      const nx = Math.max(0, Math.min(canvas.width - d.orig.w, d.orig.x + dx));
      const ny = Math.max(0, Math.min(canvas.height - d.orig.h, d.orig.y + dy));
      setBoxes((bs) => bs.map((b) => (b.id === d.orig.id ? { ...b, x: nx, y: ny } : b)));
    } else if (d.mode === "resize") {
      const nw = Math.max(0, Math.min(canvas.width - d.orig.x, x - d.orig.x));
      const nh = Math.max(0, Math.min(canvas.height - d.orig.y, y - d.orig.y));
      setBoxes((bs) => bs.map((b) => (b.id === d.orig.id ? { ...b, w: nw, h: nh } : b)));
    }
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    // Discard a brand-new box that's too tiny to be an intentional redaction
    // (e.g. a plain tap on empty space).
    if (d.mode === "draw") {
      setBoxes((bs) => bs.filter((b) => b.id !== d.orig.id || (b.w > 6 && b.h > 6)));
    }
  };

  const deleteSelected = () =>
    setBoxes((bs) => {
      setSelectedId(null);
      return bs.filter((b) => b.id !== selectedId);
    });
  const undo = () => {
    setBoxes((bs) => bs.slice(0, -1));
    setSelectedId(null);
  };
  const clear = () => {
    setBoxes([]);
    setSelectedId(null);
  };

  const exportMasked = async (type: "image/jpeg" | "image/png") => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    // Redraw WITHOUT selection chrome so the green outline/handle never bakes in.
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      for (const b of boxes) {
        ctx.fillStyle = "#000";
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
    }
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), type, 0.92)
    );
    // The canvas now shows the clean masked image (no selection chrome) — which
    // is exactly what was exported; the chrome redraws on the next interaction.
    if (!blob) return;
    downloadBlob(blob, `masked-document.${type === "image/png" ? "png" : "jpg"}`);
    track({ name: "download", tool: "mask-document", format: type === "image/png" ? "png" : "jpg" });
  };

  return (
    <div className="space-y-4">
      {!img ? (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40">
          <input
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
          <span className="text-sm font-semibold">Upload the document to mask</span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG or HEIC. Your file stays on your device.
          </span>
        </label>
      ) : (
        <>
          <p className="rounded-md border border-brand/25 bg-brand-soft/20 p-3 text-sm text-foreground">
            <strong>Drag across an area to hide it</strong> — for an Aadhaar card,
            cover the <strong>first 8 digits</strong> (UIDAI recommends showing
            only the last 4). Drag a box to move it, drag its corner to resize,
            or tap the red <strong>×</strong> on a box to remove it. Scroll the
            page using the margins on either side of the image.
          </p>

          {/* Horizontal gutters on phones: the canvas is touch-none (so drawing
              doesn't scroll), so leave scrollable page margins on each side. */}
          <div className="mx-8 overflow-hidden rounded-md border border-hairline bg-accent/5 sm:mx-0">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="block h-auto w-full cursor-crosshair touch-none select-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelected}
              disabled={selectedId === null}
            >
              <X className="h-4 w-4" strokeWidth={1.75} /> Delete box
            </Button>
            <Button variant="outline" size="sm" onClick={undo} disabled={!boxes.length}>
              <Undo2 className="h-4 w-4" strokeWidth={1.75} /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={clear} disabled={!boxes.length}>
              <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Clear all
            </Button>
            <div className="grow" />
            <Button
              variant="cta"
              size="sm"
              onClick={() => exportMasked("image/jpeg")}
              disabled={!boxes.length}
            >
              <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportMasked("image/png")}
              disabled={!boxes.length}
            >
              <Download className="h-4 w-4" strokeWidth={1.75} /> PNG
            </Button>
          </div>

          <button
            type="button"
            onClick={() => {
              setImg(null);
              setBoxes([]);
              setSelectedId(null);
            }}
            className="text-xs font-medium text-ink-soft transition-colors hover:text-brand"
          >
            Upload a different document
          </button>
        </>
      )}

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        The mask is burned into the image (not an overlay you can peel off), and
        the file never leaves your browser.
      </p>
    </div>
  );
}
