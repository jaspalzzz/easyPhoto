
const BEFORE_ISSUES = [
  "Wrong Size",
  "Busy Background",
  "Face Not Centered",
  "Poor Lighting",
];

const AI_CHECKS = [
  "Background Removed",
  "Correct Size",
  "Face Centered",
  "Government Compliant",
];

export function HeroVisual() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-0">

      {/* ── Card 1: Your Selfie (wrong) ────────────────────────────── */}
      <div className="animate-float-slow flex flex-col rounded-2xl border border-hairline bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.09)]">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[12px] font-bold text-red-600">
          <span>✕</span> Your Selfie
        </span>

        <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "3/4" }}>
          <img
            src="/images/selfie_input.png"
            alt="Example selfie — before AI processing"
            className="h-full w-full object-cover object-top"
          />
        </div>

        <ul className="mt-3.5 space-y-2">
          {BEFORE_ISSUES.map((issue) => (
            <li key={issue} className="flex items-center gap-2 text-[13px] font-medium text-red-600">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[9px] font-black">
                ✕
              </span>
              {issue}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Center: AI Engine ──────────────────────────────────────── */}
      <div className="relative z-10 mx-2 flex flex-col items-center">
        {/* Horizontal connector lines */}
        <div
          className="pointer-events-none absolute top-[29px] right-[58px] h-px w-10"
          style={{ background: "linear-gradient(90deg, transparent, #ffd000, transparent)" }}
        />
        <div
          className="pointer-events-none absolute top-[29px] left-[58px] h-px w-10"
          style={{ background: "linear-gradient(90deg, transparent, #ffd000, transparent)" }}
        />

        {/* AI circle with pulse-wave ring */}
        <div className="relative flex h-[58px] w-[58px] items-center justify-center">
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
              className="text-[20px] font-black leading-none text-[#78350f]"
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

      {/* ── Card 2: Compliant Photo (correct) ─────────────────────── */}
      <div className="animate-float-delay flex flex-col rounded-2xl border border-hairline bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.09)]">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600">
          <span>✓</span> Compliant Photo
        </span>

        <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "3/4" }}>
          <img
            src="/images/selfie_compliant.png"
            alt="Compliant passport photo — after AI processing"
            className="h-full w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-emerald-400 shadow-[inset_0_0_16px_rgba(16,185,129,0.12)]" />
          <div
            className="animate-scan-beam pointer-events-none absolute left-0 h-[2px] w-full"
            style={{ background: "#10b981", boxShadow: "0 0 10px #10b981", zIndex: 5 }}
          />
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]">
            ✓
          </div>
        </div>

        <ul className="mt-3.5 space-y-2">
          {AI_CHECKS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13px] font-medium text-emerald-600">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-black">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
