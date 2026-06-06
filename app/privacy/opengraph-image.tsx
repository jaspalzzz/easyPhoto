import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Privacy Policy — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Privacy Policy",
    subtitle: "Your files never leave your device. Exactly how easyPhoto handles your data.",
  });
}
