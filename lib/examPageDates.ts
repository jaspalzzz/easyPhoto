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
export function examPageLastModified(examId: string): string {
  const verified = PORTAL_PRESETS[examId]?.verifiedOn;
  return verified && verified > EXAM_TEMPLATE_UPDATED ? verified : EXAM_TEMPLATE_UPDATED;
}
