"use client";

import * as React from "react";
import { Download, Palette, Crop, Minimize2 } from "lucide-react";
import { ScanProgress } from "@/components/site/ScanProgress";
import { Button } from "@/components/ui/button";
import { CropMarks } from "@/components/site/CropMarks";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { removeBgSmart } from "@/lib/segmentation";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { withTimeout } from "@/lib/withTimeout";
import { track, deviceClass } from "@/lib/analytics";

const TOOL = "background-removal";

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
    track({ name: "tool_start", tool: TOOL, device: deviceClass() });
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
        track({ name: "tool_success", tool: TOOL, device: deviceClass() });
      } catch {
        if (!cancelled) {
          setError("Background removal didn't finish — the first run can take a little longer on a slow connection. Wait a moment and try again; your photo is safe on your device.");
          track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "remove-bg" });
        }
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
    downloadBlob(blob, "background-removed.png", TOOL);
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

      <WorkflowNextSteps
        getBlob={async () => {
          if (!canvasRef.current) throw new Error("No output canvas");
          return canvasToBlob(canvasRef.current, "image/png");
        }}
        filename="photo-no-bg.png"
        steps={[
          {
            slug: "white-background",
            label: "Add White Background",
            hint: "Replace transparency with white or any solid color",
            icon: <Palette className="h-4 w-4" strokeWidth={1.75} />,
          },
          {
            slug: "image-crop",
            label: "Crop to Size",
            hint: "Trim to passport, square, or custom dimensions",
            icon: <Crop className="h-4 w-4" strokeWidth={1.75} />,
          },
          {
            slug: "resize-kb",
            label: "Resize for Portal",
            hint: "Hit exact KB limits for exam and visa portals",
            icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
          },
        ]}
      />
    </div>
  );
}

export function BackgroundRemovalTool() {
  React.useEffect(() => {
    track({ name: "tool_view", tool: TOOL });
  }, []);
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
