import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Image Crop — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Image Crop",
    subtitle: "Drag to crop any photo — free, private, runs in your browser.",
  });
}
