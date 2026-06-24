import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "PAN Card OCR — extract PAN number, name and DOB — easyPhoto";

export default function Image() {
  return ogImage({
    title: "PAN Card OCR",
    subtitle: "Extract PAN number, name, father's name and DOB from a photo — on-device, nothing uploaded.",
  });
}
