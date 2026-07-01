/**
 * Portal specifications for image resizing (photo + signature).
 * -----------------------------------------------------------
 * Standard rules for Indian government & global portal forms.
 *
 * SPEC ACCURACY IS THE PRODUCT. A wrong dimension/KB cap means a rejected
 * application — so every spec carries provenance: the official `source`, a
 * `verification` status, and the date it was last confirmed (`verifiedOn`).
 * Use lib/specRegistry.ts to surface this on pages and to flag stale specs.
 */

/** Where a spec's numbers came from. */
export interface SpecSource {
  /** Official portal / notification URL the numbers were taken from. */
  url: string;
  /** Short human label, e.g. "SSC official portal". */
  label: string;
}

/**
 * "official"     = numbers confirmed against `source` on `verifiedOn`.
 * "needs-review" = carried from earlier code; not yet re-confirmed live.
 */
export type VerificationStatus = "official" | "needs-review";

export interface PortalSpec {
  id: string;
  name: string;
  photoLimitKb: number;
  photoMinKb?: number;
  sigLimitKb?: number;
  sigMinKb?: number;
  photoWidthPx?: number;
  photoHeightPx?: number;
  sigWidthPx?: number;
  sigHeightPx?: number;
  photoAspectRatio?: number; // width / height
  sigAspectRatio?: number;
  description: string;
  /** Provenance (optional for back-compat; should be set for all live specs). */
  source?: SpecSource;
  verification?: VerificationStatus;
  /** ISO date (YYYY-MM-DD) the numbers were last confirmed against `source`. */
  verifiedOn?: string;
  /**
   * Scan DPI the portal officially mandates (e.g. PAN: 200). Written into the
   * exported JPEG's JFIF header so a strict metadata check also passes.
   */
  dpi?: number;
  /**
   * The portal requires the candidate's name and/or the date of photography
   * printed onto the photo itself (e.g. Kerala PSC Thulasi, Army/Navy Agniveer).
   * When true, the resizer surfaces a callout linking to the name+date tool so
   * the requirement isn't missed.
   */
  requiresNameDate?: boolean;
  /**
   * 1–2 sentences of ACCURATE, exam-specific context (conducting body, exams
   * covered, where/how the photo is uploaded, exam-specific rules). Surfaced as
   * unique on-page prose to differentiate the otherwise-templated per-exam
   * resizer pages. Verifiable facts only — no marketing fluff, no guessed numbers.
   */
  context?: string;
}

export const PORTAL_PRESETS: Record<string, PortalSpec> = {
  ssc: {
    id: "ssc",
    name: "SSC (Staff Selection Commission)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 4 / 2,
    description: "Staff Selection Commission photo (20-50 KB, 3.5x4.5cm) and signature (10-20 KB, 4.0x2.0cm).",
    source: { url: "https://ssc.gov.in", label: "SSC official portal (ssc.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "SSC (Staff Selection Commission) recruitments — CGL, CHSL, MTS, GD Constable, Stenographer and Junior Engineer — collect your photograph and signature during the One-Time Registration (OTR) on ssc.gov.in. SSC also requires your name and the date the photo was taken to appear on the photograph itself.",
  },
  upsc: {
    id: "upsc",
    name: "UPSC (Union Public Service Commission)",
    photoLimitKb: 300,
    photoMinKb: 20,
    sigLimitKb: 300,
    sigMinKb: 20,
    photoWidthPx: 550,
    photoHeightPx: 550,
    sigWidthPx: 350,
    sigHeightPx: 350,
    photoAspectRatio: 1,
    sigAspectRatio: 1,
    description: "Union Public Service Commission online application (OTR portal). Photo 20-300 KB, 550x550 to 1000x1000 px, plain white background with name + date at the bottom; signature 20-300 KB, 350x350 to 550x550 px; JPG. (The paste-on-paper scan guide quotes 5x6 cm photo / 6x3 cm signature at 200 DPI — that is scanning guidance; the portal's actual upload limits are the KB/px above.)",
    source: { url: "https://upsconline.nic.in", label: "UPSC online application (upsconline.nic.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
    requiresNameDate: true,
    context:
      "UPSC (Union Public Service Commission) runs the Civil Services (IAS, IPS, IFS), CDS, NDA, CMS and other central recruitments through a single One-Time Registration (OTR) account on upsconline.nic.in. UPSC requires the candidate's name and the date the photo was taken to be printed on the photograph itself.",
  },
  ds160: {
    id: "ds160",
    name: "US DS-160 (Visa)",
    photoLimitKb: 240,
    photoWidthPx: 600,
    photoHeightPx: 600,
    photoAspectRatio: 1,
    description: "Online US Visa Application DS-160. Square photo (600x600px up to 1200x1200px), under 240 KB limit, white background.",
    source: { url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html", label: "US Dept. of State photo requirements" },
    verification: "official",
    verifiedOn: "2026-06-08",
  },
  "passport-seva": {
    id: "passport-seva",
    name: "Passport Seva (India)",
    photoLimitKb: 250,
    photoMinKb: 10,
    sigLimitKb: 100,
    sigMinKb: 10,
    photoWidthPx: 630,
    photoHeightPx: 810,
    sigWidthPx: 450,
    sigHeightPx: 150,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 4.5 / 1.5,
    description: "Passport Seva online portal. Photo 630x810 px, 10-250 KB, white background, face 80-85%. Signature rectangular, up to 100 KB.",
    source: { url: "https://www.passportindia.gov.in", label: "Passport Seva (passportindia.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
  },
  oci: {
    id: "oci",
    name: "OCI Card (India)",
    photoLimitKb: 200,
    sigLimitKb: 200,
    photoWidthPx: 360,
    photoHeightPx: 360,
    sigWidthPx: 600,
    sigHeightPx: 200,
    photoAspectRatio: 1,
    sigAspectRatio: 3,
    description: "OCI registration. Square photo 200-900 px, up to 200 KB. Signature 3:1 rectangular (e.g. 600x200 px), up to 200 KB.",
    source: { url: "https://ociservices.gov.in", label: "OCI Services (ociservices.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
  },
  rrb: {
    id: "rrb",
    name: "Railway Recruitment Board (RRB)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 40,
    sigMinKb: 10,
    photoWidthPx: 320,
    photoHeightPx: 240,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 320 / 240,
    sigAspectRatio: 14 / 6,
    description: "Railway Recruitment Board (rrbapply.gov.in). Photo 20-50 KB (320x240 px or 35x45 mm, white background, 100 DPI); signature 10-40 KB (140x60 px or 50x20 mm, black ink, running letters); JPG/JPEG. Same template across NTPC, Group D, ALP and Technician CENs. (Some RRB FAQs quote 30-70 KB, but the CEN notification's 20-50 KB / 10-40 KB governs.)",
    source: { url: "https://rrbapply.gov.in", label: "RRB Application Portal (rrbapply.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "Railway Recruitment Board (RRB) recruitments — NTPC, Group D, ALP and Technician — are applied for on the common portal rrbapply.gov.in, and share the same photo and signature upload spec across every CEN notification.",
  },
  ibps: {
    id: "ibps",
    name: "IBPS Exams",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "Institute of Banking Personnel Selection photo (20-50 KB, 200x230px) and signature (10-20 KB, 140x60px, black ink).",
    source: { url: "https://ibps.in", label: "IBPS official portal (ibps.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "IBPS (Institute of Banking Personnel Selection) conducts the common recruitment process for Probationary Officer, Clerk, Specialist Officer and Regional Rural Bank posts across public-sector banks; the photo and signature are uploaded during the online registration at ibps.in.",
  },
  sbi: {
    id: "sbi",
    name: "SBI PO / Careers",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "State Bank of India PO recruitment photo (20-50 KB, 200x230px) and signature (10-20 KB, 140x60px, black ink).",
    source: { url: "https://sbi.co.in/web/careers", label: "SBI Careers (sbi.co.in/web/careers)" },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "The State Bank of India recruits its Probationary Officer, Clerk (Junior Associate) and Specialist Officer cadres directly through its own careers portal — separately from the IBPS common exam — though the photo and signature upload limits match most banking recruitments.",
  },
  nta: {
    id: "nta",
    name: "NTA (NEET / JEE)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 100,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 280,
    sigHeightPx: 120,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 3.5 / 1.5,
    description: "NTA exams (NEET, JEE Main). Passport photo 3.5x4.5cm, 10-200 KB; signature 3.5x1.5cm, 10-100 KB, JPG. (NEET also needs a separate 4x6 inch postcard photo.)",
    source: { url: "https://exams.nta.ac.in", label: "NTA exams portal (nta.ac.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "The National Testing Agency (NTA) conducts NEET-UG and JEE Main; you upload the photo and signature during the online application. NEET applicants also need a separate 4×6 inch (postcard-size) photograph in addition to the passport-size one.",
  },
  rbi: {
    id: "rbi",
    name: "RBI (Grade B / Assistant)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "Reserve Bank of India recruitment (Grade B, Assistant). Photo 20-50 KB, 200x230 px; signature 10-20 KB, 140x60 px, black ink, JPG.",
    source: { url: "https://opportunities.rbi.org.in", label: "RBI Opportunities (rbi.org.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
  },
  ctet: {
    id: "ctet",
    name: "CTET (CBSE)",
    photoLimitKb: 100,
    photoMinKb: 10,
    sigLimitKb: 30,
    sigMinKb: 3,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 280,
    sigHeightPx: 120,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 3.5 / 1.5,
    description: "CBSE CTET. Photo 3.5x4.5cm, 10-100 KB; signature 3.5x1.5cm, 3-30 KB, JPG. The portal auto-rejects wrong dimensions, so match exactly.",
    source: { url: "https://ctet.nic.in", label: "CTET (ctet.nic.in)" },
    verification: "official",
    verifiedOn: "2026-06-08",
  },
  uppsc: {
    id: "uppsc",
    name: "UPPSC (Uttar Pradesh PSC)",
    photoLimitKb: 50,
    sigLimitKb: 30,
    description: "Uttar Pradesh PSC (OTR portal). Photo under 50 KB (5 cm x 6 cm); signature under 30 KB (6 cm x 3 cm); true colour at 200 DPI. The official OTR guideline gives cm dimensions and a maximum file size only — no fixed pixel size and no minimum.",
    source: { url: "https://uppsc.up.nic.in", label: "UPPSC (uppsc.up.nic.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  bpsc: {
    id: "bpsc",
    name: "BPSC (Bihar PSC)",
    photoLimitKb: 50,
    sigLimitKb: 20,
    description: "Bihar PSC captures your photograph live via webcam during the online application — there is no photo file to upload, so use the photo tool only for general passport-photo prep. The signature is uploaded under 20 KB (both a Hindi and an English signature), JPG.",
    source: { url: "https://bpsc.bihar.gov.in", label: "BPSC (bpsc.bihar.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  mpsc: {
    id: "mpsc",
    name: "MPSC (Maharashtra PSC)",
    photoLimitKb: 50,
    sigLimitKb: 50,
    description: "Maharashtra PSC. Photo up to 50 KB (3.5 cm x 4.5 cm, solid-colour background); signature up to 50 KB (3.5 cm x 1.5 cm, black ink on white paper); JPG/JPEG only. The official instructions give cm dimensions and a 50 KB max for both — no pixel size and no minimum.",
    source: { url: "https://mpsc.gov.in", label: "MPSC (mpsc.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },

  // ---------------------------------------------------------------------------
  // National exams (NTA / GATE) — confirmed against official bulletins, 2026-06.
  // ---------------------------------------------------------------------------
  gate: {
    id: "gate",
    name: "GATE (Engineering)",
    photoLimitKb: 600,
    photoMinKb: 5,
    sigLimitKb: 300,
    sigMinKb: 3,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 400,
    sigHeightPx: 130,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 400 / 130,
    description: "Graduate Aptitude Test in Engineering. Photo 5-600 KB (200x260 to 530x690 px, 3.5x4.5 cm); signature 3-300 KB (250x80 to 580x180 px), JPEG. The KB cap is set by the conducting IIT each year (600 KB for GATE 2026 / IIT Guwahati) — confirm the current bulletin.",
    source: { url: "https://gate2026.iitg.ac.in", label: "GATE 2026 (IIT Guwahati)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  "ugc-net": {
    id: "ugc-net",
    name: "UGC-NET (NTA)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description: "UGC National Eligibility Test (conducted by NTA). Photo 10-200 KB; signature 10-50 KB; JPG/JPEG only. NTA specifies file size and format but no fixed pixel dimensions.",
    source: { url: "https://ugcnet.nta.ac.in", label: "NTA UGC-NET (ugcnet.nta.ac.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  "csir-net": {
    id: "csir-net",
    name: "CSIR-NET (NTA)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description: "Joint CSIR-UGC NET (conducted by NTA). Photo 10-200 KB; signature 10-50 KB; JPG/JPEG only. NTA specifies file size and format but no fixed pixel dimensions.",
    source: { url: "https://csirnet.nta.ac.in", label: "NTA CSIR-NET (csirnet.nta.ac.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },

  // ---------------------------------------------------------------------------
  // Defence (UPSC OTR portal + IAF) — confirmed against official upload PDFs.
  // ---------------------------------------------------------------------------
  nda: {
    id: "nda",
    name: "NDA (National Defence Academy)",
    photoLimitKb: 100,
    photoMinKb: 50,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 420,
    sigHeightPx: 120,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 420 / 120,
    description: "National Defence Academy (conducted by UPSC via upsconline.nic.in). Photo 50-100 KB (3.5x4.5 cm, 240x320 to 480x640 px); signature 10-50 KB (7x2 cm box, 280x80 to 560x160 px); JPG/JPEG.",
    source: { url: "https://upsconline.nic.in", label: "UPSC online (upsconline.nic.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  cds: {
    id: "cds",
    name: "CDS (Combined Defence Services)",
    photoLimitKb: 100,
    photoMinKb: 50,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 420,
    sigHeightPx: 120,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 420 / 120,
    description: "Combined Defence Services (conducted by UPSC via upsconline.nic.in). Photo 50-100 KB (3.5x4.5 cm, 240x320 to 480x640 px); signature 10-50 KB (7x2 cm box, 280x80 to 560x160 px); JPG/JPEG.",
    source: { url: "https://upsconline.nic.in", label: "UPSC online (upsconline.nic.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  afcat: {
    id: "afcat",
    name: "AFCAT (Air Force)",
    photoLimitKb: 200,
    photoMinKb: 100,
    sigLimitKb: 150,
    sigMinKb: 80,
    description: "Air Force Common Admission Test. Photo 100-200 KB; signature 80-150 KB; thumb impression 50-100 KB; JPG/JPEG. The 2026 notification specifies file size and format but no fixed pixel dimensions. (The older '10-50 KB' spec is outdated.)",
    source: { url: "https://afcat.cdac.in", label: "AFCAT (afcat.cdac.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },

  // ---------------------------------------------------------------------------
  // State PSCs — confirmed against official portal/OTR/notification PDFs.
  // ---------------------------------------------------------------------------
  rpsc: {
    id: "rpsc",
    name: "RPSC (Rajasthan PSC)",
    photoLimitKb: 100,
    photoMinKb: 50,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 420,
    sigHeightPx: 120,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 420 / 120,
    description: "Rajasthan PSC (via SSO Rajasthan recruitment portal). Photo 50-100 KB (3.5x4.5 cm, 240x320 to 480x640 px); signature 10-50 KB (7x2 cm box, 280x80 to 560x160 px); JPG/JPEG.",
    source: { url: "https://rpsc.rajasthan.gov.in", label: "RPSC (rpsc.rajasthan.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  tnpsc: {
    id: "tnpsc",
    name: "TNPSC (Tamil Nadu PSC)",
    photoLimitKb: 50,
    sigLimitKb: 20,
    photoWidthPx: 350,
    photoHeightPx: 400,
    sigWidthPx: 250,
    sigHeightPx: 180,
    description: "Tamil Nadu PSC. Photo under 50 KB (300-400 x 250-400 px); signature under 20 KB (200-300 x 150-250 px); JPG/JPEG. No minimum file size is specified.",
    source: { url: "https://tnpsc.gov.in", label: "TNPSC (tnpsc.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  kpsc: {
    id: "kpsc",
    name: "KPSC (Karnataka PSC)",
    photoLimitKb: 200,
    sigLimitKb: 50,
    photoWidthPx: 150,
    photoHeightPx: 150,
    sigWidthPx: 150,
    sigHeightPx: 150,
    description: "Karnataka PSC (online application portal). Photo up to 200 KB (100x100 to 150x150 px); signature up to 50 KB (50x50 to 150x150 px); JPG/JPEG/PNG. Specific exam notifications may impose tighter limits.",
    source: { url: "https://kpsc.kar.nic.in", label: "KPSC (kpsc.kar.nic.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  appsc: {
    id: "appsc",
    name: "APPSC (Andhra Pradesh PSC)",
    photoLimitKb: 50,
    sigLimitKb: 30,
    description: "Andhra Pradesh PSC (OTPR registration). Photo about 50 KB (3.5x4.5 cm, with name + date printed on it); signature about 30 KB (3.5x1.5 cm), uploaded separately; JPG. The official manual gives cm + KB but no pixel dimensions.",
    source: { url: "https://psc.ap.gov.in", label: "APPSC (psc.ap.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
    requiresNameDate: true,
  },
  tgpsc: {
    id: "tgpsc",
    name: "TGPSC / TSPSC (Telangana PSC)",
    photoLimitKb: 50,
    photoMinKb: 4,
    sigLimitKb: 30,
    sigMinKb: 1,
    description: "Telangana PSC (One Time Registration). Photo 4-50 KB (3.5x4.5 cm); signature 1-30 KB (3.5x1.5 cm), uploaded separately; JPG/JPEG/PNG. The official OTR manual gives cm + KB but no pixel dimensions.",
    source: { url: "https://tgpsc.gov.in", label: "TGPSC (tgpsc.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  wbpsc: {
    id: "wbpsc",
    name: "WBPSC (West Bengal PSC)",
    photoLimitKb: 50,
    sigLimitKb: 50,
    description: "West Bengal PSC. Photo up to 50 KB (3.5x4.5 cm); signature up to 50 KB (3.5x1.5 cm); JPG/JPEG. Some WBPSC notifications cap the photo at 100 KB instead — confirm the current notification.",
    source: { url: "https://wbpsc.gov.in", label: "WBPSC (wbpsc.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  gpsc: {
    id: "gpsc",
    name: "GPSC (Gujarat PSC)",
    photoLimitKb: 15,
    sigLimitKb: 15,
    description: "Gujarat PSC (via OJAS). Photo up to 15 KB (5 cm x 3.6 cm); signature up to 15 KB (signed in blue/black ink); JPG. The official guideline gives cm + a 15 KB cap but no pixel dimensions.",
    source: { url: "https://gpsc.gujarat.gov.in", label: "GPSC (gpsc.gujarat.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  hpsc: {
    id: "hpsc",
    name: "HPSC (Haryana PSC)",
    photoLimitKb: 500,
    sigLimitKb: 500,
    photoWidthPx: 150,
    photoHeightPx: 190,
    sigWidthPx: 150,
    sigHeightPx: 60,
    description: "Haryana PSC (online registration). Photo up to 500 KB (132x170 to 160x204 px); signature up to 500 KB (132x57 to 160x68 px); JPG/JPEG/PNG.",
    source: { url: "https://hpsc.gov.in", label: "HPSC (hpsc.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },

  // ---------------------------------------------------------------------------
  // Banking & insurance (IBPS-standard) — confirmed against official notices.
  // ---------------------------------------------------------------------------
  nabard: {
    id: "nabard",
    name: "NABARD (Grade A / B)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "NABARD recruitment (IBPS-administered). Photo 20-50 KB (200x230 px); signature 10-20 KB (140x60 px); JPG/JPEG, min 200 DPI.",
    source: { url: "https://nabard.org", label: "NABARD (nabard.org)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  lic: {
    id: "lic",
    name: "LIC (AAO / ADO)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "LIC recruitment (AAO / ADO). Photo 20-50 KB (200x230 px); signature 10-20 KB (140x60 px); JPG/JPEG.",
    source: { url: "https://licindia.in", label: "LIC India (licindia.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  niacl: {
    id: "niacl",
    name: "NIACL (AO / Assistant)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "New India Assurance (NIACL AO / Assistant). Photo 20-50 KB (200x230 px); signature 10-20 KB (140x60 px); JPG/JPEG.",
    source: { url: "https://www.newindia.co.in", label: "NIACL (newindia.co.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  irdai: {
    id: "irdai",
    name: "IRDAI (Assistant Manager)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description: "IRDAI recruitment (Assistant Manager). Photo 20-50 KB (200x230 px); signature 10-20 KB (140x60 px); JPG/JPEG, min 200 DPI.",
    source: { url: "https://irdai.gov.in", label: "IRDAI (irdai.gov.in)" },
    verification: "official",
    verifiedOn: "2026-06-10",
  },
  cat: {
    id: "cat",
    name: "CAT (IIM Common Admission Test)",
    photoLimitKb: 80,
    sigLimitKb: 80,
    photoWidthPx: 1200,
    photoHeightPx: 1200,
    photoAspectRatio: 1,
    description:
      "IIM Common Admission Test registration (iimcat.ac.in). Photo 1200×1200 px JPG/JPEG up to 80 KB, recent colour photo (within 6 months) on a white background, no selfies; signature 80×35 mm JPG/JPEG up to 80 KB, in ballpoint pen, scanned.",
    source: {
      url: "https://cdn.digialm.com/per/g06/pub/32842/EForms/image/CAT2025/Registration_Guide.pdf",
      label: "CAT Registration Guide (iimcat.ac.in)",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
  },
  clat: {
    id: "clat",
    name: "CLAT (Common Law Admission Test)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description:
      "Consortium of NLUs CLAT application. Photo 20-50 KB (200×230 px) JPG/JPEG, recent passport-style; signature 10-20 KB (140×60 px), black ink on white paper, scanned at 200 DPI minimum.",
    source: {
      url: "https://consortiumofnlus.ac.in",
      label: "Consortium of NLUs (consortiumofnlus.ac.in)",
    },
    verification: "needs-review",
  },
  "army-agniveer": {
    id: "army-agniveer",
    name: "Army Agniveer (Indian Army CEE)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 413,
    photoHeightPx: 531,
    sigWidthPx: 413,
    sigHeightPx: 177,
    photoAspectRatio: 413 / 531,
    sigAspectRatio: 413 / 177,
    description:
      "Indian Army Agniveer registration (joinindianarmy.nic.in). Photo 20-50 KB JPEG, 413×531 px, with your NAME and the DATE the photo was taken printed at the bottom — Army-specific and checked at every stage. Signature 10-20 KB (413×177 px), black ink, running hand (block capitals are rejected at document verification).",
    source: {
      url: "https://joinindianarmy.nic.in",
      label: "Join Indian Army (joinindianarmy.nic.in)",
    },
    verification: "needs-review",
    requiresNameDate: true,
  },
  "airforce-agniveer": {
    id: "airforce-agniveer",
    name: "Agniveervayu (Indian Air Force)",
    photoLimitKb: 50,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description:
      "Indian Air Force Agniveervayu application (agnipathvayu.cdac.in). Photo 10-50 KB JPEG/JPG — recent passport-size colour photo holding a black slate at chest level with your name and the date written in white chalk. Signature 10-50 KB; a left-thumb impression image (also 10-50 KB) is uploaded the same way.",
    source: {
      url: "https://agnipathvayu.cdac.in/AV/guidelines",
      label: "CASB Agniveervayu guidelines (agnipathvayu.cdac.in)",
    },
    verification: "official",
    verifiedOn: "2026-06-11",
  },
  "up-police": {
    id: "up-police",
    name: "UP Police (UPPBPB)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 5,
    photoAspectRatio: 35 / 45,
    description:
      "Uttar Pradesh Police Recruitment & Promotion Board (UPPBPB) online registration — constable, SI and other posts. Photo 35×45 mm JPEG/JPG/JPE, 20-50 KB; signature 35×15 mm, 5-20 KB. Limits can change per recruitment notification — the portal validates at upload.",
    source: { url: "https://uppbpb.gov.in", label: "UPPBPB (uppbpb.gov.in)" },
    verification: "needs-review",
  },
  // ---- Indian identity documents ----
  pan: {
    id: "pan",
    name: "PAN Card (NSDL / Protean & UTIITSL)",
    photoLimitKb: 20,
    sigLimitKb: 10,
    // 3.5 cm (h) × 2.5 cm (w) at the mandated 200 DPI → ~197×276 px.
    photoWidthPx: 197,
    photoHeightPx: 276,
    // Signature 2 cm (h) × 4.5 cm (w) at 200 DPI → ~354×157 px.
    sigWidthPx: 354,
    sigHeightPx: 157,
    photoAspectRatio: 2.5 / 3.5,
    sigAspectRatio: 4.5 / 2,
    description:
      "Online PAN application (Form 49A/49AA via Protean-NSDL or UTIITSL). Photo 3.5×2.5 cm colour JPEG at 200 DPI, max 20 KB; signature 2×4.5 cm JPEG at 200 DPI, max 10 KB. These are the strictest official caps — a file that meets them is accepted in every application mode.",
    source: {
      url: "https://tin.tin.proteantech.in/pan/InstructionDSC.html",
      label: "Protean (NSDL e-Gov) PAN instructions",
    },
    verification: "official",
    verifiedOn: "2026-06-11",
    dpi: 200, // officially mandated scan resolution
  },
  "driving-licence": {
    id: "driving-licence",
    name: "Driving Licence (Sarathi Parivahan)",
    photoLimitKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 420,
    photoHeightPx: 525,
    photoAspectRatio: 35 / 45,
    description:
      "Driving licence / learner's licence application on the Sarathi Parivahan portal (sarathi.parivahan.gov.in). Photo 35×45 mm JPEG under 20 KB (commonly accepted at 420×525 px); signature JPEG 10-20 KB, black or blue ink on white paper. Some states enforce slightly different limits — the portal validates at upload, so check the message your state's portal shows.",
    source: {
      url: "https://sarathi.parivahan.gov.in",
      label: "Sarathi Parivahan (sarathi.parivahan.gov.in)",
    },
    verification: "needs-review",
  },
  "voter-id": {
    id: "voter-id",
    name: "Voter ID (ECI Form 6)",
    photoLimitKb: 2048,
    photoAspectRatio: 3.5 / 4.5,
    description:
      "New voter registration (Form 6) on the ECI Voters' Service Portal (voters.eci.gov.in). The ECI specifies a recent passport-size colour photo, 4.5×3.5 cm, white background, full frontal face, eyes open. The portal accepts a generous file size (about 2 MB) — a clear photo around 100-300 KB uploads fastest and is well within the cap. No separate signature upload for Form 6.",
    source: {
      url: "https://voters.eci.gov.in/guidelines/Form-6_en.pdf",
      label: "ECI Form 6 guidelines (voters.eci.gov.in)",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
  },
  cuet: {
    id: "cuet",
    name: "CUET (Common University Entrance Test)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description:
      "NTA CUET (UG) 2026 application (cuet.nta.nic.in). Photo 10-200 KB JPG/JPEG, ~80% face visible on a white background; signature 10-50 KB JPG/JPEG, black or blue ink on white paper. The official bulletin specifies file size only — no pixel dimensions are stated. A live photo is also captured during the application.",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s3d1a21da7bca4abff8b0b61b87597de73/uploads/2026/01/202601031633478370.pdf",
      label: "NTA CUET(UG) 2026 Information Bulletin",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    context:
      "CUET (Common University Entrance Test) is conducted by the National Testing Agency (NTA) for undergraduate admission to central and other participating universities; the photo and signature are uploaded during the online application, and a live photo is also captured.",
  },

  // ---------------------------------------------------------------------------
  // State PSCs — additional entries.
  // ---------------------------------------------------------------------------
  "kerala-psc": {
    id: "kerala-psc",
    name: "Kerala PSC (Thulasi Portal)",
    photoLimitKb: 30,
    sigLimitKb: 20,
    photoWidthPx: 150,
    photoHeightPx: 200,
    sigWidthPx: 150,
    sigHeightPx: 75,
    photoAspectRatio: 150 / 200,
    sigAspectRatio: 2,
    description:
      "Kerala Public Service Commission (Thulasi portal — thulasi.psc.kerala.gov.in). Photo 150×200 px, under 30 KB, JPG/JPEG, plain light background, with the candidate's name and the date of photography printed at the bottom; signature 150×75 px, under 20 KB. The Thulasi portal is strict on file size — even 31 KB is rejected.",
    source: { url: "https://thulasi.psc.kerala.gov.in", label: "Kerala PSC Thulasi portal" },
    verification: "needs-review",
    requiresNameDate: true,
    context:
      "Kerala Public Service Commission uses its own Thulasi portal for all recruitments. The photo and signature upload limits (150×200 px / 30 KB and 150×75 px / 20 KB) differ from the standard national exam pattern, and Kerala PSC requires your name and the date of photography printed on the photo — always verify against the current notification on thulasi.psc.kerala.gov.in.",
  },

  // ---------------------------------------------------------------------------
  // Central government & skill exams.
  // ---------------------------------------------------------------------------
  "ccc-nielit": {
    id: "ccc-nielit",
    name: "NIELIT CCC (Computer Concepts)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description:
      "NIELIT CCC / BCC / ECC online application (student.nielit.gov.in). Photo 20-50 KB (200×230 px), JPG/JPEG; signature 10-20 KB (140×60 px, black ink on white paper), JPG.",
    source: { url: "https://student.nielit.gov.in", label: "NIELIT Student Portal" },
    verification: "needs-review",
    context:
      "NIELIT (National Institute of Electronics and Information Technology) conducts the CCC (Course on Computer Concepts), BCC and ECC certification exams. The online application and admit card photo/signature are uploaded via student.nielit.gov.in.",
  },

  dsssb: {
    id: "dsssb",
    name: "DSSSB (Delhi SSB)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description:
      "Delhi Subordinate Services Selection Board online application (dsssb.delhi.gov.in). Photo 20-50 KB (200×230 px), JPG/JPEG, plain white background; signature 10-20 KB (140×60 px, black ink), JPG.",
    source: { url: "https://dsssb.delhi.gov.in", label: "DSSSB (dsssb.delhi.gov.in)" },
    verification: "needs-review",
    context:
      "DSSSB (Delhi Subordinate Services Selection Board) recruits for posts under the Government of NCT of Delhi — TGT, PGT, various Group B and C posts. Photo and signature are uploaded on the online application portal.",
  },

  upsssc: {
    id: "upsssc",
    name: "UPSSSC (UP Subordinate Services)",
    photoLimitKb: 100,
    photoMinKb: 50,
    sigLimitKb: 50,
    sigMinKb: 20,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 3.5 / 1.5,
    description:
      "Uttar Pradesh Subordinate Services Selection Commission online application (upsssc.gov.in). Photo 50-100 KB (3.5×4.5 cm), JPG/JPEG/JPE; signature 20-50 KB (3.5×1.5 cm), JPG/JPEG/JPE — per UPSSSC's standing photo/signature upload guideline.",
    source: {
      url: "http://upsssc.gov.in/GuidLineUploadPhoto.htm",
      label: "UPSSSC photo/signature upload guideline",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    context:
      "UPSSSC (Uttar Pradesh Subordinate Services Selection Commission) conducts recruitments for Lekhpal, Junior Assistant, Forest Guard, VDO and many other Group B/C posts under the UP state government. Applications are submitted on upsssc.gov.in.",
  },

  // ---------------------------------------------------------------------------
  // Central Armed Police Forces (CAPFs) & paramilitary.
  // ---------------------------------------------------------------------------
  bsf: {
    id: "bsf",
    name: "BSF (Border Security Force)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description:
      "BSF (Border Security Force) constable / HC / SI recruitment (rectt.bsf.gov.in). Photo 20-50 KB (200×230 px), plain white background, JPG; signature 10-20 KB (140×60 px, black ink), JPG.",
    source: { url: "https://rectt.bsf.gov.in", label: "BSF Recruitment (rectt.bsf.gov.in)" },
    verification: "needs-review",
    context:
      "BSF (Border Security Force) recruits Constable (GD/Tradesmen), Head Constable and Sub-Inspector posts via rectt.bsf.gov.in. Specs are consistent with the standard CAPF pattern but always confirm the current notification before applying.",
  },

  crpf: {
    id: "crpf",
    name: "CRPF (Central Reserve Police)",
    photoLimitKb: 100,
    photoMinKb: 50,
    sigLimitKb: 100,
    sigMinKb: 50,
    photoAspectRatio: 35 / 45,
    description:
      "CRPF (Central Reserve Police Force) Constable (Technical & Tradesmen and Pioneer) 2026 recruitment. Photo 50-100 KB (35mm×45mm), JPG/JPEG, plain colour passport-size photo; signature 50-100 KB, JPG/JPEG/PNG, black ink on white paper — the official notice gives no pixel/cm dimension for the signature.",
    source: {
      url: "https://recruitment.crpf.gov.in/pdf/advertisement/a061ea77-05a2-11f1-9f1b-0a84b243c763.pdf",
      label: "CRPF Constable (Tech/Tradesmen & Pioneer) 2026 advertisement",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    context:
      "CRPF (Central Reserve Police Force) conducts Constable GD, SI (GD/Steno) and ASI (Steno/Clerk) recruitments. Applications go through CRPF's own portal or SSC CAPFs.",
  },

  cisf: {
    id: "cisf",
    name: "CISF (Central Industrial Security)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 4.0 / 2.0,
    description:
      "CISF (Central Industrial Security Force) recruitment. Photo 20-50 KB (3.5cm×4.5cm), JPEG, plain white background; signature 10-20 KB (4.0cm×2.0cm), JPEG.",
    source: {
      url: "https://www.cisf.gov.in/assets/pdfs/2025/05/1182_eng.pdf",
      label: "CISF recruitment notice (cisf.gov.in)",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    context:
      "CISF (Central Industrial Security Force) secures public-sector undertakings, airports and government infrastructure; it recruits Constable (Tradesmen) and Head Constable through its own portal and occasionally through SSC CAPFs.",
  },

  itbp: {
    id: "itbp",
    name: "ITBP (Indo-Tibetan Border Police)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 14 / 6,
    description:
      "ITBP (Indo-Tibetan Border Police) Constable / SI / HC recruitment (itbpolice.nic.in). Photo 20-50 KB (200×230 px), plain white background, JPG; signature 10-20 KB (140×60 px), JPG.",
    source: { url: "https://itbpolice.nic.in/itbp/rectt", label: "ITBP Recruitment Portal" },
    verification: "needs-review",
    context:
      "ITBP (Indo-Tibetan Border Police) guards India's northern border with China and recruits Constable (GD/Tradesmen), Head Constable and Sub-Inspector through itbpolice.nic.in. Specs follow the standard CAPF pattern.",
  },

  "navy-agniveer": {
    id: "navy-agniveer",
    name: "Indian Navy Agniveer",
    photoLimitKb: 50,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoWidthPx: 413,
    photoHeightPx: 531,
    sigWidthPx: 413,
    sigHeightPx: 177,
    photoAspectRatio: 413 / 531,
    sigAspectRatio: 413 / 177,
    description:
      "Indian Navy Agniveer SSR / MR / CHEF recruitment (joinindiannavy.gov.in). Photo 10-50 KB JPEG, 413×531 px, passport-style with name and date at the bottom; signature 10-50 KB (413×177 px), black ink, running hand.",
    source: { url: "https://joinindiannavy.gov.in", label: "Join Indian Navy (joinindiannavy.gov.in)" },
    verification: "needs-review",
    requiresNameDate: true,
    context:
      "Indian Navy Agniveer (SSR, MR and CHEF) applications are submitted on joinindiannavy.gov.in. Like Army Agniveer, the photo must have the candidate's name and date printed at the bottom. Confirm exact specs in the current notification.",
  },

  // ---------------------------------------------------------------------------
  // Government services & corporations.
  // ---------------------------------------------------------------------------
  epfo: {
    id: "epfo",
    name: "EPFO (SSA / Inspector)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 30,
    sigMinKb: 4,
    description:
      "EPFO (Social Security Assistant / Inspector) recruitment administered by UPSC/IBPS. Photo 10-200 KB JPG/JPEG, light-shade plain background; signature 4-30 KB JPG/JPEG. These figures come from EPFO's most recent locatable SSA advertisement (2023) — no 2025/2026 SSA notification has been published on epfindia.gov.in as of this check, so confirm against the current notice before applying.",
    source: {
      url: "https://www.epfindia.gov.in/site_docs/PDFs/Recruitments_PDFs/Advertisement_for_SSA_24032023.pdf",
      label: "EPFO SSA Advertisement (epfindia.gov.in, 2023)",
    },
    verification: "needs-review",
    context:
      "EPFO (Employees' Provident Fund Organisation) SSA and Inspector recruitments are administered by IBPS or UPSC depending on the cycle. The last locatable official advertisement is from 2023 — confirm against the current cycle's notification once published.",
  },

  fci: {
    id: "fci",
    name: "FCI (Food Corporation of India)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoAspectRatio: 4.5 / 3.5,
    sigWidthPx: 140,
    sigHeightPx: 60,
    sigAspectRatio: 14 / 6,
    description:
      "FCI (Food Corporation of India) recruitment — AGM / JE / Watchman / Typist (fci.gov.in). Photo 4.5cm×3.5cm, colour, light background (the most recent locatable notice, 2022, states no photo KB limit — 20-50 KB is the standard pattern used elsewhere, not FCI-confirmed); signature 140×60 px, 10-20 KB, black or blue ink (confirmed). FCI's 2026 recruitment notification had not yet been published as of this check.",
    source: {
      url: "https://fci.gov.in/fci-storage/storage/app/uploads/653f851f7c7ba1698661663.pdf",
      label: "FCI Category III Advertisement (fci.gov.in, 2022)",
    },
    verification: "needs-review",
    context:
      "FCI (Food Corporation of India) recruits for AGM, Management Trainee, JE, Typist-Hindi, Watchman and other posts via fci.gov.in or NTA when outsourced. The last locatable official advertisement is from 2022 — confirm against the current cycle's notification once published.",
  },
};

export const PORTAL_KEYS = Object.keys(PORTAL_PRESETS) as Array<keyof typeof PORTAL_PRESETS>;
