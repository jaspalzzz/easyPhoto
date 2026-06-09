import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ComplianceCheckerTool } from "@/components/tools/ComplianceCheckerTool";
import { COMPLIANCE_CHECKER_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Checker — Will It Be Rejected?",
  description:
    "Check your exam photo or signature against the official spec before you upload — file size (KB), dimensions, format and background for SSC, UPSC, IBPS, SBI, RRB, NTA & more. Free, private, in your browser.",
  path: "/tools/compliance-checker/",
});

export default function Page() {
  return (
    <ToolPage
      title="Exam Photo & Signature Checker"
      slug="compliance-checker"
      blurb="Before you upload, check your photo or signature against your exam's official spec — file size, dimensions, format and background. Catch a rejection before the portal does. Nothing is uploaded."
      faqItems={COMPLIANCE_CHECKER_FAQ}
      footnote="Your file is checked entirely in your browser and is never uploaded."
    >
      <ComplianceCheckerTool />
    </ToolPage>
  );
}
