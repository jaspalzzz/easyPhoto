import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Sign an Image — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Sign an Image",
    subtitle: "Add your signature to a photo or scanned document, right in your browser.",
  });
}
