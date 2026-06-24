import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PanCardOcrTool } from "@/components/tools/PanCardOcrTool";

export const metadata = pageMetadata({
  title: "PAN Card OCR — Read PAN Number, Name & DOB Free",
  description:
    "Upload a photo of your PAN card and instantly extract the PAN number, name, father's name and date of birth. Free, on-device OCR — nothing uploaded.",
  path: "/tools/pan-card-ocr/",
});

export default function Page() {
  return (
    <ToolPage
      title="PAN Card OCR"
      slug="pan-card-ocr"
      blurb="Upload a photo or scan of your PAN card and extract the PAN number, name, father's name and date of birth automatically. Everything runs on-device — your PAN card image is never uploaded anywhere."
      footnote="Uses Tesseract.js — an open-source OCR engine — running as WebAssembly in your browser."
    >
      <PanCardOcrTool />
    </ToolPage>
  );
}
