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
    </TrustPageLayout>
  );
}
