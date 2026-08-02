import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FormatConverterTool } from "@/components/tools/FormatConverterTool";
import { getTool } from "@/lib/toolsCatalog";
import { FORMAT_CONVERTER_FAQ } from "@/lib/faqs";

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
      faqItems={FORMAT_CONVERTER_FAQ}
      footnote="Image format conversion runs entirely on your device. Your photos are never uploaded to any server."
    >
      <FormatConverterTool />

      {/* The per-pair landing pages were consolidated into /convert/, which now
          explains what each format does rather than repeating the tool nine
          times. The converter auto-detects the source format, so the pairing
          was never something the reader had to choose up front. */}
      <section className="mt-10">
        <h2 className="eyebrow mb-3">Which format should you pick?</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          JPG for upload forms, PNG when you need transparency or lossless
          edits, WebP for the web. The{" "}
          <Link href="/convert/" className="font-medium text-brand hover:underline">
            image format guide
          </Link>{" "}
          covers what each one costs you — file size, transparency or a little
          detail — and when a conversion is worth making.
        </p>
      </section>
    </ToolPage>
  );
}
