import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: "Source Methodology",
  description:
    "How easyPhoto records official and secondary sources, verifies specification values, displays review dates, and handles conflicting guidance.",
  path: "/source-methodology/",
});

export default function SourceMethodologyPage() {
  return (
    <TrustPageLayout
      eyebrow="Source provenance"
      title="How we verify and date specifications"
      intro="A specification is useful only when a reader can see where it came from, when it was checked, and where uncertainty remains."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Source order
        </h2>
        <p>
          We first look for the responsible authority&apos;s live application
          instructions, published notice, help page, or official PDF. We record
          secondary guidance only when a primary page is unavailable or does not
          state the value. A secondary record is not relabelled as official simply
          because it appears plausible or is widely repeated.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Claim-level recording
        </h2>
        <p>
          A source can support one field without supporting every field. For
          example, an instruction may publish a KB band but no fixed pixel size,
          or describe a live-capture workflow without a prepared-photo upload.
          In that case the unpublished field is omitted rather than inferred from
          a common template or another portal.
        </p>
        <p>
          Cycle-dependent recruitment notices are reviewed in their own context.
          A value from an earlier notice is not automatically presented as current
          merely because the authority and exam name are unchanged.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What is compared
        </h2>
        <p>
          For document photos, reviewers compare the recorded dimensions, file
          size, file format, background instruction, and any published framing
          rule with the cited source. For exam uploads, the comparison can also
          include signature dimensions, KB bands, and name/date requirements.
          Values not supported by the source should be removed, narrowed, or
          marked for review.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Dates and visible status
        </h2>
        <p>
          <strong className="text-ink">Verified date · source</strong> means a
          person compared the stored record with the linked source on that date.
          <strong className="text-ink"> Source needs review</strong> means the
          record lacks a dated primary-source confirmation. Neither label predicts
          what an application portal will do later.
        </p>
        <p>
          A guide&apos;s “last reviewed” date refers to its editorial review. A
          specification&apos;s verification date refers to the cited requirements
          record. They may differ because a guide can be edited without changing
          the underlying numbers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Changes and conflicting sources
        </h2>
        <p>
          When a portal changes, the registry is updated first so pages and tools
          that read that record receive the same value. Where two current official
          sources conflict, we disclose the conflict and direct users to the
          application flow they are actually using. We do not invent a compromise
          value.
        </p>
        <p>
          Found a newer source?{" "}
          <Link href="/contact/" className="font-medium text-brand underline">
            Report outdated information
          </Link>
          .
        </p>
      </section>
    </TrustPageLayout>
  );
}
