import Link from "next/link";
import { ExternalLink, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const spec = COUNTRY_SPECS["canada"]!;

export const metadata = pageMetadata({
  title: "Canada Passport Photo Requirements 2026 — Free Maker (Visa, PR, Renewal)",
  description:
    "Canada visa, PR, Express Entry and online passport renewal photo: 35×45mm, white background. Make a compliant photo free — nothing uploaded. IRCC-spec, instant.",
  path: "/canada-passport-photo/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What size is a Canadian passport photo?",
    a: "For the printed passport booklet: 50×70mm (unique to Canada). For visas, PR, Express Entry, study/work permits and online passport renewal: 35×45mm on a white background. The 35×45mm is the digital-application standard.",
  },
  {
    q: "What is the background colour for a Canada passport photo?",
    a: "A plain white or light-coloured, uniform background with no shadows, patterns or objects. The lighting must be even with no shadows falling on the face or background.",
  },
  {
    q: "Can I use this maker for the Canadian passport booklet?",
    a: "No. The printed Canadian passport booklet requires a certified commercial photographer and a guarantor signature on the back — which a self-serve tool cannot provide. This maker is for Canada visas, PR/Express Entry, study permits, work permits and the online passport renewal portal (all 35×45mm).",
  },
  {
    q: "What photo do I need for Express Entry or PR?",
    a: "A 35×45mm photo on a plain white or light background, with the head measuring 31–36mm from chin to crown. This maker produces the correct size and applies a compliant white background.",
  },
  {
    q: "Can I upload a digital photo for Canada's online passport renewal?",
    a: "Yes. The IRCC online passport renewal portal accepts a digital photo upload (JPEG, 240 KB – 5 MB). Make the photo here, and compress it with the resize-to-KB tool if the portal has a stricter cap.",
  },
  {
    q: "Are glasses allowed in a Canadian passport photo?",
    a: "Glasses are permitted only if there is no glare on the lenses and your eyes are fully visible and clearly readable. Removing them is strongly recommended to avoid rejection.",
  },
  {
    q: "Can Indians in Canada use this for an Indian passport renewal?",
    a: "Yes. For renewing an Indian passport through the Indian Consulate in Canada, you need an Indian-spec photo (35×45mm, plain white background). The Indian passport maker produces the correct format. For your Canadian permit or PR, use this Canada maker instead.",
  },
  {
    q: "How recent does a Canadian passport or visa photo need to be?",
    a: "Photos must be recent (generally within 6 months) and reflect your current appearance. Significant changes in appearance (new glasses, major haircut, weight change) require a new photo.",
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
            { name: "Canada Passport Photo", path: "/canada-passport-photo/" },
          ]),
          softwareApplicationSchema({
            name: "Canada Passport Photo Maker",
            description:
              "Make a compliant Canada visa/PR/renewal photo free — 35×45mm, white background, no upload.",
            url: "/canada-passport-photo/",
          }),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/passport-photo/" className="hover:text-foreground">Passport Photo</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">Canada</span>
      </nav>

      <header className="space-y-3">
        <span className="eyebrow block text-brand">Canada</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
          Canada Passport Photo Requirements 2026
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          Canada uses a <strong>35×45mm photo on a plain white background</strong> for visas, PR,
          Express Entry, study/work permits and the online passport renewal portal. The physical
          passport booklet uses a unique 50×70mm format requiring a certified photographer.
        </p>
      </header>

      {/* Advisory banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Printed passport booklet:</strong> requires a commercial photographer and a guarantor
          signature — not a self-serve tool. This maker covers Canada visas, PR/Express Entry,
          study &amp; work permits, and online passport renewal (all 35×45mm).
        </p>
      </div>

      {/* CTA block */}
      <div className="rounded-xl border border-brand/20 bg-brand-soft/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Make your Canada photo free</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
            100% on-device — your photo is never uploaded. No sign-up.
          </p>
        </div>
        <Link
          href="/canada-passport-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Spec table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Canada photo specifications</h2>
        <dl className="divide-y divide-hairline rounded-lg border border-hairline">
          {[
            ["Visa / PR / Permit size", "35 × 45 mm"],
            ["Passport booklet size", "50 × 70 mm (requires certified photographer)"],
            ["Head height", "31–36 mm chin to crown"],
            ["Background", "Plain white or light-coloured, no shadows"],
            ["Expression", "Neutral, mouth closed"],
            ["Glasses", "Allowed if no glare and eyes fully visible (removing is safest)"],
            ["Digital (IRCC online)", "JPEG, 240 KB – 5 MB"],
            ["Recency", "Within the last 6 months"],
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
            canada.ca/passports/photos <ExternalLink className="h-3 w-3" />
          </a>{" "}
          — verified June 2026.
        </p>
      </section>

      {/* Sections */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">What this photo covers (and what it doesn't)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A 35×45mm white-background photo satisfies IRCC requirements for Canadian visitor visas,
            study permits, work permits, PR card renewals, Express Entry applications, citizenship
            applications, and the IRCC online passport renewal portal. It does <em>not</em> cover
            the physical passport booklet, which IRCC requires to be produced by a commercial
            photographer who certifies the photo while a guarantor signs the back of the print.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Online IRCC portal photo upload</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The IRCC online application portal accepts digital photos as JPEG files between 240 KB
            and 5 MB. Make the photo here, then if you need a smaller file, use the{" "}
            <Link href="/tools/resize-kb/" className="text-brand hover:underline">
              compress to KB tool
            </Link>{" "}
            to hit the portal limit while keeping the photo sharp. Always confirm the current file
            size cap on your specific IRCC application page before submitting, as digital limits
            can differ by application stream.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Canada photo for Indians in Canada</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Indian nationals in Canada often need two different photos simultaneously: a Canadian
            photo (35×45mm, white background) for their IRCC application or PR card, and an Indian
            passport photo (35×45mm, plain white background, 80–85% face coverage) for renewing
            their Indian passport through the Indian Consulate or VFS Global. Both formats use the
            same 35×45mm size but differ in head coverage rules. Use the{" "}
            <Link href="/canada-passport-photo-maker/" className="text-brand hover:underline">Canada maker</Link>{" "}
            for IRCC documents and the{" "}
            <Link href="/india-passport-photo-maker/" className="text-brand hover:underline">India maker</Link>{" "}
            for Indian passport renewals.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Privacy — processed entirely on your device</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your photo is processed entirely in your browser. It is never uploaded to a server,
            never stored, and never seen by anyone other than you. Background removal, head
            detection, cropping and resizing all run locally. This is the right approach for
            biometric document photos.
          </p>
        </div>
      </section>

      <section>
        <Faq items={FAQ_ITEMS} />
      </section>

      <div className="rounded-lg border border-hairline bg-paper p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Ready to make your photo?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Free, instant, 100% in-browser. White background applied automatically.
          </p>
        </div>
        <Link
          href="/canada-passport-photo-maker/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors shrink-0"
        >
          Open maker <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
