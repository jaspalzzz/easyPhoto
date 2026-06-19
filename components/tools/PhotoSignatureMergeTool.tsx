"use client";

import * as React from "react";
import { Download, Share2, RefreshCcw, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureDecodable } from "@/lib/heic";
import { loadImageFromFile } from "@/lib/pipeline";
import { trimToContent } from "@/lib/signature";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

type Layout = "stack" | "side";

interface Slot {
  image: HTMLImageElement;
  width: number;
  height: number;
  url: string;
}

const PAD = 40; // white margin around the whole composite (px)
const GAP = 32; // space between photo and signature (px)
const PHOTO_W = 480; // target photo width in the composite (px)
const SIG_MAX_W = 480; // signature scaled to fit this width
const SIG_MAX_H = 200; // …but never taller than this

/** Load a File into an HTMLImageElement via the app's HEIC-safe decode path. */
async function loadSlot(file: File): Promise<Slot> {
  const decodable = await ensureDecodable(file);
  const loaded = await loadImageFromFile(decodable);
  return {
    image: loaded.image,
    width: loaded.size.width,
    height: loaded.size.height,
    url: loaded.url,
  };
}

/** Trim surrounding whitespace from a signature so it sits tight in the layout. */
function trimSignature(slot: Slot): { canvas: HTMLCanvasElement; w: number; h: number } {
  const c = document.createElement("canvas");
  c.width = slot.width;
  c.height = slot.height;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(slot.image, 0, 0);
  const { canvas } = trimToContent(c, { mode: "luma", threshold: 235, padding: 8 });
  return { canvas, w: canvas.width, h: canvas.height };
}

function SlotUploader({
  label,
  slot,
  busy,
  onPick,
}: {
  label: string;
  slot: Slot | null;
  busy: boolean;
  onPick: (file: File) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith("image/")) onPick(f);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
        dragging
          ? "border-brand bg-brand-soft/20"
          : "border-hairline-strong bg-accent/20 hover:border-brand/50 hover:bg-accent/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
      {busy ? (
        <Loader2 className="h-6 w-6 animate-spin text-brand" strokeWidth={1.75} />
      ) : slot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slot.url}
          alt={label}
          className="max-h-[110px] w-auto rounded-md border border-hairline object-contain"
        />
      ) : (
        <>
          <ImagePlus className="h-6 w-6 text-brand" strokeWidth={1.5} />
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">Tap or drop an image</p>
        </>
      )}
    </div>
  );
}

export function PhotoSignatureMergeTool() {
  const [photo, setPhoto] = React.useState<Slot | null>(null);
  const [signature, setSignature] = React.useState<Slot | null>(null);
  const [layout, setLayout] = React.useState<Layout>("stack");
  const [photoBusy, setPhotoBusy] = React.useState(false);
  const [sigBusy, setSigBusy] = React.useState(false);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);

  const photoUrlRef = React.useRef<string | null>(null);
  const sigUrlRef = React.useRef<string | null>(null);
  const resultUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "photo-signature-merge" });
  }, []);

  // Revoke object URLs on unmount.
  React.useEffect(() => {
    return () => {
      [photoUrlRef, sigUrlRef, resultUrlRef].forEach((r) => {
        if (r.current) URL.revokeObjectURL(r.current);
      });
    };
  }, []);

  const pickPhoto = async (file: File) => {
    setPhotoBusy(true);
    try {
      const slot = await loadSlot(file);
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
      photoUrlRef.current = slot.url;
      setPhoto(slot);
      setResultBlob(null);
    } catch (e) {
      console.error(e);
    } finally {
      setPhotoBusy(false);
    }
  };

  const pickSignature = async (file: File) => {
    setSigBusy(true);
    try {
      const slot = await loadSlot(file);
      if (sigUrlRef.current) URL.revokeObjectURL(sigUrlRef.current);
      sigUrlRef.current = slot.url;
      setSignature(slot);
      setResultBlob(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSigBusy(false);
    }
  };

  const merge = React.useCallback(() => {
    if (!photo || !signature) return;

    // Photo scaled to a fixed width, preserving aspect.
    const pW = PHOTO_W;
    const pH = Math.round((photo.height / photo.width) * pW);

    // Signature trimmed, then scaled to fit within the max box.
    const sig = trimSignature(signature);
    const sScale = Math.min(SIG_MAX_W / sig.w, SIG_MAX_H / sig.h, 1);
    const sW = Math.round(sig.w * sScale);
    const sH = Math.round(sig.h * sScale);

    let canvasW: number;
    let canvasH: number;
    const canvas = document.createElement("canvas");

    if (layout === "stack") {
      canvasW = PAD * 2 + Math.max(pW, sW);
      canvasH = PAD * 2 + pH + GAP + sH;
    } else {
      canvasW = PAD * 2 + pW + GAP + sW;
      canvasH = PAD * 2 + Math.max(pH, sH);
    }
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasW, canvasH);

    if (layout === "stack") {
      const px = Math.round((canvasW - pW) / 2);
      const sx = Math.round((canvasW - sW) / 2);
      ctx.drawImage(photo.image, px, PAD, pW, pH);
      ctx.drawImage(sig.canvas, sx, PAD + pH + GAP, sW, sH);
    } else {
      const py = Math.round((canvasH - pH) / 2);
      const sy = Math.round((canvasH - sH) / 2);
      ctx.drawImage(photo.image, PAD, py, pW, pH);
      ctx.drawImage(sig.canvas, PAD + pW + GAP, sy, sW, sH);
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setResultBlob(blob);
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        const url = URL.createObjectURL(blob);
        resultUrlRef.current = url;
        setResultUrl(url);
        track({ name: "tool_success", tool: "photo-signature-merge", device: deviceClass() });
      },
      "image/jpeg",
      0.92
    );
  }, [photo, signature, layout]);

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, "photo-signature.jpg");
    track({ name: "download", tool: "photo-signature-merge", format: "jpg" });
  };

  const handleShare = async () => {
    if (!resultBlob) return;
    await shareFile(resultBlob, "photo-signature.jpg", "Photo and signature");
  };

  const reset = () => {
    setResultBlob(null);
    setResultUrl(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SlotUploader label="Your photo" slot={photo} busy={photoBusy} onPick={pickPhoto} />
        <SlotUploader label="Your signature" slot={signature} busy={sigBusy} onPick={pickSignature} />
      </div>

      {photo && signature && (
        <>
          <fieldset>
            <legend className="eyebrow mb-2 block text-xs">Layout</legend>
            <div className="flex gap-2">
              {([
                ["stack", "Stacked (photo above)"],
                ["side", "Side by side"],
              ] as [Layout, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => {
                    setLayout(val);
                    setResultBlob(null);
                  }}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    layout === val
                      ? "border-brand bg-brand text-white"
                      : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </fieldset>

          {!resultBlob && (
            <Button variant="cta" onClick={merge}>
              Merge into one image
            </Button>
          )}
        </>
      )}

      {resultUrl && resultBlob && (
        <div className="space-y-3">
          <p className="eyebrow text-xs text-muted-foreground">Merged result</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Merged photo and signature"
            className="w-full max-w-sm rounded-lg border border-hairline bg-white object-contain shadow-sm"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="cta" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG
            </Button>
            {"share" in navigator && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" strokeWidth={1.75} /> Share
              </Button>
            )}
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.75} /> Adjust
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
