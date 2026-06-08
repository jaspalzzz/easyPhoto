import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfMergeTool } from "@/components/tools/PdfMergeTool";
import { getTool } from "@/lib/toolsCatalog";
import { PDF_MERGE_FAQ } from "@/lib/faqs";

const tool = getTool("pdf-merge")!;

export const metadata = pageMetadata({
  title: "Merge PDF Online — Combine PDFs Client-Side",
  description:
    "Combine multiple PDF documents into a single PDF file, right in your browser. " +
    "Reorder pages and merge files without uploading them to any server.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Merge PDF Files"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={PDF_MERGE_FAQ}
      footnote="Merging runs entirely on your device. Your PDF pages are never uploaded to any server."
    >
      <PdfMergeTool />
    </ToolPage>
  );
}
