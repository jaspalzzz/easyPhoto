import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { DpiConverterTool } from "@/components/tools/DpiConverterTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("dpi-converter")!;

export const metadata = pageMetadata({
  title: "Change Image DPI to 200 or 300 — Without Re-Compressing",
  description:
    "Set a JPG's DPI to 200 (NSDL PAN) or 300 for printing, in your browser. Rewrites the DPI tag only — pixels stay byte-for-byte identical. Nothing uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Change Image DPI"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "Does changing the DPI affect image quality?",
          a: "No. DPI (dots per inch) is just a metadata tag in the file header that tells a printer or a portal how large to render the image. This tool rewrites only that tag — the actual pixels are left byte-for-byte unchanged, so there is zero quality loss and the file size barely changes.",
        },
        {
          q: "Why does NSDL PAN ask for 200 DPI?",
          a: "The NSDL PAN application portal checks the declared DPI in the scanned photo and signature. If the scan was saved at 72 DPI (the browser/phone default), the portal can reject it even when the pixel dimensions are correct. Setting the tag to 200 DPI satisfies that check without re-scanning.",
        },
        {
          q: "What DPI should I use for printing a passport photo?",
          a: "300 DPI is the print-shop standard for photo prints. At 300 DPI a 35×45 mm passport photo needs roughly 413×531 pixels. For document scans some portals ask for 200 or 600 DPI — use the custom field if your form specifies a different value.",
        },
        {
          q: "Does it work on PNG files?",
          a: "This tool edits the JFIF DPI tag used by JPG files, which is what Indian government portals read. PNG stores resolution differently (a pHYs chunk) and most portals expect JPG anyway. Convert a PNG to JPG with the format converter first, then set its DPI here.",
        },
      ]}
    >
      <DpiConverterTool />
    </ToolPage>
  );
}
