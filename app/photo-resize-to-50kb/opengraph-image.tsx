import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Resize Image to 50 KB — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Resize Image to 50 KB",
    subtitle: "Compress any JPG or PNG to exactly 50 KB — free, private, in your browser.",
  });
}
