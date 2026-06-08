import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Resume / CV Photo Maker — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Resume / CV Photo Maker",
    subtitle:
      "A professional passport-size photo for your resume or CV — free, private, in your browser.",
  });
}
