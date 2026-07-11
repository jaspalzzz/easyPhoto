import * as React from "react";
import {
  ArrowRight,
  GraduationCap,
  Plane,
  Wrench,
  ScrollText,
} from "lucide-react";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { READY_TOOLS } from "@/lib/toolsCatalog";
import { TrackedLink } from "@/components/site/TrackedLink";
import type { HomepagePath } from "@/lib/analytics";

/*
 * ChoosePath — the three-path homepage hierarchy.
 * ------------------------------------------------
 * Sits directly below the hero. Its only job is to make the three ways to use
 * easyPhoto obvious at a glance, WITHOUT hiding any of them:
 *
 *   1. Exam & Government Applications  — India-first, the business focus.
 *   2. Passport & Visa Photos          — prominent, global, revenue-oriented.
 *   3. Document Utilities              — PDF, signature, image & OCR support.
 *
 * Additive by design: it links into existing hub routes only (no new URLs) and
 * complements — does not replace — the sections further down the page. Counts
 * are read from the live registries so they never drift from reality.
 */

const EXAM_COUNT = PORTAL_KEYS.length;
const COUNTRY_COUNT = LAUNCH_ORDER.length;
const TOOL_COUNT = READY_TOOLS.length;

interface Path {
  analyticsPath: HomepagePath;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  href: string;
  cta: string;
  /** Sub-links surfaced as chips — the most-searched entries per path. */
  chips: { label: string; href: string }[];
  /** Accent classes (light + dark). */
  iconBg: string;
  iconText: string;
  chipHover: string;
  /** Strategically emphasised path gets the brand ring + "Start here" flag. */
  featured?: boolean;
}

const PATHS: Path[] = [
  {
    analyticsPath: "exam",
    Icon: GraduationCap,
    eyebrow: "Exam & Government",
    title: (
      <>
        Exam &amp; Government <span className="whitespace-nowrap">Applications</span>
      </>
    ),
    desc: `Photo, signature and document sizes for ${EXAM_COUNT}+ Indian exam and recruitment forms — each checked against its published requirements.`,
    href: "/exam-requirements/",
    cta: "Find your exam or form",
    chips: [
      { label: "SSC", href: "/ssc-photo-resizer/" },
      { label: "UPSC", href: "/upsc-photo-resizer/" },
      { label: "Voter ID", href: "/exam-requirements/voter-id/" },
      { label: "Railway", href: "/railway-photo-resizer/" },
      { label: "Banking", href: "/ibps-photo-resizer/" },
    ],
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    iconText: "text-amber-600 dark:text-amber-400",
    chipHover: "hover:border-amber-300 hover:text-amber-700 dark:hover:text-amber-300",
    featured: true,
  },
  {
    analyticsPath: "passport",
    Icon: Plane,
    eyebrow: "Passport & Visa",
    title: <>Passport &amp; Visa Photos</>,
    desc: `Passport, visa and OCI photos for ${COUNTRY_COUNT}+ countries — exact size, correct background, checked against the published spec.`,
    href: "/passport-photo/",
    cta: "Make a passport or visa photo",
    chips: [
      { label: "India", href: "/passport-photo/" },
      { label: "USA", href: "/us-passport-photo/" },
      { label: "UK", href: "/uk-passport-photo/" },
      { label: "Canada", href: "/canada-passport-photo/" },
      { label: "Schengen", href: "/schengen-visa-photo/" },
    ],
    iconBg: "bg-sky-50 dark:bg-sky-900/20",
    iconText: "text-sky-600 dark:text-sky-400",
    chipHover: "hover:border-sky-300 hover:text-sky-700 dark:hover:text-sky-300",
  },
  {
    analyticsPath: "utilities",
    Icon: Wrench,
    eyebrow: "Document Utilities",
    title: <>Document Utilities</>,
    desc: `${TOOL_COUNT}+ free tools to resize, compress, convert, sign and read documents — everything runs in your browser.`,
    href: "/tools/",
    cta: "Open all tools",
    chips: [
      { label: "Compress PDF", href: "/tools/pdf-compress/" },
      { label: "Sign", href: "/tools/signature/" },
      { label: "Resize to KB", href: "/tools/resize-kb/" },
      { label: "Remove BG", href: "/tools/background-removal/" },
      { label: "Read ID (OCR)", href: "/tools/ocr/" },
    ],
    iconBg: "bg-violet-50 dark:bg-violet-900/20",
    iconText: "text-violet-600 dark:text-violet-400",
    chipHover: "hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300",
  },
];

function PathCard({ path }: { path: Path }) {
  const { analyticsPath, Icon, eyebrow, title, desc, href, cta, chips, iconBg, iconText, chipHover, featured } = path;
  return (
    <div
      className={`lift-card flex flex-col p-6 ${
        featured ? "ring-1 ring-cta/40" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-[22px] w-[22px] ${iconText}`} strokeWidth={1.75} />
        </div>
        {featured && (
          <span className="inline-flex items-center gap-1 rounded-full border border-cta/30 bg-cta/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cta">
            <ScrollText className="h-3 w-3" strokeWidth={2} />
            Start here
          </span>
        )}
      </div>

      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
      <h3 className="mb-2 text-[17px] font-bold leading-tight text-ink">{title}</h3>
      <p className="mb-4 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>

      {/* Sub-links — the most-searched entries for this path */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <TrackedLink
            key={c.href + c.label}
            href={c.href}
            event={{ name: "path_select", path: analyticsPath }}
            className={`rounded-full border border-hairline bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink-soft transition-colors ${chipHover}`}
          >
            {c.label}
          </TrackedLink>
        ))}
      </div>

      <TrackedLink
        href={href}
        event={{ name: "path_select", path: analyticsPath }}
        className="group/cta flex items-center gap-1.5 text-[13px] font-bold text-brand hover:underline"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
      </TrackedLink>
    </div>
  );
}

export function ChoosePath() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container reveal py-12 sm:py-14">
        {/* Broad promise — passport and exam users both belong here */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-[1.7rem] font-bold tracking-tight text-ink sm:text-[2rem]">
            Application photos &amp; documents that meet the{" "}
            <span className="mark-gold whitespace-nowrap text-ink">published specs</span>
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Pick your path — each exam and passport spec cites its published source, so you can check it yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PATHS.map((p) => (
            <PathCard key={p.href} path={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
