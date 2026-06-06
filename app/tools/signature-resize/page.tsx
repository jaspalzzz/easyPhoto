import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeDimensionsTool } from "@/components/tools/ResizeDimensionsTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("signature-resize")!;

export const metadata = pageMetadata({
  title: "Signature Resize — Exact Width & Height",
  description:
    "Resize a signature image to exact pixel dimensions for forms and uploads, " +
    "preserving transparency. High-quality scaling, fully in your browser.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Signature Resize"
      slug={tool.slug} blurb={tool.blurb}
      footnote="Transparency is preserved in PNG output. Your file never leaves your device."
    >
      <ResizeDimensionsTool />
    </ToolPage>
  );
}
