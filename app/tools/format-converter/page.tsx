import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FormatConverterTool } from "@/components/tools/FormatConverterTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("format-converter")!;

export const metadata = pageMetadata({
  title: "Image Format Converter — JPG, PNG, WebP & HEIC Converter",
  description:
    "Convert images between JPG, PNG, WebP, and iPhone HEIC formats online for free, " +
    "in your browser. Set compression quality and compress images. No uploads.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Universal Image Format Converter"
      slug={tool.slug}
      blurb={tool.blurb}
      footnote="Image format conversion runs entirely on your device. Your photos are never uploaded to any server."
    >
      <FormatConverterTool />
    </ToolPage>
  );
}
