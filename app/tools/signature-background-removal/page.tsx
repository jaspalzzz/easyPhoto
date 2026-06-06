import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureCleanTool } from "@/components/tools/SignatureCleanTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("signature-background-removal")!;

export const metadata: Metadata = {
  title: "Signature Background Removal — Remove Paper, Keep Ink",
  description:
    "Remove the white paper background from a scanned signature and keep the " +
    "ink, with adjustable strength. Outputs a transparent PNG. No upload.",
};

export default function Page() {
  return (
    <ToolPage title="Signature Background Removal" slug={tool.slug} blurb={tool.blurb}>
      <SignatureCleanTool
        autoCrop={false}
        allowDarken={false}
        filename="signature-no-background.png"
      />
    </ToolPage>
  );
}
