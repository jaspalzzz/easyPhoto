"use client";

import * as React from "react";
import { Loader2, Download, FilePen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import {
  fitToExactFrame,
  flattenForJpeg,
  imageToCanvas,
  pngUnderKb,
} from "@/lib/imaging";
import { compressToCap } from "@/lib/compress";
import { padBlobToMin } from "@/lib/padBytes";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import {
  SignatureInkControls,
  useSignatureInkControls,
} from "./SignatureInkControls";

interface Out {
  url: string;
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  underCap: boolean;
  format: "png" | "jpeg";
}

interface BodyProps {
  source: ToolSource;
  kb: number;
  minKb?: number;
  requiredWidth?: number;
  requiredHeight?: number;
  outputFormat: "png" | "jpeg";
  toolName: string;
}

function Body({
  source,
  kb,
  minKb,
  requiredWidth,
  requiredHeight,
  outputFormat,
  toolName,
}: BodyProps) {
  const [threshold, setThreshold] = React.useState(200);
  const inkControls = useSignatureInkControls(180);
  // The pipeline below is a full-pixel pass + PNG encode loop — far too heavy
  // per slider tick. Recompute only after the user pauses.
  const dThreshold = useDebouncedValue(threshold, 180);
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<Out | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_start", tool: toolName, device: deviceClass() });
  }, [toolName]);

  // Revoke the preview's object URL when replaced or on unmount.
  React.useEffect(() => {
    const url = out?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [out?.url]);

  React.useEffect(() => {
    let cancelled = false;
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const base = imageToCanvas(source.image, source.size.width, source.size.height);
        const transparent = whiteToTransparent(base, {
          threshold: dThreshold,
          softness: 40,
          inkColor: inkControls.inkColor,
          customInkColor: inkControls.customInkColor,
          inkContrast: inkControls.processedInkContrast,
          strokeWidth: inkControls.processedStrokeWidth,
        });
        const trimmed = trimToContent(transparent, { mode: "alpha", padding: 12 }).canvas;
        const hasRequiredDimensions = !!(requiredWidth && requiredHeight);
        const framed = hasRequiredDimensions
          ? await fitToExactFrame(
              trimmed,
              requiredWidth!,
              requiredHeight!,
              outputFormat === "jpeg" ? "#ffffff" : undefined
            )
          : trimmed;

        let blob: Blob;
        let bytes: number;
        let width: number;
        let height: number;
        let underCap: boolean;
        if (outputFormat === "jpeg") {
          const jpegCanvas = hasRequiredDimensions ? framed : flattenForJpeg(framed);
          const res = await compressToCap(jpegCanvas, kb, {
            minScale: hasRequiredDimensions ? 1 : 0.05,
            minDimensions: hasRequiredDimensions
              ? { width: requiredWidth!, height: requiredHeight! }
              : undefined,
            minKb,
            maxQuality: 1,
          });
          blob = res.blob;
          bytes = res.bytes;
          width = res.width;
          height = res.height;
          underCap = res.underCap;
        } else {
          const res = await pngUnderKb(framed, kb, hasRequiredDimensions ? 1 : 0.05);
          blob =
            minKb && res.underCap && res.blob.size < minKb * 1024
              ? await padBlobToMin(res.blob, minKb * 1024)
              : res.blob;
          bytes = blob.size;
          width = res.canvas.width;
          height = res.canvas.height;
          underCap = res.underCap;
        }
        if (cancelled) return;
        setOut({
          // Object URL, not a base64 data URI — a data URI holds a ~1.37×
          // copy of the image as a JS string for every preview.
          url: URL.createObjectURL(blob),
          blob,
          bytes,
          width,
          height,
          underCap,
          format: outputFormat,
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
        if (!cancelled) {
          setError("Couldn't clean this signature. A clearer photo usually fixes it: dark ink on plain white paper, taken in good light without shadows.");
          track({
            name: "tool_failure",
            tool: toolName,
            device: deviceClass(),
            reason: "clean-error",
          });
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    source,
    dThreshold,
    inkControls.inkColor,
    inkControls.customInkColor,
    inkControls.processedInkContrast,
    inkControls.processedStrokeWidth,
    kb,
    minKb,
    requiredWidth,
    requiredHeight,
    outputFormat,
    toolName,
  ]);

  const handleDownload = () => {
    if (!out) return;
    const ext = out.format === "jpeg" ? "jpg" : "png";
    downloadBlob(out.blob, `signature-${kb}kb.${ext}`, toolName);
  };

  return (
    <div className="space-y-4">
      <PreviewFrame checker={outputFormat === "png"}>
        {busy || !out ? (
          <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={out.url}
            alt={outputFormat === "png" ? "Transparent signature" : "Signature on white background"}
            className="max-h-[240px] w-auto"
          />
        )}
      </PreviewFrame>

      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      <label className="block text-sm">
        <span className="mb-1 flex items-center justify-between">
          <span className="eyebrow">Paper removal strength</span>
          <span className="font-mono text-[13px] text-ink-soft">{threshold}</span>
        </span>
        <input
          type="range"
          min={120}
          max={245}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <div className="space-y-4 border-t border-hairline pt-4">
        <SignatureInkControls controls={inkControls} idPrefix="sig-kb-ink" />
      </div>

      {out && !busy && (
        <div className="space-y-2 rounded-md border border-hairline bg-card p-3 text-sm">
          <p className="font-mono text-[13px]">
            Result: <strong className="font-semibold">{formatKb(out.bytes)}</strong> · {out.width}×
            {out.height}px · {out.format === "jpeg" ? "JPG" : "transparent PNG"}
          </p>
          {minKb && out.bytes < minKb * 1024 && (
            <p className="border-l-2 border-amber-500 pl-3 text-amber-700 dark:text-amber-300">
              This file is below the portal&apos;s {minKb} KB minimum.
            </p>
          )}
          {!out.underCap && (
            <p className="border-l-2 border-amber-500 pl-3 text-amber-700 dark:text-amber-300">
              Couldn&apos;t get under {kb} KB without losing too much detail.
              This is the smallest clean version. Try a tighter scan.
            </p>
          )}
          <Button
            variant="cta"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} /> Download {out.format === "jpeg" ? "JPG" : "PNG"}
          </Button>
        </div>
      )}
      {out && !busy && (
        <WorkflowNextSteps
          getBlob={async () => {
            if (!out) throw new Error("No output");
            return out.blob;
          }}
          filename={`signature-${kb}kb.${out.format === "jpeg" ? "jpg" : "png"}`}
          steps={[
            {
              slug: "sign-image",
              label: "Sign a Photo",
              hint: "Overlay this signature onto any photo or document",
              icon: <FilePen className="h-4 w-4" strokeWidth={1.75} />,
            },
            {
              slug: "photo-signature-merge",
              label: "Merge with Photo",
              hint: "Combine signature and photo for exam applications",
              icon: <Layers className="h-4 w-4" strokeWidth={1.75} />,
            },
          ]}
        />
      )}
    </div>
  );
}

export function SignatureKbTool({
  kb = 20,
  minKb,
  requiredWidth,
  requiredHeight,
  outputFormat = "png",
  toolName = "signature-kb",
}: {
  kb?: number;
  minKb?: number;
  requiredWidth?: number;
  requiredHeight?: number;
  outputFormat?: "png" | "jpeg";
  toolName?: string;
}) {
  React.useEffect(() => {
    track({ name: "tool_view", tool: toolName });
  }, [toolName]);

  return (
    <ImageToolShell
      uploaderTitle="Drop your signature, or click to browse"
      uploaderHint="A scan or photo of your signature on white paper works best"
    >
      {(source) => (
        <Body
          source={source}
          kb={kb}
          minKb={minKb}
          requiredWidth={requiredWidth}
          requiredHeight={requiredHeight}
          outputFormat={outputFormat}
          toolName={toolName}
        />
      )}
    </ImageToolShell>
  );
}
