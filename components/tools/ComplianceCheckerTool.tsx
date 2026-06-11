"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, ArrowRight, Share2 } from "lucide-react";
import { Uploader } from "@/components/tool/Uploader";
import { allPortalSpecs, getPortalSpec } from "@/lib/specRegistry";
import {
  checkCompliance,
  type ComplianceReport,
  type DocKind,
  type FileFacts,
} from "@/lib/compliance";
import { buildComplianceCard } from "@/lib/complianceCard";
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
  pass: { cls: "border-green-200 bg-green-50 text-green-800", text: "Looks good — likely to be accepted" },
  warn: { cls: "border-amber-200 bg-amber-50 text-amber-800", text: "Check these before you upload" },
  fail: { cls: "border-red-200 bg-red-50 text-red-700", text: "Will likely be rejected — fix below" },
} as const;

export function ComplianceCheckerTool() {
  const [examId, setExamId] = React.useState(SPECS[0]?.id ?? "ssc");
  const [kind, setKind] = React.useState<DocKind>("photo");
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<ComplianceReport | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sharing, setSharing] = React.useState(false);

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
    track({ name: "tool_start", tool: "compliance-checker", device: deviceClass() });
    try {
      let width: number | null = null;
      let height: number | null = null;
      let backgroundLight: boolean | undefined;
      const bmp = await createImageBitmap(file).catch(() => null);
      if (bmp) {
        try {
          width = bmp.width;
          height = bmp.height;
          if (kind === "photo") backgroundLight = cornersLookWhite(bmp);
        } finally {
          // Always release the bitmap's GPU memory, even if analysis throws.
          bmp.close?.();
        }
      }
      const type = (file.type || file.name.split(".").pop() || "").toLowerCase();
      const facts: FileFacts = { bytes: file.size, width, height, type, backgroundLight };
      const rep = checkCompliance(facts, spec, kind);
      setReport(rep);
      track({ name: "tool_success", tool: "compliance-checker", device: deviceClass() });
    } catch {
      setError("Couldn't read that file. Try a JPG or PNG.");
      track({ name: "tool_failure", tool: "compliance-checker", device: deviceClass(), reason: "decode" });
    } finally {
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
        title: "easyPhoto compliance check",
        text: `My ${examName} ${kind} ${verdictWord} — checked free at easyphoto.in`,
      };
      // Prefer native share-with-image where supported (mobile); else download.
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ ...shareData, files: [file] });
        track({ name: "compliance_share", tool: "compliance-checker", method: "native" });
      } else {
        downloadBlob(blob, file.name);
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
        <label className="text-sm">
          <span className="eyebrow mb-1 block">Exam / form</span>
          <select
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
        </label>
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
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {report && (
        <div className="space-y-4">
          <div className={`rounded-md border p-3 text-sm font-semibold ${VERDICT[report.verdict].cls}`}>
            {VERDICT[report.verdict].text}
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
          <div className="flex flex-wrap gap-1.5 pt-1">
            {report.verdict !== "pass" && spec && (
              <Link
                href={`/tools/form-resizer/${spec.id}/`}
                className="inline-flex items-center gap-1 rounded-md bg-cta px-3.5 py-2 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
              >
                Fix it — resize for {spec.name.split(" (")[0]} <ArrowRight className="h-4 w-4" />
              </Link>
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
          <p className="text-xs text-ink-faint">
            Deterministic checks (size, dimensions, format) are exact; the background check is a guide.
            Always confirm against the official portal before submitting.
          </p>
        </div>
      )}
    </div>
  );
}
