import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfCompressTool } from "@/components/tools/PdfCompressTool";
import { getTool } from "@/lib/toolsCatalog";
import { PDF_COMPRESS_FAQ } from "@/lib/faqs";

const tool = getTool("pdf-compress")!;

export const metadata = pageMetadata({
  title: "Compress PDF to 100KB, 200KB or 500KB — Free, Client-Side",
  description:
    "Reduce PDF file size to fit form upload limits — compress marksheets, certificates " +
    "and documents to under 100 KB, 200 KB or 500 KB. 100% private, nothing uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Compress PDF to a Size Limit"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={PDF_COMPRESS_FAQ}
      footnote="Compression runs entirely on your device. Your PDF is never uploaded to any server."
    >
      <PdfCompressTool />
    </ToolPage>
  );
}
