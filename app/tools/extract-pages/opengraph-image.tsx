import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Extract PDF Pages — pull specific pages from any PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Extract PDF Pages",
    subtitle: "Pick and pull specific pages from any PDF — certificate, marksheet, or section. Nothing uploaded.",
  });
}
