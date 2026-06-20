/**
 * RealTransformations — before/after grid using real photo assets
 * 4 cards: 2 pairs (woman + man) × 2 variants (normal + styled)
 */

const PAIRS: { before: string; after: string; beforeStyle?: string; afterStyle?: string }[] = [
  {
    before: "/images/selfie_input.png",
    after: "/images/selfie_compliant.png",
  },
  {
    before: "/images/man_input.png",
    after: "/images/man_compliant.png",
  },
  {
    before: "/images/selfie_input.png",
    after: "/images/selfie_compliant.png",
    beforeStyle: "hue-rotate(90deg) brightness(0.9)",
    afterStyle: "hue-rotate(90deg)",
  },
  {
    before: "/images/man_input.png",
    after: "/images/man_compliant.png",
    beforeStyle: "saturate(0.5) contrast(1.1)",
    afterStyle: "saturate(0.9) contrast(1.05)",
  },
];

export function RealTransformations() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-[2rem]">
            Real Transformations
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            See exactly what easyPhoto does to real photos
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PAIRS.map((pair, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm"
            >
              <div className="flex h-52 sm:h-60">
                {/* Before pane */}
                <div className="relative flex-1 overflow-hidden">
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                    Before
                  </span>
                  <img
                    src={pair.before}
                    alt={`Before — transformation ${i + 1}`}
                    className="h-full w-full object-cover object-top"
                    style={pair.beforeStyle ? { filter: pair.beforeStyle } : undefined}
                  />
                </div>

                {/* Divider arrow */}
                <div className="flex w-6 shrink-0 items-center justify-center bg-[hsl(222_60%_8%)] text-[hsl(var(--cta))] text-[11px] font-bold">
                  →
                </div>

                {/* After pane */}
                <div className="relative flex-1 overflow-hidden">
                  <span className="absolute left-1 top-2 z-10 rounded-full bg-[hsl(var(--cta))] px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--cta-foreground))]">
                    After
                  </span>
                  <img
                    src={pair.after}
                    alt={`After — transformation ${i + 1}`}
                    className="h-full w-full object-cover object-top"
                    style={pair.afterStyle ? { filter: pair.afterStyle } : undefined}
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
