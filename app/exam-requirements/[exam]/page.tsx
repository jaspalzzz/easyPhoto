import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { PORTAL_KEYS, type PortalSpec } from "@/lib/portalPresets";
import {
  getPortalSpec,
  specProvenance,
  relatedPortals,
  portalCategory,
  PORTAL_CATEGORY_LABEL,
} from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { SUB_EXAM_RESIZERS, RESIZER_YEAR } from "@/lib/subExamResizers";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { Faq } from "@/components/site/Faq";
import { AuthorAvatar } from "@/components/blog/AuthorAvatar";
import { AUTHOR } from "@/lib/author";

// One static page per exam (the cited Spec Database).
export function generateStaticParams() {
  return PORTAL_KEYS.map((exam) => ({ exam: String(exam) }));
}
export const dynamicParams = false;

const photoKb = (s: PortalSpec) =>
  s.photoMinKb ? `${s.photoMinKb}–${s.photoLimitKb} KB` : `under ${s.photoLimitKb} KB`;
const sigKb = (s: PortalSpec) =>
  s.sigLimitKb ? (s.sigMinKb ? `${s.sigMinKb}–${s.sigLimitKb} KB` : `under ${s.sigLimitKb} KB`) : null;
const px = (w?: number, h?: number) => (w && h ? `${w} × ${h} px` : "—");

/** Human label for a photo aspect ratio (width / height). */
function aspectLabel(r: number): string {
  if (r === 1) return "Square (1:1)";
  const KNOWN: Array<[number, string]> = [
    [3.5 / 4.5, "3.5 : 4.5"],
    [2.5 / 3.5, "2.5 : 3.5"],
    [20 / 23, "20 : 23"],
  ];
  for (const [v, label] of KNOWN) if (Math.abs(r - v) < 0.01) return label;
  return `${r.toFixed(2)} : 1`;
}

const EXAM_REQUIREMENTS_TITLE_OVERRIDES: Record<string, string> = {
  "army-agniveer": "Army Agniveer Photo & Signature Size — Exact Specs & Resize Tool",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  const spec = getPortalSpec(exam);
  if (!spec) return {};
  const sig = sigKb(spec);
  // Short name (not the full spec.name, which can include a long parenthetical
  // like "SSC (Staff Selection Commission)") — the full name plus dimensions
  // for both photo and signature was pushing descriptions to 195-217 chars,
  // well past the ~155-160 char SERP display width, so they were truncating.
  const shortName = spec.name.split(" (")[0];
  // Longer exam names (e.g. "Driving Licence", "Indian Navy Agniveer") push
  // the title with " (Official)" past the ~60-char SERP budget once the
  // " — easyPhoto" template suffix is appended. Drop that qualifier rather
  // than truncate mid-word — the spec table's "Official source" badge and
  // the meta description already carry the trust signal.
  const titleBase = `${shortName} Photo${sig ? " & Signature" : ""} Size ${RESIZER_YEAR}`;
  const titleWithOfficial = `${titleBase} (Official)`;
  const fitsWithOfficial = `${titleWithOfficial} — ${SITE_NAME}`.length <= 60;
  return pageMetadata({
    // Short exam name keeps the SERP title under ~60 chars and matches how
    // people actually search ("SSC photo size", not the full commission name).
    title:
      EXAM_REQUIREMENTS_TITLE_OVERRIDES[exam] ??
      (fitsWithOfficial ? titleWithOfficial : titleBase),
    titleAbsolute: !!EXAM_REQUIREMENTS_TITLE_OVERRIDES[exam],
    description:
      `${shortName}: photo ${photoKb(spec)} (${px(spec.photoWidthPx, spec.photoHeightPx)})` +
      (sig ? `, signature ${sig} (${px(spec.sigWidthPx, spec.sigHeightPx)})` : "") +
      `. Exact size & format for the form — verified against the official source.`,
    path: `/exam-requirements/${exam}/`,
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-mono text-[13px] font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function rejectionReasons(hasSignature: boolean): string[] {
  const reasons = [
    "File size over the limit — even 1 KB above the cap is auto-rejected by many portals.",
    "Wrong pixel dimensions or aspect ratio.",
    "Wrong file format (most portals want JPG/JPEG).",
  ];
  // Only applies to forms that actually take a signature upload — showing this
  // for exams with photo-only uploads would be inaccurate, not just repetitive.
  if (hasSignature) {
    reasons.push("Signature uploaded with a white box / paper background instead of clean ink.");
  }
  reasons.push("Old, blurry, or low-contrast photo, or wrong (non-white) background.");
  return reasons;
}

// Sub-exams that share the parent's ONE common photo/signature spec (e.g. SSC's
// One-Time-Registration). Listing them captures the long-tail "ssc cgl photo
// size" / "upsc nda photo size" queries on this verified page — no separate
// pages, no fabricated specs (they inherit the parent's exact numbers).
const SUB_EXAMS: Record<string, string[]> = {
  ssc: ["SSC CGL", "SSC CHSL", "SSC GD Constable", "SSC MTS", "SSC CPO", "SSC JE", "SSC Stenographer", "SSC Selection Post"],
  upsc: ["UPSC CSE (IAS/IPS)", "UPSC NDA", "UPSC CDS", "UPSC CAPF", "UPSC IFS", "UPSC EPFO", "UPSC CMS"],
  ibps: ["IBPS PO", "IBPS Clerk", "IBPS SO", "IBPS RRB"],
  sbi: ["SBI PO", "SBI Clerk", "SBI SO"],
  rrb: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE"],
  nta: ["NEET UG", "JEE Main"],
};

export default async function Page({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const spec = getPortalSpec(exam);
  if (!spec) notFound();

  const prov = specProvenance(spec);
  const sig = sigKb(spec);
  const path = `/exam-requirements/${exam}/`;
  const faqItems = portalFaqItems(spec);
  const related = relatedPortals(exam, 6);
  const categoryLabel = PORTAL_CATEGORY_LABEL[portalCategory(exam)];

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Exam Requirements", path: "/exam-requirements/" },
            { name: spec.name, path },
          ]),
          webPageSchema({
            name: `${spec.name} Photo${sig ? " & Signature" : ""} Size`,
            description: spec.description,
            url: path,
            ...(prov.verifiedOn ? { dateModified: prov.verifiedOn } : {}),
            author: { name: AUTHOR.name, url: AUTHOR.url },
          }),
          faqSchema(faqItems),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/exam-requirements/" className="hover:text-foreground">Exam Requirements</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">{spec.name}</span>
      </nav>

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          {spec.name} Photo{sig ? <> &amp; Signature</> : null} Size
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {spec.description}
        </p>
        {/* Reviewer byline — named-person E-E-A-T signal ("Who"), matching the
            blog post treatment. Compact (no full author card) since this
            template covers 50+ pages. */}
        <div className="flex items-center gap-2">
          <AuthorAvatar src={AUTHOR.photo} name={AUTHOR.name} className="h-6 w-6" />
          <p className="text-xs text-ink-soft">
            Reviewed by{" "}
            <a
              href={AUTHOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-brand hover:underline"
            >
              {AUTHOR.name}
            </a>
            , {AUTHOR.title}
          </p>
        </div>
        {/* Provenance / trust signal */}
        <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
          <span>{prov.label}.</span>
          {prov.url && (
            <a
              href={prov.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-brand hover:underline"
            >
              Official source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </p>
      </header>

      {/* The spec table — the authoritative, citable data */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="eyebrow">Photo requirement</h2>
          <dl>
            <Row label="File size" value={photoKb(spec)} />
            <Row label="Dimensions" value={px(spec.photoWidthPx, spec.photoHeightPx)} />
            {spec.photoAspectRatio && (
              <Row label="Aspect" value={aspectLabel(spec.photoAspectRatio)} />
            )}
            <Row label="Format" value="JPG / JPEG" />
            <Row label="Background" value="Plain white" />
          </dl>
        </div>
        <div className="space-y-3">
          <h2 className="eyebrow">Signature requirement</h2>
          {sig ? (
            <dl>
              <Row label="File size" value={sig} />
              <Row label="Dimensions" value={px(spec.sigWidthPx, spec.sigHeightPx)} />
              <Row label="Format" value="JPG / JPEG" />
              <Row label="Ink" value={spec.signatureInk ?? "Black/blue on white paper"} />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No separate signature upload is specified for this form. Check the official notification.
            </p>
          )}
        </div>
      </section>

      {SUB_EXAMS[exam] && (
        <section className="space-y-3">
          <h2 className="eyebrow">Covers these {spec.name.split(" (")[0]} exams</h2>
          <p className="text-sm text-muted-foreground">
            {spec.name.split(" (")[0]} uses one common photo &amp; signature specification
            across its exams, so the same sizes apply to:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUB_EXAMS[exam].map((e) => {
              // If a dedicated sub-exam resizer page exists, link to it.
              const sub = SUB_EXAM_RESIZERS.find(
                (s) => s.parentId === exam && e.startsWith(s.name)
              );
              return sub ? (
                <Link
                  key={e}
                  href={`/exam-resizer/${sub.slug}/`}
                  className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft/40"
                >
                  {e} resizer
                </Link>
              ) : (
                <span
                  key={e}
                  className="rounded-md border border-hairline bg-card px-3 py-1.5 text-[13px] font-medium text-foreground"
                >
                  {e}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Transactional CTAs — AI Overviews answer "what size"; we win "do it". */}
      <section className="rounded-lg border border-brand/25 bg-brand-soft/20 p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Make a {spec.name.split(" (")[0]}-ready photo{sig ? <> &amp; signature</> : null}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Resize and compress to these exact limits, free and in your browser — nothing is uploaded.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link
            href={`/tools/form-resizer/${exam}/`}
            className="inline-flex items-center gap-1 rounded-md bg-cta px-3.5 py-2 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
          >
            Open the {spec.name.split(" (")[0]} resizer <ArrowRight className="h-4 w-4" />
          </Link>
          {sig && (
            <Link href="/tools/exam-package/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
              Photo + signature kit
            </Link>
          )}
        </div>
      </section>

      {/* Common rejection reasons — unique, useful, links the requirement to the fix */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Why {spec.name.split(" (")[0]} uploads get rejected</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {rejectionReasons(!!sig).map((r) => (
            <li key={r} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={1.75} />
              {r}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Specs can change between notification cycles — always confirm the current limit on the official
          portal before submitting.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="eyebrow">{categoryLabel} &amp; more</h2>
        <div className="flex flex-wrap gap-1.5">
          {related.map((s) => (
            <Link
              key={s.id}
              href={`/exam-requirements/${s.id}/`}
              className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground"
            >
              {s.name.split(" (")[0]}
            </Link>
          ))}
          <Link
            href="/exam-requirements/"
            className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-accent/50"
          >
            All exams
          </Link>
        </div>
      </section>

      <section>
        <Faq items={faqItems} noSchema />
      </section>
    </div>
  );
}
