import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Watermark PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Watermark PDF",
    subtitle: "Stamp a text watermark (CONFIDENTIAL, DRAFT…) across every page.",
  });
}
