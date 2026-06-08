import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfSplitTool } from "@/components/tools/PdfSplitTool";
import { getTool } from "@/lib/toolsCatalog";
import { PDF_SPLIT_FAQ } from "@/lib/faqs";

const tool = getTool("pdf-split")!;

export const metadata = pageMetadata({
  title: "Split PDF Online — Extract PDF Pages Client-Side",
  description:
    "Extract specific pages from a PDF document or split your PDF into separate files, " +
    "completely in your browser. Fully private, no server uploads.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Split PDF File"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={PDF_SPLIT_FAQ}
      footnote="Splitting runs entirely on your device. Your PDF pages are never uploaded to any server."
    >
      <PdfSplitTool />
    </ToolPage>
  );
}
