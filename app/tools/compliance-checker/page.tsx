import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ComplianceCheckerTool } from "@/components/tools/ComplianceCheckerTool";
import { COMPLIANCE_CHECKER_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  title: "Pre-submission Exam Photo & Signature Check",
  description:
    "Compare an exam photo or signature with measurable requirements for file size, dimensions, format and background guidance. Free, private and processed in your browser.",
  path: "/tools/compliance-checker/",
});

export default function Page() {
  return (
    <ToolPage
      title="Pre-submission Photo & Signature Check"
      slug="compliance-checker"
      blurb="Compare your photo or signature with the selected exam's published requirements for file size, dimensions, format and background. It reports measurable issues; it cannot predict the portal's decision. Nothing is uploaded."
      faqItems={COMPLIANCE_CHECKER_FAQ}
      footnote="Your file is checked entirely in your browser and is never uploaded."
    >
      <ComplianceCheckerTool />
    </ToolPage>
  );
}
