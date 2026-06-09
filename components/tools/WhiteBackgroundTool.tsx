"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { ScanProgress } from "@/components/site/ScanProgress";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { removeBg, compositeFull } from "@/lib/segmentation";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { withTimeout } from "@/lib/withTimeout";

const PRESETS = ["#FFFFFF", "#F5F5F5", "#DCDCDC", "#EFEAD9", "#A4C8E1"];

function Body({ source }: { source: ToolSource }) {
  const [busy, setBusy] = React.useState(false);
  const [hex, setHex] = React.useState("#FFFFFF");
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const cutoutRef = React.useRef<HTMLCanvasElement | null>(null);
  const outRef = React.useRef<HTMLCanvasElement | null>(null);
  const prevUrlRef = React.useRef<string | null>(null);

  // Cut out once on load; re-compositing on colour change is cheap.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      cutoutRef.current = null;
      try {
        const cutout = await withTimeout(
          removeBg(source.file, source.size),
          120000
        );
        if (cancelled) return;
        cutoutRef.current = cutout;
      } catch {
        if (!cancelled) setError("Background removal failed. Try another image.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source, retryCount]);

  // Re-composite whenever the cutout is ready or the colour changes.
  React.useEffect(() => {
    if (!cutoutRef.current || busy) return;
    let cancelled = false;
    (async () => {
      const out = compositeFull(cutoutRef.current!, hex);
      outRef.current = out;
      const blob = await canvasToBlob(out, "image/png");
      if (cancelled) return;
      const newUrl = URL.createObjectURL(blob);
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = newUrl;
      setUrl(newUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [hex, busy]);

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!outRef.current) return;
    const blob = await canvasToBlob(outRef.current, type, 0.95);
    downloadBlob(blob, `solid-background.${type === "image/png" ? "png" : "jpg"}`);
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
      <div className="space-y-2">
        <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
          {error}
        </p>
        <Button variant="outline" size="sm" onClick={() => setRetryCount((c) => c + 1)}>
          Try again
        </Button>
      </div>
    );
  if (!url) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source.url} alt="Original" className="max-h-[260px] w-auto rounded-md" />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-[11px] text-ink-soft">Before</figcaption>
        </figure>
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url ?? source.url} alt="New background" className="max-h-[260px] w-auto rounded-md" />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-[11px] text-ink-soft">After</figcaption>
        </figure>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow">Background</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setHex(p)}
            aria-label={p}
            className={`h-7 w-7 rounded-md border ${hex.toUpperCase() === p ? "border-brand" : "border-hairline-strong"}`}
            style={{ backgroundColor: p }}
          />
        ))}
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded-md border border-hairline-strong bg-transparent"
          aria-label="Custom colour"
        />
        <code className="font-mono text-[13px] text-ink-soft">{hex.toUpperCase()}</code>
      </div>

      <div className="flex gap-2">
        <Button variant="cta" onClick={() => onDownload("image/jpeg")}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> JPG
        </Button>
        <Button variant="outline" onClick={() => onDownload("image/png")}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> PNG
        </Button>
      </div>
    </div>
  );
}

export function WhiteBackgroundTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
