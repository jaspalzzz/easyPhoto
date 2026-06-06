import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Resize Image to Exact KB — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Resize Image to Exact KB",
    subtitle: "Compress any image to a target file size — free and private, in your browser.",
  });
}
