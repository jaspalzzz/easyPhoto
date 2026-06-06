import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureCleanTool } from "@/components/tools/SignatureCleanTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("transparent-signature")!;

export const metadata: Metadata = {
  title: "Transparent Signature PNG — Clean & Cropped",
  description:
    "Turn a signature scan into a clean, transparent, auto-cropped PNG ready to " +
    "drop into documents. Optionally darken the ink. Runs in your browser.",
};

export default function Page() {
  return (
    <ToolPage title="Transparent Signature PNG" slug={tool.slug} blurb={tool.blurb}>
      <SignatureCleanTool
        autoCrop
        allowDarken
        filename="signature-transparent.png"
      />
    </ToolPage>
  );
}
