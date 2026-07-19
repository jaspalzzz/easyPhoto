"use client";

import * as React from "react";
import {
  FileImage,
  Loader2,
  Download,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Crop, Image as ImageIcon, Grid2x2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { track } from "@/lib/analytics";
import { detectFace } from "@/lib/faceDetection";
import { computeCrop, renderToCanvas } from "@/lib/headPositioning";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { downloadBlob } from "@/lib/download";

const SPEC_OPTIONS = [
  { id: "india", label: "India — child below 4 (35×45 mm)" },
  { id: "us", label: "USA Passport (51×51 mm)" },
  { id: "uk", label: "UK Passport (35×45 mm)" },
  { id: "eu", label: "EU / Schengen (35×45 mm)" },
  { id: "au", label: "Australia Passport (35×45 mm)" },
];

export function AutoCropTool() {
  const [dragging, setDragging] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [resultCanvas, setResultCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [specId, setSpecId] = React.useState("india");
  const [originalFile, setOriginalFile] = React.useState<File | null>(null);
  const previewRef = React.useRef<HTMLCanvasElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "auto-crop" });
  }, []);

  // Paint the result canvas into the preview element
  React.useEffect(() => {
    if (!resultCanvas || !previewRef.current) return;
    const preview = previewRef.current;
    preview.width = resultCanvas.width;
    preview.height = resultCanvas.height;
    preview.getContext("2d")?.drawImage(resultCanvas, 0, 0);
  }, [resultCanvas]);

  const run = async (file: File, sid: string) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a JPG or PNG image.");
      return;
    }
    const spec = COUNTRY_SPECS[sid];
    if (!spec) {
      setError("Unknown spec. Please select a country.");
      return;
    }

    setBusy(true);
    setError(null);
    setResultCanvas(null);
    setWarnings([]);

    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    }).catch(() => null);
    URL.revokeObjectURL(url);

    if (!img) {
      setBusy(false);
      setError("Could not decode the image.");
      return;
    }

    try {
      const size = { width: img.naturalWidth, height: img.naturalHeight };
      const det = await detectFace(img, size);
      if (!det) {
        setError("No face was detected. Upload a clear front-facing photo with your full head visible.");
        setBusy(false);
        return;
      }

      const result = computeCrop(det, spec, { source: size });
      const canvas = renderToCanvas(img, result);
      setResultCanvas(canvas);
      setWarnings(result.warnings);
      track({ name: "tool_success", tool: "auto-crop" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Auto-crop failed: ${msg}`);
      track({ name: "tool_failure", tool: "auto-crop", reason: "crop" });
    } finally {
      setBusy(false);
    }
  };

  const processFile = (file: File) => {
    setOriginalFile(file);
    run(file, specId);
  };

  const onSpecChange = (sid: string) => {
    setSpecId(sid);
    if (originalFile) run(originalFile, sid);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const download = () => {
    if (!resultCanvas) return;
    resultCanvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `passport-photo-${specId}.jpg`);
    }, "image/jpeg", 0.95);
  };

  const reset = () => {
    setResultCanvas(null);
    setOriginalFile(null);
    setWarnings([]);
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Spec selector — always visible */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Target specification</label>
        <select
          value={specId}
          onChange={(e) => onSpecChange(e.target.value)}
          className="h-10 w-full max-w-xs rounded-lg border border-hairline bg-background px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          {SPEC_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Drop zone — hide once result is ready */}
      {!resultCanvas && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload photo for auto-crop"
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
              <p className="text-sm font-medium text-ink">Detecting face &amp; cropping…</p>
            </div>
          ) : (
            <>
              <FileImage className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-ink">Drop your photo here</p>
                <p className="mt-1 text-sm text-muted-foreground">The face will be detected and centred automatically</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {/* Result */}
      {resultCanvas && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <canvas
              ref={previewRef}
              style={{ width: 160, height: "auto", display: "block" }}
              className="rounded-lg border border-hairline shadow-sm"
              aria-label="Auto-cropped passport photo preview"
            />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-ink">
                Cropped to{" "}
                <span className="text-brand">
                  {resultCanvas.width} × {resultCanvas.height} px
                </span>{" "}
                ({SPEC_OPTIONS.find((o) => o.id === specId)?.label})
              </p>
              <p className="text-xs text-muted-foreground">
                Face centred, head sized to spec. Download and check against the official portal requirements.
              </p>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="space-y-1.5">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-amber-50/60 border border-amber-200/60 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={download} className="gap-2">
              <Download className="h-4 w-4" />
              Download JPG
            </Button>
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              Upload another
            </Button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInput} />
            <Button variant="outline" size="sm" onClick={reset}>
              <RefreshCcw className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </div>

          <WorkflowNextSteps
            getBlob={() =>
              new Promise<Blob>((resolve, reject) =>
                resultCanvas.toBlob(
                  (b) => (b ? resolve(b) : reject(new Error("Could not export the crop."))),
                  "image/jpeg",
                  0.95
                )
              )
            }
            filename={`passport-photo-${specId}.jpg`}
            assetKind="photo"
            steps={[
              { slug: "resize-kb", label: "Resize to KB", hint: "Hit an upload size limit", icon: <Crop className="h-4 w-4" strokeWidth={1.75} /> },
              { slug: "white-background", label: "White background", hint: "Clean plain background", icon: <ImageIcon className="h-4 w-4" strokeWidth={1.75} /> },
              { slug: "print-sheet", label: "Print sheet", hint: "Tile copies for printing", icon: <Grid2x2 className="h-4 w-4" strokeWidth={1.75} /> },
            ]}
          />
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        Face detection and cropping run entirely in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
