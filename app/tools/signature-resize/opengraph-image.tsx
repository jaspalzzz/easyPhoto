import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Resize Signature — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Resize Signature",
    subtitle: "Resize your signature to exact dimensions or file size — free and private.",
  });
}
