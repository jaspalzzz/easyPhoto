import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Crop Signature — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Crop Signature",
    subtitle: "Trim and crop your signature for uploads — free, in your browser.",
  });
}
