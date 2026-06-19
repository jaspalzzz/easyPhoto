import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PhotoSignatureMergeTool } from "@/components/tools/PhotoSignatureMergeTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("photo-signature-merge")!;

export const metadata = pageMetadata({
  title: "Merge Photo and Signature into One Image — Free, Private",
  description:
    "Combine your passport photo and signature into a single image for forms that need both together. Stacked or side-by-side, in your browser. Nothing uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Photo + Signature Merger"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "Why would I need my photo and signature on one image?",
          a: "Some application and exam forms ask you to paste a photo and signature together in a single box, or to upload one combined image rather than two separate files. This tool composites them onto one clean white canvas so you can do that in one step.",
        },
        {
          q: "Should I choose stacked or side-by-side?",
          a: "Stacked (photo on top, signature below) matches the most common form layout where the photo box sits above the signature box. Choose side-by-side if your form has the two boxes next to each other. You can switch and re-merge instantly.",
        },
        {
          q: "Does it clean up my signature?",
          a: "Yes — the tool automatically trims the empty white space around your signature so it sits tight next to your photo, even if you scanned it on a large sheet of paper. For the cleanest result, sign in dark ink on plain white paper.",
        },
        {
          q: "Is anything uploaded to a server?",
          a: "No. Both images are read and combined entirely in your browser using JavaScript and the HTML canvas. Neither your photo nor your signature ever leaves your device.",
        },
      ]}
    >
      <PhotoSignatureMergeTool />
    </ToolPage>
  );
}
