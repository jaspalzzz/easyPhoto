import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "UPSC Photo Resizer — easyPhoto";

export default function Image() {
  return ogImage({
    title: "UPSC Photo Resizer",
    subtitle: "Compress and crop passport photos to 20-300 KB for the Union Public Service Commission.",
  });
}
