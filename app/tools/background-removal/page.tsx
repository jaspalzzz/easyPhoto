import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { BackgroundRemovalTool } from "@/components/tools/BackgroundRemovalTool";
import { getTool } from "@/lib/toolsCatalog";
import { BACKGROUND_REMOVER_FAQ } from "@/lib/faqs";

const tool = getTool("background-removal")!;

export const metadata = pageMetadata({
  // Searchers' words: "remove background from image", "remove background from
  // photo" (GSC, 28 days to 13 Oct 2026: page at position ~27).
  title: "Remove Background from Image or Photo — Free, No Upload",
  titleAbsolute: true,
  description:
    "Remove the background from any image or photo and download a transparent PNG. " +
    "AI runs in your browser — nothing is uploaded, no watermark, no sign-up.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Remove Background from Photo or Image"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={BACKGROUND_REMOVER_FAQ}
      footnote="Runs entirely in your browser — your image never leaves your device. The first run takes a few seconds to set up the AI."
    >
      <BackgroundRemovalTool />

      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">Remove a photo background in three steps</h2>
        <ol className="max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Upload a photo or image in the box above.</li>
          <li>The AI separates the person or object from the background, on your device.</li>
          <li>Check the edges in the preview, then download the cut-out.</li>
        </ol>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Need a white background for a passport or exam photo? Use{" "}
          <Link href="/tools/white-background/" className="font-medium text-brand hover:underline">
            White Background
          </Link>
          . Removing the paper from a signature? Use{" "}
          <Link href="/tools/signature-background-removal/" className="font-medium text-brand hover:underline">
            Remove Background from Signature
          </Link>
          , which keeps thin ink strokes that a photo remover can lose.
        </p>
      </section>
    </ToolPage>
  );
}
