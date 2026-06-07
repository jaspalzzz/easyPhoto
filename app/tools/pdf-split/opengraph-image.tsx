import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Split PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Split PDF",
    subtitle: "Extract or split pages from a PDF losslessly, in your browser.",
  });
}
