import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for easyPhoto — a free, in-browser passport/visa photo " +
    "and image tool provided as-is. Always verify against official requirements.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <header className="mt-5 space-y-2.5">
        <span className="eyebrow block text-brand">Legal</span>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.4rem]">
          Terms of Use
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 6, 2026</p>
      </header>

      {/* The one that matters most, surfaced up top */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[hsl(38_92%_50%/0.35)] bg-[hsl(38_92%_50%/0.08)] p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(32_80%_42%)]" strokeWidth={1.9} />
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">Always check your final photo against the current
          official requirements before you submit.</strong>{" "}
          We follow each country&apos;s published spec, but rules change and can vary by office —
          so the last check is yours.
        </p>
      </div>

      <article className="mt-2 divide-y divide-hairline [&>section]:py-8">
        <Section title="The service">
          easyPhoto is a free tool that helps you prepare passport, visa, and
          general-purpose photos and documents in your browser. By using it, you
          agree to these terms.
        </Section>

        <Section title="Verify against official requirements">
          We size photos and set backgrounds according to each country&apos;s
          published specifications and link the official government source on
          every country page. However, requirements change and can vary by
          office or consulate.{" "}
          <strong className="text-foreground">
            You are responsible for checking your final photo against the current
            official requirements before submitting it.
          </strong>{" "}
          We do not guarantee that any photo will be accepted, and we are not
          liable for rejected applications, fees, or delays. Some flows carry
          extra conditions shown in-app (for example, India&apos;s printed form
          requires a professional photo-lab print, and printed Canadian passport
          photos require a certified photographer — both are noted in the tool).
        </Section>

        <Section title="No affiliation">
          easyPhoto is an independent tool and is not affiliated with,
          endorsed by, or connected to any government, passport authority, or
          consulate.
        </Section>

        <Section title="Provided “as is”">
          The service is provided “as is” and “as available,” without warranties
          of any kind, express or implied. To the fullest extent permitted by
          law, we disclaim all liability for any loss or damage arising from your
          use of the tool.
        </Section>

        <Section title="Acceptable use">
          Use the tool only for lawful purposes and only with images you have the
          right to use. Do not use it to create fraudulent or misleading
          identity documents.
        </Section>

        <Section title="Changes">
          We may update these terms from time to time; the date above reflects the
          latest version.
        </Section>

        <p className="pt-8 text-sm leading-relaxed text-muted-foreground">
          See also our{" "}
          <Link href="/privacy/" className="text-brand hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
