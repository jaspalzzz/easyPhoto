import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Visa Photo Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Visa Photo Maker",
    subtitle: "Country-correct visa photo size, head proportion and background, made in your browser.",
  });
}
