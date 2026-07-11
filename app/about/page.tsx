import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Gift,
  Ruler,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { READY_TOOLS } from "@/lib/toolsCatalog";
import { ExploreTools } from "@/components/site/ExploreTools";

export const metadata = pageMetadata({
  title: "About",
  description:
    "How EasyPhoto researches document-photo requirements, identifies its " +
    "sources, reviews specifications, and checks files privately in your browser.",
  path: "/about/",
});

const STATS = [
  { v: `${PORTAL_KEYS.length}`, l: "exam & form specs" },
  { v: `${READY_TOOLS.length}`, l: "free tools" },
  { v: "100%", l: "in your browser" },
  { v: "₹0", l: "no watermark" },
];

const VALUES = [
  {
    icon: Ruler,
    tile: "text-brand bg-brand/10",
    title: "Specifications you can inspect",
    body:
      "Each specification links to its published source. We identify whether it comes from an official government portal or from secondary guidance, then use the recorded dimensions and limits when preparing your file.",
  },
  {
    icon: Lock,
    tile: "text-[hsl(142_55%_34%)] bg-[hsl(142_55%_34%)]/10 dark:text-[hsl(142_55%_60%)] dark:bg-[hsl(142_55%_34%)]/20",
    title: "Privacy is the design",
    body:
      "Face detection, background removal, cropping, resizing, PDF conversion — every step runs on your own device. Your photos and documents are never uploaded, never stored, and gone when you close the tab. Not a setting; how it works.",
  },
  {
    icon: Gift,
    tile: "text-[hsl(22_89%_50%)] bg-[hsl(22_89%_50%)]/10 dark:text-[hsl(22_89%_68%)] dark:bg-[hsl(22_89%_50%)]/20",
    title: "Free, no catch",
    body:
      "No watermark, no account, no paywall on the download, and no upsell to a “pro” version of your own photo. The tools that are free stay free.",
  },
  {
    icon: BadgeCheck,
    tile: "text-[hsl(215_70%_50%)] bg-[hsl(215_70%_50%)]/10 dark:text-[hsl(215_70%_70%)] dark:bg-[hsl(215_70%_50%)]/20",
    title: "Honest about sources",
    body:
      "When a country's rules come from guidance rather than a confirmed primary portal, we say so on the page. A wrong number is a rejected photo — so we'd rather flag uncertainty than hide it.",
  },
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ]),
          {
            "@type": "AboutPage",
            url: `${SITE_URL}/about/`,
            name: `About ${SITE_NAME}`,
            publisher: { "@id": ORG_ID },
          },
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      {/* Hero */}
      <header className="mt-5 space-y-4 border-b border-hairline pb-9">
        <span className="eyebrow text-brand">Our story</span>
        <h1 className="text-balance text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[2.6rem]">
          A passport photo should never cost you the application
        </h1>
        <p className="max-w-2xl text-pretty text-[17px] leading-relaxed text-muted-foreground">
          EasyPhoto helps prepare passport, visa and exam photos against published
          requirements — free, private, and entirely in your browser. Here&apos;s why
          we built it that way and how we research the specifications we use.
        </p>
      </header>

      {/* Real-number stat strip — credibility + breadth at a glance */}
      <dl className="mt-8 grid grid-cols-2 divide-x divide-hairline overflow-hidden rounded-xl border border-hairline bg-card sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.l}
            className={`px-4 py-5 text-center ${i >= 2 ? "border-t border-hairline sm:border-t-0" : ""}`}
          >
            <dd className="text-2xl font-semibold tracking-tight text-brand sm:text-[1.75rem]">
              {s.v}
            </dd>
            <dt className="mt-1 text-xs leading-tight text-muted-foreground">{s.l}</dt>
          </div>
        ))}
      </dl>

      {/* The "why" — a short, human mission paragraph */}
      <section className="mt-12 max-w-2xl space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Why we built it</h2>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          Getting a passport or visa photo rejected over a couple of millimetres,
          or the wrong shade of background, is a frustration most people have run
          into. Studio photos are expensive and slow. And the &quot;free&quot;
          online tools usually add a watermark, make you sign up, or quietly upload
          your face to a server you&apos;ll never hear about again.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          We wanted something that applies documented sizes and measurable checks
          without asking for your data. Final acceptance always belongs to the
          authority receiving the application, so we show the source and any
          uncertainty instead of promising an outcome.
        </p>
      </section>

      {/* Research methodology — how specification claims are produced and maintained */}
      <section className="mt-12 border-t border-hairline pt-10">
        <span className="eyebrow text-brand">Research methodology</span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          How we research and verify requirements
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          A specification is a research record, not an acceptance guarantee. These
          are the rules we follow when adding or updating one.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Official and secondary sources
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We prefer the authority&apos;s portal, notification or published
              instructions. If a primary source is unavailable or does not state a
              required value, we may record reputable secondary guidance and label
              it as such. We do not present secondary guidance as government-issued.
            </p>
          </div>

          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Verification and review dates
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We compare the recorded dimensions, file-size limits, format and
              background instructions with the cited source. Where our registry has
              a confirmed review date, specification pages display that
              last-reviewed date. Undated or secondary records remain identified as
              needing stronger verification rather than receiving a made-up date.
            </p>
          </div>

          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Deterministic and heuristic checks
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pixel dimensions, aspect ratio, encoded file size, format and DPI are
              deterministic checks: the browser can measure them directly. Face
              position, head framing, background uniformity, lighting and image
              quality depend on detection or sampling heuristics. Those results are
              warnings and measurements, not proof that an authority will accept a
              photo.
            </p>
          </div>

          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Corrections policy
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Requirements change. If you find a newer notification or a portal
              value that differs from ours, send the page or document through our{" "}
              <Link href="/contact/" className="font-medium text-brand hover:underline">
                contact page
              </Link>
              . We check the cited evidence, update the registry and review date when
              warranted, and retain uncertainty when the available sources conflict.
            </p>
          </div>
        </div>
      </section>

      {/* Values as premium cards */}
      <section className="mt-12">
        <h2 className="eyebrow mb-5 text-ink-soft">What that means in practice</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="ep-card p-6">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${v.tile}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pull-quote / promise — authenticity */}
      <figure className="mt-12 rounded-2xl border border-brand/20 bg-brand-soft/20 p-7 sm:p-9">
        <blockquote className="text-pretty text-xl font-medium leading-snug tracking-tight text-ink sm:text-2xl">
          &ldquo;Accuracy is the whole point. A wrong number can waste an application
          window. So we&apos;d rather show our sources and their limits than ask you
          to trust us.&rdquo;
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
          <ShieldCheck className="h-4 w-4 text-brand" strokeWidth={2} />
          The easyPhoto team
        </figcaption>
      </figure>

      {/* Cross-sell — never let the page dead-end */}
      <ExploreTools
        className="mt-14"
        heading="See what you can make"
        subtitle="Free, private, and ready in seconds — pick one and try it."
      />

      {/* Closing CTA */}
      <div className="mt-12 flex flex-col items-start gap-3 rounded-xl border border-hairline bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink">
          <span className="font-semibold">Spotted a spec that looks out of date?</span>{" "}
          Accuracy is the whole point —{" "}
          <Link href="/contact/" className="font-medium text-brand hover:underline">
            tell us
          </Link>
          .
        </p>
        <Link
          href="/passport-photo/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
        >
          Open the photo maker <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
