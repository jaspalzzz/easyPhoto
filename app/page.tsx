import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  COUNTRY_SPECS,
  LAUNCH_ORDER,
  effectivePrintMm,
} from "@/lib/countrySpecs";
import { POPULAR_TOOLS, READY_TOOLS } from "@/lib/toolsCatalog";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { primaryMakerPath } from "@/lib/makerPages";
import { TrustStrip, TrustPills } from "@/components/site/TrustStrip";
import { HowItWorks, HOW_IT_WORKS_STEPS } from "@/components/site/HowItWorks";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareApplicationSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ToolIconTile } from "@/components/site/ToolIcon";
import { ToolCard } from "@/components/site/ToolCard";
import { HeroStarter } from "@/components/site/HeroStarter";
import { Flag } from "@/components/site/Flag";
import { ToolSearch } from "@/components/site/ToolSearch";
import { RecentTools } from "@/components/site/RecentTools";

export const metadata = pageMetadata({
  // The layout's "%s — easyPhoto" template does NOT apply to the root segment
  // (Next.js scoping), so the brand must be written here explicitly — it's the
  // homepage's strongest signal for the "easyphoto" brand query.
  title: "easyPhoto — Document Photo & Form-Resize Tools for India",
  description:
    "Free tools for Indian passport photos, visa photos, exam form resizing " +
    "and government document images. Pick your country or exam — everything " +
    "runs in your browser, nothing is uploaded.",
  path: "/",
});

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
  { label: "UPPSC", href: "/tools/form-resizer/uppsc/" },
  { label: "BPSC", href: "/tools/form-resizer/bpsc/" },
  { label: "MPSC", href: "/tools/form-resizer/mpsc/" },
  { label: "US Visa (DS-160)", href: "/tools/form-resizer/ds160/" },
  { label: "OCI", href: "/tools/form-resizer/oci/" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        schema={softwareApplicationSchema({
          name: "easyPhoto — Document Photo & Form-Resize Tools",
          description:
            "Free tools for Indian passport photos, visa photos, exam form resizing and government document images. Everything runs in your browser, nothing is uploaded.",
          url: "/",
          category: "UtilitiesApplication",
          dateModified: "2026-06-18",
        })}
      />

      {/* Returners: one-tap path back to their tool (renders nothing on a
          first visit — device-local, see lib/recentTools.ts). */}
      <RecentTools />

      {/* Hero — two columns: value proposition + live passport starter */}
      <section className="border-b border-hairline bg-paper">
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            {/* Left: value proposition. The headline sells the outcome the
                anxious visitor came for (acceptance), not the mechanism; the
                precision claim moves to the eyebrow. */}
            <div className="max-w-xl">
              <span className="eyebrow">
                Passport · exam · visa — exact to the millimetre
              </span>
              <h1 className="mt-4 text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-tightest sm:text-[3.25rem]">
                Document photos that{" "}
                <span className="text-brand">get accepted</span>
              </h1>
              <p className="mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Pick your country or exam and drop a photo — we crop to the
                official spec, set the required background, and check it before
                you download. Free, and entirely in your browser.
              </p>

              {/* Credibility stats — real, dynamic counts. Desktop-and-up:
                  on phones they pushed the actual tool two viewports down. */}
              <dl className="mt-7 hidden max-w-md divide-x divide-hairline overflow-hidden rounded-xl border border-hairline bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:flex">
                {[
                  { v: `${LAUNCH_ORDER.length}`, l: "country specs" },
                  { v: `${PORTAL_KEYS.length}`, l: "exam & form specs" },
                  { v: `${READY_TOOLS.length}`, l: "free tools" },
                ].map((s) => (
                  <div key={s.l} className="flex-1 px-4 py-3.5">
                    <dt className="text-[1.65rem] font-bold leading-none tracking-tight text-brand">
                      {s.v}
                    </dt>
                    <dd className="mt-1 text-xs leading-tight text-muted-foreground">
                      {s.l}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Search is a power-user shortcut — desktop only; on mobile it
                  competed with the primary flow (and the nav covers it). */}
              <div className="mt-6 hidden max-w-md lg:block">
                <ToolSearch />
              </div>

              <TrustPills className="mt-5 justify-start sm:mt-6" />
            </div>

            {/* Right: live passport starter */}
            <div className="lg:pl-2">
              <HeroStarter />
            </div>
          </div>
        </div>
      </section>

      {/* Indian exams & forms — convert the dominant exam-candidate audience */}
      <section id="exams" className="scroll-mt-16">
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
            className="ep-card group mt-6 flex items-center gap-4 border-brand/25 bg-brand-soft/20 p-5 hover:bg-brand-soft/30"
          >
            <ToolIconTile name="FileStack" category="exam" />
            <span className="min-w-0">
              <span className="block font-semibold leading-tight text-ink">
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
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {EXAM_LINKS.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="ep-card group flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink"
              >
                {e.label}
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Calendar + Hindi / Hinglish */}
          <p className="mt-5 text-sm text-muted-foreground">
            <Link href="/exam-calendar/" className="font-medium text-brand hover:underline">
              Upcoming exam dates &amp; application windows →
            </Link>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
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

      {/* Country index — a ruled bureau register, not floating cards */}
      <section id="countries" className="border-t border-hairline bg-paper scroll-mt-16">
        <div className="container py-14 sm:py-16">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Choose your country
          </h2>
          <span className="eyebrow hidden sm:block">Official specifications</span>
        </div>
        <div className="ep-card-grid mt-6">
          {LAUNCH_ORDER.map((id) => {
            const spec = COUNTRY_SPECS[id];
            const mm = effectivePrintMm(spec);
            return (
              <Link
                key={id}
                href={primaryMakerPath(id)}
                className="ep-card group flex items-center gap-3.5 p-4"
              >
                <Flag country={id} className="h-8 w-11 shrink-0 rounded-[3px] ring-1 ring-hairline" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold leading-tight text-ink">
                    {spec.label}
                  </span>
                  <span className="spec mt-1 block truncate normal-case tracking-[0.08em]">
                    {mm.width}×{mm.height}mm ·{" "}
                    {spec.background.description.split("(")[0].trim().split(",")[0]}
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
        </div>
      </section>

      {/* Free image & PDF tools — surfaced above trust, premium cards */}
      <section className="border-t border-hairline scroll-mt-16">
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
          <div className="ep-card-grid mt-6">
            {POPULAR_TOOLS.map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                title={tool.title}
                blurb={tool.blurb}
                icon={tool.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-hairline bg-paper">
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
      <section className="container border-t border-hairline py-14 sm:py-16">
        <HowItWorks />
      </section>

      {/* FAQ */}
      <section className="container py-14 sm:py-16">
        <Faq />
      </section>
    </>
  );
}
