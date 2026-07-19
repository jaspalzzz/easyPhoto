import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How easyPhoto handles your data: it doesn't. Photos and PDFs are " +
    "processed entirely in your browser and never uploaded.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy/" },
          ]),
          webPageSchema({
            name: "Privacy Policy — easyPhoto",
            description:
              "How easyPhoto handles your data: it doesn't. Photos and PDFs are processed entirely in your browser and never uploaded.",
            url: "/privacy/",
            dateModified: "2026-07-01",
          }),
        ]}
      />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <header className="mt-5 space-y-2.5">
        <span className="eyebrow block text-brand">Privacy</span>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.4rem]">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: July 1, 2026</p>
      </header>

      {/* The short version — highlighted so it's the first thing read */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-brand/25 bg-brand-soft/20 p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
        <p className="text-[15px] leading-relaxed text-ink">
          Built privacy-first. The short version:{" "}
          <strong className="font-semibold">
            your photos and PDFs never leave your device.
          </strong>{" "}
          Everything below is just the detail.
        </p>
      </div>

      <article className="mt-2 divide-y divide-hairline [&>section]:py-8">

        <Section title="Your images and files">
          Every operation (face detection, background removal, cropping,
          resizing, PDF conversion and file compression) runs entirely in your
          web browser using your device&apos;s own processor. Your images and
          PDFs are <strong className="text-foreground">never uploaded</strong> to
          us or any third party, and we never see, receive, copy, or store them.
          They are held only in your browser&apos;s memory while you work and are
          discarded when you close or refresh the page. We do not use cookies,
          localStorage, or any other mechanism to persist your images.
        </Section>

        <Section title="What is downloaded to your browser">
          To run image analysis locally, your browser downloads read-only program
          files and model weights. MediaPipe and OCR runtimes come from jsDelivr,
          the face-landmark model comes from Google Cloud Storage, and the primary
          background-removal files come from models.easyphoto.in, an easyPhoto
          asset host. If that self-hosted background model file is unavailable,
          the code may request the same fallback model file from Hugging Face.
          These are one-directional software downloads to your device: your image
          or PDF bytes are not sent to any of those hosts.
        </Section>

        <Section title="Analytics and tracking">
          We use Cloudflare&apos;s cookieless, aggregate web analytics to count
          page views and measure site speed — it sets no cookies, does no
          fingerprinting or cross-site tracking, and builds no personal
          profiles. Beyond that we run no advertising trackers or behavioural
          profiling of any kind. As with any website, the server that hosts
          these pages may keep standard, short-lived technical logs (such as
          IP address and browser type) for the page requests themselves —
          never any image content. Your images still never leave your device.
        </Section>

        <Section title="Advertising">
          EasyPhoto may show Google AdSense ads on content pages that do not
          contain private user files. Google and its advertising partners may
          use cookies or similar technologies to serve, limit, and measure ads.
          When advertising is enabled and the European-regulations message is
          published, visitors in the European Economic Area, the United Kingdom,
          and Switzerland are shown Google&apos;s consent choices before eligible
          ads are served. Google determines that regional eligibility; the
          consent message is not shown to visitors outside those regions unless
          Google requires another regional message or the visitor opens a message
          test URL. After making a choice, an eligible visitor can use the
          &quot;Privacy and cookie settings&quot; link that Google adds to an
          ad-supported page to reopen the message and change that choice. You can
          also learn about Google&apos;s advertising practices and control ad
          personalisation in your Google ad settings. We do not place ads or load
          Google&apos;s advertising or consent scripts inside upload areas, result
          previews, private document workflows, or pages that contain your
          images or PDFs.
        </Section>

        <Section title="Accounts and payments">
          There are no accounts and no payments. The tool is free to use.
        </Section>

        <Section title="Children">
          The service is general-purpose and does not knowingly collect any
          personal information from anyone, including children.
        </Section>

        <Section title="Changes">
          If this policy changes, we&apos;ll update the date above. Material
          changes will be reflected on this page.
        </Section>

        <p className="pt-8 text-sm leading-relaxed text-muted-foreground">
          See also our{" "}
          <Link href="/terms/" className="text-brand hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
