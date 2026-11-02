import Link from "next/link";
import { Globe, GraduationCap, FileText, Aperture, PenLine } from "lucide-react";
import { LISTED_CATALOG, POPULAR_TOOLS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { ToolCard } from "@/components/site/ToolCard";
import { TrustPills } from "@/components/site/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ToolSearch } from "@/components/site/ToolSearch";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PORTAL_PRESETS, type PortalSpec } from "@/lib/portalPresets";

/*
 * Exam shortcuts. The line under each name is built from the exam's own
 * settings in lib/portalPresets.ts, so it can never disagree with the exam
 * page: an exam that takes the photo live in the form says so instead of
 * offering a photo "resizer" it cannot use (SSC, RRB).
 */
const EXAM_SHORTCUTS = [
  { key: "ssc", label: "SSC" },
  { key: "upsc", label: "UPSC" },
  { key: "rrb", label: "Railway (RRB)" },
  { key: "ibps", label: "IBPS banking" },
] as const;

function kbBand(min: number | undefined, max: number): string {
  return min ? `${min}–${max} KB` : `up to ${max} KB`;
}

function examShortcutLine(spec: PortalSpec): string {
  const photo = spec.isLiveCapture || spec.noPhotoUpload
    ? "photo taken live in the form"
    : `photo ${kbBand(spec.photoMinKb, spec.photoLimitKb)}`;
  const signature = spec.sigLimitKb ? `signature ${kbBand(spec.sigMinKb, spec.sigLimitKb)}` : null;
  const parts = [photo, signature].filter(Boolean).join(", ");
  return parts.charAt(0).toUpperCase() + parts.slice(1);
}

export const metadata = pageMetadata({
  title: "Free Photo, Signature & ID Document Tools",
  description:
    "Free in-browser tools: background remover, compress a photo to a KB size, " +
    "white background, signature tools, a document scanner and Aadhaar/PAN OCR. Nothing is uploaded.",
  path: "/tools/",
});

export default function ToolsHubPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
  ];

  return (
    <div className="container max-w-5xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: "Free Photo, Signature & ID Document Tools",
            description:
              "Free in-browser tools: background remover, compress a photo to a KB size, white background, signature tools, a document scanner and Aadhaar/PAN OCR. Nothing is uploaded.",
            url: "/tools/",
          }),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />
      <header className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Free, private tools
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Photo, signature and document tools for Indian application forms. They run in
          your browser, so your files stay on your device.
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
          { title: "Image Tools",      sub: "Resize, KB, background", href: "#photo",              Icon: Aperture,      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",iconText: "text-emerald-600 dark:text-emerald-400",span: "" },
          { title: "ID & Documents",   sub: "Scan, Aadhaar, PAN",     href: "#document",           Icon: FileText,      iconBg: "bg-violet-100 dark:bg-violet-900/30", iconText: "text-violet-600 dark:text-violet-400",  span: "" },
          { title: "Signature Tools",  sub: "PNG, crop, cleaner",     href: "#signature",          Icon: PenLine,       iconBg: "bg-rose-100 dark:bg-rose-900/30",     iconText: "text-rose-600 dark:text-rose-400",     span: "col-span-2 sm:col-span-1" },
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
          {/* Shortcuts only — the full catalog below carries each description. */}
          {POPULAR_TOOLS.slice(0, 6).map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              title={tool.title}
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
          Exam application sizes
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {EXAM_SHORTCUTS.map(({ key, label }) => (
            <Link
              key={key}
              href={`/exam-requirements/${key}/`}
              className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
            >
              <span className="font-semibold block text-foreground mb-0.5">{label} photo &amp; signature</span>
              <span className="text-muted-foreground leading-normal">{examShortcutLine(PORTAL_PRESETS[key])}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Full catalog by category. Listed tools only: a "Coming soon" card
          reads as a site under construction, and a tool hidden from the index
          is a thin page we don't send visitors to. */}
      {LISTED_CATALOG.map((group) => (
        <section key={group.group} id={group.slug} className="mt-12 scroll-mt-24">
          <h2 className="mb-4 text-lg font-semibold">{group.group}</h2>
          <div className="ep-card-grid sm:!grid-cols-2 lg:!grid-cols-3">
            {group.tools.map((tool) => (
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
            <span className="text-muted-foreground leading-normal">2×2 inch, white background, no glasses</span>
          </Link>
          <Link
            href="/uk-passport-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇬🇧 UK Passport Photo</span>
            <span className="text-muted-foreground leading-normal">35×45mm, any plain light background</span>
          </Link>
          <Link
            href="/canada-passport-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇨🇦 Canada Photo</span>
            <span className="text-muted-foreground leading-normal">Visitor visa, study &amp; work permit</span>
          </Link>
          <Link
            href="/schengen-visa-photo/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇪🇺 Schengen Visa Photo</span>
            <span className="text-muted-foreground leading-normal">35×45mm, plain light background</span>
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
            <span className="text-muted-foreground leading-normal">Starts with a light cream background</span>
          </Link>
          <Link
            href="/australia-passport-photo-maker/"
            className="rounded-md border border-hairline p-3.5 text-xs bg-card transition-colors hover:border-brand/40 hover:bg-accent/40"
          >
            <span className="font-semibold block text-foreground mb-0.5">🇦🇺 Australia Passport</span>
            <span className="text-muted-foreground leading-normal">35×45mm, white or light grey background</span>
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
              Yes. There are no credits, no sign-up and no watermark. The work happens on your own
              phone or computer, so there is no per-file cost to pass on. easyPhoto is free; optional
              tips help pay for it, and it will also carry ads.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">What file formats do the tools accept?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The photo and signature tools take JPG, PNG, WebP and iPhone HEIC files. Passport and
              exam photos are saved as JPG, because that is what most forms ask for; a signature can
              be saved as a JPG on white or a PNG with a see-through background. The document scanner
              saves a PDF or a JPG.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">Where do the KB and pixel sizes come from?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From the exam&apos;s or authority&apos;s own notice where one is published. Where it is not, the
              page names the secondary source it relies on and marks the figure as still needing a
              check. Each exam page links its source and shows the date we checked it. Confirm the
              current application instructions before submitting.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-silo bridge → passport & visa makers */}
      <section className="mt-12 rounded-lg border border-hairline bg-card p-6">
        <h2 className="text-lg font-semibold">Passport &amp; visa photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Need a passport or visa photo? The makers crop it to the size and background your
          country asks for and check it before you download.
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
