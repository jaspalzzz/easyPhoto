import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Document Tools — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Document Tools",
    subtitle: "Compress, convert and redact documents — free, nothing uploaded.",
  });
}
