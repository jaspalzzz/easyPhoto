import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { JpgToPdfTool } from "@/components/tools/JpgToPdfTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("jpg-to-pdf")!;

export const metadata: Metadata = {
  title: "JPG to PDF — Combine Images into a PDF (Free, Private)",
  description:
    "Combine JPG or PNG images into a single PDF, one image per page, in your " +
    "browser. Reorder and remove pages. Nothing is uploaded to any server.",
};

export default function Page() {
  return (
    <ToolPage title="JPG to PDF" slug={tool.slug} blurb={tool.blurb}>
      <JpgToPdfTool />
    </ToolPage>
  );
}
