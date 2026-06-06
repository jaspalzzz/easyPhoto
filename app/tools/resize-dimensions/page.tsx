import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeDimensionsTool } from "@/components/tools/ResizeDimensionsTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("resize-dimensions")!;

export const metadata = pageMetadata({
  title: "Resize Image by Dimensions — Exact Width & Height",
  description:
    "Resize a JPG or PNG to exact pixel dimensions with high-quality scaling, " +
    "in your browser. Lock the aspect ratio or set width and height freely.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Resize Image by Dimensions" slug={tool.slug} blurb={tool.blurb}>
      <ResizeDimensionsTool />
    </ToolPage>
  );
}
