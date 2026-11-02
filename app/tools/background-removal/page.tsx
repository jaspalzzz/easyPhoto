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
      footnote="The first time you use it, your browser downloads the cut-out software, which can take a few seconds on a slow connection."
    >
      <BackgroundRemovalTool />

      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">Remove a photo background in three steps</h2>
        <ol className="max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Upload a photo or image in the box above.</li>
          <li>The AI separates the person or object from the background.</li>
          <li>Zoom in on the edges in the preview, then download the cut-out as a PNG.</li>
        </ol>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-ink">When the cut-out goes wrong</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The AI looks for the edge between your subject and whatever is behind it. It
          does well when that edge is clear: a person in front of a plain wall, a product on
          a table. It struggles when the two blend: dark hair against a dark sofa, a white
          shirt against a white wall, a hand or a chair arm touching the body. You will see
          that as a pale halo around the hair, a patch of background left behind, or part of
          a shoulder or ear cut away.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Editing rarely fixes these. Retaking the photo usually does: stand a step or two in
          front of a plain wall, face a window so the light is even, and wear something that
          does not match the wall. Start from the original camera file rather than a
          screenshot or a copy sent over WhatsApp, because compression blurs exactly the fine
          edges the AI needs.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-ink">Using the result for a passport or exam photo</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The download has a see-through background, which most application forms cannot use:
          they ask for a JPG, and a JPG cannot be see-through. For an exam or ID photo on plain
          white, use{" "}
          <Link href="/tools/white-background/" className="font-medium text-brand hover:underline">
            White Background
          </Link>
          , then bring the file under the form&apos;s KB limit with{" "}
          <Link href="/tools/resize-kb/" className="font-medium text-brand hover:underline">
            Compress Image to KB
          </Link>
          . For a passport or visa photo, the{" "}
          <Link href="/passport-photo/" className="font-medium text-brand hover:underline">
            passport photo maker
          </Link>{" "}
          crops to the country&apos;s size and head height as well as setting the background.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Check first whether the service accepts an edited photo. The UK online passport
          service asks for an unedited photo, and Immigration New Zealand says it does not accept
          photos altered by AI editing tools. For those, take a new photo against a plain light
          wall instead of removing the background.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Removing the paper from a signature? Use{" "}
          <Link href="/tools/signature-background-removal/" className="font-medium text-brand hover:underline">
            Remove Background from Signature
          </Link>
          , which keeps thin ink strokes that a photo remover can lose.
        </p>
      </section>
    </ToolPage>
  );
}
