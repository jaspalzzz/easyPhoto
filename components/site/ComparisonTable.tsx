/**
 * ComparisonTable — light-themed, matches the site's paper design system
 * Why Choose + VS Table on paper bg, Reviews on card bg
 */

const WHY_ITEMS = [
  { icon: "⚙️", title: "AI-Powered Precision",      body: "Advanced AI ensures perfect compliance every single time." },
  { icon: "🛡️", title: "100% Government Compliant", body: "Meets official requirements of 190+ countries." },
  { icon: "🔒", title: "Privacy First",              body: "Processed entirely in your browser — never uploaded." },
  { icon: "⚡", title: "Instant & Free",             body: "Get your passport photo in seconds at zero cost." },
];

const VS_ROWS = [
  { feat: "AI Background Removal", easy: "✓", studio: "✕" },
  { feat: "Instant Processing",     easy: "✓", studio: "✕" },
  { feat: "Home Upload",            easy: "✓", studio: "✕" },
  { feat: "Compliance Check",       easy: "✓", studio: "✕" },
  { feat: "Free Download",          easy: "✓", studio: "✕" },
  { feat: "Cost",                   easy: "FREE", studio: "₹200 – ₹500", easyIsGold: true },
  { feat: "Time",                   easy: "Seconds", studio: "30 – 60 min" },
];

const REVIEWS = [
  { text: "Super fast and accurate. Got my US visa photo in seconds!", author: "Rahul Sharma" },
  { text: "Perfect size and background. Worked for my passport without any issues.", author: "Priya Nair" },
  { text: "Finally a free tool that actually works 100%!", author: "Arjun Patel" },
  { text: "The AI adjustment is just perfect. Highly recommended!", author: "Neha Verma" },
];

export function ComparisonTable() {
  return (
    <>
      {/* Why Choose + VS Table */}
      <section className="border-t border-hairline bg-paper">
        <div className="container py-14 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">

            {/* Why Choose */}
            <div>
              <h2 className="mb-8 text-2xl font-semibold tracking-tight text-ink">
                Why choose <span className="text-brand">easyPhoto</span>?
              </h2>
              <div className="flex flex-col gap-6">
                {WHY_ITEMS.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-card text-xl shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="mb-1 text-[15px] font-semibold text-ink">{item.title}</h4>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS Table */}
            <div className="ep-card p-6">
              <h3 className="mb-5 text-[16px] font-semibold text-ink">
                <span className="text-brand">easyPhoto</span> vs Photo Studio
              </h3>
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th className="border-b border-hairline pb-3 text-left font-semibold text-muted-foreground">Feature</th>
                    <th className="border-b border-hairline pb-3 text-center font-semibold text-brand">easyPhoto</th>
                    <th className="border-b border-hairline pb-3 text-center font-semibold text-muted-foreground">Photo Studio</th>
                  </tr>
                </thead>
                <tbody>
                  {VS_ROWS.map((row) => (
                    <tr key={row.feat}>
                      <td className="border-b border-hairline py-3 font-medium text-ink">{row.feat}</td>
                      <td className={`border-b border-hairline py-3 text-center font-black ${"easyIsGold" in row && row.easyIsGold ? "text-brand" : "text-[#00c853]"}`}>
                        {row.easy}
                      </td>
                      <td className="border-b border-hairline py-3 text-center font-black text-[#e53935]">
                        {row.studio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-hairline bg-card">
        <div className="container py-14 sm:py-16">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Loved by thousands of users
            </h2>
            <span className="hidden text-[13px] font-semibold text-brand sm:block">
              ★★★★★ 4.9 / 5
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((r) => (
              <div key={r.author} className="ep-card flex flex-col justify-between p-5">
                <div>
                  <div className="mb-3 text-[14px] tracking-wide text-brand">★★★★★</div>
                  <p className="mb-4 text-[13px] italic leading-relaxed text-ink">
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-muted-foreground">— {r.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
