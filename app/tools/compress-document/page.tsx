import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { CompressDocumentTool } from "@/components/tools/CompressDocumentTool";

export const metadata = pageMetadata({
  title: "Compress Document to KB — JPG, PNG or PDF",
  description:
    "Shrink any document — photo, scan, or PDF — to an exact KB target in one step. Auto-detects JPG, PNG and PDF. Free, nothing uploaded.",
  path: "/tools/compress-document/",
});

export default function Page() {
  return (
    <ToolPage
      title="Compress Document to KB"
      slug="compress-document"
      blurb="Drop any document — a scanned JPG, PNG or PDF — and compress it to an exact KB target. Auto-detects the format and applies the right compression. Nothing is uploaded."
      footnote="Your file is compressed entirely in your browser and is never uploaded."
    >
      <CompressDocumentTool />
    </ToolPage>
  );
}
