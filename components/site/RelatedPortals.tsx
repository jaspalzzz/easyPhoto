import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { relatedPortals } from "@/lib/specRegistry";

/**
 * Sibling-portal cross-links — completes the exam hub-and-spoke: every resizer
 * page links to related portals (same category first) AND back to the
 * /exam-requirements/ hub. This is the topical-authority mesh that tells search
 * engines these pages form one coherent cluster. Targets are the canonical
 * /exam-requirements/{id}/ detail pages (the same URLs the hub links out to).
 */
export function RelatedPortals({ portalId }: { portalId: string }) {
  const related = relatedPortals(portalId, 6);
  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-ink">
        Other exam photo &amp; signature specs
      </h2>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {related.map((p) => {
          const short = p.name.split(" (")[0];
          const photo =
            typeof p.photoMinKb === "number"
              ? `${p.photoMinKb}–${p.photoLimitKb} KB`
              : `≤ ${p.photoLimitKb} KB`;
          return (
            <Link
              key={p.id}
              href={`/exam-requirements/${p.id}/`}
              className="ep-card flex items-baseline justify-between gap-3 p-3.5"
            >
              <span className="text-sm font-semibold text-ink">{short}</span>
              <span className="font-mono text-[12px] tabular-nums text-ink-soft">
                {photo}
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        href="/exam-requirements/"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
      >
        See all exam photo &amp; signature requirements
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </Link>
    </section>
  );
}
