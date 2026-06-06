import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "easyPhoto — free passport & visa photo maker";

export default function Image() {
  return ogImage({
    title: "Passport & Visa Photo Maker",
    subtitle:
      "Compliant size, head proportion and background for every country — plus free image & PDF tools.",
  });
}
