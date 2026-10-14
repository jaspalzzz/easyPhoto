import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { getTool } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { PHOTO_RESIZE_FAQ } from "@/lib/faqs";

const tool = getTool("resize-kb")!;

export const metadata = pageMetadata({
  title: "Photo Resizer in KB — Resize Image to 20, 50, 100 KB",
  description:
    "Resize a photo or image in KB online: type 20, 50, 100 or 200 KB and download a JPG " +
    "just under that limit. Works on your phone; nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Photo Resizer in KB"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={PHOTO_RESIZE_FAQ}
    >
      <ResizeKbTool targetFromUrl />

      <section className="mt-10 space-y-3 border-t border-hairline pt-8">
        <h2 className="text-lg font-semibold text-ink">
          How to resize a photo to 20 KB, 50 KB, 100 KB or 200 KB
        </h2>
        <ol className="max-w-2xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Upload your photo in the box above.</li>
          <li>
            In the Target size box, type the limit your form gives, such as 20, 50, 100 or 200.
            Forms often print it next to the upload button, for example &ldquo;Max size: 50 KB&rdquo;.
          </li>
          <li>
            Tap Compress to size, then download. The file stays under the limit whether the form
            counts 1 KB as 1,000 or 1,024 bytes.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">Or open the tool set to a common size:</p>
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
