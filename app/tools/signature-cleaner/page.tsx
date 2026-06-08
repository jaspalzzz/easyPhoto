import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_CLEANER_FAQ } from "@/lib/faqs";

const tool = getTool("signature-cleaner")!;

export const metadata = pageMetadata({
  title: "Signature Cleaner & Resizer Online — Make Background White",
  description:
    "Clean scanned signatures online. Easily make background white or transparent, crop, resize, and compress " +
    "to meet PAN card, passport, or exam specifications like under 20 KB or 50 KB.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Signature Cleaner & Resizer" slug={tool.slug} blurb={tool.blurb} faqItems={SIGNATURE_CLEANER_FAQ}>
      <SignatureWorkflowTool
        defaultTab="clean"
        autoCropDefault={true}
        defaultKb={20}
        toolName={tool.slug}
      />
    </ToolPage>
  );
}
