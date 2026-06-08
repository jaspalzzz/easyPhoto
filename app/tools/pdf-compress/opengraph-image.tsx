import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Compress PDF to a size limit — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Compress PDF to 100KB, 200KB or 500KB",
    subtitle: "Shrink marksheets, certificates and documents to fit upload limits. Private, in your browser.",
  });
}
