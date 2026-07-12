
const BEFORE_ISSUES = [
  "Wrong Size",
  "Busy BG",
  "Off-Center",
  "Poor Lighting",
];

const AI_CHECKS = [
  "BG Removed",
  "Exact Size",
  "Face Aligned",
  "Spec-checked",
];

export function HeroVisual() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-0">

      {/* ── Card 1: Your Selfie (wrong) ────────────────────────────── */}
      <div className="animate-float-slow flex flex-col rounded-2xl border border-hairline bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.09)] dark:bg-card dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] min-[360px]:p-3 sm:p-4">
        <span className="mb-3 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-bold sm:gap-1.5 sm:px-3 sm:py-1 sm:text-[12px] text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
          <span>✕</span> Issues found
        </span>

        <div className="relative overflow-hidden rounded-xl bg-white" style={{ aspectRatio: "3/4" }}>
          <img
            src="/images/sample4_before_384.webp"
            alt="Example selfie — before AI processing"
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
          />
        </div>

        <ul className="mt-2.5 space-y-1.5 sm:mt-3.5 sm:space-y-2">
          {BEFORE_ISSUES.map((issue) => (
            <li key={issue} className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-red-600 min-[360px]:text-[11px] sm:gap-2 sm:text-[13px] dark:text-red-400">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[8px] font-black sm:h-4 sm:w-4 sm:text-[9px] dark:bg-red-900/40">
                ✕
              </span>
              <span className="truncate">{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Center: AI Engine ──────────────────────────────────────── */}
      <div className="relative z-10 mx-1 flex flex-col items-center min-[360px]:mx-2">
        {/* Horizontal connector lines */}
        <div
          className="pointer-events-none absolute top-[25px] right-[58px] h-px w-10"
          style={{ background: "linear-gradient(90deg, transparent, #ffd000, transparent)" }}
        />
        <div
          className="pointer-events-none absolute top-[25px] left-[58px] h-px w-10"
          style={{ background: "linear-gradient(90deg, transparent, #ffd000, transparent)" }}
        />

        {/* AI circle with pulse-wave ring */}
        <div className="relative flex h-[50px] w-[50px] items-center justify-center">
          {/* Expanding ring */}
          <span
            className="animate-pulse-wave absolute inset-[-6px] rounded-full border border-[#ffd000]"
            style={{ animationDuration: "2s" }}
          />
          {/* Gold coin */}
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-[#d97706]"
            style={{
              background: "linear-gradient(135deg, #ffe566 0%, #ffd000 45%, #f59e0b 100%)",
              boxShadow: "0 4px 16px rgba(255,208,0,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="text-[18px] font-black leading-none text-[#78350f]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)", letterSpacing: "-0.04em" }}
            >
              AI
            </span>
          </div>
        </div>

        <p className="mt-2.5 max-w-[80px] text-center text-[9px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
          AI Compliance Engine
        </p>
      </div>

      {/* ── Card 2: Spec-checked Photo (correct) ──────────────────── */}
      <div className="animate-float-delay flex flex-col rounded-2xl border border-hairline bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.09)] dark:bg-card dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] min-[360px]:p-3 sm:p-4">
        <span className="mb-3 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold sm:gap-1.5 sm:px-3 sm:py-1 sm:text-[12px] text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span>✓</span> Spec-checked
        </span>

        <div className="relative overflow-hidden rounded-xl bg-white" style={{ aspectRatio: "3/4" }}>
          <img
            src="/images/sample4_after_384.webp"
            alt="Passport photo prepared to spec — after AI processing"
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-emerald-400 shadow-[inset_0_0_16px_rgba(16,185,129,0.12)]" />
          <div
            className="animate-scan-beam pointer-events-none absolute left-0 top-0 h-[2px] w-full"
            style={{ background: "#10b981", boxShadow: "0 0 10px #10b981", zIndex: 5 }}
          />
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]">
            ✓
          </div>
        </div>

        <ul className="mt-2.5 space-y-1.5 sm:mt-3.5 sm:space-y-2">
          {AI_CHECKS.map((item) => (
            <li key={item} className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-emerald-600 min-[360px]:text-[11px] sm:gap-2 sm:text-[13px] dark:text-emerald-400">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[8px] font-black sm:h-4 sm:w-4 sm:text-[9px] dark:bg-emerald-900/40">
                ✓
              </span>
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
