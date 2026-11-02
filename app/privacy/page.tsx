import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema, breadcrumbSchema, type Crumb } from "@/lib/schema";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How easyPhoto handles your data: it doesn't. Photos and PDFs are " +
    "processed entirely in your browser and never uploaded.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy/" },
  ];

  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            name: "Privacy Policy — easyPhoto",
            description:
              "How easyPhoto handles your data: it doesn't. Photos and PDFs are processed entirely in your browser and never uploaded.",
            url: "/privacy/",
            dateModified: "2026-11-02",
          }),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />

      <header className="mt-5 space-y-2.5">
        <span className="eyebrow block text-brand">Privacy</span>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-[36px]">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: November 2, 2026</p>
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
          Every step (face detection, background removal, cropping, resizing,
          turning a scan into a PDF, and compression) runs in your web browser
          on your own phone or computer. Your images and PDFs are{" "}
          <strong className="text-foreground">never uploaded</strong> to us or
          anyone else, and we never see, receive, copy or keep them. They exist
          only in the open tab while you work and are gone when you close or
          refresh it. Nothing on the site saves your images in your browser for
          later.
        </Section>

        <Section title="What is downloaded to your browser">
          To do this work on your device, your browser downloads the software it
          needs the first time you use a tool. The face-detection and
          text-reading software comes from jsDelivr, a face-detection data file
          comes from Google Cloud Storage, and the background-removal
          software comes from models.easyphoto.in, easyPhoto&apos;s own file
          server. If that server cannot be reached, the same background-removal
          file is fetched from Hugging Face instead. These are downloads to your
          device only: your photo or PDF is never sent to any of these services.
        </Section>

        <Section title="Analytics and tracking">
          We use Cloudflare&apos;s cookieless, aggregate web analytics to count
          page views and measure site speed — it sets no cookies, does no
          fingerprinting or cross-site tracking, and builds no personal
          profiles. We run no other trackers. Once ads are switched on,
          Google&apos;s advertising cookies (see Advertising below) will be the
          one exception. As with any website, the server that hosts
          these pages may keep standard, short-lived technical logs (such as
          IP address and browser type) for the page requests themselves. Those
          logs never contain your images.
        </Section>

        <Section title="Advertising">
          easyPhoto does not show ads yet. When ads are switched on,
          Google AdSense ads will appear on articles, guides, exam pages and the photo
          and signature tools, below the tool and its result and never inside the
          upload, preview or download area. On those tool pages Google&apos;s ad
          code runs on the same page as the tool; your photo is still edited on
          your device and never uploaded. Pages for ID documents and PDFs
          (Aadhaar, PAN and the document scanner) and these policy pages never
          load Google&apos;s advertising or consent scripts. Google and its advertising partners
          may use cookies or similar technologies, such as web beacons, and your
          IP address to serve, limit and measure ads; see{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            how Google uses information from sites that use its services
          </a>
          . Visitors in the European Economic Area, the United Kingdom and
          Switzerland will be shown Google&apos;s consent choices before any ad
          is served, and can change that choice later from the
          &quot;Privacy and cookie settings&quot; link Google adds to the page. Third-party vendors, including Google, use cookies to
          serve ads based on your prior visits to this and other websites.
          Google&apos;s advertising cookies let it and its partners show you ads
          based on those visits. You can turn off personalised ads in{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Google Ads Settings
          </a>
          , or opt out of other vendors&apos; cookies at{" "}
          <a
            href="https://www.aboutads.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            aboutads.info
          </a>
          .
        </Section>

        <Section title="Accounts and payments">
          There are no accounts. The tools are free. If you choose to leave a
          tip, the payment is handled by Razorpay or your UPI app; we never see
          your card, bank or UPI PIN details. See our{" "}
          <Link href="/terms/" className="text-brand hover:underline">
            Terms
          </Link>{" "}
          for the refund rule on tips.
        </Section>

        <Section title="Children">
          The service is general-purpose and does not knowingly collect any
          personal information from anyone, including children.
        </Section>

        <Section title="Changes">
          If this policy changes, we&apos;ll update the date above. Material
          changes will be reflected on this page.
        </Section>

        <Section title="Questions">
          easyPhoto is run by Jaspal Kumar, Punjab, India, who is responsible for
          this policy. For a question about it, write from the{" "}
          <Link href="/contact/" className="text-brand hover:underline">
            contact page
          </Link>
          . There are no accounts, and we never hold a copy of your photos or
          files, so there is nothing of that kind to request or delete.
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
