import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { portalFaqItems } from "@/lib/faqs";
import {
  relatedPortals,
  portalCategory,
  PORTAL_CATEGORY_LABEL,
} from "@/lib/specRegistry";

export function generateStaticParams() {
  return PORTAL_KEYS.map((portal) => ({ portal }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ portal: string }>;
}): Promise<Metadata> {
  const { portal } = await params;
  const spec = PORTAL_PRESETS[portal];
  if (!spec) return {};

  const hasSignature = spec.sigLimitKb !== undefined;
  const sigText = hasSignature ? ` and signature under ${spec.sigLimitKb} KB` : "";
  return pageMetadata({
    // Combined-intent title — distinct from the single-document /{exam}-photo-resizer/
    // pages so the two don't compete for the same keyword.
    title: hasSignature
      ? `${spec.name.split(" (")[0]} Photo & Signature Resizer`
      : `${spec.name.split(" (")[0]} Photo Resizer`,
    description: `Free all-in-one tool to compress your photo under ${spec.photoLimitKb} KB${sigText} for ${spec.name} application forms — both documents in one place. 100% private, no upload.`,
    path: `/tools/form-resizer/${portal}/`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ portal: string }>;
}) {
  const { portal } = await params;
  const spec = PORTAL_PRESETS[portal];
  if (!spec) notFound();

  const hasSignature = spec.sigLimitKb !== undefined;
  const related = relatedPortals(portal, 6);
  const categoryLabel = PORTAL_CATEGORY_LABEL[portalCategory(portal)];

  return (
    <ToolPage
      title={
        hasSignature
          ? `${spec.name} Photo & Signature Resizer`
          : `${spec.name} Photo Resizer`
      }
      slug={`form-resizer/${portal}`}
      path={`/tools/form-resizer/${portal}/`}
      blurb={
        hasSignature
          ? `Compress your photo and signature to the exact size and KB the ${spec.name} form needs — both documents in one place.`
          : `Compress your photo to the exact size and KB the ${spec.name} form needs.`
      }
      faqItems={portalFaqItems(spec)}
    >
      <PortalResizer portalId={portal} />

      {spec.requiresNameDate && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            This form needs your name &amp; date on the photo
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
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
          </p>
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        See the full{" "}
        <Link href={`/exam-requirements/${portal}/`} className="text-brand hover:underline">
          {spec.name.split(" (")[0]} photo &amp; signature requirements
        </Link>{" "}
        — official size, dimensions &amp; source.
      </p>

      {/* Cluster the matrix: link to topically related exam resizers. */}
      <section className="mt-8">
        <h2 className="eyebrow mb-3">{categoryLabel} &amp; more</h2>
        <div className="flex flex-wrap gap-1.5">
          {related.map((s) => (
            <Link
              key={s.id}
              href={`/tools/form-resizer/${s.id}/`}
              className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground"
            >
              {s.name.split(" (")[0]}
            </Link>
          ))}
          <Link
            href="/exam-requirements/"
            className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-accent/50"
          >
            All exam specs
          </Link>
        </div>
      </section>
    </ToolPage>
  );
}
