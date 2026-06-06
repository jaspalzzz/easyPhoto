import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureCropTool } from "@/components/tools/SignatureCropTool";
import { getTool } from "@/lib/toolsCatalog";

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
    <ToolPage title="Signature Crop" slug={tool.slug} blurb={tool.blurb}>
      <SignatureCropTool />
    </ToolPage>
  );
}
