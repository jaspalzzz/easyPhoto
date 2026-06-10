import * as React from "react";

/** Faux page lines (width %, animation-delay) — irregular so the "document"
 *  reads as real text being scanned, not a loading skeleton. */
const DOC_LINES = [
  { w: 82, delay: "0s" },
  { w: 64, delay: "0.15s" },
  { w: 74, delay: "0.3s" },
  { w: 48, delay: "0.45s" },
  { w: 68, delay: "0.6s" },
  { w: 38, delay: "0.75s" },
] as const;

/**
 * On-brand processing indicator for the document / image tools.
 *
 * Replaces the bare spinning loader with the "passport bureau" scanner motif:
 * a brand scan-line sweeps over a small framed document while an indeterminate
 * bar tracks below and the live status reads in monospace specimen type. Reads
 * as a precise instrument at work — not a generic hang.
 *
 * PERF: every animated layer uses transform/opacity only, so the whole effect
 * runs on the compositor thread and stays smooth even while the main thread is
 * saturated by PDF rendering or image compression.
 */
export function ProcessingState({
  label,
  bare = false,
  className = "",
}: {
  label: string;
  /** Drop the framed container — for use inside an existing preview frame. */
  bare?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 py-9 ${
        bare ? "" : "rounded-md border border-hairline bg-accent/5"
      } ${className}`}
    >
      {/* Framed document with a sweeping scan-line */}
      <div className="relative h-16 w-[52px] shrink-0 overflow-hidden rounded-[3px] border border-hairline-strong bg-surface shadow-panel">
        {/* faux page text being "read" */}
        <div className="absolute inset-0 flex flex-col gap-[5px] px-2 py-2.5">
          {DOC_LINES.map((l, i) => (
            <span
              key={i}
              className="ep-doc-line block h-[2px]"
              style={{ width: `${l.w}%`, animationDelay: l.delay }}
            />
          ))}
        </div>
        {/* the sweeping scan band: glow halo + crisp line (transform-only) */}
        <span aria-hidden className="ep-scan-sweep">
          <span className="ep-scan-glow" />
          <span className="ep-scan-line" />
        </span>
      </div>

      {/* Indeterminate progress track */}
      <span aria-hidden className="ep-track w-40" />

      <p
        className="spec normal-case tracking-[0.04em] text-ink-soft"
        aria-live="polite"
      >
        {label}
      </p>
    </div>
  );
}
