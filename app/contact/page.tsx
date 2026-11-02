import Link from "next/link";
import { Clock3, Mail, MapPin, UserRound } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID, type Crumb } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

// Live inbox — routed via Cloudflare Email Routing to the owner's mailbox.
const EMAIL = "hello@easyphoto.in";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Email easyPhoto to report an out-of-date photo requirement or a bug, or " +
    "to ask a question. Every message is read by the person who runs the site.",
  path: "/contact/",
});

export default function ContactPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact/" },
  ];

  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          {
            "@type": "ContactPage",
            url: `${SITE_URL}/contact/`,
            name: `Contact ${SITE_NAME}`,
            publisher: { "@id": ORG_ID },
          },
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <article className="mt-5 space-y-8">
        <header className="space-y-3 border-b border-hairline pb-7">
          <span className="eyebrow text-brand">Contact</span>
          <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-[36px]">
            Contact easyPhoto
          </h1>
          <p className="max-w-xl text-[18px] leading-relaxed text-muted-foreground">
            A question, a bug report, or a photo requirement that needs updating?
            Every message is read by Jaspal Kumar, who runs the site.
          </p>
        </header>

        <div className="ep-card p-6 sm:p-7">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Mail className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h2 className="mt-4 text-base font-semibold tracking-tight text-ink">Email</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Email is the way to reach easyPhoto.
          </p>
          {/* Cloudflare's email obfuscation turns a mailto link into a
              /cdn-cgi/ link that 404s and reads "[email protected]" without
              JavaScript. Its email_off markers leave this address as written. */}
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{
              __html: `<!--email_off--><a href="mailto:${EMAIL}" class="inline-flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]">${EMAIL}</a><!--/email_off-->`,
            }}
          />
        </div>

        <section aria-labelledby="operator-heading" className="space-y-4">
          <div>
            <h2 id="operator-heading" className="text-lg font-semibold tracking-tight text-ink">
              Who operates easyPhoto
            </h2>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-hairline bg-card p-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                <UserRound className="h-4 w-4 text-brand" strokeWidth={1.75} />
                Operator
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                easyPhoto is independently owned and run by{" "}
                <Link
                  href="/authors/jaspal-kumar/"
                  className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
                >
                  Jaspal Kumar
                </Link>
                , who builds the tools and checks the requirements on the site.
              </dd>
            </div>

            <div className="rounded-lg border border-hairline bg-card p-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
                Typical response time
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Within two business days.
              </dd>
            </div>

            <div className="rounded-lg border border-hairline bg-card p-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MapPin className="h-4 w-4 text-brand" strokeWidth={1.75} />
                Location
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Punjab, India.
              </dd>
            </div>
          </dl>
        </section>

        <section className="space-y-2 border-t border-hairline pt-8">
          <h2 className="text-lg font-semibold tracking-tight">Reporting an out-of-date requirement</h2>
          <p className="leading-relaxed text-muted-foreground">
            If a photo size, background colour or KB limit on easyPhoto no longer
            matches the authority&apos;s instructions, email the page link, the
            figure that changed, and a link to the newer notice. These are handled
            first. The{" "}
            <Link href="/corrections-policy/" className="font-medium text-brand hover:underline">
              corrections policy
            </Link>{" "}
            explains what happens next.
          </p>
        </section>

        <section className="space-y-2 border-t border-hairline pt-8">
          <h2 className="text-lg font-semibold tracking-tight">What to include in a bug report</h2>
          <p className="leading-relaxed text-muted-foreground">
            Say which page, device and browser, the step that failed, and what
            you expected to happen. For privacy, do not email an identity document
            or a real application photo. A screen recording made with a harmless
            sample file is usually enough to reproduce a visual or download issue.
          </p>
        </section>

      </article>
    </div>
  );
}
