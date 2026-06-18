"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EncryptedPdfNotice } from "./EncryptedPdfNotice";
import { PdfEncryptedError } from "@/lib/pdfToImages";
import { watermarkPdf } from "@/lib/pdfAnnotate";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

const PRESETS = ["CONFIDENTIAL", "DRAFT", "COPY", "DO NOT COPY", "ORIGINAL"];

export function WatermarkPdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [opacity, setOpacity] = React.useState(22);
  const [angle, setAngle] = React.useState(45);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "watermark-pdf" });
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
    track({ name: "tool_start", tool: "watermark-pdf", device: deviceClass() });
    try {
      const blob = await watermarkPdf(file, {
        text,
        opacity: opacity / 100,
        rotate: angle,
      });
      downloadBlob(blob, `${file.name.replace(/\.[^/.]+$/, "")}-watermarked.pdf`);
      setDone(true);
      track({ name: "download", tool: "watermark-pdf", format: "pdf" });
      track({ name: "tool_success", tool: "watermark-pdf", device: deviceClass() });
    } catch (e) {
      console.error(e);
      if (e instanceof PdfEncryptedError) setError("encrypted");
      else setError("Could not watermark this PDF. Try re-saving it as a plain PDF.");
      track({ name: "tool_failure", tool: "watermark-pdf", device: deviceClass(), reason: "watermark-error" });
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
              if (e.dataTransfer.files?.[0]) pick(e.dataTransfer.files[0]);
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="text-sm font-semibold tracking-tight">Select a PDF to watermark, or drop it here</p>
            <p className="text-xs text-muted-foreground">Stamp a text watermark across every page.</p>
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

        {error === "encrypted" ? (
          <EncryptedPdfNotice />
        ) : error ? (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {busy && <ProcessingState label="Adding watermark…" />}

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
              <label className="mb-2 block text-sm font-semibold">Watermark text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={40}
                className="h-10 w-full rounded-md border border-hairline-strong bg-background px-3 text-sm"
                placeholder="e.g. CONFIDENTIAL"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setText(p)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      text === p ? "border-brand bg-brand-soft/40 text-brand" : "border-hairline-strong hover:bg-accent/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block font-semibold">
                  Opacity <span className="font-normal text-muted-foreground">· {opacity}%</span>
                </span>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--brand))]"
                />
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-semibold">
                  Angle{" "}
                  <span className="font-normal text-muted-foreground">
                    · {angle}°{angle === 0 ? " (horizontal)" : angle === 45 ? " (diagonal)" : ""}
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--brand))]"
                />
              </label>
            </div>

            <Button variant="cta" className="h-11 w-full" onClick={run} disabled={!text.trim()}>
              <Download className="h-4 w-4" /> Add watermark &amp; download
            </Button>

            {done && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Done — your watermarked PDF was downloaded. Text stays selectable; nothing was uploaded.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
