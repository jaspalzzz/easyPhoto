"use client";

import * as React from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { removeBg } from "@/lib/segmentation";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";

function Body({ source }: { source: ToolSource }) {
  const [busy, setBusy] = React.useState(false);
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Auto-run on load — background removal is the whole point of this tool.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const cutout = await removeBg(source.file, source.size);
        if (cancelled) return;
        canvasRef.current = cutout;
        setUrl(cutout.toDataURL("image/png"));
      } catch {
        if (!cancelled) setError("Background removal failed. Try another image.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  const onDownload = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, "background-removed.png");
  };

  if (busy)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Removing background…</p>
        <p className="text-xs">First run downloads the AI model — one moment.</p>
      </div>
    );

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!url) return null;

  return (
    <div className="space-y-4">
      <PreviewFrame checker>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Background removed" className="max-h-[360px] w-auto" />
      </PreviewFrame>
      <Button onClick={onDownload}>
        <Download className="h-4 w-4" /> Download transparent PNG
      </Button>
    </div>
  );
}

export function BackgroundRemovalTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
