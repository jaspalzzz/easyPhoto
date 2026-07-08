import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignImageTool } from "@/components/tools/SignImageTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGN_IMAGE_FAQ } from "@/lib/faqs";

const tool = getTool("sign-image")!;

export const metadata = pageMetadata({
  // Leads with the exact head term this page already ranks page-1 for
  // ("sign on image" / "sign on photo", ~120 impressions/90d in GSC) plus the
  // transactional "add signature to photo" phrasing, and stays short enough
  // that the "— easyPhoto" suffix keeps the rendered SERP title under 60 chars.
  title: "Add Signature to Photo & Sign on Image Online",
  description:
    "Add your signature to any photo or image online — draw it or upload a signature file. " +
    "Free, works fully in your browser, nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Sign on Picture or Photo Online"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={SIGN_IMAGE_FAQ}
      footnote="Signing runs entirely on your device. Your photos and signature data are never uploaded."
    >
      <div className="mb-4 rounded-lg border border-brand/25 bg-brand-soft/15 px-4 py-3 text-sm text-ink">
        Need the workflow first? Read{" "}
        <Link
          href="/blog/how-to-sign-on-image-online/"
          className="font-medium text-brand hover:underline"
        >
          how to sign on an image or add a signature to a photo
        </Link>
        .
      </div>
      <SignImageTool />
    </ToolPage>
  );
}
