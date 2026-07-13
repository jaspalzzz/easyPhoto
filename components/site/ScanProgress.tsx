import * as React from "react";
import { Check } from "lucide-react";
import { CropMarks } from "@/components/site/CropMarks";

/** Glitter riding the scan-line: varied positions/sizes/delays so it twinkles
 *  organically rather than in lockstep. Purely decorative. */
const SPARKS = [
  { left: "9%",  size: 5, delay: "0s"    },
  { left: "23%", size: 3, delay: "0.55s" },
  { left: "38%", size: 6, delay: "0.2s"  },
  { left: "52%", size: 4, delay: "0.8s"  },
  { left: "66%", size: 5, delay: "0.35s" },
  { left: "80%", size: 3, delay: "0.65s" },
  { left: "93%", size: 5, delay: "0.15s" },
] as const;

export interface ScanStep {
  /** Matches the tool's status key. */
  key: string;
  /** Short label shown beside the step circle. */
  label: string;
}

/**
 * Document-scanner-style progress. Shows a vertical numbered stepper on the
 * left and the user's photo with an animated scan line on the right — the wait
 * reads as a precise, on-brand process rather than a hang.
 */
export function ScanProgress({
  label,
  hint,
  thumbnailUrl,
  steps,
  activeKey,
}: {
  label: string;
  hint?: string;
  thumbnailUrl?: string | null;
  steps?: ScanStep[];
  activeKey?: string;
}) {
  const activeIdx =
    steps && activeKey ? steps.findIndex((s) => s.key === activeKey) : -1;

  return (
    /* Mobile: photo on top, steps below.  sm+: steps left, photo right. */
    <div className="flex flex-col-reverse gap-6 py-6 sm:flex-row sm:items-center sm:gap-10">

      {/* ── Left: vertical stepper ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <h3 className="mb-5 text-[17px] font-bold tracking-tight text-ink">
          Preparing your photo
        </h3>

        {steps && steps.length > 0 && (
          <ol className="space-y-0">
            {steps.map((s, i) => {
              const done   = activeIdx > i;
              const active = activeIdx === i;
              const last   = i === steps.length - 1;

              return (
                <li key={s.key} className="relative flex items-start gap-4">

                  {/* Vertical connector track */}
                  {!last && (
                    <span
                      aria-hidden
                      className={`absolute left-[15px] top-8 h-8 w-px transition-colors duration-500 ${
                        done ? "bg-brand" : "bg-hairline-strong"
                      }`}
                    />
                  )}

                  {/* Step circle */}
                  <span
                    className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 ${
                      done
                        ? "bg-brand text-white"
                        : active
                          ? "bg-ink text-white shadow-lg"
                          : "border-2 border-hairline-strong bg-paper text-ink-faint"
                    }`}
                  >
                    {done ? (
                      <Check className="h-[15px] w-[15px]" strokeWidth={2.5} />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </span>

                  {/* Step label + pulse dot */}
                  <span className="mb-8 flex flex-1 items-center gap-2 pt-1.5">
                    <span
                      className={`text-[14px] leading-tight transition-colors duration-200 ${
                        active
                          ? "font-semibold text-ink"
                          : done
                            ? "text-ink-soft"
                            : "text-ink-faint"
                      }`}
                    >
                      {s.label}
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand"
                      />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {/* Active step subtitle */}
        <p className="mt-1 text-[12px] text-ink-soft" aria-live="polite">
          {label}
        </p>
        {hint && (
          <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
            {hint}
          </p>
        )}
      </div>

      {/* ── Right: photo + scan animation ─────────────────────────────── */}
      <div className="relative flex min-h-[220px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-hairline-strong bg-paper shadow-sm">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            aria-hidden
            className="block max-h-[300px] w-auto max-w-full rounded-lg"
          />
        ) : (
          <div className="h-[220px] w-[165px]" />
        )}

        {/* Faint dim so the scan-line reads on bright photos */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink/[0.06]"
        />

        {/* Sweeping scan band */}
        <span aria-hidden className="ep-scan-sweep">
          <span className="ep-scan-glow" />
          <span className="ep-scan-line" />
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className="ep-spark"
              style={{
                left:           s.left,
                width:          s.size,
                height:         s.size,
                animationDelay: s.delay,
              }}
            />
          ))}
        </span>

        <CropMarks size={16} inset={8} />
      </div>

      {/* Screen-reader live region: announces each step change */}
      {steps && activeKey && (
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {steps.find((s) => s.key === activeKey)?.label ?? ""}
        </span>
      )}
    </div>
  );
}
