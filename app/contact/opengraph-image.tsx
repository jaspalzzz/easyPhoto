import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact easyPhoto — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Contact easyPhoto",
    subtitle: "Questions, spec corrections and feedback — get in touch.",
  });
}
