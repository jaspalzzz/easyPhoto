import Link from "next/link";
import { ArrowRight, Lock, Gift } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID, type Crumb } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { SITE_COUNTS } from "@/components/site/siteCounts";
import { AUTHOR } from "@/lib/author";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Who runs easyPhoto, how the photo and signature requirements on it are " +
    "checked against their sources, and how the tools keep your files on your device.",
  path: "/about/",
});

const STATS = [
  { v: `${SITE_COUNTS.examForms}`, l: "exams & forms" },
  { v: `${SITE_COUNTS.examFormsWithOfficialDate}`, l: "checked against an official notice" },
  { v: `${SITE_COUNTS.tools}`, l: "free tools" },
  { v: `${SITE_COUNTS.countries}`, l: "countries' photo sizes" },
];

const VALUES = [
  {
    icon: Lock,
    tile: "text-[hsl(142_55%_34%)] bg-[hsl(142_55%_34%)]/10 dark:text-[hsl(142_55%_60%)] dark:bg-[hsl(142_55%_34%)]/20",
    title: "Your files stay on your device",
    body:
      "Cropping, background removal, resizing and scanning run on your own phone or computer. Your photos and documents are not uploaded, and they are gone when you close the tab. The privacy policy covers the page counts the site does keep.",
  },
  {
    icon: Gift,
    tile: "text-[hsl(22_89%_50%)] bg-[hsl(22_89%_50%)]/10 dark:text-[hsl(22_89%_68%)] dark:bg-[hsl(22_89%_50%)]/20",
    title: "Free, without a catch on the download",
    body:
      "No watermark, no account and no paywall on the file you make. easyPhoto is free. Optional tips help pay for it, and it will also carry ads.",
  },
];

export default function AboutPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about/" },
  ];

  return (
    <div className="container max-w-4xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          {
            "@type": "AboutPage",
            url: `${SITE_URL}/about/`,
            name: `About ${SITE_NAME}`,
            publisher: { "@id": ORG_ID },
          },
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <header className="mt-5 space-y-4 border-b border-hairline pb-9">
        <span className="eyebrow text-brand">Our story</span>
        <h1 className="text-balance text-[36px] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[36px]">
          A passport photo should never cost you the application
        </h1>
        <p className="max-w-2xl text-pretty text-[18px] leading-relaxed text-muted-foreground">
          easyPhoto is a free set of photo, signature and document tools for Indian
          exam, ID and passport applications. Here is who runs it, why it works the
          way it does, and how the requirements on it are checked.
        </p>
      </header>

      {/* Real-number stat strip — credibility + breadth at a glance */}
      <dl className="mt-8 grid grid-cols-2 divide-x divide-hairline overflow-hidden rounded-xl border border-hairline bg-card sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.l}
            className={`px-4 py-5 text-center ${i >= 2 ? "border-t border-hairline sm:border-t-0" : ""}`}
          >
            <dd className="text-2xl font-semibold tracking-tight text-brand sm:text-[30px]">
              {s.v}
            </dd>
            <dt className="mt-1 text-xs leading-tight text-muted-foreground">{s.l}</dt>
          </div>
        ))}
      </dl>

      {/* Who runs it */}
      <section className="mt-12 max-w-2xl space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Who runs easyPhoto</h2>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          easyPhoto is built and run by{" "}
          <Link href={AUTHOR.url} className="font-medium text-brand hover:underline">
            {AUTHOR.name}
          </Link>
          , a software developer in Punjab, India. He writes the tools, checks the
          requirements and guides against their sources, and answers the email that
          comes in through the{" "}
          <Link href="/contact/" className="font-medium text-brand hover:underline">
            contact page
          </Link>
          . easyPhoto is independent: it is not part of, or approved by, any
          government department, exam board or passport office.
        </p>
      </section>

      {/* The "why" */}
      <section className="mt-12 max-w-2xl space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Why it exists</h2>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          An application photo can be sent back over a few millimetres of head size,
          the wrong background shade, or a file a few KB too large. Studio photos cost
          money and a trip, and many online tools add a watermark, ask you to sign up,
          or send your photo to their own server to process it.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          easyPhoto applies the sizes each authority publishes and runs the checks it
          can measure, without asking for your data. Whether a photo is accepted is
          always the authority&apos;s decision, so each page shows its source and any
          doubt about it instead of promising an outcome.
        </p>
      </section>

      {/* How requirements are checked */}
      <section className="mt-12 border-t border-hairline pt-10">
        <span className="eyebrow text-brand">How requirements are checked</span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          Where the numbers come from
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              The authority first
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Figures come from the authority&apos;s own portal, notice or instructions
              where one is published. When it is not, a page may use other guidance,
              names it, and says it is not from the authority.
            </p>
          </div>

          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              A date on each check
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              When a figure has been compared with the official source, the page shows
              the date. A figure that has not been is marked as still needing a check,
              rather than given a date it did not earn.
            </p>
          </div>

          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Measured or estimated
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pixel size, file size, format and DPI are read from the file, so they are
              exact. Face position, head size, background and lighting are estimates,
              shown as warnings. Neither can tell you the authority&apos;s decision.{" "}
              <Link href="/how-photo-checking-works/" className="font-medium text-brand hover:underline">
                How photo checking works
              </Link>
            </p>
          </div>

          <div className="ep-card p-6">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Corrections
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Rules change. If you find a newer notice that disagrees with a page, send
              it through the{" "}
              <Link href="/contact/" className="font-medium text-brand hover:underline">
                contact page
              </Link>
              . The figure is checked against it and corrected where the notice
              supports the change. The{" "}
              <Link href="/source-methodology/" className="font-medium text-brand hover:underline">
                source methodology
              </Link>{" "}
              has the details.
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

      {/* Closing CTA */}
      <div className="mt-12 flex flex-col items-start gap-3 rounded-xl border border-hairline bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink">
          <span className="font-semibold">Spotted a figure that looks out of date?</span>{" "}
          <Link href="/contact/" className="font-medium text-brand hover:underline">
            Send the newer notice
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
