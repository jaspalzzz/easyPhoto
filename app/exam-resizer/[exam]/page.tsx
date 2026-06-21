import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import {
  SUB_EXAM_RESIZERS,
  SUB_EXAM_SLUGS,
  getSubExamResizer,
  RESIZER_YEAR,
} from "@/lib/subExamResizers";
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { portalFaqItems } from "@/lib/faqs";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { ExploreTools } from "@/components/site/ExploreTools";
import { ExamSubmitTips } from "@/components/site/AcceptanceTips";
import { ExamSpecTable } from "@/components/site/ExamSpecTable";
import { ExamContext } from "@/components/site/ExamContext";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return SUB_EXAM_SLUGS.map((exam) => ({ exam }));
}
export const dynamicParams = false;

const photoKb = (min: number | undefined, max: number) =>
  min ? `${min}–${max} KB` : `under ${max} KB`;

const EXAM_RESIZER_TITLE_OVERRIDES: Record<string, string> = {
  "ssc-cpo": "SSC CPO Photo & Signature Resize Tool — 35×45mm, JPG, Online Free",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  const e = getSubExamResizer(exam);
  const spec = e ? getPortalSpec(e.parentId) : undefined;
  if (!e || !spec) return {};
  const sig = spec.sigLimitKb;
  return pageMetadata({
    title: EXAM_RESIZER_TITLE_OVERRIDES[exam] ?? `${e.name} Photo & Signature Resizer ${RESIZER_YEAR} — Exact Size`,
    titleAbsolute: true,
    description:
      `Resize your ${e.name} photo to ${photoKb(spec.photoMinKb, spec.photoLimitKb)}` +
      (spec.photoWidthPx ? ` (${spec.photoWidthPx}×${spec.photoHeightPx}px)` : "") +
      (sig ? ` and signature to ${photoKb(spec.sigMinKb, sig)}` : "") +
      `, in the exact size the ${e.name} application form needs. Free, 100% in your browser — nothing uploaded.`,
    path: `/exam-resizer/${exam}/`,
    // Sub-exam resizers inherit the parent portal's spec and duplicate the
    // /exam-requirements/ intent (0 organic clicks, deep rankings). Kept live and
    // linked from the parent spec page, but out of the index to resolve the
    // multi-page-per-portal cannibalization flagged in the AdSense low-value audit.
    noIndex: true,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const e = getSubExamResizer(exam);
  if (!e) notFound();
  const spec = getPortalSpec(e.parentId);
  if (!spec) notFound();

  const prov = specProvenance(spec);
  const path = `/exam-resizer/${exam}/`;
  // Sub-exams share the parent's verified spec, so the parent's FAQ set is
  // accurate; we relabel the heading/title to the sub-exam.
  const faqItems = portalFaqItems(spec);
  const related = SUB_EXAM_RESIZERS.filter(
    (s) => s.parentId === e.parentId && s.slug !== e.slug
  );

  return (
    <div className="container max-w-3xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Exam Requirements", path: "/exam-requirements/" },
            { name: `${e.name} Resizer`, path },
          ]),
          softwareApplicationSchema({
            name: `${e.name} Photo & Signature Resizer`,
            description: `Resize a ${e.name} photo and signature to the exact size and KB the application form requires, in your browser.`,
            url: path,
            dateModified: spec.verifiedOn,
          }),
        ]}
      />

      <Link
        href="/exam-requirements/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All exam requirements
      </Link>

      <header className="space-y-3">
        <span className="eyebrow block text-brand">Exam photo &amp; signature resizer</span>
        <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {e.name} Photo &amp; Signature Resizer {RESIZER_YEAR}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Get your {e.name} ({e.context}) photo and signature to the exact size,
          dimensions and KB the application form demands — auto-resized and
          compliance-checked, free, entirely in your browser.
        </p>
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

      {/* Pre-upload self-check — above the tool, where it pre-empts the fear. */}
      <ExamSubmitTips hasSignature={spec.sigLimitKb !== undefined} />

      <PortalResizer portalId={e.parentId} displayName={e.name} />

      <ExamSpecTable spec={spec} name={e.name} />

      {/* Unique per-sub-exam prose — differentiates same-spec sibling pages. */}
      <section className="max-w-xl">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          About {e.name}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{e.note}</p>
      </section>

      <ExamContext spec={spec} />

      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="eyebrow text-ink-soft">Other {e.name.split(" ")[0]} exams (same spec)</h2>
          <div className="flex flex-wrap gap-1.5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/exam-resizer/${r.slug}/`}
                className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground"
              >
                {r.name}
              </Link>
            ))}
            <Link
              href={`/exam-requirements/${e.parentId}/`}
              className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-accent/50"
            >
              Full spec &amp; sources
            </Link>
          </div>
        </section>
      )}

      <ExploreTools
        className="border-t border-hairline pt-10"
        heading="More free tools"
        subtitle="Photos, signatures, PDFs — all on-device, no sign-up."
      />

      <section>
        <Faq items={faqItems} />
      </section>

      <p className="text-xs text-muted-foreground">
        {e.name} shares the {spec.name.split(" (")[0]} photo &amp; signature
        specification. Specs can change between notification cycles — confirm on
        the official portal before submitting.{" "}
        <Link href={`/exam-requirements/${e.parentId}/`} className="text-brand hover:underline">
          See the full spec
        </Link>
        .
      </p>

      <div className="flex">
        <Link
          href="/exam-calendar/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          Upcoming {e.name.split(" ")[0]} &amp; other exam dates
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
