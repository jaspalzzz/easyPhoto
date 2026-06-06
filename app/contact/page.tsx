import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Change this to your real inbox before launch.
const EMAIL = "hello@easyphoto.in";

export const metadata = pageMetadata({
  title: "Contact EasyPhoto",
  description:
    "Get in touch with EasyPhoto — report a photo-spec correction, a bug, or " +
    "ask a question. We read every message.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact/" },
          ]),
          {
            "@type": "ContactPage",
            url: `${SITE_URL}/contact/`,
            name: `Contact ${SITE_NAME}`,
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
          <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
          <p className="text-muted-foreground">
            Questions, bug reports, or a photo specification that needs updating —
            we&apos;d like to hear from you.
          </p>
        </header>

        <div className="rounded-xl border bg-muted/30 p-6">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="text-base font-semibold">Email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The fastest way to reach us. We aim to reply within a couple of
            business days.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            {EMAIL}
          </a>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Reporting a spec correction</h2>
          <p className="leading-relaxed text-muted-foreground">
            EasyPhoto&apos;s value is accuracy. If you find a country&apos;s photo
            size, background colour or file-size limit is out of date, email us
            with the country, the detail, and a link to the official source — we
            prioritise these.
          </p>
        </section>

        <p className="inline-flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          We don&apos;t collect your photos — there&apos;s nothing to ask about
          your images, because they never leave your device.
        </p>
      </article>
    </div>
  );
}
