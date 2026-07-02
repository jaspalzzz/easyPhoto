import Link from "next/link";
import { PORTAL_PRESETS, type PortalSpec } from "@/lib/portalPresets";

/**
 * "Exams with this exact cap" — cross-references the verified spec registry
 * from the KB landing pages. Every list is derived (photoLimitKb / sigLimitKb
 * === kb), so each KB tier shows a different, real set of exams linking to
 * its /exam-requirements/ authority page — genuine per-page content, and the
 * internal-link path from the tool page to the citable spec page.
 */
export function KbExamLinks({ kind, kb }: { kind: "photo" | "signature"; kb: number }) {
  const matches = Object.values(PORTAL_PRESETS).filter((s: PortalSpec) =>
    kind === "photo" ? s.photoLimitKb === kb : s.sigLimitKb === kb
  );
  if (matches.length === 0) return null;

  // Keep the section scannable on tiers with many matches (e.g. the 50 KB
  // photo cap covers ~half the registry) — the index page has the full set.
  const MAX_SHOWN = 12;
  const shown = matches.slice(0, MAX_SHOWN);
  const overflow = matches.length - shown.length;
  const noun = kind === "photo" ? "photo" : "signature";

  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-lg font-semibold">
        Exams with a {kb} KB {noun} cap
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        These portals cap the {noun} upload at exactly {kb} KB. Each page below
        has the full verified requirement — dimensions, format and the official
        source — for that exam:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((s) => (
          <Link
            key={s.id}
            href={`/exam-requirements/${s.id}/`}
            className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/50 hover:text-foreground"
          >
            {s.name.split(" (")[0]}
          </Link>
        ))}
        {overflow > 0 && (
          <Link
            href="/exam-requirements/"
            className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-accent/50"
          >
            +{overflow} more exams
          </Link>
        )}
      </div>
    </section>
  );
}
