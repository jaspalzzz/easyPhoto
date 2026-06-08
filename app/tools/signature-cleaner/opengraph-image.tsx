import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Signature Cleaner & Resizer — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Signature Cleaner & Resizer",
    subtitle: "Clean background, auto-crop, make white background, resize, and compress.",
  });
}
