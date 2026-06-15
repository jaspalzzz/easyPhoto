import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Mask Aadhaar / Document — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Mask Aadhaar / Document",
    subtitle:
      "Hide the first 8 digits of your Aadhaar with a permanent black redaction — fully in your browser.",
  });
}
