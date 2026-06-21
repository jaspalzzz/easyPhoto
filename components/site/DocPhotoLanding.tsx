import Link from "next/link";
import { ShieldCheck, Lock, Gift, ArrowRight } from "lucide-react";
import { effectivePrintMm } from "@/lib/countrySpecs";
import { hubCountries } from "@/lib/makerPages";
import { HeroStarter } from "@/components/site/HeroStarter";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { Flag } from "@/components/site/Flag";
import { TrustStrip } from "@/components/site/TrustStrip";
import { ExploreTools } from "@/components/site/ExploreTools";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
  howToSchema,
} from "@/lib/schema";

const HERO_TRUST = [
  { Icon: ShieldCheck, text: "ICAO-compliant specs for every country" },
  { Icon: Lock,        text: "100% private — nothing is uploaded" },
  { Icon: Gift,        text: "Free — no sign-up required" },
];

/** Shared landing page for the generic Passport / Visa photo maker. */
export function DocPhotoLanding({
  kind,
  h1,
  intro,
  faqItems,
  path,
}: {
  kind: "passport" | "visa";
  h1: string;
  intro: string;
  faqItems: FaqItem[];
  path: string;
}) {
  const doc = kind === "passport" ? "passport" : "visa";
  // Same single source as the picker (hubCountries) → the two sections cannot
  // disagree on which countries are shown.
  const sizeByCountry = hubCountries(kind).map((c) => ({
    key: c.key,
    flag: c.flag,
    label: c.label,
    href: c.path,
    mm: effectivePrintMm(c.spec),
  }));

  return (
    <div className="container max-w-6xl py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: h1, path },
          ]),
          softwareApplicationSchema({
            name: h1,
            description: intro,
            url: path,
          }),
          howToSchema({
            name: `How to make a ${doc} photo online`,
            description: `Create a compliant ${doc} photo in your browser in three steps.`,
            steps: [
              { name: "Choose your country", text: `Select the country you need the ${doc} photo for.` },
              { name: "Upload your photo", text: "Drop in a clear, front-facing photo — it stays on your device." },
              { name: "Download", text: `We size the head and set the correct background, check compliance, and you download the ${doc}-ready photo.` },
            ],
          }),
        ]}
      />

      {/* ── Tool-handy hero: maker top-right, transformer visual left ────
          DOM order is heading → tool → visual so on mobile the tool sits right
          under the heading (reachable, no scroll); on desktop CSS grid places
          the tool in the right column and the visual lower-left. */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-x-12 lg:gap-y-6">
        {/* Heading — top-left */}
        <div className="lg:col-start-1 lg:row-start-1">
          <span className="eyebrow text-brand">
            {kind === "passport" ? "Passport" : "Visa"} photo maker
          </span>
          <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem] sm:leading-[1.08]">
            {h1}
          </h1>
          <p className="mt-3.5 text-[15px] leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>

        {/* Tool — top-right (handy), spans both rows on desktop */}
        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <HeroStarter kind={kind} />
          <ul className="space-y-2.5">
            {HERO_TRUST.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
                  <Icon className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                </span>
                <span className="text-[12.5px] leading-snug text-ink">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Transformer image — lower-left on desktop */}
        <div className="lg:col-start-1 lg:row-start-2">
          <BeforeAfterSlider
            beforeSrc="/images/sample8_before_1782053095391.png"
            afterSrc="/images/sample8_after_1782053120267.png"
            caption="Drag to compare — AI crop, white background & sizing"
            className="lg:mx-0 max-w-[400px]"
          />
        </div>
      </section>

      <section className="mt-14">
        {/* Section header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-brand">Official specifications</span>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              {kind === "passport" ? "Passport" : "Visa"} photo size by country
            </h2>
          </div>
          <Link
            href={kind === "passport" ? "/visa-photo/" : "/passport-photo/"}
            className="hidden shrink-0 items-center gap-1 text-[12.5px] font-semibold text-brand hover:underline sm:flex"
          >
            View all countries <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Hero cards — first 4 countries */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sizeByCountry.slice(0, 4).map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="lift-card group flex flex-col items-center gap-3 p-5 text-center"
            >
              <Flag country={c.flag} className="h-11 w-[68px] rounded-md ring-1 ring-hairline" />
              <div>
                <p className="text-[14px] font-bold leading-tight text-ink">{c.label}</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {c.mm.width}×{c.mm.height} mm
                </p>
              </div>
              <span className="flex items-center gap-1 text-[11.5px] font-semibold text-brand">
                Make photo
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>

        {/* More countries — compact flag chips */}
        <p className="mb-2 mt-6 text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
          More countries
        </p>
        <div className="flex flex-wrap gap-2">
          {sizeByCountry.slice(4).map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink transition-colors hover:border-hairline-strong hover:bg-white"
            >
              <Flag country={c.flag} className="h-3 w-[1.05rem] rounded-[2px]" />
              {c.label}
              <span className="text-[10px] text-muted-foreground">
                {c.mm.width}×{c.mm.height}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 border-b border-hairline pb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Why people trust easyPhoto
          </h2>
        </div>
        <TrustStrip />
      </section>

      <ExploreTools
        className="mt-14"
        heading="More free tools"
        subtitle="Resize, compress, sign and convert — all on-device, no sign-up."
      />

      <section className="mt-12">
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
