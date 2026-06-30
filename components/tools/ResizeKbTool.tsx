"use client";

import * as React from "react";
import { Loader2, Download, Share2, Crop, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas } from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { ComplianceReceipt } from "@/components/site/ComplianceReceipt";
import { downloadBlob, shareFile } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

interface BodyProps {
  source: ToolSource;
  defaultKb: number;
  toolName: string;
  /** Portal minimum pixel size — compression won't shrink below this. */
  minWidth?: number;
  minHeight?: number;
  /** Portal minimum file size (KB band floor) — output is padded up to it. */
  minKb?: number;
  /** Portal-mandated scan DPI, written into the JPEG's JFIF header. */
  densityDpi?: number;
  /** Named requirement for the compliance receipt, e.g. "SSC (Staff Selection Commission)". */
  requirementLabel?: string;
}

function Body({ source, defaultKb, toolName, minWidth, minHeight, minKb, densityDpi, requirementLabel }: BodyProps) {
  const [targetKb, setTargetKb] = React.useState(defaultKb);
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
    try {
      const canvas = imageToCanvas(
        source.image,
        source.size.width,
        source.size.height,
        "#ffffff"   // JPEG output — fill white so transparent areas don't go black
      );
      // Compress to the KB cap. If the portal specifies a minimum pixel size,
      // never shrink below it (an undersized photo gets rejected); otherwise
      // allow downscaling to 10% so small KB targets stay reachable.
      const minDimensions =
        minWidth && minHeight ? { width: minWidth, height: minHeight } : undefined;
      const res = await compressToCap(canvas, targetKb, {
        minScale: 0.1,
        minDimensions,
        minKb,
        densityDpi,
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
        blob: res.blob,
        target: targetKb,
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
    downloadBlob(result.blob, `resized-${result.target}kb.jpg`);
    track({
      name: "download",
      tool: toolName,
      format: "jpg",
    });
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
    result.bytes < result.target * 1024 * 0.95;

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
            type="number"
            inputMode="numeric"
            min={5}
            value={targetKb}
            onChange={(e) => setTargetKb(Math.max(5, Number(e.target.value) || 0))}
            className="h-10 w-32 rounded-md border border-hairline-strong bg-background px-3 font-mono text-[13px]"
          />
        </label>
        <Button variant="cta" onClick={run} disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            "Compress to size"
          )}
        </Button>
        {minWidth && minHeight ? (
          <span className="text-xs text-muted-foreground">
            Kept at ≥ {minWidth}×{minHeight}px
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
                  (!minKb || result.bytes >= minKb * 1024),
              },
              ...(minWidth && minHeight
                ? [
                    {
                      label: "Dimensions",
                      value: `${result.width}×${result.height}px (min ${minWidth}×${minHeight})`,
                      ok:
                        result.width >= minWidth && result.height >= minHeight,
                    },
                  ]
                : []),
              { label: "Format", value: "JPG", ok: true },
            ]}
          />
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
          {minWidth && minHeight && (result.width < minWidth || result.height < minHeight) && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
              Your original photo doesn&apos;t have enough pixels for this
              portal&apos;s {minWidth}×{minHeight}px minimum. Retake with your
              phone&apos;s main (back) camera, or use a less-cropped original.
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
            steps={[
              {
                slug: "photo-with-name-date",
                label: "Add Name & Date",
                hint: "Add exam strip with your name, roll number, and date",
                icon: <FileText className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "image-crop",
                label: "Crop Image",
                hint: "Trim margins or adjust framing before submitting",
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
  minWidth,
  minHeight,
  minKb,
  densityDpi,
  requirementLabel,
}: {
  defaultKb?: number;
  toolName?: string;
  minWidth?: number;
  minHeight?: number;
  /** Portal minimum file size (KB band floor) — output is padded up to it. */
  minKb?: number;
  /** Portal-mandated scan DPI, written into the JPEG's JFIF header. */
  densityDpi?: number;
  /** Named requirement for the compliance receipt, e.g. "SSC (Staff Selection Commission)". */
  requirementLabel?: string;
}) {
  React.useEffect(() => {
    track({ name: "tool_view", tool: toolName });
  }, [toolName]);

  return (
    <ImageToolShell>
      {(source) => (
        <Body
          source={source}
          defaultKb={defaultKb}
          toolName={toolName}
          minWidth={minWidth}
          minHeight={minHeight}
          minKb={minKb}
          densityDpi={densityDpi}
          requirementLabel={requirementLabel}
        />
      )}
    </ImageToolShell>
  );
}
