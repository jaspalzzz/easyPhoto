import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
  howToSchema,
} from "@/lib/schema";
import { SignatureKbTool } from "@/components/tools/SignatureKbTool";
import { Faq } from "@/components/site/Faq";

const PATH = "/signature-resize-to-20kb/";

export const metadata = pageMetadata({
  title: "Signature Resize to 20KB – Free, Keeps Transparency",
  titleAbsolute: true,
  description:
    "Resize your signature to under 20 KB online for free, with a transparent " +
    "background kept intact. Built for UPSC, SSC, bank & visa forms. No upload.",
  path: PATH,
});

const faqItems = [
  {
    q: "Why won't my signature upload to the form?",
    a: "Portals like UPSC, SSC and bank forms cap the signature file size — often 10–20 KB — and expect a clean background. A phone photo is usually far larger, so the upload is rejected.",
  },
  {
    q: "Will the background stay transparent?",
    a: "Yes. We lift the paper tone and keep a transparent PNG, so your signature sits cleanly on documents and certificates instead of inside a white box.",
  },
  {
    q: "My scan has grey smudges — will it clean up?",
    a: "Use the “paper removal strength” slider to push the background to fully transparent while keeping the ink.",
  },
  {
    q: "Is it free and private?",
    a: "Completely free, no watermark, and processed entirely on your device — your signature is never uploaded.",
  },
];

export default function Page() {
  return (
    <div className="container max-w-3xl py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resize signature to 20KB", path: PATH },
          ]),
          softwareApplicationSchema({
            name: "Resize Signature to 20KB",
            description:
              "Free tool to compress a signature to under 20 KB with a transparent background, in your browser.",
            url: PATH,
          }),
          howToSchema({
            name: "How to resize a signature to 20KB",
            description:
              "Get a transparent signature under 20 KB for online form uploads.",
            steps: [
              { name: "Upload your signature", text: "Scan or photograph your signature and drop it in — it stays on your device." },
              { name: "Remove the paper background", text: "Adjust the strength so the background is fully transparent and the ink stays crisp." },
              { name: "Download under 20 KB", text: "We trim and compress to under 20 KB as a transparent PNG, then you download it." },
            ],
          }),
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
          Resize Signature to 20KB
        </h1>
        <p className="text-muted-foreground">
          Forms that want a 20 KB photo usually want an even smaller signature,
          on a clean background. Scan or photograph your signature and this tool
          removes the paper, keeps the ink on a transparent background, and gets
          the file under 20 KB so the upload goes through. It all runs in your
          browser.
        </p>
      </header>

      <div className="mt-6">
        <SignatureKbTool kb={20} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Your signature is processed on your device and never uploaded.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">What this tool does</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Gets your signature under 20 KB while keeping it legible.</li>
          <li>Removes the paper background and keeps a transparent PNG — not a white box.</li>
          <li>Auto-trims the empty space around the signature.</li>
          <li>Works from a phone photo or a scan.</li>
          <li>Free, no upload, no watermark.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-tight">Related tools</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/photo-resize-to-20kb/" className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground">
            Resize photo to 20 KB
          </Link>
          <Link href="/tools/signature-resize/" className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground">
            Signature resize (pixels)
          </Link>
          <Link href="/tools/signature/" className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-accent/50">
            All signature tools
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
