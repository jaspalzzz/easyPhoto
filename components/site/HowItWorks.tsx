import type { ReactNode } from "react";

/** Kept exported — consumed by page.tsx import (backward-compat). */
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

const PIPELINE_STAGES = [
  {
    n: "01",
    title: "Upload",
    bullets: [
      "Phone, camera or file drop",
      "On-device — never leaves your browser",
      "JPEG · PNG · HEIC accepted",
    ],
  },
  {
    n: "02",
    title: "Face Detection",
    bullets: [
      "Landmark mapping & tilt fix",
      "Eye-height & head-size check",
      "ICAO alignment verified",
    ],
  },
  {
    n: "03",
    title: "Background",
    bullets: [
      "AI background removal",
      "Spec-correct colour fill",
      "Brightness & contrast match",
    ],
  },
  {
    n: "04",
    title: "Precision Crop",
    bullets: [
      "Exact mm for your country",
      "Head-height % enforced",
      "DPI & KB targeting",
    ],
  },
  {
    n: "05",
    title: "Download",
    bullets: [
      "Compliant single photo",
      "Ready-to-print 4×6 sheet",
      "Signature pair option",
    ],
  },
];

/* Hand-drawn navy+gold illustrations — one per stage */
const STAGE_ICONS: ReactNode[] = [
  /* 01 — phone / upload arrow */
  <svg key="upload" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="13" y="4" width="22" height="36" rx="4" stroke="hsl(var(--ink))" strokeWidth="2" />
    <circle cx="24" cy="18" r="6" stroke="hsl(var(--ink))" strokeWidth="1.8" />
    <path d="M16 34 q8 -8 16 0" stroke="hsl(var(--ink))" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M24 44 v-7 M20 41 l4 -4 4 4" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,

  /* 02 — face landmark scan / corner brackets */
  <svg key="detect" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="22" r="9" stroke="hsl(var(--ink))" strokeWidth="1.8" />
    <circle cx="21" cy="20" r="1.3" fill="hsl(var(--ink))" />
    <circle cx="27" cy="20" r="1.3" fill="hsl(var(--ink))" />
    <path d="M20 25 q4 3 8 0" stroke="hsl(var(--ink))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 6 h8 M6 6 v8" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 6 h-8 M42 6 v8" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 42 h8 M6 42 v-8" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 42 h-8 M42 42 v-8" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" />
  </svg>,

  /* 03 — rectangle with eraser arrow (background removal) */
  <svg key="bg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="6" y="8" width="36" height="32" rx="4" stroke="hsl(var(--ink))" strokeWidth="2" />
    <circle cx="24" cy="22" r="7" stroke="hsl(var(--ink))" strokeWidth="1.8" />
    <path d="M11 36 q13 -11 26 0" stroke="hsl(var(--ink))" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M32 10 l5 5 -5 5" stroke="hsl(var(--cta))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="26" y1="15" x2="37" y2="15" stroke="hsl(var(--cta))" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,

  /* 04 — crop marks top + right */
  <svg key="crop" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="10" y="6" width="28" height="36" rx="3" stroke="hsl(var(--ink))" strokeWidth="2" />
    <circle cx="24" cy="22" r="6" stroke="hsl(var(--ink))" strokeWidth="1.8" />
    <path d="M14 38 q10 -9 20 0" stroke="hsl(var(--ink))" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 2 h28 M10 1 v4 M38 1 v4" stroke="hsl(var(--cta))" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M44 6 v36 M43 6 h3 M43 42 h3" stroke="hsl(var(--cta))" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,

  /* 05 — download arrow + green verified badge */
  <svg key="done" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="10" y="8" width="28" height="32" rx="4" stroke="hsl(var(--ink))" strokeWidth="2" />
    <circle cx="24" cy="22" r="6" stroke="hsl(var(--ink))" strokeWidth="1.8" />
    <path d="M14 36 q10 -9 20 0" stroke="hsl(var(--ink))" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M24 2 v8 M20 7 l4 4 4 -4" stroke="hsl(var(--cta))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="36" cy="36" r="8" fill="hsl(var(--success))" />
    <path d="M32 36 l3 3 5 -6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export function HowItWorks() {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <span className="eyebrow hidden sm:block">Five-stage AI pipeline</span>
      </div>

      <div className="relative mt-10">
        {/* Desktop: hand-drawn dashed golden connector behind the stage badges */}
        <svg
          className="pointer-events-none absolute left-[8%] top-[26px] hidden h-10 w-[84%] lg:block"
          viewBox="0 0 900 40"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 20 C 130 4, 180 36, 225 20 S 390 4, 450 20 S 620 36, 675 20 S 820 4, 880 20"
            stroke="hsl(var(--cta))"
            strokeWidth="2"
            strokeDasharray="10 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Mobile: vertical numbered list — Desktop: 5-column horizontal pipeline */}
        <ol className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-4">
          {PIPELINE_STAGES.map((stage, i) => (
            <li key={stage.n} className="flex gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">

              {/* Stage number badge — navy circle, gold text */}
              <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[hsl(222_60%_8%)] text-[11px] font-bold tracking-widest text-[hsl(var(--cta))] lg:mx-auto">
                {stage.n}
              </div>

              {/* Mobile: vertical connector line between stages */}
              {i < PIPELINE_STAGES.length - 1 && (
                <div
                  className="absolute left-[25px] mt-[52px] h-6 w-0 border-l-2 border-dashed border-[hsl(var(--cta))] lg:hidden"
                  aria-hidden
                />
              )}

              {/* Illustration circle — visible on desktop only (keeps the hand-drawn motif) */}
              <div className="hidden lg:mx-auto lg:mt-3 lg:flex lg:h-16 lg:w-16 lg:items-center lg:justify-center lg:rounded-full lg:border lg:border-hairline lg:bg-card [&_svg]:h-9 [&_svg]:w-9">
                {STAGE_ICONS[i]}
              </div>

              {/* Title + sub-bullets */}
              <div className="flex-1 pt-0.5 lg:pt-0">
                <h3 className="text-[14px] font-semibold tracking-tight text-ink lg:mt-3 lg:text-[13px]">
                  {stage.title}
                </h3>
                <ul className="mt-1.5 space-y-0.5">
                  {stage.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-left text-[12px] leading-relaxed text-muted-foreground lg:text-center lg:text-[11px]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
