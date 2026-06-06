import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "White Background Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "White Background Maker",
    subtitle: "Put any photo on a clean white background — free and private.",
  });
}
