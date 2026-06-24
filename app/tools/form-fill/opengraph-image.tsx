import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fill PDF Form online free — type into any AcroForm PDF — easyPhoto";

export default function Image() {
  return ogImage({
    title: "Fill PDF Form — Free",
    subtitle: "Upload a fillable PDF, type into each field, download the completed document. Nothing uploaded.",
  });
}
