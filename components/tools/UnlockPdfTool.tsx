"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck, LockOpen, Minimize2, PenLine, Hash } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { consumeWorkflowPayload, WORKFLOW_PDF_KINDS } from "@/lib/workflowHandoff";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { unlockPdf, PdfPasswordError } from "@/lib/pdfUnlock";
import { downloadBlob } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

export function UnlockPdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [needsPassword, setNeedsPassword] = React.useState(false);
  const [wrong, setWrong] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const [unlockedBlob, setUnlockedBlob] = React.useState<{ blob: Blob; name: string } | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "unlock-pdf" });
  }, []);

  React.useEffect(() => {
    const payload = consumeWorkflowPayload(WORKFLOW_PDF_KINDS);
    if (payload) {
      const f = new File([payload.blob], payload.filename, { type: "application/pdf" });
      pick(f);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setFile(null);
    setNeedsPassword(false);
    setWrong(false);
    setPassword("");
    setError(null);
    setDone(false);
    setUnlockedBlob(null);
  };

  const attempt = async (f: File, pwd?: string) => {
    setBusy(true);
    setError(null);
    track({ name: "tool_start", tool: "unlock-pdf", device: deviceClass() });
    try {
      const { blob } = await unlockPdf(f, pwd, (p, t) =>
        setProgress(`Unlocking page ${p} of ${t}…`)
      );
      const unlockedName = f.name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
      downloadBlob(blob, unlockedName);
      setUnlockedBlob({ blob, name: unlockedName });
      setNeedsPassword(false);
      setWrong(false);
      setDone(true);
      track({ name: "tool_success", tool: "unlock-pdf", device: deviceClass() });
      track({ name: "download", tool: "unlock-pdf", format: "pdf" });
    } catch (e) {
      if (e instanceof PdfPasswordError) {
        setNeedsPassword(true);
        setWrong(e.wrong);
        track({
          name: "tool_failure",
          tool: "unlock-pdf",
          device: deviceClass(),
          reason: e.wrong ? "wrong-password" : "needs-password",
        });
      } else {
        setError("Could not unlock this PDF. Make sure it's a valid PDF file.");
        track({ name: "tool_failure", tool: "unlock-pdf", device: deviceClass(), reason: "unlock-error" });
      }
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    reset();
    setFile(f);
    void attempt(f); // try without a password first
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {!file && (
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
              pick(e.dataTransfer.files?.[0]);
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="text-sm font-semibold tracking-tight">Select a PDF to unlock, or drop it here</p>
            <p className="text-xs text-muted-foreground">
              Remove the password from a protected PDF (e.g. e-Aadhaar) — get an unprotected copy.
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> The PDF & password stay on your device
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>
        )}

        {busy && <ProcessingState label={progress ?? "Working…"} />}

        {file && needsPassword && !busy && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <h4 className="truncate text-sm font-semibold" title={file.name}>{file.name}</h4>
              <Button variant="ghost" size="sm" onClick={reset}>Choose another</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This PDF is password-protected. Enter its password to unlock it.
              {file.name.toLowerCase().includes("aadhaar") || file.name.toLowerCase().includes("aadhar") ? (
                <span className="mt-1 block text-xs text-ink-soft">
                  e-Aadhaar password = first 4 letters of your name in CAPITALS + your birth year (e.g. RAVI1998).
                </span>
              ) : null}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                value={password}
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && password && file && attempt(file, password)}
                placeholder="PDF password"
                className="h-10 w-56 rounded-md border border-hairline-strong bg-background px-3 text-sm"
              />
              <Button
                variant="cta"
                onClick={() => file && attempt(file, password)}
                disabled={!password}
              >
                <LockOpen className="h-4 w-4" strokeWidth={1.75} /> Unlock
              </Button>
            </div>
            {wrong && <p className="text-xs text-red-700 dark:text-red-400">Incorrect password — try again.</p>}
          </div>
        )}

        {done && !busy && (
          <div className="space-y-3">
            <p className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-300">
              <LockOpen className="h-4 w-4" strokeWidth={1.75} /> Unlocked — your unprotected PDF has downloaded.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {unlockedBlob && (
                <Button
                  variant="cta"
                  size="sm"
                  onClick={() => downloadBlob(unlockedBlob.blob, unlockedBlob.name)}
                >
                  <Download className="h-4 w-4" strokeWidth={1.75} /> Download again
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={reset}>Unlock another PDF</Button>
            </div>
            {unlockedBlob && (
              <WorkflowNextSteps
                getBlob={async () => {
                  if (!unlockedBlob) throw new Error("No output");
                  return unlockedBlob.blob;
                }}
                filename={unlockedBlob.name}
                assetKind="pdf"
                steps={[
                  {
                    slug: "pdf-compress",
                    label: "Compress PDF",
                    hint: "Shrink the unlocked PDF to fit upload size limits",
                    icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
                  },
                  {
                    slug: "sign-pdf",
                    label: "Sign PDF",
                    hint: "Add your signature to the unlocked PDF",
                    icon: <PenLine className="h-4 w-4" strokeWidth={1.75} />,
                  },
                  {
                    slug: "pdf-page-numbers",
                    label: "Add Page Numbers",
                    hint: "Number every page of the unlocked PDF",
                    icon: <Hash className="h-4 w-4" strokeWidth={1.75} />,
                  },
                ]}
              />
            )}
          </div>
        )}

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
