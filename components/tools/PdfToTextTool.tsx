"use client";

import * as React from "react";
import { FileUp, Copy, Download, ShieldCheck, Loader2, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractTextFromPdf } from "@/lib/pdfToText";
import { track } from "@/lib/analytics";

export function PdfToTextTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [progressLabel, setProgressLabel] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ text: string; pages: number; words: number; chars: number } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "pdf-to-text" });
  }, []);

  const pick = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
    setProgress(0);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pick(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  const extract = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      const res = await extractTextFromPdf(file, (page, total) => {
        setProgress(Math.round((page / total) * 100));
        setProgressLabel(`Extracting page ${page} of ${total}…`);
      });

      const words = res.fullText.trim() ? res.fullText.trim().split(/\s+/).length : 0;
      const chars = res.fullText.length;

      if (!res.fullText.trim()) {
        setError(
          "No text found in this PDF. It may be a scanned document — use the Image to Text (OCR) tool on the individual pages instead."
        );
      } else {
        setResult({ text: res.fullText, pages: res.totalPages, words, chars });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!result || !file) return;
    const blob = new Blob([result.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a PDF file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-brand bg-brand-soft/20" : "border-hairline hover:border-brand/50"
        }`}
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onInput} />
        {file ? (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <FileText className="h-8 w-8 text-brand" />
            <p className="font-medium text-ink">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · click to change</p>
          </div>
        ) : (
          <>
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-ink">Drop PDF here or click to upload</p>
              <p className="mt-1 text-sm text-muted-foreground">Extracts embedded text — works on digitally-created PDFs</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      {busy && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {progressLabel || "Extracting text…"}
          </p>
        </div>
      )}

      <Button onClick={extract} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Extract Text
      </Button>

      {result && (
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-md bg-accent px-3 py-1.5 font-medium text-ink">{result.pages} page{result.pages !== 1 ? "s" : ""}</span>
            <span className="rounded-md bg-accent px-3 py-1.5 font-medium text-ink">{result.words.toLocaleString()} words</span>
            <span className="rounded-md bg-accent px-3 py-1.5 font-medium text-ink">{result.chars.toLocaleString()} chars</span>
          </div>

          {/* Text area */}
          <textarea
            className="min-h-[280px] w-full resize-y rounded-xl border border-hairline bg-accent/30 p-4 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
            value={result.text}
            onChange={(e) => setResult({ ...result, text: e.target.value })}
            spellCheck={false}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={copy} className="flex-1">
              {copied ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Copied</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" /> Copy All</>
              )}
            </Button>
            <Button onClick={download} className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Download .txt
            </Button>
          </div>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        Your PDF never leaves your device — all extraction runs locally in your browser.
      </p>
    </div>
  );
}
