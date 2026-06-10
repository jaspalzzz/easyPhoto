"use client";

import * as React from "react";
import { RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Uploader } from "@/components/tool/Uploader";
import { ProcessingState } from "@/components/site/ProcessingState";
import { CropMarks } from "@/components/site/CropMarks";
import { loadImageFromFile, type LoadedImage } from "@/lib/pipeline";
import { ensureDecodable } from "@/lib/heic";

export interface ToolSource extends LoadedImage {
  file: File;
}

/**
 * Shared chrome for the single-image tools: in-memory upload (never sent to a
 * server), load + error states, reset, and a render-prop body that receives the
 * loaded image. Keeps every tool consistent and DRY.
 */
export function ImageToolShell({
  children,
}: {
  children: (source: ToolSource, reset: () => void) => React.ReactNode;
}) {
  const [source, setSource] = React.useState<ToolSource | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const decodable = await ensureDecodable(file); // iPhone HEIC → JPEG
      const loaded = await loadImageFromFile(decodable);
      setSource({ ...loaded, file: decodable });
    } catch (e) {
      setError(
        e instanceof Error && /HEIC/i.test(e.message)
          ? e.message
          : "Could not read that image file. Try a JPG, PNG or WebP."
      );
    } finally {
      setLoading(false);
    }
  };

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

        {!source && !loading && <Uploader onFile={onFile} />}

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
      className={`relative flex justify-center rounded-md border border-hairline p-4 ${checker ? "checkerboard" : "bg-paper"}`}
    >
      <CropMarks size={14} inset={8} className="opacity-60" />
      {children}
    </div>
  );
}
