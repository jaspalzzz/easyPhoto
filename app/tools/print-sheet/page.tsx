import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PrintSheetTool } from "@/components/tools/PrintSheetTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("print-sheet")!;

export const metadata = pageMetadata({
  title: "Passport Photo Print Sheet — A4, A5, 4×6, 5×6 or 4×4 Inch",
  description:
    "Tile 4, 6 or 8 passport-size photos onto an A4, A5, 4×6, 5×6 or 4×4 inch sheet and download a print-ready JPG or PDF. Free, in-browser, nothing uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Passport Photo Print Sheet"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "What paper size should I choose?",
          a: "A4 (210×297 mm) is the standard paper at most Indian print shops, and A5 is half of it. Choose 4×6, 5×6 or 4×4 inch if you are printing at a photo kiosk (common in the US and UK) or if your studio asks for that size. All sheets are generated at 300 DPI.",
        },
        {
          q: "How many photos should I tile?",
          a: "For most Indian exam and government forms, a strip of 6 photos on A4 gives a comfortable size (roughly 3.5×4.5 cm each) and leaves space for the studio to cut. Choose 4 if you only need a few or if the individual photos are smaller.",
        },
        {
          q: "What do the grey lines on the sheet mean?",
          a: "They are cut guides — thin grey borders printed around each photo cell to help the studio cut them apart accurately. They do not appear on the final print as visible marks; most printers render a 1-pixel grey line as barely visible or invisible.",
        },
        {
          q: "What resolution is the output?",
          a: "The sheet is generated at 300 DPI. A4 at 300 DPI is 2480×3508 pixels and 4×6 inch is 1200×1800 pixels — both print-shop standard.",
        },
        {
          q: "Should I download the JPG or the PDF?",
          a: "Both contain the identical layout. Choose JPG to email or send over WhatsApp, or to print at a kiosk that accepts images. Choose PDF if your print shop prefers a document or you want the page sized to the exact paper dimensions — the PDF page matches the true millimetre size of the sheet you picked.",
        },
      ]}
    >
      <PrintSheetTool />
    </ToolPage>
  );
}
