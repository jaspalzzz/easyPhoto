import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Resize Image Dimensions — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Resize Image Dimensions",
    subtitle: "Resize to exact pixel dimensions — free, private, in your browser.",
  });
}
