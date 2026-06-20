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
import { HowItWorks } from "@/components/site/HowItWorks";
import { AiShowcase } from "@/components/site/AiShowcase";
import { HeroVisual } from "@/components/site/HeroVisual";
import { UsedForTabs } from "@/components/site/UsedForTabs";
import { ComplianceEngine } from "@/components/site/ComplianceEngine";
import { RealTransformations } from "@/components/site/RealTransformations";
import { ComparisonTable } from "@/components/site/ComparisonTable";
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

/** Top 5 featured countries shown as large spotlight cards. */
const FEATURED_IDS = ["india", "us", "canada", "uk", "australia"] as const;

const FEATURED_SUBS: Record<string, string> = {
  india: "Passport Seva",
  us: "State Dept Standard",
  canada: "IRCC Standard",
  uk: "HMPO Standard",
  australia: "APO Standard",
};

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

      {/* ── HERO — dark navy, matching reference prototype ────────── */}
      <section
        style={{
          background: "linear-gradient(180deg, #040c24 0%, #0a173c 100%)",
          padding: "80px 0 60px",
        }}
      >
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">

            {/* Left: value proposition */}
            <div>
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,208,0,0.25)] bg-[rgba(255,208,0,0.1)] px-4 py-1.5 text-[13px] font-bold tracking-[0.05em] text-[#ffd000]">
                <span>⚡</span> FREE PASSPORT PHOTO MAKER
              </div>

              {/* Headline — 54px Outfit font matching prototype */}
              <h1
                className="mb-5 text-balance text-[42px] font-bold leading-[1.15] text-white sm:text-[54px]"
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  letterSpacing: "-0.02em",
                }}
              >
                Get Passport &amp; Visa Photos
                <br />Approved in{" "}
                <span className="text-[#ffd000]">Seconds ⚡</span>
              </h1>

              <p className="mb-10 max-w-[520px] text-[18px] leading-relaxed text-[#94a3b8]">
                AI-powered photo maker for 190+ countries. 100% compliant.
                Ready in seconds.
              </p>

              {/* CTA + "It's Free!" hand-drawn decoration */}
              <div className="relative mb-12 flex items-center gap-5">
                <Link
                  href="/india-passport-photo/"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#ffd000] px-7 py-3.5 text-[15px] font-semibold text-[#040c24] transition-all hover:-translate-y-0.5 hover:bg-[#e6bc00] hover:shadow-[0_8px_24px_rgba(255,208,0,0.35)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Your Photo
                </Link>
                {/* "It's Free!" decoration */}
                <div className="absolute left-[220px] top-[-10px] flex -rotate-6 flex-col items-center">
                  <span
                    className="text-[16px] font-bold text-[#ffd000]"
                    style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    It&rsquo;s Free!
                  </span>
                  <svg width="54" height="28" viewBox="0 0 60 30" fill="none" aria-hidden>
                    <path d="M5 25C15 15 35 5 50 15M50 15L42 12M50 15L45 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Rating — real avatar photos + "Trusted by 500,000+"  */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {["/images/selfie_compliant.png", "/images/man_compliant.png"].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full border-2 border-[#0a173c] object-cover object-top"
                      style={{ marginLeft: i === 0 ? "0" : "-12px" }}
                    />
                  ))}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a173c] bg-[#102154] text-[12px] font-bold text-[#ffd000]"
                    style={{ marginLeft: "-12px" }}
                  >
                    +50
                  </div>
                </div>
                <div>
                  <div className="text-[16px] tracking-[2px] text-[#ffd000]">★★★★★</div>
                  <p className="text-[13px] text-[#94a3b8]">Trusted by 500,000+ users worldwide</p>
                </div>
              </div>
            </div>

            {/* Right: 3-panel visual */}
            <div>
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── Live tool — below the hero ───────────────────────────── */}
      <section className="border-b border-hairline bg-paper">
        <div className="container py-10">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Make Your Free Passport Photo Now
            </p>
          </div>
          <div className="mx-auto max-w-lg">
            <HeroStarter />
          </div>
        </div>
      </section>

      {/* "Used For" tab strip — passive filter showing document types */}
      <UsedForTabs />

      {/* AI Showcase — 3-panel before/AI/after with real photos + 4-step process */}
      <AiShowcase />

      {/* AI Compliance Engine — dark navy panel with checklist + 100% score */}
      <ComplianceEngine />

      {/* Real Transformations — before/after grid with real photo pairs */}
      <RealTransformations />

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

      {/* Country index — featured spotlight + full dense grid */}
      <section id="countries" className="border-t border-hairline bg-paper scroll-mt-16">
        <div className="container py-14 sm:py-16">
          <div className="flex items-baseline justify-between border-b border-hairline pb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Choose your country
            </h2>
            <span className="eyebrow hidden sm:block">
              {LAUNCH_ORDER.length} countries · official specs
            </span>
          </div>

          {/* Featured 5 — flag-forward cards with standard name */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {FEATURED_IDS.map((id) => {
              const spec = COUNTRY_SPECS[id];
              const mm = effectivePrintMm(spec);
              return (
                <Link
                  key={id}
                  href={primaryMakerPath(id)}
                  className="ep-card group flex flex-col gap-2.5 p-4"
                >
                  <Flag
                    country={id}
                    className="h-10 w-[3.5rem] rounded-[3px] ring-1 ring-hairline"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-tight text-ink">
                      {spec.label}
                    </span>
                    <span className="mt-1 block text-[11px] font-medium text-[#A87E10]">
                      {mm.width}×{mm.height} mm
                    </span>
                    <span className="spec mt-0.5 block truncate normal-case tracking-[0.07em]">
                      {FEATURED_SUBS[id]}
                    </span>
                  </span>
                  {/* "Used by …" avatar footer — matches prototype */}
                  <div className="mt-auto flex items-center gap-2 border-t border-hairline pt-2.5">
                    <div className="flex items-center">
                      {["/images/selfie_compliant.png", "/images/man_compliant.png"].map((src, ai) => (
                        <img
                          key={ai}
                          src={src}
                          alt=""
                          aria-hidden
                          className="h-6 w-6 rounded-full border-2 border-paper object-cover object-top"
                          style={{ marginLeft: ai === 0 ? "0" : "-8px" }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Used by 250K+
                    </span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-ink-faint opacity-0 transition-all group-hover:text-brand group-hover:opacity-100" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Remaining countries — compact 4-column grid */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LAUNCH_ORDER.filter((id) => !(FEATURED_IDS as readonly string[]).includes(id)).map((id) => {
              const spec = COUNTRY_SPECS[id];
              const mm = effectivePrintMm(spec);
              return (
                <Link
                  key={id}
                  href={primaryMakerPath(id)}
                  className="ep-card group flex items-center gap-3 p-3.5"
                >
                  <Flag
                    country={id}
                    className="h-7 w-10 shrink-0 rounded-[3px] ring-1 ring-hairline"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold leading-tight text-ink">
                      {spec.label}
                    </span>
                    <span className="spec mt-0.5 block truncate normal-case tracking-[0.07em]">
                      {mm.width}×{mm.height} mm
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
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

      {/* Why Choose + VS Table + Reviews */}
      <ComparisonTable />

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
