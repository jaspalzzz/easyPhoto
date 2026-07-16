import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "SSC Photo with Name & Date: Not Required — easyPhoto";

export default function Image() {
  return ogImage({
    title: "SSC Photo with Name & Date: Not Required",
    subtitle: "Current SSC applications capture the photograph live and do not list a digital name-and-date strip.",
  });
}
