import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { WhiteBackgroundTool } from "@/components/tools/WhiteBackgroundTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("white-background")!;

export const metadata = pageMetadata({
  title: "White Background Generator — Replace Photo Background",
  description:
    "Swap any photo's background for clean white (or any solid colour) in your " +
    "browser. Great for profile photos and product shots. Nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="White Background Generator"
      slug={tool.slug} blurb={tool.blurb}
      footnote="Background removal runs locally in your browser; your image never leaves your device."
    >
      <WhiteBackgroundTool />
    </ToolPage>
  );
}
