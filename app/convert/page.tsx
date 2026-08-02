import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrustPills } from "@/components/site/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Image Format Converter — HEIC, WebP, PNG & JPG Explained",
  description:
    "Which image format to use and when to convert. What HEIC, WebP, PNG and " +
    "JPG each do well, what a conversion costs you, and a free converter that " +
    "runs entirely in your browser.",
  path: "/convert/",
});

/**
 * One page about image formats, replacing nine near-identical pair pages.
 *
 * /convert/heic-to-jpg/, /convert/png-to-webp/ and seven siblings each wrapped
 * the same converter in ~450 words and earned no clicks between them in 90
 * days. The useful part was never the pairing — it was knowing what each format
 * does and what a conversion costs. That is one explanation, so it is one page,
 * and the pair URLs 301 here.
 */
const FORMATS: {
  name: string;
  tag: string;
  body: string;
  convertWhen: string;
}[] = [
  {
    name: "HEIC",
    tag: "What your iPhone saves",
    body:
      "iPhones have saved photos as HEIC by default since iOS 11 because it stores the same quality in roughly half the space. The trade-off is reach: most exam portals, Windows photo viewers and older editors still expect something else, and HEIC barely renders outside Apple's ecosystem.",
    convertWhen:
      "Convert to JPG when a form or a Windows app refuses the file — that is the universally accepted option. Convert to PNG instead if you need lossless quality or transparency, or straight to WebP if the destination is a website.",
  },
  {
    name: "JPG",
    tag: "The one everything accepts",
    body:
      "JPG uses lossy compression that shrinks a photograph dramatically with little visible difference, which is why it is the default for photos and the format almost every upload form names. It cannot store transparency, and each re-save discards a little more detail.",
    convertWhen:
      "Convert to PNG before repeated edits: it will not recover what the JPG already discarded, but it stops any further loss from that point, and PNG can hold a transparent background that a JPG never can. Convert to WebP for the web — typically 25–30% smaller at the same visual quality.",
  },
  {
    name: "PNG",
    tag: "Lossless, transparent, large",
    body:
      "PNG stores every pixel without loss and supports a transparent background, which makes it right for screenshots, diagrams, logos and anything you plan to keep editing. The cost is size: a photograph saved as PNG ends up several times larger than it needs to be.",
    convertWhen:
      "Convert to JPG when a form caps the file size or you are emailing photographs. Convert to WebP for web graphics — it keeps the same transparency while compressing far more efficiently.",
  },
  {
    name: "WebP",
    tag: "Built for the web",
    body:
      "WebP is designed for fast-loading websites, supports transparency like PNG, and is handled by every current browser. That is also why images saved from the web so often arrive in this format — and why they then refuse to open in older software.",
    convertWhen:
      "Convert to JPG when an upload form, an older editor or a printer rejects the file. Convert to PNG when you need to keep a transparent background and work in design or office software that will not read WebP.",
  },
];

const CONVERT_FAQ: FaqItem[] = [
  {
    q: "Does converting an image lose quality?",
    a: "It depends on the direction. Converting to PNG or WebP-lossless keeps every pixel. Converting to JPG applies lossy compression, which discards some detail — usually invisible at normal quality settings, but it accumulates if you convert and re-save the same file repeatedly.",
  },
  {
    q: "Can converting to PNG restore quality a JPG lost?",
    a: "No. Detail a JPG discarded is gone permanently. Converting to PNG prevents any further loss from that point onward, which is useful before a run of edits, but it cannot recover what was already thrown away.",
  },
  {
    q: "Which format should I upload to a government or exam form?",
    a: "Use the format the form names, which is almost always JPG or JPEG. If it also states a file-size limit, convert first and then compress to the limit rather than the other way round.",
  },
  {
    q: "Does transparency survive a conversion?",
    a: "Between PNG and WebP, yes — both support an alpha channel. Converting either to JPG removes transparency, because JPG cannot store it; the transparent area is filled in, usually with white.",
  },
  {
    q: "Are my images uploaded when I convert them?",
    a: "No. The converter runs entirely in your browser using your own device, so the file never leaves it. There is no sign-up and no watermark.",
  },
];

export default function ConvertHubPage() {
  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
            { name: "Image Format Converter", path: "/convert/" },
          ]),
          faqSchema(CONVERT_FAQ),
        ]}
      />

      <header className="space-y-4">
        <span className="eyebrow block text-brand">Image tools</span>
        <h1 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.25rem]">
          Image Format Converter
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Four formats cover almost everything you will meet: HEIC, JPG, PNG and
          WebP. Each is good at something different, and converting between them
          always costs you something — file size, transparency or a little
          detail. Here is what each one does and when it is worth swapping.
        </p>
        <TrustPills />
        <div>
          <Link
            href="/tools/format-converter/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
          >
            Open the converter <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">At a glance</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-hairline text-left">
                <th className="py-2 pr-4 font-semibold text-ink">Format</th>
                <th className="py-2 pr-4 font-semibold text-ink">Quality</th>
                <th className="py-2 pr-4 font-semibold text-ink">Transparency</th>
                <th className="py-2 font-semibold text-ink">Best for</th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              {[
                ["JPG", "Lossy", "No", "Photos, upload forms, email"],
                ["PNG", "Lossless", "Yes", "Screenshots, logos, editing"],
                ["WebP", "Either", "Yes", "Websites, smaller files"],
                ["HEIC", "Lossy", "No", "Storing photos on an iPhone"],
              ].map(([f, q, t, b]) => (
                <tr key={f} className="border-b border-hairline/60">
                  <td className="py-2 pr-4 font-medium text-ink">{f}</td>
                  <td className="py-2 pr-4">{q}</td>
                  <td className="py-2 pr-4">{t}</td>
                  <td className="py-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {FORMATS.map((f) => (
        <section key={f.name} className="mt-9">
          <h2 className="text-lg font-semibold text-ink">
            {f.name} — {f.tag}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {f.body}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {f.convertWhen}
          </p>
        </section>
      ))}

      <section className="mt-10 rounded-lg border border-hairline bg-card p-5">
        <h2 className="text-base font-semibold text-ink">
          Converting for a form with a size limit
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Convert to the format the form asks for first, then bring the file
          under its KB limit with the{" "}
          <Link href="/tools/resize-kb/" className="font-medium text-brand hover:underline">
            resize-to-KB tool
          </Link>
          . Doing it the other way round wastes the compression, because the
          conversion changes the file size again.
        </p>
      </section>

      <div className="mt-12">
        <Faq items={CONVERT_FAQ} noSchema />
      </div>
    </div>
  );
}
