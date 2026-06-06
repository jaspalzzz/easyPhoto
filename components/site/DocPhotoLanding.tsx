import Link from "next/link";
import { COUNTRY_SPECS, LAUNCH_ORDER, effectivePrintMm } from "@/lib/countrySpecs";
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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">{intro}</p>
      </header>

      <div className="mx-auto mt-8 max-w-2xl">
        <HeroStarter />
      </div>

      <section className="mt-12 space-y-4">
        <h2 className="text-center text-xl font-bold tracking-tight">
          {kind === "passport" ? "Passport" : "Visa"} photo size by country
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LAUNCH_ORDER.map((id) => {
            const spec = COUNTRY_SPECS[id];
            const mm = effectivePrintMm(spec);
            return (
              <Link
                key={id}
                href={`/${id}/`}
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:border-brand"
              >
                <Flag country={id} className="h-5 w-7" />
                <span className="text-sm font-medium">{spec.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {mm.width}×{mm.height}mm
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-center text-xl font-bold tracking-tight">
          Why people trust easyPhoto
        </h2>
        <TrustStrip />
      </section>

      <section className="mt-12">
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
