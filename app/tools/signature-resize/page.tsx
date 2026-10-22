import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_FAQ } from "@/lib/faqs";

const tool = getTool("signature-resize")!;

export const metadata = pageMetadata({
  title: "Signature Resize Tool – Resize Signature Online Free",
  titleAbsolute: true,
  description:
    "Resize your signature to exact pixels or a KB limit for online forms " +
    "(UPSC, SSC, bank, visa). Free, keeps transparency, processed in your browser.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Resize Signature Online"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={SIGNATURE_FAQ}
      footnote="Transparency is preserved in PNG output. Your file never leaves your device."
    >
      <SignatureWorkflowTool
        defaultTab="resize"
        autoCropDefault={true}
        targetFromUrl
      />

      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">Make your signature fit the form&apos;s KB or pixel limit</h2>
        <ol className="max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Upload the signature you made on paper, scanned or snapped with your phone.</li>
          <li>
            Tap your exam under Quick exam settings, or set the KB limit or the exact width and height
            your form gives.
          </li>
          <li>Look at it at full size before you save the resized file.</li>
        </ol>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Keep your original scan. Shrinking the same file again and again blurs thin strokes, so start
          from the original each time a different form asks for a different size.
        </p>
      </section>
    </ToolPage>
  );
}
