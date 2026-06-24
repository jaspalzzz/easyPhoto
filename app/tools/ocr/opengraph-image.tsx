import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "OCR Tools — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Image to Text (OCR)",
    subtitle: "Extract text from any image or scan — free, nothing uploaded.",
  });
}
