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

const STATS = [
  {
    value: "3,300+",
    label: "Passport photos made",
    sub: "Compliant & ready to submit",
  },
  {
    value: "5,000+",
    label: "Signatures crafted",
    sub: "Resized to exact KB & pixel limits",
  },
  {
    value: "190+",
    label: "Country specs covered",
    sub: "Passport, visa & ID standards",
  },
  {
    value: "0",
    label: "Files uploaded to a server",
    sub: "Everything runs in your browser",
  },
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

      {/* Usage stats */}
      <section className="border-t border-hairline bg-card">
        <div className="container py-14 sm:py-16">
          <p className="mb-10 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            By the numbers
          </p>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <span
                  className="mb-1 text-[2.6rem] font-black leading-none text-ink"
                  style={{ fontFamily: "var(--font-outfit, sans-serif)", letterSpacing: "-0.03em" }}
                >
                  {s.value}
                </span>
                <span className="mb-1 text-[14px] font-semibold text-ink">{s.label}</span>
                <span className="text-[12px] leading-snug text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
