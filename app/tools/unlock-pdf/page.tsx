import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { UnlockPdfTool } from "@/components/tools/UnlockPdfTool";
import { UNLOCK_PDF_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Unlock PDF — Remove PDF Password Online Free (e-Aadhaar)",
  description:
    "Remove the password from a protected PDF and download an unprotected copy — works for the e-Aadhaar PDF, bank statements and more. 100% private: the PDF and password never leave your browser.",
  path: "/tools/unlock-pdf/",
});

export default function Page() {
  return (
    <ToolPage
      title="Unlock PDF — Remove Password"
      slug="unlock-pdf"
      blurb="Remove the password from a protected PDF (like the e-Aadhaar) and get an unprotected copy to view, print or upload. The PDF and its password are processed entirely in your browser — nothing is uploaded."
      faqItems={UNLOCK_PDF_FAQ}
      footnote="Your PDF and its password stay on your device and are never uploaded."
    >
      <UnlockPdfTool />
    </ToolPage>
  );
}
