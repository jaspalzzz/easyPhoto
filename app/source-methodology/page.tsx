import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TrustPageLayout } from "@/components/site/TrustPageLayout";

export const metadata = pageMetadata({
  title: "Source Methodology",
  description:
    "Where easyPhoto's photo sizes and KB limits come from, what the verified dates and labels on a page mean, and what happens when sources disagree.",
  path: "/source-methodology/",
});

export default function SourceMethodologyPage() {
  return (
    <TrustPageLayout
      eyebrow="Sources"
      title="Where the figures come from, and what the dates mean"
      intro="A photo size or KB limit is only useful if you can see where it came from, when it was checked, and whether any doubt remains."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Which source comes first
        </h2>
        <p>
          The first place to look is the authority&apos;s own application
          instructions, notice, help page or official PDF. Other guidance is used
          only when the authority publishes nothing for that figure, and it is
          never relabelled as official because it looks right or is widely repeated.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Each figure needs its own source
        </h2>
        <p>
          A notice can give one figure without giving another. It may set a KB limit
          but no pixel size, or say the photo is taken live with no upload at all.
          When a figure is not published, the page leaves it out instead of
          borrowing it from another exam or a common pattern.
        </p>
        <p>
          Recruitment notices change between years. A figure from last year&apos;s
          notice is not shown as current just because the exam has the same name.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          What is compared
        </h2>
        <p>
          For a document photo: the size, file size, file format, background and any
          rule about head size or framing. For an exam upload, also the signature
          size, the KB range and any name-and-date requirement. A figure the source
          does not support is removed, narrowed or marked as needing a check.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          The labels on a page
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Verified</strong> with a date means the
            figures were compared with the linked official source on that date.
          </li>
          <li>
            <strong className="text-ink">Confirm on the official source before you
            submit</strong> means the page links an official source, but its figures
            have no dated check yet.
          </li>
          <li>
            <strong className="text-ink">No official source found yet</strong>{" "}
            means we have not found an official source for the figures.
          </li>
        </ul>
        <p>
          None of these labels says what a portal will do later. A guide&apos;s
          &ldquo;last reviewed&rdquo; date is when its wording was checked; an exam
          page&apos;s verified date is when its figures were. The two can differ,
          because a guide can be edited without any number changing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Changes and sources that disagree
        </h2>
        <p>
          When a portal changes a figure, it is corrected in one place, so every
          page and tool that uses it shows the same value. When two current official
          sources disagree, the page says so and points you to the application you
          are actually using. It does not invent a number in between.
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
