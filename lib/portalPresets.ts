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
   * The photo must show the candidate holding a slate with their name and the
   * photography date. This is distinct from a digitally printed name/date
   * strip and must not direct users to the strip-adding tool.
   */
  requiresSlateNameDate?: boolean;
  /**
   * Signature ink requirement, when the official source specifies one exactly
   * (e.g. driving-licence and up-police confirm "black" only, not blue). Only
   * set this when actually confirmed — the exam-requirements template falls
   * back to "Black/blue on white paper" (the common default across specs)
   * when this is unset, so leaving it unset is the honest default, not a bug.
   */
  signatureInk?: string;
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
    // Compatibility-only photo target. Current SSC notices use live capture
    // and publish no pre-existing photo-upload KB or pixel requirement.
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    sigAspectRatio: 6 / 2,
    description:
      "Current 2026 SSC applications capture the candidate's photograph live and do not use a pre-existing photo upload. The stored 20–50 KB photo target is compatibility-only, not a current SSC requirement. The current notice specifies a JPEG/JPG signature of 10–20 KB at about 6.0×2.0 cm; it publishes no photo or signature pixel dimensions, photo aspect ratio, DPI, or name/date rule. Confirm the current exam notice before using the compatibility photo output.",
    source: {
      url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cht_2026.pdf",
      label: "SSC Combined Hindi Translators Examination 2026 notice, paragraphs 8.4–8.7",
    },
    verification: "needs-review",
    context:
      "The current SSC application module captures a live photograph from the candidate's computer or mobile camera. A pre-existing photograph is not uploaded. The signature remains a separate JPEG/JPG upload; confirm the current notice for the specific SSC examination before preparing files.",
  },
  upsc: {
    id: "upsc",
    name: "UPSC (Union Public Service Commission)",
    photoLimitKb: 200,
    photoMinKb: 20,
    sigLimitKb: 100,
    sigMinKb: 20,
    description:
      "UPSC's current application portal requires a JPG photograph of 20–200 KB with a plain white background and about 75% face coverage, plus a JPG image containing three signatures arranged vertically at 20–100 KB and 350–500 pixels. The instructions publish no fixed photo pixel dimensions, photo aspect ratio, DPI, or name/date strip.",
    source: {
      url: "https://upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf",
      label: "UPSC — Instructions for Uploading the Photo & Signature",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    signatureInk: "Black ink on plain white paper",
    context:
      "UPSC's current portal requires both an uploaded passport-size photograph and a live photograph captured during the application. The live image is matched with the uploaded photo. The signature upload must show the candidate's signature three times vertically on one plain-white image.",
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
    context:
      "The DS-160 is the online nonimmigrant visa application form for the United States; the photo is uploaded directly within the form on the US Department of State's travel.state.gov portal.",
  },
  "passport-seva": {
    id: "passport-seva",
    name: "Passport Seva overseas ICAO",
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
    description:
      "Conditional compatibility preset, not an ordinary domestic Passport Seva upload requirement. The 630x810 px photo format is confirmed for the overseas Indian-mission ICAO workflow; the stored KB and signature limits need workflow-specific verification.",
    source: {
      url: "https://embassy.passportindia.gov.in/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf",
      label: "Passport Seva at Indian Embassies — ICAO photograph guidance",
    },
    verification: "needs-review",
    context:
      "For ordinary adult fresh/reissue applications in India, Passport Seva captures the photograph and biometrics at the PSK/POPSK; applicants do not upload or carry a photo. Children below four carry a 45x35 mm white-background print. Use this digital preset only when a separate overseas workflow requests it, and confirm the current mission instructions before relying on the stored KB or signature limits.",
  },
  oci: {
    id: "oci",
    name: "OCI Card (India)",
    photoLimitKb: 200,
    sigLimitKb: 200,
    photoAspectRatio: 1,
    description: "OCI registration. The photograph upload must be square, 200x200 to 900x900 px, JPEG/JPG, up to 200 KB, on a plain light-coloured background that is not white. A signature image is also uploaded as JPEG/JPG up to 200 KB, but the OCI FAQ publishes no signature pixel dimensions or aspect ratio.",
    source: {
      url: "https://ociservices.gov.in/onlineOCI/onlineOCI/faq",
      label: "OCI Services FAQ — photograph and signature upload requirements",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "OCI registration uses separate photograph and signature uploads. The official photograph guide specifies a square 51x51 mm colour photograph on a plain light-coloured background, while the online FAQ publishes a 200x200 to 900x900 px square range and a 200 KB maximum. The FAQ confirms a signature upload but publishes no signature geometry, so no fixed signature pixels are applied.",
  },
  rrb: {
    id: "rrb",
    // Acronym-first, matching every other entry's "SHORT (long form)"
    // convention — the reversed order here made `.split(" (")[0])`
    // (used for titles/meta descriptions/UI labels) pick the 26-char full
    // name instead of "RRB", overflowing SERP title/description budgets.
    name: "RRB (Railway Recruitment Board)",
    // Compatibility-only photo target. Current CENs capture the photograph live
    // and do not accept a pre-existing photo file.
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 49,
    sigMinKb: 30,
    sigWidthPx: 140,
    sigHeightPx: 60,
    sigAspectRatio: 14 / 6,
    signatureInk: "Black ink on white paper",
    description:
      "Current RRB CEN applications capture the candidate's photograph live and do not accept a pre-existing photo upload. The stored 20–50 KB photo target is compatibility-only, not a current RRB requirement. The current notice specifies a JPG/JPEG signature of 30–49 KB, at least 140×60 px, scanned at a minimum 100 DPI in running handwriting. Confirm the current CEN before using the compatibility photo output.",
    source: {
      url: "https://www.rrbcdg.gov.in/uploads/2025/03-PMED/CEN%2003_2025.pdf",
      label: "RRB CEN 03/2025, paragraphs 14.4–14.5.1",
    },
    verification: "needs-review",
    context:
      "Current Railway Recruitment Board notices use webcam or mobile-camera live photo capture during the application. Only the signature is prepared as an image file; confirm the current CEN because recruitment-cycle instructions can change.",
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
    dpi: 200,
    signatureInk: "Black ink on white paper",
    description:
      "IBPS CRP-XVI photo 20–50 KB at a preferred 200×230 px and signature 10–20 KB at a preferred 140×60 px, JPG/JPEG, with a minimum 200 DPI scan setting. The signature is written in black ink on white paper; registration also includes a separately captured live photograph.",
    source: {
      url: "https://www.ibps.in/wp-content/uploads/Detailed-Notification-CRP-SPL-XVI_Final_V1_30.06.2026.pdf",
      label: "IBPS CRP Specialist Officers XVI notice, Annexure III",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    context:
      "IBPS CRP registration uploads a passport-style photograph and signature and also captures a separate live photograph by webcam or mobile phone. The pixel dimensions in the current notice are preferred dimensions; confirm the current CRP notice for the recruitment cycle being used.",
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
    dpi: 200,
    signatureInk: "Black ink on white paper",
    description:
      "SBI PO 2026 photo 20–50 KB at a preferred 200×230 px and signature 10–20 KB at a preferred 140×60 px, JPG/JPEG, with a minimum 200 DPI scan setting. The signature is written in black ink on white paper; registration also includes a separately captured live photograph.",
    source: {
      url: "https://sbi.bank.in/csfile/18062026_1_Detailed_Adv.2026.pdf",
      label: "SBI PO 2026 advertisement CRPD/PO/2026-27/09, Annexure II",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    context:
      "SBI's 2026 Probationary Officer application requires the scanned photograph and signature files recorded here and a separate live photograph captured by webcam or mobile phone. These values are scoped to advertisement CRPD/PO/2026-27/09; confirm the current SBI notice for another recruitment.",
  },
  nta: {
    id: "nta",
    name: "NTA (NEET / JEE)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 100,
    sigMinKb: 10,
    // NTA publishes file-size limits only — the NEET-UG 2026 bulletin (and the
    // UGC-NET bulletin) state no pixel dimensions for the photo or signature.
    // Aspect ratios kept as crop hints from the conventional "passport size".
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 3.5 / 1.5,
    description: "NTA exams (NEET, JEE Main). Passport-size photo, 10-200 KB; signature 10-100 KB, JPG, white background with ~80% face. NTA publishes no pixel dimensions. (NEET also needs a separate 4x6 inch postcard photo.)",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/20260208939209382.pdf",
      label: "NEET-UG 2026 — Information Bulletin (NTA)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
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
    dpi: 200,
    description: "Reserve Bank of India recruitment (Grade B, Assistant). Photo 20-50 KB, 200x230 px (preferred), light/white background; signature 10-20 KB, 140x60 px (preferred), black ink on white paper; JPG/JPEG, scanned at 200 dpi true colour.",
    source: {
      url: "https://rbidocs.rbi.org.in/rdocs/content/pdfs/RPJECE07012019_AN1.pdf",
      label: "RBI — Guidelines for Scanning the Photograph & Signature (Annex I)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "The Reserve Bank of India recruits Grade B Officers and Assistants through its own recruitment portal at opportunities.rbi.org.in, separate from the IBPS common exam used by most other public-sector banks.",
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
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s3443dec3062d0286986e21dc0631734c9/uploads/2026/05/202605111250310617.pdf",
      label: "CTET September 2026 — Information Bulletin",
    },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "CTET (Central Teacher Eligibility Test) is CBSE's national teacher-eligibility exam; the online application at ctet.nic.in validates photo and signature dimensions automatically at upload, so a mismatch is rejected immediately rather than at verification.",
  },
  uppsc: {
    id: "uppsc",
    name: "UPPSC (Uttar Pradesh PSC)",
    photoLimitKb: 50,
    sigLimitKb: 30,
    photoAspectRatio: 5 / 6,
    sigAspectRatio: 6 / 3,
    dpi: 200,
    description: "Uttar Pradesh PSC OTR upload. Photo under 50 KB (5 cm x 6 cm); signature under 30 KB (6 cm x 3 cm); true colour at 200 DPI. The OTR guideline gives centimetre dimensions and maximum file sizes, but no fixed pixel size or minimum KB value.",
    source: {
      url: "https://uppsc.up.nic.in/CMS/OTR_DOC/OTR_PHOTO_INSTRUCTION.pdf",
      label: "UPPSC OTR — Photo and signature upload instructions",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "Uttar Pradesh Public Service Commission recruitments use One-Time Registration. The OTR instructions require the candidate to upload photo and signature files once; this is an upload workflow, not live photograph capture. The published guide specifies centimetre dimensions, maximum file sizes and 200 DPI, without fixed pixel dimensions.",
  },
  bpsc: {
    id: "bpsc",
    name: "BPSC (Bihar PSC)",
    photoLimitKb: 50,
    sigLimitKb: 20,
    description: "Bihar PSC captures your photograph live via webcam during the online application — there is no photo file to upload, so use the photo tool only for general passport-photo prep. The signature is uploaded under 20 KB (both a Hindi and an English signature), JPG.",
    source: {
      url: "https://bpsconline.bihar.gov.in/downloads/User_Manual.pdf",
      label: "BPSC online application — User Manual",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "Bihar Public Service Commission captures the candidate's photograph live via webcam during the online application, rather than accepting an uploaded photo file — only the signature (in both Hindi and English) is uploaded as a file.",
  },
  mpsc: {
    id: "mpsc",
    name: "MPSC (Maharashtra PSC)",
    photoLimitKb: 50,
    sigLimitKb: 50,
    description: "Maharashtra PSC. Photo up to 50 KB (3.5 cm x 4.5 cm, solid-colour background); signature up to 50 KB (3.5 cm x 1.5 cm, black ink on white paper); JPG/JPEG only. The official instructions give cm dimensions and a 50 KB max for both — no pixel size and no minimum.",
    source: {
      url: "https://mpsconline.gov.in/downloads/Instructions-for-Filling-the-Application-Form.pdf",
      label: "MPSC — Instructions for Filling the Application Form",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "Maharashtra Public Service Commission's official instructions specify photo and signature size in centimetres with a 50 KB cap for both, and require a solid-colour photo background — no pixel dimensions or minimum file size are stated.",
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
    source: {
      url: "https://gate2026.iitg.ac.in/photograph-and-signature.html",
      label: "GATE 2026 — Photograph & Signature specifications",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "GATE (Graduate Aptitude Test in Engineering) is conducted by a different IIT or IISc each year; the photo file-size cap is set by that year's conducting institute (600 KB for GATE 2026, run by IIT Guwahati) and can change between editions.",
  },
  "ugc-net": {
    id: "ugc-net",
    name: "UGC-NET (NTA)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description: "UGC National Eligibility Test (conducted by NTA). Photo 10-200 KB; signature 10-50 KB; JPG/JPEG only. NTA specifies file size and format but no fixed pixel dimensions.",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s301eee509ee2f68dc6014898c309e86bf/uploads/2026/04/202604301078678748.pdf",
      label: "UGC-NET June 2026 — Information Bulletin",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "UGC-NET (National Eligibility Test) is conducted by NTA for eligibility as Assistant Professor and for Junior Research Fellowship; NTA specifies photo and signature file size and format but no fixed pixel dimensions.",
  },
  "csir-net": {
    id: "csir-net",
    name: "CSIR-NET (NTA)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description: "Joint CSIR-UGC NET (conducted by NTA). Photo 10-200 KB; signature 10-50 KB (running hand, no capitals, blue/black ink on white paper); JPG/JPEG only. NTA specifies file size and format but no fixed pixel dimensions.",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s3efdf562ce2fb0ad460fd8e9d33e57f57/uploads/2025/09/202510072139225285.pdf",
      label: "Joint CSIR-UGC NET — Information Bulletin (NTA)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "The joint CSIR-UGC NET is conducted by NTA for eligibility in science and research fields; like UGC-NET, NTA specifies file size and format but no fixed pixel dimensions for the photo or signature.",
  },

  // ---------------------------------------------------------------------------
  // Defence (UPSC OTR portal + IAF) — confirmed against official upload PDFs.
  // ---------------------------------------------------------------------------
  nda: {
    id: "nda",
    name: "NDA (National Defence Academy)",
    photoLimitKb: 200,
    photoMinKb: 20,
    sigLimitKb: 100,
    sigMinKb: 20,
    description:
      "NDA is conducted by UPSC, whose upload instructions apply \"for any examination\" on the portal: a JPG photograph of 20–200 KB with about 75% face coverage, plus a JPG image containing three signatures arranged vertically at 20–100 KB and 350–500 pixels. The instructions publish no fixed photo pixel dimensions, photo aspect ratio, DPI, or name/date strip.",
    source: {
      url: "https://upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf",
      label: "UPSC — Instructions for Uploading the Photo & Signature",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    signatureInk: "Black ink on plain white paper",
    context:
      "NDA is conducted by UPSC through the upsconline.nic.in portal, and the portal's photo and signature instructions apply to every UPSC examination rather than giving NDA its own band. A live photograph is also captured during the application and matched against the uploaded photo. The signature upload must show the candidate's signature three times vertically on one plain-white image.",
  },
  cds: {
    id: "cds",
    name: "CDS (Combined Defence Services)",
    photoLimitKb: 200,
    photoMinKb: 20,
    sigLimitKb: 100,
    sigMinKb: 20,
    description:
      "CDS is conducted by UPSC, whose upload instructions apply \"for any examination\" on the portal: a JPG photograph of 20–200 KB with about 75% face coverage, plus a JPG image containing three signatures arranged vertically at 20–100 KB and 350–500 pixels. The instructions publish no fixed photo pixel dimensions, photo aspect ratio, DPI, or name/date strip.",
    source: {
      url: "https://upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf",
      label: "UPSC — Instructions for Uploading the Photo & Signature",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    signatureInk: "Black ink on plain white paper",
    context:
      "CDS is conducted by UPSC through the upsconline.nic.in portal, and the portal's photo and signature instructions apply to every UPSC examination rather than giving CDS its own band. A live photograph is also captured during the application and matched against the uploaded photo. The signature upload must show the candidate's signature three times vertically on one plain-white image.",
  },
  afcat: {
    id: "afcat",
    name: "AFCAT (Air Force)",
    photoLimitKb: 50,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    description: "Air Force Common Admission Test. Passport-size colour photo, signature and thumb impression each 10-50 KB, JPG/JPEG. AFCAT specifies file size and format but no fixed pixel dimensions.",
    source: {
      url: "https://afcat.cdac.in/AFCAT/assets/images/news/AFCAT_01_2025/English_Notification_AFCAT_01-2025.pdf",
      label: "AFCAT 01/2025 — Notification (IAF / C-DAC)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "AFCAT (Air Force Common Admission Test) recruits for the Indian Air Force's Flying and Ground Duty branches; the notification requires the photo, signature and thumb impression each scanned as a 10-50 KB JPG/JPEG, with no fixed pixel dimensions.",
  },

  // ---------------------------------------------------------------------------
  // State PSCs — confirmed against official portal/OTR/notification PDFs.
  // ---------------------------------------------------------------------------
  rpsc: {
    id: "rpsc",
    name: "RPSC (Rajasthan PSC)",
    // Compatibility-only photo target. RPSC captures the photograph LIVE during
    // OTR KYC (webcam) — there is no pre-existing photo file to upload, and no
    // photo KB or pixel requirement is published. Value kept only so the photo
    // tool has a sensible default; it is not an RPSC requirement.
    photoLimitKb: 50,
    photoMinKb: 20,
    // Real, uploadable spec: two signatures (English + Hindi), each JPEG 20-50 KB.
    sigLimitKb: 50,
    sigMinKb: 20,
    description: "Rajasthan PSC applies via the SSO Rajasthan / recruitment portal with One-Time Registration (OTR). The photograph is CAPTURED LIVE during OTR KYC (webcam) — there is no photo file to upload. Candidates upload two signatures (English and Hindi), each JPEG 20-50 KB, plus a left thumb impression (JPEG 20-50 KB) and a handwritten specimen (PDF 10-200 KB). RPSC publishes no pixel dimensions. Confirm the current OTR instructions before preparing files.",
    source: {
      url: "https://recruitment.rajasthan.gov.in/",
      label: "RPSC OTR-based Online Application Manual (19 May 2026), KYC upload section",
    },
    verification: "needs-review",
    verifiedOn: "2026-07-17",
    context:
      "Rajasthan Public Service Commission recruitment goes through the SSO Rajasthan recruitment portal's One-Time Registration. The photograph is taken live via webcam during KYC, so no photo file is uploaded; the uploadable items are two signatures (English and Hindi), a left thumb impression, and a handwritten specimen. Confirm the current OTR instructions for the specific recruitment before preparing files.",
  },
  tnpsc: {
    id: "tnpsc",
    name: "TNPSC (Tamil Nadu PSC)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 130,
    photoHeightPx: 170,
    sigWidthPx: 230,
    sigHeightPx: 75,
    photoAspectRatio: 130 / 170,
    sigAspectRatio: 230 / 75,
    dpi: 200,
    requiresNameDate: true,
    signatureInk: "Blue or black ink on white paper",
    description: "Tamil Nadu PSC application upload. Photo 20-50 KB at 130x170 px with a white background and name plus photography date in the lower 55 px; signature 10-20 KB at 230x75 px in blue or black ink on white paper. Both files are JPG at 200 DPI.",
    source: {
      url: "https://tnpsc.gov.in/Document/english/CTS%20-Non%20Interview%20English_.pdf",
      label: "TNPSC Combined Technical Services (Non-Interview Posts) 2025 — paragraphs 2.2 and 3.3-3.5",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "TNPSC One-Time Registration stores a photograph and signature, but the current application instructions also require a colour photograph taken on or after the notification date to be uploaded for each application. This is a file-upload workflow, not live capture. The notice publishes fixed pixel dimensions, KB bands, 200 DPI and the name/date strip.",
  },
  kpsc: {
    id: "kpsc",
    name: "KPSC (Karnataka PSC)",
    photoLimitKb: 200,
    photoMinKb: 50,
    sigLimitKb: 70,
    sigMinKb: 50,
    description: "KPSC UDYOGA registration upload. The current applicant manual specifies a JPEG photograph of 50-200 KB and a JPEG signature of 50-70 KB. It publishes no pixel dimensions, aspect ratio, DPI, ink or name/date rule, so the preset applies none.",
    source: {
      url: "https://kpsconline.karnataka.gov.in/Master/Download_applicant_user_manual",
      label: "KPSC UDYOGA Applicant User Manual — page 11",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "KPSC's current UDYOGA applicant manual documents separate photograph and signature file uploads during personal-information registration. The first-party manual supports the JPEG file-size bands but gives no pixel geometry; the former square photo and signature targets came only from a vendor-hosted registration page and have been removed.",
  },
  appsc: {
    id: "appsc",
    name: "APPSC (Andhra Pradesh PSC)",
    photoLimitKb: 50,
    sigLimitKb: 30,
    description: "Andhra Pradesh PSC (OTPR registration). Photo about 50 KB (3.5x4.5 cm, with name + date printed on it); signature about 30 KB (3.5x1.5 cm), uploaded separately; JPG. The official manual gives cm + KB but no pixel dimensions.",
    source: {
      url: "https://psc.ap.gov.in/UserManuals/DirectRecruitmentOTPRUserManual.pdf",
      label: "APPSC Direct Recruitment OTPR user manual",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    requiresNameDate: true,
    context:
      "Andhra Pradesh Public Service Commission registration goes through the OTPR (One-Time Profile Registration) system. Its Direct Recruitment manual requires the candidate's name and the date of photography printed on the photo itself.",
  },
  tgpsc: {
    id: "tgpsc",
    name: "TGPSC / TSPSC (Telangana PSC)",
    photoLimitKb: 50,
    photoMinKb: 4,
    sigLimitKb: 30,
    sigMinKb: 1,
    description: "Telangana PSC uses One-Time Registration. A recently indexed Edit OTR manual showed photograph and signature fields, but that manual is no longer live and the public portal does not establish the current upload-versus-capture workflow or publish the stored 4-50 KB photo and 1-30 KB signature limits. Treat those values as compatibility targets and confirm the current portal instructions.",
    source: {
      url: "https://otr.tgpsc.gov.in/",
      label: "TGPSC — live One-Time Registration portal",
    },
    verification: "needs-review",
    context:
      "TGPSC uses its own One-Time Registration portal. Its formerly indexed Edit OTR manual is now unavailable, and the live public portal does not expose the current photograph/signature workflow or validation rules before sign-in. Confirm whether the active application requests file uploads or capture, and verify its limits before relying on the compatibility targets.",
  },
  wbpsc: {
    id: "wbpsc",
    name: "WBPSC (West Bengal PSC)",
    photoLimitKb: 50,
    sigLimitKb: 50,
    description: "West Bengal PSC uses One-Time Registration, but its current public OTR page does not publish photo or signature upload dimensions, formats or KB limits. The stored 50 KB targets are compatibility values only and can vary by recruitment; confirm the current application instructions before preparing files.",
    source: {
      url: "https://psc.wb.gov.in/candidateOTRegistration.jsp",
      label: "WBPSC — One-Time Registration portal",
    },
    verification: "needs-review",
    context:
      "WBPSC's public One-Time Registration page confirms the OTR workflow but does not expose the file validation rules before the application flow. No current public first-party instruction was found for the stored numeric targets, so they must be checked against the current recruitment upload screen.",
  },
  gpsc: {
    id: "gpsc",
    name: "GPSC (Gujarat PSC)",
    photoLimitKb: 15,
    sigLimitKb: 15,
    description: "Gujarat PSC applications use Gujarat's OJAS service, but the current public portal does not establish whether photo/signature are uploaded or captured live and does not support the stored 15 KB targets or the former centimetre and ink claims. Treat the values as compatibility targets and confirm the active OJAS instructions.",
    source: {
      url: "https://ojas.gujarat.gov.in/",
      label: "Gujarat OJAS — live application portal",
    },
    verification: "needs-review",
    context:
      "The live Gujarat OJAS portal does not publicly expose GPSC's current photograph/signature workflow or validation rules before the active application flow. Confirm whether the recruitment requests file uploads or capture and verify its limits before relying on the compatibility targets.",
  },
  hpsc: {
    id: "hpsc",
    name: "HPSC (Haryana PSC)",
    photoLimitKb: 500,
    sigLimitKb: 500,
    description: "Haryana PSC online registration. The current recruitment advertisement (Advt 24/2026) lists a scanned photo and scanned signatures among the uploads but publishes no KB or pixel specification; those limits are shown only inside the online registration portal (regn.hpsc.gov.in) at the upload step. The 500 KB values here are unconfirmed and could not be checked against a public source — confirm the exact figures on the portal before preparing files.",
    source: {
      url: "https://regn.hpsc.gov.in/",
      label: "HPSC online registration portal (photo/signature limits shown at the upload step)",
    },
    verification: "needs-review",
    context:
      "Haryana Public Service Commission sets the photo and signature upload limits inside its online registration portal rather than in the recruitment advertisement, so they are not publicly documented. Confirm the current figures on the portal at the time of applying.",
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
    dpi: 200,
    signatureInk: "Black",
    description:
      "NABARD Grade A 2025 requires separate JPG/JPEG photograph and signature uploads, plus an additional live photograph captured by webcam or mobile phone. The published upload values are shown in the requirement table; confirm the notice for a later recruitment cycle.",
    source: {
      url: "https://www.nabard.org/auth/writereaddata/CareerNotices/0512255230Final%20Advertisement%20Grade%20A%20(RDBS,%20Legal,%20P%26SS)%202025%20(1).pdf",
      label: "NABARD Grade A 2025 advertisement — pages 29–30",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "NABARD's 2025 Grade A notice documents a prepared photograph upload and a separate live-photo capture. It routes application grievances through cgrs.ibps.in, but the values here are scoped to that NABARD notice rather than assumed from a generic banking pattern.",
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
    dpi: 200,
    signatureInk: "Black",
    description:
      "LIC AAO Specialist 2025 requires separate JPG photograph and signature uploads, plus an additional live photograph captured by webcam or mobile phone. The published upload values are shown in the requirement table; confirm the applicable notice for ADO or a later AAO cycle.",
    source: {
      url: "https://licindia.in/documents/d/guest/aao-specialist-notification-2025-final",
      label: "LIC AAO Specialist 2025 notification — pages 15–17",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "LIC's 2025 AAO Specialist notice documents a prepared photograph upload and a separate live-photo capture. The source does not establish that the same values apply to every LIC role or future recruitment cycle.",
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
    dpi: 200,
    signatureInk: "Black",
    description:
      "NIACL Administrative Officer 2025 requires separate JPG/JPEG photograph and signature uploads, plus an additional live photograph captured by webcam or mobile phone. The published upload values are shown in the requirement table; confirm the applicable notice for an Assistant or later cycle.",
    source: {
      url: "https://www.newindia.co.in/assets/docs/recruitment/RECRUITMENT%20OF%20ADMINISTRATIVE%20OFFICERS%202025/RECRUITMENT%20OF%20_5_50%20ADMINISTRATIVE%20OFFICERS%20(GENERALISTS%20%26%20SPECIALISTS)%20(SCALE-I)%20202_5.pdf",
      label: "NIACL Administrative Officers 2025 advertisement — pages 11–12",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "NIACL's 2025 Administrative Officer advertisement links to the NIACL application on ibpsonline.ibps.in and documents both a prepared photograph upload and a separate live-photo capture. The source does not establish the same values for every NIACL role.",
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
    dpi: 200,
    signatureInk: "Black",
    description:
      "IRDAI Assistant Manager 2024 requires separate JPG/JPEG photograph and signature uploads. The published upload values are shown in the requirement table; this is the latest public Assistant Manager notice located, so confirm a later recruitment notice before use.",
    source: {
      url: "https://irdai.gov.in/documents/37343/366120/%E0%A4%85%E0%A4%A7%E0%A4%BF%E0%A4%B8%E0%A5%82%E0%A4%9A%E0%A4%A8%E0%A4%BE+-+%E0%A4%B8%E0%A4%B9%E0%A4%BE%E0%A4%AF%E0%A4%95+%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%AC%E0%A4%82%E0%A4%A7%E0%A4%95+%E0%A4%AD%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A5%80+2024+_+Notification+-+Assistant+Manager+Recruitment+2024.pdf/406da4a0-f2d7-16c8-228a-4870e280a44c?version=2.2&t=1724302079930&download=true",
      label: "IRDAI Assistant Manager 2024 notification — pages 26–27",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "IRDAI's 2024 Assistant Manager notification documents photograph and signature uploads and routes application queries through cgrs.ibps.in. No newer public Assistant Manager notice was located during this review, so future-cycle instructions should be checked.",
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
    context:
      "CAT (Common Admission Test) is run by a different IIM each year for MBA admission to the IIMs and other participating institutes; the registration guide requires a recent (within 6 months) colour photo and explicitly disallows selfies.",
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
      "Compatibility preset for the CLAT application. The public CLAT 2026 instructions confirm a front-facing recent passport-size photograph with a plain background and a candidate signature, but publish no KB, pixel, DPI, file-format or ink limits. The stored 20-50 KB / 200×230 px photo and 10-20 KB / 140×60 px signature values remain unconfirmed; check the current application screen before use.",
    source: {
      url: "https://consortiumofnlus.ac.in/clat-2026/ug-instructions.html",
      label: "CLAT 2026 UG application instructions",
    },
    verification: "needs-review",
    context:
      "CLAT is run by the Consortium of National Law Universities. Its public 2026 instructions identify the photo and signature uploads but do not expose their digital validation limits, so confirm the current application screen before preparing either file.",
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
      "Compatibility preset for Indian Army Agniveer registration. The recruiting-year 2027 notice confirms that a recent photograph is uploaded on joinindianarmy.nic.in, but publishes no photo/signature KB band, pixel dimensions, format or name/date rule. The stored 20-50 KB / 413×531 px photo and 10-20 KB / 413×177 px signature values remain unconfirmed; check the current candidate portal before use.",
    source: {
      url: "https://www.telangana.gov.in/wp-content/uploads/2026/02/Recruitment-Notification-for-AGNIVEER-2027.pdf",
      label: "Indian Army Agniveer RY 2027 notice (government-hosted copy)",
    },
    verification: "needs-review",
    context:
      "Indian Army Agniveer applications are submitted on joinindianarmy.nic.in. The current notice asks for a recent uploaded photograph but does not publish the upload widget's numeric limits or require name/date text; confirm the current candidate-portal fields before preparing files.",
  },
  "airforce-agniveer": {
    id: "airforce-agniveer",
    name: "Agniveervayu (Indian Air Force)",
    photoLimitKb: 200,
    photoMinKb: 100,
    sigLimitKb: 150,
    sigMinKb: 80,
    description:
      "Indian Air Force Agniveervayu Intake 01/2027 online application. Photo 100-200 KB in JPG/JPEG — a recent passport-size colour photo holding a black slate at chest level with the candidate's name and the date written in white chalk. Signature 80-150 KB in JPG/JPEG, signed in black ink on white paper. The notice publishes no fixed pixel dimensions.",
    source: {
      url: "https://iafrecruitment.edcil.co.in/agniveervayu/pdffiles/Advt%20Agniveervayu%2001%20of%2027.pdf",
      label: "IAF Agniveervayu Intake 01/2027 notice",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    requiresSlateNameDate: true,
    signatureInk: "Black ink on white paper",
    context:
      "Agniveervayu Intake 01/2027 applications are submitted on iafrecruitment.edcil.co.in. The candidate must be photographed holding a black slate at chest level with their name and the photography date written clearly in white chalk, rather than adding the text digitally after the photo is taken.",
  },
  "up-police": {
    id: "up-police",
    name: "UP Police (UPPBPB)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 5,
    photoAspectRatio: 35 / 45,
    signatureInk: "Black ink on white paper",
    description:
      "Uttar Pradesh Police Recruitment & Promotion Board (UPPBPB) online registration — constable, SI and other posts. Photo 35×45 mm JPEG/JPG/JPE, 20-50 KB; signature 35×15 mm, 5-20 KB, black ink. Limits can change per recruitment notification — the portal validates at upload.",
    source: {
      url: "https://uppbpb.gov.in/FilesUploaded/Notice/CONSTABLE-VIGYAPTIc7be0cc8-3365-471e-9237-447c528d341a.pdf",
      label: "UPPBPB Constable recruitment notification (uppbpb.gov.in)",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    context:
      "UP Police (UPPBPB) recruits Constables, Sub-Inspectors and other posts under the Uttar Pradesh Police Recruitment & Promotion Board; limits are set per recruitment notification and the portal validates the file at upload, so re-check the current notification's numbers before applying.",
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
    context:
      "A PAN card application (Form 49A or 49AA) can be filed through either Protean (formerly NSDL e-Gov) or UTIITSL — both processors enforce the same 200 DPI scan requirement and KB caps, so a photo and signature meeting this spec is accepted through either route.",
  },
  "driving-licence": {
    id: "driving-licence",
    name: "Driving Licence (Sarathi Parivahan)",
    photoLimitKb: 20,
    photoMinKb: 10,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 420,
    photoHeightPx: 525,
    sigWidthPx: 256,
    sigHeightPx: 64,
    photoAspectRatio: 35 / 45,
    sigAspectRatio: 256 / 64,
    signatureInk: "Black pen on white paper",
    description:
      "Driving licence / learner's licence application on the Sarathi Parivahan portal (sarathi.parivahan.gov.in). Photo 35×45 mm (420×525 px), 10-20 KB; signature 256×64 px, 10-20 KB, black pen on white paper. This is a single national spec document, not a state-specific one.",
    source: {
      url: "https://sarathi.parivahan.gov.in/sarathiservice/pdf/PhotoSign.pdf",
      label: "Sarathi Parivahan — Photo and Signature Scan & Upload Process",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    context:
      "Driving licence and learner's licence applications nationwide go through the single Sarathi Parivahan portal (sarathi.parivahan.gov.in) — this is one national spec document, not a state-by-state one, even though the RTO issuing the licence is run by the state.",
  },
  "voter-id": {
    id: "voter-id",
    name: "Voter ID (ECI Form 6)",
    // Compatibility-only digital cap. The public Form 6 guidance confirms the
    // physical dimensions/composition but does not publish an upload file cap.
    photoLimitKb: 2048,
    photoAspectRatio: 3.5 / 4.5,
    description:
      "ECI Form 6 specifies a recent, good-quality, unsigned colour passport-size photograph measuring 4.5×3.5 cm on a white background, with eyes open and both face edges visible. The public instructions do not publish a digital file-size cap, pixel dimensions, format or DPI. The stored 2 MB target is compatibility-only; confirm the current Voters' Service Portal upload screen before preparing a digital file.",
    source: {
      url: "https://voters.eci.gov.in/guidelines/Form-6_en.pdf",
      label: "ECI Form 6 guidelines (voters.eci.gov.in)",
    },
    verification: "needs-review",
    context:
      "Form 6 supports new-elector registration. Its public ECI guidance confirms the photograph's physical size and composition but not the online upload cap; there is no separate signature image in this preset. Confirm the current portal instructions before upload.",
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
    sigLimitKb: 30,
    photoWidthPx: 150,
    photoHeightPx: 200,
    sigWidthPx: 150,
    sigHeightPx: 100,
    photoAspectRatio: 150 / 200,
    sigAspectRatio: 150 / 100,
    description:
      "Kerala Public Service Commission (Thulasi portal — thulasi.psc.kerala.gov.in). Photo 150×200 px, under 30 KB, JPG/JPEG, plain light background, with the candidate's name and the date of photography printed at the bottom; signature 150×100 px, under 30 KB. The Thulasi portal is strict on file size — even 1 KB over is rejected.",
    source: {
      url: "https://www.keralapsc.gov.in/sites/default/files/inline-files/otr.pdf",
      label: "Kerala PSC One-Time Registration instructions",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    requiresNameDate: true,
    context:
      "Kerala Public Service Commission uses its own Thulasi portal for all recruitments. The photo and signature upload limits (150×200 px / 30 KB and 150×100 px / 30 KB) differ from the standard national exam pattern, and Kerala PSC requires your name and the date of photography printed on the photo.",
  },

  // ---------------------------------------------------------------------------
  // Central government & skill exams.
  // ---------------------------------------------------------------------------
  "ccc-nielit": {
    id: "ccc-nielit",
    name: "NIELIT CCC (Computer Concepts)",
    photoLimitKb: 50,
    photoMinKb: 5,
    sigLimitKb: 20,
    sigMinKb: 5,
    photoWidthPx: 132,
    photoHeightPx: 170,
    sigWidthPx: 170,
    sigHeightPx: 132,
    photoAspectRatio: 132 / 170,
    sigAspectRatio: 170 / 132,
    description:
      "NIELIT DLC online examination application (BCC, CCC, CCC+, ECC and ACC). Photo 5-50 KB, 132×170 px, 3.5×4.5 cm, 96-300 DPI, JPEG/JPG, recent colour on white; signature 5-20 KB, 170×132 px, 4.5×3.5 cm, 96-200 DPI, JPEG/JPG, black or blue ink on white paper.",
    source: {
      url: "https://nva.nielit.gov.in/ccc/CCC_ExamGuideLine.pdf",
      label: "NIELIT DLC examination application guide, Version 1.11",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    signatureInk: "Black or blue ink",
    context:
      "NIELIT conducts the BCC, CCC, CCC+, ECC and ACC digital-literacy examinations. Version 1.11 of its application guide publishes separate photo and signature/LTI dimensions and upload ranges for the online examination application form.",
  },

  dsssb: {
    id: "dsssb",
    name: "DSSSB (Delhi SSB)",
    photoLimitKb: 100,
    photoMinKb: 25,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 3.5 / 1.5,
    description:
      "DSSSB online application compatibility preset. Advertisement 02/2026 confirms a recent clear colour photo on a plain white/off-white background and a legible signature, but gives no photo/signature KB or dimensions. The stored photo 25-100 KB / 3.5×4.5 cm and signature 10-50 KB / 3.5×1.5 cm values come from archived 2012 OARS instructions; check the current upload screen before use.",
    source: {
      url: "https://dsssb.delhi.gov.in/sites/default/files/DSSSB/circulars-orders/final_advt_02-2026_1.pdf",
      label: "DSSSB Advertisement 02/2026",
    },
    verification: "needs-review",
    context:
      "DSSSB recruits for Government of NCT of Delhi posts through OARS. Its current notice leaves numeric upload validation to the portal, so confirm the current OARS photo and signature limits before preparing files.",
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
    sigAspectRatio: 6.0 / 2.0,
    description:
      "BSF (Border Security Force) Constable/HC/SI recruitment. Signature 10-20 KB, 6.0cm×2.0cm — confirmed via the SSC GD 2026 notice (SSC administers BSF's Constable GD hiring stream). That same notice describes the photo step as a live webcam capture through the application portal, not a file-size/dimension upload — so the 20-50 KB photo figure here is an unconfirmed standard-pattern assumption for BSF's own SI/HC recruitment (a separate stream from SSC GD), not something this source confirms.",
    source: {
      url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/notice_01122025.pdf",
      label: "SSC GD Constable (CAPFs incl. BSF) 2026 notice",
    },
    verification: "needs-review",
    context:
      "BSF (Border Security Force) recruits Constable (GD/Tradesmen) via the common SSC GD exam, and Head Constable/Sub-Inspector through its own portal (rectt.bsf.gov.in) — the two streams may have different upload specs. Always confirm the current notification before applying.",
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
      "Compatibility preset for ITBP online recruitment. No current public ITBP notice or instruction page located in this audit publishes the stored 20-50 KB / 200×230 px photo and 10-20 KB / 140×60 px signature limits, format or background rule. Check the current recruitment application before use.",
    source: {
      url: "https://recruitment.itbpolice.nic.in/rect/index.php",
      label: "ITBP recruitment portal",
    },
    verification: "needs-review",
    context:
      "ITBP conducts post-specific recruitments through its recruitment portal, while Constable GD can also run through SSC. Public notices reviewed did not expose the application widget's numeric image rules, so confirm the current post-specific upload screen.",
  },

  "navy-agniveer": {
    id: "navy-agniveer",
    name: "Indian Navy Agniveer",
    photoLimitKb: 50,
    photoMinKb: 10,
    description:
      "Indian Navy Agniveer SSR/MR recruitment (joinindiannavy.gov.in). Photo 10-50 KB JPEG, passport-style, candidate holding a black slate with name and date of photograph written on it in white chalk. The official notification describes no separate signature upload step at all — earlier third-party figures for a 413×177 px signature could not be traced to any Navy document and have been removed rather than left unverified.",
    source: {
      url: "https://www.joinindiannavy.gov.in/files/Advt_Agniveer_MR_English.pdf",
      label: "Indian Navy Agniveer INET 2025 notice, paragraph 34",
    },
    verification: "official",
    verifiedOn: "2026-07-16",
    requiresSlateNameDate: true,
    context:
      "Indian Navy Agniveer applications are submitted on joinindiannavy.gov.in. The photo must show the candidate holding a black slate with the name and photography date written in white chalk; this is a physical slate workflow, not a digital name/date strip. The cited notice does not list a separate signature upload.",
  },

  // ---------------------------------------------------------------------------
  // Government services & corporations.
  // ---------------------------------------------------------------------------
  epfo: {
    id: "epfo",
    name: "EPFO (Social Security Assistant)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 30,
    sigMinKb: 4,
    description:
      "Historical EPFO Social Security Assistant preset from the 2023 direct-recruitment advertisement: photo 10-200 KB JPG on a light-shade plain background, with approximately 80% face coverage and no spectacles; signature 4-30 KB JPG/JPEG. EPFO has not published a newer SSA direct-recruitment notice, so check the current cycle before use.",
    source: {
      url: "https://www.epfindia.gov.in/site_docs/PDFs/Recruitments_PDFs/Advertisement_for_SSA_24032023.pdf",
      label: "EPFO SSA Advertisement (epfindia.gov.in, 2023)",
    },
    verification: "needs-review",
    context:
      "EPFO's 2023 SSA recruitment was conducted by NTA and its published image rules remain available in the archived advertisement. Recruitment workflows vary by post and cycle, so confirm the current EPFO or conducting-body notice before preparing files.",
  },

  fci: {
    id: "fci",
    name: "FCI (Food Corporation of India)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 200,
    photoHeightPx: 230,
    photoAspectRatio: 200 / 230,
    sigWidthPx: 140,
    sigHeightPx: 60,
    sigAspectRatio: 14 / 6,
    description:
      "Historical FCI Category III preset from Advertisement 01/2022: photo 20-50 KB, preferred 200×230 px, 4.5×3.5 cm, JPG/JPEG, recent colour on a light or preferably white background; signature 10-20 KB, preferred 140×60 px, JPG/JPEG, black ink. No current recruitment-cycle notice is published on FCI's recruitment page, so check the current notice before use.",
    source: {
      url: "https://fci.gov.in/fci-storage/storage/app/uploads/653f851f7c7ba1698661663.pdf",
      label: "FCI Category III Advertisement (fci.gov.in, 2022)",
    },
    verification: "needs-review",
    signatureInk: "Black ink",
    context:
      "FCI's upload rules are recruitment-cycle specific. Advertisement 01/2022 supports the stored photo and signature values for Category III recruitment, but no newer direct-recruitment notice is currently listed; confirm the current FCI notice before preparing files.",
  },
};

export const PORTAL_KEYS = Object.keys(PORTAL_PRESETS) as Array<keyof typeof PORTAL_PRESETS>;
