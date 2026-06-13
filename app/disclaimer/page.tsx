import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "easyPhoto is an independent, free tool. Specifications come from official " +
    "sources but can change — always verify against the official portal before " +
    "submitting. We are not affiliated with any government or exam body.",
  path: "/disclaimer/",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}

export default function DisclaimerPage() {
  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Disclaimer", path: "/disclaimer/" },
          ]),
          {
            "@type": "WebPage",
            url: `${SITE_URL}/disclaimer/`,
            name: `Disclaimer — ${SITE_NAME}`,
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

      <header className="mt-5 space-y-2.5">
        <span className="eyebrow block text-brand">Legal</span>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.4rem]">
          Disclaimer
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 13, 2026</p>
      </header>

      {/* The load-bearing one, surfaced up top */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[hsl(38_92%_50%/0.35)] bg-[hsl(38_92%_50%/0.08)] p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(32_80%_42%)]" strokeWidth={1.9} />
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">Always confirm the current photo,
          signature and document requirements on the official portal before you
          submit.</strong>{" "}
          easyPhoto follows each authority&apos;s published specification, but
          rules change between cycles and can vary by office.
        </p>
      </div>

      <article className="mt-2 divide-y divide-hairline [&>section]:py-8">
        <Section title="Independent, unaffiliated tool">
          easyPhoto is an independent service. We are{" "}
          <strong className="text-foreground">
            not affiliated with, authorised by, or endorsed by
          </strong>{" "}
          any government department, passport authority, consulate, examination
          board, recruitment commission, bank, or any other official body. All
          such names, logos and trademarks belong to their respective owners and
          are used only to describe the document or form a tool helps you prepare.
        </Section>

        <Section title="Accuracy of specifications">
          We take accuracy seriously — each country and exam specification is
          drawn from its official source and dated on the page. However,
          requirements are updated between notification cycles and may differ by
          office or consulate. We do not warrant that any specification is
          current or complete, and the responsibility for matching your final
          file to the live official requirement rests with you.
        </Section>

        <Section title="No guarantee of acceptance">
          Our tools size, compress and check photos, signatures and documents to
          help them meet published requirements. We{" "}
          <strong className="text-foreground">
            cannot guarantee that any output will be accepted
          </strong>{" "}
          by a portal, officer or authority, and we are not liable for rejected
          applications, missed deadlines, fees, or any other loss arising from
          use of the site. Automated checks cannot catch every issue (expression,
          glasses glare, shadows, lighting) — review your result before submitting.
        </Section>

        <Section title="Provided “as is”">
          The service is provided &quot;as is&quot; and &quot;as available&quot;,
          without warranties of any kind, express or implied. To the fullest
          extent permitted by law, we disclaim all liability for any loss or
          damage arising from your use of, or inability to use, the site.
        </Section>

        <Section title="External links">
          Pages may link to official government and other third-party websites
          for verification. We are not responsible for the content, accuracy, or
          availability of any external site.
        </Section>

        <p className="pt-8 text-sm leading-relaxed text-muted-foreground">
          See also our{" "}
          <Link href="/privacy/" className="text-brand hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms/" className="text-brand hover:underline">
            Terms of Use
          </Link>
          . Questions?{" "}
          <Link href="/contact/" className="text-brand hover:underline">
            Contact us
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
