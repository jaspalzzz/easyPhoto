/**
 * RealTransformations — light-themed, matches the site's paper design system
 * 2×2 grid of before/after cards using real photo assets
 */

const PAIRS = [
  { before: "/images/selfie_input.png", after: "/images/selfie_compliant.png" },
  { before: "/images/man_input.png",    after: "/images/man_compliant.png" },
  {
    before: "/images/selfie_input.png",
    after: "/images/selfie_compliant.png",
    beforeFilter: "hue-rotate(90deg) brightness(0.9)",
    afterFilter: "hue-rotate(90deg)",
  },
  {
    before: "/images/man_input.png",
    after: "/images/man_compliant.png",
    beforeFilter: "saturate(0.5) contrast(1.1)",
    afterFilter: "saturate(0.9)",
  },
] as const;

export function RealTransformations() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-16">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-ink">
          Real Transformations
        </h2>
        <p className="mb-10 text-center text-[14px] text-muted-foreground">
          See what the AI does to your photo in seconds.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PAIRS.map((pair, i) => (
            <div key={i} className="ep-card overflow-hidden p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 overflow-hidden rounded-lg" style={{ aspectRatio: "1" }}>
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-[rgba(255,23,68,0.9)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Before
                  </span>
                  <img
                    src={pair.before}
                    alt="Before transformation"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    style={"beforeFilter" in pair ? { filter: pair.beforeFilter } : undefined}
                  />
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-sm text-ink shadow-sm">
                  →
                </div>

                <div className="relative flex-1 overflow-hidden rounded-lg" style={{ aspectRatio: "1" }}>
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-[rgba(0,200,83,0.9)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
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
