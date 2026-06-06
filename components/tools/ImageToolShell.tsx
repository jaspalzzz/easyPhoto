"use client";

import * as React from "react";
import { Loader2, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Uploader } from "@/components/tool/Uploader";
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
    <Card>
      <CardContent className="space-y-6 p-6">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!source && !loading && <Uploader onFile={onFile} />}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Reading your image…</p>
          </div>
        )}

        {source && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {source.file.name} · {source.size.width}×{source.size.height}px
              </p>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> New image
              </Button>
            </div>
            {children(source, reset)}
          </div>
        )}
      </CardContent>
    </Card>
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
      className={`flex justify-center rounded-md border p-4 ${checker ? "checkerboard" : "bg-muted/30"}`}
    >
      {children}
    </div>
  );
}
