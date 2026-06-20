/**
 * ComplianceEngine — "AI Compliance Check" dark section
 * Matches reference prototype exactly:
 * Left: photo with green scan frame + check badge
 * Center: glass panel with 10-item checklist
 * Right: glass panel with 64px "100%" score + green progress bar
 */

const CHECKS = [
  "Face Position", "Brightness",
  "Eye Height",    "Contrast",
  "Background Color", "Shadow Detection",
  "Head Size",     "Expression",
  "Resolution",    "Pose & Alignment",
];

export function ComplianceEngine() {
  return (
    <section
      className="border-t border-[rgba(255,255,255,0.06)]"
      style={{
        background: "linear-gradient(180deg, #040c24 0%, #0a173c 100%)",
        padding: "80px 0",
      }}
    >
      <div className="container">
        {/* Heading */}
        <h2
          className="mb-12 text-center text-[40px] font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-outfit, sans-serif)", letterSpacing: "-0.02em" }}
        >
          AI Compliance Check
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.8fr_1.2fr_1fr] md:gap-10">

          {/* Left — photo with green scan frame */}
          <div className="flex items-center justify-center">
            <div className="ep-glass w-full max-w-[260px] rounded-2xl p-4">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <img
                  src="/images/selfie_compliant.png"
                  alt="AI compliance scan"
                  className="h-full w-full object-cover object-top"
                />
                {/* Green border frame */}
                <div className="pointer-events-none absolute inset-0 rounded-xl border-[1.5px] border-[#00c853] shadow-[inset_0_0_20px_rgba(0,200,83,0.2)]" />
                {/* Scan beam */}
                <div
                  className="animate-scan-beam pointer-events-none absolute left-0 h-[2px] w-full"
                  style={{ background: "#00c853", boxShadow: "0 0 10px #00c853", zIndex: 5 }}
                />
                {/* Check badge */}
                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#00c853] text-[12px] font-bold text-white shadow-[0_4px_10px_rgba(0,200,83,0.4)]">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* Center — checklist glass panel */}
          <div
            className="rounded-2xl border border-[rgba(255,255,255,0.08)] p-8"
            style={{ background: "rgba(10,23,60,0.4)" }}
          >
            <h3
              className="mb-6 text-[22px] font-bold text-white"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              AI Compliance Check
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {CHECKS.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-[14px] text-white">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(0,200,83,0.2)] text-[10px] font-black text-[#00c853]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — score glass panel */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] p-8 text-center"
            style={{ background: "rgba(10,23,60,0.4)" }}
          >
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#94a3b8]">
              Compliance Score
            </p>
            <div
              className="mb-4 text-[64px] font-black leading-none text-[#00c853]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              100%
            </div>
            {/* Progress bar */}
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[#102154]">
              <div
                className="h-full rounded-full bg-[#00c853]"
                style={{ width: "100%", boxShadow: "0 0 12px #00c853" }}
              />
            </div>
            <p className="mb-6 text-[14px] leading-relaxed text-[#94a3b8]">
              Your photo meets all official requirements.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,200,83,0.3)] bg-[rgba(0,200,83,0.1)] px-5 py-2.5 text-[13px] font-bold text-[#00c853]">
              <span className="text-base">🛡️</span>
              Government Compliant
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
