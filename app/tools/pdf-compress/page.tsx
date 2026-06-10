import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfCompressTool } from "@/components/tools/PdfCompressTool";
import { getTool } from "@/lib/toolsCatalog";
import { PDF_COMPRESS_FAQ } from "@/lib/faqs";

const tool = getTool("pdf-compress")!;

export const metadata = pageMetadata({
  title: "Compress PDF — Reduce PDF File Size Online Free (50/100/200 KB)",
  description:
    "Compress PDF and reduce PDF file size online, free and private. Shrink marksheets, " +
    "certificates and documents to a target — under 50 KB, 100 KB, 200 KB or 500 KB, or a " +
    "custom size. Nothing is uploaded; it all runs in your browser.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Compress PDF — Reduce File Size"
      slug={tool.slug}
      blurb="Compress a PDF and reduce its file size to fit form upload limits — to 50 KB, 100 KB, 200 KB, 500 KB, or a custom target. Everything runs in your browser; your PDF is never uploaded."
      faqItems={PDF_COMPRESS_FAQ}
      footnote="Compression runs entirely on your device. Your PDF is never uploaded to any server."
    >
      <PdfCompressTool />
    </ToolPage>
  );
}
