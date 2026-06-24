import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Passport Photo Rejection Check — will my photo be accepted? — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Passport Photo Rejection Check",
    subtitle: "Check your photo against ICAO criteria before submitting. Free, nothing uploaded.",
  });
}
