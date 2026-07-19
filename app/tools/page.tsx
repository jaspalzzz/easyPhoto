import Link from "next/link";
import { ArrowRight, Globe, GraduationCap, FileText, Aperture, PenLine } from "lucide-react";
import { TOOLS_CATALOG, POPULAR_TOOLS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { ToolIcon } from "@/components/site/ToolIcon";
import { ToolCard } from "@/components/site/ToolCard";
import { TrustPills } from "@/components/site/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
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
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
          ]),
          collectionPageSchema({
            name: "Free Image, PDF & Signature Tools",
            description:
              "Free in-browser tools: background remover, compress image to KB, resize photos, JPG to PDF, PDF to JPG and signature tools. Nothing is uploaded.",
            url: "/tools/",
          }),
        ]}
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

      {/* ── Category jump grid ─────────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { title: "Passport & Visa",  sub: "All countries",          href: "/passport-photo/",     Icon: Globe,         iconBg: "bg-amber-100 dark:bg-amber-900/30",   iconText: "text-amber-600 dark:text-amber-400",   span: "" },
          { title: "Exam Tools",       sub: "SSC, UPSC, Banking",     href: "/tools/exam-package/", Icon: GraduationCap, iconBg: "bg-blue-100 dark:bg-blue-900/30",     iconText: "text-blue-600 dark:text-blue-400",     span: "" },
          { title: "Image Tools",      sub: "Resize, convert, BG",    href: "/tools/photo/",        Icon: Aperture,      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",iconText: "text-emerald-600 dark:text-emerald-400",span: "" },
          { title: "PDF Tools",        sub: "Compress, merge, split", href: "/tools/pdf/",          Icon: FileText,      iconBg: "bg-violet-100 dark:bg-violet-900/30", iconText: "text-violet-600 dark:text-violet-400",  span: "" },
          { title: "Signature Tools",  sub: "PNG, crop, cleaner",     href: "/tools/signature/",    Icon: PenLine,       iconBg: "bg-rose-100 dark:bg-rose-900/30",     iconText: "text-rose-600 dark:text-rose-400",     span: "col-span-2 sm:col-span-1" },
        ].map(({ title, sub, href, Icon, iconBg, iconText, span }) => (
          <Link
            key={href}
            href={href}
            className={`group flex items-center gap-2.5 rounded-xl border border-hairline bg-card p-3 transition-colors hover:border-hairline-strong hover:bg-accent/40 ${span}`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconText}`}>
              <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 text-left">
              <p className="text-[12px] font-bold leading-tight text-ink">{title}</p>
              <p className="mt-0.5 truncate text-xs leading-snug text-muted-foreground">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
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
            <span className="text-muted-foreground leading-normal">Compress photo to 20–200 KB</span>
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
          <Link
            href="/nda-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">NDA Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">50–100 KB for upsconline</span>
          </Link>
          <Link
            href="/ctet-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">CTET Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">10–100 KB for ctet.nic.in</span>
          </Link>
          <Link
            href="/nta-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">NEET / JEE Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">10–200 KB for NTA portal</span>
          </Link>
          <Link
            href="/gate-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">GATE Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">5–600 KB for GATE 2026</span>
          </Link>
          <Link
            href="/rbi-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">RBI Grade B Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">20–50 KB, 200×230px</span>
          </Link>
          <Link
            href="/lic-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">LIC AAO Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">20–50 KB for LIC portal</span>
          </Link>
          <Link
            href="/nabard-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">NABARD Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">20–50 KB, 200×230px</span>
          </Link>
          <Link
            href="/tnpsc-photo-resizer/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">TNPSC Photo Resizer</span>
            <span className="text-muted-foreground leading-normal">Under 50 KB for tnpsc.gov.in</span>
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
                      <span className="rounded-md border border-hairline px-2 py-0.5 text-xs font-medium text-muted-foreground">
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

      {/* Western passport & visa photos — higher RPM countries */}
      <section className="mt-12">
        <h2 className="eyebrow mb-4">
          Western Passport &amp; Visa Photos
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Link
            href="/us-passport-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇺🇸 US Passport Photo</span>
            <span className="text-muted-foreground leading-normal">2×2 inch, white bg, no glasses</span>
          </Link>
          <Link
            href="/uk-passport-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇬🇧 UK Passport Photo</span>
            <span className="text-muted-foreground leading-normal">35×45mm, light grey (not white)</span>
          </Link>
          <Link
            href="/canada-passport-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇨🇦 Canada Photo</span>
            <span className="text-muted-foreground leading-normal">Visa, PR, Express Entry, renewal</span>
          </Link>
          <Link
            href="/schengen-visa-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇪🇺 Schengen Visa Photo</span>
            <span className="text-muted-foreground leading-normal">35×45mm, light grey, all 29 countries</span>
          </Link>
          <Link
            href="/us-passport-photo-maker/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇺🇸 US Passport Maker</span>
            <span className="text-muted-foreground leading-normal">Full tool — crop, size, download</span>
          </Link>
          <Link
            href="/uk-passport-photo-maker/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇬🇧 UK Passport Maker</span>
            <span className="text-muted-foreground leading-normal">Grey bg auto-applied</span>
          </Link>
          <Link
            href="/australia-passport-photo-maker/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇦🇺 Australia Passport</span>
            <span className="text-muted-foreground leading-normal">35×45mm, white/light grey bg</span>
          </Link>
          <Link
            href="/schengen-visa-photo-maker/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇪🇺 Schengen Maker</span>
            <span className="text-muted-foreground leading-normal">Country-aware size and background</span>
          </Link>
        </div>
      </section>

      {/* Frequently asked questions */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">Are all these tools really free?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Yes — every tool on this page is completely free with no credits, no sign-up, and no
              hidden charges. Processing happens in your browser using your device&apos;s CPU and memory,
              so the only resource used is your own hardware. easyPhoto earns nothing from the tools
              themselves; the service is free as a matter of principle.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">Why do my files never leave my device?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All image processing, PDF operations, and signature cropping run locally using
              browser APIs — there is no server upload step. Your photos, documents, and signatures
              are processed in-memory on your device and the result is served back to you as a
              download. This is different from most online tools, which send files to a server for
              processing and may store them for days or weeks.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">What file formats do the tools accept?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Image tools accept JPEG, PNG, and WebP. PDF tools handle both single-page and
              multi-page PDFs up to the browser&apos;s memory limit (typically 50–100 MB depending on
              the device). Output format matches the tool — passport and exam photos are saved as
              JPEG, signatures as PNG, and PDFs remain in PDF format. No conversion happens
              unless the tool specifically offers it.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">How are the KB and pixel targets set?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              File-size and dimension targets come from the source recorded for each preset.
              Specification pages identify entries verified against an official recruitment
              portal or notification, show the recorded review date, and flag presets that still
              need source review. Confirm the current application instructions before submitting.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-silo bridge → passport & visa makers */}
      <section className="mt-12 rounded-lg border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold">Passport &amp; visa photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Need to prepare an ID photo? Use the country-aware makers for the selected size,
          selected background and a pre-submission photo check.
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
