import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Open & Unlock e-Aadhaar PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Open & Unlock Your e-Aadhaar PDF",
    subtitle: "The password + remove it for an unprotected copy — free, private, in your browser.",
  });
}
