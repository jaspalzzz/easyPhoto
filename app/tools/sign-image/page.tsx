import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { SignImageTool } from "@/components/tools/SignImageTool";
import { getTool } from "@/lib/toolsCatalog";
import { SIGN_IMAGE_FAQ } from "@/lib/faqs";

const tool = getTool("sign-image")!;

export const metadata = pageMetadata({
  title: "Sign Image & Photos Online — Draw or Add Signature",
  description:
    "Overlay your signature image or draw a signature on any photo or scanned document offline. " +
    "Completely client-side image signing with no server uploads.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Sign Image or Photo"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={SIGN_IMAGE_FAQ}
      footnote="Signing runs entirely on your device. Your photos and signature data are never uploaded."
    >
      <SignImageTool />
    </ToolPage>
  );
}
