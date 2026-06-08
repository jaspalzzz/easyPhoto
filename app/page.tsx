import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  COUNTRY_SPECS,
  LAUNCH_ORDER,
  effectivePrintMm,
} from "@/lib/countrySpecs";
import { POPULAR_TOOLS, getTool } from "@/lib/toolsCatalog";
import { primaryMakerPath } from "@/lib/makerPages";
import { TrustStrip, TrustPills } from "@/components/site/TrustStrip";
import { HowItWorks, HOW_IT_WORKS_STEPS } from "@/components/site/HowItWorks";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { howToSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ToolIcon } from "@/components/site/ToolIcon";
import { HeroStarter } from "@/components/site/HeroStarter";
import { Flag } from "@/components/site/Flag";
import { ToolSearch } from "@/components/site/ToolSearch";

export const metadata = pageMetadata({
  title: "Free Passport & Visa Photo Maker",
  description:
    "Create a compliant passport or visa photo for free. Pick your country and " +
    "drop a photo. We auto-crop to the exact head-size and background rules, " +
    "then check compliance. 100% in your browser; nothing is uploaded.",
  path: "/",
});

/**
 * Quick-access strip of the highest-intent tools, surfaced right under the hero
 * so visitors who came for an image/PDF/professional-photo task (not a passport)
 * immediately see the breadth — fixes the "reads as a passport-only site" gap.
 */
const QUICK_TOOLS = [
  "background-removal",
  "resize-kb",
  "resume-photo",
  "linkedin-photo",
  "jpg-to-pdf",
  "pdf-compress",
  "pdf-merge",
  "sign-pdf",
].map((slug) => getTool(slug)!);

/** Top exam destinations — dedicated landing page where it exists, else the form-resizer. */
const EXAM_LINKS: { label: string; href: string }[] = [
  { label: "SSC", href: "/ssc-photo-resizer/" },
  { label: "UPSC", href: "/upsc-photo-resizer/" },
  { label: "IBPS", href: "/ibps-photo-resizer/" },
  { label: "SBI PO", href: "/sbi-po-photo-resizer/" },
  { label: "Railway (RRB)", href: "/railway-photo-resizer/" },
  { label: "NEET / JEE", href: "/tools/form-resizer/nta/" },
  { label: "RBI", href: "/tools/form-resizer/rbi/" },
  { label: "CTET", href: "/tools/form-resizer/ctet/" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        schema={howToSchema({
          name: "How to make a compliant passport photo",
          description:
            "Turn any photo into a passport/visa-compliant photo in three steps.",
          steps: HOW_IT_WORKS_STEPS.map((s) => ({ name: s.title, text: s.body })),
        })}
      />

      {/* Hero — paper, tool-first, no gradients */}
      <section className="border-b border-hairline">
        <div className="container py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Passport, exam &amp; document tools</span>
            <h1 className="mt-4 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tightest sm:text-[3.25rem]">
              Document photos, exact{" "}
              <span className="text-brand">to the millimetre</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Pick your country and drop a photo. We crop to the exact head size
              and apply the background your government requires, then check it.
              It&apos;s free and runs entirely in your browser.
            </p>
            
            <div className="mt-6">
              <ToolSearch />
            </div>

            <div className="spec mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>Exact size</span>
              <span className="text-ink-faint">/</span>
              <span>Correct background</span>
              <span className="text-ink-faint">/</span>
              <span>Compliance-checked</span>
            </div>
          </div>

          <div className="mx-auto mt-9 max-w-2xl text-left">
            <HeroStarter />
          </div>

          <div className="mt-7">
            <TrustPills />
          </div>
        </div>
      </section>

      {/* Quick tools — surface breadth (image/PDF/professional) right after the hero */}
      <section className="border-b border-hairline bg-paper">
        <div className="container py-10 sm:py-12">
          <div className="flex items-baseline justify-between border-b border-hairline pb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Popular free tools
            </h2>
            <Link
              href="/tools/"
              className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              All tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUICK_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="group flex items-center gap-2.5 rounded-md border border-hairline bg-card px-3.5 py-3 transition-colors hover:bg-accent/40"
              >
                <span className="text-ink-soft transition-colors group-hover:text-brand">
                  <ToolIcon name={tool.icon} className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium leading-tight">
                  {tool.title}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/tools/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline sm:hidden"
          >
            All tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Country index — a ruled bureau register, not floating cards */}
      <section id="countries" className="container scroll-mt-16 py-14 sm:py-16">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Choose your country
          </h2>
          <span className="eyebrow hidden sm:block">Official specifications</span>
        </div>
        <div className="mt-6 register sm:grid-cols-2 lg:grid-cols-3">
          {LAUNCH_ORDER.map((id) => {
            const spec = COUNTRY_SPECS[id];
            const mm = effectivePrintMm(spec);
            return (
              <Link
                key={id}
                href={primaryMakerPath(id)}
                className="group flex items-center gap-3.5 bg-card p-4 transition-colors hover:bg-accent/40"
              >
                <Flag country={id} className="h-5 w-7 shrink-0 rounded-[2px]" />
                <span className="min-w-0">
                  <span className="block truncate font-medium leading-tight">
                    {spec.label}
                  </span>
                  <span className="spec mt-1 block normal-case tracking-[0.08em]">
                    {mm.width}×{mm.height}mm ·{" "}
                    {spec.background.description.split("(")[0].trim().split(",")[0]}
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Indian exams & forms — convert the dominant exam-candidate audience */}
      <section id="exams" className="border-t border-hairline bg-paper scroll-mt-16">
        <div className="container py-14 sm:py-16">
          <div className="flex items-baseline justify-between border-b border-hairline pb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Indian exams &amp; forms
            </h2>
            <span className="eyebrow hidden sm:block">
              Exact size, KB &amp; dimensions
            </span>
          </div>

          {/* Featured: the guided wizard */}
          <Link
            href="/tools/exam-package/"
            className="group mt-6 flex items-center gap-4 rounded-md border border-brand/25 bg-brand-soft/20 p-5 transition-colors hover:bg-brand-soft/40"
          >
            <ToolIcon name="FileStack" className="h-7 w-7 shrink-0 text-brand" />
            <span className="min-w-0">
              <span className="block font-semibold leading-tight">
                Exam Application Kit
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                Pick your exam, then get a correctly sized photo &amp; signature in
                one guided flow.
              </span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>

          {/* Per-exam resizers */}
          <div className="mt-4 register sm:grid-cols-3 lg:grid-cols-4">
            {EXAM_LINKS.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="group flex items-center gap-2 bg-card p-4 text-sm font-medium transition-colors hover:bg-accent/40"
              >
                {e.label}
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Hindi / Hinglish */}
          <p className="mt-5 text-sm text-muted-foreground">
            Hindi me:{" "}
            <Link href="/photo-resize-kaise-kare/" className="text-brand hover:underline">
              photo resize kaise kare
            </Link>{" "}
            ·{" "}
            <Link href="/photo-ka-size-20kb-kaise-kare/" className="text-brand hover:underline">
              size 20kb kaise kare
            </Link>{" "}
            ·{" "}
            <Link href="/signature-resize-kaise-kare/" className="text-brand hover:underline">
              signature resize
            </Link>
          </p>
        </div>
      </section>

      {/* Trust — ruled blocks */}
      <section className="bg-paper">
        <div className="container py-14 sm:py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why people trust easyPhoto
            </h2>
            <p className="mt-1 max-w-2xl text-[15px] text-muted-foreground">
              No accounts, no uploads, no guesswork. Just the official rules,
              applied automatically.
            </p>
          </div>
          <TrustStrip />
        </div>
      </section>

      {/* How it works */}
      <section className="container py-14 sm:py-16">
        <HowItWorks />
      </section>

      {/* Tools — same ruled register treatment */}
      <section className="border-t border-hairline bg-paper">
        <div className="container py-14 sm:py-16">
          <div className="flex items-baseline justify-between border-b border-hairline pb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Free image &amp; PDF tools
            </h2>
            <Link
              href="/tools/"
              className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              All tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 register sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="group flex items-start gap-3.5 bg-card p-5 transition-colors hover:bg-accent/40"
              >
                <span className="mt-0.5 text-ink-soft transition-colors group-hover:text-brand">
                  <ToolIcon name={tool.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-medium leading-tight">
                    {tool.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {tool.blurb}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-14 sm:py-16">
        <Faq />
      </section>
    </>
  );
}
