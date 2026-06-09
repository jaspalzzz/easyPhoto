import * as React from "react";
import { CropMarks } from "@/components/site/CropMarks";

/** Glitter riding the scan-line: varied positions/sizes/delays so it twinkles
 *  organically rather than in lockstep. Purely decorative. */
const SPARKS = [
  { left: "9%", size: 5, delay: "0s" },
  { left: "23%", size: 3, delay: "0.55s" },
  { left: "38%", size: 6, delay: "0.2s" },
  { left: "52%", size: 4, delay: "0.8s" },
  { left: "66%", size: 5, delay: "0.35s" },
  { left: "80%", size: 3, delay: "0.65s" },
  { left: "93%", size: 5, delay: "0.15s" },
] as const;

export interface ScanStep {
  /** Matches the tool's status key. */
  key: string;
  /** Short label shown under the dot. */
  label: string;
}

/**
 * Document-scanner-style progress. Instead of a bare spinner, it sweeps a brand
 * scan-line over the user's own photo (framed with the crop-mark motif) and shows
 * named live stages — so the wait reads as a precise, on-brand process rather than
 * a hang. Falls back to a clean framed placeholder when there's no thumbnail.
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
    <div className="flex flex-col items-center gap-5 py-10">
      <div className="relative overflow-hidden rounded-md border border-hairline-strong bg-paper">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            aria-hidden
            className="block max-h-[280px] w-auto max-w-full"
          />
        ) : (
          <div className="h-[200px] w-[150px]" />
        )}
        {/* faint dim so the scan-line reads on bright photos */}
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-ink/[0.06]" />
        {/* the sweeping scan band: glow halo + crisp line + twinkling glitter.
            One compositor layer (transform/opacity only) → smooth under load. */}
        <span aria-hidden className="ep-scan-sweep">
          <span className="ep-scan-glow" />
          <span className="ep-scan-line" />
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className="ep-spark"
              style={{
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
              }}
            />
          ))}
        </span>
        <CropMarks size={16} inset={8} />
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-medium text-foreground" aria-live="polite">
          {label}
        </p>
        {hint && <p className="spec normal-case tracking-[0.04em]">{hint}</p>}
      </div>

      {steps && steps.length > 0 && (
        <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2" aria-hidden>
          {steps.map((s, i) => {
            const done = activeIdx > i;
            const active = activeIdx === i;
            return (
              <React.Fragment key={s.key}>
                {i > 0 && (
                  <span className={`h-px w-4 ${done ? "bg-brand" : "bg-hairline"}`} />
                )}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                    active ? "text-brand" : done ? "text-ink-soft" : "text-ink-faint"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      active
                        ? "ep-pulse bg-brand"
                        : done
                          ? "bg-brand"
                          : "bg-hairline-strong"
                    }`}
                  />
                  {s.label}
                </span>
              </React.Fragment>
            );
          })}
        </ol>
      )}
    </div>
  );
}
