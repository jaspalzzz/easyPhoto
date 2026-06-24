import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Face Centering AI — is my face centred in the passport photo? — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Face Centering AI",
    subtitle: "Visual overlay showing if your face is centred in a passport photo. On-device, nothing uploaded.",
  });
}
