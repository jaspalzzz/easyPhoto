"use client";

import * as React from "react";
import { Loader2, Download, FileUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pdfToCanvases, PdfTooLargeError } from "@/lib/pdfToImages";
import { canvasToBlob } from "@/lib/imaging";
import { downloadBlob } from "@/lib/download";

interface Page {
  url: string;
  blob: Blob;
}

export function PdfToJpgTool() {
  const [pages, setPages] = React.useState<Page[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Track object URLs so we can revoke them (freeing the underlying Blobs) when a
  // new PDF is loaded or the component unmounts — otherwise memory leaks across
  // conversions, which adds up fast on low-end mobile.
  const pagesRef = React.useRef<Page[]>([]);
  const replacePages = React.useCallback((next: Page[]) => {
    pagesRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    pagesRef.current = next;
    setPages(next);
  }, []);
  React.useEffect(
    () => () => pagesRef.current.forEach((p) => URL.revokeObjectURL(p.url)),
    []
  );

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    replacePages([]);
    try {
      const canvases = await pdfToCanvases(file, {
        scale: 2,
        onProgress: (p, t) => setProgress(`Rendering page ${p} of ${t}…`),
      });
      // Encode each page to a JPEG Blob + object URL, then drop the canvases
      // (the heavy part) — only the compressed blobs are retained.
      const built = await Promise.all(
        canvases.map(async (canvas) => {
          const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
          return { blob, url: URL.createObjectURL(blob) };
        })
      );
      replacePages(built);
    } catch (e) {
      setError(
        e instanceof PdfTooLargeError
          ? e.message
          : "Could not read that PDF. Make sure it's a valid, unencrypted file."
      );
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const downloadOne = (page: Page, i: number) => {
    downloadBlob(page.blob, `page-${i + 1}.jpg`);
  };

  const downloadAll = async () => {
    for (let i = 0; i < pages.length; i++) {
      downloadOne(pages[i], i);
      // Small gap so browsers don't drop rapid sequential downloads.
      await new Promise((r) => setTimeout(r, 250));
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
        >
          <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
          <p className="font-semibold tracking-tight">Choose a PDF, or drop it here</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed in your browser,
            never uploaded
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>

        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-ink-soft">
            <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={1.75} />
            <p className="text-sm">{progress ?? "Loading PDF…"}</p>
          </div>
        )}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {pages.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="spec">
                {pages.length} {pages.length === 1 ? "page" : "pages"}
              </p>
              <Button variant="cta" size="sm" onClick={downloadAll}>
                <Download className="h-4 w-4" strokeWidth={1.75} /> Download all
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pages.map((page, i) => (
                <div key={i} className="space-y-2">
                  <div className="overflow-hidden rounded-md border border-hairline bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={page.url} alt={`Page ${i + 1}`} className="w-full" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadOne(page, i)}
                  >
                    <Download className="h-4 w-4" strokeWidth={1.75} /> Page {i + 1}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
