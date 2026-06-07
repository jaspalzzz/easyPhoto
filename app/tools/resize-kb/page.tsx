import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { getTool } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { PHOTO_RESIZE_FAQ } from "@/lib/faqs";

const tool = getTool("resize-kb")!;

export const metadata = pageMetadata({
  title: "Resize Image by KB — Compress to an Exact File Size",
  description:
    "Compress a JPG or PNG to a target file size in KB, right in your browser. " +
    "Drops quality first, then dimensions, to land under your limit. No upload.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Resize Image by KB"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={PHOTO_RESIZE_FAQ}
    >
      <ResizeKbTool />

      <section className="mt-8">
        <h2 className="eyebrow mb-3">Resize to a specific size</h2>
        <div className="flex flex-wrap gap-2">
          {KB_TARGETS.map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
            >
              Resize to {kb} KB
            </Link>
          ))}
        </div>
      </section>
    </ToolPage>
  );
}
