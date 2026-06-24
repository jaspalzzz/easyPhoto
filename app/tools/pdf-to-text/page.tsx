import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfToTextTool } from "@/components/tools/PdfToTextTool";

export const metadata = pageMetadata({
  title: "PDF to Text — Extract Text from Any PDF Free",
  description:
    "Extract all text from a PDF instantly — works on digitally-created PDFs. Copy or download as .txt. Free, nothing uploaded, runs in your browser.",
  path: "/tools/pdf-to-text/",
});

export default function Page() {
  return (
    <ToolPage
      title="PDF to Text"
      slug="pdf-to-text"
      blurb="Upload a PDF and extract all the embedded text — instantly copy it or download as a .txt file. Works on digitally-created PDFs (e-Aadhaar, bank statements, invoices). For scanned PDFs, use the Image to Text (OCR) tool."
      footnote="Uses PDF.js, an open-source PDF renderer from Mozilla, to extract text layers entirely in your browser."
    >
      <PdfToTextTool />
    </ToolPage>
  );
}
