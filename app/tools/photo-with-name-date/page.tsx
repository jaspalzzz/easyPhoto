import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { NameDatePhotoTool } from "@/components/tools/NameDatePhotoTool";
import { getTool } from "@/lib/toolsCatalog";
import { PHOTO_NAME_DATE_FAQ } from "@/lib/faqs";
import { Info } from "lucide-react";

const tool = getTool("photo-with-name-date")!;

export const metadata = pageMetadata({
  title: "Photo with Name and Date Generator — DOP Passport Resizer",
  description:
    "Create a digital name-and-date strip for forms that request one, including APPSC Direct Recruitment and Kerala PSC. Verify the current notice before use.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Photo with Name &amp; Date Generator"
      slug={tool.slug}
      blurb="Add a digital name-and-photography-date strip only when the current application instructions request one. The available presets cover APPSC Direct Recruitment and Kerala PSC; custom output is available for another documented form."
      faqItems={PHOTO_NAME_DATE_FAQ}
      footnote="All processing runs entirely on your device. Your photo data, name, and date are never uploaded."
    >
      <div className="mb-6 flex max-w-xl gap-2 rounded-md border border-brand/10 bg-brand-soft/30 p-4 text-sm leading-relaxed text-ink-soft">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p>
          Current UPSC, SSC and IBPS instructions do not list a digital
          name/date strip. Current Navy Agniveer and Agniveervayu notices instead
          require a physical black slate held in the photograph, which this tool
          cannot create. Confirm the current notice before preparing the image.
        </p>
      </div>
      <NameDatePhotoTool />
    </ToolPage>
  );
}
