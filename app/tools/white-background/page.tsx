import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { WhiteBackgroundTool } from "@/components/tools/WhiteBackgroundTool";
import { getTool } from "@/lib/toolsCatalog";
import { WHITE_BACKGROUND_FAQ } from "@/lib/faqs";

const tool = getTool("white-background")!;

export const metadata = pageMetadata({
  // "white background maker/generator" is held by global brands (remove.bg,
  // Canva, Photoroom; we sat at position ~16 with 0.5% CTR, GSC Sep–Oct 2026).
  // Lead with the photos our visitors actually need white: exam and ID forms.
  title: "White Background for Passport & Exam Photos",
  description:
    "Make a photo's background plain white for exam, passport and visa forms that ask for it, " +
    "right in your browser, or any plain colour. Free; nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="White Background Generator"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={WHITE_BACKGROUND_FAQ}
      footnote="Background removal runs locally in your browser; your image never leaves your device."
    >
      <WhiteBackgroundTool />
    </ToolPage>
  );
}
