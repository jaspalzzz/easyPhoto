import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FormatConverterTool } from "@/components/tools/FormatConverterTool";
import { getTool } from "@/lib/toolsCatalog";
import { FORMAT_CONVERTER_FAQ } from "@/lib/faqs";
import { CONVERT_PAIRS, convertPath } from "@/lib/convertPairs";

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

      <section className="mt-10">
        <h2 className="eyebrow mb-3">Popular conversions</h2>
        <div className="flex flex-wrap gap-1.5">
          {CONVERT_PAIRS.map((p) => (
            <Link
              key={p.slug}
              href={convertPath(p.slug)}
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
            >
              {p.from} to {p.to}
            </Link>
          ))}
        </div>
      </section>
    </ToolPage>
  );
}
