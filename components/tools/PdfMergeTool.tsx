"use client";

import * as React from "react";
import { Loader2, Download, FileUp, ShieldCheck, ArrowUp, ArrowDown, Trash2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mergePdfs } from "@/lib/pdfMergeSplit";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export function PdfMergeTool() {
  const [files, setFiles] = React.useState<PdfFileItem[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = React.useState<Blob | null>(null);
  const [duplicateWarning, setDuplicateWarning] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) {
      setError("Please select valid PDF files.");
      return;
    }
    setError(null);
    setDuplicateWarning(null);
    setFiles((prev) => {
      let skipped = 0;
      const toAdd: PdfFileItem[] = [];
      for (const file of pdfs) {
        const isDuplicate = prev.some(
          (item) => item.name === file.name && item.size === file.size
        );
        if (isDuplicate) {
          skipped++;
        } else {
          toAdd.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            name: file.name,
            size: file.size,
          });
        }
      }
      if (skipped > 0) {
        setDuplicateWarning(
          `${skipped} duplicate${skipped > 1 ? "s" : ""} skipped`
        );
      }
      return [...prev, ...toAdd];
    });
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= files.length) return;

    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setFiles(updated);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const runMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }
    setBusy(true);
    setError(null);
    setMergedBlob(null);
    try {
      const blob = await mergePdfs(
        files.map((item) => item.file),
        (msg) => setProgress(msg)
      );
      downloadBlob(blob, "merged-document.pdf");
      setMergedBlob(blob);
    } catch (err) {
      console.error(err);
      setError("Could not merge the PDFs. Ensure none are encrypted or corrupted.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const handleReDownload = () => {
    if (mergedBlob) {
      downloadBlob(mergedBlob, "merged-document.pdf");
    }
  };

  const handleStartOver = () => {
    setFiles([]);
    setMergedBlob(null);
    setError(null);
    setDuplicateWarning(null);
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {/* Upload Zone */}
        <div
          role="button"
          tabIndex={busy ? -1 : 0}
          onClick={() => !busy && inputRef.current?.click()}
          onKeyDown={(e) => !busy && (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => { if (!busy) e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault();
            if (!busy && e.dataTransfer.files) {
              addFiles(Array.from(e.dataTransfer.files));
            }
          }}
          className={`flex flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors${busy ? " pointer-events-none opacity-50 cursor-default" : " cursor-pointer hover:bg-accent/40"}`}
        >
          <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
          <p className="font-semibold tracking-tight">Select PDF files, or drop them here</p>
          <p className="text-xs text-muted-foreground">Select multiple PDFs to combine into a single document.</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed locally on your device
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={onFileSelect}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Duplicate warning */}
        {duplicateWarning && (
          <p className="border-l-2 border-amber-400 bg-amber-50 py-2 pl-3 pr-2 text-sm text-amber-700">
            {duplicateWarning}
          </p>
        )}

        {/* Success banner */}
        {mergedBlob && (
          <div className="flex flex-col gap-3 rounded-md border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span className="font-semibold text-sm">Merge complete!</span>
            </div>
            <p className="text-xs text-green-600">
              Your merged PDF has been downloaded. If the download was blocked, use the button below.
            </p>
            <div className="flex gap-2">
              <Button variant="cta" size="sm" onClick={handleReDownload}>
                <Download className="h-4 w-4" /> Download again
              </Button>
              <Button variant="outline" size="sm" onClick={handleStartOver}>
                Start over
              </Button>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <h4 className="font-semibold text-sm">Merge Queue ({files.length} files)</h4>
              {files.length >= 2 && !busy && (
                <Button variant="cta" size="sm" onClick={runMerge}>
                  <Download className="h-4 w-4" /> Merge PDFs
                </Button>
              )}
            </div>

            <ul className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {files.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border border-hairline rounded-md bg-paper p-3 hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-5 w-5 text-brand shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold truncate leading-tight">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground">{formatKb(item.size)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-ink-soft"
                      disabled={index === 0 || busy}
                      onClick={() => moveFile(index, "up")}
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-ink-soft"
                      disabled={index === files.length - 1 || busy}
                      onClick={() => moveFile(index, "down")}
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      disabled={busy}
                      onClick={() => removeFile(item.id)}
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Processing State */}
        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-ink-soft border border-hairline rounded-md bg-accent/5">
            <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={1.75} />
            <p className="text-sm font-medium">{progress ?? "Processing PDFs…"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
