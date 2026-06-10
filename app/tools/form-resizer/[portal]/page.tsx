import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { portalFaqItems } from "@/lib/faqs";
import { dedicatedResizerLinks } from "@/lib/examResizers";
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
      ? `Resize ${spec.name} Photo & Signature Together`
      : `Resize Photo for ${spec.name}`,
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
  const dedicated = dedicatedResizerLinks(portal);
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

      <p className="mt-4 text-sm text-muted-foreground">
        See the full{" "}
        <Link href={`/exam-requirements/${portal}/`} className="text-brand hover:underline">
          {spec.name.split(" (")[0]} photo &amp; signature requirements
        </Link>{" "}
        — official size, dimensions &amp; source.
      </p>

      {dedicated.length > 0 && (
        <section className="mt-8 rounded-lg border border-hairline bg-paper p-5">
          <h2 className="text-base font-semibold tracking-tight">
            Need just one document?
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            These dedicated tools focus on a single document, with the exact{" "}
            {spec.name} specs and a verified-source check.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {dedicated.map((d) => (
              <Link
                key={d.path}
                href={d.path}
                className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
              >
                {d.kind === "photo" ? "Photo resizer" : "Signature resizer"}
              </Link>
            ))}
          </div>
        </section>
      )}

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
