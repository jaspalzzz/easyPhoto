"use client";

import * as React from "react";
import {
  Loader2,
  Download,
  FileUp,
  ShieldCheck,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToolIconTile } from "@/components/site/ToolIcon";
import { PORTAL_PRESETS, PORTAL_KEYS, type PortalSpec } from "@/lib/portalPresets";
import {
  specProvenance,
  portalCategory,
  photoDimsPx,
  PORTAL_CATEGORY_LABEL,
  type PortalCategory,
} from "@/lib/specRegistry";
import { ensureDecodable } from "@/lib/heic";
import { imageToCanvas, pngUnderKb } from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { padBlobToMin } from "@/lib/padBytes";
import { ComplianceReceipt } from "@/components/site/ComplianceReceipt";
import { ToolLimitationsNotice } from "@/components/site/ToolLimitationsNotice";
import { useExamSearch } from "@/components/tools/ExamSearch";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

type Step = "exam" | "photo" | "signature" | "done";

const photoKbText = (s: PortalSpec) =>
  s.photoMinKb ? `${s.photoMinKb}–${s.photoLimitKb} KB` : `≤ ${s.photoLimitKb} KB`;
const sigKbText = (s: PortalSpec) =>
  s.sigLimitKb
    ? s.sigMinKb
      ? `${s.sigMinKb}–${s.sigLimitKb} KB`
      : `≤ ${s.sigLimitKb} KB`
    : null;

/** Display order of exam categories in the picker. */
const CATEGORY_ORDER: PortalCategory[] = [
  "central",
  "banking",
  "state-psc",
  "national",
  "defence",
  "visa",
];

const GROUPED_EXAMS = CATEGORY_ORDER.map((cat) => ({
  cat,
  label: PORTAL_CATEGORY_LABEL[cat],
  items: PORTAL_KEYS.map((k) => PORTAL_PRESETS[k]).filter(
    (s) => portalCategory(s.id) === cat
  ),
})).filter((g) => g.items.length > 0);

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
  return imageToCanvas(img, img.naturalWidth, img.naturalHeight, "#ffffff");
}

export function ExamPackageTool() {
  const [step, setStep] = React.useState<Step>("exam");
  const [examId, setExamId] = React.useState<string>("");
  const [photo, setPhoto] = React.useState<AssetResult | null>(null);
  const [signature, setSignature] = React.useState<AssetResult | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { query: examQuery, setQuery: setExamQuery } = useExamSearch();

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
    track({ name: "exam_select", exam: id });
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
        // Portals reject files below the band's floor too — pad up to it.
        minKb: spec.photoMinKb,
        densityDpi: spec.dpi,
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
      // Portals reject signatures below the band's floor too — pad up to it
      // (inert PNG chunk; the drawn pixels are untouched).
      const sigBlob =
        spec.sigMinKb && res.underCap && res.blob.size < spec.sigMinKb * 1024
          ? await padBlobToMin(res.blob, spec.sigMinKb * 1024)
          : res.blob;
      if (signature?.url) URL.revokeObjectURL(signature.url);
      const sigCompliant =
        res.underCap && (!spec.sigMinKb || sigBlob.size >= spec.sigMinKb * 1024);
      setSignature({
        url: URL.createObjectURL(sigBlob),
        blob: sigBlob,
        bytes: sigBlob.size,
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
    downloadBlob(asset.blob, `${examId}-${asset.kind}.${ext}`, "exam-package");
  };

  const [zipping, setZipping] = React.useState(false);

  /** Bundle every processed asset into one portal-named ZIP, with a README that
   *  documents the spec each file was sized to — the "ready to upload" kit. */
  const downloadKit = async () => {
    if (!spec || !photo) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const base = examId;
      zip.file(`${base}-photo.jpg`, photo.blob);
      if (signature) zip.file(`${base}-signature.png`, signature.blob);

      const examName = spec.name;
      const readme = [
        `${examName} — application photo & signature kit`,
        `Generated free at easyphoto.in — nothing was uploaded; everything was`,
        `processed in your browser.`,
        ``,
        `Files in this kit:`,
        `  • ${base}-photo.jpg   — ${photo.width}x${photo.height}px, ${formatKb(photo.bytes)}`,
        signature
          ? `  • ${base}-signature.png — ${signature.width}x${signature.height}px, ${formatKb(signature.bytes)}`
          : null,
        ``,
        `Spec this kit was sized to:`,
        `  • Photo limit: ${spec.photoMinKb ? `${spec.photoMinKb}–` : "≤ "}${spec.photoLimitKb} KB`,
        spec.sigLimitKb
          ? `  • Signature limit: ${spec.sigMinKb ? `${spec.sigMinKb}–` : "≤ "}${spec.sigLimitKb} KB`
          : null,
        prov?.url ? `  • Official source: ${prov.url}` : null,
        ``,
        `Always confirm against the official portal before you submit.`,
      ]
        .filter((l) => l !== null)
        .join("\n");
      zip.file(`${base}-README.txt`, readme);

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${base}-application-kit.zip`, "exam-package");
    } catch (e) {
      console.error(e);
      setError("Could not build the ZIP. Download the files individually below.");
    } finally {
      setZipping(false);
    }
  };

  const STEPS: { id: Step; label: string }[] = [
    { id: "exam", label: "Exam" },
    { id: "photo", label: "Photo" },
    ...(needsSignature ? [{ id: "signature" as Step, label: "Signature" }] : []),
    { id: "done", label: "Done" },
  ];
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <Card className="min-w-0">
      <CardContent className="min-w-0 space-y-6 p-4 sm:p-6">
        {/* Stepper — premium progress bar with connecting fill */}
        <nav aria-label="Progress">
          <ol role="list" className="flex min-w-0 items-center">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <li
                  aria-current={i === stepIndex ? "step" : undefined}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i < stepIndex
                        ? "bg-brand text-white"
                        : i === stepIndex
                          ? "bg-brand/10 text-brand ring-2 ring-brand"
                          : "bg-muted text-ink-faint"
                    }`}
                  >
                    {i < stepIndex ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span
                    className={`hidden text-sm font-semibold sm:inline ${
                      i <= stepIndex ? "text-ink" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                      i < stepIndex ? "bg-brand" : "bg-hairline"
                    }`}
                  />
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

        {/* Step 1: pick exam — grouped premium cards with the spec preview */}
        {step === "exam" && (() => {
          const q = examQuery.trim().toLowerCase();
          const filteredGroups = GROUPED_EXAMS.map((group) => ({
            ...group,
            items: group.items.filter(
              (s) =>
                !q ||
                s.name.toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q)
            ),
          })).filter((g) => g.items.length > 0);

          return (
          <div className="min-w-0 space-y-6">
            <div className="flex items-start gap-3">
              <ToolIconTile name="FileStack" category="exam" />
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-ink">
                  Which exam or form are you applying for?
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Pick your exam — we&apos;ll size your photo &amp; signature to the
                  selected published requirements, then bundle them for upload.
                </p>
              </div>
            </div>

            {examQuery.trim() && (
              <p className="text-[13px] text-muted-foreground">
                Showing exams matching “{examQuery.trim()}” —{" "}
                <button
                  type="button"
                  onClick={() => setExamQuery("")}
                  className="font-semibold text-brand hover:underline"
                >
                  clear
                </button>
              </p>
            )}

            {filteredGroups.length === 0 && (
              <div className="rounded-xl border border-dashed border-hairline-strong p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No exam matches “{examQuery.trim()}”.
                </p>
                <button
                  type="button"
                  onClick={() => setExamQuery("")}
                  className="mt-2 text-[13px] font-semibold text-brand hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}

            {filteredGroups.map((group) => (
              <div key={group.cat} className="min-w-0 space-y-2.5">
                <h4 className="eyebrow text-ink-soft">{group.label}</h4>
                <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((s) => {
                    const sig = sigKbText(s);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => chooseExam(s.id)}
                        className="ep-card group flex min-w-0 flex-col gap-2 p-3.5 text-left"
                      >
                        <span className="flex min-w-0 items-center justify-between gap-2">
                          <span className="min-w-0 break-words font-semibold text-ink">
                            {s.name.split(" (")[0]}
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
                        </span>
                        <span className="flex min-w-0 flex-wrap gap-1.5">
                          <span className="rounded-md bg-[hsl(174_72%_30%/0.10)] px-2 py-0.5 font-mono text-xs font-medium text-[hsl(174_72%_28%)]">
                            Photo {photoKbText(s)}
                          </span>
                          {sig && (
                            <span className="rounded-md bg-[hsl(8_75%_45%/0.10)] px-2 py-0.5 font-mono text-xs font-medium text-[hsl(8_75%_45%)]">
                              Sign {sig}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          );
        })()}

        {/* Spec banner (steps 2+) — premium amber-accented card */}
        {spec && step !== "exam" && (
          <div className="flex items-start gap-3 rounded-xl border border-[hsl(33_85%_45%/0.25)] bg-[hsl(33_92%_46%/0.06)] p-3.5">
            <ToolIconTile name="FileStack" category="exam" size="sm" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-ink">{spec.name.split(" (")[0]}</p>
              <p className="mt-0.5 font-mono text-[12px] leading-relaxed text-ink-soft">
                Photo {photoKbText(spec)}
                {photoDimsPx(spec) ? ` · ${photoDimsPx(spec)}` : ""}
                {needsSignature && sigKbText(spec) ? ` · Signature ${sigKbText(spec)}` : ""}
              </p>
              {prov && !prov.verified && prov.url ? (
                <a
                  href={prov.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[12px] font-medium text-brand underline"
                >
                  Confirm on the official source
                </a>
              ) : null}
            </div>
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

                {/* The compliance receipt — the verdict the applicant came for. */}
                {spec && (
                  <ComplianceReceipt
                    requirement={spec.name.split(" (")[0]}
                    checks={[
                      {
                        label: "Photo size",
                        value: spec.photoMinKb
                          ? `${formatKb(photo.bytes)} (needs ${spec.photoMinKb}–${spec.photoLimitKb} KB)`
                          : `${formatKb(photo.bytes)} (needs ≤ ${spec.photoLimitKb} KB)`,
                        ok: photo.compliant,
                      },
                      ...(signature && spec.sigLimitKb
                        ? [
                            {
                              label: "Signature size",
                              value: spec.sigMinKb
                                ? `${formatKb(signature.bytes)} (needs ${spec.sigMinKb}–${spec.sigLimitKb} KB)`
                                : `${formatKb(signature.bytes)} (needs ≤ ${spec.sigLimitKb} KB)`,
                              ok: signature.compliant,
                            },
                          ]
                        : []),
                      { label: "Format", value: signature ? "JPG + PNG" : "JPG", ok: true },
                    ]}
                  />
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <AssetCard asset={photo} onDownload={() => download(photo)} />
                  {signature && (
                    <AssetCard asset={signature} onDownload={() => download(signature)} />
                  )}
                </div>

                {/* Primary action: one portal-named ZIP with every file + a README.
                    h-auto + whitespace-normal override the Button component's
                    default single-line-fixed-height styling — with the
                    "(photo + signature)" suffix, this text is long enough to
                    overflow past the pill's edge on narrow phones instead of
                    wrapping (button.tsx's base classes are whitespace-nowrap
                    with no overflow clipping, so overflow was rendering
                    visibly outside the button rather than being hidden). */}
                <Button
                  variant="cta"
                  className="h-auto w-full whitespace-normal py-3 text-center leading-snug"
                  onClick={downloadKit}
                  disabled={zipping}
                >
                  {zipping ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" strokeWidth={1.75} />
                  ) : (
                    <Download className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  )}
                  Download all as ZIP
                  {signature ? " (photo + signature)" : ""}
                </Button>

                {/* What now — the moment after download is where applicants
                    feel most alone; walk them to the portal. */}
                <div className="rounded-lg border border-hairline bg-paper p-4 text-sm">
                  <p className="font-semibold text-ink">Next steps</p>
                  <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-muted-foreground">
                    <li>Log in to the {spec?.name.split(" (")[0]} application portal.</li>
                    <li>Upload these files where the form asks for photo{signature ? " and signature" : ""}.</li>
                    <li>
                      Double-check the live form&apos;s stated limits match{" "}
                      <span className="font-mono text-[13px]">{photoKbText(spec!)}</span> — portals
                      occasionally change them between cycles.
                    </li>
                  </ol>
                </div>

                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Prepare another exam
                </Button>
                <ToolLimitationsNotice
                  summary="Checks measurable file properties such as dimensions and file size. The package builder does not assess every visual photo or signature requirement, and it cannot guarantee acceptance — verify the current application instructions on the official portal."
                  canCheck={[
                    "Generated photo and signature file sizes",
                    "Output format and encoded dimensions used by this workflow",
                  ]}
                  cannotCheck={[
                    "Identity, recency, expression, or signature authenticity",
                    "Requirements not included in the selected preset",
                    "The portal or reviewing authority’s final decision",
                  ]}
                />
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
          onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.dataset.dragging = "1";
            }}
            onDragLeave={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
            onDropCapture={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
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
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-xs leading-relaxed text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
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
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-xs leading-relaxed text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
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
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Check className="h-3 w-3" strokeWidth={2.25} /> compliant
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-600">
            <AlertTriangle className="h-3 w-3" strokeWidth={2.25} /> check size
          </span>
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
