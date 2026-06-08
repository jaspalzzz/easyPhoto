import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "SSC Photo Resizer — easyPhoto";

export default function Image() {
  return ogImage({
    title: "SSC Photo Resizer",
    subtitle: "Compress and crop passport photos to 20-50 KB for the Staff Selection Commission.",
  });
}
