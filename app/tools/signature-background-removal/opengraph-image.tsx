import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Signature Background Remover — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Signature Background Remover",
    subtitle: "Make your signature's background transparent — free, in your browser.",
  });
}
