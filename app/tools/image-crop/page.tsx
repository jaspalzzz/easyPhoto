import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ImageCropTool } from "@/components/tools/ImageCropTool";
import { getTool } from "@/lib/toolsCatalog";
import { IMAGE_CROP_FAQ } from "@/lib/faqs";

const tool = getTool("image-crop")!;

export const metadata = pageMetadata({
  title: "Free Image Crop Tool – Crop Photos Online, No Upload",
  titleAbsolute: true,
  description:
    "Crop any image online for free — drag the box, lock the aspect ratio (1:1, 4:3, 16:9) " +
    "and download as PNG or JPG. Runs in your browser, nothing uploaded, no sign-up.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Image Crop"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={IMAGE_CROP_FAQ}
      footnote="Runs entirely in your browser — your image never leaves your device."
    >
      <ImageCropTool />
    </ToolPage>
  );
}
