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
import { AcceptanceTips } from "@/components/site/AcceptanceTips";
import { HeadSizeGuide } from "@/components/site/HeadSizeGuide";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
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
    description: `Exact ${spec.label} ${doc} photo requirements: ${mm.width}×${mm.height}mm, ${spec.background.description}. Make one free in your browser — nothing uploaded.`,
    path: `/${maker}/`,
  });
}

/**
 * User-facing "Good to know" copy, keyed by spec id. Kept here (not in the spec
 * DB) so the internal `spec.notes` developer documentation never reaches users.
 */
const GOOD_TO_KNOW: Record<string, string> = {
  india:
    "India is strict about a plain white background and a large, well-lit face. For the older pasted paper form you'll need a genuine photo-lab print, since a home printout is often refused. (The OCI card and the Indian e-Visa use different photos.)",
  us: "The US wants a plain white or off-white background and no glasses. Use a photo from the last six months, and leave a little space above your head so there's room to crop.",
  canada:
    "This covers Canada's 35×45mm photo for visas, study and work permits, PR/Express Entry and online passport renewal. The printed passport booklet photo is different: it needs a commercial photographer's certification and a guarantor signature, which a self-serve tool can't provide.",
  uk: "The UK rejects plain white backgrounds. It wants light grey or cream, which this tool applies for you. Take your glasses off unless you need them for medical reasons.",
  australia:
    "Australia accepts a plain white or light grey background. For a new passport, your guarantor signs the back of one printed photo to confirm it's a true likeness, so add that by hand after you print.",
  schengen:
    "Schengen follows the ICAO standard across all 29 member states. Light grey is the safe background everywhere. Some consulates (Switzerland in particular) reject pure white, so the tool defaults to grey.",
  "india-evisa":
    "The Indian e-Visa photo is square, not the 35×45mm passport shape, on a plain white or light background with no border. Keep it between 350×350 and 1000×1000 px and under about 300 KB for the upload.",
};

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
          faqSchema(faqItems),
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
        <span className="eyebrow block text-brand">{Doc} photo bureau</span>
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

      {/* Spec-aware do/don't — self-check against the real rules before submitting. */}
      <AcceptanceTips spec={spec} />

      {/* Visual head-size guide — diagram cards (correct vs too small/too close). */}
      <HeadSizeGuide spec={spec} />

      {kind === "passport" && (
        <p className="text-sm text-muted-foreground">
          Making a passport photo for a baby or infant?{" "}
          <Link href="/baby-passport-photo/" className="text-brand hover:underline">
            Use the baby &amp; infant guide
          </Link>{" "}
          — the lay-on-a-white-sheet method makes it easy.
        </p>
      )}

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
            {GOOD_TO_KNOW[spec.id] ?? spec.notes}
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
              : "Sourced from reputable guides, so re-check the official portal before submitting."}
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
        <Faq items={faqItems} noSchema />
      </section>
    </div>
  );
}
