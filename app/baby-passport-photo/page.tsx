import Link from "next/link";
import { COUNTRY_SPECS, effectivePrintMm } from "@/lib/countrySpecs";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { SupportCard } from "@/components/site/SupportCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

/**
 * Baby / infant passport photo landing page.
 * ------------------------------------------
 * The passport photo rules for a baby are the same as for an adult — what's
 * hard is the *technique* (eyes open, no hands/pacifier, lying on a white
 * sheet). So this is the existing India passport engine wrapped in baby-specific
 * guidance + FAQ, targeting "baby / infant / newborn passport photo" queries.
 * Other countries link out to their own maker pages (same engine).
 */

// India's print for a child below four. Its advisory is about adult capture and
// the overseas upload file, neither of which applies to a baby's print.
const spec = { ...COUNTRY_SPECS["india"], advisory: undefined };
const mm = effectivePrintMm(spec);

export const metadata = pageMetadata({
  title: "Baby & Infant Passport Photo Maker — Free, At Home",
  description:
    "Prepare a baby passport photo at home, free. Lay baby on a white " +
    "sheet, upload, and we crop to size and clean the background — nothing is " +
    "uploaded.",
  path: "/baby-passport-photo/",
});

const OTHER_COUNTRIES: { label: string; href: string }[] = [
  { label: "United States", href: "/us-passport-photo-maker/" },
  { label: "United Kingdom", href: "/uk-passport-photo-maker/" },
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
    h: "3. Take lots of shots",
    p: "Newborns are tricky, so take many photos and pick the one with the calmest face, looking towards the camera. Whether the eyes must be open depends on the country (see the questions below). No hands, toys or pacifiers should be visible.",
  },
  {
    h: "4. Upload and let the tool finish it",
    p: `Drop your chosen photo here. We crop to ${mm.width}×${mm.height}mm and apply a clean white background. Check the result against Passport Seva's minor-photo guidance before you print.`,
  },
];

const BABY_FAQS: FaqItem[] = [
  {
    q: "Do my baby's eyes need to be open?",
    a: "It depends on the country. Passport Seva's minor-photo guidance for India asks for open eyes. gov.uk says children under one do not have to have their eyes open for a UK passport photo. For any other country, check its passport office's photo rules.",
  },
  {
    q: "Can I hold my baby for the photo?",
    a: "Your hand must not show in the photo. gov.uk lets you support a baby's head as long as your hand stays out of shot. Laying the baby on a white sheet and shooting from above avoids the problem.",
  },
  {
    q: "Is this baby passport photo tool free and private?",
    a: "Yes. It is completely free, with no watermark and no sign-up. Your baby's photo is processed entirely in your browser and is never uploaded to any server.",
  },
];

export default function BabyPassportPhotoPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Passport Photo Maker", path: "/passport-photo/" },
    { name: "Baby & infant passport photo", path: "/baby-passport-photo/" },
  ];

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: "Baby & Infant Passport Photo Maker",
            description:
              "Prepare a baby's passport photo at India's 35×45mm white-background size in your browser, then confirm the current minor-photo guidance.",
            url: "/baby-passport-photo/",
          }),
          faqSchema(BABY_FAQS),
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[36px]">
          Baby &amp; Infant Passport Photo Maker
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          A baby can&apos;t pose on command — so take the photo the easy way. Lay
          your little one on a plain white sheet, snap from above, and this tool
          crops it to India&apos;s 35×45mm white-background print, which Passport
          Seva asks a child below four to bring. Free, and fully in your browser.
        </p>
        <div className="spec flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
          <span>
            {mm.width}×{mm.height}mm
          </span>
          <span className="text-ink-faint">/</span>
          <span>Plain white background</span>
          <span className="text-ink-faint">/</span>
          <span>No hands in frame</span>
        </div>
      </header>

      <PhotoTool spec={spec} />
      <SupportCard tool="baby-passport-photo" />

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
          Making a baby passport photo for another country? The same steps
          apply — pick your country:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {OTHER_COUNTRIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[14px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Faq items={BABY_FAQS} noSchema />
      </section>
    </div>
  );
}
