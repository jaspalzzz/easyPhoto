"use client";

import * as React from "react";
import { Download, Minimize2, FilePen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { track, deviceClass } from "@/lib/analytics";

const TOOL = "signature-cleaner";

interface Options {
  /** Auto-crop tight to the ink after removing the paper. */
  autoCrop: boolean;
  /** Offer a "make ink solid black" toggle. */
  allowDarken: boolean;
  filename: string;
}

function Body({ source, options }: { source: ToolSource; options: Options }) {
  const [threshold, setThreshold] = React.useState(200);
  const [darken, setDarken] = React.useState(false);
  const [out, setOut] = React.useState<{ url: string; canvas: HTMLCanvasElement } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  // Debounce the slider so the full-res pass runs when dragging pauses, not per tick.
  const debouncedThreshold = useDebouncedValue(threshold, 150);

  React.useEffect(() => {
    track({ name: "tool_start", tool: TOOL, device: deviceClass() });
  }, [source]);

  React.useEffect(() => {
    try {
      setError(null);
      const base = imageToCanvas(source.image, source.size.width, source.size.height);
      let result = whiteToTransparent(base, {
        threshold: debouncedThreshold,
        softness: 40,
        darkenInk: options.allowDarken && darken,
      });
      if (options.autoCrop) {
        result = trimToContent(result, { mode: "alpha", padding: 12 }).canvas;
      }
      setOut({ url: result.toDataURL("image/png"), canvas: result });
      track({ name: "tool_success", tool: TOOL, device: deviceClass() });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process image. Please try again.");
      track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "process" });
    }
  }, [source, debouncedThreshold, darken, options.autoCrop, options.allowDarken]);

  const onDownload = async () => {
    if (!out) return;
    const blob = await canvasToBlob(out.canvas, "image/png");
    downloadBlob(blob, options.filename, TOOL);
  };

  return (
    <div className="space-y-4">
      <PreviewFrame checker>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={out?.url} alt="Transparent signature" className="max-h-[280px] w-auto" />
      </PreviewFrame>

      {error && (
        <p className="text-sm text-destructive" role="alert">
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
          min={100}
          max={250}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-muted-foreground">
          Lower removes darker paper; raise only when faint ink strokes disappear.
        </span>
      </label>

      {options.allowDarken && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={darken}
            onChange={(e) => setDarken(e.target.checked)}
          />
          Make ink solid black
        </label>
      )}

      <Button variant="cta" onClick={onDownload} disabled={!out}>
        <Download className="h-4 w-4" strokeWidth={1.75} /> Download transparent PNG
      </Button>
      {out && (
        <WorkflowNextSteps
          getBlob={async () => canvasToBlob(out.canvas, "image/png")}
          filename="signature-transparent.png"
          steps={[
            {
              slug: "signature-resize",
              label: "Compress to KB",
              hint: "Hit the exact KB limit required by exam portals",
              icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
            },
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

export function SignatureCleanTool(props: Options) {
  React.useEffect(() => {
    track({ name: "tool_view", tool: TOOL });
  }, []);
  return (
    <ImageToolShell>{(source) => <Body source={source} options={props} />}</ImageToolShell>
  );
}
