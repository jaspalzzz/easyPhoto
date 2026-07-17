import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "UPSC Signature Resizer — easyPhoto";

export default function Image() {
  return ogImage({
    title: "UPSC Signature Resizer",
    subtitle: "Clean background and compress signature to 20-100 KB for the Union Public Service Commission.",
  });
}
