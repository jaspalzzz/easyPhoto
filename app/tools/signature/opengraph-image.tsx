import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Signature Tools — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Signature Tools",
    subtitle: "Crop, resize and clean up signatures for online forms — in your browser.",
  });
}
