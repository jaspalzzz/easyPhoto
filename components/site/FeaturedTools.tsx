import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  GraduationCap,
  PenLine,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── data ─────────────────────────────────────────────────────────────── */

interface Workflow {
  Icon: LucideIcon;
  title: string;
  outcome: string;
  /** Supporting tools / steps inside this workflow */
  includes: string[];
  href: string;
  cta: string;
  /** Soft accent tints for the icon halo + chips (semantic, per workflow) */
  haloBg: string;
  chipBg: string;
  chipText: string;
}

const WORKFLOWS: Workflow[] = [
  {
    Icon: CreditCard,
    title: "Passport & Visa Photo",
    outcome:
      "Turn any selfie into a government-compliant photo for any country, exam or ID — auto-cropped, sized and background-corrected.",
    includes: ["All countries", "Take with camera", "Print sheet", "Name & date strip"],
    href: "/passport-photo/",
    cta: "Make a passport photo",
    haloBg: "bg-blue-50",
    chipBg: "bg-blue-50",
    chipText: "text-blue-600",
  },
  {
    Icon: GraduationCap,
    title: "Exam Application Kit",
    outcome:
      "Get a photo and signature in the exact size every exam portal demands — SSC, UPSC, Railway, Banking and more — in one guided flow.",
    includes: ["Photo + signature", "Rejection checker", "50+ exam specs"],
    href: "/tools/exam-package/",
    cta: "Build your exam kit",
    haloBg: "bg-amber-50",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
  },
  {
    Icon: PenLine,
    title: "Signature Tools",
    outcome:
      "Turn a paper signature into a clean, transparent, correctly-sized PNG that's ready to drop into any form.",
    includes: ["Transparent PNG", "Remove background", "Crop & resize"],
    href: "/tools/signature/",
    cta: "Prepare a signature",
    haloBg: "bg-violet-50",
    chipBg: "bg-violet-50",
    chipText: "text-violet-600",
  },
  {
    Icon: FileText,
    title: "PDF Tools",
    outcome:
      "Compress, merge, split, sign and unlock PDFs to fit any portal upload limit — every file stays on your device.",
    includes: ["Compress to KB", "Merge & split", "Sign", "Unlock password"],
    href: "/tools/pdf/",
    cta: "Open PDF tools",
    haloBg: "bg-emerald-50",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-600",
  },
];

/* Shared icon tile — dark navy + gold, same language as the rest of the page */
const ICON_STYLE = { background: "hsl(222 60% 8%)" } as const;

export function FeaturedTools() {
  return (
    <section className="border-t border-hairline bg-card">
      <div className="container reveal py-12 sm:py-14">

        {/* ── heading ── */}
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

        {/* ── 4 large outcome cards: 1-col mobile → 2-col desktop ── */}
        <div className="grid gap-4 md:grid-cols-2">
          {WORKFLOWS.map(({ Icon, title, outcome, includes, href, cta, haloBg, chipBg, chipText }) => (
            <Link
              key={href}
              href={href}
              className="lift-card group relative flex flex-col overflow-hidden p-6"
            >
              {/* header: icon tile + title */}
              <div className="mb-4 flex items-center gap-4">
                <span className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${haloBg}`}>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={ICON_STYLE}
                  >
                    <Icon className="h-[22px] w-[22px] text-cta" strokeWidth={1.75} />
                  </span>
                </span>
                <h3 className="text-[18px] font-bold leading-tight text-ink">{title}</h3>
              </div>

              {/* outcome statement */}
              <p className="mb-5 text-[13.5px] leading-relaxed text-muted-foreground">
                {outcome}
              </p>

              {/* what's inside — chips */}
              <div className="mb-5 mt-auto flex flex-wrap gap-2">
                {includes.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${chipBg} ${chipText}`}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-brand">
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
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
