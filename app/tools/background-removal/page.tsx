import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { BackgroundRemovalTool } from "@/components/tools/BackgroundRemovalTool";
import { getTool } from "@/lib/toolsCatalog";
import { BACKGROUND_REMOVER_FAQ } from "@/lib/faqs";

const tool = getTool("background-removal")!;

export const metadata = pageMetadata({
  title: "Free Background Remover – Transparent PNG in Seconds",
  titleAbsolute: true,
  description:
    "Remove image backgrounds online free and download a transparent PNG. " +
    "AI-powered, runs in your browser — no upload, no watermark, no sign-up.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Background Removal"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={BACKGROUND_REMOVER_FAQ}
      footnote="The AI model downloads once from a CDN, then runs locally. Your image never leaves your device."
    >
      <BackgroundRemovalTool />
    </ToolPage>
  );
}
