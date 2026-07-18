import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { PORTAL_KEYS, type PortalSpec } from "@/lib/portalPresets";
import {
  getPortalSpec,
  specProvenance,
  relatedPortals,
  portalCategory,
  photoDimsPx,
  sigDimsPx,
  PORTAL_CATEGORY_LABEL,
} from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { SUB_EXAM_RESIZERS, RESIZER_YEAR } from "@/lib/subExamResizers";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { Faq } from "@/components/site/Faq";
import { AuthorAvatar } from "@/components/blog/AuthorAvatar";
import { AUTHOR } from "@/lib/author";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { AffiliateCta } from "@/components/site/AffiliateCta";
import { SpecificationProvenance } from "@/components/site/SpecificationProvenance";

// One static page per exam (the cited Spec Database).
export function generateStaticParams() {
  return PORTAL_KEYS.map((exam) => ({ exam: String(exam) }));
}
export const dynamicParams = false;

const photoKb = (s: PortalSpec) =>
  s.photoMinKb ? `${s.photoMinKb}–${s.photoLimitKb} KB` : `under ${s.photoLimitKb} KB`;
const sigKb = (s: PortalSpec) =>
  s.sigLimitKb ? (s.sigMinKb ? `${s.sigMinKb}–${s.sigLimitKb} KB` : `under ${s.sigLimitKb} KB`) : null;
/** " (200 × 230 px)" — or nothing at all, for prose and meta descriptions. */
const parens = (dims: string | null) => (dims ? ` (${dims})` : "");

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

// Per-exam custom titles bypass the template below (titleAbsolute). These are
// the full SERP title, including the brand suffix.
//
// voter-id: MONITORED SXO EXPERIMENT (added 2026-07-10). SERP-backwards
// analysis (2026-07-09 audit) found "voter id photo resizer" is won ~90% by
// Tool/Interactive pages, while this page — which now embeds a real resizer —
// still titles itself "Photo Size" (informational). Hypothesis: appending
// "& Resizer" to the EXISTING "Photo Size" head term (not replacing it) lets
// the page match the transactional SERP intent without sacrificing the
// informational "voter id photo size" queries it already ranks for. Scoped to
// this ONE page on purpose. Review the GSC CTR/position for
// /exam-requirements/voter-id/ around 2026-07-31; if it doesn't improve,
// revert this single line (the template default is the fallback). Do NOT roll
// this out to the other 49 exam pages until this test reads positive.
const EXAM_REQUIREMENTS_TITLE_OVERRIDES: Record<string, string> = {
  "voter-id": "Voter ID Photo Size & Resizer 2026 — easyPhoto",
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
  const titleBase = `${shortName} Photo${sig ? " & Signature" : ""} Size ${RESIZER_YEAR}`;
  const descriptionOverride =
    exam === "airforce-agniveer"
      ? `${shortName}: photo ${photoKb(spec)}, signature ${sig}, both JPG/JPEG. ` +
        "No fixed pixel dimensions are published; confirm the current intake notice."
      : undefined;
  return pageMetadata({
    // Short exam name keeps the SERP title under ~60 chars and matches how
    // people actually search ("SSC photo size", not the full commission name).
    title:
      EXAM_REQUIREMENTS_TITLE_OVERRIDES[exam] ??
      titleBase,
    titleAbsolute: !!EXAM_REQUIREMENTS_TITLE_OVERRIDES[exam],
    description:
      descriptionOverride ??
      // Omit the pixel clause when the authority publishes none — px() renders an
      // em-dash for the spec table, which reads as "(—)" in a SERP snippet.
      `${shortName}: photo ${photoKb(spec)}${parens(photoDimsPx(spec, " px"))}` +
      (sig ? `, signature ${sig}${parens(sigDimsPx(spec, " px"))}` : "") +
      // Only claim "verified" for specs actually confirmed against their source
      // and dated; needs-review presets get an honest "confirm on the source".
      (specProvenance(spec).verified
        ? `. Stored size & format checked against the linked official source.`
        : `. Size & format for the form — confirm the current figures on the official source.`),
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

function rejectionReasons(spec: PortalSpec, hasSignature: boolean): string[] {
  const reasons = [
    spec.verification === "official"
      ? "File size falls outside the published band."
      : "File size does not match the current application's displayed range.",
  ];
  if (photoDimsPx(spec) || spec.photoAspectRatio) {
    reasons.push("Photo does not match the published pixel canvas or aspect ratio.");
  }
  reasons.push("File format differs from the current application's accepted formats.");
  // Only applies to forms that actually take a signature upload — showing this
  // for exams with photo-only uploads would be inaccurate, not just repetitive.
  if (hasSignature) {
    if (sigDimsPx(spec) || spec.sigAspectRatio) {
      reasons.push("Signature does not match the published canvas or aspect ratio.");
    }
    reasons.push("Signature is unclear or includes excess paper around the writing.");
  }
  reasons.push("Photo is blurry or too low-contrast to review clearly.");
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
            author: { name: AUTHOR.name, url: absoluteUrl(AUTHOR.url) },
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
            <Link
              href={AUTHOR.url}
              className="font-medium text-ink hover:text-brand hover:underline"
            >
              {AUTHOR.name}
            </Link>
            , {AUTHOR.title}
          </p>
        </div>
        {/* Provenance / trust signal */}
        <SpecificationProvenance
          verified={prov.verified}
          verifiedOn={prov.verifiedOn}
          sourceUrl={prov.url}
          sourceLabel={prov.sourceLabel}
        />
      </header>

      {/* The spec table — the authoritative, citable data */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="eyebrow">Photo requirement</h2>
          <dl>
            <Row label="File size" value={photoKb(spec)} />
            <Row label="Dimensions" value={photoDimsPx(spec, " px") ?? "—"} />
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
              <Row label="Dimensions" value={sigDimsPx(spec, " px") ?? "—"} />
              <Row label="Format" value="JPG / JPEG" />
              <Row label="Ink" value={spec.signatureInk ?? "Confirm current notice"} />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No separate signature upload is specified for this form. Check the official notification.
            </p>
          )}
        </div>
      </section>

      {spec.context && (
        <section className="space-y-2">
          <h2 className="eyebrow">About this exam</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {spec.context}
          </p>
        </section>
      )}

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

      {/* Transactional tool — embedded, not linked out. AI Overviews answer
          "what size"; hosting the resizer on this indexed URL lets the page win
          "do it" queries ("<exam> photo resizer") too. Previously this section
          linked to /tools/form-resizer/{exam}/, which is noindexed — so the
          transactional ranking had no indexable page to migrate to. The H1
          stays "Photo … Size" (protects the informational rankings); this H2
          carries the "resize" intent. */}
      <section id="resizer" className="space-y-4 rounded-lg border border-brand/25 bg-brand-soft/15 p-5 sm:p-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Prepare your {spec.name.split(" (")[0]} photo{sig ? <> &amp; signature</> : null} to the selected stored target
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Verify the current form before use. Processing is free and stays in your browser.
          </p>
        </div>

        <PortalResizer portalId={exam} />

        {exam === "voter-id" && (
          <div className="rounded-lg border border-hairline bg-card p-4">
            <h3 className="text-sm font-semibold text-ink">
              Voter ID photo guides
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Need the full NVSP/ECI rules before upload? Read the{" "}
              <Link
                href="/blog/voter-id-photo-requirements-2026/"
                className="font-medium text-brand hover:underline"
              >
                Voter ID photo requirements guide
              </Link>
              {" "}
              and compare all ID-card limits in the{" "}
              <Link
                href="/blog/indian-government-id-photo-requirements/"
                className="font-medium text-brand hover:underline"
              >
                Indian government ID photo guide
              </Link>
              .
            </p>
          </div>
        )}

        {(spec.requiresNameDate || spec.requiresSlateNameDate) && (
          <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {spec.requiresSlateNameDate
                ? "This photo needs a name-and-date slate"
                : "This form needs your name & date on the photo"}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              {spec.requiresSlateNameDate ? (
                <>
                  The current notice requires the candidate to be photographed holding
                  a black slate with their name and the photography date written in
                  white chalk. This must be present when the photo is taken, not added
                  digitally afterward.
                </>
              ) : (
                <>
                  {spec.name.split(" (")[0]} requires the candidate&apos;s name and the
                  date of photography printed on the photo itself. After sizing it here,
                  add the strip with the{" "}
                  <Link
                    href="/tools/photo-with-name-date/"
                    className="font-medium underline underline-offset-2"
                  >
                    Photo with Name &amp; Date tool
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        )}

        {sig && (
          <p className="text-sm text-muted-foreground">
            Prefer a guided flow?{" "}
            <Link href="/tools/exam-package/" className="font-medium text-brand hover:underline">
              The photo + signature kit
            </Link>{" "}
            walks both documents through in one place.
          </p>
        )}
      </section>

      {exam === "ssc" && (
        <section className="space-y-6 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">SSC captures the photo live — the signature is the file you prepare</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Current SSC applications capture the photograph live through the
              portal&apos;s camera, so there is no pre-existing photo file to upload.
              The signature is the upload to prepare: {sig}, JPG, on plain white
              paper. The {photoKb(spec)} photo figure stored here is a
              compatibility target, not a current SSC upload requirement — set up
              good light and a plain background before you open the form.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">SSC-specific application note</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              SSC uses these files across recruitments including CGL, CHSL, MTS,
              GD Constable, Stenographer and Junior Engineer through its One-Time
              Registration flow. The current notice publishes no name-and-date rule
              for the image, so no digital name/date strip is needed.
            </p>
          </div>
          {spec.source && (
            <a
              href={spec.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              Check the SSC official portal <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      {exam === "upsc" && (
        <section className="space-y-6 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">UPSC sets separate file-size bands for photo and signature</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The verified UPSC record sets the photo at {photoKb(spec)} and the
              signature at {sig} — two separate bands, so one file cannot satisfy
              both. UPSC publishes these size limits rather than a pixel requirement.
              Both are JPG uploads, and the photo uses a plain white background.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">A live photograph and three signatures on one sheet</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Besides the uploaded photograph, UPSC&apos;s portal captures a live
              photograph during the application and matches it against the file you
              uploaded — so use a current photo that looks like you today. The
              signature upload is one image holding your signature{" "}
              <strong>three times, arranged vertically</strong> on plain white
              paper; a single signature is not what the form expects.
            </p>
          </div>
          {spec.source && (
            <a
              href={spec.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              Check the UPSC online application source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      {exam === "sbi" && (
        <section className="space-y-6 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">SBI uses separate photo and signature upload targets</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The SBI PO record sets the photograph at {photoKb(spec)}, with a
              preferred {photoDimsPx(spec, " px")} canvas. The
              signature uses its own {sig} band and preferred
              {" "}{sigDimsPx(spec, " px")} canvas. The advertisement
              specifies JPG or JPEG files, a minimum {spec.dpi} DPI scan setting,
              and a signature written in {spec.signatureInk?.toLowerCase()}.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">The live photograph is a separate registration step</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              After preparing the scanned photograph, SBI&apos;s registration flow
              also captures and uploads a live image through a webcam or mobile
              phone. This record is scoped to SBI&apos;s 2026 Probationary Officer
              advertisement and its SBI Careers application link, not an IBPS CRP
              application. For Clerk or Specialist Officer recruitment, confirm the
              matching role-specific SBI Careers notice instead of carrying these PO
              values across.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">What can block an SBI upload</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The advertisement says the form displays an error when a file&apos;s size
              or format is outside the prescribed values. It also tells candidates
              to re-upload an unclear or smudged image, so keep the photo and
              signature as separate JPG/JPEG files and check each preview before
              submitting.
            </p>
          </div>
          {spec.source && (
            <a
              href={spec.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              Check the SBI PO 2026 advertisement <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      {exam === "driving-licence" && (
        <section className="space-y-6 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Sarathi checks two separately prepared JPG files</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The Sarathi record sets the colour photo at {photoKb(spec)}, with
              {" "}a preferred {photoDimsPx(spec, " px")} canvas.
              The black-pen signature uses its own {sig} band and preferred
              {" "}{sigDimsPx(spec, " px")} canvas. The upload guide
              requires JPG format for both files.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">The scan guide is shared through Sarathi</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Driving-licence and learner&apos;s-licence applications use the Sarathi
              upload workflow even though the issuing RTO is administered by the
              state. This page follows the national Sarathi scan guide rather than
              inferring different image numbers for each state; confirm the current
              instructions shown for your selected state and service.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">What can block the Sarathi upload</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Sarathi displays an error when the file size or format is outside the
              prescribed values. Its guide also warns that an unclear face or
              signature can require a re-upload, so crop each image to its edges and
              keep the photograph and signature as separate files.
            </p>
          </div>
          {spec.source && (
            <a
              href={spec.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              Check the Sarathi photo and signature guide <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      {exam === "airforce-agniveer" && (
        <section className="space-y-6 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">The current IAF notice uses separate upload bands</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The Agniveervayu Intake 01/2027 record sets the recent colour photo at
              {" "}{photoKb(spec)} and the candidate&apos;s signature at {sig}. Both
              files must be JPG or JPEG. The notice publishes no fixed pixel
              dimensions, so this page does not prescribe a pixel canvas.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">The name and date belong on a black slate</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The candidate must be photographed holding a black slate at chest level,
              with their name and the photography date written clearly in white chalk
              while looking straight at the camera. This is part of the photographed
              scene, not a digital name-and-date strip added afterward.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">What to check before the IAF upload</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A photo or signature outside its recorded KB band, a non-JPG/JPEG file,
              missing slate details, or a signature scan that includes the whole sheet
              can prevent a clean submission. The registration flow also captures a
              live image, so use a current portrait that represents your appearance and
              confirm the current intake notice before submitting.
            </p>
          </div>
          {spec.source && (
            <a
              href={spec.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              Check the IAF Agniveervayu Intake 01/2027 notice <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      {/* Common rejection reasons — unique, useful, links the requirement to the fix */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Why {spec.name.split(" (")[0]} uploads get rejected</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {rejectionReasons(spec, !!sig).map((r) => (
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

      <AffiliateCta examId={exam} />
    </div>
  );
}
