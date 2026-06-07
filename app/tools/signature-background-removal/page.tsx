import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("signature-background-removal")!;

export const metadata = pageMetadata({
  title: "Signature Background Removal — Remove Paper, Keep Ink",
  description:
    "Remove the white paper background from a scanned signature and keep the " +
    "ink, with adjustable strength. Outputs a transparent PNG. No upload.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Signature Background Removal" slug={tool.slug} blurb={tool.blurb}>
      <SignatureWorkflowTool
        defaultTab="clean"
        autoCropDefault={false}
      />
    </ToolPage>
  );
}
