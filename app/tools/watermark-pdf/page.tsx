import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { WatermarkPdfTool } from "@/components/tools/WatermarkPdfTool";
import { getTool } from "@/lib/toolsCatalog";
import type { FaqItem } from "@/components/site/Faq";

const tool = getTool("watermark-pdf")!;

export const metadata = pageMetadata({
  title: "Watermark PDF Online — Add a Text Watermark Free",
  titleAbsolute: true,
  description:
    "Add a text watermark (CONFIDENTIAL, DRAFT, COPY…) across every page of a PDF " +
    "online for free. Adjustable opacity and angle. 100% private — your " +
    "PDF is processed in your browser and never uploaded.",
  path: `/tools/${tool.slug}/`,
});

const FAQS: FaqItem[] = [
  {
    q: "How do I add a watermark to a PDF?",
    a: "Upload your PDF, type the watermark text (or pick a preset like CONFIDENTIAL or DRAFT), set the opacity, and download. The watermark is drawn across every page. Everything runs in your browser.",
  },
  {
    q: "Is it free, and is my PDF uploaded?",
    a: "It's completely free with no watermark on the output beyond the one you add, and no sign-up. Your PDF is processed entirely on your device — it's never uploaded to any server.",
  },
  {
    q: "Does the watermark stay selectable text?",
    a: "Yes. The watermark is added as real vector text layered over each page, and the original page content (text, images) is preserved — the PDF is not flattened to images.",
  },
  {
    q: "Can I make the watermark lighter or change its angle?",
    a: "Yes. Use the opacity slider to make it subtle or bold, and the angle slider to set any rotation from horizontal (0°) to diagonal (45°).",
  },
];

export default function Page() {
  return (
    <ToolPage
      title="Watermark PDF"
      slug={tool.slug}
      blurb="Stamp a text watermark across every page of a PDF — CONFIDENTIAL, DRAFT, COPY, or your own text. Adjustable opacity and angle. Free and fully in your browser."
      faqItems={FAQS}
      footnote="The watermark is added as real text and your PDF is never uploaded."
    >
      <WatermarkPdfTool />
    </ToolPage>
  );
}
