"use client";

import * as React from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { removeBg, compositeFull } from "@/lib/segmentation";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";

const PRESETS = ["#FFFFFF", "#F5F5F5", "#DCDCDC", "#EFEAD9", "#A4C8E1"];

function Body({ source }: { source: ToolSource }) {
  const [busy, setBusy] = React.useState(false);
  const [hex, setHex] = React.useState("#FFFFFF");
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const cutoutRef = React.useRef<HTMLCanvasElement | null>(null);
  const outRef = React.useRef<HTMLCanvasElement | null>(null);

  // Cut out once on load; re-compositing on colour change is cheap.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const cutout = await removeBg(source.file, source.size);
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
  }, [source]);

  // Re-composite whenever the cutout is ready or the colour changes.
  React.useEffect(() => {
    if (!cutoutRef.current || busy) return;
    const out = compositeFull(cutoutRef.current, hex);
    outRef.current = out;
    setUrl(out.toDataURL("image/png"));
  }, [hex, busy]);

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!outRef.current) return;
    const blob = await canvasToBlob(outRef.current, type, 0.95);
    downloadBlob(blob, `solid-background.${type === "image/png" ? "png" : "jpg"}`);
  };

  if (busy)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Removing background…</p>
      </div>
    );
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!url) return null;

  return (
    <div className="space-y-4">
      <PreviewFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="New background" className="max-h-[360px] w-auto rounded" />
      </PreviewFrame>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Background:</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setHex(p)}
            aria-label={p}
            className={`h-7 w-7 rounded-full border-2 ${hex.toUpperCase() === p ? "border-primary" : "border-border"}`}
            style={{ backgroundColor: p }}
          />
        ))}
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border bg-transparent"
          aria-label="Custom colour"
        />
        <code className="text-xs text-muted-foreground">{hex.toUpperCase()}</code>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onDownload("image/jpeg")}>
          <Download className="h-4 w-4" /> JPG
        </Button>
        <Button variant="outline" onClick={() => onDownload("image/png")}>
          <Download className="h-4 w-4" /> PNG
        </Button>
      </div>
    </div>
  );
}

export function WhiteBackgroundTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
