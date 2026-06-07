import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_FAQ } from "@/lib/faqs";

const tool = getTool("signature-resize")!;

export const metadata = pageMetadata({
  title: "Signature Resize Tool – Resize Signature Online Free",
  titleAbsolute: true,
  description:
    "Resize your signature to exact pixels or a KB limit for online forms " +
    "(UPSC, SSC, bank, visa). Free, keeps transparency, processed in your browser.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Signature Resize"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={SIGNATURE_FAQ}
      footnote="Transparency is preserved in PNG output. Your file never leaves your device."
    >
      <SignatureWorkflowTool
        defaultTab="resize"
        autoCropDefault={true}
      />
    </ToolPage>
  );
}
