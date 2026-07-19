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
          <li>The application workflow and notice cycle you are using.</li>
          <li>A first-party instruction page or PDF, including its paragraph or page number.</li>
        </ul>
        <p>
          We do not need a copy of your photo, signature, identity document, or
          completed application to investigate a specification. Please remove
          personal details from any screenshot you choose to send.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What happens next
        </h2>
        <p>
          We compare the report with the responsible authority&apos;s current
          instructions and the source already recorded for the page. If the
          evidence supports a correction, we update the underlying specification
          and any dependent copy, then record a new verification or review date.
          If sources conflict, we keep the uncertainty visible rather than choose
          an unsupported number.
        </p>
      </section>

      <p className="rounded-xl border border-hairline bg-card p-6">
        A review date shows when a source comparison occurred. It does not mean
        the receiving authority has endorsed easyPhoto or guarantees acceptance.
      </p>

      <p>
        Corrections are applied to the shared source record where possible so the
        affected guide, specification table, and tool read the same revised value.
        Editorial wording is updated separately when the change alters the
        workflow rather than a number. We do not silently turn unresolved reports
        into confirmed requirements.
      </p>
      <p>
        Reports about broken downloads or browser behaviour follow the same
        evidence-first approach. We reproduce the steps with a non-sensitive test
        file, identify the affected browser or device, and distinguish a software
        defect from a portal-side message before changing user guidance.
      </p>
    </TrustPageLayout>
  );
}
