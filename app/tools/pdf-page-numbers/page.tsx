import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PdfPageNumbersTool } from "@/components/tools/PdfPageNumbersTool";
import { getTool } from "@/lib/toolsCatalog";
import type { FaqItem } from "@/components/site/Faq";

const tool = getTool("pdf-page-numbers")!;

export const metadata = pageMetadata({
  title: "Add Page Numbers to PDF Online — Free",
  titleAbsolute: true,
  description:
    "Add page numbers to a PDF online for free. Choose the position (corner or " +
    "edge), the format (1, 1 of 10, or Page 1) and the starting number. 100% private " +
    "— your PDF is processed in your browser and never uploaded.",
  path: `/tools/${tool.slug}/`,
});

const FAQS: FaqItem[] = [
  {
    q: "How do I add page numbers to a PDF?",
    a: "Upload your PDF, choose where the numbers should go (e.g. bottom center), pick a format, set the starting number, and download. Numbers are added to every page in your browser.",
  },
  {
    q: "Can I choose the position and format?",
    a: "Yes. Pick any of six positions (top/bottom × left/center/right) and a format: just the number (1), number of total (1 of 10), or a label (Page 1).",
  },
  {
    q: "Can I start numbering from a specific number, or skip a cover page?",
    a: "Yes. Set the 'start numbering at' value to any number. To effectively skip a cover page's visible number, you can start at 0 or adjust the start value to suit your document.",
  },
  {
    q: "Is it free and private?",
    a: "Completely free, no sign-up, no watermark. Your PDF is processed entirely on your device and never uploaded — the original page content stays intact and text remains selectable.",
  },
];

export default function Page() {
  return (
    <ToolPage
      title="Add Page Numbers to PDF"
      slug={tool.slug}
      blurb="Add page numbers to every page of a PDF — choose the position, the format (1, 1 of 10, or Page 1) and the starting number. Free and fully in your browser."
      faqItems={FAQS}
      footnote="Page numbers are added as real text and your PDF is never uploaded."
    >
      <PdfPageNumbersTool />
    </ToolPage>
  );
}
