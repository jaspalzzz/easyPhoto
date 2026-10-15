import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { NameDatePhotoTool } from "@/components/tools/NameDatePhotoTool";
import { getTool } from "@/lib/toolsCatalog";
import { PHOTO_NAME_DATE_FAQ } from "@/lib/faqs";
import { noStripExams, slateExams, stripExams, type NameDateExamRule } from "@/lib/nameDateExams";

const tool = getTool("photo-with-name-date")!;

export const metadata = pageMetadata({
  // Searchers' own words (GSC 25 Sep – 12 Oct 2026): "photo name and date",
  // "photo with name and date", "add name and date in passport size photo".
  title: "Photo with Name and Date — Add to Passport Size Photo Online",
  description:
    "Add your name and the photo date (DOP) in a white strip under your passport size photo, " +
    "set the file size in KB and download a JPG. Free; nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

function ExamRules({ rules }: { rules: NameDateExamRule[] }) {
  return (
    <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
      {rules.map((r) => (
        <li key={r.id}>
          <strong className="font-semibold text-ink">{r.exam}:</strong> {r.rule}{" "}
          <span className="whitespace-nowrap">
            (
            <a
              href={r.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
              title={r.sourceLabel}
            >
              official notice
            </a>
            , checked {r.checked})
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <ToolPage
      title="Photo with Name &amp; Date Generator"
      slug={tool.slug}
      blurb="Add your name and the date the photo was taken in a strip under your photo. Ready settings for TNPSC, APPSC and Kerala PSC, or set your own size for another form that asks for one."
      faqItems={PHOTO_NAME_DATE_FAQ}
      footnote="All processing runs entirely on your device. Your photo data, name, and date are never uploaded."
    >
      <NameDatePhotoTool />
      <p className="mt-6 text-sm text-muted-foreground">
        Need just a plain passport size photo, with no name or date? Use the{" "}
        <Link href="/passport-photo/" className="font-medium text-brand hover:underline">
          passport size photo maker
        </Link>
        .
      </p>

      <section className="mt-10 space-y-4 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">
          Which exams need a photo with name and date (2026)?
        </h2>
        <h3 className="text-sm font-semibold text-ink">These ask for it</h3>
        <ExamRules rules={stripExams()} />
        <p className="max-w-2xl text-sm text-muted-foreground">
          Pick one of these in the tool above and it sets the photo size and the strip for you.
        </p>
        <h3 className="text-sm font-semibold text-ink">These want a slate instead</h3>
        <ExamRules rules={slateExams()} />
        <h3 className="text-sm font-semibold text-ink">These don&apos;t ask for it</h3>
        <ExamRules rules={noStripExams()} />
      </section>
    </ToolPage>
  );
}
