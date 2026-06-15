import Link from "next/link";
import { COUNTRY_SPECS, LAUNCH_ORDER, effectivePrintMm } from "@/lib/countrySpecs";
import { makerPagesByKind, makerSpec, primaryMakerPath } from "@/lib/makerPages";
import { HeroStarter } from "@/components/site/HeroStarter";
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
  // Size-by-country list must match the picker above: the visa hub lists visa
  // maker pages; the passport hub lists EVERY launch country (each → its primary
  // maker), not just the handful with a bespoke passport page.
  const sizeByCountry =
    kind === "visa"
      ? makerPagesByKind("visa").map((m) => {
          const spec = makerSpec(m.slug)!;
          return { key: m.slug, flag: m.flag, label: spec.label, href: `/${m.slug}/`, mm: effectivePrintMm(spec) };
        })
      : LAUNCH_ORDER.map((id) => {
          const spec = COUNTRY_SPECS[id];
          return { key: id, flag: id, label: spec.label, href: primaryMakerPath(id), mm: effectivePrintMm(spec) };
        });

  return (
    <div className="container max-w-4xl py-10">
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

      <header className="space-y-3 text-center">
        <span className="eyebrow">{kind === "passport" ? "Passport" : "Visa"} photo bureau</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{h1}</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">{intro}</p>
      </header>

      <div className="mx-auto mt-8 max-w-2xl">
        <HeroStarter kind={kind} />
      </div>

      <section className="mt-14">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            {kind === "passport" ? "Passport" : "Visa"} photo size by country
          </h2>
          <span className="eyebrow hidden sm:block">Official specifications</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sizeByCountry.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="ep-card flex items-center gap-3 p-4"
            >
              <Flag country={c.flag} className="h-7 w-10 shrink-0 rounded-[3px] ring-1 ring-hairline" />
              <span className="text-sm font-semibold text-ink">{c.label}</span>
              <span className="spec ml-auto normal-case tracking-[0.08em]">
                {c.mm.width}×{c.mm.height}mm
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
