import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Exam Application Kit — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Exam Application Kit",
    subtitle: "Photo + signature in the correct size for SSC, UPSC, IBPS, NEET & more. Private, in your browser.",
  });
}
