import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_CROP_FAQ } from "@/lib/faqs";

const tool = getTool("signature-crop")!;

export const metadata = pageMetadata({
  title: "Signature Crop — Auto-Trim a Signature Scan",
  description:
    "Automatically crop a scanned or photographed signature tight to the ink, " +
    "with adjustable padding. Runs in your browser — nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Signature Crop" slug={tool.slug} blurb={tool.blurb} faqItems={SIGNATURE_CROP_FAQ}>
      <SignatureWorkflowTool
        defaultTab="crop"
        autoCropDefault={true}
      />
    </ToolPage>
  );
}
