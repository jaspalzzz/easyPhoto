import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { COUNTRY_SPECS, effectivePrintMm } from "@/lib/countrySpecs";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { kbPath } from "@/lib/kbTargets";
import { Faq, type FaqItem } from "@/components/site/Faq";

/**
 * Baby / infant passport photo landing page.
 * ------------------------------------------
 * The passport photo rules for a baby are the same as for an adult — what's
 * hard is the *technique* (eyes open, no hands/pacifier, lying on a white
 * sheet). So this is the existing India passport engine wrapped in baby-specific
 * guidance + FAQ, targeting "baby / infant / newborn passport photo" queries.
 * Other countries link out to their own maker pages (same engine).
 */

const spec = COUNTRY_SPECS["india"];
const mm = effectivePrintMm(spec);

export const metadata = pageMetadata({
  title: "Baby & Infant Passport Photo Maker — Free, At Home",
  description:
    "Make a compliant baby passport photo at home, free. Lay baby on a white " +
    "sheet, upload, and we crop to size and clean the background — nothing is " +
    "uploaded.",
  path: "/baby-passport-photo/",
});

const OTHER_COUNTRIES: { label: string; href: string }[] = [
  { label: "United States", href: "/us-passport-photo-maker/" },
  { label: "United Kingdom", href: "/uk-passport-photo-maker/" },
  { label: "Canada", href: "/canada-passport-photo-maker/" },
  { label: "Australia", href: "/australia-passport-photo-maker/" },
];

const STEPS: { h: string; p: string }[] = [
  {
    h: "1. Lay the baby on a plain white sheet",
    p: "Put your baby on their back on a smooth, plain white sheet or blanket. The sheet doubles as the white background, which removes the hardest part — getting a clean, even backdrop behind a child who can't sit still.",
  },
  {
    h: "2. Shoot from directly above",
    p: "Hold the camera straight over the baby's face, not at an angle, so the photo looks like a normal front-facing portrait. Use soft, even daylight and avoid harsh shadows or wrinkles in the sheet.",
  },
  {
    h: "3. Catch open eyes and a calm face",
    p: "Eyes should be open and looking towards the camera, with a neutral, closed-mouth expression. Newborns are tricky — take lots of shots and pick the best one. No hands, arms, toys, pacifiers or straps may be visible.",
  },
  {
    h: "4. Upload and let the tool finish it",
    p: `Drop your chosen photo here. We crop to the exact ${mm.width}×${mm.height}mm head-size and apply a clean, compliant white background, then check it before you download.`,
  },
];

const BABY_FAQS: FaqItem[] = [
  {
    q: "What size is a baby's passport photo?",
    a: `A baby's passport photo is the same size as an adult's — for India it's ${mm.width}×${mm.height}mm on a plain white background. There is no separate "baby size". This tool crops to the exact dimensions for you.`,
  },
  {
    q: "Can my baby's eyes be closed?",
    a: "No. Like adults, infants must have their eyes open and visible, looking towards the camera. For newborns this is the hardest part — take many photos and pick the one with open eyes and a calm expression.",
  },
  {
    q: "Can I hold my baby for the photo?",
    a: "No hands, arms, fingers or supports may appear in the frame. The easiest way is to lay the baby on their back on a plain white sheet and photograph from directly above, so no one needs to hold them in shot.",
  },
  {
    q: "Does my baby need to have a neutral expression?",
    a: "A neutral, closed-mouth expression is ideal. Authorities are more lenient with very young infants, but avoid a wide-open mouth, and there should be no pacifier, toys or other people in the photo.",
  },
  {
    q: "Is this baby passport photo tool free and private?",
    a: "Yes. It is completely free, with no watermark and no sign-up. Your baby's photo is processed entirely in your browser and is never uploaded to any server.",
  },
];

export default function BabyPassportPhotoPage() {
  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Passport Photo Maker", path: "/passport-photo/" },
            { name: "Baby & infant passport photo", path: "/baby-passport-photo/" },
          ]),
          softwareApplicationSchema({
            name: "Baby & Infant Passport Photo Maker",
            description:
              "Make a compliant baby or infant passport photo at home — exact size, clean white background, compliance-checked, free and private.",
            url: "/baby-passport-photo/",
          }),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/passport-photo/" className="hover:text-foreground">
          Passport Photo Maker
        </Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">Baby &amp; infant</span>
      </nav>

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          Baby &amp; Infant Passport Photo Maker
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          A baby can&apos;t pose on command — so take the photo the easy way. Lay
          your little one on a plain white sheet, snap from above, and this tool
          crops to the exact passport size and cleans up the background. Free,
          and fully in your browser.
        </p>
        <div className="spec flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
          <span>
            {mm.width}×{mm.height}mm
          </span>
          <span className="text-ink-faint">/</span>
          <span>Plain white background</span>
          <span className="text-ink-faint">/</span>
          <span>Eyes open, no hands in frame</span>
        </div>
      </header>

      <PhotoTool spec={spec} />

      {/* The real value: how to take a baby's photo so it passes */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">
          How to take a baby&apos;s passport photo at home
        </h2>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.h} className="space-y-1.5">
              <h3 className="text-sm font-semibold">{s.h}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.p}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Want the full walk-through with examples?{" "}
          <Link
            href="/blog/baby-and-infant-passport-photo-guide/"
            className="text-brand hover:underline"
          >
            Read the baby &amp; infant passport photo guide
          </Link>
          .
        </p>
      </section>

      {/* Other countries — same engine, different spec */}
      <section className="space-y-3">
        <h2 className="eyebrow">Baby passport photo for another country</h2>
        <p className="text-sm text-muted-foreground">
          This page uses the India 35×45mm specification. Making a baby passport
          photo elsewhere? The same steps apply — pick your country:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {OTHER_COUNTRIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* File-size help — interlink the KB resize tools */}
      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Need the photo under a file-size limit?
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          If the application portal caps the upload size, compress the finished
          photo to an exact KB target. Your image stays in your browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[20, 50, 100].map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
            >
              Resize to {kb} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft/50"
          >
            Custom size
          </Link>
        </div>
      </section>

      <section>
        <Faq items={BABY_FAQS} />
      </section>
    </div>
  );
}
