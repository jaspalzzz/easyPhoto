import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Aadhaar Card OCR — extract number, name and DOB — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Aadhaar Card OCR",
    subtitle: "Extract Aadhaar number, name, DOB and address from a photo — on-device, nothing uploaded.",
  });
}
