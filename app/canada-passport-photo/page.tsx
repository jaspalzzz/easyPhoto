import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, type Crumb } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS, specForDocumentKind } from "@/lib/countrySpecs";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { CountrySpecificationProvenance } from "@/components/site/SpecificationProvenance";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const spec = COUNTRY_SPECS["canada"]!;

export const metadata = pageMetadata({
  title: "Canada Passport Photo Requirements 2026 — Free Visa Photo Maker",
  description:
    "Canada visitor visa, study and work permit photo: prepare the 35×45mm photo free in your browser. The printed passport booklet and permanent residence have separate requirements, covered below. Confirm the current IRCC instructions.",
  path: "/canada-passport-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What photo do I need for Express Entry or PR?",
    a: "Not the 35×45mm print on this page. Permanent residence and Express Entry use a digital photograph specified in pixels rather than millimetres. Open the photo requirements inside your own PR application and work to those figures.",
  },
  {
    q: "Can I upload a digital photo for Canada's online passport renewal?",
    a: "Passport renewal is run by the passport programme rather than the temporary-resident stream this page covers, and its photo rules are set by that application. Read the requirements shown in the renewal service before preparing anything, rather than assuming the 35×45mm visitor figure applies.",
  },
];

export default function Page() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Passport Photo", path: "/passport-photo/" },
    { name: "Canada Passport Photo", path: "/canada-passport-photo/" },
  ];

  return (
    <div className="container max-w-3xl py-10 space-y-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: "Canada Passport Photo Maker",
            description:
              "Prepare a Canadian visitor visa, study permit or work permit photo at 35×45mm; confirm the current IRCC instructions.",
            url: "/canada-passport-photo/",
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3">
        <span className="eyebrow block text-brand">Canada</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          Canada Passport Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          A printed Canadian passport booklet takes a 50×70mm photo. For visitor visas, study permits and work permits, IRCC asks for{" "}
          <strong>two identical photos, at least 35×45mm, against a plain white or light-coloured
          background</strong>.
        </p>
      </header>

      {/* Advisory banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Not for the passport booklet:</strong> its photo needs a photographer&apos;s
          certification and a guarantor signature, which a self-serve tool cannot provide.
          Permanent residence, Express Entry and passport renewal each set their own requirements.
        </p>
      </div>

      {/* The Canada visa maker URL now redirects here, so the tool lives on this page. */}
      <section id="maker" className="scroll-mt-20">
        <PhotoTool spec={specForDocumentKind(spec, "visa")} />
      </section>

      {/* Spec table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Canada photo specifications</h2>
        <dl className="divide-y divide-hairline rounded-lg border border-hairline">
          {[
            ["Visitor visa and permit size", "At least 35 × 45 mm"],
            ["Chin to crown", "31–36 mm"],
            ["Background", "Plain white or light-coloured"],
            ["Face", "Neutral look, lips together"],
            ["Glasses", "Non-tinted prescription glasses, eyes clearly visible"],
            ["Age of the photos", "No older than six months"],
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
          <h2 className="text-lg font-semibold">Applying online</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            IRCC&apos;s photo specification is written for printed photos. It says a digital photo
            must not be altered in any way, so take yours against a plain white or light wall instead
            of relying on a replaced background. It gives no file-size limit either: follow the size
            your online application shows, and if it states one, our{" "}
            <Link href="/tools/resize-kb/" className="text-brand hover:underline">
              KB compressor
            </Link>{" "}
            can bring the file under it.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Your photo stays with you</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The tool above works inside your browser tab. The photo you add for your IRCC
            application, or your child&apos;s, is not sent to us or kept anywhere once you close
            the page.
          </p>
        </div>
      </section>

      <section>
        <Faq items={FAQ_ITEMS} noSchema />
      </section>

      <StickyCtaBar
        href="#maker"
        label="Open the Canada photo tool"
        sublabel="Works in your browser"
      />
    </div>
  );
}
