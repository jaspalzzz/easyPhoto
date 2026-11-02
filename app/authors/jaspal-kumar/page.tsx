import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AUTHOR } from "@/lib/author";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ORG_ID } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: `About ${AUTHOR.name}, who builds easyPhoto`,
  description:
    "Jaspal Kumar builds easyPhoto's in-browser photo, signature and document tools and checks each requirement on the site against its published source.",
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
        intro="Builds easyPhoto's photo, signature and document tools, and checks the requirements behind them."
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
              About Jaspal
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
            What he does not claim
          </h2>
          <p>
            Jaspal is a software developer. He is not a government official,
            passport officer or exam-board member, and nothing on easyPhoto speaks
            for any authority. When a page gives a KB limit or a photo size, what
            backs it is the authority&apos;s notice linked on that page, not his
            job title.
          </p>
        </section>

        <section className="rounded-xl border border-hairline bg-card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            How the guides are written
          </h2>
          <p className="mt-2">
            Some guides start as a draft written with an AI tool. Before a guide is
            published, Jaspal checks every size, limit and rule in it against the
            linked source and removes anything the source does not say. The 
            <Link href="/editorial-policy/" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
              editorial policy
            </Link> 
            and 
            <Link href="/source-methodology/" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
              source methodology
            </Link> 
            explain this in full.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            His work on easyPhoto
          </h2>
          <p>
            He writes the photo, signature and document tools, and tests that each
            download opens and has the pixel size, file size and format it shows.
            He also works on how the site behaves on phones and for people using
            assistive technology.
          </p>
          <p>
            When an authority publishes only a KB limit, the tool asks for that
            and nothing more. It does not guess a pixel size, background colour or
            ink colour from another exam&apos;s form.
          </p>
          <p>
            When a reader reports a figure that has changed, he checks it against
            the newer notice and corrects the page, as set out in the 
            <Link href="/corrections-policy/" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
              corrections policy
            </Link>
            .
          </p>
        </section>
      </TrustPageLayout>
    </>
  );
}
