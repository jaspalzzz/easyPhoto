import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Add Page Numbers to PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Add Page Numbers to PDF",
    subtitle: "Number every page — choose the position, format and start value.",
  });
}
