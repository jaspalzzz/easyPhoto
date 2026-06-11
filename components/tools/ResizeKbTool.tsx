"use client";

import * as React from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas } from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { downloadBlob } from "@/lib/download";
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
}

function Body({ source, defaultKb, toolName, minWidth, minHeight, minKb, densityDpi }: BodyProps) {
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
        source.size.height
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
      setError("Compression failed. Try a smaller target or a different image.");
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, `resized-${targetKb}kb.jpg`);
    track({
      name: "download",
      tool: toolName,
      format: "jpg",
    });
  };

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
        <p className="border-l-2 border-red-500 bg-red-50/60 py-2 pl-3 pr-2 text-red-900 text-sm">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-2 rounded-md border border-hairline bg-paper p-3 text-sm">
          <p>
            Original:{" "}
            <strong className="spec text-ink">{formatKb(source.file.size)}</strong>
            {" "}·{" "}
            Result:{" "}
            <strong className="spec text-ink">{formatKb(result.bytes)}</strong> ·{" "}
            <span className="font-mono text-[13px]">
              {result.width}×{result.height}px
            </span>{" "}
            · quality{" "}
            <span className="font-mono text-[13px]">
              {result.quality.toFixed(2)}
            </span>
            {result.scale < 1 ? ` · resized to fit` : ""}
          </p>
          {!result.underCap && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-amber-900">
              Couldn&apos;t get under {targetKb} KB even at minimum quality. This
              is the smallest achievable. Try a lower target or smaller image.
            </p>
          )}
          {minWidth && minHeight && (result.width < minWidth || result.height < minHeight) && (
            <p className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-amber-900">
              Below the required {minWidth}×{minHeight}px minimum — your source
              image is too small for this portal, so it may be rejected. Upload a
              higher-resolution photo.
            </p>
          )}
          <Button
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG
          </Button>
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
}: {
  defaultKb?: number;
  toolName?: string;
  minWidth?: number;
  minHeight?: number;
  /** Portal minimum file size (KB band floor) — output is padded up to it. */
  minKb?: number;
  /** Portal-mandated scan DPI, written into the JPEG's JFIF header. */
  densityDpi?: number;
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
        />
      )}
    </ImageToolShell>
  );
}
