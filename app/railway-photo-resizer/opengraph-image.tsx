import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Railway Photo Resizer — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Railway Photo Resizer",
    subtitle: "Compress and crop passport photos to 20-70 KB for the Railway Recruitment Board (RRB).",
  });
}
