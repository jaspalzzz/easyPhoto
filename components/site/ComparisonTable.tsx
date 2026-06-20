/**
 * ComparisonTable — "Why Choose easyPhoto?" + "easyPhoto vs Photo Studio" table
 * + user reviews below
 */

const WHY_ITEMS = [
  {
    icon: "⚙️",
    title: "AI-Powered Precision",
    body: "Advanced AI ensures perfect compliance every single time.",
  },
  {
    icon: "🛡️",
    title: "100% Government Compliant",
    body: "Meets official requirements of 190+ countries with guarantee.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    body: "Your photos are fully secure, processed locally, and never shared.",
  },
  {
    icon: "⚡",
    title: "Instant & Free",
    body: "Get your passport photo in seconds. Free to test and download.",
  },
];

const VS_ROWS: { feat: string; easy: string; studio: string }[] = [
  { feat: "AI Background Removal", easy: "✓", studio: "✕" },
  { feat: "Instant Processing", easy: "✓", studio: "✕" },
  { feat: "Home Upload", easy: "✓", studio: "✕" },
  { feat: "Compliance Check", easy: "✓", studio: "✕" },
  { feat: "Free Download", easy: "✓", studio: "✕" },
  { feat: "Cost", easy: "FREE", studio: "₹200 – ₹500" },
  { feat: "Time", easy: "Seconds", studio: "30 – 60 min" },
];

const REVIEWS = [
  {
    stars: 5,
    text: "Super fast and accurate. Got my US visa photo in seconds!",
    author: "Rahul Sharma",
  },
  {
    stars: 5,
    text: "Perfect size and background. Worked for my passport without any issues.",
    author: "Priya Nair",
  },
  {
    stars: 5,
    text: "Finally a free tool that actually works 100%!",
    author: "Arjun Patel",
  },
  {
    stars: 5,
    text: "The AI adjustment is just perfect. Highly recommended!",
    author: "Neha Verma",
  },
];

export function ComparisonTable() {
  return (
    <>
      {/* Why Choose + VS Table */}
      <section className="border-t border-hairline bg-paper">
        <div className="container py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">

            {/* Why Choose panel */}
            <div>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-ink sm:text-[2rem]">
                Why Choose{" "}
                <span className="text-[#A87E10]">easyPhoto</span>?
              </h2>
              <div className="space-y-5">
                {WHY_ITEMS.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-white text-xl shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-ink">{item.title}</h4>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS table */}
            <div>
              <h3 className="mb-6 text-xl font-bold tracking-tight text-ink sm:text-[1.5rem]">
                <span className="text-[#A87E10]">easyPhoto</span> vs Photo Studio
              </h3>
              <div className="overflow-hidden rounded-xl border border-hairline shadow-sm">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-hairline bg-[hsl(222_60%_8%)] text-white">
                      <th className="px-4 py-3 text-left font-semibold">Features</th>
                      <th className="px-4 py-3 text-center font-semibold text-[hsl(var(--cta))]">
                        easyPhoto
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-white/60">
                        Photo Studio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline bg-white">
                    {VS_ROWS.map((row) => (
                      <tr key={row.feat} className="transition-colors hover:bg-[hsl(38_26%_97%)]">
                        <td className="px-4 py-3 font-medium text-ink">{row.feat}</td>
                        <td className="px-4 py-3 text-center font-semibold text-green-600">
                          {row.easy}
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">
                          {row.studio}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-hairline bg-white">
        <div className="container py-14 sm:py-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Loved by Thousands of Users
            </h2>
            <div className="hidden items-center gap-1 text-[13px] text-[#A87E10] sm:flex">
              <span>★★★★★</span>
              <span className="font-semibold">4.9/5</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((r) => (
              <div
                key={r.author}
                className="rounded-xl border border-hairline bg-[hsl(38_26%_98%)] p-5 shadow-sm"
              >
                <div className="mb-3 text-[#A87E10]">{"★".repeat(r.stars)}</div>
                <p className="mb-4 text-[13px] leading-relaxed text-ink">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(222_60%_8%)] text-[11px] font-bold text-[hsl(var(--cta))]">
                    {r.author[0]}
                  </div>
                  <span className="text-[12px] font-semibold text-ink">{r.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
