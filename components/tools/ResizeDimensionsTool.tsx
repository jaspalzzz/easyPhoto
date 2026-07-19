"use client";

import * as React from "react";
import { WORKFLOW_GENERIC_IMAGE_KINDS } from "@/lib/workflowHandoff";
import { Loader2, Download, Link2, Link2Off, Minimize2, Scissors, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { picaResizeTo, canvasToBlob, flattenForJpeg } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";

function Body({ source }: { source: ToolSource }) {
  const aspect = source.size.width / source.size.height;
  const [widthStr, setWidthStr] = React.useState(String(source.size.width));
  const [heightStr, setHeightStr] = React.useState(String(source.size.height));
  const [width, setWidth] = React.useState(source.size.width);
  const [height, setHeight] = React.useState(source.size.height);
  const [lock, setLock] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ url: string; canvas: HTMLCanvasElement } | null>(
    null
  );

  // Fix #2: revoke the previous blob URL whenever `out` changes
  React.useEffect(() => {
    const url = out?.url;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [out?.url]);

  const onWidth = (raw: string) => {
    setWidthStr(raw);
    const w = Math.max(1, Number(raw) || 1);
    setWidth(w);
    if (lock) {
      const h = Math.max(1, Math.round(w / aspect));
      setHeight(h);
      setHeightStr(String(h));
    }
  };
  const onHeight = (raw: string) => {
    setHeightStr(raw);
    const h = Math.max(1, Number(raw) || 1);
    setHeight(h);
    if (lock) {
      const w = Math.max(1, Math.round(h * aspect));
      setWidth(w);
      setWidthStr(String(w));
    }
  };
  // Fix #3: clamp on blur so the displayed value stays consistent
  const commitWidth = () => {
    const clamped = Math.max(1, Number(widthStr) || 1);
    setWidth(clamped);
    setWidthStr(String(clamped));
    if (lock) {
      const h = Math.max(1, Math.round(clamped / aspect));
      setHeight(h);
      setHeightStr(String(h));
    }
  };
  const commitHeight = () => {
    const clamped = Math.max(1, Number(heightStr) || 1);
    setHeight(clamped);
    setHeightStr(String(clamped));
    if (lock) {
      const w = Math.max(1, Math.round(clamped * aspect));
      setWidth(w);
      setWidthStr(String(w));
    }
  };

  const run = async () => {
    setError(null);
    setBusy(true);
    try {
      const canvas = await picaResizeTo(source.image, width, height);
      // Fix #2: use a blob URL instead of a data URL to avoid memory accumulation
      const blob = await canvasToBlob(canvas, "image/png", 1);
      const url = URL.createObjectURL(blob);
      setOut({ url, canvas });
    } catch {
      // Fix #1: surface the error to the user rather than silently swallowing it
      setError("Resize failed. Try a different image or dimensions.");
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!out) return;
    const src = type === "image/jpeg" ? flattenForJpeg(out.canvas) : out.canvas;
    const blob = await canvasToBlob(src, type, 0.95);
    downloadBlob(blob, `resized-${width}x${height}.${type === "image/png" ? "png" : "jpg"}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source.url} alt="Original" className="max-h-[260px] w-auto rounded-md" />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-xs text-ink-soft">
            Before · {source.size.width}×{source.size.height}px
          </figcaption>
        </figure>
        <figure className="space-y-1.5">
          <PreviewFrame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={out?.url ?? source.url} alt="Resized" className="max-h-[260px] w-auto rounded-md" />
          </PreviewFrame>
          <figcaption className="text-center font-mono text-xs text-ink-soft">
            {out ? `After · ${width}×${height}px` : "After"}
          </figcaption>
        </figure>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="eyebrow mb-1 block">Width (px)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={widthStr}
            onChange={(e) => onWidth(e.target.value)}
            onBlur={commitWidth}
            className="h-10 w-28 rounded-md border border-hairline-strong bg-background px-3 font-mono text-[13px]"
          />
        </label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLock((v) => !v)}
          aria-label={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
          title={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
        >
          {lock ? (
            <Link2 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          ) : (
            <Link2Off className="h-4 w-4 text-ink-soft" strokeWidth={1.75} />
          )}
        </Button>
        <label className="text-sm">
          <span className="eyebrow mb-1 block">Height (px)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={heightStr}
            onChange={(e) => onHeight(e.target.value)}
            onBlur={commitHeight}
            className="h-10 w-28 rounded-md border border-hairline-strong bg-background px-3 font-mono text-[13px]"
          />
        </label>
        <Button variant="cta" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : "Resize"}
        </Button>
      </div>

      {error && (
        <p className="border-l-2 border-red-500 bg-red-50/60 py-2 pl-3 pr-2 text-sm text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      {out && (
        <>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onDownload("image/png")}>
              <Download className="h-4 w-4" strokeWidth={1.75} /> PNG
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDownload("image/jpeg")}>
              <Download className="h-4 w-4" strokeWidth={1.75} /> JPG
            </Button>
          </div>
          <WorkflowNextSteps
            getBlob={async () => canvasToBlob(flattenForJpeg(out.canvas), "image/jpeg", 0.95)}
            filename="resized-photo.jpg"
            assetKind="image"
            steps={[
              {
                slug: "resize-kb",
                label: "Compress to KB",
                hint: "Hit exact file size limits for exam and visa portals",
                icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "background-removal",
                label: "Remove Background",
                hint: "AI removes the background from your resized photo",
                icon: <Scissors className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "image-crop",
                label: "Crop to Size",
                hint: "Trim to passport, square, or custom dimensions",
                icon: <Crop className="h-4 w-4" strokeWidth={1.75} />,
              },
            ]}
          />
        </>
      )}
    </div>
  );
}

export function ResizeDimensionsTool() {
  return <ImageToolShell acceptedWorkflowKinds={WORKFLOW_GENERIC_IMAGE_KINDS}>{(source) => <Body source={source} />}</ImageToolShell>;
}
