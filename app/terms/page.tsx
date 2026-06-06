import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <article className="mt-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 6, 2026</p>
        </header>

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

        <p className="text-sm text-muted-foreground">
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
