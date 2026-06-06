import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfToJpgTool } from "@/components/tools/PdfToJpgTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("pdf-to-jpg")!;

export const metadata = pageMetadata({
  title: "PDF to JPG — Export PDF Pages as Images (Free, Private)",
  description:
    "Convert each page of a PDF into a JPG image, right in your browser. " +
    "Download pages individually or all at once. Your PDF is never uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="PDF to JPG"
      slug={tool.slug} blurb={tool.blurb}
      footnote="The PDF is rendered locally in your browser; it never leaves your device."
    >
      <PdfToJpgTool />
    </ToolPage>
  );
}
