import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getCategory, TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolCard } from "@/components/site/ToolCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";

const CATEGORY_DEPTH: Record<
  string,
  { heading: string; paragraphs: readonly string[]; steps: readonly string[] }
> = {
  signature: {
    heading: "Choose a signature workflow by the required output",
    paragraphs: [
      "Start with a sharp photograph or scan of dark ink on clean, unruled paper. Crop removes unused space; cleaning separates ink from paper texture; resizing prepares a requested canvas or KB band; and transparent export is intended for placing the mark in another document. These are separate operations, so choose the tool that matches the receiving form rather than changing more than necessary.",
      "Application portals do not share one signature rule. Some list JPEG on white, others publish a file-size range, and a transparent PNG may be useful only for document placement. Use an exam-specific preset when one is available and read the current form instructions before uploading. The tools preserve your local file workflow but cannot verify identity or authorisation.",
      "A practical sequence is to capture once, preserve the original, then make separate copies for cleaning, cropping and portal export. Reusing an already compressed download for another form can thin the pen strokes and introduce blocky edges. Return to the clean source whenever a different portal asks for a new format or canvas.",
    ],
    steps: ["Capture every stroke", "Prepare the requested format", "Inspect the downloaded file"],
  },
  ocr: {
    heading: "Turn visible characters into editable text, then proofread",
    paragraphs: [
      "OCR is most reliable on straight, high-contrast documents with sharp lettering. The general image reader handles photographs, screenshots and scans, while the PAN and Aadhaar readers organise likely fields for easier checking. Processing stays in the browser; the result is a transcription aid and is not an identity or document-validity check.",
      "Names, dates and identification numbers deserve character-by-character review. Similar shapes can be confused, mixed-language cards can produce uneven results, and a scan without a selectable text layer needs OCR rather than PDF text extraction. Keep the original beside the result, copy only what you need, and use the issuing authority's service when actual verification is required.",
      "The tools do not send extracted text to a search service or account. You decide what to copy and where to paste it. For long documents, work page by page and keep headings with their paragraphs so the resulting text remains understandable after the visual layout is removed.",
    ],
    steps: ["Use a glare-free source", "Select the right language", "Verify sensitive fields"],
  },
  pdf: {
    heading: "Work on the PDF locally and verify the final document",
    paragraphs: [
      "The PDF tools cover different stages: merge related files, split or extract requested pages, reorder scans, compress a large document, add page numbers, fill interactive fields, or place a signature where that is permitted. Choose the smallest operation that solves the problem so the source remains easy to audit.",
      "Every result should be opened before it is submitted. Confirm page count, order, orientation, readability and file size, and keep the original until the application is complete. A smaller or rearranged PDF can still be incomplete if a reverse side, continuation page, stamp or signature was left out. Password-protected or script-driven forms may require the issuer's own workflow.",
      "If several changes are needed, plan their order: arrange and remove pages first, fill or sign next, and compress last. That avoids compressing pages multiple times and makes it easier to compare the final document with the source. Use clear filenames so the prepared copy is not mistaken for the untouched original.",
    ],
    steps: ["Keep the original", "Change only what is needed", "Reopen and inspect the result"],
  },
  document: {
    heading: "Prepare only the document the form asks for",
    paragraphs: [
      "Document workflows often combine photographs, scans and PDFs. Use compression when the upload has a file-size cap, extraction when only selected pages are requested, OCR when you need editable text, and masking when a recipient should not receive every visible identifier. The correct choice depends on the form, not simply on making the file smaller.",
      "Preserve legibility and context throughout the process. Check names, numbers, seals, signatures and page order after every conversion, and avoid repeated compression of an already reduced copy. These browser tools do not certify a document or decide which evidence an authority will accept; the current application instructions remain the source for required pages, formats and limits.",
      "Sensitive records often contain more data than one upload slot needs. Extract only the relevant pages and mask an identifier only when the recipient permits it. Keep an unmodified source privately, because a later verification step may require the complete record rather than the reduced sharing copy.",
    ],
    steps: ["Read the upload slot", "Use the least destructive tool", "Check every final page"],
  },
};

/** A category landing page (e.g. /tools/photo) listing that category's tools. */
export function CategoryPage({ slug }: { slug: string }) {
  const cat = getCategory(slug);
  if (!cat) notFound();
  const tools = cat.tools.filter((t) => t.ready);
  const others = TOOLS_CATALOG.filter((g) => g.slug !== slug);

  return (
    <div className="container max-w-5xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
            { name: cat.group, path: `/tools/${cat.slug}/` },
          ]),
          collectionPageSchema({
            name: `Free ${cat.group}`,
            description: cat.tagline,
            url: `/tools/${cat.slug}/`,
          }),
        ]}
      />
      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All tools
      </Link>

      <header className="mt-5 max-w-2xl space-y-2.5 border-b border-hairline pb-7">
        <span className="eyebrow block text-brand">{tools.length} free tools · nothing uploaded</span>
        <h1 className="text-[1.8rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.25rem]">
          Free {cat.group}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{cat.tagline}</p>
      </header>

      <div className="ep-card-grid mt-8 sm:!grid-cols-2 lg:!grid-cols-3">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            title={tool.title}
            blurb={tool.blurb}
            icon={tool.icon}
          />
        ))}
      </div>

      {CATEGORY_DEPTH[slug] && (
        <section className="mt-12 rounded-xl border border-hairline bg-paper p-5 sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            {CATEGORY_DEPTH[slug].heading}
          </h2>
          <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            {CATEGORY_DEPTH[slug].paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            {CATEGORY_DEPTH[slug].steps.map((step, index) => (
              <li key={step} className="rounded-lg bg-accent/40 p-3 text-muted-foreground">
                <span className="mr-1.5 font-semibold text-brand">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-12 border-t border-hairline pt-6">
        <h2 className="eyebrow mb-3">
          More tool categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {others.map((g) => (
            <Link
              key={g.slug}
              href={`/tools/${g.slug}/`}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
            >
              {g.group}
            </Link>
          ))}
          <Link
            href="/tools/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-ink/30 hover:bg-accent/40"
          >
            All tools
          </Link>
        </div>
      </section>
    </div>
  );
}
