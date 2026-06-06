import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeDimensionsTool } from "@/components/tools/ResizeDimensionsTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("signature-resize")!;

export const metadata = pageMetadata({
  title: "Signature Resize Tool – Resize Signature Online Free",
  titleAbsolute: true,
  description:
    "Resize your signature to exact pixels or a KB limit for online forms " +
    "(UPSC, SSC, bank, visa). Free, keeps transparency, processed in your browser.",
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
