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
  canvas: HTMLCanvasElement;
}

export function PdfToJpgTool() {
  const [pages, setPages] = React.useState<Page[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setPages([]);
    try {
      const canvases = await pdfToCanvases(file, {
        scale: 2,
        onProgress: (p, t) => setProgress(`Rendering page ${p} of ${t}…`),
      });
      setPages(
        canvases.map((canvas) => ({ canvas, url: canvas.toDataURL("image/jpeg", 0.92) }))
      );
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

  const downloadOne = async (page: Page, i: number) => {
    const blob = await canvasToBlob(page.canvas, "image/jpeg", 0.92);
    downloadBlob(blob, `page-${i + 1}.jpg`);
  };

  const downloadAll = async () => {
    for (let i = 0; i < pages.length; i++) {
      await downloadOne(pages[i], i);
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
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-input p-8 text-center hover:bg-accent/50"
        >
          <FileUp className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">Choose a PDF, or drop it here</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Processed in your browser —
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
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin" />
            <p className="text-sm">{progress ?? "Loading PDF…"}</p>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {pages.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pages.length} {pages.length === 1 ? "page" : "pages"}
              </p>
              <Button size="sm" onClick={downloadAll}>
                <Download className="h-4 w-4" /> Download all
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pages.map((page, i) => (
                <div key={i} className="space-y-2">
                  <div className="overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={page.url} alt={`Page ${i + 1}`} className="w-full" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadOne(page, i)}
                  >
                    <Download className="h-4 w-4" /> Page {i + 1}
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
