import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Reorder PDF Pages — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Reorder PDF Pages",
    subtitle: "Rearrange, rotate and delete PDF pages losslessly. Private and free.",
  });
}
