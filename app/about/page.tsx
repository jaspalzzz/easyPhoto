import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About EasyPhoto",
  description:
    "EasyPhoto makes compliant passport, visa and ID photos, plus image and " +
    "PDF tools, free and entirely in your browser. Here's why we built it.",
  path: "/about/",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ]),
          {
            "@type": "AboutPage",
            url: `${SITE_URL}/about/`,
            name: `About ${SITE_NAME}`,
            publisher: { "@id": ORG_ID },
          },
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <article className="mt-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">About EasyPhoto</h1>
          <p className="text-muted-foreground">
            Compliant passport &amp; visa photos and everyday image tools. Free,
            private, and made entirely in your browser.
          </p>
        </header>

        <Section title="Why we built it">
          Getting a passport or visa photo rejected over a couple of millimetres
          or the wrong shade of background is a frustration most people have run
          into. Studio photos are expensive, and the &quot;free&quot; online
          tools usually add a watermark, make you sign up, or quietly upload your
          face to a server. We wanted a tool that just gets the photo right, to
          each country&apos;s actual specification, without any of that.
        </Section>

        <Section title="How we keep it accurate">
          Each country&apos;s photo size, head height and background colour come
          from its official government source, which we link on every country
          page. The tool sizes your head to the required band, applies the
          correct background, then runs a compliance check before you download.
          When a country&apos;s rules are sourced from guidance rather than
          confirmed against the primary portal, we say so on the page.
        </Section>

        <Section title="Your privacy is the design">
          Every step (face detection, background removal, cropping, resizing and
          PDF conversion) runs in your browser using your own device. Your photos
          and documents are never uploaded, never stored, and are gone when you
          close the tab. It&apos;s not a setting; it&apos;s how the product works.
        </Section>

        <Section title="Free, no catch">
          EasyPhoto is free with no watermark and no account. There&apos;s no
          paywall on the download and no upsell to a &quot;pro&quot; version of
          your own photo.
        </Section>

        <p className="text-sm text-muted-foreground">
          Spotted a spec that looks out of date?{" "}
          <Link href="/contact/" className="text-brand hover:underline">
            Tell us
          </Link>
          . Accuracy is the whole point. Or jump straight to the{" "}
          <Link href="/passport-photo/" className="text-brand hover:underline">
            passport photo maker
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
