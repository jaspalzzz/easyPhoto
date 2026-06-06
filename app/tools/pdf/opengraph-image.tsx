import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "PDF Tools — easyPhoto";

export default function Image() {
  return ogImage({
    title: "PDF Tools",
    subtitle: "Convert and manage PDFs — free, private, in your browser, no upload.",
  });
}
