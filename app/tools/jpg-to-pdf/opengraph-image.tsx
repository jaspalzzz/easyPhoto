import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "JPG to PDF Converter — easyPhoto";

export default function Image() {
  return ogImage({
    title: "JPG to PDF Converter",
    subtitle: "Combine images into a single PDF instantly — in your browser, no upload.",
  });
}
