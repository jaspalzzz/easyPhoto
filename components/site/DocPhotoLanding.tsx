import Link from "next/link";
import { effectivePrintMm } from "@/lib/countrySpecs";
import { makerPagesByKind, makerSpec } from "@/lib/makerPages";
import { HeroStarter } from "@/components/site/HeroStarter";
import { Flag } from "@/components/site/Flag";
import { TrustStrip } from "@/components/site/TrustStrip";
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
  const pages = makerPagesByKind(kind);

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
          {pages.map((m) => {
            const spec = makerSpec(m.slug)!;
            const mm = effectivePrintMm(spec);
            return (
              <Link
                key={m.slug}
                href={`/${m.slug}/`}
                className="ep-card flex items-center gap-3 p-4"
              >
                <Flag country={m.flag} className="h-7 w-10 shrink-0 rounded-[3px] ring-1 ring-hairline" />
                <span className="text-sm font-semibold text-ink">{spec.label}</span>
                <span className="spec ml-auto normal-case tracking-[0.08em]">
                  {mm.width}×{mm.height}mm
                </span>
              </Link>
            );
          })}
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

      <section className="mt-12">
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
