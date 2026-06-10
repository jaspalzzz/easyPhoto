"use client";

import * as React from "react";
import { Loader2, Download, FileUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { compressPdfToTarget, type PdfCompressResult } from "@/lib/pdfCompress";
import { PdfEncryptedError } from "@/lib/pdfToImages";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

const TARGETS = [50, 100, 200, 500] as const;

export function PdfCompressTool({ defaultKb = 100 }: { defaultKb?: number } = {}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [targetKb, setTargetKb] = React.useState<number>(defaultKb);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PdfCompressResult | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "pdf-compress" });
  }, []);

  const pick = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }
    setError(null);
    setResult(null);
    setResultBlob(null);
    setFile(f);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setResultBlob(null);
    track({ name: "tool_start", tool: "pdf-compress", device: deviceClass() });
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    try {
      const res = await compressPdfToTarget(file, targetKb, setProgress);
      setResult(res);
      setResultBlob(res.blob);
      // Fix 3: only auto-download when the compressed file is actually smaller
      if (res.bytes < file.size) {
        downloadBlob(res.blob, `${file.name.replace(/\.[^/.]+$/, "")}-compressed.pdf`);
        track({ name: "download", tool: "pdf-compress", format: "pdf" });
      }
      track({
        name: "tool_success",
        tool: "pdf-compress",
        device: deviceClass(),
        ms: typeof performance !== "undefined" ? Math.round(performance.now() - t0) : undefined,
      });
    } catch (e) {
      console.error(e);
      if (e instanceof PdfEncryptedError) {
        setError("encrypted");
      } else {
        setError("Could not compress this PDF. Try a different file.");
      }
      track({ name: "tool_failure", tool: "pdf-compress", device: deviceClass(), reason: "compress-error" });
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {!file && !busy && (
          <div
            id="pdf-compress-dropzone"
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
            <p className="font-semibold tracking-tight text-sm">Select a PDF to compress, or drop it here</p>
            <p className="text-xs text-muted-foreground">Shrink marksheets, certificates & documents to fit upload limits.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed 100% locally
            </p>
            <input
              id="pdf-compress-file-input"
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
            {error === "encrypted" ? (
              <>
                This PDF is password-protected. Please unlock it first using the{" "}
                <a href="/tools/unlock-pdf" className="underline font-medium">Unlock PDF tool</a>.
              </>
            ) : error}
          </p>
        )}

        {file && !busy && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <h4 className="font-semibold text-sm truncate max-w-xs" title={file.name}>
                {file.name} <span className="text-muted-foreground font-normal">· {formatKb(file.size)}</span>
              </h4>
              <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResult(null); setResultBlob(null); }}>Choose another file</Button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Target file size</label>
              <div className="flex flex-wrap gap-2">
                {TARGETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTargetKb(t)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
                      targetKb === t ? "border-brand bg-brand-soft/40 text-brand" : "border-hairline-strong hover:bg-accent/40"
                    }`}
                  >
                    Under {t} KB
                  </button>
                ))}
              </div>
            </div>

            <Button id="pdf-compress-run" variant="cta" className="w-full h-11" onClick={run}>
              <Download className="h-4 w-4" /> Compress to {targetKb} KB
            </Button>

            <p className="text-[11px] leading-snug text-muted-foreground">
              To fit the size limit, pages are optimised to images — the text in the
              compressed PDF is no longer selectable. For a lossless PDF, use the
              merge/split tools instead.
            </p>
          </div>
        )}

        {result && file && (
          <div className="rounded-md border border-hairline bg-paper p-4 text-xs space-y-1.5">
            <p className="font-semibold text-ink">Result</p>
            <ul className="space-y-1 text-ink-soft font-mono">
              <li>
                · Before: {formatKb(file.size)} → After: {formatKb(result.bytes)}
                {result.bytes < file.size
                  ? ` (${Math.round((1 - result.bytes / file.size) * 100)}% smaller`
                  : ` (already optimised`}
                , {result.pages} page{result.pages > 1 ? "s" : ""})
              </li>
              <li>
                · Status:{" "}
                {result.underTarget
                  ? `🟢 Under ${targetKb} KB`
                  : `⚠️ Couldn't reach ${targetKb} KB — ${formatKb(result.bytes)} is the smallest achievable. This PDF is likely already optimised or contains high-resolution scans.`}
              </li>
            </ul>
            {result.bytes >= file.size ? (
              <p className="mt-2 text-xs text-amber-700 border-l-2 border-amber-400 pl-2">
                This PDF is already well-optimised — compressing it would not reduce its size. No file was downloaded.
              </p>
            ) : (
              resultBlob && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => downloadBlob(resultBlob, `${file.name.replace(/\.[^/.]+$/, "")}-compressed.pdf`)}
                >
                  <Download className="h-3.5 w-3.5" /> Download compressed PDF
                </Button>
              )
            )}
          </div>
        )}

        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-ink-soft border border-hairline rounded-md bg-accent/5">
            <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={1.75} />
            <p className="text-sm font-medium">{progress ?? "Compressing…"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
