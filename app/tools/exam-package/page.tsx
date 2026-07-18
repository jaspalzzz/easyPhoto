import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ExamPackageTool } from "@/components/tools/ExamPackageTool";
import { ExamSearchProvider, ExamSearchControls } from "@/components/tools/ExamSearch";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { getTool } from "@/lib/toolsCatalog";
import { EXAM_PACKAGE_FAQ } from "@/lib/faqs";

const tool = getTool("exam-package")!;

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Resizer — SSC UPSC IBPS NEET All-in-One",
  description:
    "Prepare photo and signature files to selected stored targets for SSC, UPSC, IBPS, SBI, RRB, NEET/JEE and more. Verify the current form before use.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ExamSearchProvider>
      <ToolPage
        title="Exam Application Kit"
        slug={tool.slug}
        blurb={tool.blurb}
        faqItems={EXAM_PACKAGE_FAQ}
        footnote="Photo and signature are processed entirely in your browser — nothing is uploaded."
        hero={
          <BeforeAfterSlider
            beforeSrc="/images/sample4_before_384.webp"
            afterSrc="/images/sample4_after_384.webp"
            caption="Drag to compare an example source and prepared result"
          />
        }
        heroLeftBelow={<ExamSearchControls />}
        wide
      >
        <div id="exam-picker" className="scroll-mt-24">
          <ExamPackageTool />
        </div>
      </ToolPage>
    </ExamSearchProvider>
  );
}
