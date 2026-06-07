import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Sign PDF Online — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Sign PDF Online",
    subtitle: "Draw or upload your signature and place it on any PDF. 100% private, nothing uploaded.",
  });
}
