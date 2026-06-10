"use client";

import * as React from "react";
import { Download, ShieldCheck, Undo2, Trash2, FileUp } from "lucide-react";
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

/**
 * Draw-to-redact masking tool. The user drags rectangles over sensitive parts of
 * a document (e.g. the first 8 digits of an Aadhaar number, per UIDAI guidance)
 * and downloads a flattened, masked copy. Everything is client-side — the
 * document is never uploaded, which is the whole point for an ID.
 */
export function MaskDocumentTool() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [boxes, setBoxes] = React.useState<Box[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef<{ startX: number; startY: number; box: Box } | null>(
    null
  );
  const nextId = React.useRef(1);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "mask-document" });
  }, []);

  // Redraw the canvas whenever the image or boxes change.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    for (const b of boxes) {
      ctx.fillStyle = "#000";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  }, [img, boxes]);

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

  /** Map a pointer event to natural-image coordinates. */
  const toImageCoords = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * scaleY)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { x, y } = toImageCoords(e);
    const box: Box = { id: nextId.current++, x, y, w: 0, h: 0 };
    drawing.current = { startX: x, startY: y, box };
    setBoxes((bs) => [...bs, box]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drawing.current;
    if (!d) return;
    const { x, y } = toImageCoords(e);
    const nx = Math.min(d.startX, x);
    const ny = Math.min(d.startY, y);
    const nw = Math.abs(x - d.startX);
    const nh = Math.abs(y - d.startY);
    setBoxes((bs) =>
      bs.map((b) => (b.id === d.box.id ? { ...b, x: nx, y: ny, w: nw, h: nh } : b))
    );
  };

  const onPointerUp = () => {
    const d = drawing.current;
    drawing.current = null;
    if (!d) return;
    // Discard a box that's too tiny to be an intentional redaction.
    setBoxes((bs) =>
      bs.filter((b) => b.id !== d.box.id || (b.w > 6 && b.h > 6))
    );
  };

  const undo = () => setBoxes((bs) => bs.slice(0, -1));
  const clear = () => setBoxes([]);

  const exportMasked = async (type: "image/jpeg" | "image/png") => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), type, 0.92)
    );
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
            <strong>Drag across the area you want to hide</strong> — for an
            Aadhaar card, cover the <strong>first 8 digits</strong> of the number
            (UIDAI recommends showing only the last 4). Add as many boxes as you
            need.
          </p>

          <div className="overflow-hidden rounded-md border border-hairline bg-accent/5">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="block h-auto w-full cursor-crosshair touch-none select-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={!boxes.length}>
              <Undo2 className="h-4 w-4" strokeWidth={1.75} /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={clear} disabled={!boxes.length}>
              <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Clear
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
