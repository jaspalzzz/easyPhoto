import { PORTAL_PRESETS } from "@/lib/portalPresets";

/**
 * When the /exam-requirements/<exam>/ template itself last changed, as opposed
 * to when an exam's specification was last verified against its source.
 * 13 Oct 2026: the repeated resizer text, generic checklist and template FAQ
 * were removed from every template exam page.
 */
export const EXAM_TEMPLATE_UPDATED = "2026-10-13";

/**
 * The date an exam page last changed: the later of its spec verification and
 * the template change. The sitemap's lastmod and the page's JSON-LD
 * dateModified both use this, so the two can never disagree (CLAUDE.md §2).
 * The visible "Verified <date>" line stays the verification date — a
 * different fact.
 */
/**
 * Pages whose own text changed after the template date. 14 Oct 2026 (the top-10
 * competitor fixes): titles with the official figures (SSC, RRB, UPSC), FAQs
 * (RRB, Driving Licence), "About this application" on ID-document pages, and
 * the Voter ID dimensions note and hidden signature card.
 */
const PAGE_UPDATED: Record<string, string> = {
  ssc: "2026-10-14",
  rrb: "2026-10-14",
  upsc: "2026-10-14",
  "driving-licence": "2026-10-14",
  "voter-id": "2026-10-14",
  pan: "2026-10-14",
  oci: "2026-10-14",
  "passport-seva": "2026-10-14",
  ds160: "2026-10-14",
};

export function examPageLastModified(examId: string): string {
  const dates = [EXAM_TEMPLATE_UPDATED, PORTAL_PRESETS[examId]?.verifiedOn, PAGE_UPDATED[examId]];
  return dates.filter((d): d is string => !!d).sort().at(-1)!;
}
