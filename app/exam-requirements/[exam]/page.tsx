import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { PORTAL_KEYS, type PortalSpec } from "@/lib/portalPresets";
import {
  getPortalSpec,
  specProvenance,
  relatedPortals,
  portalCategory,
  photoDimsPx,
  sigDimsPx,
  photoSizeLabel,
  sigSizeLabel,
  PORTAL_CATEGORY_LABEL,
} from "@/lib/specRegistry";
import { RESIZER_YEAR } from "@/lib/subExamResizers";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema, softwareApplicationSchema, type Crumb } from "@/lib/schema";
import { Faq } from "@/components/site/Faq";
import { AuthorAvatar } from "@/components/blog/AuthorAvatar";
import { AUTHOR } from "@/lib/author";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { AffiliateCta } from "@/components/site/AffiliateCta";
import { SpecificationProvenance } from "@/components/site/SpecificationProvenance";
import { buttonVariants } from "@/components/ui/button";
import { examGuideLinks } from "@/lib/examGuides";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SupportCard } from "@/components/site/SupportCard";
import { examPageLastModified } from "@/lib/examPageDates";
import { EXAM_GUIDES } from "@/components/site/exam";

// One static page per exam (the cited Spec Database).
export function generateStaticParams() {
  return PORTAL_KEYS.map((exam) => ({ exam: String(exam) }));
}
export const dynamicParams = false;

/** 2000 KB reads as the portal's own "2 MB". */
const kb = (n: number) => (n >= 1000 && n % 1000 === 0 ? `${n / 1000} MB` : `${n} KB`);
const photoKb = (s: PortalSpec) =>
  s.photoMinKb ? `${s.photoMinKb}–${s.photoLimitKb} KB` : `under ${kb(s.photoLimitKb)}`;
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
  // Otherwise the smallest whole-number ratio that matches (5 / 6 → "5 : 6").
  for (let h = 1; h <= 12; h++) {
    const w = Math.round(r * h);
    if (w > 0 && Math.abs(w / h - r) < 0.005) return `${w} : ${h}`;
  }
  return `${r.toFixed(2)} : 1`;
}

/** ID-document pages built from this template: "application", not "exam". */
const ID_DOCUMENTS = new Set(["voter-id", "driving-licence", "pan", "oci", "passport-seva", "ds160"]);

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
// Kept as is: the follow-up title test was dropped in the October wrap-up
// (owner, 13 Oct 2026).
//
// ssc / rrb / upsc (14 Oct 2026 competitor teardown, owner-approved): every
// top result for "<exam> signature size" puts the figures in its title; these
// state the official figures recorded on each page.
const EXAM_REQUIREMENTS_TITLE_OVERRIDES: Record<string, string> = {
  "voter-id": "Voter ID Photo Size & Resizer 2026 — easyPhoto",
  ssc: "SSC Signature Size 2026: 10–20 KB, 6 × 2 cm — easyPhoto",
  rrb: "RRB Signature Size 2026: 30–49 KB, 140 × 60 px — easyPhoto",
  upsc: "UPSC Photo & Signature Size 2026 (20–200 KB) — easyPhoto",
  // Searchers type "agniveer vayu" / "air force", not the official "Agniveervayu";
  // "agniveer vayu photo guidelines" was landing on the Army page (GSC, 90 days).
  "airforce-agniveer": "Air Force Agniveer Vayu Photo Size 2026 (100–200 KB) — easyPhoto",
};

/**
 * H1s in searchers' words where the template's "<name> Photo Size" misses them.
 * voter-id (owner, 15 Oct 2026): "voter photo resize", "voter card photo resize"
 * and "voter id photo resizer" had ~1,850 impressions in 90 days at 7.7–8.3.
 */
const EXAM_REQUIREMENTS_H1_OVERRIDES: Record<string, string> = {
  "voter-id": "Voter ID Photo Resizer & Size (ECI Form 6)",
};

// Per-exam meta descriptions, in the authority's own words, where the template
// reads badly.
// - voter-id: ECI's Form 6 photo rules and the Voters' Service Portal upload
//   field ("Document size maximum 2MB,.jpg,.jpeg"), checked 13 Oct 2026
//   (owner-approved meta fix, 13 Oct 2026).
// - driving-licence: it ranks 2–4 for "driving licence photo and signature
//   size" with almost no clicks (GSC 25 Sep – 12 Oct 2026); this states
//   Sarathi's figures plainly.
// - pan: Protean publishes centimetres and a scan DPI, not pixels, so the
//   template's pixel clause would present our conversion as the rule.
const EXAM_REQUIREMENTS_DESCRIPTION_OVERRIDES: Record<string, string> = {
  pan:
    "PAN card photo and signature size for Protean's online form: photo 3.5 × 2.5 cm, " +
    "max 20 KB; signature 2 × 4.5 cm, max 10 KB; colour JPEG scanned at 200 DPI.",
  "voter-id":
    "Voter ID Form 6 photo: 4.5 × 3.5 cm, colour, white background, unsigned. " +
    "The Voters' Service Portal accepts JPG or JPEG up to 2 MB. Resize yours here.",
  "driving-licence":
    "Driving Licence photo and signature size on Sarathi: photo 420 × 525 px, signature " +
    "256 × 64 px, each 10–20 KB JPG. Resize both here, free.",
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
      ? `Air Force Agniveer Vayu photo: ${photoKb(spec)}${spec.photoFormat ? ` ${spec.photoFormat}` : ""}, holding a black slate ` +
        `with your name and the date in white chalk. Signature: ${sig}${spec.sigFormat ? ` ${spec.sigFormat}` : ""}.`
      : undefined;
  return pageMetadata({
    // Short exam name keeps the SERP title under ~60 chars and matches how
    // people actually search ("SSC photo size", not the full commission name).
    title:
      EXAM_REQUIREMENTS_TITLE_OVERRIDES[exam] ??
      titleBase,
    titleAbsolute: !!EXAM_REQUIREMENTS_TITLE_OVERRIDES[exam],
    description:
      EXAM_REQUIREMENTS_DESCRIPTION_OVERRIDES[exam] ??
      descriptionOverride ??
      EXAM_GUIDES[exam]?.metaDescription ??
      // Omit the pixel clause when the authority publishes none — px() renders an
      // em-dash for the spec table, which reads as "(—)" in a SERP snippet.
      (spec.noPhotoUpload
        ? `${shortName}: photo captured live in the form`
        : `${shortName}: photo ${photoKb(spec)}` +
          parens(
            // CLAUDE.md §3: a figure the source doesn't confirm is labelled ours.
            [photoDimsPx(spec, " px"), specProvenance(spec).verified ? null : "our default, not an official limit"]
              .filter(Boolean)
              .join("; ") || null
          )) +
      (sig ? `, signature ${sig}${parens(sigDimsPx(spec, " px"))}` : "") +
      // Only say "checked" for specs actually confirmed against their source
      // and dated; needs-review presets point the reader to the notice.
      (specProvenance(spec).verified
        ? ". Checked against the official notice, linked on the page."
        : ". Confirm the current notice before you upload."),
    path: `/exam-requirements/${exam}/`,
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-mono text-[14px] font-medium tabular-nums">{value}</dd>
    </div>
  );
}

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
  // A rewritten exam page brings its own body and FAQ; the rest use the template.
  const guide = EXAM_GUIDES[exam];
  // Only rewritten pages carry a FAQ: the template's five questions were the
  // same on every exam page with the name swapped, and restated the spec table.
  const faqItems = guide?.faq ?? spec.faq ?? [];
  const related = relatedPortals(exam, 6);
  const categoryLabel = PORTAL_CATEGORY_LABEL[portalCategory(exam)];
  const guideLinks = examGuideLinks(exam);

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Exam Requirements", path: "/exam-requirements/" },
    { name: spec.name, path },
  ];

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          webPageSchema({
            name: EXAM_REQUIREMENTS_H1_OVERRIDES[exam] ?? `${spec.name} Photo${sig ? " & Signature" : ""} Size`,
            description: spec.description,
            url: path,
            dateModified: examPageLastModified(exam),
            author: { name: AUTHOR.name, url: absoluteUrl(AUTHOR.url) },
          }),
          // The resizer below is a real embedded tool, not just a spec table —
          // give it its own SoftwareApplication node so AI Overviews and Google
          // have a structured signal a tool exists on this page, not only prose.
          softwareApplicationSchema({
            name: `${spec.name.split(" (")[0]} Photo${sig ? " & Signature" : ""} Resizer`,
            description: `Free browser-based resizer for the ${spec.name.split(" (")[0]} photo${sig ? " and signature" : ""}.`,
            url: path,
            dateModified: examPageLastModified(exam),
          }),
          faqItems.length > 0 ? faqSchema(faqItems) : null,
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[36px]">
          {EXAM_REQUIREMENTS_H1_OVERRIDES[exam] ?? (
            <>
              {spec.name} Photo{sig ? <> &amp; Signature</> : null} Size
            </>
          )}
        </h1>
        {!guide && (
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {spec.description}
          </p>
        )}
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
            , {AUTHOR.byline}
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

      {guide && <guide.Body />}

      {!guide && (
        // Phones show the resizer first: every top-3 result for "<exam> photo /
        // signature size" puts the tool on the first screen (SERP research,
        // 13 Oct 2026), and the intro above already states the figures. Only
        // the visual order changes (CSS order below md); the HTML order — what
        // Google reads — stays the same.
        <div className="flex flex-col gap-8">
          {/* Above-the-fold jump link to the embedded resizer further down this
              same page. On mobile the tool section can sit several screens below
              the spec table; this gives a visitor who already knows the numbers
              a one-tap path to the tool without hunting for it. Pure in-page
              anchor — no new route, no change to the H1 or section order. */}
          <a
            href="#resizer"
            className={buttonVariants({ variant: "cta", className: "min-h-11 w-full max-md:hidden sm:w-auto" })}
          >
            {spec.noPhotoUpload
              ? <>Prepare your {spec.name.split(" (")[0]} signature now</>
              : <>Resize your {spec.name.split(" (")[0]} photo{sig ? " & signature" : ""} now</>}{" "}
            <ArrowDown className="h-4 w-4" />
          </a>

          {/* The spec table — the authoritative, citable data */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <h2 className="eyebrow">Photo requirement</h2>
              {spec.noPhotoUpload ? (
                // The form captures the photo live; any photo figure in the
                // record is ours, not the authority's, so none is shown here.
                <dl>
                  <Row label="Photo" value="Captured live in the form" />
                </dl>
              ) : (
              <dl>
                <Row
                  label="File size"
                  value={prov.verified ? photoKb(spec) : `${photoKb(spec)} (easyPhoto default, not an official limit)`}
                />
                {photoSizeLabel(spec, false) && <Row label="Dimensions" value={photoSizeLabel(spec, false)} />}
                {spec.photoAspectRatio && (
                  <Row label="Aspect" value={aspectLabel(spec.photoAspectRatio)} />
                )}
                {spec.photoFormat && <Row label="Format" value={spec.photoFormat} />}
                {spec.photoBackground && (
                  <Row label="Background" value={spec.photoBackground} />
                )}
              </dl>
              )}
            </div>
            {!spec.noSignatureUpload && (
            <div className="space-y-3">
              <h2 className="eyebrow">Signature requirement</h2>
              {sig ? (
                <dl>
                  <Row label="File size" value={prov.verified ? sig : `${sig} (easyPhoto default, not an official limit)`} />
                  {sigSizeLabel(spec, false) && <Row label="Dimensions" value={sigSizeLabel(spec, false)} />}
                  {spec.sigFormat && <Row label="Format" value={spec.sigFormat} />}
                  {spec.signatureInk && <Row label="Ink" value={spec.signatureInk} />}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No separate signature upload is specified for this form. Check the official notification.
                </p>
              )}
            </div>
            )}
          </section>

          {/* Transactional tool — embedded, not linked out. AI Overviews answer
              "what size"; hosting the resizer on this indexed URL lets the page win
              "do it" queries ("<exam> photo resizer") too. Previously this section
              linked to /tools/form-resizer/{exam}/, which is noindexed — so the
              transactional ranking had no indexable page to migrate to. The H1
              stays "Photo … Size" (protects the informational rankings); this H2
              carries the "resize" intent. */}
          <section id="resizer" className="space-y-4 rounded-lg border border-brand/25 bg-brand-soft/15 p-5 max-md:order-first sm:p-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                {spec.noPhotoUpload ? (
                  <>Prepare your {spec.name.split(" (")[0]} signature</>
                ) : (
                  <>Resize your {spec.name.split(" (")[0]} photo{sig ? <> &amp; signature</> : null}</>
                )}
              </h2>
            </div>

            {/* Compact: the requirement is stated above and how the tool works
                is explained once, on /how-photo-checking-works/, instead of
                being repeated on every exam page (AdSense "low value content":
                the same boilerplate on 20 pages read as a templated site). */}
            <PortalResizer portalId={exam} hideDescription compact />

            {/* Read-next guides. This used to be hardcoded for voter-id alone,
                which left 48 exam pages with no route to the longer explanation.
                The map only offers a guide that genuinely covers the portal. */}
            {guideLinks.length > 0 && (
              <div className="support rounded-lg border p-4">
                <h3 className="text-sm font-semibold text-ink">
                  Before you upload
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Read the{" "}
                  {guideLinks.map((guide, i) => (
                    <Fragment key={guide.slug}>
                      {i > 0 && (i === guideLinks.length - 1 ? " and " : ", ")}
                      <Link
                        href={`/blog/${guide.slug}/`}
                        className="font-medium text-brand hover:underline"
                      >
                        {guide.label}
                      </Link>
                    </Fragment>
                  ))}
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
          </section>

          {/* Appears only after a file from the resizer above is saved. */}
          <div className="empty:hidden max-md:order-first">
            <SupportCard tool={`exam-${exam}`} />
          </div>
        </div>
      )}

      {!guide && spec.applicationNotes && spec.applicationNotes.length > 0 && (
        <section className="space-y-3 border-t border-hairline pt-8">
          <h2 className="text-lg font-semibold">
            What the {spec.name.split(" (")[0].replace(/ Exams$/, "")} instructions also say
          </h2>
          <ul className="max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
            {spec.applicationNotes.map((note) => (
              <li key={note.slice(0, 40)} className="flex gap-2.5">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!guide && spec.context && (
        <section className="space-y-2">
          <h2 className="eyebrow">{ID_DOCUMENTS.has(exam) ? "About this application" : "About this exam"}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {spec.context}
          </p>
        </section>
      )}

      {exam === "ugc-net" && (
        <section className="space-y-5 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">UGC-NET uses file limits, not a fixed pixel canvas</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The UGC-NET bulletin records the photograph at {photoKb(spec)} and
              the signature at {sig}, both in {spec.photoFormat}. It does not
              publish fixed photo or signature pixels, so preserve a clear source
              image and compress it into the listed bands instead of forcing it
              into a borrowed 200×230 template.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Keep this application separate from CSIR-NET</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              UGC-NET is the NTA eligibility examination for Assistant Professor
              and Junior Research Fellowship recorded by this preset. Although its
              file bands match the joint CSIR-UGC NET record, use the UGC-NET
              bulletin and application session named on this page. Matching KB
              values do not make the two registrations interchangeable.
            </p>
          </div>
        </section>
      )}

      {exam === "nda" && (
        <section className="space-y-5 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">NDA uses the common UPSC upload workflow</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The National Defence Academy application does not publish a separate
              NDA-only image band. UPSC&apos;s portal instructions apply to this
              examination: photograph {photoKb(spec)}, signature {sig}, and
              {" "}{spec.photoFormat} files. The photo has no published fixed
              pixel dimensions or name-and-date strip.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Prepare the NDA live-photo and triple-signature steps</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              During the NDA application, UPSC also captures a live photograph to
              compare with the uploaded portrait. The signature file is one image
              showing the same signature three times vertically on plain white
              paper. Select NDA in your saved filenames so these assets are not
              confused with a separate CDS application using the same UPSC bands.
            </p>
          </div>
        </section>
      )}

      {exam === "cds" && (
        <section className="space-y-5 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">CDS inherits UPSC&apos;s portal instructions</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Combined Defence Services candidates prepare a {photoKb(spec)}
              photograph and a {sig} signature file under the common UPSC
              instructions. Both are {spec.photoFormat}; UPSC does not publish a
              fixed photo pixel canvas, aspect ratio, DPI value, or digital
              name/date strip for this workflow.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Check the CDS preview as its own submission</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The CDS form includes UPSC&apos;s live-photograph step and expects one
              signature image containing three vertically arranged signatures on
              white paper. Even if you also applied for NDA, reopen and review the
              CDS upload preview and current examination notice; shared technical
              limits do not mean one application record completes the other.
            </p>
          </div>
        </section>
      )}

      {exam === "bpsc" && (
        <section className="space-y-5 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">BPSC captures the portrait through the webcam</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The Bihar PSC manual describes live webcam capture rather than a
              prepared photograph upload. Before opening the form, arrange even
              front lighting, a clear background and a stable camera. The photo
              size in our tool is an easyPhoto default, not a BPSC upload
              specification.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Prepare two language-specific signature files</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              BPSC&apos;s upload step calls for Hindi and English signatures as
              separate {spec.sigFormat} files under {spec.sigLimitKb} KB. Label
              them before starting the application and inspect both previews; a
              successful live portrait does not replace either signature upload.
            </p>
          </div>
        </section>
      )}

      {exam === "rpsc" && (
        <section className="space-y-5 border-t border-hairline pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">RPSC OTR takes the photograph live during KYC</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The Rajasthan recruitment workflow uses webcam capture in One-Time
              Registration, so it does not ask for a pre-existing photo file. Use
              the compatibility photo control only for general preparation and
              follow the live KYC prompts shown in the current SSO session.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">RPSC has more than one signature-related upload</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The recorded OTR flow lists separate English and Hindi signatures in
              {spec.sigFormat}, each {sig}, as well as a left thumb impression and
              a handwritten specimen with their own form instructions. Do not merge
              these items into one image, and confirm the current figures because
              this preset remains marked for review.
            </p>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="eyebrow">{categoryLabel} &amp; more</h2>
        <div className="flex flex-wrap gap-1.5">
          {related.map((s) => (
            <Link
              key={s.id}
              href={`/exam-requirements/${s.id}/`}
              className="rounded-md border border-hairline px-3 py-1.5 text-[14px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground"
            >
              {s.name.split(" (")[0]}
            </Link>
          ))}
          <Link
            href="/exam-requirements/"
            className="rounded-md border border-hairline px-3 py-1.5 text-[14px] font-medium text-brand transition-colors hover:bg-accent/50"
          >
            All exams
          </Link>
        </div>
      </section>

      {faqItems.length > 0 && (
        <section>
          <Faq items={faqItems} noSchema />
        </section>
      )}

      <AffiliateCta examId={exam} />
    </div>
  );
}
