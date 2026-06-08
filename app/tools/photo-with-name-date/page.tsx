import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { NameDatePhotoTool } from "@/components/tools/NameDatePhotoTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("photo-with-name-date")!;

export const metadata = pageMetadata({
  title: "Photo with Name and Date Generator — DOP Passport Resizer",
  description:
    "Add your name and photo printing date (DOP) at the bottom of your passport photo. " +
    "Select presets for SSC, UPSC, and custom forms. Secure, private client-side processing.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Photo with Name &amp; Date Generator"
      slug={tool.slug}
      blurb={tool.blurb}
      footnote="All processing runs entirely on your device. Your photo data, name, and date are never uploaded."
    >
      <NameDatePhotoTool />
    </ToolPage>
  );
}
