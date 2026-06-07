import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  COUNTRY_SPECS,
  LAUNCH_ORDER,
  effectivePrintMm,
} from "@/lib/countrySpecs";
import { POPULAR_TOOLS } from "@/lib/toolsCatalog";
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

export const metadata = pageMetadata({
  title: "Free Passport & Visa Photo Maker",
  description:
    "Create a compliant passport or visa photo for free. Pick your country and " +
    "drop a photo. We auto-crop to the exact head-size and background rules, " +
    "then check compliance. 100% in your browser; nothing is uploaded.",
  path: "/",
});

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
            <span className="eyebrow">Passport &amp; visa photo bureau</span>
            <h1 className="mt-4 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tightest sm:text-[3.25rem]">
              Document photos, exact{" "}
              <span className="text-brand">to the millimetre</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Pick your country and drop a photo. We crop to the exact head size
              and apply the background your government requires, then check it.
              It&apos;s free and runs entirely in your browser.
            </p>
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
