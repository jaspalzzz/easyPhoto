import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "LinkedIn Photo Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "LinkedIn Photo Maker",
    subtitle:
      "A square profile picture, centred on your face — free, private, in your browser.",
  });
}
