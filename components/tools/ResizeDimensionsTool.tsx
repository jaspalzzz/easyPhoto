"use client";

import * as React from "react";
import { Loader2, Download, Link2, Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { picaResizeTo, canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";

function Body({ source }: { source: ToolSource }) {
  const aspect = source.size.width / source.size.height;
  const [width, setWidth] = React.useState(source.size.width);
  const [height, setHeight] = React.useState(source.size.height);
  const [lock, setLock] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<{ url: string; canvas: HTMLCanvasElement } | null>(
    null
  );

  const onWidth = (w: number) => {
    setWidth(w);
    if (lock) setHeight(Math.max(1, Math.round(w / aspect)));
  };
  const onHeight = (h: number) => {
    setHeight(h);
    if (lock) setWidth(Math.max(1, Math.round(h * aspect)));
  };

  const run = async () => {
    setBusy(true);
    try {
      const canvas = await picaResizeTo(source.image, width, height);
      setOut({ url: canvas.toDataURL("image/png"), canvas });
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!out) return;
    const blob = await canvasToBlob(out.canvas, type, 0.95);
    downloadBlob(blob, `resized-${width}x${height}.${type === "image/png" ? "png" : "jpg"}`);
  };

  return (
    <div className="space-y-4">
      <PreviewFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={out?.url ?? source.url}
          alt="To resize"
          className="max-h-[320px] w-auto rounded"
        />
      </PreviewFrame>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Width (px)</span>
          <input
            type="number"
            min={1}
            value={width}
            onChange={(e) => onWidth(Math.max(1, Number(e.target.value) || 0))}
            className="h-10 w-28 rounded-md border border-input bg-background px-3"
          />
        </label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLock((v) => !v)}
          aria-label={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
          title={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
        >
          {lock ? <Link2 className="h-4 w-4" /> : <Link2Off className="h-4 w-4" />}
        </Button>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Height (px)</span>
          <input
            type="number"
            min={1}
            value={height}
            onChange={(e) => onHeight(Math.max(1, Number(e.target.value) || 0))}
            className="h-10 w-28 rounded-md border border-input bg-background px-3"
          />
        </label>
        <Button onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resize"}
        </Button>
      </div>

      {out && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onDownload("image/png")}>
            <Download className="h-4 w-4" /> PNG
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDownload("image/jpeg")}>
            <Download className="h-4 w-4" /> JPG
          </Button>
        </div>
      )}
    </div>
  );
}

export function ResizeDimensionsTool() {
  return <ImageToolShell>{(source) => <Body source={source} />}</ImageToolShell>;
}
