import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { JpgToPdfTool } from "@/components/tools/JpgToPdfTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("jpg-to-pdf")!;

export const metadata = pageMetadata({
  title: "JPG to PDF Converter – Free, Private, In Your Browser",
  titleAbsolute: true,
  description:
    "Convert JPG or PNG images to PDF online free. Combine multiple photos into " +
    "one PDF, reorder pages — no upload, no watermark, all in your browser.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="JPG to PDF" slug={tool.slug} blurb={tool.blurb}>
      <JpgToPdfTool />
    </ToolPage>
  );
}
