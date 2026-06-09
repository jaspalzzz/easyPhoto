import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Unlock PDF — Remove Password — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Unlock PDF — Remove Password",
    subtitle: "Remove the password from a protected PDF (e-Aadhaar & more) — free, private, in your browser.",
  });
}
