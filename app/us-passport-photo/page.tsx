import Link from "next/link";
import { ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";

const spec = COUNTRY_SPECS["us"]!;

export const metadata = pageMetadata({
  title: "US Passport Photo Requirements 2026 — Free 2×2 Photo Maker",
  description:
    "Official US passport photo requirements: 2×2 inch (51×51mm), white background, no glasses. Make a compliant photo free — nothing uploaded. Save $17 vs Walgreens.",
  path: "/us-passport-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What size is a US passport photo?",
    a: "Exactly 2×2 inches (51×51mm), square, in colour, taken within the last six months. The head must measure between 1 and 1⅜ inches (25–35mm) from chin to the top of the head.",
  },
  {
    q: "What background colour does a US passport photo need?",
    a: "A plain white or off-white background with no shadows, patterns or objects behind you. Do not use a blue, grey or off-colour background — it will be rejected.",
  },
  {
    q: "Are glasses allowed in a US passport photo?",
    a: "No. The US Department of State stopped accepting glasses in passport photos in November 2016. Remove glasses for your photo, even if you wear them daily.",
  },
  {
    q: "Can I take a US passport photo at home?",
    a: "Yes. Use a white wall or sheet as your background, take the photo in natural light (no harsh shadows), then use this tool to crop and size it to the exact 2×2 inch spec for free.",
  },
  {
    q: "How much does a US passport photo cost at Walgreens or CVS?",
    a: "Walgreens and CVS charge $16.99–$17.99 for two 2×2 inch prints. Taking your own and printing at home or a pharmacy kiosk from a file costs $0.25–$0.50 per print.",
  },
  {
    q: "Can I print a US passport photo at home?",
    a: "Yes. The State Department accepts home-printed photos on photo paper. Download the 4×6 print sheet from the maker, print on gloss photo paper, and cut to 2×2 inches.",
  },
  {
    q: "What is the file size for a US passport online renewal photo?",
    a: "The online renewal uploader accepts JPEG (and PNG/HEIC) images between 54 KB and 10 MB, at least 600×600 pixels and no larger than 1200×1200 pixels.",
  },
  {
    q: "Can I use a US passport photo for the DS-160 visa application?",
    a: "Yes. The DS-160 uses the same 2×2 inch square composition on a white background. The digital upload requires a JPEG under 240 KB and at least 600×600 pixels.",
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
            { name: "US Passport Photo", path: "/us-passport-photo/" },
          ]),
          softwareApplicationSchema({
            name: "US Passport Photo Maker",
            description:
              "Make a compliant US passport photo free — 2×2 inch, white background, no upload.",
            url: "/us-passport-photo/",
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/passport-photo/" className="hover:text-foreground">Passport Photo</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">US</span>
      </nav>

      <header className="space-y-3">
        <span className="eyebrow block text-brand">United States</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          US Passport Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          The US Department of State requires a <strong>2×2 inch (51×51mm) square photo</strong> on
          a plain white or off-white background, taken within six months. No glasses. Your head
          must fill 50–69% of the frame.
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
        <h2 className="text-lg font-semibold">Official US passport photo specification</h2>
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
            ["DS-160 digital upload", "Square, min 600 × 600 px, JPEG, under 240 KB"],
            ["Recency", "Taken within the last 6 months"],
            ["Min DPI (print)", "300 DPI"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
              <dt className="text-ink-soft shrink-0">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-ink-faint">
          Source:{" "}
          <a
            href={spec.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline inline-flex items-center gap-0.5"
          >
            travel.state.gov <ExternalLink className="h-3 w-3" />
          </a>{" "}
          — verified June 2026.
        </p>
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
          <h2 className="text-lg font-semibold">Save $17 vs Walgreens or CVS</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Walgreens charges $16.99 and CVS charges $17.99 for two 2×2 inch passport prints. With
            a free tool and a home printer plus photo paper, the same two prints cost under $0.50.
            Alternatively, take the finished file to a pharmacy kiosk and print a 4×6 sheet for
            $0.25–$0.39 (cut out two 2×2 prints). The tool produces both a single 2×2 image and a
            4×6 print sheet so you get two prints from one sheet with no waste.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Common US passport photo rejection reasons</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The State Department rejects photos for: shadows on the face or background; head too
            large (over 69% of the frame) or too small (under 50%); wearing glasses; a non-neutral
            expression; background that is not plain white; the photo being older than six months or
            taken when your appearance has significantly changed; and photo paper that is visibly
            glossy and creased. The free maker automatically corrects the two most common issues —
            head size and background colour — so you can focus on the remaining checklist items.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">US passport photo for online renewal</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The online passport renewal portal (available to most adults renewing since 2002) accepts
            a digital photo upload instead of a printed photo. You will need a JPEG, PNG, or HEIC
            image that is at least 600×600 pixels and no larger than 1200×1200 pixels, between 54 KB
            and 10 MB. The maker produces a correctly sized file. If the portal needs a smaller file,
            use the{" "}
            <Link href="/tools/resize-kb/" className="text-brand hover:underline">
              compress to KB tool
            </Link>{" "}
            to bring it under the cap without visible quality loss.
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
            Free, instant, 100% on-device. Saves as 2×2 inch JPEG and a 4×6 print sheet.
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
