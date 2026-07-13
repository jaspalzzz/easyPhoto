/**
 * ComplianceEngine — light-themed, matches the site's paper design system
 * Left: photo with green scan frame + animated beam
 * Center: 10-item checklist in ep-card
 * Right: check-results card in ep-card
 *
 * The checklist mirrors the REAL checks the engine runs (lib/photoCheck.ts +
 * lib/compliance.ts) — keep the two in sync; never list a check we don't run.
 * The full 10-check suite runs in /tools/compliance-checker/ and
 * /tools/photo-rejection-check/ — NOT automatically on every tool's output,
 * so the copy below must not claim "every photo" gets all 10 checks.
 */

const CHECKS = [
  "Face Detected",      "Head Size",
  "One Person Only",    "Eyes Level",
  "Head Centred",       "Whole Head Visible",
  "Plain Background",   "Even Lighting",
  "File Size & Format", "Dimensions",
];

export function ComplianceEngine() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-16">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-ink">
          AI Compliance Check
        </h2>
        <p className="mb-10 text-center text-[14px] text-muted-foreground">
          Run any photo through 10 checks from the published requirements with our free compliance checker.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.75fr_1.25fr_1fr] md:gap-8">

          {/* Left — photo with green scan frame */}
          <div className="flex items-center justify-center">
            <div className="ep-card w-full max-w-[220px] p-3">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src="/images/sample7_after_1782053075466.webp"
                  alt="AI compliance scan example"
                  className="h-full w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#00c853] shadow-[inset_0_0_16px_rgba(0,200,83,0.15)]" />
                <div
                  className="animate-scan-beam pointer-events-none absolute left-0 h-[2px] w-full"
                  style={{ background: "#00c853", boxShadow: "0 0 8px #00c853", zIndex: 5 }}
                />
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#00c853] text-xs font-bold text-white">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* Center — checklist */}
          <div className="ep-card p-6">
            <h3 className="mb-5 text-[15px] font-semibold text-ink">10 Compliance Checks</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {CHECKS.map((item) => (
                <div key={item} className="flex items-center gap-2 text-[13px] text-ink">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(0,200,83,0.12)] text-xs font-black text-[#00c853]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — check results */}
          <div className="ep-card flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Checks Passed
            </p>
            <div className="mb-3 text-[56px] font-black leading-none text-[#00c853]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              10/10
            </div>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-hairline">
              <div className="h-full rounded-full bg-[#00c853]" style={{ width: "100%" }} />
            </div>
            <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
              All measurable checks pass. Always verify against the current official notice.
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-4 py-2 text-[12px] font-semibold text-ink">
              🛡️ Checked against published requirements
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
