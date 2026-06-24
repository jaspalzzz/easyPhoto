import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "PDF to Text — extract text from any PDF free — easyPhoto";

export default function Image() {
  return ogImage({
    title: "PDF to Text — Free Extractor",
    subtitle: "Extract embedded text from any PDF — copy or download as .txt. Nothing uploaded.",
  });
}
