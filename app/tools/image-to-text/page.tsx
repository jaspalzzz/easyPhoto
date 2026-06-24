import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ImageToTextTool } from "@/components/tools/ImageToTextTool";

export const metadata = pageMetadata({
  title: "Image to Text — Free OCR Online (English & Hindi)",
  description:
    "Extract text from any JPG, PNG, screenshot or scanned document instantly. Supports English and Hindi. Free, nothing uploaded — OCR runs on your device.",
  path: "/tools/image-to-text/",
});

export default function Page() {
  return (
    <ToolPage
      title="Image to Text (OCR)"
      slug="image-to-text"
      blurb="Upload any image — a photo, scan, or screenshot — and extract all the text from it. Supports English and Hindi. The OCR engine runs entirely on your device; your image is never uploaded."
      footnote="Text extraction uses Tesseract, an open-source OCR engine, running as WebAssembly in your browser."
    >
      <ImageToTextTool />
    </ToolPage>
  );
}
