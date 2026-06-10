import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { CONVERT_PAIRS, convertPath } from "@/lib/convertPairs";
import { TrustPills } from "@/components/site/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Image Format Converter — HEIC, WebP, PNG, JPG",
  description:
    "Convert images between HEIC, WebP, PNG and JPG online for free. Batch " +
    "convert in your browser — no watermark, no sign-up, and nothing is uploaded.",
  path: "/convert/",
});

/** Group the conversion pairs by their source format for a tidy directory. */
const SOURCE_ORDER = ["HEIC", "WebP", "PNG", "JPG"] as const;

const SOURCE_BLURB: Record<string, string> = {
  HEIC: "The format iPhones save photos in — convert it to something every site and app accepts.",
  WebP: "Common on the web but awkward to edit or upload — convert it to a universal format.",
  PNG: "Lossless but large — convert to JPG or WebP to shrink the file size.",
  JPG: "Convert to PNG for lossless edits and transparency, or to WebP for smaller files.",
};

export default function ConvertHubPage() {
  const groups = SOURCE_ORDER.map((source) => ({
    source,
    pairs: CONVERT_PAIRS.filter((p) => p.from === source),
  })).filter((g) => g.pairs.length > 0);

  return (
    <div className="container max-w-5xl py-12">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/" },
          { name: "Image Format Converter", path: "/convert/" },
        ])}
      />

      <header className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Image Format Converter
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Convert images between HEIC, WebP, PNG and JPG — free, batch-ready, and
          100% private. Every conversion runs entirely in your browser, so your
          files are never uploaded.
        </p>
        <div className="pt-1">
          <TrustPills />
        </div>
      </header>

      {/* Directory of every conversion pair, grouped by source format */}
      {groups.map((group) => (
        <section key={group.source} className="mt-12">
          <h2 className="mb-1 text-lg font-semibold">From {group.source}</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {SOURCE_BLURB[group.source]}
          </p>
          <div className="ep-card-grid">
            {group.pairs.map((p) => (
              <Link
                key={p.slug}
                href={convertPath(p.slug)}
                className="ep-card group flex h-full items-start gap-4 p-5"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(212_88%_48%/0.18)] text-[hsl(212_90%_44%)] transition-colors group-hover:bg-[hsl(212_88%_48%/0.28)]">
                  <RefreshCw className="h-[22px] w-[22px]" strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <span className="flex items-center gap-1 font-semibold text-ink">
                    {p.from} to {p.to}
                    <ArrowRight
                      className="h-3.5 w-3.5 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100"
                      strokeWidth={1.75}
                    />
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.reason}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Bridge to the general converter (any format → any format) */}
      <section className="mt-12 rounded-lg border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold">Need a different combination?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The full converter auto-detects your file&apos;s format and lets you
          pick any output — JPG, PNG or WebP — with a quality slider and batch
          download.
        </p>
        <div className="mt-3">
          <Link
            href="/tools/format-converter/"
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-paper px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-ink/30 hover:bg-accent/40"
          >
            Open the format converter <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </section>
    </div>
  );
}
