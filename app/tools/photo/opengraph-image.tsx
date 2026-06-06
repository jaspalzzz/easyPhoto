import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Photo Tools — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Photo Tools",
    subtitle: "Resize, compress and edit photos — free and private, in your browser.",
  });
}
