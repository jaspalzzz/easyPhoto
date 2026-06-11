"use client";

import * as React from "react";
import { Loader2, Download, AlertCircle, Calendar, User, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { compressToCap } from "@/lib/compress";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { track, deviceClass } from "@/lib/analytics";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

// Returns today as YYYY-MM-DD (value format for type='date' inputs).
function getTodayIsoString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Convert a YYYY-MM-DD string to DD/MM/YYYY for display on the photo.
function isoToDmy(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso; // fallback: return as-is
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

interface Preset {
  id: string;
  name: string;
  specId: string | null;
  width: number | null;
  height: number | null;
  ar: number;
  kb: number;
}

const DEFAULT_AR = 3.5 / 4.5;

/**
 * Build a preset from the spec registry — never hardcode KB/dimension numbers,
 * so presets stay in lock-step with the single source of truth (and its
 * verification status). Falls back gracefully if a spec is missing.
 */
function presetFromSpec(id: string, label: string, specId: string): Preset {
  const s = getPortalSpec(specId);
  const dims =
    s?.photoWidthPx && s?.photoHeightPx ? `${s.photoWidthPx}×${s.photoHeightPx}px` : "";
  const kbRange = s
    ? s.photoMinKb
      ? `${s.photoMinKb}–${s.photoLimitKb} KB`
      : `≤${s.photoLimitKb} KB`
    : "";
  const detail = [dims, kbRange].filter(Boolean).join(", ");
  return {
    id,
    name: detail ? `${label} (${detail})` : label,
    specId,
    width: s?.photoWidthPx ?? null,
    height: s?.photoHeightPx ?? null,
    ar: s?.photoAspectRatio ?? DEFAULT_AR,
    kb: s?.photoLimitKb ?? 100,
  };
}

const PRESETS: Preset[] = [
  presetFromSpec("ssc", "SSC Preset", "ssc"),
  presetFromSpec("upsc", "UPSC Preset", "upsc"),
  presetFromSpec("passport", "Passport Seva", "passport-seva"),
  { id: "custom", name: "Custom / Free Resize", specId: null, width: null, height: null, ar: DEFAULT_AR, kb: 100 },
];

interface RenderOptions {
  name: string;
  date: string;
  stripHeightPercent: number;
}

function drawNameDateStrip(
  imgCanvas: HTMLCanvasElement,
  options: RenderOptions
): HTMLCanvasElement {
  const w = imgCanvas.width;
  const h = imgCanvas.height;
  
  const s = Math.round(h * (options.stripHeightPercent / 100));
  
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h + s;
  
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context");
  
  // Fill background white
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, out.width, out.height);
  
  // Draw main cropped image
  ctx.drawImage(imgCanvas, 0, 0);
  
  // Draw white strip at the bottom (covers any image bleed)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, h, w, s);
  
  // Draw a thin grey border at the top of the strip to separate photo from text area
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w, h);
  ctx.stroke();

  // Draw text
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  const textLines: string[] = [];
  if (options.name.trim()) textLines.push(options.name.trim().toUpperCase());
  if (options.date.trim()) textLines.push(options.date.trim().toUpperCase());
  
  // Autoscale font size
  const fontSize = Math.round(s * 0.3);
  
  if (textLines.length === 1) {
    const textY = h + s / 2;
    let currentFontSize = fontSize;
    ctx.font = `bold ${currentFontSize}px sans-serif`;
    let measured = ctx.measureText(textLines[0]);
    while (measured.width > w * 0.95 && currentFontSize > 8) {
      currentFontSize -= 1;
      ctx.font = `bold ${currentFontSize}px sans-serif`;
      measured = ctx.measureText(textLines[0]);
    }
    ctx.fillText(textLines[0], w / 2, textY);
  } else if (textLines.length === 2) {
    const pad = s * 0.1;
    const lineH = (s - 2 * pad) / 2;
    const y1 = h + pad + lineH * 0.5;
    const y2 = h + pad + lineH * 1.5;
    
    // Line 1
    let currentFontSize1 = fontSize;
    ctx.font = `bold ${currentFontSize1}px sans-serif`;
    let measured1 = ctx.measureText(textLines[0]);
    while (measured1.width > w * 0.95 && currentFontSize1 > 8) {
      currentFontSize1 -= 1;
      ctx.font = `bold ${currentFontSize1}px sans-serif`;
      measured1 = ctx.measureText(textLines[0]);
    }
    ctx.fillText(textLines[0], w / 2, y1);
    
    // Line 2
    let currentFontSize2 = fontSize;
    ctx.font = `bold ${currentFontSize2}px sans-serif`;
    let measured2 = ctx.measureText(textLines[1]);
    while (measured2.width > w * 0.95 && currentFontSize2 > 8) {
      currentFontSize2 -= 1;
      ctx.font = `bold ${currentFontSize2}px sans-serif`;
      measured2 = ctx.measureText(textLines[1]);
    }
    ctx.fillText(textLines[1], w / 2, y2);
  }
  
  return out;
}

function Body({ source, defaultPresetId }: { source: ToolSource; defaultPresetId?: string }) {
  const cropperRef = React.useRef<ReactCropperElement>(null);
  
  const initialPreset = React.useMemo(() => {
    if (defaultPresetId) {
      const p = PRESETS.find((pr) => pr.id === defaultPresetId);
      if (p) return p;
    }
    return PRESETS[0];
  }, [defaultPresetId]);

  const [activePreset, setActivePreset] = React.useState(initialPreset);
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState(getTodayIsoString());
  const [stripHeight, setStripHeight] = React.useState(15);
  const [targetKb, setTargetKb] = React.useState(initialPreset.kb);
  
  const [busy, setBusy] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    url: string;
    bytes: number;
    width: number;
    height: number;
    underCap: boolean;
    blob: Blob;
  } | null>(null);
  const [cropperReady, setCropperReady] = React.useState(false);

  React.useEffect(() => {
    track({ name: "tool_start", tool: "photo-with-name-date", device: deviceClass() });
  }, []);

  // Revoke the download blob's object URL when replaced or on unmount.
  React.useEffect(() => {
    const url = result?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result?.url]);

  // Load portal spec for provenance display
  const spec = activePreset.specId ? getPortalSpec(activePreset.specId) : undefined;
  const provenance = spec ? specProvenance(spec) : undefined;

  // Handle preset change
  const handlePresetChange = (presetId: string) => {
    const p = PRESETS.find((pr) => pr.id === presetId);
    if (!p) return;
    setActivePreset(p);
    setTargetKb(p.kb);
    
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(p.ar);
    }
  };

  // Debounce text/slider inputs so the preview re-renders when typing/dragging
  // pauses, not on every keystroke (each render is a full toDataURL pass).
  const dName = useDebouncedValue(name, 200);
  const dDate = useDebouncedValue(date, 200);
  const dStripHeight = useDebouncedValue(stripHeight, 150);

  // Generate live preview when crop boundaries or text options change
  const updatePreview = React.useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !cropperReady) return;

    // Use low-res crop to keep preview rendering snappy.
    // Pass both width and height when known so the preview aspect ratio
    // matches the final export exactly.
    const croppedCanvas = cropper.getCroppedCanvas(
      activePreset.width && activePreset.height
        ? { width: activePreset.width, height: activePreset.height }
        : { width: 400 }
    );
    if (!croppedCanvas) return;

    try {
      const annotCanvas = drawNameDateStrip(croppedCanvas, {
        name: dName,
        date: isoToDmy(dDate),
        stripHeightPercent: dStripHeight,
      });

      // Object URL, not a base64 data URI: each data URI held a ~1.37× copy
      // of the JPEG as a JS string, re-created on every debounced keystroke.
      annotCanvas.toBlob(
        (b) => {
          if (b) setPreviewUrl(URL.createObjectURL(b));
        },
        "image/jpeg",
        0.9
      );
    } catch (e) {
      console.error("Preview render failed:", e);
    }
  }, [dName, dDate, dStripHeight, activePreset, cropperReady]);

  React.useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Revoke each preview's object URL when replaced or on unmount.
  React.useEffect(() => {
    const url = previewUrl;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [previewUrl]);

  const onDownload = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    setBusy(true);
    setExportError(null);
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    try {
      // Get full resolution cropped canvas for high-quality output
      const croppedCanvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!croppedCanvas) throw new Error("Could not acquire cropped canvas");

      // Draw Name/Date strip at full resolution
      const annotCanvas = drawNameDateStrip(croppedCanvas, {
        name,
        date: isoToDmy(date),
        stripHeightPercent: stripHeight,
      });

      // Compress output canvas to target KB
      const res = await compressToCap(annotCanvas, targetKb, {
        minScale: 0.1,
      });

      // Previous result URL is revoked by the cleanup effect on result change.
      const downloadUrl = URL.createObjectURL(res.blob);
      setResult({
        url: downloadUrl,
        bytes: res.bytes,
        width: res.width,
        height: res.height,
        underCap: res.underCap,
        blob: res.blob,
      });

      const duration = typeof performance !== "undefined" ? performance.now() - t0 : 0;
      track({
        name: "tool_success",
        tool: "photo-with-name-date",
        device: deviceClass(),
        ms: Math.round(duration),
      });

      // Only hand over the file automatically when it meets the KB cap. If it's
      // still over after auto-compression, hold the download — the result panel
      // surfaces the overage with an explicit "Download anyway" — so a
      // non-compliant file is never delivered silently.
      if (res.underCap) {
        downloadBlob(res.blob, `photo-with-name-date.jpg`);
        track({ name: "download", tool: "photo-with-name-date", format: "jpg" });
      }
    } catch (e) {
      // Analytics reason must be a stable CODE, not a free-form message (no PII).
      console.error(e);
      setExportError("Export didn't complete. Closing other browser tabs frees up memory, which usually fixes this — then try again.");
      track({
        name: "tool_failure",
        tool: "photo-with-name-date",
        device: deviceClass(),
        reason: "export-error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Crop Workspace & Real-time preview */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h3 className="eyebrow mb-2">1. Crop Your Photo</h3>
          <div className="overflow-hidden rounded-md border border-hairline bg-paper">
            <Cropper
              ref={cropperRef}
              src={source.url}
              style={{ height: 320, width: "100%" }}
              aspectRatio={activePreset.ar}
              viewMode={1}
              dragMode="move"
              autoCropArea={0.8}
              background={false}
              responsive
              checkOrientation={false}
              guides={true}
              ready={() => {
                setCropperReady(true);
                updatePreview();
              }}
              cropend={updatePreview}
              zoom={updatePreview}
            />
          </div>
        </div>

        {previewUrl && (
          <div>
            <h3 className="eyebrow mb-2">Real-time Result Preview</h3>
            <PreviewFrame>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Real-time preview with Name & Date"
                className="max-h-[300px] w-auto border border-hairline shadow-sm rounded bg-white"
              />
            </PreviewFrame>
          </div>
        )}
      </div>

      {/* Right Column: Customization Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div className="panel p-5 space-y-5">
          {/* Preset Selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Select Exam Preset</label>
            <select
              value={activePreset.id}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full h-10 rounded-md border border-hairline-strong bg-background px-3 text-sm focus:border-brand"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Provenance Block */}
          {provenance && (
            <div className="flex gap-2 rounded-md bg-brand-soft/30 border border-brand/10 p-3 text-xs text-ink-soft leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-brand mt-0.5" />
              <div>
                <span>{provenance.label}. </span>
                {provenance.url && (
                  <a
                    href={provenance.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline font-medium inline-flex items-center gap-0.5"
                  >
                    Confirm on official portal
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5">
              <User className="h-4 w-4 text-ink-soft" />
              Candidate Name
            </label>
            <input
              type="text"
              placeholder="e.g. JASPAL SINGH"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-md border border-hairline-strong bg-background px-3 text-sm font-mono focus:border-brand uppercase placeholder:normal-case placeholder:font-sans"
              maxLength={40}
            />
            <span className="text-xs text-muted-foreground mt-1 block">
              Printed at the bottom in bold black letters.
            </span>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-ink-soft" />
              Date of Photo (DOP)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 rounded-md border border-hairline-strong bg-background px-3 text-sm font-mono focus:border-brand"
            />
            <span className="text-xs text-muted-foreground mt-1 block">
              Usually required to be taken within the last 3 months.
            </span>
          </div>

          {/* Strip Height slider */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-semibold">White Strip Height</span>
              <span className="font-mono text-xs text-ink-soft">{stripHeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={25}
              value={stripHeight}
              onChange={(e) => setStripHeight(Number(e.target.value))}
              className="w-full h-1.5 bg-hairline rounded-lg cursor-pointer accent-brand"
              aria-label="White Strip Height"
              aria-valuemin={10}
              aria-valuemax={25}
              aria-valuenow={stripHeight}
            />
          </div>

          {/* Target KB slider */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-semibold">Target File Size (KB)</span>
              <span className="font-mono text-xs text-ink-soft">Max {targetKb} KB</span>
            </div>
            <input
              type="range"
              min={15}
              max={500}
              value={targetKb}
              onChange={(e) => setTargetKb(Number(e.target.value))}
              className="w-full h-1.5 bg-hairline rounded-lg cursor-pointer accent-brand"
              aria-label="Target File Size in KB"
              aria-valuemin={15}
              aria-valuemax={500}
              aria-valuenow={targetKb}
            />
            <span className="text-xs text-muted-foreground mt-1.5 block">
              Compression adjusts quality automatically to fit under the cap.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <Button variant="cta" onClick={onDownload} className="w-full h-11" disabled={busy || !cropperReady}>
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" strokeWidth={2} />
              ) : (
                <>
                  <Download className="h-4 w-4" strokeWidth={2} />
                  Download &amp; Export JPG
                </>
              )}
            </Button>
            {exportError && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Compression statistics */}
        {result && (
          <div className="rounded-md border border-hairline bg-paper p-4 text-xs space-y-2">
            <p className="font-semibold text-ink">Export Summary:</p>
            <ul className="space-y-1 text-ink-soft font-mono">
              <li>· Actual Size: {formatKb(result.bytes)}</li>
              <li>· Dimensions: {result.width}×{result.height}px</li>
              <li>
                · Status:{" "}
                {result.underCap ? (
                  <span className="text-emerald-700">Compliant size</span>
                ) : (
                  <span className="text-amber-700">Over the {targetKb} KB limit</span>
                )}
              </li>
            </ul>
            {!result.underCap && (
              <div className="space-y-2 border-t border-hairline pt-2">
                <p className="leading-relaxed text-amber-700">
                  Still above the {targetKb} KB limit even after compression — your
                  portal may reject it. Try a smaller strip height or a higher
                  target, or download it anyway.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    downloadBlob(result.blob, "photo-with-name-date.jpg");
                    track({ name: "download", tool: "photo-with-name-date", format: "jpg" });
                  }}
                >
                  <Download className="h-4 w-4" /> Download anyway (over limit)
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-2 text-xs text-muted-foreground px-1">
          <ShieldCheck className="h-4 w-4 shrink-0 text-brand mt-0.5" />
          <p>
            Privacy First: All processing and canvas editing occurs strictly inside your web browser. No photos or data are uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}

export function NameDatePhotoTool({ defaultPresetId }: { defaultPresetId?: string }) {
  React.useEffect(() => {
    track({ name: "tool_view", tool: "photo-with-name-date" });
  }, []);

  return (
    <ImageToolShell>
      {(source) => <Body source={source} defaultPresetId={defaultPresetId} />}
    </ImageToolShell>
  );
}
