import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ExploreTools } from "@/components/site/ExploreTools";

// Change this to your real inbox before launch.
const EMAIL = "hello@easyphoto.in";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with EasyPhoto to report a photo-spec correction or a bug, or " +
    "to ask a question. We read every message.",
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
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <article className="mt-5 space-y-8">
        <header className="space-y-3 border-b border-hairline pb-7">
          <span className="eyebrow text-brand">Contact</span>
          <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.4rem]">
            We read every message
          </h1>
          <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            A question, a bug report, or a photo specification that needs
            updating? We&apos;d like to hear from you.
          </p>
        </header>

        <div className="ep-card p-6 sm:p-7">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Mail className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h2 className="mt-4 text-base font-semibold tracking-tight text-ink">Email us</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            The fastest way to reach us. We aim to reply within a couple of
            business days.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
          >
            {EMAIL} <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>

        <section className="space-y-2 border-t border-hairline pt-8">
          <h2 className="text-lg font-semibold tracking-tight">Reporting a spec correction</h2>
          <p className="leading-relaxed text-muted-foreground">
            EasyPhoto&apos;s value is accuracy. If you find a country&apos;s photo
            size, background colour or file-size limit is out of date, email us
            with the country, the detail, and a link to the official source. We
            prioritise these.
          </p>
        </section>

        <p className="inline-flex items-start gap-2 border-t border-hairline pt-8 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
          We don&apos;t collect your photos. There&apos;s nothing to ask about
          your images, because they never leave your device.
        </p>

        <ExploreTools
          className="border-t border-hairline pt-10"
          heading="While you're here"
          subtitle="The most-used free tools — no sign-up, nothing uploaded."
        />
      </article>
    </div>
  );
}
