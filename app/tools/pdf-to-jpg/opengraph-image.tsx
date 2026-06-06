import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "PDF to JPG Converter — easyPhoto";

export default function Image() {
  return ogImage({
    title: "PDF to JPG Converter",
    subtitle: "Turn PDF pages into images — private and free, nothing is uploaded.",
  });
}
