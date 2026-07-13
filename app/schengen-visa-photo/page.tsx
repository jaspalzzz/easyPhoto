import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { CountrySpecificationProvenance } from "@/components/site/SpecificationProvenance";

const spec = COUNTRY_SPECS["schengen"]!;

export const metadata = pageMetadata({
  title: "Schengen Visa Photo Requirements 2026 — Free Maker (All 29 Countries)",
  description:
    "Official Schengen visa photo requirements: 35×45mm, light grey background, ICAO standard. Works for all 29 Schengen countries. Free, nothing uploaded.",
  path: "/schengen-visa-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What size is a Schengen visa photo?",
    a: "35×45mm, following the ICAO biometric standard, with the face (chin to crown) measuring 32–36mm and filling roughly 70–80% of the frame.",
  },
  {
    q: "What background does a Schengen visa photo need?",
    a: "A plain light grey background is the universally safe choice. Some states accept white (e.g. France), but Switzerland requires grey and rejects white. Light grey satisfies all 29 Schengen countries.",
  },
  {
    q: "Does the same photo work for all Schengen countries?",
    a: "Yes. The ICAO standard is shared across all 29 Schengen member states (including Bulgaria and Romania which joined in 2025). One compliant 35×45mm light-grey photo is accepted at every consulate.",
  },
  {
    q: "Are glasses allowed in a Schengen visa photo?",
    a: "No. The ICAO biometric standard requires glasses to be removed. Both eyes must be clearly visible, open, and looking directly at the camera.",
  },
  {
    q: "How recent does a Schengen visa photo need to be?",
    a: "Most Schengen consulates require the photo to have been taken within the last 6 months and to reflect your current appearance.",
  },
  {
    q: "Can I take a Schengen visa photo at home?",
    a: "Yes. Stand against a plain light-grey wall (or a white sheet) in even lighting, take a frontal photo with a neutral expression, and use this maker to apply the correct background, crop to 35×45mm, and size the head to the 32–36mm range.",
  },
  {
    q: "Is a Schengen visa photo the same as a passport photo?",
    a: "The 35×45mm ICAO biometric standard is used for both Schengen visa photos and most EU national passport photos, so the same photo often works for both. Confirm the specific consulate's requirements, as some EU countries have minor variations for their national passports.",
  },
  {
    q: "Which countries are in the Schengen area in 2026?",
    a: "29 countries: Austria, Belgium, Bulgaria, Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, Switzerland. Bulgaria and Romania joined in January 2025.",
  },
];

export default function Page() {
  return (
    <div className="container max-w-3xl py-10 space-y-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Visa Photo", path: "/visa-photo/" },
            { name: "Schengen Visa Photo", path: "/schengen-visa-photo/" },
          ]),
          softwareApplicationSchema({
            name: "Schengen Visa Photo Maker",
            description:
              "Make a compliant Schengen visa photo free — 35×45mm, light grey background, no upload.",
            url: "/schengen-visa-photo/",
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/visa-photo/" className="hover:text-foreground">Visa Photo</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">Schengen</span>
      </nav>

      <header className="space-y-3">
        <span className="eyebrow block text-brand">Schengen Area — 29 countries</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          Schengen Visa Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          The Schengen visa uses the <strong>ICAO biometric standard: 35×45mm, light grey
          background</strong>, face filling 70–80% of the frame. This single standard applies to all
          29 member states. One compliant photo works for Germany, France, Italy, Spain,
          Switzerland and every other Schengen country.
        </p>
      </header>

      {/* CTA block */}
      <div className="rounded-xl border border-brand/20 bg-brand-soft/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Make your Schengen visa photo free</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
            GDPR-safe — your photo is never uploaded. Works for all 29 Schengen countries.
          </p>
        </div>
        <Link
          href="/schengen-visa-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Spec table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Official Schengen visa photo specification</h2>
        <dl className="divide-y divide-hairline rounded-lg border border-hairline">
          {[
            ["Size", "35 × 45 mm"],
            ["Head height", "32–36 mm chin to crown"],
            ["Head fill", "70–80% of the photo frame"],
            ["Background", "Plain light grey (universally safe; white rejected by some states)"],
            ["Expression", "Neutral, mouth closed, eyes open"],
            ["Glasses", "Not permitted (ICAO standard)"],
            ["Digital (approx. @300 DPI)", "~413 × 531 px"],
            ["Standard", "ICAO Doc 9303 (EU Visa Code Art. 13(4))"],
            ["Recency", "Within the last 6 months"],
            ["Min DPI (print)", "300 DPI"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
              <dt className="text-ink-soft shrink-0">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <CountrySpecificationProvenance spec={spec} />
      </section>

      {/* Sections */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Why light grey — not white — background</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Schengen area adopts the ICAO biometric standard, which specifies a plain, light
            background. Most consulates recommend or require light grey. The key exception is
            Switzerland, which explicitly requires a grey background and{" "}
            <strong>rejects pure white</strong>. France technically accepts white but recommends
            grey. Since one photo should work across all 29 member states, using light grey is the
            universally safe approach. This maker applies light grey by default.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">How to take a Schengen visa photo at home</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Find a plain light-coloured wall (or use a white or grey sheet) in good, even light.
            Natural daylight from a window works well — avoid harsh direct flash that creates a
            shadow behind your head. Stand a few feet from the wall, take the photo at eye level
            with a neutral expression, and remove glasses. Use the maker to apply the correct light
            grey background, crop to 35×45mm, and automatically size your head to the required
            32–36mm chin-to-crown range.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Schengen photo for Indian visa applicants</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Indian nationals applying for a Schengen visa — whether for tourism, business, or
            study — need the Schengen photo requested by the destination authority.
            An Indian passport renewal abroad follows separate Indian-mission
            instructions; the current umbrella ICAO guidance specifies a 630×810
            px white-background photograph with 80–85% face coverage. If you are
            handling both applications, do not reuse one output without checking
            both authorities. Use this maker for the Schengen photo and the{" "}
            <Link href="/india-passport-photo-maker/" className="text-brand hover:underline">
              India passport maker
            </Link>{" "}
            only when the Indian mission&apos;s instructions call for that preset.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">The 29 Schengen countries in 2026</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            As of January 2025, the Schengen area has 29 member states: Austria, Belgium, Bulgaria,
            Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland,
            Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland,
            Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, and Switzerland. Bulgaria and
            Romania joined in January 2025. The same ICAO photo standard applies in every state.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Privacy — no upload, GDPR-safe</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            All processing runs in your browser. Your photo is never sent to any server, never
            stored, and never shared. This is important for visa photos, which contain biometric
            data. Under GDPR, processing personal biometric data on a server requires explicit
            consent and data-handling safeguards — this tool avoids the issue entirely by keeping
            all processing on your device.
          </p>
        </div>
      </section>

      <section>
        <Faq items={FAQ_ITEMS} noSchema />
      </section>

      <div className="rounded-lg border border-hairline bg-paper p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Ready to make your photo?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Free, instant, 100% in-browser. Light grey background applied. Works for all 29 Schengen countries.
          </p>
        </div>
        <Link
          href="/schengen-visa-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <StickyCtaBar
        href="/schengen-visa-photo-maker/"
        label="Make your Schengen visa photo free"
        sublabel="100% on-device · never uploaded"
      />
    </div>
  );
}
