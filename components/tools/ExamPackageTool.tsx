"use client";

import * as React from "react";
import {
  Loader2,
  Download,
  FileUp,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PORTAL_PRESETS, PORTAL_KEYS } from "@/lib/portalPresets";
import { specProvenance } from "@/lib/specRegistry";
import { ensureDecodable } from "@/lib/heic";
import { imageToCanvas, pngUnderKb } from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

type Step = "exam" | "photo" | "signature" | "done";

interface AssetResult {
  url: string;
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  compliant: boolean;
  kind: "photo" | "signature";
}

/** Decode a File (incl. HEIC) into a canvas at its natural size. */
async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const decodable = await ensureDecodable(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.src = URL.createObjectURL(decodable);
    im.onload = () => {
      URL.revokeObjectURL(im.src);
      resolve(im);
    };
    im.onerror = (e) => {
      URL.revokeObjectURL(im.src);
      reject(e);
    };
  });
  return imageToCanvas(img, img.naturalWidth, img.naturalHeight);
}

export function ExamPackageTool() {
  const [step, setStep] = React.useState<Step>("exam");
  const [examId, setExamId] = React.useState<string>("");
  const [photo, setPhoto] = React.useState<AssetResult | null>(null);
  const [signature, setSignature] = React.useState<AssetResult | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const spec = examId ? PORTAL_PRESETS[examId] : undefined;
  const needsSignature = !!spec?.sigLimitKb;
  const prov = spec ? specProvenance(spec) : undefined;

  React.useEffect(() => {
    track({ name: "tool_view", tool: "exam-package" });
  }, []);

  const reset = () => {
    if (photo?.url) URL.revokeObjectURL(photo.url);
    if (signature?.url) URL.revokeObjectURL(signature.url);
    setPhoto(null);
    setSignature(null);
    setExamId("");
    setError(null);
    setStep("exam");
  };

  const chooseExam = (id: string) => {
    // Switching to a DIFFERENT exam invalidates already-processed assets — they
    // were sized/compressed to the previous spec's limits — so clear them.
    if (id !== examId) {
      if (photo?.url) URL.revokeObjectURL(photo.url);
      if (signature?.url) URL.revokeObjectURL(signature.url);
      setPhoto(null);
      setSignature(null);
    }
    setExamId(id);
    setError(null);
    setStep("photo");
    track({ name: "tool_start", tool: "exam-package", device: deviceClass() });
  };

  const processPhoto = async (file: File) => {
    if (!spec) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = await fileToCanvas(file);
      const res = await compressToCap(canvas, spec.photoLimitKb, {
        minDimensions:
          spec.photoWidthPx && spec.photoHeightPx
            ? { width: spec.photoWidthPx, height: spec.photoHeightPx }
            : undefined,
      });
      if (photo?.url) URL.revokeObjectURL(photo.url);
      const photoCompliant =
        res.underCap && (!spec.photoMinKb || res.bytes >= spec.photoMinKb * 1024);
      setPhoto({
        url: URL.createObjectURL(res.blob),
        blob: res.blob,
        bytes: res.bytes,
        width: res.width,
        height: res.height,
        compliant: photoCompliant,
        kind: "photo",
      });
    } catch (e) {
      console.error(e);
      setError("Could not process that photo. Try a clear JPG/PNG.");
      track({ name: "tool_failure", tool: "exam-package", device: deviceClass(), reason: "photo-error" });
    } finally {
      setBusy(false);
    }
  };

  const processSignature = async (file: File) => {
    if (!spec?.sigLimitKb) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = await fileToCanvas(file);
      const cleaned = whiteToTransparent(canvas, {
        threshold: 210,
        softness: 35,
        inkColor: "original",
      });
      const { canvas: trimmed, bbox } = trimToContent(cleaned, {
        mode: "alpha",
        padding: 8,
      });
      if (!bbox) throw new Error("No signature detected.");
      // Auto-reduce to fit the KB cap. A signature is simple line-art, so allow a
      // much lower scale floor than the default 0.2 — this lets tight limits
      // (e.g. SSC's 20 KB) be met automatically instead of surfacing a size error.
      const res = await pngUnderKb(trimmed, spec.sigLimitKb, 0.05);
      if (signature?.url) URL.revokeObjectURL(signature.url);
      const sigCompliant =
        res.underCap && (!spec.sigMinKb || res.bytes >= spec.sigMinKb * 1024);
      setSignature({
        url: URL.createObjectURL(res.blob),
        blob: res.blob,
        bytes: res.bytes,
        width: res.canvas.width,
        height: res.canvas.height,
        compliant: sigCompliant,
        kind: "signature",
      });
    } catch (e) {
      console.error(e);
      setError("Could not detect a signature. Use a dark signature on white paper.");
      track({ name: "tool_failure", tool: "exam-package", device: deviceClass(), reason: "signature-error" });
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    setStep("done");
    track({ name: "tool_success", tool: "exam-package", device: deviceClass() });
  };

  const download = (asset: AssetResult) => {
    const ext = asset.kind === "signature" ? "png" : "jpg";
    downloadBlob(asset.blob, `${examId}-${asset.kind}.${ext}`);
    track({ name: "download", tool: "exam-package", format: ext });
  };

  const STEPS: { id: Step; label: string }[] = [
    { id: "exam", label: "Exam" },
    { id: "photo", label: "Photo" },
    ...(needsSignature ? [{ id: "signature" as Step, label: "Signature" }] : []),
    { id: "done", label: "Done" },
  ];
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        {/* Stepper */}
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center gap-2 text-xs font-semibold">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <li
                  aria-current={i === stepIndex ? "step" : undefined}
                  className={`flex items-center gap-1.5 ${
                    i <= stepIndex ? "text-brand" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      i < stepIndex
                        ? "bg-brand text-white"
                        : i === stepIndex
                          ? "border-2 border-brand text-brand"
                          : "border border-hairline-strong"
                    }`}
                  >
                    {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {s.label}
                </li>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {STEPS[stepIndex]?.label} step
        </div>

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Step 1: pick exam */}
        {step === "exam" && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Which exam or form are you applying for?</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PORTAL_KEYS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => chooseExam(id)}
                  className="rounded-md border border-hairline-strong bg-paper px-3 py-2.5 text-left text-sm font-medium transition-colors hover:border-brand hover:bg-brand-soft/30"
                >
                  {PORTAL_PRESETS[id].name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spec banner (steps 2+) */}
        {spec && step !== "exam" && (
          <div className="rounded-md border border-brand/15 bg-brand-soft/20 p-3 text-xs text-ink-soft">
            <strong className="text-brand">{spec.name}</strong> — Photo{" "}
            {spec.photoMinKb ? `${spec.photoMinKb}–` : "≤"}
            {spec.photoLimitKb} KB
            {spec.photoWidthPx ? ` (${spec.photoWidthPx}×${spec.photoHeightPx}px)` : ""}
            {needsSignature
              ? ` · Signature ${spec.sigMinKb ? `${spec.sigMinKb}–` : "≤"}${spec.sigLimitKb} KB`
              : ""}
            {prov && !prov.verified && prov.url ? (
              <>
                {" · "}
                <a href={prov.url} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                  confirm on official source
                </a>
              </>
            ) : null}
          </div>
        )}

        {/* Step 2: photo */}
        {step === "photo" && spec && (
          <StepUpload
            kind="photo"
            label="Upload your passport-style photo"
            asset={photo}
            busy={busy}
            onFile={processPhoto}
            onNext={() => setStep(needsSignature ? "signature" : "done")}
            onBack={() => setStep("exam")}
            nextLabel={needsSignature ? "Next: signature" : "Finish"}
            targetKb={spec.photoLimitKb}
            minKb={spec.photoMinKb}
          />
        )}

        {/* Step 3: signature */}
        {step === "signature" && spec && (
          <StepUpload
            kind="signature"
            label="Upload a scan/photo of your signature"
            asset={signature}
            busy={busy}
            onFile={processSignature}
            onNext={finish}
            onBack={() => setStep("photo")}
            nextLabel="Finish"
            targetKb={spec.sigLimitKb!}
            minKb={spec.sigMinKb}
          />
        )}

        {/* Step 4: done */}
        {step === "done" && (
          <>
            {!photo ? (
              // Guard: no photo available — send back to photo step
              <div className="space-y-3">
                <p className="text-sm text-destructive">No photo found. Please upload your photo first.</p>
                <Button variant="outline" size="sm" onClick={() => setStep("photo")}>
                  <ChevronLeft className="h-4 w-4" /> Back to photo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand" /> Your {spec?.name} package is ready
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AssetCard asset={photo} onDownload={() => download(photo)} />
                  {signature && (
                    <AssetCard asset={signature} onDownload={() => download(signature)} />
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Start over
                </Button>
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  Everything was processed in your browser — nothing was uploaded.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StepUpload({
  kind,
  label,
  asset,
  busy,
  onFile,
  onNext,
  onBack,
  nextLabel,
  targetKb,
  minKb,
}: {
  kind: "photo" | "signature";
  label: string;
  asset: AssetResult | null;
  busy: boolean;
  onFile: (f: File) => void;
  onNext: () => void;
  onBack: () => void;
  nextLabel: string;
  targetKb: number;
  minKb?: number;
}) {
  // Single always-mounted input avoids the dual-ref problem (Fix 2)
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Determine the non-compliance reason for the amber warning (Fix 1 UI)
  const overCap = asset && asset.bytes > targetKb * 1024;
  const belowMin = asset && minKb && asset.bytes < minKb * 1024;

  return (
    <div className="space-y-4">
      {/* Always-mounted hidden input — single ref, no duplication (Fix 2) */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => {
          if (busy) return; // Guard concurrent submissions (Fix 2)
          if (e.target.files?.[0]) {
            onFile(e.target.files[0]);
            // Reset value so the same file can be re-selected after a Replace
            e.target.value = "";
          }
        }}
      />

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft transition-colors hover:text-brand"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Back
      </button>

      {!asset && (
        <div
          role="button"
          tabIndex={0}
          // Guard dropzone interactivity while busy (Fix 3)
          onClick={() => { if (busy) return; inputRef.current?.click(); }}
          onKeyDown={(e) => {
            if (busy) return; // Fix 3
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (busy) return; // Fix 3
            if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
          }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40 ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {busy ? (
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          ) : (
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
          )}
          <p className="font-semibold tracking-tight text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">
            We resize and compress it to the {targetKb} KB limit automatically.
          </p>
        </div>
      )}

      {asset && (
        <>
          <AssetCard asset={asset} />
          {/* Amber warning: over cap (Fix 1 UI) */}
          {overCap && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-xs leading-relaxed text-amber-800">
              Still over the {targetKb} KB limit even after automatic resizing.
              Replace it with a tighter, higher-contrast{" "}
              {kind === "signature"
                ? "signature scan (dark ink on plain white paper)"
                : "photo"}{" "}
              to continue.
            </p>
          )}
          {/* Amber warning: below minimum (Fix 1 UI) */}
          {!overCap && belowMin && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-xs leading-relaxed text-amber-800">
              File is below the {minKb} KB minimum required by this portal.
              Replace it with a higher-quality{" "}
              {kind === "signature" ? "signature scan" : "photo"} to continue.
            </p>
          )}
          <div className="flex gap-2">
            {/* Replace button disabled while busy (Fix 2) */}
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={onNext}
              disabled={!asset.compliant || busy}
            >
              {nextLabel} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function AssetCard({ asset, onDownload }: { asset: AssetResult; onDownload?: () => void }) {
  return (
    <div className="rounded-md border border-hairline bg-paper p-3 space-y-2">
      <div className="flex items-center justify-center rounded bg-accent/5 p-3 h-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.url} alt={asset.kind} className="max-h-full max-w-full object-contain" />
      </div>
      <p className="text-xs font-mono text-ink-soft">
        {asset.kind} · {formatKb(asset.bytes)} · {asset.width}×{asset.height}px{" "}
        {asset.compliant ? (
          <span className="text-emerald-600">✓ compliant</span>
        ) : (
          <span className="text-amber-600">⚠ check size</span>
        )}
      </p>
      {onDownload && (
        <Button size="sm" className="w-full" onClick={onDownload}>
          <Download className="h-4 w-4" /> Download {asset.kind}
        </Button>
      )}
    </div>
  );
}
