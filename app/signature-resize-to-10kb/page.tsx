import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
  faqSchema,
} from "@/lib/schema";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { Faq } from "@/components/site/Faq";
import { SIGNATURE_KB_USECASES } from "@/lib/kbTargets";

const PATH = "/signature-resize-to-10kb/";
const uc = SIGNATURE_KB_USECASES[10];

export const metadata = pageMetadata({
  title: "Signature Resize to 10KB – Free, Keeps Transparency",
  titleAbsolute: true,
  description:
    "Resize your signature to under 10 KB — the strict lower limit SSC, IBPS, " +
    "SBI and RRB forms expect. Transparent background kept, in your browser. No upload.",
  path: PATH,
});

const faqItems = [
  uc.faq,
  {
    q: "Why won't my signature upload to the form?",
    a: "Portals like UPSC, SSC and bank forms cap the signature file size (often 10–20 KB) and expect a clean background. A phone photo is usually far larger, so the upload is rejected.",
  },
  {
    q: "Will the background stay transparent?",
    a: "Yes. We lift the paper tone and keep a transparent PNG, so your signature sits cleanly on documents and certificates instead of inside a white box.",
  },
  {
    q: "Is it free and private?",
    a: "Completely free, no watermark, and processed entirely on your device, so your signature is never uploaded.",
  },
];

export default function Page() {
  return (
    <div className="container max-w-3xl py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resize signature to 10KB", path: PATH },
          ]),
          softwareApplicationSchema({
            name: "Resize Signature to 10KB",
            description:
              "Free tool to compress a signature to under 10 KB with a transparent background, in your browser.",
            url: PATH,
          }),
          faqSchema(faqItems),
        ]}
      />

      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All tools
      </Link>

      <header className="mt-4 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Resize Signature to 10KB
        </h1>
        <p className="text-muted-foreground">
          Forms that want a 10 KB signature expect it to be clear and optimized. Scan or photograph your signature and this tool
          removes the paper, keeps the ink on a transparent background, and gets
          the file under 10 KB so the upload goes through. It all runs in your browser.
        </p>
      </header>

      <div className="mt-6">
        <SignatureWorkflowTool defaultTab="resize" defaultKb={10} autoCropDefault={true} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Your signature is processed on your device and never uploaded.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">{uc.heading}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{uc.intro}</p>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {uc.useCases.map((c) => (
            <li key={c.label}>
              <strong className="text-foreground">{c.label}</strong> — {c.detail}
            </li>
          ))}
        </ul>
        <p className="rounded-lg border border-brand/20 bg-brand-soft/15 px-4 py-3 text-sm leading-relaxed text-ink-soft">
          <strong className="text-foreground">Tip:</strong> {uc.tip}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-tight">Related tools</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/signature-resize-to-20kb/" className="rounded-md border border-hairline bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground">
            Resize signature to 20 KB
          </Link>
          <Link href="/photo-resize-to-20kb/" className="rounded-md border border-hairline bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground">
            Resize photo to 20 KB
          </Link>
          <Link href="/tools/signature/" className="rounded-md border border-hairline bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-accent/50">
            All signature tools
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <Faq items={faqItems} noSchema />
      </section>
    </div>
  );
}
