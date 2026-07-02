import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
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
import { KB_TARGETS, kbPath, PHOTO_KB_USECASES } from "@/lib/kbTargets";
import { KbExamLinks } from "@/components/tools/KbExamLinks";

/** Landing page for "Resize image to N KB", preset to the target. */
export function KbResizeLanding({ kb }: { kb: number }) {
  const path = kbPath(kb);
  const uc = PHOTO_KB_USECASES[kb];
  const faqItems = [
    ...(uc ? [uc.faq] : []),
    {
      q: `How do I resize a photo to ${kb} KB?`,
      a: `Upload your image above, keep the target at ${kb} KB (or change it), and click “Compress to size”. We lower the JPEG quality first and then the dimensions if needed, so the file lands under ${kb} KB, then you download it. Everything happens in your browser.`,
    },
    // Size-specific quality answer (the trade-off genuinely differs per
    // target); the old generic one-size answer is the fallback for any
    // future target added without editorial content.
    uc?.qualityFaq ?? {
      q: `Will resizing to ${kb} KB reduce quality?`,
      a: "Some quality is traded for the smaller size, but we keep the highest quality that still fits your target, so the photo stays as sharp as possible at that file size.",
    },
    {
      q: `Is the ${kb} KB compressor free and private?`,
      a: "Yes. It's completely free with no watermark and no sign-up, and your photo is processed entirely on your device. Nothing is uploaded to any server.",
    },
    {
      q: "What formats are supported?",
      a: "JPG, PNG, WebP and HEIC (iPhone photos) inputs; the compressed result is downloaded as an optimised JPG.",
    },
  ];

  return (
    <div className="container max-w-3xl py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
            { name: "Photo Tools", path: "/tools/photo/" },
            { name: `Resize to ${kb} KB`, path },
          ]),
          softwareApplicationSchema({
            name: `Resize Image to ${kb} KB`,
            description: `Free online tool to compress a photo to under ${kb} KB, in your browser.`,
            url: path,
          }),
          howToSchema({
            name: `How to resize an image to ${kb} KB`,
            description: `Compress any photo to under ${kb} KB for form, exam and document uploads.`,
            steps: [
              { name: "Upload your photo", text: "Choose or drop a JPG, PNG or HEIC image — it stays on your device." },
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
        <ToolIconTile name="Scaling" category="photo" className="hidden shrink-0 sm:flex" />
        <div className="space-y-2">
          <span className="eyebrow block text-brand">Photo Tools</span>
          <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
            Resize Image to {kb} KB
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Compress a JPG, PNG or HEIC photo to under {kb} KB for exam, government
            and online form uploads, free, and entirely in your browser.
          </p>
        </div>
      </header>

      <div className="mt-6">
        <ResizeKbTool defaultKb={kb} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Compression runs on your device, so your photo is never uploaded.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">{uc?.heading ?? `Where a ${kb} KB photo is needed`}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {uc?.intro ??
            `Many application portals cap the photo file size. This tool gets your image under ${kb} KB while keeping it as clear as possible, so uploads aren't rejected for being too large.`}
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
        <p className="text-xs text-muted-foreground">
          Need the exact dimensions and white background too? Use the{" "}
          <Link href="/passport-photo/" className="text-brand hover:underline">passport photo maker</Link>{" "}
          first, then compress here. Pair it with a{" "}
          <Link href="/signature-resize-to-20kb/" className="text-brand hover:underline">resized signature</Link>{" "}
          for exam forms. Always check the exact limit on your form, then set it above.
        </p>
      </section>

      <KbExamLinks kind="photo" kb={kb} />

      <section className="mt-8">
        <h2 className="eyebrow mb-3">Need a different size?</h2>
        <div className="flex flex-wrap gap-2">
          {KB_TARGETS.filter((t) => t !== kb).map((t) => (
            <Link
              key={t}
              href={kbPath(t)}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
            >
              Resize to {t} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-ink/30 hover:bg-accent/40"
          >
            Custom size
          </Link>
        </div>
      </section>

      <ExploreTools
        className="mt-12 border-t border-hairline pt-10"
        heading="More free tools"
        subtitle="Signatures, PDFs, backgrounds — all on-device, no sign-up."
      />

      <section className="mt-12">
        <Faq items={faqItems} noSchema />
      </section>
    </div>
  );
}
