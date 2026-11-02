import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: "Corrections Policy",
  description:
    "How to report an easyPhoto error, how source evidence is reviewed, and how verified corrections and review dates are handled.",
  path: "/corrections-policy/",
});

export default function CorrectionsPolicyPage() {
  return (
    <TrustPageLayout
      eyebrow="Corrections"
      title="Corrections policy"
      intro="Requirements change, source pages move, and mistakes can happen. We want reports to be easy to submit and possible to verify."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Report an error
        </h2>
        <p>
          Send the affected page, the value you believe is wrong, and—if
          possible—the exact government or exam-board page that supports the
          correction through our{" "}
          <Link href="/contact/" className="font-medium text-brand underline">
            contact page
          </Link>
          . Screenshots are useful, but a live source link or dated notice makes
          the change easier to confirm.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What makes a report actionable
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>The easyPhoto URL where the statement appears.</li>
          <li>The exact sentence, table row, or tool value that may be outdated.</li>
          <li>Which application and which year&apos;s notice you are using.</li>
          <li>A first-party instruction page or PDF, including its paragraph or page number.</li>
        </ul>
        <p>
          We do not need a copy of your photo, signature, identity document, or
          completed application to look into a figure. Please remove
          personal details from any screenshot you choose to send.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What happens next
        </h2>
        <p>
          Jaspal Kumar, who runs easyPhoto, compares the report with the
          authority&apos;s current instructions and with the source the page
          already links. If the newer notice supports the change, the figure is
          corrected and the page shows the new date of the check. If two sources
          disagree, the page says so rather than picking a number neither of them
          supports.
        </p>
      </section>

      <p className="rounded-xl border border-hairline bg-card p-6">
        A review date shows when a source comparison occurred. It does not mean
        the receiving authority has endorsed easyPhoto or guarantees acceptance.
      </p>

      <p>
        A corrected figure is changed in one place, so the tool, the exam page and
        any guide that uses it all show the same new value. When the change is to
        how an application works rather than to a number, the guide wording is
        rewritten as well. A report that cannot be confirmed is not turned into a
        stated requirement.
      </p>
      <p>
        Reports about broken downloads or a tool misbehaving are handled the same
        way: the steps are repeated with a harmless sample file on the browser or
        device you named, to tell an easyPhoto bug apart from a message the portal
        itself shows, before any guidance changes.
      </p>
    </TrustPageLayout>
  );
}
