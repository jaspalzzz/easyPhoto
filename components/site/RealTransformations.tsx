/**
 * RealTransformations — dark section matching reference prototype exactly
 * 4-card 2×2 grid: before/after splits with real photo assets
 * Dark navy background, glass cards, red "Before" / green "After" badges
 */

const PAIRS = [
  { before: "/images/selfie_input.png", after: "/images/selfie_compliant.png" },
  { before: "/images/man_input.png",    after: "/images/man_compliant.png" },
  {
    before: "/images/selfie_input.png",
    after:  "/images/selfie_compliant.png",
    beforeFilter: "hue-rotate(90deg) brightness(0.9)",
    afterFilter:  "hue-rotate(90deg)",
  },
  {
    before: "/images/man_input.png",
    after:  "/images/man_compliant.png",
    beforeFilter: "saturate(0.5) contrast(1.1)",
    afterFilter:  "saturate(0.9) contrast(1.05)",
  },
] as const;

export function RealTransformations() {
  return (
    <section
      className="border-t border-b border-[rgba(255,255,255,0.06)]"
      style={{ background: "#0a173c", padding: "80px 0" }}
    >
      <div className="container">
        <h2
          className="mb-12 text-center text-[40px] font-bold text-white"
          style={{ fontFamily: "var(--font-outfit, sans-serif)", letterSpacing: "-0.02em" }}
        >
          Real Transformations
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {PAIRS.map((pair, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] p-4"
              style={{ background: "#040c24" }}
            >
              <div className="flex items-center gap-4">
                {/* Before pane */}
                <div className="relative flex-1 overflow-hidden rounded-xl" style={{ aspectRatio: "1" }}>
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[rgba(255,23,68,0.85)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-white">
                    Before
                  </span>
                  <img
                    src={pair.before}
                    alt="Before transformation"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    style={"beforeFilter" in pair ? { filter: pair.beforeFilter } : undefined}
                  />
                </div>

                {/* Arrow circle */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#102154] text-base text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                  →
                </div>

                {/* After pane */}
                <div className="relative flex-1 overflow-hidden rounded-xl" style={{ aspectRatio: "1" }}>
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[rgba(0,200,83,0.85)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-white">
                    After
                  </span>
                  <img
                    src={pair.after}
                    alt="After transformation"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    style={"afterFilter" in pair ? { filter: pair.afterFilter } : undefined}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
