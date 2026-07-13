import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { CountrySpecificationProvenance } from "@/components/site/SpecificationProvenance";

const spec = COUNTRY_SPECS["uk"]!;

export const metadata = pageMetadata({
  title: "UK Passport Photo Requirements 2026 — Free Online Maker",
  description:
    "Official UK passport photo requirements: 35×45mm, light grey or cream background (NOT white). Make a compliant photo free — nothing uploaded, GDPR-safe.",
  path: "/uk-passport-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What size is a UK passport photo?",
    a: "35×45mm, with the head measuring 29–34mm from chin to crown. The photo must be in colour, taken within the last month, and correctly lit with no shadows.",
  },
  {
    q: "What background colour does a UK passport photo need?",
    a: "A plain light grey or cream background — NOT white. Pure white is one of the most common reasons UK passport photos are rejected by HM Passport Office.",
  },
  {
    q: "Why does a UK passport photo need a grey background?",
    a: "HM Passport Office requires a plain, pale grey or cream background for biometric photo processing. White backgrounds can wash out against fair skin and cause automated checks to fail.",
  },
  {
    q: "Can I take a UK passport photo at home?",
    a: "Yes. Stand against a plain light-coloured wall (or use a light grey sheet) in good, even lighting, take a front-facing photo, then use this maker to set the correct 35×45mm size and background.",
  },
  {
    q: "Can I upload a digital photo for my UK passport online?",
    a: "Yes. The gov.uk online application accepts a digital photo: at least 600×750 pixels, between 50 KB and 10 MB, saved as JPEG. The photo code you receive is entered during the application.",
  },
  {
    q: "Are glasses allowed in a UK passport photo?",
    a: "Generally no. Glasses must be removed unless you have a medical exemption. There must be no glare, and your eyes must be fully visible and open.",
  },
  {
    q: "Does a UK passport photo need to be recent?",
    a: "Yes. It must have been taken within the last month and show your current appearance. For children, the photo is typically valid for 5 years; for adults, 10 years.",
  },
  {
    q: "Can I use the same photo for a UK visa (UKVI)?",
    a: "Yes. UK Visas and Immigration follows the same 35×45mm light background specification. Use this maker, and the resulting photo works for both a passport and most UK visa applications.",
  },
];

export default function Page() {
  return (
    <div className="container max-w-3xl py-10 space-y-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Passport Photo", path: "/passport-photo/" },
            { name: "UK Passport Photo", path: "/uk-passport-photo/" },
          ]),
          softwareApplicationSchema({
            name: "UK Passport Photo Maker",
            description:
              "Make a compliant UK passport photo free — 35×45mm, light grey background, no upload.",
            url: "/uk-passport-photo/",
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/passport-photo/" className="hover:text-foreground">Passport Photo</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">UK</span>
      </nav>

      <header className="space-y-3">
        <span className="eyebrow block text-brand">United Kingdom</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          UK Passport Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          HM Passport Office requires a <strong>35×45mm photo on a light grey or cream background</strong> —
          not white. The head must measure 29–34mm chin to crown, with a neutral expression and no
          glasses. This is the most frequently misunderstood requirement, and it is the top rejection reason.
        </p>
      </header>

      {/* CTA block */}
      <div className="rounded-xl border border-brand/20 bg-brand-soft/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Make your UK passport photo free</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
            GDPR-safe — your photo is never uploaded. No sign-up.
          </p>
        </div>
        <Link
          href="/uk-passport-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Spec table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Official UK passport photo specification</h2>
        <dl className="divide-y divide-hairline rounded-lg border border-hairline">
          {[
            ["Size", "35 × 45 mm"],
            ["Head height", "29–34 mm chin to crown"],
            ["Head fill", "65–75% of the photo frame"],
            ["Background", "Plain light grey or cream — NOT white"],
            ["Expression", "Neutral, mouth closed, eyes open"],
            ["Glasses", "Not permitted (remove unless medically necessary)"],
            ["Digital size (online)", "Min 600 × 750 px, 50 KB – 10 MB, JPEG"],
            ["Recency", "Taken within the last month"],
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
          <h2 className="text-lg font-semibold">The grey background rule — the most common rejection</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Many people assume passport photos need a white background — that is the US and Indian
            standard — but UK HM Passport Office specifically requires{" "}
            <strong>plain light grey or cream</strong>. Pure white is explicitly listed as a reason
            photos are rejected. A light grey background also works better with biometric face
            detection, particularly for lighter skin tones where white backgrounds reduce contrast.
            This maker applies the correct light cream/grey background for you automatically.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">How to take a UK passport photo at home</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Use a plain light-coloured wall in good, even indoor lighting. Natural daylight from a
            window to one side works well — avoid direct flash which creates shadows behind your
            head. Stand about 50 cm from the wall so your shadow does not fall on the background.
            Take the photo straight on at eye level. Remove glasses. Use this maker to apply the
            correct background, crop to 35×45mm, and size the head to the 29–34mm band.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Online vs. printed UK passport photo</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            When applying online at gov.uk you can upload a digital photo directly and receive a
            photo code to enter in the application. The digital photo needs to be at least 600×750
            pixels and between 50 KB and 10 MB as a JPEG. For a printed photo (e.g. when using a
            countersignatory), the photo is 35×45mm printed on photo paper. The maker creates a
            correctly sized digital file you can upload directly or print at a pharmacy.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Privacy — GDPR-safe, no uploads</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            All photo processing happens entirely in your browser. Your photo is never sent to any
            server and is not stored. This is especially important for passport and identity document
            photos containing biometric data. Under GDPR, you should be cautious about services
            that upload your photo to process it server-side. This tool has no server-side
            processing at all.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">UK passport photo for Indians in the UK</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If you are an Indian national living in the UK and need to renew your Indian passport
            through an Indian mission or its service provider, use that mission&apos;s
            current filing instructions. The overseas Indian passport workflow is
            separate from the UK passport specification and currently links to
            630×810 px ICAO photograph guidance. Do not reuse the UK crop without
            checking the mission&apos;s requested submission method. The{" "}
            <Link href="/uk-passport-photo-maker/" className="text-brand hover:underline">
              UK maker
            </Link>{" "}
            and{" "}
            <Link href="/india-passport-photo-maker/" className="text-brand hover:underline">
              Indian passport maker
            </Link>{" "}
            expose the two different presets.
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
            Free, instant, 100% in-browser. Light grey background applied automatically.
          </p>
        </div>
        <Link
          href="/uk-passport-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <StickyCtaBar
        href="/uk-passport-photo-maker/"
        label="Make your UK passport photo free"
        sublabel="100% on-device · never uploaded"
      />
    </div>
  );
}
