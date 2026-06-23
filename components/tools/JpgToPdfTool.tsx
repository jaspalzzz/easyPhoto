"use client";

import * as React from "react";
import { Loader2, Plus, X, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imagesToPdf } from "@/lib/imagesToPdf";
import { ensureDecodable } from "@/lib/heic";
import { downloadBlob } from "@/lib/download";

interface Item {
  file: File;
  url: string;
}

export function JpgToPdfTool() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [addWarning, setAddWarning] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Track latest items so the unmount cleanup can revoke every thumbnail URL.
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  React.useEffect(
    () => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url)),
    []
  );

  const add = async (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name)
    );
    const next: Item[] = [];
    const failed: string[] = [];
    for (const f of imgs) {
      try {
        const decodable = await ensureDecodable(f); // iPhone HEIC → JPEG
        next.push({ file: decodable, url: URL.createObjectURL(decodable) });
      } catch {
        // Skip files that can't be decoded rather than failing the whole batch.
        failed.push(f.name);
      }
    }
    if (failed.length) {
      setAddWarning(
        `${failed.length} ${failed.length === 1 ? "file" : "files"} could not be added (HEIC decoding failed): ${failed.join(", ")}`
      );
    }
    if (next.length) setItems((prev) => [...prev, ...next]);
  };

  const remove = (i: number) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const blob = await imagesToPdf(items.map((it) => it.file));
      downloadBlob(blob, "images.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
          }
          onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.dataset.dragging = "1";
            }}
            onDragLeave={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
            onDropCapture={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
          onDrop={(e) => {
            e.preventDefault();
            add(e.dataTransfer.files);
          }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
        >
          <Plus className="h-8 w-8 text-brand" strokeWidth={1.75} />
          <p className="font-semibold tracking-tight">Add images (JPG / PNG)</p>
          <p className="text-sm text-ink-soft">
            Each image becomes one page, in the order added.
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed in your browser,
            never uploaded
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => add(e.target.files)}
          />
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((it, i) => (
              <div
                key={it.url}
                className="group relative aspect-square overflow-hidden rounded-md border border-hairline bg-paper"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.url}
                  alt={`Page ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 font-mono text-[11px] text-white">
                  {i + 1}
                </span>
                <button
                  onClick={() => remove(i)}
                  className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Remove page ${i + 1}`}
                >
                  <X className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        )}

        {addWarning && (
          <div className="flex items-start justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            <span>{addWarning}</span>
            <button
              onClick={() => setAddWarning(null)}
              aria-label="Dismiss warning"
              className="mt-0.5 shrink-0 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="mt-0.5 shrink-0 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}

        <Button variant="cta" onClick={generate} disabled={busy || items.length === 0}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <FileText className="h-4 w-4" strokeWidth={1.75} />
          )}
          Create PDF ({items.length} {items.length === 1 ? "page" : "pages"})
        </Button>
      </CardContent>
    </Card>
  );
}
