/**
 * AiShowcase — "AI Perfects Every Detail"
 * 3-panel: Your Selfie  |  AI Processing  |  Compliant Photo
 * + 4-step process strip below
 *
 * Photos: swap the illustrated SVGs for <img> tags once real assets are ready.
 * Mark each placeholder with data-photo-slot="before|after".
 */

const BEFORE_ISSUES = [
  "Busy Background",
  "Uneven Lighting",
  "Face Not Centered",
  "Wrong Size & Ratio",
];

const AI_CHECKS = [
  "Background Removed",
  "Face Centered",
  "Lighting Optimized",
  "Size & Ratio Adjusted",
  "Compliance Verified",
];

const PROCESS_STEPS = [
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7">
        <rect x="5" y="3" width="18" height="22" rx="3" stroke="hsl(var(--cta))" strokeWidth="1.8" />
        <circle cx="14" cy="11" r="4" stroke="hsl(var(--cta))" strokeWidth="1.6" />
        <path d="M8 22 q6-6 12 0" stroke="hsl(var(--cta))" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 26v-5M11 24l3-3 3 3" stroke="hsl(var(--cta))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Upload",
    body: "Upload your photo or selfie",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7">
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="hsl(var(--cta))" strokeWidth="1.8" />
        <rect x="9" y="9" width="10" height="10" rx="2" stroke="hsl(var(--cta))" strokeWidth="1.6" />
        <path d="M9 3v3M14 3v3M19 3v3M9 22v3M14 22v3M19 22v3M3 9h3M3 14h3M3 19h3M22 9h3M22 14h3M22 19h3" stroke="hsl(var(--cta))" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    label: "AI Process",
    body: "Our AI enhances and optimizes",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7">
        <path d="M14 3 l9 4v7c0 5-4 9-9 11C5 23 1 19 1 14V7l9-4z" stroke="hsl(var(--cta))" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 14l3 3 6-6" stroke="hsl(var(--cta))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Verify",
    body: "We check compliance with official norms",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7">
        <path d="M5 20h18M14 3v13M10 12l4 4 4-4" stroke="hsl(var(--cta))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Download",
    body: "Get your perfect photo in seconds",
  },
];

/* Illustrated "before" selfie — warm indoor background, tilted framing */
function SelfieIllustration() {
  return (
    <svg
      viewBox="0 0 160 200"
      fill="none"
      className="h-full w-full"
      data-photo-slot="before"
      aria-hidden="true"
    >
      {/* Warm room background */}
      <rect width="160" height="200" fill="#e8d4b0" />
      <rect width="160" height="145" fill="#dcc89a" />
      {/* Wall art / window */}
      <rect x="6" y="15" width="38" height="54" rx="2" fill="#b8cce0" opacity="0.65" />
      <line x1="25" y1="15" x2="25" y2="69" stroke="#98bcd8" strokeWidth="1.2" />
      <line x1="6" y1="42" x2="44" y2="42" stroke="#98bcd8" strokeWidth="1.2" />
      {/* Shelf/picture behind */}
      <rect x="100" y="18" width="48" height="60" rx="2" fill="none" stroke="#c09050" strokeWidth="1.8" />
      <rect x="104" y="22" width="40" height="52" fill="#d4b080" opacity="0.45" />
      {/* Body — casual dark top */}
      <path d="M0 200 L0 168 Q40 148 80 148 Q120 148 160 168 L160 200Z" fill="#2a2a2a" />
      {/* Neck */}
      <rect x="65" y="122" width="30" height="30" rx="10" fill="#c87848" />
      {/* Head — slightly off-centre (tilted suggestion via transform) */}
      <g transform="rotate(-4 80 100)">
        <ellipse cx="80" cy="100" rx="34" ry="38" fill="#c87848" />
        {/* Hair — long dark waves */}
        <ellipse cx="80" cy="72" rx="36" ry="24" fill="#140800" />
        <path d="M46 86 Q40 118 44 160" stroke="#140800" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M114 86 Q120 118 116 160" stroke="#140800" strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <ellipse cx="67" cy="102" rx="5" ry="6" fill="#200c04" />
        <ellipse cx="93" cy="102" rx="5" ry="6" fill="#200c04" />
        {/* Mouth — slight smile (before photo, casual) */}
        <path d="M71 118 Q80 124 89 118" stroke="#a05030" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/* Illustrated "after" compliant passport photo — white bg, centred, formal */
function CompliantIllustration() {
  return (
    <svg
      viewBox="0 0 160 200"
      fill="none"
      className="h-full w-full"
      data-photo-slot="after"
      aria-hidden="true"
    >
      {/* Clean white background */}
      <rect width="160" height="200" fill="#f8f8f8" />
      {/* Body — formal navy jacket */}
      <path d="M0 200 L0 162 Q40 142 80 142 Q120 142 160 162 L160 200Z" fill="#163A6B" />
      {/* Shirt collar detail */}
      <path d="M74 148 L80 156 L86 148" fill="#e8e8f2" />
      {/* Neck */}
      <rect x="65" y="118" width="30" height="28" rx="10" fill="#c87848" />
      {/* Head — centred, upright */}
      <ellipse cx="80" cy="96" rx="34" ry="38" fill="#c87848" />
      {/* Hair — neat */}
      <ellipse cx="80" cy="68" rx="35" ry="24" fill="#140800" />
      <path d="M46 84 Q44 116 48 150" stroke="#140800" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M114 84 Q116 116 112 150" stroke="#140800" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="67" cy="98" rx="5" ry="6" fill="#200c04" />
      <ellipse cx="93" cy="98" rx="5" ry="6" fill="#200c04" />
      {/* Neutral expression (required for govt photos) */}
      <line x1="72" y1="114" x2="88" y2="114" stroke="#a05030" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function AiShowcase() {
  return (
    <section className="border-t border-hairline bg-[hsl(222_20%_96%)]">
      <div className="container py-16 sm:py-20">

        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-[2.4rem]">
            <span className="text-[#A87E10]">AI</span> Perfects Every Detail
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            From any selfie to government-compliant photo in seconds
          </p>
        </div>

        {/* 3-panel comparison */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-4">

          {/* Panel 1 — Before / Your Selfie */}
          <div className="rounded-2xl border-2 border-red-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                ✕
              </span>
              <span className="font-semibold text-red-600">Your Selfie</span>
            </div>

            <div className="mx-auto mb-5 h-52 w-36 overflow-hidden rounded-xl shadow-sm">
              <SelfieIllustration />
            </div>

            <ul className="space-y-2.5">
              {BEFORE_ISSUES.map((issue) => (
                <li key={issue} className="flex items-center gap-2 text-[13px] text-red-600">
                  <span className="shrink-0 font-bold">✕</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Panel 2 — AI Processing */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-hairline bg-white p-6 shadow-sm">
            {/* Navy + gold AI badge */}
            <div className="mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[hsl(222_60%_8%)] shadow-md ring-4 ring-[hsl(var(--cta))]/15">
              <span className="text-[1.5rem] font-black tracking-tighter text-[hsl(var(--cta))]">AI</span>
            </div>
            {/* Sparkle dots */}
            <div className="mb-5 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--cta))]"
                  style={{ opacity: 0.4 + i * 0.2 }}
                />
              ))}
            </div>

            <h3 className="mb-5 text-[15px] font-bold text-ink">AI Processing</h3>

            <ul className="w-full space-y-3.5">
              {AI_CHECKS.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-3 text-[13px] text-ink"
                >
                  <span>{item}</span>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                    ✓
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel 3 — Compliant Photo */}
          <div className="rounded-2xl border-2 border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-[11px] font-bold text-white">
                ✓
              </span>
              <span className="font-semibold text-green-600">Compliant Photo</span>
            </div>

            {/* Photo with gold dimension markers */}
            <div className="relative mx-auto mb-5 w-36">
              <div className="h-52 w-36 overflow-hidden rounded-sm border border-hairline shadow-sm">
                <CompliantIllustration />
              </div>
              {/* Right side: height marker */}
              <div className="absolute -right-6 inset-y-0 flex flex-col items-center">
                <div className="flex-1 border-r-2 border-dashed border-[#C9921A]" />
                <span
                  className="text-[9px] font-semibold text-[#C9921A]"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", padding: "2px 0" }}
                >
                  45 mm
                </span>
                <div className="flex-1 border-r-2 border-dashed border-[#C9921A]" />
              </div>
              {/* Bottom: width marker */}
              <div className="mt-1.5 flex items-center gap-1">
                <div className="flex-1 border-t-2 border-dashed border-[#C9921A]" />
                <span className="shrink-0 text-[9px] font-semibold text-[#C9921A]">35 mm</span>
                <div className="flex-1 border-t-2 border-dashed border-[#C9921A]" />
              </div>
            </div>

            {/* Compliance badge */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-3">
              <div className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM9 9a1 1 0 012 0v3a1 1 0 01-2 0V9zm1 7a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-[12px] font-bold text-green-700">
                    100% Government Compliant
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-green-600">
                    Ready for Passport, Visa, OCI, ID &amp; more
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-step process strip */}
        <div className="relative mt-14">
          {/* Dashed golden connector (desktop) */}
          <svg
            className="pointer-events-none absolute left-[12%] top-5 hidden h-5 w-[76%] md:block"
            viewBox="0 0 800 20"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="10"
              x2="800"
              y2="10"
              stroke="hsl(var(--cta))"
              strokeWidth="1.8"
              strokeDasharray="8 6"
            />
          </svg>

          <ol className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.label} className="flex flex-col items-center text-center">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(222_60%_8%)] shadow-sm">
                  {step.icon}
                </div>
                <h3 className="mt-3 text-[14px] font-semibold text-ink">
                  {i + 1}. {step.label}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
