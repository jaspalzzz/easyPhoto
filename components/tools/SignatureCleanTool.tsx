"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob } from "@/lib/imaging";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";

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

  React.useEffect(() => {
    const base = imageToCanvas(source.image, source.size.width, source.size.height);
    let result = whiteToTransparent(base, {
      threshold,
      softness: 40,
      darkenInk: options.allowDarken && darken,
    });
    if (options.autoCrop) {
      result = trimToContent(result, { mode: "alpha", padding: 12 }).canvas;
    }
    setOut({ url: result.toDataURL("image/png"), canvas: result });
  }, [source, threshold, darken, options.autoCrop, options.allowDarken]);

  const onDownload = async () => {
    if (!out) return;
    const blob = await canvasToBlob(out.canvas, "image/png");
    downloadBlob(blob, options.filename);
  };

  return (
    <div className="space-y-4">
      <PreviewFrame checker>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={out?.url} alt="Transparent signature" className="max-h-[280px] w-auto" />
      </PreviewFrame>

      <label className="block text-sm">
        <span className="mb-1 flex justify-between font-medium">
          <span>Paper removal strength</span>
          <span className="text-muted-foreground">{threshold}</span>
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
          Higher removes more of the paper; lower keeps faint strokes.
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

      <Button onClick={onDownload} disabled={!out}>
        <Download className="h-4 w-4" /> Download transparent PNG
      </Button>
    </div>
  );
}

export function SignatureCleanTool(props: Options) {
  return (
    <ImageToolShell>{(source) => <Body source={source} options={props} />}</ImageToolShell>
  );
}
