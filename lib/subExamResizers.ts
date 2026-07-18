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
  /**
   * 2–3 sentences of ACCURATE, exam-specific prose that differentiate this page
   * from its same-spec siblings (conducting body, post type, where the photo is
   * uploaded). Rendered as a unique on-page block. Facts only — NEVER restate
   * photo/signature numbers here (those come from the parent's verified spec)
   * and never invent details.
   */
  note: string;
}

export const SUB_EXAM_RESIZERS: SubExamResizer[] = [
  // SSC
  {
    slug: "ssc-cgl",
    parentId: "ssc",
    name: "SSC CGL",
    context: "Combined Graduate Level",
    note: "SSC CGL recruits graduates for Group B and Group C posts across central government organisations. Current SSC instructions use live photograph capture and a separate prepared signature upload; confirm the CGL notice for the active cycle.",
  },
  {
    slug: "ssc-chsl",
    parentId: "ssc",
    name: "SSC CHSL",
    context: "Combined Higher Secondary Level",
    note: "SSC CHSL is the 10+2 level examination for clerical and data-entry posts. Current SSC instructions use live photograph capture and a separate prepared signature upload; confirm the CHSL notice for the active cycle.",
  },
  {
    slug: "ssc-gd",
    parentId: "ssc",
    name: "SSC GD Constable",
    context: "General Duty Constable",
    note: "SSC GD Constable recruits for listed Central Armed Police Forces and related organisations. Current SSC instructions use live photograph capture and a separate signature upload; the GD notice for the active cycle remains controlling.",
  },
  {
    slug: "ssc-mts",
    parentId: "ssc",
    name: "SSC MTS",
    context: "Multi Tasking Staff",
    note: "SSC MTS fills Multi Tasking Staff and Havaldar posts in central government departments. Current SSC instructions use live photograph capture and a separate signature upload; confirm the current MTS notice before use.",
  },
  {
    slug: "ssc-cpo",
    parentId: "ssc",
    name: "SSC CPO",
    context: "Central Police Organisation (SI)",
    note: "SSC CPO recruits Sub-Inspectors in Delhi Police and the Central Armed Police Forces. Current SSC instructions use live photograph capture and a separate signature upload; confirm the current CPO notice rather than assuming another SSC cycle is identical.",
  },
  {
    slug: "ssc-je",
    parentId: "ssc",
    name: "SSC JE",
    context: "Junior Engineer",
    note: "SSC JE recruits Junior Engineers in Civil, Mechanical and Electrical streams for central government organisations. Current SSC instructions use live photograph capture and a separate signature upload; confirm the current JE notice for cycle-specific details.",
  },
  {
    slug: "ssc-stenographer",
    parentId: "ssc",
    name: "SSC Stenographer",
    context: "Stenographer Grade C & D",
    note: "SSC Stenographer recruits Grade C and Grade D stenographers for central government organisations. Current SSC instructions use live photograph capture and a separate signature upload; confirm the Stenographer notice for the active cycle.",
  },
  // IBPS / Banking
  {
    slug: "ibps-po",
    parentId: "ibps",
    name: "IBPS PO",
    context: "Probationary Officer",
    note: "IBPS PO is the common recruitment process for Probationary Officer and Management Trainee posts across participating public sector banks. Photo and signature are uploaded during online registration on ibps.in and must match at the document-verification stage.",
  },
  {
    slug: "ibps-clerk",
    parentId: "ibps",
    name: "IBPS Clerk",
    context: "Clerical cadre (CSA)",
    note: "IBPS Clerk recruits Customer Service Associates (clerical cadre) for participating public sector banks. The photo and signature follow the common IBPS upload specification used across PO, Clerk and SO recruitment.",
  },
  {
    slug: "ibps-so",
    parentId: "ibps",
    name: "IBPS SO",
    context: "Specialist Officer",
    note: "IBPS SO recruits Specialist Officers — IT, Agriculture, HR, Marketing and Law cadres — for public sector banks. It uses the same IBPS photo and signature upload specification as the PO and Clerk exams.",
  },
  {
    slug: "ibps-rrb",
    parentId: "ibps",
    name: "IBPS RRB",
    context: "Regional Rural Banks",
    note: "IBPS RRB is the common exam for Office Assistant and Officer Scale I–III posts in Regional Rural Banks. Registration and the photo/signature upload follow the standard IBPS specification.",
  },
  {
    slug: "sbi-po",
    parentId: "sbi",
    name: "SBI PO",
    context: "Probationary Officer",
    note: "SBI PO is the State Bank of India's own recruitment for Probationary Officers, run separately from IBPS. The photo and signature are uploaded on the SBI careers portal and rechecked at interview.",
  },
  {
    slug: "sbi-clerk",
    parentId: "sbi",
    name: "SBI Clerk",
    context: "Junior Associate",
    note: "SBI Clerk recruits Junior Associates (customer support and sales) for State Bank of India branches. Like SBI PO, it is conducted by SBI directly, with the photo and signature uploaded on the SBI careers portal.",
  },
  // RRB / Railways
  {
    slug: "rrb-ntpc",
    parentId: "rrb",
    name: "RRB NTPC",
    context: "Non-Technical Popular Categories",
    note: "RRB NTPC recruits for Non-Technical Popular Categories — Station Master, Goods Train Manager, clerk and typist posts. Applications go through the Railway Recruitment Boards' online portal, where the photo and signature are uploaded once.",
  },
  {
    slug: "rrb-group-d",
    parentId: "rrb",
    name: "RRB Group D",
    context: "Level 1 posts",
    note: "RRB Group D recruits Level 1 posts — Track Maintainer, Pointsman, and assistant roles across Indian Railways departments. The photo and signature are uploaded on the RRB portal and follow the same Railway recruitment specification.",
  },
  {
    slug: "rrb-alp",
    parentId: "rrb",
    name: "RRB ALP",
    context: "Assistant Loco Pilot",
    note: "RRB ALP recruits Assistant Loco Pilots for Indian Railways. Registration runs through the Railway Recruitment Boards' portal, so the photo and signature requirements match the other RRB exams.",
  },
  // UPSC
  {
    slug: "upsc-cse",
    parentId: "upsc",
    name: "UPSC CSE",
    context: "Civil Services (IAS/IPS)",
    note: "UPSC CSE is the Civil Services Examination that recruits for the IAS, IPS, IFS and allied services. The current UPSC instructions use a prepared photo upload, a separate mandatory live photograph, and one image containing three signatures; they do not list a digital name-and-date strip.",
  },
  {
    slug: "upsc-nda",
    parentId: "upsc",
    name: "UPSC NDA",
    context: "National Defence Academy",
    note: "UPSC NDA selects candidates for the National Defence Academy's Army, Navy and Air Force wings. It uses the UPSC application workflow: a prepared photo upload, a separate mandatory live photograph, and one image containing three signatures, with no listed digital name-and-date strip.",
  },
  {
    slug: "upsc-cds",
    parentId: "upsc",
    name: "UPSC CDS",
    context: "Combined Defence Services",
    note: "UPSC CDS recruits officers for the Indian Military Academy, Naval Academy, Air Force Academy and Officers' Training Academy. It uses the UPSC workflow for a prepared photo, mandatory live photograph and three-signature image; the current instructions do not list a digital name-and-date strip.",
  },
  // NTA
  {
    slug: "neet",
    parentId: "nta",
    name: "NEET",
    context: "NEET UG medical entrance",
    note: "NEET UG is the national entrance test for MBBS, BDS and allied undergraduate medical courses, conducted by the NTA. The photo and signature are uploaded on the NTA application portal and must match the candidate's appearance on exam day.",
  },
  {
    slug: "jee-main",
    parentId: "nta",
    name: "JEE Main",
    context: "Joint Entrance Examination",
    note: "JEE Main is the NTA's national engineering entrance test and the gateway to NITs, IIITs and JEE Advanced. The photo and signature are uploaded during NTA registration and follow the standard NTA specification.",
  },
  {
    slug: "cuet",
    parentId: "cuet",
    name: "CUET",
    context: "Common University Entrance Test",
    note: "CUET is the Common University Entrance Test used for undergraduate admission to central and participating universities, conducted by the NTA. The photo and signature are uploaded once during the CUET application on the NTA portal.",
  },
];

export const SUB_EXAM_SLUGS = SUB_EXAM_RESIZERS.map((e) => e.slug);

export function getSubExamResizer(slug: string): SubExamResizer | undefined {
  return SUB_EXAM_RESIZERS.find((e) => e.slug === slug);
}
