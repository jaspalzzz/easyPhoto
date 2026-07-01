"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileImage,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowHandoff } from "@/components/site/useWorkflowHandoff";
import { track } from "@/lib/analytics";
import { checkPhotoQuality, type PhotoCheck } from "@/lib/photoCheck";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pass: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2} />,
  warn: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" strokeWidth={2} />,
  fail: <XCircle className="h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />,
};

type Verdict = "pass" | "warn" | "fail";

function overallVerdict(checks: PhotoCheck[]): Verdict {
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "warn")) return "warn";
  return "pass";
}

const VERDICT_UI: Record<Verdict, { cls: string; headline: string; sub: string }> = {
  pass: {
    cls: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300",
    headline: "Likely to be accepted",
    sub: "All ICAO biometric checks passed. Confirm dimensions and file size against the portal before submitting.",
  },
  warn: {
    cls: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300",
    headline: "May be rejected — fix the warnings",
    sub: "The photo has one or more issues that can cause rejection at an automated biometric gate.",
  },
  fail: {
    cls: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300",
    headline: "Likely to be rejected",
    sub: "Critical ICAO criteria failed. Fix the issues below before submitting this photo.",
  },
};

export function RejectionPredictorTool() {
  const [dragging, setDragging] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [checks, setChecks] = React.useState<PhotoCheck[] | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  // Retain the analysed file so a fix routes WITH the photo — no re-upload.
  const [sourceFile, setSourceFile] = React.useState<File | null>(null);
  const handoff = useWorkflowHandoff();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const prevUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "photo-rejection-check" });
  }, []);

  React.useEffect(() => {
    const prev = prevUrlRef.current;
    prevUrlRef.current = previewUrl;
    if (prev && prev !== previewUrl) URL.revokeObjectURL(prev);
  }, [previewUrl]);
  React.useEffect(() => {
    return () => { if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current); };
  }, []);

  const analyse = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a JPG or PNG image.");
      return;
    }
    setBusy(true);
    setError(null);
    setChecks(null);

    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    }).catch(() => null);

    if (!img) {
      URL.revokeObjectURL(url);
      setBusy(false);
      setError("Could not decode the image. Try a different file.");
      return;
    }

    try {
      const size = { width: img.naturalWidth, height: img.naturalHeight };
      const result = await checkPhotoQuality(img, size);
      setChecks(result);
      setPreviewUrl(url);
      setSourceFile(file);
      track({ name: "tool_success", tool: "photo-rejection-check" });
    } catch {
      URL.revokeObjectURL(url);
      setError("Analysis failed. Make sure you uploaded a clear passport-style photo.");
      track({ name: "tool_failure", tool: "photo-rejection-check", reason: "analysis" });
    } finally {
      setBusy(false);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) analyse(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) analyse(f);
  };

  const reset = () => {
    setChecks(null);
    setPreviewUrl(null);
    setError(null);
  };

  if (checks) {
    const verdict = overallVerdict(checks);
    const ui = VERDICT_UI[verdict];
    const passCount = checks.filter((c) => c.status === "pass").length;
    const score = Math.round((passCount / checks.length) * 100);

    return (
      <div className="space-y-5">
        {/* Verdict banner + score */}
        <div className={`flex items-start gap-4 rounded-xl border p-4 ${ui.cls}`}>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Analysed passport photo"
              className="h-20 w-16 shrink-0 rounded border border-current/20 object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">{score}/100</span>
              <span className="text-sm font-semibold">{ui.headline}</span>
            </div>
            <p className="mt-1 text-xs opacity-80">{ui.sub}</p>
          </div>
        </div>

        {/* Criteria breakdown */}
        <div className="space-y-2.5">
          {checks.map((c) => (
            <div key={c.label} className="flex items-start gap-2.5 text-sm">
              {STATUS_ICON[c.status]}
              <span>
                <span className="font-medium text-ink">{c.label}: </span>
                <span className="text-muted-foreground">{c.detail}</span>
                {c.fix && c.status !== "pass" && (
                  <span className="mt-0.5 block text-xs text-brand">
                    → {c.href && sourceFile
                      ? <button type="button" onClick={() => handoff(sourceFile, sourceFile.name, c.href!)} className="underline underline-offset-2">{c.fix}</button>
                      : c.href
                        ? <a href={c.href} className="underline underline-offset-2">{c.fix}</a>
                        : c.fix}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Analysis covers ICAO biometric criteria: face detection, centering, head size, eye level, head visibility, and background. Pixel dimensions and file size are not checked here — use the{" "}
          <Link href="/tools/compliance-checker/" className="underline underline-offset-2">Compliance Checker</Link>{" "}
          to validate those against your specific exam or portal.
        </p>

        <Button variant="outline" size="sm" onClick={reset}>
          <RefreshCcw className="mr-2 h-4 w-4" strokeWidth={1.75} />
          Check another photo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload passport photo for rejection analysis"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-brand bg-brand-soft/20" : "border-hairline hover:border-brand/50"
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInput} />
        {busy ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-medium text-ink">Analysing photo…</p>
            <p className="text-xs text-muted-foreground">Running face detection &amp; ICAO checks</p>
          </div>
        ) : (
          <>
            <FileImage className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-ink">Drop your passport photo here</p>
              <p className="mt-1 text-sm text-muted-foreground">JPG or PNG · nothing is uploaded</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border border-hairline bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold text-ink mb-1">What gets checked (ICAO criteria)</p>
        <ul className="space-y-0.5 text-xs text-muted-foreground">
          <li>• Face detected and clearly visible</li>
          <li>• Single person in the frame</li>
          <li>• Head horizontally centred</li>
          <li>• Head size: 60–80% of photo height</li>
          <li>• Eyes level (no head tilt)</li>
          <li>• Eye position in the upper-middle band</li>
          <li>• Whole head visible (no cropping)</li>
          <li>• Plain light background</li>
          <li>• Even lighting, no shadows</li>
        </ul>
      </div>
    </div>
  );
}
