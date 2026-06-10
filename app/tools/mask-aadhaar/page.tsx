import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { MaskDocumentTool } from "@/components/tools/MaskDocumentTool";
import { getTool } from "@/lib/toolsCatalog";
import type { FaqItem } from "@/components/site/Faq";

const tool = getTool("mask-aadhaar")!;

export const metadata = pageMetadata({
  title: "Mask Aadhaar Number Online — Hide First 8 Digits Free",
  titleAbsolute: true,
  description:
    "Mask your Aadhaar number online for free — hide the first 8 digits with a " +
    "permanent black redaction before you share or upload it. 100% private: your " +
    "Aadhaar is processed in your browser and never uploaded.",
  path: `/tools/${tool.slug}/`,
});

const FAQS: FaqItem[] = [
  {
    q: "How do I mask the first 8 digits of my Aadhaar number?",
    a: "Upload your Aadhaar image above, then drag a box across the first 8 digits of the 12-digit number. The digits are covered with a solid black bar that is burned into the image. Download the masked copy — only the last 4 digits remain visible, as UIDAI recommends.",
  },
  {
    q: "Is it safe to mask my Aadhaar here?",
    a: "Yes. Your Aadhaar image is never uploaded — all masking happens entirely in your browser on your own device. Nothing is sent to or stored on any server.",
  },
  {
    q: "Can someone remove the mask and see my number again?",
    a: "No. The black box is flattened into the image pixels (not an overlay layer), so the masked digits are permanently gone from the downloaded file — they cannot be peeled off or recovered.",
  },
  {
    q: "Why should I mask my Aadhaar before sharing it?",
    a: "UIDAI advises sharing a masked Aadhaar (showing only the last 4 digits) instead of the full number wherever possible, to reduce the risk of misuse. Many verification flows accept a masked Aadhaar.",
  },
  {
    q: "Can I mask other details too, like my address or photo?",
    a: "Yes. You can draw as many redaction boxes as you like — cover the number, address, date of birth, or any detail you don't want to share.",
  },
];

export default function Page() {
  return (
    <ToolPage
      title="Mask Aadhaar / Document"
      slug={tool.slug}
      blurb="Hide the first 8 digits of your Aadhaar number — or any sensitive detail — with a permanent black redaction before you share it. Everything runs in your browser; your document is never uploaded."
      faqItems={FAQS}
      footnote="The mask is burned into the image pixels and your file never leaves your device."
    >
      <MaskDocumentTool />
    </ToolPage>
  );
}
