"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck, PenLine, Hash } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { consumeWorkflowPayload, WORKFLOW_PDF_KINDS } from "@/lib/workflowHandoff";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { compressPdfToTarget, type PdfCompressResult } from "@/lib/pdfCompress";
import { assertPdfDecryptable, PdfEncryptedError } from "@/lib/pdfToImages";
import { EncryptedPdfNotice } from "./EncryptedPdfNotice";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track, deviceClass } from "@/lib/analytics";

const TARGETS = [50, 100, 200, 500] as const;

export function PdfCompressTool({ defaultKb = 100 }: { defaultKb?: number } = {}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [targetKb, setTargetKb] = React.useState<number>(defaultKb);
  const [busy, setBusy] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PdfCompressResult | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "pdf-compress" });
  }, []);

  React.useEffect(() => {
    const payload = consumeWorkflowPayload(WORKFLOW_PDF_KINDS);
    if (payload) {
      const f = new File([payload.blob], payload.filename, { type: "application/pdf" });
      void pick(f);
    }
  }, []);

  const pick = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }
    setChecking(true);
    setError(null);
    setResult(null);
    setResultBlob(null);
    setFile(null);
    try {
      await assertPdfDecryptable(f);
      setFile(f);
    } catch (err) {
      console.error(err);
      if (err instanceof PdfEncryptedError) setError("encrypted");
      else setError("Could not read this PDF. Make sure it is a valid, unencrypted file.");
    } finally {
      setChecking(false);
    }
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
        downloadBlob(res.blob, `${file.name.replace(/\.[^/.]+$/, "")}-compressed.pdf`, "pdf-compress");
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
        setError("Couldn't compress this PDF. If it's password-protected, unlock it first; otherwise re-saving it from the original source as a plain PDF usually fixes it.");
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
        {!file && !busy && !checking && (
          <div
            id="pdf-compress-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files?.[0]) void pick(e.dataTransfer.files[0]);
            }}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors ${
              dragging
                ? "border-brand bg-brand-soft/40"
                : "border-hairline-strong bg-paper hover:bg-accent/40"
            }`}
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
              onChange={(e) => {
                if (e.target.files?.[0]) void pick(e.target.files[0]);
                e.target.value = "";
              }}
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

        {checking && <ProcessingState label="Checking PDF…" />}

        {file && !busy && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <h4 className="font-semibold text-sm truncate max-w-xs" title={file.name}>
                {file.name} <span className="text-muted-foreground font-normal">· {formatKb(file.size)}</span>
              </h4>
              <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResult(null); setResultBlob(null); setError(null); }}>Choose another file</Button>
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

            <p className="text-xs leading-snug text-muted-foreground">
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
              {result.alreadyUnder ? (
                <li>· Your PDF is {formatKb(file.size)}</li>
              ) : (
                <li>
                  · Before: {formatKb(file.size)} → After: {formatKb(result.bytes)}
                  {result.bytes < file.size
                    ? ` (${Math.round((1 - result.bytes / file.size) * 100)}% smaller`
                    : ` (no further reduction possible`}
                  , {result.pages} page{result.pages > 1 ? "s" : ""})
                </li>
              )}
              <li>
                · Status:{" "}
                {result.underTarget ? (
                  <span className="text-emerald-700">Under {targetKb} KB</span>
                ) : (
                  <span className="text-amber-700">
                    Couldn&apos;t reach {targetKb} KB.{" "}
                    {result.pages > 1 ? (
                      <>
                        Across {result.pages} pages that&apos;s about{" "}
                        {Math.max(1, Math.round(targetKb / result.pages))} KB per
                        page — too low to keep them legible, so it stopped at{" "}
                        {formatKb(result.bytes)}, the smallest this tool makes
                        without turning the text unreadable.
                      </>
                    ) : (
                      <>
                        This page has too much detail (likely a high-resolution
                        scan) to compress that far without making the text
                        unreadable. It stopped at {formatKb(result.bytes)}.
                      </>
                    )}
                  </span>
                )}
              </li>
            </ul>
            {result.alreadyUnder ? (
              <>
                <p className="mt-2 text-xs text-emerald-700 border-l-2 border-emerald-400 pl-2">
                  Already under the {targetKb} KB limit — no compression needed.
                  (Re-compressing a text PDF would only make it larger.) Your
                  original file is ready to download unchanged.
                </p>
                {resultBlob && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => downloadBlob(resultBlob, file.name, "pdf-compress")}
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF ({formatKb(file.size)})
                  </Button>
                )}
              </>
            ) : result.bytes >= file.size ? (
              <p className="mt-2 text-xs text-amber-700 border-l-2 border-amber-400 pl-2">
                This PDF is already well-optimised — compressing it would not reduce its size. No file was downloaded.
              </p>
            ) : (
              resultBlob && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => downloadBlob(resultBlob, `${file.name.replace(/\.[^/.]+$/, "")}-compressed.pdf`, "pdf-compress")}
                >
                  <Download className="h-3.5 w-3.5" /> Download compressed PDF
                </Button>
              )
            )}
          </div>
        )}

        {resultBlob && (
          <WorkflowNextSteps
            getBlob={async () => {
              if (!resultBlob) throw new Error("No output");
              return resultBlob;
            }}
            filename={file ? `${file.name.replace(/\.[^/.]+$/, "")}-compressed.pdf` : "compressed.pdf"}
            assetKind="pdf"
            steps={[
              {
                slug: "sign-pdf",
                label: "Sign PDF",
                hint: "Add your signature to the compressed PDF",
                icon: <PenLine className="h-4 w-4" strokeWidth={1.75} />,
              },
              {
                slug: "pdf-page-numbers",
                label: "Add Page Numbers",
                hint: "Number every page of the compressed PDF",
                icon: <Hash className="h-4 w-4" strokeWidth={1.75} />,
              },
            ]}
          />
        )}

        {busy && <ProcessingState label={progress ?? "Compressing…"} />}
      </CardContent>
    </Card>
  );
}
