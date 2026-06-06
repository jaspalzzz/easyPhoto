import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { getTool } from "@/lib/toolsCatalog";
import { PHOTO_RESIZE_FAQ } from "@/lib/faqs";

const tool = getTool("resize-kb")!;

export const metadata = pageMetadata({
  title: "Resize Image by KB — Compress to an Exact File Size",
  description:
    "Compress a JPG or PNG to a target file size in KB, right in your browser. " +
    "Drops quality first, then dimensions, to land under your limit. No upload.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Resize Image by KB"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={PHOTO_RESIZE_FAQ}
    >
      <ResizeKbTool />
    </ToolPage>
  );
}
