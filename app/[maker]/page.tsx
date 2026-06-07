import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  effectivePrintMm,
  type CountrySpec,
} from "@/lib/countrySpecs";
import {
  MAKER_PAGES,
  getMakerPage,
  makerSpec,
  type MakerKind,
} from "@/lib/makerPages";
import { getMakerContent } from "@/lib/makerContent";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { kbPath } from "@/lib/kbTargets";
import { Faq } from "@/components/site/Faq";
import { countryFaqItems } from "@/lib/faqs";

// Static export: one page per maker slug (passport + visa).
export function generateStaticParams() {
  return MAKER_PAGES.map((m) => ({ maker: m.slug }));
}

export const dynamicParams = false;

const HUB = {
  passport: { name: "Passport Photo Maker", path: "/passport-photo/" },
  visa: { name: "Visa Photo Maker", path: "/visa-photo/" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ maker: string }>;
}): Promise<Metadata> {
  const { maker } = await params;
  const page = getMakerPage(maker);
  const spec = makerSpec(maker);
  if (!page || !spec) return {};
  const mm = effectivePrintMm(spec);
  const doc = page.kind === "visa" ? "visa" : "passport";
  return pageMetadata({
    title: `${spec.label} ${doc === "visa" ? "Visa" : "Passport"} Photo Size & Maker`,
    description: `Exact ${spec.label} ${doc} photo requirements: ${mm.width}×${mm.height}mm, ${spec.background.description}. Make a compliant ${doc} photo free, in your browser — nothing is uploaded.`,
    path: `/${maker}/`,
  });
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-mono text-[13px] font-medium tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function SpecSheet({ spec }: { spec: CountrySpec }) {
  const d = spec.digital;
  const px = d.pxMin
    ? `min ${d.pxMin.width}×${d.pxMin.height}px`
    : d.px
      ? `${d.px.width}×${d.px.height}px`
      : d.pxApprox300dpi
        ? `~${d.pxApprox300dpi.width}×${d.pxApprox300dpi.height}px @300dpi`
        : "—";
  const kb = d.fileSizeKb
    ? `${d.fileSizeKb.min}–${d.fileSizeKb.max} KB`
    : "varies by portal";

  return (
    <dl>
      <SpecRow
        label="Print size"
        value={`${spec.printMm.width} × ${spec.printMm.height} mm`}
      />
      {spec.visaPrintMm && (
        <SpecRow
          label="Visa/permit print size"
          value={`${spec.visaPrintMm.width} × ${spec.visaPrintMm.height} mm`}
        />
      )}
      <SpecRow
        label="Head height"
        value={`${spec.headHeightMm.min}–${spec.headHeightMm.max} mm (chin to crown)`}
      />
      {spec.headPercentOfFrame && (
        <SpecRow
          label="Head % of frame"
          value={`${spec.headPercentOfFrame.min}–${spec.headPercentOfFrame.max}%`}
        />
      )}
      <SpecRow
        label="Background"
        value={
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block h-3.5 w-3.5 rounded-[2px] border border-hairline-strong"
              style={{ backgroundColor: spec.background.hex }}
            />
            {spec.background.hex}
          </span>
        }
      />
      <SpecRow label="Digital size" value={px} />
      <SpecRow label="File size" value={kb} />
      <SpecRow label="Min DPI" value={spec.dpiMin} />
      <SpecRow
        label="Glasses"
        value={
          typeof spec.glasses === "boolean"
            ? spec.glasses
              ? "Allowed"
              : "Not allowed"
            : spec.glasses
        }
      />
      <SpecRow label="Expression" value={spec.smileAllowed} />
    </dl>
  );
}

export default async function MakerPage({
  params,
}: {
  params: Promise<{ maker: string }>;
}) {
  const { maker } = await params;
  const page = getMakerPage(maker);
  const spec = makerSpec(maker);
  if (!page || !spec) notFound();
  const kind: MakerKind = page.kind;
  const doc = kind === "visa" ? "visa" : "passport";
  const Doc = kind === "visa" ? "Visa" : "Passport";
  const hub = HUB[kind];
  const mm = effectivePrintMm(spec);
  const content = getMakerContent(maker);
  // Page-specific FAQs first (unique per page), then the spec-driven set
  // (kind-aware so passport and visa pages don't read as duplicates).
  const faqItems = [
    ...(content?.faqs ?? []),
    ...countryFaqItems(spec, kind),
  ];

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: hub.name, path: hub.path },
            { name: `${spec.label} ${doc} photo`, path: `/${maker}/` },
          ]),
          softwareApplicationSchema({
            name: `${spec.label} ${Doc} Photo Maker`,
            description: `Make a compliant ${spec.label} ${doc} photo in your browser — exact size, correct background, compliance-checked.`,
            url: `/${maker}/`,
          }),
        ]}
      />
      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href={hub.path} className="hover:text-foreground">
          {hub.name}
        </Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">{spec.label}</span>
      </nav>

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          {spec.label} {Doc} Photo Maker
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {content?.intro ??
            `Make a compliant ${spec.label} ${doc} photo at ${mm.width}×${mm.height}mm with the correct background. Free, and fully in your browser.`}
        </p>
        <div className="spec flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
          <span>
            {mm.width}×{mm.height}mm
          </span>
          <span className="text-ink-faint">/</span>
          <span>{spec.background.description.split("(")[0].split(",")[0].trim()}</span>
          <span className="text-ink-faint">/</span>
          <span>{spec.dpiMin} dpi min</span>
        </div>
        <p className="text-xs text-ink-faint">
          Accepted for: {spec.documents.join(", ")}.
        </p>
      </header>

      {/* On visa pages, drop the passport-only advisory (e.g. AU guarantor). */}
      <PhotoTool spec={kind === "visa" ? { ...spec, advisory: undefined } : spec} />

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="eyebrow">
            {spec.label} {doc} photo specification
          </h2>
          <SpecSheet spec={spec} />
        </div>
        <div className="space-y-3">
          <h2 className="eyebrow">Good to know</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {spec.notes}
          </p>
          <a
            href={spec.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Official source <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="text-xs text-muted-foreground">
            Verification status:{" "}
            {spec.verified === "gov"
              ? "Confirmed against the official government source."
              : "Sourced from reputable guides — re-check the official portal before submitting."}
          </p>
        </div>
      </section>

      {/* Unique editorial content — country/kind-specific, for ranking depth */}
      {content && content.sections.length > 0 && (
        <section className="space-y-6">
          {content.sections.map((s) => (
            <div key={s.h} className="space-y-2">
              <h2 className="text-lg font-semibold">{s.h}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.p}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* File-size help — interlinks to the KB resize tools */}
      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Meeting the {spec.label} upload file-size limit
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {spec.digital.fileSizeKb
            ? `Online ${spec.label} uploads accept roughly ${spec.digital.fileSizeKb.min}–${spec.digital.fileSizeKb.max} KB. `
            : ""}
          If your portal needs a smaller file, compress the finished photo to an
          exact size. Your image stays in your browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[20, 50, 100].map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
            >
              Resize to {kb} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft/50"
          >
            Custom size
          </Link>
        </div>
      </section>

      <section>
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
