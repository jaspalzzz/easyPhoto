import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: "Editorial Policy",
  description:
    "How easyPhoto uses AI-assisted drafting, human source verification, review dates, and corrections when publishing document-photo guidance.",
  path: "/editorial-policy/",
});

export default function EditorialPolicyPage() {
  return (
    <TrustPageLayout
      eyebrow="Editorial standards"
      title="How we create and verify content"
      intro="Our pages are working guides built from cited requirements. This policy explains where automation helps, where a person checks the work, and what readers should verify before submitting an application."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          AI-assisted drafts, human-verified claims
        </h2>
        <p>
          We may use AI assistance to organize research notes, outline a page, or
          produce an early draft. AI output is not treated as evidence. Before
          publication, a person reviews substantive requirements against the
          source recorded for that specification and removes claims the cited
          material does not support.
        </p>
        <p>
          Human verification reduces errors; it does not make a page an official
          instruction or an acceptance guarantee. Application rules can also
          change after a review.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What verification means
        </h2>
        <p>
          We prefer the responsible government department, embassy, exam board,
          or application portal. A specification marked as verified includes the
          review date and a link to the source used. When only secondary guidance
          is available, the page should say that the source needs review instead
          of presenting it as government-confirmed.
        </p>
        <p>
          The implementation details are documented in our{" "}
          <Link href="/source-methodology/" className="font-medium text-brand underline">
            source methodology
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Publishing standards
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use primary official sources where they are available.</li>
          <li>Do not describe easyPhoto as a government service or official tool.</li>
          <li>Do not promise a favourable application decision for a prepared file.</li>
          <li>Separate measurable image properties from visual estimates.</li>
          <li>Tell readers to confirm the current application instructions.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Updates and accountability
        </h2>
        <p className="mt-2">
          A displayed review date records when the cited requirement was last
          compared with its source; it is not a promise that the authority has
          made no later change. If something looks wrong, use our{" "}
          <Link href="/corrections-policy/" className="font-medium text-brand underline">
            corrections policy
          </Link>{" "}
          to report it.
        </p>
      </section>
    </TrustPageLayout>
  );
}
