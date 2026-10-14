"use client";

import * as React from "react";
import { Download, Share2, RefreshCcw, ImagePlus, Loader2, Minimize2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureDecodable } from "@/lib/heic";
import { loadImageFromFile } from "@/lib/pipeline";
import { trimToContent } from "@/lib/signature";
import { formatKb } from "@/lib/utils";
import { useNumericField } from "@/components/tool/useNumericField";
import { downloadBlob, shareFile } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { track, deviceClass } from "@/lib/analytics";

type Layout = "stack" | "side";
/** "auto" keeps the natural layout size; "mm" prints at a DPI; "px" is exact pixels. */
type SizeMode = "auto" | "mm" | "px";

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
const SIG_MAX_EDGE = 1600; // a phone photo of a signature is cleaned at this size at most
const MM_PER_INCH = 25.4;

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

/**
 * Whiten the paper (grey phone-photo paper and soft shadows included, see
 * lib/paperFlatten.ts), then trim the white space so the signature sits tight
 * in the layout. A fixed threshold alone kept grey paper as a grey block.
 */
async function trimSignature(slot: Slot): Promise<{ canvas: HTMLCanvasElement; w: number; h: number }> {
  const { whitenPaperOnCanvas } = await import("@/lib/paperFlatten");
  const scale = Math.min(1, SIG_MAX_EDGE / Math.max(slot.width, slot.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(slot.width * scale));
  c.height = Math.max(1, Math.round(slot.height * scale));
  const ctx = c.getContext("2d")!;
  ctx.drawImage(slot.image, 0, 0, c.width, c.height);
  whitenPaperOnCanvas(c);

  const { canvas } = trimToContent(c, { mode: "luma", threshold: 235, padding: 8 });
  return { canvas, w: canvas.width, h: canvas.height };
}

/** Draw `source` centred on a white `width × height` canvas, scaled to fit without stretching. */
function fitOnWhite(source: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  const s = Math.min(width / source.width, height / source.height);
  const w = Math.round(source.width * s);
  const h = Math.round(source.height * s);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, Math.round((width - w) / 2), Math.round((height - h) / 2), w, h);
  return out;
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  const field = useNumericField(value, onChange, { min, max });
  return (
    <label className="text-sm">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="text"
          aria-label={`${label} (${suffix})`}
          {...field}
          className="h-10 w-20 rounded-md border border-hairline-strong bg-background px-2 font-mono text-[14px]"
        />
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </span>
    </label>
  );
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
  const [sizeMode, setSizeMode] = React.useState<SizeMode>("auto");
  const [widthMm, setWidthMm] = React.useState(35);
  const [heightMm, setHeightMm] = React.useState(45);
  const [dpi, setDpi] = React.useState(200);
  const [widthPx, setWidthPx] = React.useState(350);
  const [heightPx, setHeightPx] = React.useState(450);
  const [limitKb, setLimitKb] = React.useState(false);
  const [maxKb, setMaxKb] = React.useState(50);
  const [merging, setMerging] = React.useState(false);
  const [resultInfo, setResultInfo] = React.useState<{ width: number; height: number; bytes: number } | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  // Any setting change invalidates the last merged result.
  const changed = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setResultBlob(null);
  };

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

  const merge = React.useCallback(async () => {
    if (!photo || !signature) return;
    setMerging(true);
    setNotice(null);
    try {
      // Photo scaled to a fixed width, preserving aspect.
      const pW = PHOTO_W;
      const pH = Math.round((photo.height / photo.width) * pW);

      // Signature trimmed, then scaled to fit within the max box.
      const sig = await trimSignature(signature);
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

      const target =
        sizeMode === "mm"
          ? fitOnWhite(
              canvas,
              Math.round((widthMm / MM_PER_INCH) * dpi),
              Math.round((heightMm / MM_PER_INCH) * dpi)
            )
          : sizeMode === "px"
            ? fitOnWhite(canvas, widthPx, heightPx)
            : canvas;
      const densityDpi = sizeMode === "mm" ? dpi : undefined;

      // Loaded on demand: most visitors never open the size options.
      const [{ compressToCap }, { setBlobDensityDpi }] = await Promise.all([
        import("@/lib/compress"),
        import("@/lib/jpegDensity"),
      ]);
      let blob: Blob;
      if (limitKb) {
        // A chosen size is kept exactly; only the natural layout may shrink to fit.
        const res = await compressToCap(target, maxKb, { densityDpi, minScale: sizeMode === "auto" ? 0.3 : 1 });
        blob = res.blob;
        if (!res.underCap) {
          setNotice(
            `This couldn't be brought under ${maxKb} KB at this size (it's ${formatKb(res.bytes)}). ` +
              "Choose a smaller size or a higher KB limit."
          );
        }
      } else {
        blob = await new Promise<Blob>((resolve, reject) =>
          target.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))), "image/jpeg", 0.92)
        );
        if (densityDpi) blob = await setBlobDensityDpi(blob, densityDpi);
      }

      const bitmap = await createImageBitmap(blob);
      setResultInfo({ width: bitmap.width, height: bitmap.height, bytes: blob.size });
      bitmap.close();
      setResultBlob(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultUrl(url);
      track({ name: "tool_success", tool: "photo-signature-merge", device: deviceClass() });
    } catch (e) {
      console.error("[photo-signature-merge] merge failed", e);
      setNotice("Something went wrong while merging. Try again, or use smaller images.");
    } finally {
      setMerging(false);
    }
  }, [photo, signature, layout, sizeMode, widthMm, heightMm, dpi, widthPx, heightPx, limitKb, maxKb]);

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

          <fieldset>
            <legend className="eyebrow mb-2 block text-xs">Output size</legend>
            <div className="flex flex-wrap gap-2">
              {([
                ["auto", "Keep as is"],
                ["mm", "Size in mm"],
                ["px", "Size in pixels"],
              ] as [SizeMode, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => changed(setSizeMode)(val)}
                  aria-pressed={sizeMode === val}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    sizeMode === val
                      ? "border-brand bg-brand text-white"
                      : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
            {sizeMode === "mm" && (
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <NumberInput label="Width" value={widthMm} onChange={changed(setWidthMm)} min={10} max={300} suffix="mm" />
                <NumberInput label="Height" value={heightMm} onChange={changed(setHeightMm)} min={10} max={300} suffix="mm" />
                <label className="text-sm">
                  <span className="mb-1 block text-xs text-muted-foreground">DPI</span>
                  <select
                    value={dpi}
                    onChange={(e) => changed(setDpi)(Number(e.target.value))}
                    className="h-10 rounded-md border border-hairline-strong bg-background px-2 text-[14px]"
                  >
                    <option value={200}>200</option>
                    <option value={300}>300</option>
                  </select>
                </label>
              </div>
            )}
            {sizeMode === "px" && (
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <NumberInput label="Width" value={widthPx} onChange={changed(setWidthPx)} min={50} max={4000} suffix="px" />
                <NumberInput label="Height" value={heightPx} onChange={changed(setHeightPx)} min={50} max={4000} suffix="px" />
              </div>
            )}
            {sizeMode !== "auto" && (
              <p className="mt-2 text-xs text-muted-foreground">
                The merged image is fitted inside this size on white, never stretched.
              </p>
            )}
          </fieldset>

          <div className="flex flex-wrap items-end gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={limitKb}
                onChange={(e) => changed(setLimitKb)(e.target.checked)}
                className="h-4 w-4"
              />
              Keep the file under
            </label>
            {limitKb && (
              <>
                <NumberInput label="Limit" value={maxKb} onChange={changed(setMaxKb)} min={5} max={5000} suffix="KB" />
                {/* The limits forms most often state (competitors lead with them). */}
                <div className="flex gap-1.5">
                  {[20, 50, 100].map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => changed(setMaxKb)(kb)}
                      aria-pressed={maxKb === kb}
                      className={`h-10 rounded-md border px-3 text-sm font-medium transition-colors ${
                        maxKb === kb
                          ? "border-brand bg-brand text-white"
                          : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!resultBlob && (
            <Button variant="cta" onClick={merge} disabled={merging}>
              {merging && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />}
              Merge into one image
            </Button>
          )}
          {notice && (
            <p role="alert" className="text-sm text-amber-700 dark:text-amber-300">
              {notice}
            </p>
          )}
        </>
      )}

      {resultUrl && resultBlob && (
        <div className="space-y-3">
          <p className="eyebrow text-xs text-muted-foreground">
            Merged result
            {resultInfo && (
              <span className="ml-2 normal-case tracking-normal">
                {resultInfo.width} × {resultInfo.height} px · {formatKb(resultInfo.bytes)}
              </span>
            )}
          </p>
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
          <WorkflowNextSteps
            getBlob={async () => {
              if (!resultBlob) throw new Error("No output");
              return resultBlob;
            }}
            filename="photo-signature.jpg"
            assetKind="photo"
            steps={[
              {
                slug: "resize-kb",
                label: "Compress to KB",
                hint: "Hit exact file size limits for exam and visa portals",
                icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "photo-with-name-date",
                label: "Add Name & Date",
                hint: "Add exam strip with your name, roll number, and date",
                icon: <FileText className="h-4 w-4" strokeWidth={1.75} />,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
