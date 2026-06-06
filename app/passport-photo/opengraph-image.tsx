import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Passport Photo Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Passport Photo Maker",
    subtitle: "Auto-crop to your country's exact head size & background — free, private, in your browser.",
  });
}
