import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, type Crumb } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { CountrySpecificationProvenance } from "@/components/site/SpecificationProvenance";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const spec = COUNTRY_SPECS["us"]!;

export const metadata = pageMetadata({
  title: "US Passport Photo Requirements 2026 — Free 2×2 Photo Maker",
  description:
    "US passport photo requirements: prepare the listed 2×2 inch dimensions and white background free in your browser. Confirm the current State Department instructions.",
  path: "/us-passport-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Can I print a US passport photo at home?",
    a: "Yes. Download the 4×6 print sheet from the maker, print it on photo paper, and cut out the 2×2 inch copies.",
  },
];

export default function Page() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Passport Photo", path: "/passport-photo/" },
    { name: "US Passport Photo", path: "/us-passport-photo/" },
  ];

  return (
    <div className="container max-w-3xl py-10 space-y-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: "US Passport Photo Maker",
            description:
              "Prepare a US passport photo at the selected 2×2 inch frame and white background; confirm the current State Department instructions.",
            url: "/us-passport-photo/",
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3">
        <span className="eyebrow block text-brand">United States</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          US Passport Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          The US Department of State requires a <strong>2×2 inch (51×51mm) square photo</strong> on
          a plain white or off-white background. The full list is below.
        </p>
      </header>

      {/* CTA block */}
      <div className="rounded-xl border border-brand/20 bg-brand-soft/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Make your US passport photo free</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
            100% on-device — your photo is never uploaded. No sign-up.
          </p>
        </div>
        <Link
          href="/us-passport-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Spec table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">US passport photo requirements</h2>
        <dl className="divide-y divide-hairline rounded-lg border border-hairline">
          {[
            ["Size", "51 × 51 mm (2 × 2 inches) — square"],
            ["Head height", "25–35 mm chin to crown (1–1⅜ in)"],
            ["Head fill", "50–69% of the photo frame"],
            ["Eye height from bottom", "28–35 mm (1⅛–1⅜ in)"],
            ["Background", "Plain white or off-white, no shadows"],
            ["Expression", "Neutral, mouth closed"],
            ["Glasses", "Not permitted (since Nov 2016)"],
            ["Digital size (renewal)", "600–1200 px square, 54 KB–10 MB, JPEG/PNG/HEIC"],
            ["DS-160 digital upload", "600–1200 px square, JPEG, 240 KB or less"],
            ["Recency", "Taken within the last 6 months"],
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
          <h2 className="text-lg font-semibold">How to take a US passport photo at home</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Stand against a white or very light wall in good, even natural light — avoid direct
            sunlight which creates harsh shadows. Have someone take the photo at eye level, about
            5–6 feet away, with the camera in portrait orientation. Wear your normal daily clothing
            (no uniforms or white tops that blend into the background). No hats unless for
            documented religious reasons. Upload your photo to the free maker above and it will crop
            it to the exact 2×2 inch composition, size your head to within the 25–35 mm band, and
            apply a clean white background.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Compare pharmacy passport-photo prices</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            As checked on 19 July 2026, the official{" "}
            <a
              href="https://photo.walgreens.com/store/prints"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline"
            >
              Walgreens Photo price list
            </a>{" "}
            lists its passport-photo service at $16.99, while the official{" "}
            <a
              href="https://www.cvs.com/photo/passport-photos/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline"
            >
              CVS passport-photo page
            </a>{" "}
            lists two 2×2-inch prints at $17.99. Prices and promotions can change
            by date or location. This tool creates a single 2×2 image and a 4×6
            print sheet; check the current price and print settings at whichever
            home printer, kiosk, or lab you choose.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Common US passport photo rejection reasons</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The State Department rejects photos for: shadows on the face or background; head too
            large (over 69% of the frame) or too small (under 50%); wearing glasses; a non-neutral
            expression; a background that is not plain white; and a photo older than six months or
            taken before your appearance changed significantly. The maker sizes the head and sets
            the background; check the rest yourself before you print.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">US passport photo for online renewal</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Online renewal takes a digital photo instead of a print, at the renewal sizes in the
            table above. If your file is over 10 MB, use the{" "}
            <Link href="/tools/resize-kb/" className="text-brand hover:underline">
              compress to KB tool
            </Link>{" "}
            to bring it under the limit.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Privacy — your photo stays on your device</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Unlike services that upload your photo to a server for processing, this tool runs
            entirely in your browser. Your photo is never sent to any server, never stored, and
            never seen by anyone else. The background removal, head detection, cropping, and resizing
            all happen locally on your device. This matters especially for biometric document photos,
            where privacy and security are significant concerns.
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
            Free and on your device. Saves a 2×2 inch JPEG and a 4×6 print sheet.
          </p>
        </div>
        <Link
          href="/us-passport-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <StickyCtaBar
        href="/us-passport-photo-maker/"
        label="Make your US passport photo free"
        sublabel="100% on-device · never uploaded"
      />
    </div>
  );
}
