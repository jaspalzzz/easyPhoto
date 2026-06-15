import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS_CATALOG, POPULAR_TOOLS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { ToolIcon } from "@/components/site/ToolIcon";
import { ToolCard } from "@/components/site/ToolCard";
import { TrustPills } from "@/components/site/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ToolSearch } from "@/components/site/ToolSearch";

export const metadata = pageMetadata({
  title: "Free Image, PDF & Signature Tools",
  description:
    "Free in-browser tools: background remover, compress image to KB, resize " +
    "photos, JPG to PDF, PDF to JPG and signature tools. Nothing is uploaded.",
  path: "/tools/",
});

export default function ToolsHubPage() {
  return (
    <div className="container max-w-5xl py-12">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/" },
        ])}
      />
      <header className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Free, private tools
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Everyday image, PDF and signature utilities that run entirely in your
          browser. No sign-up, no watermark, and your files never leave your
          device.
        </p>
        <div className="pt-1">
          <TrustPills />
        </div>
        <div className="mt-6">
          <ToolSearch />
        </div>
      </header>

      {/* Most popular — a tight quick-access set. The full catalogue lives in
          the categorised sections below, so this stays curated (not a dupe). */}
      <section className="mt-12">
        <h2 className="eyebrow mb-4">
          Most popular
        </h2>
        <div className="ep-card-grid">
          {POPULAR_TOOLS.slice(0, 6).map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              title={tool.title}
              blurb={tool.blurb}
              icon={tool.icon}
            />
          ))}
        </div>
      </section>

      {/* Resize to an exact file size (high-intent landing pages) */}
      <section className="mt-12">
        <h2 className="eyebrow mb-4">
          Resize to an exact file size
        </h2>
        <div className="flex flex-wrap gap-2">
          {KB_TARGETS.map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
            >
              Resize to {kb} KB
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

      {/* Exam & Job Application Resizers */}
      <section className="mt-12">
        <h2 className="eyebrow mb-4">
          Exam &amp; Job Application Resizers
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/ssc-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">SSC Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">Compress to under 50 KB</span>
          </Link>
          <Link
            href="/ssc-signature-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">SSC Signature Resizer</span>
            <span className="text-muted-foreground leading-normal">Compress to under 20 KB</span>
          </Link>
          <Link
            href="/ssc-photo-with-name-date/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">SSC Name &amp; Date Photo</span>
            <span className="text-muted-foreground leading-normal">Add DOP strip + resize</span>
          </Link>
          <Link
            href="/upsc-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">UPSC Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">Square photo under 300 KB</span>
          </Link>
          <Link
            href="/upsc-signature-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">UPSC Signature Resizer</span>
            <span className="text-muted-foreground leading-normal">Compress to under 100 KB</span>
          </Link>
          <Link
            href="/railway-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">Railway Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">RRB photo under 100 KB</span>
          </Link>
          <Link
            href="/ibps-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">IBPS Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">Compress to under 50 KB</span>
          </Link>
          <Link
            href="/sbi-po-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">SBI PO Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">Compress to under 50 KB</span>
          </Link>
        </div>
      </section>

      {/* Full catalog by category */}
      {TOOLS_CATALOG.map((group) => (
        <section key={group.group} className="mt-12">
          <Link
            href={`/tools/${group.slug}/`}
            className="mb-4 inline-flex items-center gap-1 text-lg font-semibold hover:text-brand"
          >
            {group.group}
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <div className="ep-card-grid sm:!grid-cols-2 lg:!grid-cols-3">
            {group.tools.map((tool) =>
              tool.ready ? (
                <ToolCard
                  key={tool.slug}
                  slug={tool.slug}
                  title={tool.title}
                  blurb={tool.blurb}
                  icon={tool.icon}
                />
              ) : (
                <div
                  key={tool.slug}
                  className="flex h-full items-start gap-4 rounded-xl border border-hairline bg-card p-5 opacity-70"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-ink-faint">
                    <ToolIcon name={tool.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{tool.title}</span>
                      <span className="rounded-md border border-hairline px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Coming soon
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tool.blurb}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      ))}

      {/* Cross-silo bridge → passport & visa makers */}
      <section className="mt-12 rounded-lg border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold">Passport &amp; visa photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Need a compliant ID photo? Use the country-aware makers for exact size,
          correct background and a compliance check.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/passport-photo/"
            className="rounded-md border border-hairline bg-paper px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
          >
            Passport photo maker
          </Link>
          <Link
            href="/visa-photo/"
            className="rounded-md border border-hairline bg-paper px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
          >
            Visa photo maker
          </Link>
        </div>
      </section>
    </div>
  );
}
