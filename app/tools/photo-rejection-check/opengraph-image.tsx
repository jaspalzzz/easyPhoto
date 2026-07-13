import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Passport Photo Issue Checker — review measurable photo properties — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Passport Photo Issue Checker",
    subtitle: "Review measurable photo properties before submitting. Free, nothing uploaded.",
  });
}
