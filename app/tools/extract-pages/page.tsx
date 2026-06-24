import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfSplitTool } from "@/components/tools/PdfSplitTool";

export const metadata = pageMetadata({
  title: "Extract PDF Pages — Pull Specific Pages from Any PDF Free",
  description:
    "Select and extract specific pages from a PDF — pull out a certificate, a marksheet page, or any section. Free, nothing uploaded, works in your browser.",
  path: "/tools/extract-pages/",
});

export default function Page() {
  return (
    <ToolPage
      title="Extract PDF Pages"
      slug="extract-pages"
      blurb="Upload any PDF, select the pages you need, and download them as a new PDF. Perfect for extracting a single certificate page, a specific marksheet, or any section from a multi-page document. Your file stays on your device."
    >
      <PdfSplitTool />
    </ToolPage>
  );
}
