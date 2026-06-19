import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { StraightenPhotoTool } from "@/components/tools/StraightenPhotoTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("straighten-photo")!;

export const metadata = pageMetadata({
  title: "Straighten a Tilted Photo — Auto-Level Your Face, Free",
  description:
    "Automatically straighten a tilted passport or ID photo so your eyes are level. Detects the angle on your device and rotates it — no upload, free.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Straighten Tilted Photo"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "How does auto-straighten work?",
          a: "The tool finds your face on your device, measures the angle of the line between your eyes, and rotates the photo so that line is level. A tilted head is one of the most common reasons passport and exam photos get rejected, so levelling it improves your chances of acceptance.",
        },
        {
          q: "Can I adjust the angle myself?",
          a: "Yes. The slider starts at the auto-detected correction, and you can nudge it up to 15° either way for a perfect result. 'Reset to auto' returns to the detected angle at any time.",
        },
        {
          q: "Why is there a white border after straightening?",
          a: "Rotating a rectangle leaves small triangular gaps at the corners, which we fill with white so the image stays rectangular. After straightening, crop to your exam or portal's exact size with the resize tools — the white corners are removed in the crop.",
        },
        {
          q: "Is my photo uploaded?",
          a: "No. Face detection and rotation both run entirely in your browser. Only the face-detection model weights are downloaded once; your photo never leaves your device.",
        },
      ]}
    >
      <StraightenPhotoTool />
    </ToolPage>
  );
}
