import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Exam Photo & Signature Checker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Exam Photo & Signature Checker",
    subtitle: "Check size, dimensions & format against the official exam spec — before the portal rejects it.",
  });
}
