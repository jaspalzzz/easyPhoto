import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Compress PDF to 500KB — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Compress PDF to 500 KB",
    subtitle: "Shrink marksheets, certificates & documents under 500 KB — free, private, in your browser.",
  });
}
