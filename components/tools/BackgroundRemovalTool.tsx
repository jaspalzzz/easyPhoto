"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { ScanProgress } from "@/components/site/ScanProgress";
import { Button } from "@/components/ui/button";
import { CropMarks } from "@/components/site/CropMarks";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { removeBg } from "@/lib/segmentation";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { withTimeout } from "@/lib/withTimeout";

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
        const cutout = await withTimeout(
          removeBg(source.file, source.size),
          120000
        );
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
      <ScanProgress
        label="Removing background…"
        hint="First run downloads the AI model — one moment."
        thumbnailUrl={source.url}
      />
    );

  if (error)
    return (
      <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
        {error}
      </p>
    );
  if (!url) return null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <PreviewFrame checker>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Background removed" className="max-h-[360px] w-auto" />
        </PreviewFrame>
        <CropMarks size={16} inset={8} />
      </div>
      <Button variant="cta" onClick={onDownload}>
        <Download className="h-4 w-4" strokeWidth={1.75} /> Download transparent PNG
      </Button>
    </div>
  );
}

export function BackgroundRemovalTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
