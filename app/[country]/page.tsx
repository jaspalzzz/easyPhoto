import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  COUNTRY_SPECS,
  LAUNCH_ORDER,
  getSpec,
  effectivePrintMm,
  type CountrySpec,
} from "@/lib/countrySpecs";
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

// Static export: one page per launch country.
export function generateStaticParams() {
  return LAUNCH_ORDER.map((country) => ({ country }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const spec = getSpec(country);
  if (!spec) return {};
  const mm = effectivePrintMm(spec);
  return pageMetadata({
    title: `${spec.label} Passport Photo Size & Maker`,
    description: `Exact ${spec.label} passport/visa photo requirements: ${mm.width}×${mm.height}mm, ${spec.background.description}. Make a compliant photo free, in your browser.`,
    path: `/${country}/`,
  });
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b py-2 text-sm last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function SpecSheet({ spec }: { spec: CountrySpec }) {
  const d = spec.digital;
  const px =
    d.pxMin
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
              className="inline-block h-3.5 w-3.5 rounded-sm border"
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
        value={typeof spec.glasses === "boolean" ? (spec.glasses ? "Allowed" : "Not allowed") : spec.glasses}
      />
      <SpecRow label="Expression" value={spec.smileAllowed} />
    </dl>
  );
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const spec = COUNTRY_SPECS[country];
  if (!spec) notFound();

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Passport Photo Maker", path: "/passport-photo/" },
            { name: `${spec.label} passport photo`, path: `/${country}/` },
          ]),
          softwareApplicationSchema({
            name: `${spec.label} Passport Photo Maker`,
            description: `Make a compliant ${spec.label} passport/visa photo in your browser — exact size, correct background, compliance-checked.`,
            url: `/${country}/`,
          }),
        ]}
      />
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/passport-photo/" className="hover:text-foreground">
          Passport Photo Maker
        </Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">{spec.label}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {spec.label} Passport &amp; Visa Photo Maker
        </h1>
        <p className="text-muted-foreground">
          Make a compliant {spec.label} photo —{" "}
          {effectivePrintMm(spec).width}×{effectivePrintMm(spec).height}mm,{" "}
          {spec.background.description}. Free and fully in your browser.
        </p>
        <p className="text-xs text-muted-foreground">
          Accepted for: {spec.documents.join(", ")}.
        </p>
      </header>

      <PhotoTool spec={spec} />

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {spec.label} photo requirements
          </h2>
          <SpecSheet spec={spec} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Good to know</h2>
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

      {/* File-size help — interlinks to the KB resize tools */}
      <section className="rounded-lg border bg-muted/30 p-5">
        <h2 className="text-base font-semibold">
          Meeting the {spec.label} upload file-size limit
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {spec.digital.fileSizeKb
            ? `Online ${spec.label} uploads accept roughly ${spec.digital.fileSizeKb.min}–${spec.digital.fileSizeKb.max} KB. `
            : ""}
          If your portal or form needs a smaller file, compress your finished
          photo to an exact size — your image stays in your browser.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[20, 50, 100].map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Resize to {kb} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-brand hover:bg-accent"
          >
            Custom size
          </Link>
        </div>
      </section>

      <section>
        <Faq items={countryFaqItems(spec)} />
      </section>
    </div>
  );
}
