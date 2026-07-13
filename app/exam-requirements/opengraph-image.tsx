import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Exam Photo & Signature Size Requirements — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Exam Photo & Signature Requirements",
    subtitle: "Recorded photo & signature sizes for SSC, UPSC, IBPS, SBI, RRB, NTA & more — with source status.",
  });
}
