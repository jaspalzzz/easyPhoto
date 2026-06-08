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
    verification: "needs-review",
  },
  "passport-seva": {
    id: "passport-seva",
    name: "Passport Seva (India)",
    photoLimitKb: 50,
    photoMinKb: 30,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 450,
    sigHeightPx: 150,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 4.5 / 1.5,
    description: "Passport Seva online portal. Photo needs white background (30-50 KB, 3.5x4.5cm). Signature size: 10-20 KB.",
    source: { url: "https://www.passportindia.gov.in", label: "Passport Seva (passportindia.gov.in)" },
    verification: "needs-review",
  },
  oci: {
    id: "oci",
    name: "OCI Card (India)",
    photoLimitKb: 200,
    sigLimitKb: 200,
    photoWidthPx: 360,
    photoHeightPx: 360,
    sigWidthPx: 360,
    sigHeightPx: 360, // OCI signature must be 1:1 square aspect ratio
    photoAspectRatio: 1,
    sigAspectRatio: 1,
    description: "Overseas Citizen of India (OCI) registration. Square photo and signature (up to 200 KB each, minimum 360x360 px).",
    source: { url: "https://ociservices.gov.in", label: "OCI Services (ociservices.gov.in)" },
    verification: "needs-review",
  },
  rrb: {
    id: "rrb",
    name: "Railway Recruitment Board (RRB)",
    photoLimitKb: 70,
    photoMinKb: 20,
    sigLimitKb: 70,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 14 / 6,
    description: "Railway Recruitment Board photo (20-70 KB, 3.5x4.5cm) and signature (10-70 KB, 140x60px).",
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
};

export const PORTAL_KEYS = Object.keys(PORTAL_PRESETS) as Array<keyof typeof PORTAL_PRESETS>;
