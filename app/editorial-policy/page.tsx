import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: "Editorial Policy",
  description:
    "How easyPhoto uses AI tools for drafts, who checks each guide against its source, what the dates on a page mean, and how corrections work.",
  path: "/editorial-policy/",
});

export default function EditorialPolicyPage() {
  return (
    <TrustPageLayout
      eyebrow="Editorial standards"
      title="How the guides are written and checked"
      intro="Every guide on easyPhoto is written to help you get a form right. This page explains where an AI tool is used, who checks the result, and what you should still check yourself."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          AI helps with drafts; a person checks the facts
        </h2>
        <p>
          An AI tool may be used to sort research notes, plan a page or write a first
          draft. Nothing it writes is treated as a source. Before a guide is
          published, 
          <Link href="/authors/jaspal-kumar/" className="font-medium text-brand underline">
            Jaspal Kumar
          </Link>
          , who runs easyPhoto, checks every size, limit and rule in it against the
          linked source and removes anything the source does not say.
        </p>
        <p>
          That check cuts mistakes, but it does not turn a guide into official
          instructions or say what an authority will decide. Rules can also change
          after the check.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Which sources count
        </h2>
        <p>
          The first choice is always the department, embassy, exam board or
          application portal responsible for the form. When a figure has been
          checked against that source, the page shows the date and links the source.
          When only other guidance is available, the page says so and marks the
          figure as still needing a check, instead of presenting it as the
          government&apos;s.
        </p>
        <p>
          The 
          <Link href="/source-methodology/" className="font-medium text-brand underline">
            source methodology
          </Link> 
          explains how dates and these labels work.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Rules every page follows
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the authority&apos;s own instructions wherever they exist.</li>
          <li>Never describe easyPhoto as a government service or official tool.</li>
          <li>Never promise what an authority will decide about a prepared file.</li>
          <li>Keep exact measurements, such as file size, apart from estimates, such as head position.</li>
          <li>Tell readers to confirm the current application instructions.</li>
          <li>Avoid urgency, fake deadlines and claims of endorsement.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What a check covers
        </h2>
        <p>
          The check confirms that the page describes the right application, that each
          number on it appears in the linked source, and that an example is not
          presented as a rule for every form. When a figure is corrected, the tool,
          the exam page and any guide that repeats it are corrected together, so the
          site does not contradict itself.
        </p>
      </section>

      <section className="rounded-xl border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Dates and corrections
        </h2>
        <p className="mt-2">
          A date on a page shows when its figures were last compared with the source.
          It does not mean the authority has made no change since. If something looks
          wrong, the 
          <Link href="/corrections-policy/" className="font-medium text-brand underline">
            corrections policy
          </Link> 
          explains how to report it.
        </p>
      </section>
    </TrustPageLayout>
  );
}
