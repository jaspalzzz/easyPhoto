import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureManualCropTool } from "@/components/tools/SignatureManualCropTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_CROP_FAQ } from "@/lib/faqs";

const tool = getTool("signature-crop")!;

export const metadata = pageMetadata({
  title: "Signature Crop — Crop a Signature Scan or Photo",
  description:
    "Crop a scanned or photographed signature tight to the ink — drag the box " +
    "or tap auto-detect. Runs in your browser; nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Signature Crop" slug={tool.slug} blurb={tool.blurb} faqItems={SIGNATURE_CROP_FAQ}>
      <SignatureManualCropTool />
    </ToolPage>
  );
}
