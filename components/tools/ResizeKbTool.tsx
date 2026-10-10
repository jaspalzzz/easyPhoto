"use client";

import * as React from "react";
import { useNumericField } from "@/components/tool/useNumericField";
import { useUrlKbTarget } from "@/components/tool/useUrlKbTarget";
import { WORKFLOW_GENERIC_IMAGE_KINDS } from "@/lib/workflowHandoff";
import { Loader2, Download, Share2, Crop, FileStack, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import {
  cropAndResizeToExact,
  cropToAspectRatio,
  imageToCanvas,
  matchesAspectRatio,
  picaResizeTo,
  sideRangeScale,
} from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { ComplianceReceipt } from "@/components/site/ComplianceReceipt";
import { downloadBlob, shareFile } from "@/lib/download";
import { formatKb, kbCapBytes, kbFloorBytes, minCapKbForFloor } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";
import {
  examPhotoNextAction,
  type ExamPhotoWorkflowFlags,
} from "@/lib/examWorkflow";

/** Upper bound for a `?target=` preset — anything larger is not a real form limit. */
const MAX_URL_TARGET_KB = 10_000;

interface BodyProps {
  source: ToolSource;
  defaultKb: number;
  toolName: string;
  /** Published portal output dimensions. When present, the export is exact. */
  requiredWidth?: number;
  requiredHeight?: number;
  /** Published width/height ratio when the portal does not publish fixed pixels. */
  requiredAspectRatio?: number;
  /** Published pixel range per side (OCI: 200–900) when there's no exact size. */
  sidePx?: { min: number; max: number };
  /** Portal minimum file size (KB band floor) — output is padded up to it. */
  minKb?: number;
  /** Portal-mandated scan DPI, written into the JPEG's JFIF header. */
  densityDpi?: number;
  /** Named requirement for the compliance receipt, e.g. "SSC (Staff Selection Commission)". */
  requirementLabel?: string;
  /** Registry-derived routing for an embedded exam photo result. */
  examWorkflow?: ExamPhotoWorkflowFlags;
  /** Reports the currently-loaded source up to a parent that embeds this tool
   *  inline (e.g. a photo/signature tab switcher) so it can hand the same
   *  file to a sibling tool instead of losing it on switch. */
  onSourceChange?: (source: ToolSource | null) => void;
}

function Body({ source, defaultKb, toolName, requiredWidth, requiredHeight, requiredAspectRatio, sidePx, minKb, densityDpi, requirementLabel, examWorkflow, onSourceChange }: BodyProps) {
  React.useEffect(() => {
    onSourceChange?.(source);
    return () => onSourceChange?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);
  const [targetKb, setTargetKb] = React.useState(defaultKb);
  // Shared numeric-field behaviour: the field holds what you type (including an
  // empty string) and only clamps on blur, so a target whose first digit is
  // below the floor stays typeable. See components/tool/useNumericField.
  // Lowest target: above a portal floor far enough that the padded file still
  // fits the cap when 1 KB is counted as 1000 bytes (IBPS 20 KB floor → 21).
  const minTarget = minKb ? minCapKbForFloor(minKb) : 5;
  const kbField = useNumericField(targetKb, setTargetKb, { min: minTarget });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    url: string;
    bytes: number;
    width: number;
    height: number;
    quality: number;
    scale: number;
    underCap: boolean;
    /** The cap was only met by lowering quality below the normal floor. */
    qualityReduced: boolean;
    blob: Blob;
    /** The KB target this result was produced for (so the receipt/notes don't
     *  go stale if the user edits the field without re-running). */
    target: number;
  } | null>(null);

  React.useEffect(() => {
    track({ name: "tool_start", tool: toolName, device: deviceClass() });
  }, [toolName]);

  // Fix 3: re-apply defaultKb when SPA navigation reuses this component instance
  React.useEffect(() => {
    setTargetKb(defaultKb);
  }, [defaultKb]);

  // Revoke the result's object URL when it's replaced or the tool unmounts,
  // so compressed-image blobs don't leak across runs / navigation.
  React.useEffect(() => {
    const url = result?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result?.url]);

  const run = async () => {
    setBusy(true);
    setError(null);
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    // Clamp once here so a half-typed or below-minimum value (tapping the button
    // before the input blurs, common on mobile) still compresses to a sane
    // target, and reflect the clamped value back into the field.
    const effectiveKb =
      Number.isFinite(targetKb) && targetKb >= minTarget
        ? Math.floor(targetKb)
        : minTarget;
    if (effectiveKb !== targetKb) setTargetKb(effectiveKb);
    try {
      const hasRequiredDimensions = !!(requiredWidth && requiredHeight);
      const hasRequiredAspect =
        !hasRequiredDimensions &&
        !!requiredAspectRatio &&
        Number.isFinite(requiredAspectRatio) &&
        requiredAspectRatio > 0;
      let canvas = hasRequiredDimensions
        ? await cropAndResizeToExact(
            source.image,
            requiredWidth!,
            requiredHeight!,
            "#ffffff"
          )
        : hasRequiredAspect
          ? cropToAspectRatio(source.image, requiredAspectRatio!, "#ffffff")
        : imageToCanvas(
            source.image,
            source.size.width,
            source.size.height,
            "#ffffff" // JPEG output — fill white so transparent areas don't go black
          );
      // A published per-side range (OCI: 200–900 px) is enforced by the portal,
      // so bring the image inside it before compressing.
      const sides = hasRequiredDimensions ? undefined : sidePx;
      if (sides) {
        const scale = sideRangeScale(canvas.width, canvas.height, sides.min, sides.max);
        if (scale !== 1) {
          canvas = await picaResizeTo(canvas, canvas.width * scale, canvas.height * scale);
        }
      }
      // A published width/height is the final output frame, not a lower bound.
      // Start at that exact frame and prevent compression from shrinking it.
      // Portals without published pixels can still scale down to hit a tight cap.
      const minDimensions = hasRequiredDimensions
        ? { width: requiredWidth!, height: requiredHeight! }
        : undefined;
      const res = await compressToCap(canvas, effectiveKb, {
        // Compression may shrink a resizable photo to hit the cap, but never
        // below a published per-side minimum.
        minScale: hasRequiredDimensions
          ? 1
          : sides
            ? Math.min(1, sides.min / Math.min(canvas.width, canvas.height))
            : 0.1,
        minDimensions,
        minKb,
        densityDpi,
        // A fixed pixel frame can't shrink to reach the cap, so let quality
        // drop further there (e.g. Driving Licence 420×525 ≤ 20 KB). Resizable
        // photos keep the normal floor and report "could not fit" instead.
        allowLowQualityFallback: hasRequiredDimensions,
        // "Resize TO a size" tool: let the target actually bind. The default
        // 0.95 ceiling means an already-small image lands byte-identical for
        // every target above its q0.95/full-res size (e.g. 50 KB and 500 KB
        // produced the same file). Allowing full quality lets a larger target
        // keep more fidelity, so distinct targets give distinct results.
        maxQuality: 1,
      });
      // Previous result URL is revoked by the cleanup effect on result change.
      setResult({
        url: URL.createObjectURL(res.blob),
        bytes: res.bytes,
        width: res.width,
        height: res.height,
        quality: res.quality,
        scale: res.scale,
        underCap: res.underCap,
        qualityReduced: res.qualityReduced,
        blob: res.blob,
        target: effectiveKb,
      });

      const duration = typeof performance !== "undefined" ? performance.now() - t0 : 0;
      track({
        name: "tool_success",
        tool: toolName,
        device: deviceClass(),
        ms: Math.round(duration),
      });
    } catch (e) {
      console.error(e);
      track({
        name: "tool_failure",
        tool: toolName,
        device: deviceClass(),
        reason: "compress-error",
      });
      setError("Couldn't compress this image — it may be corrupted. Re-exporting it as a plain JPG from your gallery usually fixes it.");
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, `resized-${result.target}kb.jpg`, toolName);
  };

  const handleShare = async () => {
    if (!result) return;
    await shareFile(result.blob, `resized-${result.target}kb.jpg`, "Resized photo");
  };

  // The source is already at full quality + resolution yet still under the
  // requested target — no portal band applies, so a bigger target can't
  // produce a bigger file without enlarging the image. Surface this instead
  // of silently returning a tiny file (the "50 KB and 500 KB look identical"
  // confusion when the upload was already small).
  const atFullFidelity =
    !!result &&
    result.underCap &&
    !minKb &&
    result.scale >= 0.999 &&
    result.quality >= 0.999 &&
    result.bytes < kbCapBytes(result.target) * 0.95;

  return (
    <div className="space-y-4">
      <div className={result ? "grid grid-cols-2 gap-3" : undefined}>
        <div className="space-y-1">
          {result && (
            <p className="eyebrow text-center text-xs text-muted-foreground">Before</p>
          )}
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source.url}
              alt="Original"
              className="max-h-[320px] w-auto rounded-md"
            />
          </PreviewFrame>
        </div>
        {result && (
          <div className="space-y-1">
            <p className="eyebrow text-center text-xs text-muted-foreground">After</p>
            <PreviewFrame>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Compressed result"
                className="max-h-[320px] w-auto rounded-md"
              />
            </PreviewFrame>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="eyebrow mb-1 block">Target size (KB)</span>
          <input
            type="text"
            aria-label="Target size in KB"
            {...kbField}
            className="h-10 w-32 rounded-md border border-hairline-strong bg-background px-3 font-mono text-[14px]"
          />
        </label>
        <Button variant="cta" onClick={run} disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            "Compress to size"
          )}
        </Button>
        {requiredWidth && requiredHeight ? (
          <span className="text-xs text-muted-foreground">
            Output: {requiredWidth}×{requiredHeight}px
          </span>
        ) : requiredAspectRatio ? (
          <span className="text-xs text-muted-foreground">
            Output width ÷ height: {requiredAspectRatio.toFixed(3)}
          </span>
        ) : null}
      </div>

      {error && (
        <p className="border-l-2 border-red-500 bg-red-50/60 py-2 pl-3 pr-2 text-red-900 text-sm dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          {/* The compliance receipt — the verdict an applicant actually needs. */}
          <ComplianceReceipt
            requirement={requirementLabel ?? `${result.target} KB target`}
            checks={[
              {
                label: "File size",
                value: minKb
                  ? `${formatKb(result.bytes)} (needs ${minKb}–${result.target} KB)`
                  : `${formatKb(result.bytes)} (needs ≤ ${result.target} KB)`,
                ok:
                  result.underCap &&
                  (!minKb || result.bytes >= kbFloorBytes(minKb)),
              },
              ...(requiredWidth && requiredHeight
                ? [
                    {
                      label: "Dimensions",
                      value: `${result.width}×${result.height}px (needs ${requiredWidth}×${requiredHeight})`,
                      ok:
                        result.width === requiredWidth && result.height === requiredHeight,
                    },
                  ]
                : []),
              ...(!requiredWidth && !requiredHeight && requiredAspectRatio
                ? [
                    {
                      label: "Aspect ratio",
                      value: `${result.width}×${result.height}px (width ÷ height ${requiredAspectRatio.toFixed(3)})`,
                      ok: matchesAspectRatio(
                        result.width,
                        result.height,
                        requiredAspectRatio
                      ),
                    },
                  ]
                : []),
              { label: "Format", value: "JPG", ok: true },
            ]}
          />
          {result.qualityReduced && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
              Quality was reduced to fit {result.target} KB at the required size.
              Zoom in and check your face is still sharp — if it looks blurry,
              crop closer or retake the photo in brighter light.
            </p>
          )}
          {!result.underCap && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
              {formatKb(result.bytes)} is the smallest this image can go without
              turning blurry. Cropping closer to the subject usually fixes it —
              or use a slightly higher target if your form allows one.
            </p>
          )}
          {atFullFidelity && (
            <p className="border-l-2 border-brand bg-brand-soft/50 py-2 pl-3 pr-2 text-sm text-foreground">
              This image is already {formatKb(result.bytes)} at full quality —
              comfortably under your {result.target} KB target, so there&apos;s
              nothing to compress. A larger target can&apos;t make it bigger
              without enlarging the image; pick a smaller target if you need to
              shrink it further.
            </p>
          )}
          {requiredWidth && requiredHeight &&
            (result.width !== requiredWidth || result.height !== requiredHeight) && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
              The output could not be prepared at the required {requiredWidth}×
              {requiredHeight}px. Try a clearer, less-cropped original.
            </p>
          )}
          {!requiredWidth &&
            !requiredHeight &&
            requiredAspectRatio &&
            !matchesAspectRatio(result.width, result.height, requiredAspectRatio) && (
              <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
                The output could not retain the published width-to-height ratio.
                Try a larger or clearer original.
              </p>
            )}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="cta" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG ·{" "}
              {formatKb(result.bytes)}
            </Button>
            {"share" in navigator && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" strokeWidth={1.75} /> Share
              </Button>
            )}
            <span className="spec normal-case tracking-[0.06em] text-ink-faint">
              was {formatKb(source.file.size)} · quality {result.quality.toFixed(2)}
            </span>
          </div>

          <WorkflowNextSteps
            getBlob={async () => result.blob}
            filename="resized-photo.jpg"
            assetKind={examWorkflow ? "photo" : "image"}
            rememberForExamKit={!!examWorkflow}
            examId={examWorkflow?.examId}
            steps={examWorkflow
              ? (() => {
                  const next = examPhotoNextAction(examWorkflow);
                  return [{
                    ...next,
                    icon: <FileStack className="h-4 w-4" strokeWidth={1.75} />,
                  }];
                })()
              : [
                  {
                    slug: "compliance-checker",
                    label: "Run a photo pre-check",
                    hint: "Check measurable image issues before using the file",
                    icon: <ScanSearch className="h-4 w-4" strokeWidth={1.75} />,
                  },
                  {
                    slug: "image-crop",
                    label: "Adjust the crop",
                    hint: "Trim the image, then return here to recheck its final KB size",
                    icon: <Crop className="h-4 w-4" strokeWidth={1.75} />,
                  },
                ]}
          />
        </div>
      )}
    </div>
  );
}

export function ResizeKbTool({
  defaultKb = 200,
  toolName = "resize-kb",
  requiredWidth,
  requiredHeight,
  requiredAspectRatio,
  sidePx,
  minKb,
  densityDpi,
  requirementLabel,
  examWorkflow,
  onSourceChange,
  targetFromUrl = false,
}: {
  defaultKb?: number;
  /** Honour a `?target=<kb>` URL preset (the standalone /tools/resize-kb/ page). */
  targetFromUrl?: boolean;
  toolName?: string;
  requiredWidth?: number;
  requiredHeight?: number;
  requiredAspectRatio?: number;
  /** Published pixel range per side (OCI: 200–900) when there's no exact size. */
  sidePx?: { min: number; max: number };
  /** Portal minimum file size (KB band floor) — output is padded up to it. */
  minKb?: number;
  /** Portal-mandated scan DPI, written into the JPEG's JFIF header. */
  densityDpi?: number;
  /** Named requirement for the compliance receipt, e.g. "SSC (Staff Selection Commission)". */
  requirementLabel?: string;
  /** Registry-derived workflow routing for an embedded portal tool. */
  examWorkflow?: ExamPhotoWorkflowFlags;
  /** See BodyProps.onSourceChange. */
  onSourceChange?: (source: ToolSource | null) => void;
}) {
  React.useEffect(() => {
    track({ name: "tool_view", tool: toolName });
  }, [toolName]);
  // Body mounts only after a file is loaded, by which point this has resolved,
  // so the URL preset seeds its target field.
  const urlKb = useUrlKbTarget(targetFromUrl, minKb ? minCapKbForFloor(minKb) : 5, MAX_URL_TARGET_KB);

  return (
    <ImageToolShell acceptedWorkflowKinds={WORKFLOW_GENERIC_IMAGE_KINDS}>
      {(source) => (
        <Body
          source={source}
          defaultKb={urlKb ?? defaultKb}
          toolName={toolName}
          requiredWidth={requiredWidth}
          requiredHeight={requiredHeight}
          requiredAspectRatio={requiredAspectRatio}
          sidePx={sidePx}
          minKb={minKb}
          densityDpi={densityDpi}
          requirementLabel={requirementLabel}
          examWorkflow={examWorkflow}
          onSourceChange={onSourceChange}
        />
      )}
    </ImageToolShell>
  );
}
