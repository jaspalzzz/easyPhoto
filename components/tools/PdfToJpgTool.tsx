"use client";

import * as React from "react";
import Link from "next/link";
import { Download, FileUp, ShieldCheck, Minimize2, Crop, Image as ImageIcon } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { Button } from "@/components/ui/button";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { Card, CardContent } from "@/components/ui/card";
import { pdfToCanvases, PdfTooLargeError, PdfEncryptedError } from "@/lib/pdfToImages";
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
  const [sourceFileName, setSourceFileName] = React.useState<string | null>(null);
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
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    setSourceFileName(file.name);
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
      if (e instanceof PdfTooLargeError) {
        setError(e.message);
      } else if (e instanceof PdfEncryptedError) {
        setError("encrypted");
      } else {
        setError("Could not read that PDF. Make sure it's a valid, unencrypted file.");
      }
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const downloadOne = (page: Page, i: number) => {
    downloadBlob(page.blob, `page-${i + 1}.jpg`);
  };

  const downloadAll = async () => {
    if (pages.length === 1) {
      downloadOne(pages[0], 0);
      return;
    }
    // One ZIP instead of N sequential downloads: iOS Safari silently blocks
    // more than one programmatic download per gesture, and desktop browsers
    // prompt about multiple files. A single archive works everywhere.
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    pages.forEach((p, i) => zip.file(`page-${i + 1}.jpg`, p.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "pdf-pages.zip");
  };

  const reset = () => {
    replacePages([]);
    setSourceFileName(null);
    setError(null);
    // Reset the file input so the same file can be re-selected.
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
            onFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40${busy ? " pointer-events-none opacity-50" : ""}`}
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

        {busy && <ProcessingState label={progress ?? "Loading PDF…"} />}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error === "encrypted" ? (
              <>
                This PDF is password-protected. Please unlock it first using the{" "}
                <Link href="/tools/unlock-pdf" className="underline font-medium">Unlock PDF tool</Link>.
              </>
            ) : error}
          </p>
        )}

        {pages.length > 0 && (
          <>
            {sourceFileName && (
              <p className="truncate text-sm text-ink-soft" title={sourceFileName}>
                {sourceFileName}
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="spec">
                {pages.length} {pages.length === 1 ? "page" : "pages"}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <Button variant="outline" size="sm" onClick={reset}>
                  Convert another PDF
                </Button>
                <Button variant="cta" size="sm" onClick={downloadAll}>
                  <Download className="h-4 w-4" strokeWidth={1.75} /> Download all
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pages.map((page, i) => (
                <div key={i} className="space-y-2">
                  <div className="overflow-hidden rounded-md border border-hairline bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={page.url} alt={`Page ${i + 1}`} className="w-full" />
                  </div>
                  <p className="text-center text-xs text-ink-soft">{formatBytes(page.blob.size)}</p>
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

            {/* Single-page extracts flow straight into the image tools. */}
            {pages.length === 1 && (
              <WorkflowNextSteps
                getBlob={async () => pages[0].blob}
                filename="page-1.jpg"
                steps={[
                  { slug: "image-crop", label: "Crop image", hint: "Trim or reframe the page", icon: <Crop className="h-4 w-4" strokeWidth={1.75} /> },
                  { slug: "resize-kb", label: "Resize to KB", hint: "Hit an upload size limit", icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} /> },
                  { slug: "white-background", label: "White background", hint: "Clean plain background", icon: <ImageIcon className="h-4 w-4" strokeWidth={1.75} /> },
                ]}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
