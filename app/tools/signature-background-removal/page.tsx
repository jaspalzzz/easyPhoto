import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_BG_REMOVAL_FAQ } from "@/lib/faqs";

const tool = getTool("signature-background-removal")!;

export const metadata = pageMetadata({
  // Searchers' words: "signature background remover", "remove background from
  // signature", "signature white background" (GSC, 28 days to 13 Oct 2026).
  title: "Remove Background from Signature — White or Transparent",
  description:
    "Remove the paper background from a signature photo or scan. Download it on solid white " +
    "as a JPG for forms, or as a transparent PNG for documents. Free.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage title="Remove Background from Signature" slug={tool.slug} blurb={tool.blurb} faqItems={SIGNATURE_BG_REMOVAL_FAQ}>
      <SignatureWorkflowTool
        defaultTab="clean"
        autoCropDefault={false}
      />

      <section className="mt-10 space-y-2 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">White background or transparent?</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Pick <strong className="font-semibold text-ink">Solid White JPG</strong> when a form such as
          PAN or an exam portal asks for a JPG: the paper becomes clean white. Pick{" "}
          <strong className="font-semibold text-ink">Transparent PNG</strong> when you will place the
          signature on a document or photo, so no white box shows around it;{" "}
          <Link href="/tools/sign-image/" className="font-medium text-brand hover:underline">
            Sign on Photo
          </Link>{" "}
          puts it in place.
        </p>
      </section>
    </ToolPage>
  );
}
