import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How EasyPhoto handles your data: it doesn't. Photos and PDFs are " +
    "processed entirely in your browser and never uploaded.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <article className="mt-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 6, 2026</p>
        </header>

        <p className="text-muted-foreground">
          EasyPhoto is built privacy-first. The short version:{" "}
          <strong className="text-foreground">
            your photos and PDFs never leave your device.
          </strong>
        </p>

        <Section title="Your images and files">
          Every operation — face detection, background removal, cropping,
          resizing, PDF conversion and file compression — runs entirely in your
          web browser using your device&apos;s own processor. Your images and
          PDFs are <strong className="text-foreground">never uploaded</strong> to
          us or any third party, and we never see, receive, copy, or store them.
          They are held only in your browser&apos;s memory while you work and are
          discarded when you close or refresh the page. We do not use cookies,
          localStorage, or any other mechanism to persist your images.
        </Section>

        <Section title="What is downloaded to your browser">
          To run the AI features locally, your browser downloads a few read-only
          program files (the face-detection and background-removal models and
          their WebAssembly runtimes) from public content-delivery networks
          (jsDelivr, Google Cloud Storage, and staticimgly.com). This is a
          one-directional download of software to your device — your image data
          is never sent in the other direction.
        </Section>

        <Section title="Analytics and tracking">
          We do not run third-party analytics, advertising trackers, fingerprinting,
          or behavioural profiling, and we do not set tracking cookies. As with
          any website, the server that hosts these pages may keep standard,
          short-lived technical logs (such as IP address and browser type) for
          the page requests themselves — never any image content.
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

        <p className="text-sm text-muted-foreground">
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
