/**
 * HeroVisual — dark 3-panel "before | AI | after" visual
 * Matches the reference HTML prototype exactly:
 *   • Glass-morphism cards on deep navy (#040c24)
 *   • Red-tagged "Your Selfie" card (selfie_input.png)
 *   • Animated AI circle: gold glow + pulse-wave ring
 *   • Green-tagged "Compliant Photo" card (selfie_compliant.png)
 *     with animated scanning beam
 */

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
      <div className="animate-float-slow ep-glass flex flex-col rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        {/* Tag */}
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[rgba(255,23,68,0.25)] bg-[rgba(255,23,68,0.12)] px-3 py-1 text-[12px] font-bold text-[#ff1744]">
          <span>✕</span> Your Selfie
        </span>

        {/* Photo */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src="/images/selfie_input.png"
            alt="Example selfie — before AI processing"
            className="h-full w-full object-cover object-top"
          />
          {/* Red scan overlay flicker (subtle) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,23,68,0.04)] to-transparent" />
        </div>

        {/* Checklist */}
        <ul className="mt-3.5 space-y-2">
          {BEFORE_ISSUES.map((issue) => (
            <li key={issue} className="flex items-center gap-2 text-[13px] font-medium text-[#ff1744]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(255,23,68,0.15)] text-[9px] font-black">
                ✕
              </span>
              {issue}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Center: AI Engine ──────────────────────────────────────── */}
      <div className="relative z-10 mx-3 flex flex-col items-center">
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
          {/* Gold circle */}
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-[#ffd000]"
            style={{
              background: "radial-gradient(circle, #ffd000 0%, #040c24 100%)",
              boxShadow: "0 0 20px rgba(255,208,0,0.4)",
            }}
          >
            <span
              className="text-[20px] font-black leading-none text-[#040c24]"
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
      <div className="animate-float-delay ep-glass flex flex-col rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        {/* Tag */}
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[rgba(0,200,83,0.25)] bg-[rgba(0,200,83,0.12)] px-3 py-1 text-[12px] font-bold text-[#00c853]">
          <span>✓</span> Compliant Photo
        </span>

        {/* Photo with scanning beam */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src="/images/selfie_compliant.png"
            alt="Compliant passport photo — after AI processing"
            className="h-full w-full object-cover object-top"
          />
          {/* Green scan frame border */}
          <div className="pointer-events-none absolute inset-0 rounded-lg border border-[#00c853] shadow-[inset_0_0_20px_rgba(0,200,83,0.15)]" />
          {/* Animated scanning beam */}
          <div
            className="animate-scan-beam pointer-events-none absolute left-0 h-[2px] w-full"
            style={{ background: "#00c853", boxShadow: "0 0 10px #00c853", zIndex: 5 }}
          />
          {/* Green check badge */}
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#00c853] text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(0,200,83,0.4)]">
            ✓
          </div>
        </div>

        {/* Checklist */}
        <ul className="mt-3.5 space-y-2">
          {AI_CHECKS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13px] font-medium text-[#00c853]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(0,200,83,0.15)] text-[9px] font-black">
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
