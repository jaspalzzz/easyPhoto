import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About easyPhoto — easyPhoto";

export default function Image() {
  return ogImage({
    title: "About easyPhoto",
    subtitle: "Free, private passport & visa photos and image tools — built browser-first.",
  });
}
