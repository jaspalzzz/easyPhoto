import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("resize-kb")!;

export const metadata: Metadata = {
  title: "Resize Image by KB — Compress to an Exact File Size",
  description:
    "Compress a JPG or PNG to a target file size in KB, right in your browser. " +
    "Drops quality first, then dimensions, to land under your limit. No upload.",
};

export default function Page() {
  return (
    <ToolPage title="Resize Image by KB" slug={tool.slug} blurb={tool.blurb}>
      <ResizeKbTool />
    </ToolPage>
  );
}
