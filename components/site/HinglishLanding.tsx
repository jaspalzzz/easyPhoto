import { notFound } from "next/navigation";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { SignatureKbTool } from "@/components/tools/SignatureKbTool";
import { WhiteBackgroundTool } from "@/components/tools/WhiteBackgroundTool";
import { getHinglishPage } from "@/lib/hinglishPages";

/** Renders a Hinglish landing page over an existing tool, from its config. */
export function HinglishLanding({ slug }: { slug: string }) {
  const page = getHinglishPage(slug);
  if (!page) notFound();

  return (
    <ToolPage title={page.h1} blurb={page.blurb} faqItems={page.faqs}>
      {page.tool === "signature-kb" ? (
        <SignatureKbTool kb={page.kb} toolName={slug} />
      ) : page.tool === "white-bg" ? (
        <WhiteBackgroundTool />
      ) : (
        <ResizeKbTool defaultKb={page.kb} toolName={slug} />
      )}
    </ToolPage>
  );
}
