import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Transparent Signature Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Transparent Signature Maker",
    subtitle: "Remove the background from your signature — free, in your browser.",
  });
}
