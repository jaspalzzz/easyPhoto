import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { DocumentScannerTool } from "@/components/tools/DocumentScannerTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("document-scanner")!;

export const metadata = pageMetadata({
  title: "Document Scanner Online — Photo to Clean PDF, Free",
  description:
    "Scan documents with your phone camera and get a flat, evenly-lit PDF. Corrects the angle and removes shadows in your browser — no app, no upload, free.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Document Scanner"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "Are my documents uploaded anywhere?",
          a: "No. The photograph is opened, straightened, enhanced and turned into a PDF entirely inside your browser — the file never leaves your device and there is no account to create. That matters here more than on most tools, because the pages people scan are usually Aadhaar cards, PAN cards, marksheets and bank documents.",
        },
        {
          q: "Why do I place the corners myself instead of it detecting them?",
          a: "Automatic edge detection is unreliable on the surfaces people actually use — patterned desks, dark tabletops, a page with one corner in shadow. When it guesses wrong you have to undo it and correct it anyway, which is slower than simply dragging four handles. Placing them yourself takes a few seconds and works every time.",
        },
        {
          q: "What do the four enhancement modes do?",
          a: "Colour flattens the lighting but keeps the page's colours, which suits letterheads, stamps and certificates. Greyscale converts to neutral grey. Black & white uses a local threshold for the crispest text and the smallest file, and is usually the right choice for printed forms. Original applies no enhancement at all.",
        },
        {
          q: "Why does my photo look evenly lit after scanning?",
          a: "A phone photo carries the room's lighting with it — one corner bright, the opposite corner in shadow. The tool estimates that lighting across the page and divides it out, so the paper reads as white everywhere while the text keeps its contrast. A single brightness slider cannot do this, because the correction needed differs across the page.",
        },
        {
          q: "Can I scan more than one page into a single PDF?",
          a: "Yes. Add as many pages as you need — each gets its own corners and its own enhancement setting — and they are combined into one PDF in the order shown. New pages inherit the previous page's enhancement mode so a multi-page scan stays consistent.",
        },
        {
          q: "Does it work with iPhone photos?",
          a: "Yes. HEIC and HEIF files from an iPhone are converted automatically when you add them, so you do not need to change your camera format first.",
        },
        {
          q: "My scan needs to be under a size limit for an online form. What now?",
          a: "Export the PDF, then use the Compress PDF tool to bring it under the portal's exact KB limit. The scanner hands the file straight across, so you do not have to download and re-upload it.",
        },
      ]}
    >
      <DocumentScannerTool />
    </ToolPage>
  );
}
