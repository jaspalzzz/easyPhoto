import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "easyPhoto Blog — easyPhoto";

export default function Image() {
  return ogImage({
    title: "easyPhoto Blog",
    subtitle: "Guides on passport & visa photos, upload file-size limits and avoiding rejection.",
  });
}
