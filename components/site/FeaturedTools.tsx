import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  GraduationCap,
  PenLine,
  FileText,
} from "lucide-react";

/* ── data ─────────────────────────────────────────────────────────────── */

const PASSPORT = {
  href: "/passport-photo/",
  cta: "Make a passport photo",
  includes: ["All countries", "Take with camera", "Print sheet", "Name & date strip"],
  outcome:
    "Turn any selfie into a government-compliant photo for any country, exam or ID — auto-cropped, sized and background-corrected.",
};

interface Card {
  icon: React.ReactNode;
  title: string;
  outcome: string;
  includes: string[];
  href: string;
  cta: string;
  iconBg: string;
  chipBg: string;
  chipText: string;
  vtName?: string;
}

const MEDIUM_CARDS: Card[] = [
  {
    icon: <GraduationCap className="h-5 w-5 text-amber-600" strokeWidth={1.75} />,
    title: "Exam Application Kit",
    outcome:
      "Get a photo and signature in the exact size every exam portal demands — SSC, UPSC, Railway, Banking and more.",
    includes: ["Photo + signature", "Rejection checker", "50+ exam specs"],
    href: "/tools/exam-package/",
    cta: "Build your exam kit",
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    chipBg: "bg-amber-50 dark:bg-amber-900/20",
    chipText: "text-amber-700 dark:text-amber-400",
    vtName: "feat-exam",
  },
  {
    icon: <PenLine className="h-5 w-5 text-violet-600" strokeWidth={1.75} />,
    title: "Signature Tools",
    outcome:
      "Turn a paper signature into a clean, transparent PNG that's ready to drop into any form.",
    includes: ["Transparent PNG", "Remove background", "Crop & resize"],
    href: "/tools/signature/",
    cta: "Prepare a signature",
    iconBg: "bg-violet-50 dark:bg-violet-900/20",
    chipBg: "bg-violet-50 dark:bg-violet-900/20",
    chipText: "text-violet-600 dark:text-violet-400",
    vtName: "feat-signature",
  },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;

/* ── component ─────────────────────────────────────────────────────────── */

export function FeaturedTools() {
  return (
    <section className="border-t border-hairline bg-card">
      <div className="container reveal py-12 sm:py-14">

        {/* heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Popular Workflows
            </p>
            <h2 className="text-[1.7rem] font-bold tracking-tight text-ink sm:text-[2rem]">
              What do you need to{" "}
              <span className="mark-gold text-ink">get done?</span>
            </h2>
          </div>
          <Link
            href="/tools/"
            className="hidden shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline sm:flex"
          >
            View all 34 tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ── Bento grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* 1. Hero card — Passport & Visa (2 cols × 2 rows on lg) */}
          <Link
            href={PASSPORT.href}
            className="lift-card group relative flex flex-col overflow-hidden p-7 lg:col-span-2 lg:row-span-2"
            style={{ ...NAVY, viewTransitionName: "feat-passport" } as React.CSSProperties}
          >
            {/* Subtle dot-grid depth layer */}
            <div className="bento-hero-bg pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* "Most popular" pill */}
            <span className="relative mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-cta/25 bg-cta/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cta">
              ✦ Most popular
            </span>

            {/* Icon */}
            <div
              className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <CreditCard className="h-7 w-7 text-cta" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="relative mb-3 text-[20px] font-bold leading-tight text-white lg:text-[24px]">
              Passport &amp; Visa Photo
            </h3>

            {/* Outcome */}
            <p className="relative mb-6 max-w-prose text-[13.5px] leading-relaxed text-white/55">
              {PASSPORT.outcome}
            </p>

            {/* Feature chips */}
            <div className="relative mb-auto flex flex-wrap gap-2">
              {PASSPORT.includes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-semibold text-white/60"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="relative mt-8 flex items-center gap-2 text-[14px] font-bold text-cta">
              {PASSPORT.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 2 & 3. Medium cards — Exam, Signature (1 col each, stack in col 3) */}
          {MEDIUM_CARDS.map(({ icon, title, outcome, includes, href, cta, iconBg, chipBg, chipText, vtName }) => (
            <Link
              key={href}
              href={href}
              className="lift-card group flex flex-col p-6"
              {...(vtName ? { style: { viewTransitionName: vtName } as React.CSSProperties } : {})}
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                {icon}
              </div>
              <h3 className="mb-2 text-[16px] font-bold leading-tight text-ink">{title}</h3>
              <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">{outcome}</p>
              <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
                {includes.map((item) => (
                  <span key={item} className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${chipBg} ${chipText}`}>
                    {item}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-[13px] font-bold text-brand">
                {cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}

          {/* 4. Wide card — PDF Tools (spans full 3 cols, horizontal layout) */}
          <Link
            href="/tools/pdf/"
            className="lift-card group flex flex-col gap-4 p-6 sm:flex-row sm:items-center lg:col-span-3"
            style={{ viewTransitionName: "feat-pdf" } as React.CSSProperties}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-[16px] font-bold text-ink">PDF Tools</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Compress, merge, split, sign and unlock PDFs to fit any portal upload limit — every file stays on your device.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-1.5">
              {["Compress to KB", "Merge & split", "Sign", "Unlock password"].map((item) => (
                <span key={item} className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {item}
                </span>
              ))}
            </div>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] font-bold text-brand">
              Open PDF tools
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

        </div>

        {/* mobile "view all" */}
        <div className="mt-6 sm:hidden">
          <Link href="/tools/" className="flex items-center gap-1 text-[13px] font-semibold text-brand hover:underline">
            View all 34 tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
