import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ExamPackageTool } from "@/components/tools/ExamPackageTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("exam-package")!;

export const metadata = pageMetadata({
  title: "Exam Application Kit — Photo + Signature in the Correct Size",
  description:
    "Get an application-ready photo and signature for SSC, UPSC, IBPS, SBI, RRB, NEET/JEE and more — correct size, dimensions and KB in one guided flow. 100% private.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Exam Application Kit"
      slug={tool.slug}
      blurb={tool.blurb}
      footnote="Photo and signature are processed entirely in your browser — nothing is uploaded."
    >
      <ExamPackageTool />
    </ToolPage>
  );
}
