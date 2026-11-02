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
          a: "A4 (210×297 mm) is the standard paper at most Indian print shops, and A5 is half of it. Choose 4×6, 5×6 or 4×4 inch if you are printing at a photo kiosk or your studio asks for that size.",
        },
        {
          q: "What photo size will be printed?",
          a: "Pick the size first: 35×45 mm is used for India, the UK, Schengen visas and many others, and 2×2 inch (51×51 mm) is the US size. Then choose 4, 6 or 8 copies; the tool shows how many fit on the paper, and \"Fill sheet\" uses all of them. \"Fill the grid\" is only for prints with no fixed size.",
        },
        {
          q: "What do the grey lines on the sheet mean?",
          a: "They are cut guides: a thin light-grey line printed around each photo. Cut along the line so no grey edge is left on the photo.",
        },
        {
          q: "What resolution is the output?",
          a: "300 DPI. An A4 sheet is 2480×3508 pixels and a 4×6 inch sheet is 1200×1800 pixels.",
        },
        {
          q: "Should I download the JPG or the PDF?",
          a: "Both contain the identical layout. Choose JPG to email or send over WhatsApp, or to print at a kiosk that accepts images. Choose PDF if your print shop prefers a document or you want the page sized to the exact paper dimensions — the PDF page matches the true millimetre size of the sheet you picked.",
        },
      ]}
    >
      <PrintSheetTool />

      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">Getting prints that come out the right size</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The sheet only works if the photo on it is already right. Make it first in the passport
          photo maker for your country, so the head size and background are set, then tile it here.
          This tool places copies at the size you pick; it does not crop to a head-height rule.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Most wrong-sized prints come from the print settings, not the file. Ask for, or choose,
          &ldquo;actual size&rdquo; or 100%. &ldquo;Fit to page&rdquo; and borderless printing both
          scale the sheet, so every photo comes out slightly smaller or larger. Before cutting,
          measure one photo with a ruler: a 35×45 mm photo should measure exactly that.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Print on matte or glossy photo paper rather than plain paper, which looks dull and can
          smudge. Plenty of applications want no print at all: most Indian exam forms and online
          visa portals take an uploaded file instead, which you can bring under the form&apos;s
          limit with Compress Image to KB.
        </p>
      </section>
    </ToolPage>
  );
}
