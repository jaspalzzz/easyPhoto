import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Free Image & PDF Tools — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Free Image & PDF Tools",
    subtitle: "Resize, compress, convert and clean up images & PDFs — nothing leaves your device.",
  });
}
