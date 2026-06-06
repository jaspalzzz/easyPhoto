import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { BackgroundRemovalTool } from "@/components/tools/BackgroundRemovalTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("background-removal")!;

export const metadata = pageMetadata({
  title: "Background Removal — Free Transparent PNG Maker",
  description:
    "Remove the background from any photo and download a transparent PNG. " +
    "Runs an AI model fully in your browser — your image is never uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Background Removal"
      slug={tool.slug} blurb={tool.blurb}
      footnote="The AI model downloads once from a CDN, then runs locally. Your image never leaves your device."
    >
      <BackgroundRemovalTool />
    </ToolPage>
  );
}
