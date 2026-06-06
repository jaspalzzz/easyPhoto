import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
  howToSchema,
} from "@/lib/schema";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";

/** Landing page for "Resize image to N KB", preset to the target. */
export function KbResizeLanding({ kb }: { kb: number }) {
  const path = kbPath(kb);
  const faqItems = [
    {
      q: `How do I resize a photo to ${kb} KB?`,
      a: `Upload your image above, keep the target at ${kb} KB (or change it), and click “Compress to size”. We lower the JPEG quality first and then the dimensions if needed, so the file lands under ${kb} KB, then you download it. Everything happens in your browser.`,
    },
    {
      q: `Will resizing to ${kb} KB reduce quality?`,
      a: "Some quality is traded for the smaller size, but we keep the highest quality that still fits your target, so the photo stays as sharp as possible at that file size.",
    },
    {
      q: `Is the ${kb} KB compressor free and private?`,
      a: "Yes — it's completely free with no watermark and no sign-up, and your photo is processed entirely on your device. Nothing is uploaded to any server.",
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
        ]}
      />

      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All tools
      </Link>

      <header className="mt-4 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Resize Image to {kb} KB
        </h1>
        <p className="text-muted-foreground">
          Compress a JPG, PNG or HEIC photo to under {kb} KB for exam, government
          and online form uploads — free, and entirely in your browser.
        </p>
      </header>

      <div className="mt-6">
        <ResizeKbTool defaultKb={kb} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
        Compression runs on your device — your photo is never uploaded.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">
          Resize photos for exam &amp; government forms
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Many application portals — exam boards, passport and visa sites, banks
          and job forms across India, the US, UK, Canada and Australia — cap the
          photo file size. This tool gets your image under {kb} KB while keeping
          it as clear as possible, so uploads aren&apos;t rejected for being too
          large.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">Where a {kb} KB photo is needed</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Indian exam &amp; government forms
            </strong>{" "}
            (SSC, UPSC, state PSCs, university portals) commonly ask for photos
            around 20–50 KB and{" "}
            <Link href="/signature-resize-to-20kb/" className="text-brand hover:underline">
              signatures around 10–20 KB
            </Link>
            .
          </li>
          <li>
            <strong className="text-foreground">Passport &amp; visa uploads</strong>{" "}
            each set their own cap — use the{" "}
            <Link href="/passport-photo/" className="text-brand hover:underline">
              passport photo maker
            </Link>{" "}
            or your{" "}
            <Link
              href="/india-passport-photo-maker/"
              className="text-brand hover:underline"
            >
              country&apos;s photo spec
            </Link>{" "}
            to get the exact size and background first, then compress here.
          </li>
          <li>
            <strong className="text-foreground">Job &amp; web forms</strong>{" "}
            worldwide often limit uploads to 50–200 KB.
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Always check the exact limit shown on your form — then set it above.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">Need a different size?</h2>
        <div className="flex flex-wrap gap-2">
          {KB_TARGETS.filter((t) => t !== kb).map((t) => (
            <Link
              key={t}
              href={kbPath(t)}
              className="rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Resize to {t} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-full border px-4 py-2 text-sm font-medium text-brand hover:bg-accent"
          >
            Custom size
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
