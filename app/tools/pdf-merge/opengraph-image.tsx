import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Merge PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Merge PDF Files",
    subtitle: "Combine multiple PDFs into one, client-side. Text stays selectable.",
  });
}
