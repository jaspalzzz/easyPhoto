/**
 * ComparisonTable — Why Choose + VS Table + Stats
 * Design: dark navy/gold icon containers, colored circle marks in VS table
 */

import { Cpu, BadgeCheck, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface WhyItem {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const WHY_ITEMS: WhyItem[] = [
  {
    Icon: Cpu,
    title: "AI-Powered Precision",
    body: "Advanced face detection and background removal trained on government photo standards — not a generic filter.",
  },
  {
    Icon: BadgeCheck,
    title: "100% Government Compliant",
    body: "Sizes, ratios and background rules sourced directly from each country's official specification.",
  },
  {
    Icon: ShieldCheck,
    title: "Privacy First — Always",
    body: "Every pixel is processed inside your browser. No photo ever reaches our servers.",
  },
  {
    Icon: Zap,
    title: "Instant & Free",
    body: "From upload to compliant download in under five seconds. No account, no payment, no watermark.",
  },
];

const VS_ROWS = [
  { feat: "AI Background Removal", easy: true,      studio: false },
  { feat: "Instant Processing",     easy: true,      studio: false },
  { feat: "Upload from Home",       easy: true,      studio: false },
  { feat: "Compliance Check",       easy: true,      studio: false },
  { feat: "Free Download",          easy: true,      studio: false },
  { feat: "Cost",                   easy: "FREE",    studio: "₹200 – ₹500" },
  { feat: "Turnaround",             easy: "Seconds", studio: "30 – 60 min" },
];

const STATS = [
  { value: "3,300+", label: "Passport photos made",      sub: "Compliant & ready to submit" },
  { value: "5,000+", label: "Signatures crafted",        sub: "Resized to exact KB & pixel limits" },
  { value: "190+",   label: "Country specs covered",     sub: "Passport, visa & ID standards" },
  { value: "0",      label: "Files uploaded to a server", sub: "Everything runs in your browser" },
];

function Check() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white shadow-sm">
      ✓
    </span>
  );
}

function Cross() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[11px] font-black text-red-500">
      ✕
    </span>
  );
}

export function ComparisonTable() {
  return (
    <>
      {/* Why Choose + VS Table */}
      <section className="border-t border-hairline bg-paper">
        <div className="container py-14 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">

            {/* Why Choose */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Why easyPhoto
              </p>
              <h2 className="mb-10 text-2xl font-semibold tracking-tight text-ink">
                Built for accuracy,<br />not just convenience
              </h2>

              <div className="flex flex-col gap-7">
                {WHY_ITEMS.map(({ Icon, title, body }) => (
                  <div key={title} className="flex gap-4">
                    {/* Dark navy container — gold icon — matches site AI badge style */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "hsl(222 60% 8%)" }}
                    >
                      <Icon className="h-[18px] w-[18px] text-cta" strokeWidth={1.75} />
                    </div>
                    <div className="pt-0.5">
                      <h4 className="mb-1 text-[15px] font-semibold text-ink">{title}</h4>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS Table */}
            <div className="ep-card overflow-hidden p-0">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_80px] border-b border-hairline bg-card px-6 py-4">
                <span className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Feature</span>
                <span className="text-center text-[12px] font-bold uppercase tracking-wide text-brand">easyPhoto</span>
                <span className="text-center text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Studio</span>
              </div>

              <div className="divide-y divide-hairline px-6">
                {VS_ROWS.map((row) => (
                  <div key={row.feat} className="grid grid-cols-[1fr_80px_80px] items-center py-3.5">
                    <span className="text-[13px] font-medium text-ink">{row.feat}</span>

                    {/* easyPhoto cell */}
                    <span className="flex justify-center">
                      {row.easy === true ? (
                        <Check />
                      ) : row.easy === "FREE" ? (
                        <span className="text-[13px] font-black text-brand">FREE</span>
                      ) : (
                        <span className="text-[13px] font-bold text-emerald-600">{row.easy}</span>
                      )}
                    </span>

                    {/* Studio cell */}
                    <span className="flex justify-center">
                      {row.studio === false ? (
                        <Cross />
                      ) : (
                        <span className="text-[13px] font-medium text-muted-foreground">{row.studio as string}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
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
