import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Auto-Crop Passport Photo — AI face detection crop — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Auto-Crop to Passport Spec",
    subtitle: "AI detects your face and crops to the correct passport size for your country. Free.",
  });
}
