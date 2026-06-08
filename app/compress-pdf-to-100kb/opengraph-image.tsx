import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Compress PDF to 100KB — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Compress PDF to 100 KB",
    subtitle: "Shrink marksheets, certificates & documents under 100 KB — free, private, in your browser.",
  });
}
