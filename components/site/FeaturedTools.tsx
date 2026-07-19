import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  GraduationCap,
  PenLine,
  FileText,
  ImageIcon,
} from "lucide-react";

/* ── data ─────────────────────────────────────────────────────────────── */

const PASSPORT = {
  href: "/passport-photo/",
  cta: "Make a passport photo",
  includes: ["All countries", "Take with camera", "Print sheet", "Name & date strip"],
  outcome:
    "Turn any selfie into a photo prepared to the published spec for your country, exam or ID — auto-cropped, sized and background-corrected.",
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

/*
 * Grid layout (lg):
 *   Row 1: [Hero 2-col] | [Exam 1-col]
 *   Row 2: [Sig 1-col]  | [Image 1-col] | [PDF 1-col]
 * All three bottom cards share the same vertical card pattern.
 */
const BOTTOM_CARDS: Card[] = [
  {
    icon: <GraduationCap className="h-5 w-5 text-amber-600" strokeWidth={1.75} />,
    title: "Exam Application Kit",
    outcome:
      "Follow the selected exam portal's photo workflow and prepare the separate files it lists — SSC, UPSC, Railway, Banking and more.",
    includes: ["Photo + signature", "Photo issue checker", "50+ exam specs"],
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
  {
    icon: <ImageIcon className="h-5 w-5 text-sky-600" strokeWidth={1.75} />,
    title: "Image Processing",
    outcome:
      "Resize, compress or convert a photo to a selected KB or pixel target.",
    includes: ["Resize to KB", "Resize dimensions", "JPG to PDF"],
    href: "/tools/",
    cta: "Open image tools",
    iconBg: "bg-sky-50 dark:bg-sky-900/20",
    chipBg: "bg-sky-50 dark:bg-sky-900/20",
    chipText: "text-sky-600 dark:text-sky-400",
    vtName: "feat-image",
  },
  {
    icon: <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />,
    title: "PDF Tools",
    outcome:
      "Compress, merge, split, sign and unlock PDFs to fit any portal upload limit — every file stays on your device.",
    includes: ["Compress to KB", "Merge & split", "Sign", "Unlock password"],
    href: "/tools/pdf/",
    cta: "Open PDF tools",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
    chipBg: "bg-emerald-50 dark:bg-emerald-900/20",
    chipText: "text-emerald-600 dark:text-emerald-400",
    vtName: "feat-pdf",
  },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;

/* ── shared card shell ─────────────────────────────────────────────────── */

function BottomCard({ card }: { card: Card }) {
  const { icon, title, outcome, includes, href, cta, iconBg, chipBg, chipText, vtName } = card;
  return (
    <Link
      href={href}
      className="lift-card group flex flex-col p-6"
      {...(vtName ? { style: { viewTransitionName: vtName } as React.CSSProperties } : {})}
    >
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-[15px] font-bold leading-tight text-ink">{title}</h3>
      <p className="mb-4 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">{outcome}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {includes.map((item) => (
          <span
            key={item}
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${chipBg} ${chipText}`}
          >
            {item}
          </span>
        ))}
      </div>
      <span className="flex items-center gap-1.5 text-[13px] font-bold text-brand">
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/* ── component ─────────────────────────────────────────────────────────── */

export function FeaturedTools() {
  return (
    <section className="border-t border-hairline bg-card">
      <div className="container reveal py-12 sm:py-14">

        {/* heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
        {/*
          Row 1 (lg): [Hero 2-col]  |  [Exam 1-col]
          Row 2 (lg): [Sig 1-col]   |  [Image 1-col]  |  [PDF 1-col]
          All four secondary cards share the same BottomCard shell.
        */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* 1. Hero — Passport & Visa (2 cols on lg) */}
          <Link
            href={PASSPORT.href}
            className="lift-card group relative flex flex-col overflow-hidden p-6 sm:col-span-2 lg:col-span-2"
            style={{ ...NAVY, viewTransitionName: "feat-passport" } as React.CSSProperties}
          >
            <div className="bento-hero-bg pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* Pill + icon in same row */}
            <div className="relative mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cta bg-cta px-3 py-1 text-xs font-bold uppercase tracking-widest text-cta-foreground">
                ✦ Most popular
              </span>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <CreditCard className="h-5 w-5 text-cta" strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="relative mb-2 text-[20px] font-bold leading-tight text-white lg:text-[22px]">
              Passport &amp; Visa Photo
            </h3>
            <p className="relative mb-4 text-[13px] leading-relaxed text-white/55">
              {PASSPORT.outcome}
            </p>
            <div className="relative mb-5 flex flex-wrap gap-2">
              {PASSPORT.includes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white/60"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="relative flex items-center gap-2 text-[13.5px] font-bold text-cta">
              {PASSPORT.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 2–5. Secondary cards (Exam top-right; Sig + Image + PDF bottom row) */}
          {BOTTOM_CARDS.map((card) => (
            <BottomCard key={card.href} card={card} />
          ))}

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
