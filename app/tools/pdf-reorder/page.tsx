import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfReorderTool } from "@/components/tools/PdfReorderTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("pdf-reorder")!;

export const metadata = pageMetadata({
  title: "Reorder & Rotate PDF Pages Online — Client-Side",
  description:
    "Rearrange, rotate, and delete pages of a PDF visually in your browser. " +
    "Modify your PDF offline without uploading files to any server.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Reorder & Rotate PDF Pages"
      slug={tool.slug}
      blurb={tool.blurb}
      footnote="Processing runs entirely on your device. Your PDF pages are never uploaded to any server."
    >
      <PdfReorderTool />
    </ToolPage>
  );
}
