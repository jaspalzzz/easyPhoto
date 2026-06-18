import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { FormatConverterTool } from "@/components/tools/FormatConverterTool";
import {
  CONVERT_PAIRS,
  getConvertPair,
  convertPath,
  convertPairFaqs,
  relatedConvertPairs,
} from "@/lib/convertPairs";
import type { Crumb } from "@/lib/schema";

// Static export: one page per conversion pair (/convert/heic-to-jpg/, …).
export function generateStaticParams() {
  return CONVERT_PAIRS.map((p) => ({ pair: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const p = getConvertPair(pair);
  if (!p) return {};
  return pageMetadata({
    title: `Convert ${p.from} to ${p.to} — Free Online, No Upload`,
    titleAbsolute: true,
    description: `Convert ${p.from} images to ${p.to} online for free, right in your browser. Batch convert, no watermark, no sign-up — your files are never uploaded.`,
    path: convertPath(p.slug),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const p = getConvertPair(pair);
  if (!p) notFound();
  const related = relatedConvertPairs(p.slug);

  const pageTitle = `${p.from} to ${p.to} Converter`;
  const pagePath = convertPath(p.slug);
  const breadcrumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "Image Format Converter", path: "/tools/format-converter/" },
    { name: pageTitle, path: pagePath },
  ];

  return (
    <ToolPage
      title={pageTitle}
      path={pagePath}
      blurb={`Convert ${p.from} images to ${p.to} in your browser — free, batch-ready, and 100% private. ${p.reason}`}
      faqItems={convertPairFaqs(p)}
      footnote={`Your ${p.from} files are converted entirely on your device and never uploaded to a server.`}
      breadcrumbs={breadcrumbs}
    >
      <FormatConverterTool key={p.target} defaultTarget={p.target} />

      {/* Unique per-pair prose — differentiates each conversion page. */}
      <section className="mt-10 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {p.from} vs {p.to}: what changes
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.detail}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="eyebrow mb-3">Other conversions</h2>
          <div className="flex flex-wrap gap-1.5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={convertPath(r.slug)}
                className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
              >
                {r.from} to {r.to}
              </Link>
            ))}
            <Link
              href="/tools/format-converter/"
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft/50"
            >
              All formats
            </Link>
          </div>
        </section>
      )}
    </ToolPage>
  );
}
