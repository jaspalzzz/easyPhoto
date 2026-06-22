"use client";

import * as React from "react";
import { RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Uploader } from "@/components/tool/Uploader";
import { ProcessingState } from "@/components/site/ProcessingState";
import { CropMarks } from "@/components/site/CropMarks";
import { loadImageFromFile, type LoadedImage } from "@/lib/pipeline";
import { ensureDecodable } from "@/lib/heic";
import { consumeWorkflowPayload } from "@/lib/workflowHandoff";

export interface ToolSource extends LoadedImage {
  file: File;
  /**
   * A small (~480px) JPEG data URL of the image, for the in-progress preview.
   * Showing the full-resolution `url` in an <img> during a heavy AI run forces
   * the browser to keep a second full-res decoded bitmap in memory — enough to
   * make iOS Safari stop painting the rest of the page (or reload the tab) on a
   * 12MP phone photo. This downscaled copy is a few KB and avoids that spike.
   */
  thumbUrl: string;
}

/** Downscaled JPEG data URL of a loaded image — cheap preview, tiny memory. */
function makeThumbDataUrl(
  image: HTMLImageElement,
  size: { width: number; height: number },
  maxEdge = 480
): string {
  try {
    const scale = Math.min(1, maxEdge / Math.max(size.width, size.height));
    const w = Math.max(1, Math.round(size.width * scale));
    const h = Math.max(1, Math.round(size.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(image, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return ""; // fall back to no thumbnail rather than break the tool
  }
}

/**
 * Shared chrome for the single-image tools: in-memory upload (never sent to a
 * server), load + error states, reset, and a render-prop body that receives the
 * loaded image. Keeps every tool consistent and DRY.
 */
export function ImageToolShell({
  children,
  uploaderTitle,
  uploaderHint,
}: {
  children: (source: ToolSource, reset: () => void) => React.ReactNode;
  /** Override the dropzone copy (e.g. for signature scans, not photos). */
  uploaderTitle?: string;
  uploaderHint?: string;
}) {
  const [source, setSource] = React.useState<ToolSource | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadFile = React.useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const decodable = await ensureDecodable(file);
      const loaded = await loadImageFromFile(decodable);
      const thumbUrl = makeThumbDataUrl(loaded.image, loaded.size);
      setSource({ ...loaded, file: decodable, thumbUrl });
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Could not read that image file. Try a JPG, PNG or WebP."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load a blob passed from the previous tool via the workflow handoff.
  // Runs once on mount; consume-once semantics prevent strict-mode double-fire.
  React.useEffect(() => {
    const payload = consumeWorkflowPayload();
    if (!payload) return;
    const file = new File([payload.blob], payload.filename, { type: payload.blob.type });
    void loadFile(file);
  }, [loadFile]);

  const onFile = loadFile;

  const reset = () => {
    if (source?.url) URL.revokeObjectURL(source.url);
    setSource(null);
    setError(null);
  };

  return (
    <div className="panel">
      <div className="space-y-6 p-6">
        {error && (
          <div className="flex items-start gap-2 border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>{error}</span>
          </div>
        )}

        {!source && !loading && (
          <Uploader onFile={onFile} title={uploaderTitle} hint={uploaderHint} />
        )}

        {loading && <ProcessingState label="Reading your image…" />}

        {source && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="spec normal-case tracking-[0.04em]">
                {source.file.name} · {source.size.width}×{source.size.height}px
              </p>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} /> New image
              </Button>
            </div>
            {children(source, reset)}
          </div>
        )}
      </div>
    </div>
  );
}

/** A checkerboard-backed preview frame (so transparency is visible). */
export function PreviewFrame({
  children,
  checker,
}: {
  children: React.ReactNode;
  checker?: boolean;
}) {
  return (
    <div
      className={`ep-fade-in relative flex justify-center rounded-md border border-hairline p-4 ${checker ? "checkerboard" : "bg-paper"}`}
    >
      <CropMarks size={14} inset={8} className="opacity-60" />
      {children}
    </div>
  );
}
