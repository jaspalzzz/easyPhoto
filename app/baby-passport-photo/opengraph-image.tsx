import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Baby & Infant Passport Photo Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Baby & Infant Passport Photo",
    subtitle:
      "Lay your baby on a white sheet and prepare the selected passport-photo frame — free, in your browser.",
  });
}
