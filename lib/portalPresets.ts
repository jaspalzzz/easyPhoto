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
  },
  upsc: {
    id: "upsc",
    name: "UPSC (Union Public Service Commission)",
    photoLimitKb: 300,
    photoMinKb: 20,
    sigLimitKb: 100,
    sigMinKb: 20,
    photoWidthPx: 350,
    photoHeightPx: 350, // UPSC wants square aspects
    sigWidthPx: 350,
    sigHeightPx: 350,
    photoAspectRatio: 1,
    sigAspectRatio: 1,
    description: "Union Public Service Commission online application. Photo 20-300 KB; signature 20-100 KB (three stacked signatures), ~350x350 px.",
    source: { url: "https://upsconline.nic.in", label: "UPSC online application (upsconline.nic.in)" },
    verification: "needs-review",
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
    photoLimitKb: 100,
    photoMinKb: 20,
    sigLimitKb: 40,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 14 / 6,
    description: "Railway Recruitment Board (rrbapply.gov.in). Photo ~20-100 KB, signature ~10-40 KB. Limits vary by sub-exam (NTPC/Group D/ALP) — confirm the current notification. NOTE: These specs are unverified — always check the official RRB notification before submitting.",
    source: { url: "https://rrbapply.gov.in", label: "RRB Application Portal (rrbapply.gov.in)" },
    verification: "needs-review",
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
    photoMinKb: 20,
    sigLimitKb: 30,
    sigMinKb: 10,
    photoWidthPx: 180,
    photoHeightPx: 216,
    sigWidthPx: 216,
    sigHeightPx: 108,
    photoAspectRatio: 180 / 216,
    sigAspectRatio: 216 / 108,
    description: "Uttar Pradesh PSC. Photo ~20-50 KB (180x216 px), signature ~10-30 KB (216x108 px), JPG, scanned at 200 DPI. Specs vary by notification — confirm the current one.",
    source: { url: "https://uppsc.up.nic.in", label: "UPPSC (uppsc.up.nic.in)" },
    verification: "needs-review",
  },
  bpsc: {
    id: "bpsc",
    name: "BPSC (Bihar PSC)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    sigWidthPx: 220,
    sigHeightPx: 100,
    photoAspectRatio: 20 / 23,
    sigAspectRatio: 220 / 100,
    description: "Bihar PSC. Photo ~20-50 KB (200x230 px), signature ~10-20 KB (220x100 px), JPG. Specs vary by notification — confirm the current one.",
    source: { url: "https://bpsc.bihar.gov.in", label: "BPSC (bpsc.bihar.gov.in)" },
    verification: "needs-review",
  },
  mpsc: {
    id: "mpsc",
    name: "MPSC (Maharashtra PSC)",
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
    description: "Maharashtra PSC. Photo ~20-50 KB (200x230 px), signature ~10-20 KB (140x60 px), JPG. Specs vary by notification — confirm the current one.",
    source: { url: "https://mpsc.gov.in", label: "MPSC (mpsc.gov.in)" },
    verification: "needs-review",
  },
};

export const PORTAL_KEYS = Object.keys(PORTAL_PRESETS) as Array<keyof typeof PORTAL_PRESETS>;
