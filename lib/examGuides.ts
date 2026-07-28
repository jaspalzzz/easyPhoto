import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { portalCategory } from "@/lib/specRegistry";

/**
 * Which in-depth guide an exam-requirement page should point a reader to.
 * ----------------------------------------------------------------------
 * The exam pages are the ones that rank; the guides are where the longer
 * explanation lives. Before this map only four exam pages linked to a guide at
 * all, so 48 of them dead-ended at the resizer.
 *
 * Accuracy rules, because a wrong link here is a wrong claim:
 *  - A portal only gets a named guide when that guide actually covers it.
 *  - The cross-exam guide is offered to exam portals only. The `visa` category
 *    holds passports, OCI, PAN, licences and voter IDs, which are not exams —
 *    those get document guides or nothing.
 *  - The name/date guide is driven by the registry flag, not a hand-kept list,
 *    so it cannot drift out of sync with the specs.
 */
export interface ExamGuideLink {
  /** Blog slug, without the /blog/ prefix or trailing slash. */
  slug: string;
  /** Anchor text. Describes what the guide covers — never overclaims. */
  label: string;
}

/** Portals with a guide written specifically for them. */
const SPECIFIC_GUIDES: Record<string, ExamGuideLink[]> = {
  ssc: [{ slug: "ssc-cgl-chsl-photo-signature-guide-2026", label: "SSC CGL and CHSL photo and signature guide" }],
  upsc: [{ slug: "upsc-cse-ias-photo-signature-guide-2026", label: "UPSC CSE photo and signature guide" }],
  nda: [{ slug: "nda-cds-photo-signature-guide-2026", label: "NDA and CDS photo and signature guide" }],
  cds: [{ slug: "nda-cds-photo-signature-guide-2026", label: "NDA and CDS photo and signature guide" }],
  ibps: [{ slug: "ibps-po-2026-photo-signature-checklist", label: "IBPS PO photo and signature checklist" }],
  pan: [
    { slug: "pan-card-photo-size", label: "PAN card photo size guide" },
    { slug: "indian-government-id-photo-requirements", label: "photo limits across Indian government IDs" },
  ],
  "voter-id": [
    { slug: "voter-id-photo-requirements-2026", label: "Voter ID photo requirements guide" },
    { slug: "indian-government-id-photo-requirements", label: "photo limits across Indian government IDs" },
  ],
  "driving-licence": [
    { slug: "driving-licence-photo-size-sarathi", label: "driving licence photo size guide" },
    { slug: "indian-government-id-photo-requirements", label: "photo limits across Indian government IDs" },
  ],
  "passport-seva": [{ slug: "indian-passport-photo-requirements", label: "Indian passport photo rules" }],
  oci: [{ slug: "indian-passport-photo-requirements", label: "Indian passport and OCI photo rules" }],
  ds160: [{ slug: "passport-photo-size-by-country", label: "passport and visa photo sizes by country" }],
};

/**
 * Categories whose portals are exams. `visa` is deliberately absent: those are
 * identity documents, and the cross-exam guide does not describe them.
 */
const EXAM_CATEGORIES = new Set([
  "central",
  "banking",
  "national",
  "state-psc",
  "defence",
  "police",
]);

/** Offered to any exam without a dedicated guide. Framed as a comparison, not as that exam's own guide. */
const CROSS_EXAM_GUIDE: ExamGuideLink = {
  slug: "exam-photo-signature-size-guide",
  label: "photo and signature limits across major Indian exams",
};

/** Only for portals whose spec actually records a name/date requirement. */
const NAME_DATE_GUIDE: ExamGuideLink = {
  slug: "add-name-date-on-exam-photo",
  label: "how to add the name and date line",
};

/** Guides to surface on `/exam-requirements/{exam}/`. Empty when nothing fits. */
export function examGuideLinks(exam: string): ExamGuideLink[] {
  const spec = PORTAL_PRESETS[exam];
  if (!spec) return [];

  const links = [...(SPECIFIC_GUIDES[exam] ?? [])];

  if (!links.length && EXAM_CATEGORIES.has(portalCategory(exam))) {
    links.push(CROSS_EXAM_GUIDE);
  }

  if (spec.requiresNameDate || spec.requiresSlateNameDate) {
    links.push(NAME_DATE_GUIDE);
  }

  return links;
}
