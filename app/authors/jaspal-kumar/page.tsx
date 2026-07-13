import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { AUTHOR } from "@/lib/author";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ORG_ID } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: `${AUTHOR.name}, ${AUTHOR.title}`,
  description:
    "About Jaspal Kumar, the developer who builds easyPhoto's privacy-first browser tools and maintains its source-linked specification records.",
  path: AUTHOR.url,
});

export default function JaspalKumarPage() {
  return (
    <>
      <JsonLd
        schema={{
          "@type": "Person",
          "@id": `${absoluteUrl(AUTHOR.url)}#person`,
          name: AUTHOR.name,
          jobTitle: AUTHOR.title,
          description: AUTHOR.bio,
          knowsAbout: AUTHOR.knowsAbout,
          url: absoluteUrl(AUTHOR.url),
          image: absoluteUrl(AUTHOR.photo),
          sameAs: AUTHOR.sameAs,
          worksFor: { "@id": ORG_ID },
        }}
      />

      <TrustPageLayout
        eyebrow="Author"
        title={AUTHOR.name}
        intro="Developer of easyPhoto's in-browser image and document tools."
      >
        <section className="grid gap-6 sm:grid-cols-[160px_1fr] sm:items-start">
          <Image
            src={AUTHOR.photo}
            alt={`Headshot of ${AUTHOR.name}`}
            width={160}
            height={160}
            priority
            className="aspect-square rounded-2xl border border-hairline object-cover"
          />
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              {AUTHOR.title}
            </h2>
            <p>{AUTHOR.bio}</p>
            <a
              href={AUTHOR.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              View Jaspal&apos;s LinkedIn profile
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Experience and role
          </h2>
          <p>
            Jaspal has more than ten years of hands-on web and mobile development
            experience. On easyPhoto, his work includes browser-based image
            processing, product maintenance, and keeping specification data tied
            to the sources shown on the site.
          </p>
          <p>
            This experience is in software development. Jaspal is not presented as
            a government official, passport officer, exam-board representative, or
            independent authority on application acceptance. Requirement claims
            rely on the cited source and review process, not on a personal title.
          </p>
        </section>

        <section className="rounded-xl border border-hairline bg-card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Editorial responsibility
          </h2>
          <p className="mt-2">
            Published guidance may begin with AI-assisted drafting, but substantive
            requirements are reviewed by a person against the recorded sources.
            The full process is described in the editorial and source-methodology
            pages linked in the site footer.
          </p>
        </section>
      </TrustPageLayout>
    </>
  );
}
