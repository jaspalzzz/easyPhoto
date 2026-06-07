import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Image Format Converter — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Image Format Converter",
    subtitle: "Convert between JPG, PNG, WebP and HEIC. Batch, private, free.",
  });
}
