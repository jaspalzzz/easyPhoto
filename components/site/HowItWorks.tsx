import type { ReactNode } from "react";

/** Step copy kept exported (consumed elsewhere) — now paired with bespoke
 *  hand-drawn line illustrations instead of stock icons. */
export const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload your photo",
    body: "Drop in any clear, front-facing photo. It stays on your device.",
  },
  {
    title: "We fit it to spec",
    body: "We size the head, set the right background and compress to the exact KB.",
  },
  {
    title: "Download, accepted",
    body: "Get an upload-ready file and a print sheet that pass the official checks.",
  },
];

/* Bespoke line illustrations — navy ink, gold accents, green for the verified
   state. The hand-drawn motif is the part clones can't prompt-generate. */
const ILLUSTRATIONS: ReactNode[] = [
  // 1 · upload
  <svg key="1" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <rect x="18" y="6" width="24" height="40" rx="5" stroke="hsl(var(--ink))" strokeWidth="2.4" />
    <circle cx="30" cy="22" r="6" stroke="hsl(var(--ink))" strokeWidth="2.2" />
    <path d="M21 38 q9 -10 18 0" stroke="hsl(var(--ink))" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30 50 v-9 M26 45 l4 -4 4 4" stroke="hsl(var(--cta))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // 2 · fit to spec
  <svg key="2" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <rect x="16" y="12" width="28" height="36" rx="4" stroke="hsl(var(--ink))" strokeWidth="2.2" />
    <circle cx="30" cy="27" r="7" stroke="hsl(var(--ink))" strokeWidth="2.2" />
    <path d="M20 44 q10 -11 20 0" stroke="hsl(var(--ink))" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M16 6 h28 M16 4 v5 M44 4 v5" stroke="hsl(var(--cta))" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M52 12 v36 M50 12 h4 M50 48 h4" stroke="hsl(var(--cta))" strokeWidth="1.9" strokeLinecap="round" />
    <line x1="22" y1="18" x2="38" y2="18" stroke="hsl(var(--success))" strokeWidth="1.6" strokeDasharray="3 3" />
  </svg>,
  // 3 · download accepted
  <svg key="3" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <rect x="16" y="14" width="28" height="34" rx="4" stroke="hsl(var(--ink))" strokeWidth="2.2" />
    <circle cx="30" cy="28" r="6" stroke="hsl(var(--ink))" strokeWidth="2.2" />
    <path d="M21 44 q9 -10 18 0" stroke="hsl(var(--ink))" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30 4 v9 M26 10 l4 4 4 -4" stroke="hsl(var(--cta))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="45" cy="45" r="9" fill="hsl(var(--success))" />
    <path d="M41 45 l3 3 5 -6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export function HowItWorks() {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <span className="eyebrow hidden sm:block">Three steps</span>
      </div>

      <div className="relative mt-10">
        {/* Hand-drawn connecting path (desktop) */}
        <svg
          className="pointer-events-none absolute left-[16%] top-9 hidden h-14 w-[68%] md:block"
          viewBox="0 0 800 56"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 28 C 200 -6, 260 60, 400 28 S 620 -6, 780 28"
            stroke="hsl(var(--cta))"
            strokeWidth="2.2"
            strokeDasharray="11 9"
            strokeLinecap="round"
          />
        </svg>

        <ol className="relative grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <li key={s.title} className="text-center">
              <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-full border border-hairline bg-card [&_svg]:h-12 [&_svg]:w-12">
                {ILLUSTRATIONS[i]}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink">
                {s.title}
              </h3>
              <p className="mx-auto mt-1.5 max-w-[16em] text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
