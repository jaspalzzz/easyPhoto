"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  addPageNumbers,
  type PageNumberPosition,
  type PageNumberFormat,
} from "@/lib/pdfAnnotate";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

const POSITIONS: { id: PageNumberPosition; label: string }[] = [
  { id: "top-left", label: "Top left" },
  { id: "top-center", label: "Top center" },
  { id: "top-right", label: "Top right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-center", label: "Bottom center" },
  { id: "bottom-right", label: "Bottom right" },
];

const FORMATS: { id: PageNumberFormat; label: string; example: string }[] = [
  { id: "n", label: "Number", example: "1" },
  { id: "n-of-total", label: "Number of total", example: "1 of 10" },
  { id: "page-n", label: "Page label", example: "Page 1" },
];

export function PdfPageNumbersTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [position, setPosition] = React.useState<PageNumberPosition>("bottom-center");
  const [format, setFormat] = React.useState<PageNumberFormat>("n");
  const [startAt, setStartAt] = React.useState(1);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "pdf-page-numbers" });
  }, []);

  const pick = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }
    setError(null);
    setDone(false);
    setFile(f);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setDone(false);
    track({ name: "tool_start", tool: "pdf-page-numbers", device: deviceClass() });
    try {
      const blob = await addPageNumbers(file, {
        position,
        format,
        startAt: Math.max(0, startAt),
      });
      downloadBlob(blob, `${file.name.replace(/\.[^/.]+$/, "")}-numbered.pdf`);
      setDone(true);
      track({ name: "download", tool: "pdf-page-numbers", format: "pdf" });
      track({ name: "tool_success", tool: "pdf-page-numbers", device: deviceClass() });
    } catch (e) {
      console.error(e);
      setError("Could not add page numbers. If the PDF is password-protected, unlock it first.");
      track({ name: "tool_failure", tool: "pdf-page-numbers", device: deviceClass(), reason: "pagenum-error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {!file && !busy && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) pick(e.dataTransfer.files[0]);
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="text-sm font-semibold tracking-tight">Select a PDF, or drop it here</p>
            <p className="text-xs text-muted-foreground">Add page numbers to every page.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed 100% locally
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
            />
          </div>
        )}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {busy && <ProcessingState label="Adding page numbers…" />}

        {file && !busy && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <h4 className="max-w-xs truncate text-sm font-semibold" title={file.name}>
                {file.name}{" "}
                <span className="font-normal text-muted-foreground">· {formatKb(file.size)}</span>
              </h4>
              <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDone(false); }}>
                Choose another file
              </Button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Position</label>
              <div className="grid grid-cols-3 gap-1.5">
                {POSITIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPosition(p.id)}
                    className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                      position === p.id ? "border-brand bg-brand-soft/40 text-brand" : "border-hairline-strong hover:bg-accent/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Format</label>
                <div className="flex flex-col gap-1.5">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormat(f.id)}
                      className={`flex items-center justify-between rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        format === f.id ? "border-brand bg-brand-soft/40 text-brand" : "border-hairline-strong hover:bg-accent/40"
                      }`}
                    >
                      {f.label}
                      <span className="font-mono text-xs text-muted-foreground">{f.example}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="text-sm">
                <span className="mb-2 block font-semibold">Start numbering at</span>
                <input
                  type="number"
                  min={0}
                  value={startAt}
                  onChange={(e) => setStartAt(Number(e.target.value) || 0)}
                  className="h-10 w-24 rounded-md border border-hairline-strong bg-background px-3 font-mono text-sm"
                />
                <span className="mt-1.5 block text-xs text-muted-foreground">
                  Use 0 to skip a cover page&apos;s number visually, or any start value.
                </span>
              </label>
            </div>

            <Button variant="cta" className="h-11 w-full" onClick={run}>
              <Download className="h-4 w-4" /> Add page numbers &amp; download
            </Button>

            {done && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Done — your numbered PDF was downloaded. Text stays selectable; nothing was uploaded.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
