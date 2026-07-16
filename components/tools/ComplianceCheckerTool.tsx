"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, ArrowRight, Share2 } from "lucide-react";
import { Uploader } from "@/components/tool/Uploader";
import { useWorkflowHandoff } from "@/components/site/useWorkflowHandoff";
import { ToolLimitationsNotice } from "@/components/site/ToolLimitationsNotice";
import { allPortalSpecs, getPortalSpec } from "@/lib/specRegistry";
import {
  checkCompliance,
  type ComplianceReport,
  type DocKind,
  type FileFacts,
} from "@/lib/compliance";
import { buildComplianceCard } from "@/lib/complianceCard";
import { checkPhotoQuality, type PhotoCheck } from "@/lib/photoCheck";
import { downloadBlob } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

const SPECS = allPortalSpecs();

/** Heuristic: do at least 3 of the 4 corners look plain white/light? */
function cornersLookWhite(bmp: ImageBitmap): boolean {
  try {
    const cap = 64;
    const scale = Math.min(1, cap / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return false;
    ctx.drawImage(bmp, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const at = (x: number, y: number) => {
      const i = (y * w + x) * 4;
      return [d[i], d[i + 1], d[i + 2]] as const;
    };
    const corners = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
    let light = 0;
    for (const [r, g, b] of corners) {
      const bright = (r + g + b) / 3;
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      if (bright >= 225 && sat <= 20) light++;
    }
    return light >= 3;
  } catch {
    return false;
  }
}

const STATUS_ICON = {
  pass: <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" strokeWidth={2} />,
  warn: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" strokeWidth={2} />,
  fail: <XCircle className="h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />,
} as const;

const VERDICT = {
  pass: { cls: "border-green-200 bg-green-50 text-green-800 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-300", text: "No measurable issues detected" },
  warn: { cls: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300", text: "Review these measurements before submitting" },
  fail: { cls: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300", text: "Measurable issues detected — review below" },
} as const;

export function ComplianceCheckerTool() {
  const [examId, setExamId] = React.useState(SPECS[0]?.id ?? "ssc");
  const [kind, setKind] = React.useState<DocKind>("photo");
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<ComplianceReport | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sharing, setSharing] = React.useState(false);
  const [photoChecks, setPhotoChecks] = React.useState<PhotoCheck[] | null>(null);
  // Retain the checked file so a fix routes WITH the photo — no re-upload.
  const [sourceFile, setSourceFile] = React.useState<File | null>(null);
  const handoff = useWorkflowHandoff();

  React.useEffect(() => {
    track({ name: "tool_view", tool: "compliance-checker" });
  }, []);

  const spec = getPortalSpec(examId);
  const noSig = kind === "signature" && spec && spec.sigLimitKb == null;

  const onFile = async (file: File) => {
    if (!spec) return;
    setBusy(true);
    setError(null);
    setReport(null);
    setPhotoChecks(null);
    setSourceFile(file);
    track({ name: "tool_start", tool: "compliance-checker", device: deviceClass() });
    const bmp = await createImageBitmap(file).catch(() => null);
    try {
      let width: number | null = null;
      let height: number | null = null;
      let backgroundLight: boolean | undefined;
      if (bmp) {
        width = bmp.width;
        height = bmp.height;
        if (kind === "photo") backgroundLight = cornersLookWhite(bmp);
      }
      const type = (file.type || file.name.split(".").pop() || "").toLowerCase();
      const facts: FileFacts = { bytes: file.size, width, height, type, backgroundLight };
      const rep = checkCompliance(facts, spec, kind);
      setReport(rep);

      // Automated photo-quality analysis (face geometry + background/lighting). Photo
      // only; runs on a downscaled copy to keep mobile memory low.
      if (kind === "photo" && bmp) {
        try {
          const cap = 1024;
          const s = Math.min(1, cap / Math.max(bmp.width, bmp.height));
          const cw = Math.max(1, Math.round(bmp.width * s));
          const ch = Math.max(1, Math.round(bmp.height * s));
          const ac = document.createElement("canvas");
          ac.width = cw;
          ac.height = ch;
          ac.getContext("2d")?.drawImage(bmp, 0, 0, cw, ch);
          setPhotoChecks(await checkPhotoQuality(ac, { width: cw, height: ch }));
        } catch {
          // Face/quality analysis is best-effort — never block the file report.
        }
      }
      track({ name: "tool_success", tool: "compliance-checker", device: deviceClass() });
    } catch {
      setError("Couldn't read that file. Try a JPG or PNG.");
      track({ name: "tool_failure", tool: "compliance-checker", device: deviceClass(), reason: "decode" });
    } finally {
      bmp?.close?.(); // release the bitmap's memory once all analysis is done
      setBusy(false);
    }
  };

  const shareResult = async () => {
    if (!report || !spec) return;
    setSharing(true);
    try {
      const examName = spec.name.split(" (")[0];
      const blob = await buildComplianceCard({ examName, kind, report });
      const file = new File([blob], `easyphoto-${spec.id}-${kind}-check.png`, {
        type: "image/png",
      });
      const verdictWord =
        report.verdict === "pass"
          ? "looks good"
          : report.verdict === "warn"
            ? "needs a check"
            : "needs fixing";
      const shareData: ShareData = {
        title: "easyPhoto pre-submission photo check",
        text: `I reviewed my ${examName} ${kind} measurements at easyphoto.in`,
      };
      // Prefer native share-with-image where supported (mobile); else download.
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ ...shareData, files: [file] });
        track({ name: "compliance_share", tool: "compliance-checker", method: "native" });
      } else {
        downloadBlob(blob, file.name, "compliance-checker");
        track({ name: "compliance_share", tool: "compliance-checker", method: "download" });
      }
    } catch {
      // User cancelled the share sheet, or an error — no-op (non-blocking).
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="text-sm">
          <label htmlFor="compliance-exam-select" className="eyebrow mb-1 block">
            Exam / form
          </label>
          <select
            id="compliance-exam-select"
            value={examId}
            onChange={(e) => {
              setExamId(e.target.value);
              setReport(null);
            }}
            className="h-10 rounded-md border border-hairline-strong bg-background px-3 text-sm"
          >
            {SPECS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.split(" (")[0]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="eyebrow mb-1 block">Document</span>
          <div className="flex gap-1.5">
            {(["photo", "signature"] as DocKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setKind(k);
                  setReport(null);
                }}
                className={`rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  kind === k
                    ? "border-brand bg-brand-soft/40 text-brand"
                    : "border-hairline-strong hover:bg-accent/40"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {noSig ? (
        <p className="rounded-md border border-hairline bg-paper p-3 text-sm text-muted-foreground">
          This form doesn&apos;t specify a separate signature upload. Pick another exam or check the photo.
        </p>
      ) : (
        <Uploader onFile={onFile} disabled={busy} />
      )}

      {busy && (
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> Checking…
        </p>
      )}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">{error}</p>
      )}

      {report && (() => {
        // Readiness score — derived transparently from the checks shown below
        // (pass = 1, warn = 0.5, fail = 0). Not a magic number: it provably
        // maps to the checklist, so it reassures without faking precision.
        const all = [...report.checks, ...(photoChecks ?? [])];
        const score = all.length
          ? Math.round(
              (all.reduce(
                (s, c) => s + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0),
                0
              ) /
                all.length) *
                100
            )
          : 0;
        return (
        <div className="space-y-4">
          <div className={`flex items-center gap-4 rounded-lg border p-4 ${VERDICT[report.verdict].cls}`}>
            <div className="shrink-0 text-center">
              <div className="text-3xl font-bold leading-none">
                {score}
                <span className="text-base font-semibold opacity-70">/100</span>
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                Readiness
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{VERDICT[report.verdict].text}</p>
              <p className="mt-0.5 text-xs opacity-80">
                Based on the {all.length} checks below — fix any ✗ or ⚠ before you upload.
              </p>
            </div>
          </div>
          <ul className="space-y-2.5">
            {report.checks.map((c) => (
              <li key={c.label} className="flex items-start gap-2.5 text-sm">
                {STATUS_ICON[c.status]}
                <span>
                  <span className="font-medium text-foreground">{c.label}: </span>
                  <span className="text-muted-foreground">{c.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Automated photo-quality analysis — face geometry + background/lighting,
              each with a concrete fix. Photo only. */}
          {photoChecks && photoChecks.length > 0 && (
            <div className="space-y-2.5 rounded-lg border border-hairline bg-paper p-4">
              <p className="eyebrow text-ink-soft">Automated photo checks</p>
              {photoChecks.map((c) => (
                <div key={c.label} className="flex items-start gap-2.5 text-sm">
                  {STATUS_ICON[c.status]}
                  <span>
                    <span className="font-medium text-foreground">{c.label}: </span>
                    <span className="text-muted-foreground">{c.detail}</span>
                    {c.fix && c.status !== "pass" && (
                      <span className="mt-0.5 block text-xs text-brand">
                        →{" "}
                        {c.href && sourceFile ? (
                          // Carry the checked photo straight into the fix tool.
                          <button
                            type="button"
                            onClick={() => handoff(sourceFile, sourceFile.name, c.href!)}
                            className="underline underline-offset-2"
                          >
                            {c.fix}
                          </button>
                        ) : c.href ? (
                          <Link href={c.href} className="underline underline-offset-2">
                            {c.fix}
                          </Link>
                        ) : (
                          c.fix
                        )}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {report.verdict !== "pass" && spec && (
              // Photo fixes carry the file into the form resizer (which auto-loads
              // it into its photo slot). Signature stays a plain link to avoid
              // landing in the wrong slot.
              kind === "photo" && sourceFile ? (
                <button
                  type="button"
                  onClick={() => handoff(sourceFile, sourceFile.name, `/tools/form-resizer/${spec.id}/`)}
                  className="inline-flex items-center gap-1 rounded-md bg-cta px-3.5 py-2 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
                >
                  Fix it — resize for {spec.name.split(" (")[0]} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  href={`/tools/form-resizer/${spec.id}/`}
                  className="inline-flex items-center gap-1 rounded-md bg-cta px-3.5 py-2 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
                >
                  Fix it — resize for {spec.name.split(" (")[0]} <ArrowRight className="h-4 w-4" />
                </Link>
              )
            )}
            <button
              type="button"
              onClick={shareResult}
              disabled={sharing}
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50 disabled:opacity-60"
            >
              {sharing ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
              ) : (
                <Share2 className="h-4 w-4" strokeWidth={1.75} />
              )}
              Save / share result
            </button>
            {spec && (
              <Link
                href={`/exam-requirements/${spec.id}/`}
                className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50"
              >
                See the full spec
              </Link>
            )}
          </div>
          <ToolLimitationsNotice
            canCheck={kind === "photo"
              ? [
                  "File size, dimensions, and format against the selected listing",
                  "Background uniformity at the image corners",
                  "Approximate face position, framing, and lighting",
                ]
              : [
                  "File size, dimensions, and format against the selected listing",
                  "Whether the image corners appear light and plain",
                ]}
            cannotCheck={kind === "photo"
              ? [
                  "Identity, recency, expression, or glasses glare in every case",
                  "Requirements that are not encoded in the selected listing",
                  "The portal or reviewing authority’s final decision",
                ]
              : [
                  "Whose signature is shown or whether it is current",
                  "Requirements that are not encoded in the selected listing",
                  "The portal or reviewing authority’s final decision",
                ]}
          />
        </div>
        );
      })()}
    </div>
  );
}
