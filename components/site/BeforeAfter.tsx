/**
 * Before → After result section. Illustrated (not photographic) so it ships with
 * zero external assets, stays perfectly on-brand (navy + gold + dimension lines),
 * and can't be prompt-cloned. Shows what the tool actually fixes: framing & size,
 * with a neutral, compliant expression throughout (a smiling photo is a rejection
 * reason, so it only ever appears on the "Before / rejected" side).
 */
export function BeforeAfter() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-16">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow text-[#A87E10]">The result</span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            From a quick selfie to{" "}
            <span className="mark-gold text-ink">exam-ready</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            We fix the crop, size and background to the exact spec — no reshoots,
            no studio.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* BEFORE */}
          <figure className="w-[240px] rounded-xl border border-hairline bg-card p-4 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-destructive">
              ✗ Rejected
            </span>
            <svg viewBox="0 0 180 210" fill="none" className="mx-auto h-[190px] w-auto" aria-hidden="true">
              <rect x="14" y="10" width="152" height="190" rx="10" fill="hsl(var(--accent))" stroke="hsl(var(--ink))" strokeWidth="2.4" />
              <path d="M24 44 l46 -12 M24 66 l30 -8 M120 170 l34 9 M30 150 l26 8" stroke="hsl(var(--hairline-strong))" strokeWidth="3.5" strokeLinecap="round" />
              <g transform="rotate(-9 78 92)">
                <circle cx="78" cy="78" r="25" stroke="hsl(var(--ink))" strokeWidth="2.6" />
                <path d="M44 150 q34 -42 68 0" stroke="hsl(var(--ink))" strokeWidth="2.6" strokeLinecap="round" />
              </g>
            </svg>
            <figcaption className="mt-3 text-[12.5px] text-muted-foreground">
              <b className="text-ink">Before</b> — off-centre, busy background
            </figcaption>
          </figure>

          {/* ARROW */}
          <div className="flex flex-col items-center gap-2 text-[#A87E10]">
            <svg width="46" height="22" viewBox="0 0 46 22" fill="none" aria-hidden="true">
              <path d="M2 11 h38 M33 4 l8 7 -8 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wide">Auto-fit</span>
          </div>

          {/* AFTER */}
          <figure className="w-[240px] rounded-xl border border-hairline bg-card p-4 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-success">
              ✓ Accepted
            </span>
            <svg viewBox="0 0 180 210" fill="none" className="mx-auto h-[190px] w-auto" aria-hidden="true">
              <rect x="34" y="14" width="112" height="178" rx="7" fill="hsl(var(--surface))" stroke="hsl(var(--ink))" strokeWidth="2.4" />
              <circle cx="90" cy="78" r="27" stroke="hsl(var(--ink))" strokeWidth="2.6" />
              <path d="M52 184 q38 -48 76 0" stroke="hsl(var(--ink))" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M34 6 h112 M34 2 v8 M146 2 v8" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" />
              <path d="M158 14 v178 M154 14 h8 M154 192 h8" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" />
              <line x1="44" y1="42" x2="136" y2="42" stroke="hsl(var(--success))" strokeWidth="1.6" strokeDasharray="4 4" />
              <circle cx="138" cy="170" r="15" fill="hsl(var(--success))" />
              <path d="M131 170 l5 5 9 -10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <figcaption className="mt-3 font-mono text-[12px] font-medium text-ink">
              350×450 · 20–50 KB
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
