/**
 * ComparisonTable — "Why Choose easyPhoto?" + VS table + Reviews
 * All dark navy, exactly matching reference prototype
 */

const WHY_ITEMS = [
  { icon: "⚙️", title: "AI-Powered Precision",    body: "Advanced AI ensures perfect compliance every single time." },
  { icon: "🛡️", title: "100% Government Compliant", body: "Meets official requirements of 190+ countries with guarantee." },
  { icon: "🔒", title: "Privacy First",             body: "Your photos are fully secure, processed locally, and never shared." },
  { icon: "⚡", title: "Instant & Free",            body: "Get your passport photo in seconds. Free to test and download." },
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
  { stars: 5, text: "Super fast and accurate. Got my US visa photo in seconds!", author: "Rahul Sharma" },
  { stars: 5, text: "Perfect size and background. Worked for my passport without any issues.", author: "Priya Nair" },
  { stars: 5, text: "Finally a free tool that actually works 100%!", author: "Arjun Patel" },
  { stars: 5, text: "The AI adjustment is just perfect. Highly recommended!", author: "Neha Verma" },
];

export function ComparisonTable() {
  return (
    <>
      {/* Why Choose + VS Table */}
      <section style={{ background: "#040c24", padding: "100px 0" }}>
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">

            {/* Why Choose */}
            <div>
              <h2
                className="mb-10 text-[40px] font-bold leading-tight text-white"
                style={{ fontFamily: "var(--font-outfit, sans-serif)", letterSpacing: "-0.02em" }}
              >
                Why Choose{" "}
                <span className="text-[#ffd000]">easyPhoto</span>?
              </h2>
              <div className="flex flex-col gap-7">
                {WHY_ITEMS.map((item) => (
                  <div key={item.title} className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h4
                        className="mb-1.5 text-[18px] font-bold text-white"
                        style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[14px] leading-relaxed text-[#94a3b8]">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS Table */}
            <div
              className="rounded-2xl border border-[rgba(255,255,255,0.08)] p-8"
              style={{ background: "rgba(10,23,60,0.4)" }}
            >
              <h3
                className="mb-6 text-[22px] font-bold text-white"
                style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
              >
                <span className="text-[#ffd000]">easyPhoto</span> vs Photo Studio
              </h3>
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr>
                    <th className="border-b border-[rgba(255,255,255,0.08)] pb-3 text-left font-bold text-[#94a3b8]">
                      Features
                    </th>
                    <th className="border-b border-[rgba(255,255,255,0.08)] pb-3 text-center font-bold text-[#ffd000]">
                      <span className="flex items-center justify-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <rect width="24" height="24" rx="6" fill="#ffd000" />
                          <path d="M12 7V17M7 12H17" stroke="#040b21" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        easyPhoto
                      </span>
                    </th>
                    <th className="border-b border-[rgba(255,255,255,0.08)] pb-3 text-center font-bold text-[#94a3b8]">
                      Photo Studio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VS_ROWS.map((row) => (
                    <tr key={row.feat}>
                      <td className="border-b border-[rgba(255,255,255,0.06)] py-3.5 font-medium text-white">
                        {row.feat}
                      </td>
                      <td className={`border-b border-[rgba(255,255,255,0.06)] py-3.5 text-center font-black ${"easyIsGold" in row && row.easyIsGold ? "text-[#ffd000]" : "text-[#00c853]"}`}>
                        {row.easy}
                      </td>
                      <td className="border-b border-[rgba(255,255,255,0.06)] py-3.5 text-center font-black text-[#ff1744]">
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
      <section
        className="border-t border-b border-[rgba(255,255,255,0.06)]"
        style={{ background: "#0a173c", padding: "100px 0" }}
      >
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <h2
              className="text-[40px] font-bold text-white"
              style={{ fontFamily: "var(--font-outfit, sans-serif)", letterSpacing: "-0.02em" }}
            >
              Loved by Thousands of Users
            </h2>
            <div className="hidden items-center gap-1.5 text-[14px] font-semibold text-[#ffd000] sm:flex">
              <span className="tracking-wide">★★★★★</span> 4.9 / 5
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((r) => (
              <div
                key={r.author}
                className="flex flex-col justify-between rounded-2xl border border-[rgba(255,255,255,0.08)] p-6"
                style={{ background: "#040c24" }}
              >
                <div>
                  <div className="mb-3.5 text-[16px] tracking-wide text-[#ffd000]">★★★★★</div>
                  <p className="mb-5 text-[14px] italic leading-relaxed text-white">
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
                <span className="text-[13px] font-semibold text-[#94a3b8]">– {r.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
