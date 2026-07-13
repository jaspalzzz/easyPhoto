import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReceiptCheck {
  /** What was checked, e.g. "File size". */
  label: string;
  /** The achieved value, e.g. "24.3 KB (within 20–50 KB)". */
  value: string;
  /** Pass/fail for this line. */
  ok: boolean;
}

/**
 * A pre-submission receipt for the measurable checks the tool performs.
 */
export function ComplianceReceipt({
  requirement,
  checks,
  className,
}: {
  /** The named requirement, e.g. "SSC (Staff Selection Commission)". */
  requirement: string;
  checks: ReceiptCheck[];
  className?: string;
}) {
  const allOk = checks.every((c) => c.ok);

  return (
    <div
      role="status"
      className={cn(
        "ep-fade-in rounded-xl border p-4 sm:p-5",
        allOk
          ? "border-[hsl(142_50%_45%/0.4)] bg-[hsl(142_55%_45%/0.07)]"
          : "border-[hsl(38_92%_50%/0.4)] bg-[hsl(38_92%_50%/0.07)]",
        className
      )}
    >
      <p className="flex items-start gap-2 text-sm font-semibold text-ink">
        {allOk ? (
          <CheckCircle2
            className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[hsl(142_55%_34%)]"
            strokeWidth={2}
          />
        ) : (
          <AlertTriangle
            className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[hsl(32_80%_42%)]"
            strokeWidth={2}
          />
        )}
        <span>
          {allOk
            ? `No measurable issues detected for ${requirement}`
            : `Review the marked ${requirement} measurements`}
        </span>
      </p>

      <dl className="mt-3 space-y-1.5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-baseline justify-between gap-3 text-[13px]">
            <dt className="text-ink-soft">{c.label}</dt>
            <dd
              className={cn(
                "text-right font-mono font-medium tabular-nums",
                c.ok ? "text-ink" : "text-[hsl(32_80%_38%)]"
              )}
            >
              {c.ok ? "✓ " : "✗ "}
              {c.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 flex items-start gap-1.5 border-t border-ink/10 pt-2.5 text-xs text-ink-soft">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        {allOk
          ? "No detectable issues found. The file is on your device only — nothing was uploaded."
          : "Review the marked line and confirm the current portal instructions before submitting."}
      </p>
    </div>
  );
}
