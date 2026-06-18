import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_CLEANER_FAQ } from "@/lib/faqs";

const tool = getTool("signature-cleaner")!;

export const metadata = pageMetadata({
  title: "Photo to Signature Converter — Clean, Crop & Resize",
  description:
    "Turn a photo or image of your signature into a clean, form-ready signature — remove the paper background, " +
    "make it white or transparent, then crop and resize to PAN, passport or exam limits like 20 KB or 50 KB.",
  path: `/tools/${tool.slug}/`,
});

const BLURB =
  "Turn a photo of your handwritten signature into a clean, form-ready image — " +
  "remove the paper background, make it white or transparent, then crop and resize to spec.";

export default function Page() {
  return (
    <ToolPage title="Signature Cleaner & Resizer" slug={tool.slug} blurb={BLURB} faqItems={SIGNATURE_CLEANER_FAQ}>
      <SignatureWorkflowTool
        defaultTab="clean"
        autoCropDefault={true}
        defaultKb={20}
        toolName={tool.slug}
      />
    </ToolPage>
  );
}
