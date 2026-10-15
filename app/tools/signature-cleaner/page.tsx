import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGNATURE_CLEANER_FAQ } from "@/lib/faqs";

const tool = getTool("signature-cleaner")!;

export const metadata = pageMetadata({
  title: "Photo to Signature Converter — Clean, Crop & Resize",
  description:
    "Turn a phone photo of your signature into a form-ready one: clean the paper away, crop tight " +
    "to the ink and shrink it to your form's KB limit. Free.",
  path: `/tools/${tool.slug}/`,
});

// Its own job: phone photo → finished form signature (clean, crop, KB). Removing
// only the background is /tools/signature-background-removal/, so the two pages
// no longer compete for the same searches.
const BLURB =
  "Signed on paper and only have your phone? Snap the signature, upload the picture here, and the tool " +
  "wipes away the paper tone, trims the empty margin around the ink and shrinks the file under the cap " +
  "your application sets, ready for PAN, passport or exam uploads.";

export default function Page() {
  return (
    <ToolPage title="Signature Cleaner & Resizer" slug={tool.slug} blurb={BLURB} faqItems={SIGNATURE_CLEANER_FAQ}>
      <SignatureWorkflowTool
        defaultTab="clean"
        autoCropDefault={true}
        defaultKb={20}
        toolName={tool.slug}
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Just want the paper gone, without trimming or shrinking? Try{" "}
        <Link href="/tools/signature-background-removal/" className="font-medium text-brand hover:underline">
          Remove Background from Signature
        </Link>
        .
      </p>
    </ToolPage>
  );
}
