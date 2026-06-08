import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { TRANSPARENT_SIGNATURE_FAQ } from "@/lib/faqs";

const tool = getTool("transparent-signature")!;

export const metadata = pageMetadata({
  title: "Transparent Signature PNG — Clean & Cropped",
  description:
    "Turn a signature scan into a clean, transparent, auto-cropped PNG ready to " +
    "drop into documents. Optionally darken the ink. Runs in your browser.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Transparent Signature PNG" slug={tool.slug} blurb={tool.blurb} faqItems={TRANSPARENT_SIGNATURE_FAQ}>
      <SignatureWorkflowTool
        defaultTab="clean"
        autoCropDefault={true}
      />
    </ToolPage>
  );
}
