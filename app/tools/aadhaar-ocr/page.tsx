import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { AadhaarOcrTool } from "@/components/tools/AadhaarOcrTool";

export const metadata = pageMetadata({
  title: "Aadhaar Card OCR — Read Aadhaar Number, Name & DOB Free",
  description:
    "Upload a photo of your Aadhaar card and instantly extract the Aadhaar number, name, DOB, gender and address. Free, on-device OCR — nothing uploaded.",
  path: "/tools/aadhaar-ocr/",
});

export default function Page() {
  return (
    <ToolPage
      title="Aadhaar Card OCR"
      slug="aadhaar-ocr"
      blurb="Upload a photo of your Aadhaar card — front side — and extract the Aadhaar number, name, date of birth, gender and address automatically. The OCR engine runs entirely on your device; your Aadhaar image is never uploaded to any server."
      footnote="Uses Tesseract.js — an open-source OCR engine — running as WebAssembly in your browser."
    >
      <AadhaarOcrTool />
    </ToolPage>
  );
}
