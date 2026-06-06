import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Terms of Use — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Terms of Use",
    subtitle: "The terms for using easyPhoto's free, in-browser tools.",
  });
}
