import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignPdfTool } from "@/components/tools/SignPdfTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGN_PDF_FAQ } from "@/lib/faqs";

const tool = getTool("sign-pdf")!;

export const metadata = pageMetadata({
  title: "Sign PDF Online — Draw or Add Signature to PDF",
  description:
    "Add your signature image or draw a signature on any PDF page visually in your browser. " +
    "Secure, private client-side document signing with no server uploads.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Sign PDF Document"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={SIGN_PDF_FAQ}
      footnote="Signing runs entirely on your device. Your PDF pages and signature data are never uploaded."
    >
      <SignPdfTool />
    </ToolPage>
  );
}
