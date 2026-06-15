/**
 * Sub-exam resizer landing pages.
 * -------------------------------
 * The SERP for "ssc cgl photo resizer" / "ibps po signature size" is won with
 * PER-SUB-EXAM pages, even though every sub-exam of a parent shares ONE common
 * photo/signature spec (SSC CGL = SSC CHSL = the parent SSC numbers). So each
 * entry here INHERITS its parent's verified PORTAL_PRESETS spec — no new spec
 * data, no fabrication — and only the page's name, title and intro differ.
 *
 * Rendered by app/exam-resizer/[exam]/page.tsx as /exam-resizer/<slug>/.
 */

/** Current recruitment cycle year, used in titles ("… Size 2026"). Bump yearly. */
export const RESIZER_YEAR = 2026;

export interface SubExamResizer {
  /** URL slug, e.g. "ssc-cgl". */
  slug: string;
  /** Parent key into PORTAL_PRESETS (the verified spec source). */
  parentId: string;
  /** Display + keyword name, e.g. "SSC CGL". */
  name: string;
  /** One-line context for the page intro (what the exam is). */
  context: string;
}

export const SUB_EXAM_RESIZERS: SubExamResizer[] = [
  // SSC
  { slug: "ssc-cgl", parentId: "ssc", name: "SSC CGL", context: "Combined Graduate Level" },
  { slug: "ssc-chsl", parentId: "ssc", name: "SSC CHSL", context: "Combined Higher Secondary Level" },
  { slug: "ssc-gd", parentId: "ssc", name: "SSC GD Constable", context: "General Duty Constable" },
  { slug: "ssc-mts", parentId: "ssc", name: "SSC MTS", context: "Multi Tasking Staff" },
  { slug: "ssc-cpo", parentId: "ssc", name: "SSC CPO", context: "Central Police Organisation (SI)" },
  { slug: "ssc-je", parentId: "ssc", name: "SSC JE", context: "Junior Engineer" },
  { slug: "ssc-stenographer", parentId: "ssc", name: "SSC Stenographer", context: "Stenographer Grade C & D" },
  // IBPS / Banking
  { slug: "ibps-po", parentId: "ibps", name: "IBPS PO", context: "Probationary Officer" },
  { slug: "ibps-clerk", parentId: "ibps", name: "IBPS Clerk", context: "Clerical cadre (CSA)" },
  { slug: "ibps-so", parentId: "ibps", name: "IBPS SO", context: "Specialist Officer" },
  { slug: "ibps-rrb", parentId: "ibps", name: "IBPS RRB", context: "Regional Rural Banks" },
  { slug: "sbi-po", parentId: "sbi", name: "SBI PO", context: "Probationary Officer" },
  { slug: "sbi-clerk", parentId: "sbi", name: "SBI Clerk", context: "Junior Associate" },
  // RRB / Railways
  { slug: "rrb-ntpc", parentId: "rrb", name: "RRB NTPC", context: "Non-Technical Popular Categories" },
  { slug: "rrb-group-d", parentId: "rrb", name: "RRB Group D", context: "Level 1 posts" },
  { slug: "rrb-alp", parentId: "rrb", name: "RRB ALP", context: "Assistant Loco Pilot" },
  // UPSC
  { slug: "upsc-cse", parentId: "upsc", name: "UPSC CSE", context: "Civil Services (IAS/IPS)" },
  { slug: "upsc-nda", parentId: "upsc", name: "UPSC NDA", context: "National Defence Academy" },
  { slug: "upsc-cds", parentId: "upsc", name: "UPSC CDS", context: "Combined Defence Services" },
  // NTA
  { slug: "neet", parentId: "nta", name: "NEET", context: "NEET UG medical entrance" },
  { slug: "jee-main", parentId: "nta", name: "JEE Main", context: "Joint Entrance Examination" },
  { slug: "cuet", parentId: "cuet", name: "CUET", context: "Common University Entrance Test" },
];

export const SUB_EXAM_SLUGS = SUB_EXAM_RESIZERS.map((e) => e.slug);

export function getSubExamResizer(slug: string): SubExamResizer | undefined {
  return SUB_EXAM_RESIZERS.find((e) => e.slug === slug);
}
