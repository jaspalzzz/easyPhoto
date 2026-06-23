import Link from "next/link";
import { ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { ExploreTools } from "@/components/site/ExploreTools";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, softwareApplicationSchema } from "@/lib/schema";

/**
 * Shared landing page for an Indian identity-document photo/signature resizer
 * (PAN, Voter ID, Driving Licence). Keyword-exact root URL, inheriting the
 * verified PORTAL_PRESETS spec — the evergreen, high-volume document queries.
 */
export function DocPhotoResizerPage({
  portalId,
  displayName,
  slug,
  intro,
}: {
  /** Key into PORTAL_PRESETS (the verified spec). */
  portalId: string;
  /** Short keyword name shown in the tool, e.g. "PAN card". */
  displayName: string;
  /** Root slug, e.g. "pan-card-photo-resizer". */
  slug: string;
  /** Unique lead paragraph. */
  intro: string;
}) {
  const spec = getPortalSpec(portalId)!;
  const prov = specProvenance(spec);
  const path = `/${slug}/`;

  return (
    <div className="container max-w-3xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: displayName, path },
          ]),
          softwareApplicationSchema({
            name: `${displayName} Photo & Signature Resizer`,
            description: `Resize a ${displayName} photo and signature to the exact size and KB the application requires, in your browser.`,
            url: path,
          }),
          faqSchema(portalFaqItems(spec)),
        ]}
      />

      <Link
        href="/exam-requirements/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All document requirements
      </Link>

      <header className="space-y-3">
        <span className="eyebrow block text-brand">Government document photo</span>
        <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {displayName} Photo &amp; Signature Resizer
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{intro}</p>
        <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
          <span>{prov.label}.</span>
          {prov.url && (
            <a
              href={prov.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-brand hover:underline"
            >
              Official source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </p>
      </header>

      <PortalResizer portalId={portalId} displayName={displayName} />

      <ExploreTools
        className="border-t border-hairline pt-10"
        heading="More free tools"
        subtitle="Photos, signatures, PDFs — all on-device, no sign-up."
      />

      <section>
        <Faq items={portalFaqItems(spec)} noSchema />
      </section>

      <p className="text-xs text-muted-foreground">
        Specs can change between cycles — confirm on the official portal before
        submitting.{" "}
        <Link href={`/exam-requirements/${portalId}/`} className="text-brand hover:underline">
          See the full {displayName} spec
        </Link>
        .
      </p>
    </div>
  );
}
