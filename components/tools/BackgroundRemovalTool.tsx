"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { ScanProgress } from "@/components/site/ScanProgress";
import { Button } from "@/components/ui/button";
import { CropMarks } from "@/components/site/CropMarks";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { removeBgSmart } from "@/lib/segmentation";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { withTimeout } from "@/lib/withTimeout";

function Body({ source }: { source: ToolSource }) {
  const [busy, setBusy] = React.useState(false);
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Revoke the object URL when it is replaced or the component unmounts,
  // mirroring the cleanup pattern in ResizeKbTool.
  React.useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  // Auto-run on load — background removal is the whole point of this tool.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const cutout = await withTimeout(
          removeBgSmart(source.image, source.file, source.size),
          120000
        );
        if (cancelled) return;
        canvasRef.current = cutout;
        const blob = await canvasToBlob(cutout, "image/png");
        if (cancelled) return;
        setUrl(URL.createObjectURL(blob));
      } catch {
        if (!cancelled) setError("Background removal didn't finish — the first run can take a little longer on a slow connection. Wait a moment and try again; your photo is safe on your device.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source, retryCount]);

  const onDownload = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, "background-removed.png");
  };

  if (busy)
    return (
      <ScanProgress
        label="Removing background…"
        hint="First run sets up the AI — a few seconds. Your photo never leaves your device."
        thumbnailUrl={source.thumbUrl || source.url}
      />
    );

  if (error)
    return (
      <div className="space-y-2">
        <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
          {error}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setError(null);
            setBusy(false);
            setRetryCount((c) => c + 1);
          }}
        >
          Try again
        </Button>
      </div>
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
