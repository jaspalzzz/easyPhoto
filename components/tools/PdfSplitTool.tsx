"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { pdfNextSteps } from "@/components/site/pdfNextSteps";
import { pdfToCanvases, PdfTooLargeError, PdfEncryptedError } from "@/lib/pdfToImages";
import { splitPdf } from "@/lib/pdfMergeSplit";
import { downloadBlob } from "@/lib/download";
import { EncryptedPdfNotice } from "./EncryptedPdfNotice";

interface PageItem {
  index: number;
  url: string;
}

export function PdfSplitTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      void loadFile(selectedFile);
    }
    e.target.value = "";
  };

  const loadFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setBusy(true);
    setError(null);
    setPages([]);
    setSelected([]);
    try {
      const canvases = await pdfToCanvases(selectedFile, {
        scale: 1.0, // Scale 1.0 is sufficient for thumbnails
        onProgress: (p, t) => setProgress(`Loading PDF page ${p} of ${t}…`),
      });
      // Encode thumbnails immediately and drop canvas refs so GC can collect
      // the bitmap memory — we only need the data URL string going forward.
      const items: PageItem[] = canvases.map((canvas, index) => {
        const url = canvas.toDataURL("image/jpeg", 0.85);
        // Clear the canvas dimensions so the underlying bitmap is released
        (canvas as HTMLCanvasElement).width = 0;
        (canvas as HTMLCanvasElement).height = 0;
        return { index, url };
      });
      setPages(items);
    } catch (err) {
      console.error(err);
      if (err instanceof PdfTooLargeError) {
        setError(err.message);
      } else if (err instanceof PdfEncryptedError) {
        setError("encrypted");
      } else {
        setError("Could not load this PDF. Make sure it is a valid, unencrypted file.");
      }
      setFile(null);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  // Any change to the page selection invalidates a previously extracted PDF.
  const toggleSelectPage = (index: number) => {
    setResultBlob(null);
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setResultBlob(null);
    setSelected(pages.map((p) => p.index));
  };

  const selectNone = () => {
    setResultBlob(null);
    setSelected([]);
  };

  const runSplit = async () => {
    if (!file || selected.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const splitBlob = await splitPdf(
        file,
        selected,
        (msg) => setProgress(msg)
      );
      setResultBlob(splitBlob);
      downloadBlob(splitBlob, `${file.name.replace(/\.[^/.]+$/, "")}-extracted.pdf`);
    } catch (err) {
      console.error(err);
      if (err instanceof PdfEncryptedError) setError("encrypted");
      else setError("Could not extract pages. Make sure the file remains accessible.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {/* Upload Zone */}
        {!file && !busy && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
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
              if (e.dataTransfer.files?.[0]) {
                void loadFile(e.dataTransfer.files[0]);
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight">Choose a PDF, or drop it here</p>
            <p className="text-xs text-muted-foreground">Select a multi-page PDF to extract individual pages.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed locally in your browser
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}

        {/* Loading/Processing State */}
        {busy && <ProcessingState label={progress ?? "Loading PDF details…"} />}

        {/* Error message */}
        {error === "encrypted" ? (
          <EncryptedPdfNotice />
        ) : error ? (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {/* Pages Grid */}
        {pages.length > 0 && !busy && (
          <div className="space-y-4">
            {pages.length === 1 && (
              <p className="border-l-2 border-amber-400 bg-amber-50 py-2 pl-3 pr-2 text-sm text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
                This PDF has only 1 page — nothing to split.
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
              <div>
                <h4 className="font-semibold text-sm">Select pages to extract</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selected.length} of {pages.length} pages selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll} disabled={pages.length === 1}>Select All</Button>
                <Button variant="ghost" size="sm" onClick={selectNone}>Clear</Button>
                {selected.length > 0 && (
                  <Button variant="cta" size="sm" onClick={runSplit} disabled={pages.length === 1}>
                    <Download className="h-4 w-4" /> Extract PDF ({selected.length})
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-h-[400px] overflow-y-auto pr-1 py-1">
              {pages.map((page) => {
                const isSelected = selected.includes(page.index);
                return (
                  <label
                    key={page.index}
                    aria-label={`Select page ${page.index + 1}`}
                    className={`relative block cursor-pointer rounded-md border p-2 transition-all hover:shadow-md ${
                      isSelected ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-hairline bg-paper"
                    }`}
                  >
                    <div className="overflow-hidden rounded border border-hairline bg-paper aspect-[3/4] flex items-center justify-center">
                      <img src={page.url} alt={`Page ${page.index + 1}`} className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs px-1">
                      <span className="font-medium text-muted-foreground">Page {page.index + 1}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectPage(page.index)}
                        aria-label={`Select page ${page.index + 1}`}
                        className="rounded text-brand focus:ring-brand h-3.5 w-3.5 cursor-pointer"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
            
            {resultBlob && file && (
              <WorkflowNextSteps
                getBlob={async () => resultBlob}
                filename={`${file.name.replace(/\.[^/.]+$/, "")}-extracted.pdf`}
                assetKind="pdf"
                steps={pdfNextSteps("pdf-split")}
              />
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => { setFile(null); setPages([]); setSelected([]); setResultBlob(null); setError(null); }}>
                Choose another file
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
