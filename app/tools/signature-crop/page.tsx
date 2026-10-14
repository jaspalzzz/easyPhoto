import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureManualCropTool } from "@/components/tools/SignatureManualCropTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_CROP_FAQ } from "@/lib/faqs";

const tool = getTool("signature-crop")!;

export const metadata = pageMetadata({
  // Searchers' own words (GSC 25 Sep – 12 Oct 2026): "crop signature from
  // image", "how to crop signature from image" (positions 3–7), "crop signature".
  title: "Crop Signature from Image — Free, Auto-Detect",
  description:
    "Crop a signature from any image or phone photo: drag the box or auto-detect the ink, " +
    "then make the paper white or transparent. Free; nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Signature Crop" slug={tool.slug} blurb={tool.blurb} faqItems={SIGNATURE_CROP_FAQ}>
      <SignatureManualCropTool />
      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">How to crop a signature from an image</h2>
        <ol className="max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Upload a scan or a phone photo of your signature; JPG, PNG and HEIC all work.</li>
          <li>
            Drag the box around the signature, or tap Auto-detect to fit it to the ink. The dimmed
            area is removed; the bright area is kept.
          </li>
          <li>
            Under &ldquo;Paper around the signature&rdquo;, choose White for a form upload or
            Transparent to place the signature on other documents, then download a PNG or JPG.
          </li>
        </ol>
      </section>
    </ToolPage>
  );
}
