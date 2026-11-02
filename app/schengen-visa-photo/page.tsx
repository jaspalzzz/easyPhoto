import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, type Crumb } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { CountrySpecificationProvenance } from "@/components/site/SpecificationProvenance";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const spec = COUNTRY_SPECS["schengen"]!;

export const metadata = pageMetadata({
  title: "Schengen Visa Photo Requirements 2026 — Free Maker",
  description:
    "Schengen visa photo requirements: 35×45mm, ICAO standard, and where Germany, France, the Netherlands and Italy differ on background and head size. Free, nothing uploaded.",
  path: "/schengen-visa-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Does the same photo work for every Schengen country?",
    a: "Not always. The 35×45mm frame is shared, but the Netherlands asks for a smaller head and missions differ on the background shade, so a photo made for one country can need redoing for another. Check the sheet for the mission handling your application.",
  },
  {
    q: "Is a Schengen visa photo the same as a passport photo?",
    a: "Many EU countries also use 35×45mm for national passports, but each sets its own passport rules. Check them separately rather than reusing a visa photo.",
  },
];

export default function Page() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Visa Photo", path: "/visa-photo/" },
    { name: "Schengen Visa Photo", path: "/schengen-visa-photo/" },
  ];

  return (
    <div className="container max-w-3xl py-10 space-y-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: "Schengen Visa Photo Maker",
            description:
              "Prepare a Schengen visa photo at 35×45mm in your browser; confirm the destination consulate's current instructions.",
            url: "/schengen-visa-photo/",
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3">
        <span className="eyebrow block text-brand">Schengen Area — 29 countries</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          Schengen Visa Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          Schengen visa photos follow the <strong>ICAO biometric standard: 35×45mm</strong>, with the
          face filling 70–80% of the frame, as the EU Visa Code requires. Each member state&apos;s
          mission publishes its own background and framing details, so check the sheet for the
          consulate handling your application.
        </p>
      </header>

      {/* The Schengen maker URL now redirects here, so the tool lives on this page. */}
      <section id="maker" className="scroll-mt-20">
        <PhotoTool spec={spec} />
      </section>

      {/* Spec table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Schengen visa photo requirements</h2>
        <dl className="divide-y divide-hairline rounded-lg border border-hairline">
          {[
            ["Size", "35 × 45 mm"],
            ["Head height", "32–36 mm chin to crown"],
            ["Head fill", "70–80% of the photo frame"],
            ["Background", "Plain and light; the shade is set by each mission"],
            ["Expression", "Neutral, mouth closed, eyes open"],
            ["Glasses", "Best removed; Germany allows them only for medical reasons"],
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
          <h2 className="text-lg font-semibold">Where member states differ</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Germany&apos;s sample sheet sets a contrast rule: one bright colour, ideally neutral grey,
            that stands out from your face and hair. It does not rule out white. France asks for a
            plain light-coloured background and allows a width from 35 to 40 mm. The Netherlands
            applies its own national rules to visa applications: for anyone aged 11 or over the head is
            26–30 mm from chin to crown, smaller than the 32–36 mm used elsewhere, on light grey, light blue or white.
            Italy&apos;s visa centre operator asks for a white background and accepts 30×40 or
            35×45 mm.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The maker&apos;s Schengen setting starts with light grey and sizes the head to 32–36 mm.
            Change the background if your mission&apos;s sheet asks for another shade; for a Dutch
            application the head size is too large, so follow the Dutch rules instead.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">How to take a Schengen visa photo at home</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Find a plain light-coloured wall (or use a white or grey sheet) in good, even light.
            Natural daylight from a window works well — avoid harsh direct flash that creates a
            shadow behind your head. Stand a few feet from the wall, take the photo at eye level
            with a neutral expression, and remove glasses. Then use the maker to set the background,
            crop to 35×45mm and size your head.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">The 29 Schengen countries in 2026</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            As of January 2025, the Schengen area has 29 member states: Austria, Belgium, Bulgaria,
            Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland,
            Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland,
            Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, and Switzerland. Bulgaria and
            Romania joined in January 2025.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Privacy — nothing is uploaded</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            All processing runs in your browser. Your photo is never sent to any server, never
            stored, and never shared, which matters for a visa photo of your face.
          </p>
        </div>
      </section>

      <section>
        <Faq items={FAQ_ITEMS} noSchema />
      </section>

      <StickyCtaBar
        href="#maker"
        label="Make your Schengen visa photo free"
        sublabel="100% on-device · never uploaded"
      />
    </div>
  );
}
