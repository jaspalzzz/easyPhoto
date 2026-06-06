import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Background Remover — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Background Remover",
    subtitle: "Erase any photo background automatically — runs entirely in your browser.",
  });
}
