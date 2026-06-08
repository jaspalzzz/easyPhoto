import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Photo with Name and Date Generator — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Photo with Name & Date Generator",
    subtitle: "Add custom candidate name and photo printing date (DOP) at the bottom of your passport photo.",
  });
}
