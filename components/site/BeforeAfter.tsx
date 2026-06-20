/**
 * Before → After transformation (Image 2 reference style).
 * Two large portrait panels with gold dimension markers, navy AI badge centre,
 * and a dark bottom strip comparing before problems vs after solutions.
 *
 * Photos: replace each illustrated <svg data-photo-slot="..."> with an <img> tag
 * once real assets are available — the surrounding layout doesn't change.
 */

const BEFORE_PROBLEMS = [
  "Wrong Size & Ratio",
  "Busy Background",
  "Incorrect Lighting",
  "Uncentered Face",
];

const AFTER_SOLUTIONS = [
  "Perfect Size & Ratio",
  "Clean White Background",
  "Balanced Lighting",
  "Face Perfectly Centered",
];

/* Illustrated "before" selfie — warm room background, slightly off-centre */
function BeforePhoto() {
  return (
    <svg
      viewBox="0 0 220 290"
      fill="none"
      className="h-full w-full"
      data-photo-slot="before"
      aria-hidden="true"
    >
      <rect width="220" height="290" fill="#dfc9a0" />
      <rect width="220" height="200" fill="#d4b888" />
      <rect x="8" y="18" width="52" height="70" rx="3" fill="#b4cce4" opacity="0.6" />
      <line x1="34" y1="18" x2="34" y2="88" stroke="#94bcd6" strokeWidth="1.5" />
      <line x1="8" y1="53" x2="60" y2="53" stroke="#94bcd6" strokeWidth="1.5" />
      <rect x="144" y="22" width="62" height="78" rx="2" fill="none" stroke="#c09050" strokeWidth="2.2" />
      <rect x="149" y="27" width="52" height="68" fill="#ccaa74" opacity="0.38" />
      <path d="M0 290 L0 236 Q55 208 110 208 Q165 208 220 236 L220 290Z" fill="#282828" />
      <rect x="89" y="172" width="42" height="42" rx="14" fill="#c27040" />
      <g transform="rotate(-5 110 148)">
        <ellipse cx="110" cy="148" rx="46" ry="52" fill="#c27040" />
        <ellipse cx="110" cy="108" rx="49" ry="32" fill="#120600" />
        <path d="M64 126 Q56 168 62 226" stroke="#120600" strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M156 126 Q164 168 158 226" stroke="#120600" strokeWidth="15" strokeLinecap="round" fill="none" />
        <ellipse cx="92" cy="151" rx="7" ry="8" fill="#1e0e04" />
        <ellipse cx="128" cy="151" rx="7" ry="8" fill="#1e0e04" />
        <path d="M97 170 Q110 178 123 170" stroke="#9e4e22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/* Illustrated "after" — white background, centred, formal navy jacket */
function AfterPhoto() {
  return (
    <svg
      viewBox="0 0 220 290"
      fill="none"
      className="h-full w-full"
      data-photo-slot="after"
      aria-hidden="true"
    >
      <rect width="220" height="290" fill="#f5f5f5" />
      <path d="M0 290 L0 224 Q55 198 110 198 Q165 198 220 224 L220 290Z" fill="#163A6B" />
      <path d="M102 210 L110 220 L118 210" fill="#e2e4f0" />
      <rect x="89" y="168" width="42" height="38" rx="14" fill="#c27040" />
      <ellipse cx="110" cy="138" rx="46" ry="52" fill="#c27040" />
      <ellipse cx="110" cy="98" rx="48" ry="32" fill="#120600" />
      <path d="M64 118 Q60 158 64 208" stroke="#120600" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M156 118 Q160 158 156 208" stroke="#120600" strokeWidth="14" strokeLinecap="round" fill="none" />
      <ellipse cx="92" cy="141" rx="7" ry="8" fill="#1e0e04" />
      <ellipse cx="128" cy="141" rx="7" ry="8" fill="#1e0e04" />
      <line x1="98" y1="160" x2="122" y2="160" stroke="#9e4e22" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function BeforeAfter() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-20">

        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="eyebrow text-[#A87E10]">Transformation</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-[2rem]">
            See the difference in seconds
          </h2>
        </div>

        {/* 3-column: before | AI badge | after */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-0">

          {/* BEFORE */}
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-red-100 bg-white shadow-sm sm:flex-1 sm:rounded-r-none">
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(222_60%_8%)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                ✕ Before
              </span>
            </div>
            <div className="absolute right-3 top-3 z-10">
              <span className="rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white">
                1050 × 1450 px
              </span>
            </div>
            <div className="h-72 w-full sm:h-80">
              <BeforePhoto />
            </div>
          </div>

          {/* AI badge — sits between panels */}
          <div className="flex shrink-0 items-center justify-center sm:relative sm:z-10 sm:-mx-5 sm:py-6">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[hsl(222_60%_8%)] shadow-xl ring-4 ring-white sm:h-[68px] sm:w-[68px]">
              <span className="text-[1.2rem] font-black leading-none tracking-tighter text-[hsl(var(--cta))]">AI</span>
              <span className="mt-0.5 text-[7px] font-semibold uppercase tracking-widest text-[hsl(var(--cta))]/70">
                auto
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-green-100 bg-white shadow-sm sm:flex-1 sm:rounded-l-none">
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--cta))] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[hsl(var(--cta-foreground))]">
                ✓ After
              </span>
            </div>
            <div className="absolute right-3 top-3 z-10">
              <span className="rounded bg-green-600/80 px-2 py-0.5 font-mono text-[10px] text-white">
                35 × 45 mm
              </span>
            </div>
            <div className="h-72 w-full sm:h-80">
              <AfterPhoto />
            </div>
            {/* Gold dimension markers */}
            <div className="flex items-center gap-1 px-1 pt-1">
              <div className="flex-1 border-t-2 border-dashed border-[#C9921A]" />
              <span className="shrink-0 text-[9px] font-semibold text-[#C9921A]">35 mm</span>
              <div className="flex-1 border-t-2 border-dashed border-[#C9921A]" />
            </div>
          </div>
        </div>

        {/* Bottom comparison strip */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-hairline bg-[hsl(222_60%_8%)]">
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/40">
                Without easyPhoto
              </p>
              <ul className="space-y-2.5">
                {BEFORE_PROBLEMS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[13px] text-red-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">
                      ✕
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/40">
                With easyPhoto
              </p>
              <ul className="space-y-2.5">
                {AFTER_SOLUTIONS.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-[13px] text-green-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-[10px] font-bold text-green-400">
                      ✓
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
