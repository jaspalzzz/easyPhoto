/**
 * AiShowcase — "AI Perfects Every Detail"
 * Premium 3-panel flow + 4-step strip — colours from site design system only
 * Brand navy: hsl(212 64% 24%) | Gold CTA: hsl(45 88% 60%) | brand-soft bg
 */

const BEFORE_ISSUES = [
  "Busy Background",
  "Uneven Lighting",
  "Face Not Centered",
  "Wrong Size & Ratio",
];

const AI_CHECKS = [
  {
    label: "Background Removed",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[hsl(212_64%_24%)]">
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    label: "Face Centered",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[hsl(212_64%_24%)]">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <path d="M8 2V4.5M8 11.5V14M2 8H4.5M11.5 8H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Lighting Optimized",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[hsl(212_64%_24%)]">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Size & Ratio Adjusted",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[hsl(212_64%_24%)]">
        <path d="M1 5V2h3M15 11v3h-3M5 14H2v-3M11 2h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Compliance Verified",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[hsl(212_64%_24%)]">
        <path d="M8 1.5L2 4v4C2 11.5 4.5 14 8 15c3.5-1 6-3.5 6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5.5 8l1.5 1.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    num: "1",
    label: "Upload",
    body: "Upload your photo or selfie",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[hsl(45_88%_60%)]">
        <path d="M12 15V3M12 3L8 7M12 3l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "2",
    label: "AI Process",
    body: "Our AI enhances and optimizes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[hsl(45_88%_60%)]">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M8 3v2M12 3v2M16 3v2M8 19v2M12 19v2M16 19v2M3 8h2M3 12h2M3 16h2M19 8h2M19 12h2M19 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "3",
    label: "Verify",
    body: "We check compliance with official norms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[hsl(45_88%_60%)]">
        <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8.5 12l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "4",
    label: "Download",
    body: "Get your perfect photo in seconds",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[hsl(45_88%_60%)]">
        <path d="M12 3v13M12 16l-5-5M12 16l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function AiShowcase() {
  return (
    <section className="border-t border-hairline bg-[hsl(212_48%_97%)]">
      <div className="container py-16 sm:py-20">

        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-[2.4rem] font-bold tracking-tight text-ink sm:text-[2.8rem]">
            <span className="text-[hsl(45_88%_52%)]">AI</span>{" "}
            Perfects Every Detail
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            From any selfie to government-compliant photo in seconds
          </p>
        </div>

        {/* 3-panel comparison */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_52px_1.1fr_52px_1fr]">

          {/* Panel 1 — Before / Your Selfie */}
          <div className="rounded-2xl border-2 border-red-100 bg-white p-5 shadow-[0_4px_28px_rgba(239,68,68,0.08)]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                ✕
              </span>
              <span className="text-[14px] font-bold text-red-600">Your Selfie</span>
            </div>

            <div
              className="mx-auto mb-5 overflow-hidden rounded-xl shadow-sm"
              style={{ aspectRatio: "3/4", maxWidth: "160px" }}
            >
              <img
                src="/images/east_asian_man_input.png"
                alt="Example selfie before AI processing"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <ul className="space-y-2.5">
              {BEFORE_ISSUES.map((issue) => (
                <li key={issue} className="flex items-center gap-2.5 text-[13px] font-medium text-red-500">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[9px] font-black text-red-500">
                    ✕
                  </span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow: Before → AI (warm amber) */}
          <div className="hidden items-center justify-center md:flex">
            <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
              <path d="M2 10H34" stroke="url(#ag1)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M27 4l10 6-10 6" stroke="url(#ag1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs>
                <linearGradient id="ag1" x1="0" y1="10" x2="44" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fde68a" />
                  <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Panel 2 — AI Processing */}
          <div className="rounded-2xl border border-hairline bg-white p-6 shadow-[0_8px_36px_rgba(0,0,0,0.07)]">
            {/* Gold coin AI badge — matches HeroVisual */}
            <div className="mb-5 flex flex-col items-center">
              <div className="relative mb-3">
                <div
                  className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[#d97706]"
                  style={{
                    background: "linear-gradient(135deg, #ffe566 0%, #ffd000 45%, #f59e0b 100%)",
                    boxShadow: "0 8px 28px rgba(255,208,0,0.50), inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  <span
                    className="text-[1.75rem] font-black text-[#78350f]"
                    style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    AI
                  </span>
                </div>
                {/* Gold sparkle marks */}
                <span className="absolute -top-2 -right-1 text-[18px] leading-none text-[hsl(45_88%_60%)]">✦</span>
                <span className="absolute -bottom-1 -left-2 text-[12px] leading-none text-[hsl(45_88%_60%)] opacity-70">✦</span>
                <span className="absolute top-0 -left-3 text-[8px] leading-none text-[hsl(45_88%_60%)] opacity-50">✦</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                AI Processing
              </p>
            </div>

            {/* Checklist with icons */}
            <div className="space-y-3.5">
              {AI_CHECKS.map(({ label, icon }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(212_48%_93%)]">
                      {icon}
                    </span>
                    <span className="text-[13px] font-medium text-ink">{label}</span>
                  </div>
                  {/* Navy checkmark */}
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(212_64%_24%)] text-[9px] font-black text-white">
                    ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow: AI → After (emerald — kept semantic) */}
          <div className="hidden items-center justify-center md:flex">
            <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
              <path d="M2 10H34" stroke="url(#ag2)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M27 4l10 6-10 6" stroke="url(#ag2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs>
                <linearGradient id="ag2" x1="0" y1="10" x2="44" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6ee7b7" />
                  <stop offset="1" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Panel 3 — Compliant Photo */}
          <div className="rounded-2xl border-2 border-emerald-100 bg-white p-5 shadow-[0_4px_28px_rgba(16,185,129,0.08)]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                ✓
              </span>
              <span className="text-[14px] font-bold text-emerald-600">Compliant Photo</span>
            </div>

            {/* Photo with dimension markers */}
            <div className="relative mx-auto mb-4" style={{ width: "fit-content" }}>
              <div
                className="overflow-hidden rounded-lg border border-hairline shadow-sm"
                style={{ width: "160px", height: "213px" }}
              >
                <img
                  src="/images/east_asian_man_compliant.png"
                  alt="Compliant passport photo after AI processing"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Right: height marker */}
              <div className="absolute -right-7 inset-y-0 flex flex-col items-center">
                <div className="flex-1 border-r-2 border-dashed border-emerald-400" />
                <span
                  className="shrink-0 py-0.5 text-[9px] font-bold text-emerald-500"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  45 mm
                </span>
                <div className="flex-1 border-r-2 border-dashed border-emerald-400" />
              </div>

              {/* Bottom: width marker */}
              <div className="mt-1.5 flex items-center gap-1">
                <div className="flex-1" style={{ borderTop: "2px dashed #34d399" }} />
                <span className="shrink-0 text-[9px] font-bold text-emerald-500">35 mm</span>
                <div className="flex-1" style={{ borderTop: "2px dashed #34d399" }} />
              </div>
            </div>

            {/* Compliance badge */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0">
                  <path
                    d="M10 1.667L2.5 5v5c0 4.583 3.167 8.875 7.5 10 4.333-1.125 7.5-5.417 7.5-10V5L10 1.667z"
                    fill="#10b981"
                    fillOpacity="0.12"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path d="M7 10l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-[12px] font-bold text-emerald-700">100% Government Compliant</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-emerald-600">
                    Ready for Passport, Visa, OCI, ID &amp; more
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-step process strip */}
        <div className="relative mt-16">
          {/* Gold dashed connector (desktop only) */}
          <div
            className="pointer-events-none absolute left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] top-[22px] hidden h-px md:block"
            style={{ borderTop: "2px dashed hsl(45 88% 75%)" }}
          />

          <ol className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
            {STEPS.map((step) => (
              <li key={step.label} className="flex flex-col items-center text-center">
                {/* Dark navy circle with gold icon — matches site's existing dark badge style */}
                <div
                  className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full"
                  style={{
                    background: "hsl(222 60% 8%)",
                    boxShadow: "0 4px 14px rgba(255,208,0,0.20)",
                  }}
                >
                  {step.icon}
                </div>
                <p className="mt-3 text-[13px] font-bold text-ink">
                  {step.num}. {step.label}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
