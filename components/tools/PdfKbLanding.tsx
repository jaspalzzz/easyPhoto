import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PdfCompressTool } from "@/components/tools/PdfCompressTool";
import { ToolIconTile } from "@/components/site/ToolIcon";
import { ExploreTools } from "@/components/site/ExploreTools";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
  howToSchema,
} from "@/lib/schema";
import { PDF_KB_TARGETS, pdfKbPath, PDF_KB_USECASES } from "@/lib/kbTargets";

/** Landing page for "Compress PDF to N KB", preset to the target. */
export function PdfKbLanding({ kb }: { kb: number }) {
  const path = pdfKbPath(kb);
  const uc = PDF_KB_USECASES[kb];
  const faqItems = [
    ...(uc ? [uc.faq] : []),
    {
      q: `How do I compress a PDF to ${kb} KB?`,
      a: `Upload your PDF above, keep the target at ${kb} KB (or change it), and click compress. The pages are optimised to fit under ${kb} KB, then you download the result. Everything happens in your browser.`,
    },
    // Size-specific quality answer (readability at 50 KB vs 500 KB is a
    // genuinely different story); generic phrasing kept as the fallback for
    // any future target added without editorial content.
    uc?.qualityFaq ?? {
      q: `Will compressing to ${kb} KB reduce quality?`,
      a: `To meet a ${kb} KB target the pages are rendered to images, so the text is no longer selectable and very small targets look softer. We keep the best quality that still fits, so pick the largest size your form allows.`,
    },
    {
      q: `Can I compress a marksheet or certificate PDF to ${kb} KB?`,
      a: `Yes. Scanned marksheets, certificates, Aadhaar and income certificates are exactly what this is for — they're usually image-heavy, so they compress well to ${kb} KB.`,
    },
    {
      q: `Is the ${kb} KB PDF compressor free and private?`,
      a: "Yes. It's completely free with no watermark and no sign-up, and your PDF is processed entirely on your device — nothing is uploaded to any server.",
    },
  ];

  return (
    <div className="container max-w-3xl py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
            { name: "PDF Tools", path: "/tools/pdf/" },
            { name: `Compress PDF to ${kb} KB`, path },
          ]),
          softwareApplicationSchema({
            name: `Compress PDF to ${kb} KB`,
            description: `Free online tool to compress a PDF to under ${kb} KB, in your browser.`,
            url: path,
          }),
          howToSchema({
            name: `How to compress a PDF to ${kb} KB`,
            description: `Compress any PDF to under ${kb} KB for form, exam and document uploads.`,
            steps: [
              { name: "Upload your PDF", text: "Choose or drop a PDF — it stays on your device." },
              { name: `Set the target to ${kb} KB`, text: `The target is preset to ${kb} KB; change it if your form needs a different limit.` },
              { name: "Compress and download", text: `We compress to under ${kb} KB at the best possible quality, then you download the result.` },
            ],
          }),
          ...(faqItems.length > 0 ? [faqSchema(faqItems)] : []),
        ]}
      />

      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All tools
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <ToolIconTile name="FileDown" category="pdf" className="hidden shrink-0 sm:flex" />
        <div className="space-y-2">
          <span className="eyebrow block text-brand">PDF Tools</span>
          <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
            Compress PDF to {kb} KB
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Shrink a PDF to under {kb} KB for exam, government and online form
            uploads — marksheets, certificates and documents — free, and entirely
            in your browser.
          </p>
        </div>
      </header>

      <div className="mt-6">
        <PdfCompressTool defaultKb={kb} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Compression runs on your device, so your PDF is never uploaded.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">{uc?.heading ?? `Compress documents to ${kb} KB`}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {uc?.intro ??
            `Many application portals cap the size of supporting documents. This tool targets scanned marksheets, certificates and other PDFs under ${kb} KB; confirm the portal's other document requirements before uploading.`}
        </p>
        {uc && (
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            {uc.useCases.map((c) => (
              <li key={c.label}>
                <strong className="text-foreground">{c.label}</strong> — {c.detail}
              </li>
            ))}
          </ul>
        )}
        {uc?.tip && (
          <p className="rounded-lg border border-brand/20 bg-brand-soft/15 px-4 py-3 text-sm leading-relaxed text-ink-soft">
            <strong className="text-foreground">Tip:</strong> {uc.tip}
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="eyebrow mb-3">Need a different size?</h2>
        <div className="flex flex-wrap gap-2">
          {PDF_KB_TARGETS.filter((t) => t !== kb).map((t) => (
            <Link
              key={t}
              href={pdfKbPath(t)}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
            >
              Compress to {t} KB
            </Link>
          ))}
          <Link
            href="/tools/pdf-compress/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-ink/30 hover:bg-accent/40"
          >
            Custom size
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow mb-3">More PDF tools</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tools/unlock-pdf/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/40"
          >
            Unlock / remove PDF password
          </Link>
          <Link
            href="/tools/pdf-merge/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
          >
            Merge PDF
          </Link>
          <Link
            href="/tools/pdf-to-jpg/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
          >
            PDF to JPG
          </Link>
        </div>
      </section>

      <ExploreTools
        className="mt-12 border-t border-hairline pt-10"
        heading="More free tools"
        subtitle="Photos, signatures, conversions — all on-device, no sign-up."
      />

      <section className="mt-12">
        <Faq items={faqItems} noSchema />
      </section>
    </div>
  );
}
