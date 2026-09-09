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

      {/* Before → after illustration: shows what the tool does (upload a photo,
          get it back with a signature placed on it). A diagram, not a real
          screenshot — kept schematic so it makes no claim about a specific
          output. currentColor makes it theme-adapt; the signature + arrow carry
          the brand accent via text-brand. */}
      <figure className="mb-6 rounded-xl border border-hairline bg-paper p-5 text-ink-soft">
        <svg
          viewBox="0 0 560 210"
          style={{ maxWidth: "100%", height: "auto", fontFamily: "'Inter', system-ui, sans-serif" }}
          role="img"
          aria-label="Before and after: a plain photo on the left, an arrow, then the same photo on the right with a handwritten signature placed across the lower part of the image."
        >
          <title>How signing on an image works</title>
          <desc>
            On the left, a photo or scanned document with no signature. An arrow
            points right to the same photo with a handwritten signature added over
            it — the result the Sign on Image tool produces, entirely in your browser.
          </desc>

          {/* ── BEFORE card ── */}
          <g>
            <rect x="20" y="20" width="190" height="150" rx="10" fill="currentColor" opacity="0.04" />
            <rect x="20" y="20" width="190" height="150" rx="10" fill="none" stroke="currentColor" opacity="0.25" strokeWidth="1.5" />
            {/* portrait suggestion */}
            <circle cx="115" cy="72" r="24" fill="currentColor" opacity="0.14" />
            <path d="M78 128 Q115 92 152 128" fill="currentColor" opacity="0.14" />
            {/* empty signature line */}
            <line x1="48" y1="150" x2="182" y2="150" stroke="currentColor" opacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="115" y="192" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.6">Your photo</text>
          </g>

          {/* ── arrow ── */}
          <g className="text-brand">
            <line x1="240" y1="95" x2="312" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M304 86 L318 95 L304 104" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* ── AFTER card ── */}
          <g>
            <rect x="350" y="20" width="190" height="150" rx="10" fill="currentColor" opacity="0.04" />
            <rect x="350" y="20" width="190" height="150" rx="10" fill="none" stroke="currentColor" opacity="0.25" strokeWidth="1.5" />
            {/* portrait suggestion */}
            <circle cx="445" cy="72" r="24" fill="currentColor" opacity="0.14" />
            <path d="M408 128 Q445 92 482 128" fill="currentColor" opacity="0.14" />
            {/* signature line + handwritten signature on it (brand accent) */}
            <line x1="378" y1="150" x2="512" y2="150" stroke="currentColor" opacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
            <path
              className="text-brand"
              d="M384 150 c6 -18 12 -22 15 -10 c2 8 -4 20 -9 22 c8 -4 18 -14 26 -20 c-2 8 -4 14 0 14 c6 0 12 -10 18 -14 c-2 8 -1 12 4 12 c8 0 16 -12 24 -14 c-4 8 0 12 8 12 c10 0 18 -6 22 -10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="445" y="192" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.6">Signed &amp; ready to download</text>
          </g>
        </svg>
      </figure>

      <SignImageTool />

      {/* Distinct job sections. This page already ranks for several separate
          phrasings ("overlap signature on photo", "add signature to photo",
          "photo to signature converter") that are genuinely different tasks;
          giving each its own heading and answer on the same URL serves those
          queries without splitting into thin new pages. The converter is a
          different tool, so that section cross-links rather than pretending
          this page does it. */}
      <section className="mt-10 space-y-8 border-t border-hairline pt-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            Overlap a signature on a photo
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Drop your photo into the tool above, then draw your signature or add
            a signature image on top of it. Drag it to position, resize it, and
            download the combined image — the signature sits over the photo, not
            beside it.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            Add a signature to an exam or application photo
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Some forms ask for your signature written across the photograph. Add
            it here, then size the result to your form&apos;s KB limit with the{" "}
            <Link href="/tools/resize-kb/" className="font-medium text-brand hover:underline">
              resize-to-KB tool
            </Link>
            . If the form wants your name and date on the photo instead, use the{" "}
            <Link href="/tools/photo-with-name-date/" className="font-medium text-brand hover:underline">
              name &amp; date tool
            </Link>
            .
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            Turn a photo of your signature into a clean signature
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            If you have a photo or scan of your signature on paper and want it
            cleaned up on a transparent or white background, that is a different
            job — use the{" "}
            <Link href="/tools/signature-cleaner/" className="font-medium text-brand hover:underline">
              photo-to-signature converter
            </Link>
            , then bring the result back here to place it on your photo.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
