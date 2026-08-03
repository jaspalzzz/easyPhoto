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
 * "disputed"     = the published source contradicts ITSELF on a figure. The
 *                  stored value is the safe intersection of the conflicting
 *                  bands, never the more permissive one, because generating a
 *                  file the stricter section forbids is the failure that costs
 *                  the applicant. UGC-NET is the current case.
 */
export type VerificationStatus = "official" | "needs-review" | "disputed";

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
  /** File format published for the prepared photograph upload. */
  photoFormat?: string;
  /** Background published for the prepared photograph upload. */
  photoBackground?: string;
  /** File format published for the signature upload. */
  sigFormat?: string;
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
   * The primary photograph step is completed as a live-photo capture in the
   * authority's application flow, instead of uploading an ordinary prepared
   * photo file. Do not set this for portals that require both a prepared photo
   * upload and an additional live identity check.
   */
  isLiveCapture?: boolean;
  /**
   * Signature ink requirement, when the official source specifies one exactly
   * (e.g. driving-licence and up-police confirm "black" only, not blue). Only
   * set this when actually confirmed — the exam-requirements template falls
   * back to "Black/blue on white paper" (the common default across specs)
   * when this is unset, so leaving it unset is the honest default, not a bug.
   */
  signatureInk?: string;
  /**
   * Practical points taken from THIS exam's own notification that change what a
   * candidate should do — not restatements of the KB figures above.
   *
   * Added because the exam pages were a shared frame around a different set of
   * numbers, and generating prose from the numbers only produced a longer
   * shared frame. These are read out of the source PDF per exam, so they differ
   * because the notifications differ. Quote or paraphrase closely; never
   * generalise one board's rule onto another.
   */
  applicationNotes?: readonly string[];
  /**
   * 1–2 sentences of ACCURATE, exam-specific context (conducting body, exams
   * covered, where/how the photo is uploaded, exam-specific rules). Surfaced as
   * unique on-page prose to differentiate the otherwise-templated per-exam
   * resizer pages. Verifiable facts only — no marketing fluff, no guessed numbers.
   */
  context?: string;
}

const pixelsAtDpi = (centimetres: number, dpi: number) =>
  Math.round((centimetres / 2.54) * dpi);

// Protean prints the portrait-photo dimensions height first: 3.5 x 2.5 cm.
const PAN_PHOTO_HEIGHT_CM = 3.5;
const PAN_PHOTO_WIDTH_CM = 2.5;
const PAN_SCAN_DPI = 200;
const PAN_PHOTO_WIDTH_PX = pixelsAtDpi(PAN_PHOTO_WIDTH_CM, PAN_SCAN_DPI);
const PAN_PHOTO_HEIGHT_PX = pixelsAtDpi(PAN_PHOTO_HEIGHT_CM, PAN_SCAN_DPI);

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
    sigFormat: "JPEG / JPG",
    description:
      "Current 2026 SSC applications capture the candidate's photograph live and do not use a pre-existing photo upload. The stored 20–50 KB photo target is compatibility-only, not a current SSC requirement. The current notice specifies a JPEG/JPG signature of 10–20 KB at about 6.0×2.0 cm; it publishes no photo or signature pixel dimensions, photo aspect ratio, DPI, or name/date rule. Confirm the current exam notice before using the compatibility photo output.",
    source: {
      url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cht_2026.pdf",
      label: "SSC Combined Hindi Translators Examination 2026 notice, paragraphs 8.4–8.7",
    },
    verification: "needs-review",
    isLiveCapture: true,
    context:
      "The current SSC application module captures a live photograph from the candidate's computer or mobile camera. A pre-existing photograph is not uploaded. The signature remains a separate JPEG/JPG upload; confirm the current notice for the specific SSC examination before preparing files.",
    applicationNotes: [
      "SSC does not take a prepared photograph. The notice states plainly that a candidate is not required to have a pre-existing photograph, because the application module captures one while you fill the form. Anything you prepare in advance is for reference only.",
      "Photographing an existing photograph is called out separately. The notice says that in no case should a candidate capture a photograph of a pre-existing photograph and describes such applications as liable to rejection — but it also states an exception: applications submitted through Aadhaar-based authentication are not rejected on those grounds. Do not rely on the exception if you are not using that route. Holding up a printed photo to the camera is the specific failure it describes.",
      "During capture: even light, plain background, camera at eye level, face fully inside the outline the module draws and neither too close nor too far, and no cap, mask or spectacles. Your appearance at the examination is expected to match what was captured.",
      "The signature is the part you do prepare. It uploads as a JPEG of 10 to 20 KB at roughly 6.0cm wide by 2.0cm high, and the notice warns that blurred or miniature signatures are rejected summarily.",
    ]
  },
  upsc: {
    id: "upsc",
    name: "UPSC (Union Public Service Commission)",
    photoLimitKb: 200,
    photoMinKb: 20,
    sigLimitKb: 100,
    sigMinKb: 20,
    photoFormat: "JPG",
    photoBackground: "Plain white",
    sigFormat: "JPG",
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
    applicationNotes: [
      "UPSC checks face coverage, not just file size: the photograph must show at least 75% face coverage, and the instruction sheet prints sample photographs marked rejected purely for falling below that. A correctly compressed 20-200 KB file with the face too small in the frame is still refused.",
      "The uploaded file has to be named photo, in jpg, on a plain white background, with the head centred and both ears visible. The don'ts are as specific as the dos: no uniform, no dark or coloured glasses, no shadow on the face or behind it, no hair over the eyes, and the photograph is not to be signed.",
      "A live photograph capture is now mandatory for any examination on the portal, taken through the device webcam or by scanning a QR code with a phone. The uploaded photograph does not replace that step, so prepare the file and still expect to be photographed during the application.",
    ]
  },
  ds160: {
    id: "ds160",
    name: "US DS-160 (Visa)",
    photoLimitKb: 240,
    photoWidthPx: 600,
    photoHeightPx: 600,
    photoAspectRatio: 1,
    photoBackground: "White",
    description: "Online US Visa Application DS-160. Square photo (600x600px up to 1200x1200px), under 240 KB limit, white background.",
    source: { url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html", label: "US Dept. of State photo requirements" },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "The DS-160 is the online nonimmigrant visa application form for the United States; the photo is uploaded directly within the form on the US Department of State's travel.state.gov portal.",
    applicationNotes: [
      "The Department of State describes a square digital image from 600 x 600 through 1200 x 1200 pixels. This preset exports the published 600 x 600 minimum rather than stretching a rectangular passport crop; start from the original photograph and crop equally around the face.",
      "The digital file ceiling is 240 KB. That is a maximum, not a requested target, so there is no benefit in inflating a clear smaller JPEG merely to approach the cap. Inspect the final square image after compression and keep the original available if the form asks for a replacement.",
      "This record is for the photograph uploaded inside the DS-160 nonimmigrant-visa form. A printed photograph requested for an interview or a different US immigration process is a separate submission step; follow the instructions attached to that route instead of assuming the digital-file rule covers it.",
      "The white-background rule and square canvas are independent checks. Replacing the background does not make a rectangular file compliant, and resizing a rectangle to 600 x 600 would distort the face. Crop to a square first, then export within the stated byte ceiling.",
    ],
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
    photoAspectRatio: 3.5 / 4.5,
    description:
      "Conditional compatibility preset, not an ordinary domestic Passport Seva upload requirement. The 630x810 px photo format is confirmed for the overseas Indian-mission ICAO workflow; the stored KB and signature limits have no published support in that photo guide. Confirm the current mission workflow before using those compatibility limits.",
    source: {
      url: "https://portal4.passportindia.gov.in/Online/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf",
      label: "Passport Seva overseas portal — ICAO photograph guidance",
    },
    verification: "needs-review",
    context:
      "For ordinary adult fresh/reissue applications in India, Passport Seva captures the photograph and biometrics at the PSK/POPSK; applicants do not upload or carry a photo. Children below four carry a 45x35 mm white-background print. Use this digital preset only when a separate overseas workflow requests it, and confirm the current mission instructions before relying on the stored KB or signature limits.",
    applicationNotes: [
      "For an ordinary adult fresh or reissue application inside India, the PSK or POPSK captures the photograph and biometrics. There is no ordinary prepared-photo upload to optimise, so this resizer should not be inserted into that domestic appointment workflow.",
      "The below-four exception is a physical 45 x 35 mm colour photograph on a white background. It is distinct from the 630 x 810 pixel format documented for Indian embassies and consulates abroad; choose the route first rather than treating the print and overseas digital figures as interchangeable.",
      "The linked ICAO guide supports the overseas photograph geometry, but it does not publish the stored 10 to 250 KB photo band or 10 to 100 KB signature band shown as compatibility settings here. The mission's current upload screen is the authority for those digital limits.",
      "A 630 x 810 canvas has the same 3.5:4.5 shape as the recorded print, so cropping can be shared across those two representations. That ratio match does not establish the file-size ceiling or prove that a particular mission asks for an upload.",
    ],
  },
  oci: {
    id: "oci",
    name: "OCI Card (India)",
    photoLimitKb: 200,
    sigLimitKb: 200,
    photoAspectRatio: 1,
    photoFormat: "JPEG / JPG",
    photoBackground: "Plain light-coloured (not white)",
    sigFormat: "JPEG / JPG",
    description: "OCI registration. The photograph upload must be square, 200x200 to 900x900 px, JPEG/JPG, up to 200 KB, on a plain light-coloured background that is not white. A signature image is also uploaded as JPEG/JPG up to 200 KB, but the OCI FAQ publishes no signature pixel dimensions or aspect ratio.",
    source: {
      url: "https://ociservices.gov.in/onlineOCI/onlineOCI/faq",
      label: "OCI Services FAQ — photograph and signature upload requirements",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "OCI registration uses separate photograph and signature uploads. The official photograph guide specifies a square 51x51 mm colour photograph on a plain light-coloured background, while the online FAQ publishes a 200x200 to 900x900 px square range and a 200 KB maximum. The FAQ confirms a signature upload but publishes no signature geometry, so no fixed signature pixels are applied.",
    applicationNotes: [
      "The OCI photograph is SQUARE and its background must be plain light colour but NOT white, which is unlike most Indian document photographs and easy to get wrong if you reuse one. It is at least 51x51 mm with about 80% face coverage, no border, head and shoulders centred.",
      "Height and width must be equal, between 200x200 and 900x900 pixels, in JPEG or JPG up to 200 KB. A 35x45 mm passport crop cannot simply be reused: it is the wrong shape and, if it is on white, the wrong background.",
      "An OCI photograph is uploaded rather than pasted, and the square shape means a standard passport print cannot be trimmed to fit — the head sits proportionally too large once you crop a 35x45mm image into a square. Start from the original photograph and crop square from it instead.",
    ]
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
    sigFormat: "JPG / JPEG",
    signatureInk: "Black ink on white paper",
    description:
      "Current RRB CEN applications capture the candidate's photograph live and do not accept a pre-existing photo upload. The stored 20–50 KB photo target is compatibility-only, not a current RRB requirement. The signature figures recorded here — JPG/JPEG at 30–49 KB, at least 140×60 px, scanned at a minimum 100 DPI in running handwriting — come from CEN 03/2025, which the board has since taken offline. Treat them as unconfirmed and check the current instructions in the CEN for your own board before uploading.",
    source: {
      // The CEN 03/2025 PDF this preset was built from has been taken down:
      // www.rrbcdg.gov.in now fails TLS (the certificate does not cover the www
      // host) and the document itself 404s even with verification disabled.
      // Pointing at the central application portal keeps the citation live and
      // lands the reader where the current notice is actually published. The
      // preset stays needs-review, which is what it already was.
      url: "https://rrbapply.gov.in/",
      label: "RRB centralised application portal — open the current CEN for your board",
    },
    verification: "needs-review",
    isLiveCapture: true,
    context:
      "Current Railway Recruitment Board notices use webcam or mobile-camera live photo capture during the application. Only the signature is prepared as an image file; confirm the current CEN because recruitment-cycle instructions can change.",
    applicationNotes: [
      "RRB captures your photograph inside the application rather than accepting a prepared file, so the photo figures recorded here are a compatibility target and not something you upload. Follow the capture screen's own instructions for lighting and framing; nothing prepared in advance substitutes for that step.",
      "The signature is the part you do prepare, and its constraints are specific: 30 to 49 KB, at least 140 by 60 pixels, around 100 DPI. That is a narrow band — only 19 KB wide — so compress deliberately rather than aiming for the smallest file you can make.",
      "Sign on plain unlined paper, scan or photograph the signature area alone rather than the whole sheet, and check the strokes survive compression to under 49 KB before you upload.",
      "Because the photograph is captured live and only the signature is uploaded, the usual advice to prepare both files in advance does not apply here. Spend the preparation time on the signature — it is the only file you control and the only one that can be rejected for a size fault.",
      "The signature canvas of 140 x 60 pixels is close to 7:3. Keep the signature centred and use the available width without touching the edges, so the crop does not leave excessive empty margins or clip a stroke.",
    ]
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
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
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
    applicationNotes: [
      "The photograph you upload is not only checked at upload. IBPS captures your photograph and biometric data at stages of the selection process and matches the captured photo against the one in your application, and the notification tells candidates not to change their appearance from that photo. A picture taken years earlier, or one that no longer looks like you, becomes a problem at the centre rather than at the form.",
      "Your uploaded photograph is printed on the call letter, and you are asked to bring one additional photograph identical to it. The notification is explicit that candidates arriving without the photograph pasted on the call letter, or without that spare copy, will not be allowed to sit the examination. Print at least two copies of the same image you upload rather than a different sitting.",
      "A signature written in capital letters will not be accepted. This is stated separately from the file-size rule, so a signature file that is technically within the band can still be refused for how it is written. Sign in your ordinary running hand.",
      "IBPS runs the common recruitment process for several participating banks at once, so one correctly prepared photograph and signature normally serve every bank inside that cycle. What changes between banks is the eligibility and the post, not the upload specification.",
    ],
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
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
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
    applicationNotes: [
      "SBI asks for four scanned images, not two: photograph, signature, LEFT-HAND THUMB IMPRESSION and a hand-written declaration, each with its own scanning guidance in the advertisement. Several other banking and insurance recruiters here ask for the same four, so prepare all of them once and reuse the set.",
      "A live photograph is captured through your webcam or phone during registration, in addition to the photograph you upload. Preparing a file does not remove that step.",
      "The advertisement warns that an unclear image among the four may cost the candidature, and — usefully — that you can edit the application and re-upload any of them before final submission. If a scan looks marginal, replace it rather than hoping it passes.",
    ]
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
    photoFormat: "JPG",
    photoBackground: "White",
    sigFormat: "JPG",
    description: "NTA exams (NEET, JEE Main). Passport-size photo, 10-200 KB; signature 10-100 KB, JPG, white background with ~80% face. NTA publishes no pixel dimensions. (NEET also needs a separate 4x6 inch postcard photo.)",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/20260208939209382.pdf",
      label: "NEET-UG 2026 — Information Bulletin (NTA)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "The National Testing Agency (NTA) conducts NEET-UG and JEE Main; you upload the photo and signature during the online application. NEET applicants also need a separate 4×6 inch (postcard-size) photograph in addition to the passport-size one.",
    applicationNotes: [
      "The NEET-UG bulletin publishes file-size bands but no fixed pixel canvas: photograph 10 to 200 KB and signature 10 to 100 KB in JPG. Do not force a borrowed 200 x 230 template onto either file, because that geometry is not stated by this source.",
      "NEET separates the passport-size upload from a 4 x 6 inch postcard photograph. The postcard is not a larger export of the upload field; prepare and retain the physical item requested by the bulletin in addition to the digital photograph and signature.",
      "The photograph instruction combines a white background with about 80 percent face coverage. Check the crop visually before compression, then verify the encoded JPG size. A file can sit inside the KB band while the face remains too small or the background remains uneven.",
      "This entry groups NEET-UG and JEE Main only at the directory level. The cited figures come from the named NEET-UG bulletin, so a JEE Main applicant should compare the current JEE bulletin and upload screen rather than assuming the two NTA forms stayed aligned.",
      "Keep the postcard photograph outside the signature workflow: its 4 x 6 inch physical format is neither the 10 to 200 KB passport upload nor the separate 10 to 100 KB signature asset.",
    ],
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
    photoFormat: "JPG / JPEG",
    photoBackground: "Light or white",
    sigFormat: "JPG / JPEG",
    description: "Reserve Bank of India recruitment (Grade B, Assistant). Photo 20-50 KB, 200x230 px (preferred), light/white background; signature 10-20 KB, 140x60 px (preferred), black ink on white paper; JPG/JPEG, scanned at 200 dpi true colour.",
    source: {
      url: "https://rbidocs.rbi.org.in/rdocs/content/pdfs/RPJECE07012019_AN1.pdf",
      label: "RBI — Guidelines for Scanning the Photograph & Signature (Annex I)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "The Reserve Bank of India recruits Grade B Officers and Assistants through its own recruitment portal at opportunities.rbi.org.in, separate from the IBPS common exam used by most other public-sector banks.",
    applicationNotes: [
      "RBI's annex records a preferred 200 x 230 pixel portrait between 20 and 50 KB and a preferred 140 x 60 pixel signature between 10 and 20 KB. Preferred geometry and mandatory byte bands are distinct wording, so preserve the shapes while checking the current application preview.",
      "The photograph uses a light or white background. The signature is written in black ink on white paper, then cropped to the signature area; photographing the whole sheet spends the 10 to 20 KB window on empty paper rather than handwriting detail.",
      "Both assets are JPG or JPEG scanned in true colour at 200 DPI. DPI is a scan setting paired with the annex's preferred canvas, not a replacement for checking encoded pixels and bytes in the exported files.",
      "The linked annex predates the review date and serves as RBI scanning guidance. Compare it with the Grade B or Assistant notice and opportunities.rbi.org.in session you are using, because a common banking-style canvas is not proof that every RBI cycle retained each field.",
      "The signature window spans only 10 KB, while the photograph spans 30 KB. Export the two independently, inspect the signature strokes at actual size, and avoid using a single compression quality simply because both images share a JPEG encoder.",
    ],
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
    photoFormat: "JPG",
    sigFormat: "JPG",
    description: "CBSE CTET. Photo 3.5x4.5cm, 10-100 KB; signature 3.5x1.5cm, 3-30 KB, JPG. The bulletin publishes both physical dimensions and file-size bands, so compare both with the exported files.",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s3443dec3062d0286986e21dc0631734c9/uploads/2026/05/202605111250310617.pdf",
      label: "CTET September 2026 — Information Bulletin",
    },
    verification: "official",
    verifiedOn: "2026-06-08",
    context:
      "CTET (Central Teacher Eligibility Test) is CBSE's national teacher-eligibility exam. Its bulletin publishes separate dimensions and file-size bands for the photograph and signature uploaded through ctet.nic.in.",
    applicationNotes: [
      "CTET publishes physical dimensions as well as file sizes. The photograph is 3.5 cm wide by 4.5 cm high and the signature 3.5 cm by 1.5 cm, so the shape matters and not only the KB figure.",
      "The signature band is unusually tight at 3 to 30 KB against 10 to 100 KB for the photograph. Scan or crop only the signed area on plain paper; a phone photograph of the whole page includes background that spends bytes without improving the signature.",
      "The notice states the uploaded photograph is matched against the candidate who appears at the centre, so a current likeness matters more than a flattering one.",
      "The stored pixels preserve the physical proportions but are not interchangeable: 350 x 450 for the portrait and 280 x 120 for the signature. Check width and height in that order; swapping them rotates the required orientation even though the same two numbers are present.",
      "Both assets are JPG, yet their lower bounds differ sharply. The signature may be as small as 3 KB while the photograph begins at 10 KB, so compress each against its own published band and inspect the result instead of applying one quality setting to both files.",
      "The September 2026 bulletin is the scope of this record. Keep the generated files, but compare them with the bulletin and preview belonging to the CTET session you are actually submitting if CBSE opens a later examination cycle.",
    ]
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
    applicationNotes: [
      "UPPSC's OTR guide states physical shapes rather than a fixed pixel canvas: the photograph is 5 x 6 cm and the signature 6 x 3 cm. Preserve those 5:6 and 2:1 proportions when cropping; do not substitute the narrower 3.5 x 4.5 photograph used by another commission.",
      "The published sizes are ceilings — photograph under 50 KB and signature under 30 KB — with no minimum KB value. Export a clear file below each maximum instead of inventing a lower boundary that could cause unnecessary recompression.",
      "The 200 DPI instruction is a scan or export setting paired with centimetre dimensions, not an additional fixed width and height in pixels. If the active OTR screen displays pixel rules, use those current on-screen values; the linked guide itself does not supply them.",
      "One-Time Registration stores these assets for the UPPSC profile. Review both previews before completing OTR, because the photo and signature have different orientations, shapes and caps even though they are prepared during the same registration session.",
    ],
  },
  bpsc: {
    id: "bpsc",
    name: "BPSC (Bihar PSC)",
    photoLimitKb: 50,
    sigLimitKb: 20,
    sigFormat: "JPG",
    description: "Bihar PSC captures your photograph live via webcam during the online application — there is no photo file to upload, so use the photo tool only for general passport-photo prep. The signature is uploaded under 20 KB (both a Hindi and an English signature), JPG.",
    source: {
      url: "https://bpsconline.bihar.gov.in/downloads/User_Manual.pdf",
      label: "BPSC online application — User Manual",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    isLiveCapture: true,
    context:
      "Bihar Public Service Commission captures the candidate's photograph live via webcam during the online application, rather than accepting an uploaded photo file — only the signature (in both Hindi and English) is uploaded as a file.",
    applicationNotes: [
      "BPSC's user manual separates live webcam capture from file upload. The candidate photograph is taken inside the application, so the 50 KB compatibility photo setting is not a published upload target and this tool cannot substitute a prepared file for that camera step.",
      "Two signatures are uploaded: one in Hindi and one in English. Prepare each as its own JPG under the recorded 20 KB ceiling, label them clearly on your device, and inspect the portal previews so the language fields are not swapped.",
      "The manual publishes no fixed photo pixels because the portal controls capture. Do not infer a portrait canvas or background-replacement rule from a generic passport preset; follow the webcam framing and lighting instructions displayed during the BPSC session.",
      "For signatures, a byte ceiling alone does not define useful geometry. Crop unused paper while preserving complete strokes, keep the source scans, and take any dimensions, ink instruction or minimum KB value from the active upload field if it displays them.",
    ],
  },
  mpsc: {
    id: "mpsc",
    name: "MPSC (Maharashtra PSC)",
    photoLimitKb: 50,
    sigLimitKb: 50,
    photoFormat: "JPG / JPEG",
    photoBackground: "Solid colour (blue, green or red)",
    sigFormat: "JPG / JPEG",
    description: "Maharashtra PSC. Photo up to 50 KB (3.5 cm x 4.5 cm, solid-colour background); signature up to 50 KB (3.5 cm x 1.5 cm, black ink on white paper); JPG/JPEG only. The official instructions give cm dimensions and a 50 KB max for both — no pixel size and no minimum.",
    source: {
      url: "https://mpsconline.gov.in/downloads/Instructions-for-Filling-the-Application-Form.pdf",
      label: "MPSC — Instructions for Filling the Application Form",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "Maharashtra Public Service Commission's official instructions specify photo and signature size in centimetres with a 50 KB cap for both, and require a solid-colour photo background — no pixel dimensions or minimum file size are stated.",
    applicationNotes: [
      "MPSC asks for a SOLID COLOUR background and names blue, green or red as preferred, which is unlike the plain white almost every other application here asks for. The notice states a preference rather than prohibiting white outright, but a white-background photograph prepared for another exam should not be reused without checking your own advertisement.",
      "The photograph is 3.5 cm by 4.5 cm in formal dress, full face directly to camera, with no shadows and no red-eye, as .jpg or .jpeg up to 50 KB. It must carry nothing else: no watermark, no stamp, and no name of the mobile app used to scan it, which rules out most free scanner apps that brand their output.",
      "The file name itself is limited to ten characters. That is easy to miss and easy to fix before you upload.",
      "The signature is signed in black ink on blank white unlined paper.",
      "Use a single-coloured sheet or board to create the flat solid backdrop the notice requests. The notice asks that the scan carry no additional content, so prefer a physical backdrop to an edited one and check that lighting has not created a visible gradient or shadow.",
    ]
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
    photoFormat: "JPEG",
    sigFormat: "JPEG",
    description: "Graduate Aptitude Test in Engineering. Photo 5-600 KB (200x260 to 530x690 px, 3.5x4.5 cm); signature 3-300 KB (250x80 to 580x180 px), JPEG. The KB cap is set by the conducting IIT each year (600 KB for GATE 2026 / IIT Guwahati) — confirm the current bulletin.",
    source: {
      url: "https://gate2026.iitg.ac.in/photograph-and-signature.html",
      label: "GATE 2026 — Photograph & Signature specifications",
    },
    verification: "official",
    verifiedOn: "2026-06-10",
    context:
      "GATE (Graduate Aptitude Test in Engineering) is conducted by a different IIT or IISc each year; the photo file-size cap is set by that year's conducting institute (600 KB for GATE 2026, run by IIT Guwahati) and can change between editions.",
    applicationNotes: [
      "GATE constrains the PROPORTIONS of both files. The photograph must fall between an aspect ratio of 0.66 and 0.89 with the face covering 60-70% of the frame after cropping, and the signature must be roughly 1:2.75 to 1:3.75 in height to width with the writing filling 70-80% of its image. A file inside the size limit but outside those ratios is still wrong.",
      "The photograph is 3.5 cm wide by 4.5 cm high on a white background with nothing and nobody else in the frame. The instruction is specific that a signature on a dark background is not accepted, so scan on plain white paper rather than photographing a page in poor light.",
      "The aspect-ratio rules are checked mechanically at upload, so a photograph that looks correct can still be refused for sitting a few percent outside the band. If the form objects without saying why, the ratio is the first thing to re-measure rather than the file size.",
      "The published aspect band of 0.66 to 0.89 is wide enough to include 3.5 x 4.5 cm (0.78) comfortably, so the standard passport proportion satisfies it. An ad-hoc crop can still fall outside the band, so re-measure the exported width-to-height ratio before upload.",
    ]
  },
  "ugc-net": {
    id: "ugc-net",
    name: "UGC-NET (NTA)",
    photoLimitKb: 200,
    photoMinKb: 10,
    // ⚠ DISPUTED. The June 2026 bulletin caps the signature at 30 KB in its
    // application-procedure section and at 50 KB elsewhere. 30 is stored
    // because a 31-50 KB file is rejected under the stricter reading, while a
    // file under 30 KB satisfies both. Restore 50 only against a live
    // validator, not against the bulletin.
    sigLimitKb: 30,
    sigMinKb: 10,
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
    description: "UGC-NET decides eligibility for Assistant Professor and Junior Research Fellowship across the humanities, social sciences, commerce, languages and education. The five science streams are examined separately through Joint CSIR-UGC NET; check the current subject list rather than assuming which body covers yours. \u26a0 The signature limit is disputed: the June 2026 information bulletin gives 4-30 KB in its application-procedure section and 10-50 KB elsewhere in the same document. This tool targets 10-30 KB, the range that satisfies both readings, so a file it produces is valid either way. Take the binding figure from the live application screen. The photograph is 10-200 KB, JPG or JPEG, with no fixed pixel dimensions published. That bulletin also introduces a live-photograph capture step, so read the current cycle's notice rather than working from an earlier one.",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s301eee509ee2f68dc6014898c309e86bf/uploads/2026/04/202604301078678748.pdf",
      label: "UGC-NET June 2026 — Information Bulletin",
    },
    verification: "disputed",
    verifiedOn: "2026-06-10",
    context:
      "UGC-NET (National Eligibility Test) is conducted by NTA for eligibility as Assistant Professor and for Junior Research Fellowship; NTA specifies photo and signature file size and format but no fixed pixel dimensions.",
    applicationNotes: [
      "The bulletin states two different signature limits. In its application-procedure section the signature is 4 KB to 30 KB; later in the same document it is 10 KB to 50 KB. This tool targets 10-30 KB, the overlap, so a file it produces satisfies either reading. Take the binding figure from the live application screen.",
      "A photograph found to be fabricated — de-shaped, or appearing hand-made or computer-made — is treated as unfair means rather than as a formatting error, with consequences beyond the form being returned. Resize and compress a real photograph; do not reconstruct one.",
      "The photograph is uploaded against a white background and is also the image used at the centre, so print a copy of the same file rather than using a different sitting.",
    ]
  },
  "csir-net": {
    id: "csir-net",
    name: "CSIR-NET (NTA)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
    description: "Joint CSIR-UGC NET covers the five science streams \u2014 Chemical, Earth Atmospheric Ocean and Planetary, Life, Mathematical and Physical Sciences \u2014 for Junior Research Fellowship and Lectureship. It is a different examination from UGC-NET with its own subject list, though NTA administers both. This bulletin gives photo 10-200 KB and signature 10-50 KB, JPG or JPEG, with no fixed pixel dimensions. The UGC-NET bulletin is not consistent with itself on the signature figure, so do not assume the two examinations share one number. The bulletin also spells the signature out more fully than the UGC-NET one does: running hand on white paper in blue or black ink, not block capitals.",
    source: {
      url: "https://cdnbbsr.s3waas.gov.in/s3efdf562ce2fb0ad460fd8e9d33e57f57/uploads/2025/09/202510072139225285.pdf",
      label: "Joint CSIR-UGC NET — Information Bulletin (NTA)",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    context:
      "The joint CSIR-UGC NET is conducted by NTA for eligibility in science and research fields; like UGC-NET, NTA specifies file size and format but no fixed pixel dimensions for the photo or signature.",
    applicationNotes: [
      "The bulletin treats a manipulated photograph as unfair means, not as a formatting error. Its wording is that if the photograph uploaded is found to be fabricated — de-shaped, or appearing hand-made or computer-made — the form is rejected and the candidate is dealt with under the unfair-means provisions. Resize and compress a real photograph; do not reconstruct one.",
      "The photograph you upload is also the one you paste on the attendance sheet at the centre, so print a copy of the same image rather than using a different sitting. The bulletin adds that the photograph need not be attested, so do not add an attestation step.",
      "Both files are JPG or JPEG: the photograph between 10 and 200 KB, the signature in running hand between 10 and 50 KB. Unclear photographs are listed as a rejection ground in their own right, separately from the size limits.",
    ]
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
    photoFormat: "JPG",
    sigFormat: "JPG",
    description:
      "The NDA & NA examination recruits unmarried candidates straight out of school into the Army, Navy and Air Force wings of the National Defence Academy, so most applicants are uploading an identity photograph for the first time. UPSC runs the upload through its common One Time Registration portal, whose instructions apply \"for any examination\": a JPG photograph of 20–200 KB with about 75% face coverage, and a separate JPG holding three signatures stacked vertically at 20–100 KB and 350–500 pixels. No pixel dimensions, aspect ratio, DPI or name/date strip are specified for the photograph.",
    source: {
      url: "https://upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf",
      label: "UPSC — Instructions for Uploading the Photo & Signature",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    signatureInk: "Black ink on plain white paper",
    context:
      "NDA is conducted by UPSC through the upsconline.nic.in portal, and the portal's photo and signature instructions apply to every UPSC examination rather than giving NDA its own band. A live photograph is also captured during the application and matched against the uploaded photo. The signature upload must show the candidate's signature three times vertically on one plain-white image.",
    applicationNotes: [
      "A live photograph capture is mandatory before the application can be submitted, taken through the device camera or by scanning a QR code with a phone. The prepared photograph you upload does not replace it.",
      "UPSC checks face coverage rather than only file size: the photograph must show about 75% face coverage, and the instruction sheet prints rejected samples whose only fault is that the face is too small in the frame. The file is jpg, saved as photo, on a plain white background, with the head centred and both ears visible.",
      "The don'ts are explicit: no uniform in the photograph, no dark or coloured glasses, no shadow on the face or the background, no hair across the eyes, and the photograph is not to be signed.",
      "The photograph and the live capture are separate fields on the form and both must be completed. Candidates who prepare a careful upload and then rush the live capture end up with two images that do not resemble each other, which is the mismatch the examiner is looking for at the centre.",
    ]
  },
  cds: {
    id: "cds",
    name: "CDS (Combined Defence Services)",
    photoLimitKb: 200,
    photoMinKb: 20,
    sigLimitKb: 100,
    sigMinKb: 20,
    photoFormat: "JPG",
    sigFormat: "JPG",
    description:
      "The Combined Defence Services examination is the graduate entry route to the Indian Military Academy, Naval Academy, Air Force Academy and Officers Training Academy. A photograph already stored in UPSC One Time Registration still has to meet the current rule: a JPG of 20–200 KB at roughly 75% face coverage, with three vertically stacked signatures in a separate JPG of 20–100 KB and 350–500 pixels. UPSC publishes no pixel size, aspect ratio, DPI or name/date strip for the photo, so review an existing upload against the current instructions.",
    source: {
      url: "https://upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf",
      label: "UPSC — Instructions for Uploading the Photo & Signature",
    },
    verification: "official",
    verifiedOn: "2026-07-17",
    signatureInk: "Black ink on plain white paper",
    context:
      "CDS is conducted by UPSC through the upsconline.nic.in portal, and the portal's photo and signature instructions apply to every UPSC examination rather than giving CDS its own band. A live photograph is also captured during the application and matched against the uploaded photo. The signature upload must show the candidate's signature three times vertically on one plain-white image.",
    applicationNotes: [
      "A live photograph capture is mandatory before the application can be submitted, taken through the device camera or by scanning a QR code with a phone. Preparing an upload beforehand is still worth doing, but it fills a different field on the form.",
      "UPSC checks face coverage, not only file size: the photograph must show about 75% face coverage, and the instruction sheet prints rejected samples whose only fault is a face too small in the frame. The file is jpg, saved as photo, on a plain white background, head centred with both ears visible.",
      "Explicitly refused: a photograph in uniform, dark or coloured glasses, shadows on the face or behind it, hair across the eyes, and a photograph that has been signed.",
      "A separate signature file accompanies the photograph and is subject to its own limit. Sign in your ordinary running hand on plain unlined paper and scan the signature area alone; a photograph of the whole sheet carries paper texture that survives compression badly and reads as a smudge at small sizes.",
    ]
  },
  afcat: {
    id: "afcat",
    name: "AFCAT (Air Force)",
    // ⚠ CORRECTED. Was 10-50 KB for photo, signature and thumb alike, which
    // generated files far below every published minimum. AFCAT 01/2026 states
    // photograph 100-200 KB, signature 80-150 KB, thumb impression 50-100 KB.
    photoLimitKb: 200,
    photoMinKb: 100,
    sigLimitKb: 150,
    sigMinKb: 80,
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
    description: "Air Force Common Admission Test. Three uploads with DIFFERENT bands: photograph 100-200 KB, signature 80-150 KB, thumb impression 50-100 KB, all JPG/JPEG. AFCAT specifies file sizes and formats but no fixed pixel dimensions. Confirm the current notification before submitting.",
    source: {
      url: "https://afcat.edcil.co.in/assets/images/news/AFCAT_02_2025/Notification_AFCAT_01-2026.pdf",
      label: "AFCAT 01/2026 — Notification (IAF)",
    },
    verification: "official",
    verifiedOn: "2026-08-03",
    context:
      "AFCAT (Air Force Common Admission Test) recruits for the Indian Air Force's Flying and Ground Duty branches. The 01/2026 notification sets a different band for each of the three uploads — photograph 100-200 KB, signature 80-150 KB, thumb impression 50-100 KB — with no fixed pixel dimensions.",
    applicationNotes: [
      "Three files, each with its own band and its own literal file name: Passport Photograph.jpg at 100-200 KB, Signature.jpg at 80-150 KB, and Thumb Impression.jpg at 50-100 KB. The published minimums are binding; a signature below 80 KB or thumb impression below 50 KB sits outside AFCAT's stated band.",
      "The thumb differs by candidate: male candidates upload the LEFT thumb and female candidates the RIGHT, pressed on an ink stamp pad and then onto plain blank paper.",
      "The signature is signed on white paper with a black ink pen, by the applicant and nobody else, and the notice asks you to scan the signature area only rather than the whole page.",
      "The notification states what each file name should be — Passport Photograph.jpg, Signature.jpg and Thumb Impression.jpg. It does not say what happens if you use a different name, so treat renaming as cheap insurance rather than as a stated rejection ground.",
      "The thumb impression is accepted as JPG, JPEG or PDF, which the photograph and signature are not — those are image formats only. Check the format as well as the size before uploading each of the three, because the rules differ file by file.",
    ],
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
    sigFormat: "JPEG",
    description: "Rajasthan PSC applies via the SSO Rajasthan / recruitment portal with One-Time Registration (OTR). The photograph is CAPTURED LIVE during OTR KYC (webcam) — there is no photo file to upload. Candidates upload two signatures (English and Hindi), each JPEG 20-50 KB, plus a left thumb impression (JPEG 20-50 KB) and a handwritten specimen (PDF 10-200 KB). RPSC publishes no pixel dimensions. Confirm the current OTR instructions before preparing files.",
    source: {
      url: "https://recruitment.rajasthan.gov.in/",
      label: "RPSC OTR-based Online Application Manual (19 May 2026), KYC upload section",
    },
    verification: "needs-review",
    verifiedOn: "2026-07-17",
    isLiveCapture: true,
    context:
      "Rajasthan Public Service Commission recruitment goes through the SSO Rajasthan recruitment portal's One-Time Registration. The photograph is taken live via webcam during KYC, so no photo file is uploaded; the uploadable items are two signatures (English and Hindi), a left thumb impression, and a handwritten specimen. Confirm the current OTR instructions for the specific recruitment before preparing files.",
    applicationNotes: [
      "The OTR KYC photograph is captured live by webcam. The 20 to 50 KB photo values exist only so the optional compatibility tool can render; they are not RPSC upload limits and must not be used to replace the capture inside SSO Rajasthan.",
      "RPSC asks for two signature files, one English and one Hindi, each JPEG from 20 to 50 KB. Treat them as separate assets and check both previews rather than assuming one bilingual image can populate two fields.",
      "The left-thumb impression is another JPEG in the 20 to 50 KB band, while the handwritten specimen is a PDF from 10 to 200 KB. Those document types are not signature variants and should not be forced into the signature resizer's output format.",
      "No pixel dimensions are published in the recorded KYC section. Preserve the natural proportions of complete handwriting and thumb marks, trim empty margins, and use any canvas displayed by the current OTR widget instead of borrowing a banking-exam size.",
      "The source label records the 19 May 2026 OTR manual, while the page remains needs-review because the public portal can change its signed-in KYC fields. Confirm the specific recruitment's current instructions before assigning files to the four upload labels.",
    ],
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
    photoFormat: "JPG",
    photoBackground: "White",
    sigFormat: "JPG",
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
    applicationNotes: [
      "TNPSC divides the photograph into two parts with exact measurements: the whole image is 4.5 cm high (170 pixels) by 3.5 cm wide (130 pixels), of which YOUR IMAGE occupies 3.0 cm (115 pixels) and a strip carrying your name and the date of photography occupies the remaining 1.5 cm (55 pixels) at the bottom. It is not a caption added over the picture — it is a defined band beneath it.",
      "The date printed on that strip must be on or after the date of the notification you are applying under. A photograph taken before the notification was published does not qualify however recent it looks, and the photograph itself must be within the last three months.",
      "The files are named literally: Photograph.jpg at 20 to 50 KB and Signature.jpg at 10 to 20 KB. Both bands are tighter than most, and your name and the date must remain clearly legible after compression.",
    ]
  },
  kpsc: {
    id: "kpsc",
    name: "KPSC (Karnataka PSC)",
    photoLimitKb: 200,
    photoMinKb: 50,
    sigLimitKb: 70,
    sigMinKb: 50,
    photoFormat: "JPEG",
    sigFormat: "JPEG",
    description: "KPSC UDYOGA registration upload. The current applicant manual specifies a JPEG photograph of 50-200 KB and a JPEG signature of 50-70 KB. It publishes no pixel dimensions, aspect ratio, DPI, ink or name/date rule, so the preset applies none.",
    source: {
      url: "https://kpsconline.karnataka.gov.in/Master/Download_applicant_user_manual",
      label: "KPSC UDYOGA Applicant User Manual — page 11",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    context:
      "KPSC's current UDYOGA applicant manual documents separate photograph and signature file uploads during personal-information registration. The first-party manual supports the JPEG file-size bands but gives no pixel geometry; the former square photo and signature targets came only from a vendor-hosted registration page and have been removed.",
    applicationNotes: [
      "KPSC sets the photograph at 50 KB to 200 KB and the signature at 50 KB to 70 KB, both JPEG. A signature below the 50 KB floor is outside this preset even if another application accepted that file.",
      "The 50 to 70 KB signature window is only 20 KB wide. Export once, check the size, then adjust image quality first; if dimensions must change, preserve the aspect ratio so the signature strokes are not stretched.",
      "The current UDYOGA manual does not publish a square photograph, fixed signature canvas, DPI value, ink colour or name-and-date strip. Those absent fields are intentional in this preset: adding geometry from an older vendor page would turn an unsupported convention into a displayed requirement.",
      "Photograph and signature are added during personal-information registration as separate JPEG assets. Check the encoded format rather than the filename alone — renaming a PNG to end in .jpeg does not change the bytes that the registration form receives.",
      "Keep the uncompressed photograph and signature alongside the exports. Because the manual supplies byte bands but no geometry, a future UDYOGA screen can add a canvas rule that requires a fresh crop rather than another round of compression.",
    ]
  },
  appsc: {
    id: "appsc",
    name: "APPSC (Andhra Pradesh PSC)",
    photoLimitKb: 50,
    sigLimitKb: 30,
    photoFormat: "JPG",
    sigFormat: "JPG",
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
    applicationNotes: [
      "The live TGPSC page confirms the One-Time Registration service, but its public view does not state whether the current photograph step uploads a file or captures one. Resolve that workflow on the signed-in OTR screen before preparing an asset, because a compatibility file cannot replace live capture.",
      "The 4 to 50 KB photograph and 1 to 30 KB signature bands are retained as compatibility defaults from an earlier indexed manual, not presented as current verified limits. If the active field displays different numbers, the field wins and this preset should be corrected from that evidence.",
      "No public current source establishes pixel dimensions, aspect ratios, formats, background colour, signature ink or a name-and-date strip for this record. The tool therefore avoids adding any of those constraints and should be used only after comparing each visible field in the active application.",
      "TGPSC was formerly named TSPSC, so both names appear in searches and older material. A renamed authority does not make an old upload manual current; use the present otr.tgpsc.gov.in session and the recruitment notice attached to the application cycle.",
      "Keep a screenshot or note of the limits shown in the active OTR field before exporting. That evidence distinguishes a current correction to this compatibility record from a value copied forward from an unavailable manual.",
    ],
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
    applicationNotes: [
      "The public WBPSC page supports One-Time Registration but exposes no current photograph or signature specification before the application flow. The two 50 KB ceilings are therefore compatibility settings, not figures verified from that page.",
      "Do not infer a minimum, pixel canvas, aspect ratio, format, background shade, signature ink or name-and-date requirement from the empty fields here. Each of those properties remains unknown until the active recruitment notice or upload widget states it.",
      "One-Time Registration and the post-specific application can be separate stages. Check whether the asset is stored in the OTR profile, requested again for the recruitment, or captured live; the public landing page does not resolve that distinction.",
      "Before exporting, note every label and validation message shown beside the signed-in field. A screenshot of the current rule is stronger correction evidence than a third-party table and lets this record be updated without carrying another cycle's values forward.",
      "Keep original portrait and signature files at useful resolution while the rule is unknown. If the screen requests a different band from 50 KB, re-export from the originals instead of repeatedly recompressing a provisional file and degrading the marks.",
    ],
  },
  gpsc: {
    id: "gpsc",
    name: "GPSC (Gujarat PSC)",
    photoLimitKb: 15,
    sigLimitKb: 15,
    description: "Gujarat PSC applications use Gujarat's OJAS service, but the current public portal does not establish whether photo/signature are uploaded or captured live and does not support the stored 15 KB targets or the former centimetre and ink claims. Treat the values as compatibility targets and confirm the current OJAS instructions.",
    source: {
      url: "https://ojas.gujarat.gov.in/",
      label: "Gujarat OJAS — live application portal",
    },
    verification: "needs-review",
    context:
      "The live Gujarat OJAS portal does not publicly expose GPSC's current photograph/signature workflow or validation rules before the active application flow. Confirm whether the recruitment requests file uploads or capture and verify its limits before relying on the compatibility targets.",
    applicationNotes: [
      "The first-party evidence available here establishes that GPSC applications use Gujarat OJAS. It does not establish whether the current recruitment uploads a prepared photograph and signature or captures either asset inside the form, so settle the workflow before opening a resizer.",
      "The 15 KB ceilings displayed by this preset are compatibility values without current public support. They should not be described as official GPSC limits, and a different number shown by the active OJAS field must replace them for that application.",
      "No verified source in this record publishes minimum KB values, pixel dimensions, physical dimensions, aspect ratios, encoded formats, background colour, signature ink or a name-and-date strip. The empty rows disclose missing evidence rather than borrowing rules from another state commission.",
      "OJAS hosts applications for more than one Gujarat authority and recruitment cycle. Open the exact GPSC advertisement and signed-in upload step named by your application; a limit from another OJAS form is not proof of this one.",
      "Keep the uncropped portrait and a high-contrast signature scan until the active fields are visible. Once the form states its requirements, export from those originals so a provisional 15 KB file does not become the only copy available for a different canvas.",
      "The page's needs-review badge is the operational conclusion of that source gap. Do not remove it until a readable OJAS instruction supports the workflow and numeric fields; merely observing that the upload accepts one test file would not establish every boundary.",
    ],
  },
  hpsc: {
    id: "hpsc",
    name: "HPSC (Haryana PSC)",
    photoLimitKb: 500,
    sigLimitKb: 500,
    description: "Haryana PSC online registration. The current recruitment advertisement (Advt 24/2026) lists a scanned photo and scanned signatures among the uploads but publishes no KB or pixel specification; those limits are shown only inside the online registration portal (regn.hpsc.gov.in) at the upload step. The 500 KB values here are unconfirmed and could not be checked against a public source — confirm the current figures on the portal before preparing files.",
    source: {
      url: "https://regn.hpsc.gov.in/",
      label: "HPSC online registration portal (photo/signature limits shown at the upload step)",
    },
    verification: "needs-review",
    context:
      "Haryana Public Service Commission sets the photo and signature upload limits inside its online registration portal rather than in the recruitment advertisement, so they are not publicly documented. Confirm the current figures on the portal at the time of applying.",
    applicationNotes: [
      "Advertisement 24/2026 confirms that scanned photographs and scanned signatures are among the application uploads, but it does not publish their byte limits or geometry. That supports the existence of file fields, not the two 500 KB compatibility ceilings displayed here.",
      "The binding values appear inside regn.hpsc.gov.in at the upload step. Record the permitted format, minimum and maximum bytes, width and height, and any background or ink instruction shown there before exporting; none of those details can be recovered from the public advertisement cited here.",
      "A 500 KB preset is deliberately labelled unconfirmed. Do not compress toward that number in advance or infer that a file below it is suitable: the private field may impose a lower cap, a minimum, fixed pixels or an encoded-format rule.",
      "Photo and signature are separate scanned assets even though the public notice names them together. Preserve a full-resolution portrait and a tightly cropped signature source so each can be rebuilt when the signed-in form reveals its own orientation and validation fields.",
    ],
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
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
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
    photoFormat: "JPG",
    sigFormat: "JPG",
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
    applicationNotes: [
      "LIC asks for four scanned images: photograph at 4.5cm x 3.5cm, signature in black ink, a left thumb impression on white paper in black or blue ink, and a HAND-WRITTEN DECLARATION whose text the notice supplies for you to copy out. The declaration must be written by hand on white paper in black or blue ink — typing it is not the same thing.",
      "Your photograph and IRIS are captured at the examination venue and the captured photo is matched against what you submitted, so the uploaded image needs to be a current likeness rather than the best one you own.",
      "A live photograph is taken through a webcam or phone during registration as well. Preparing a file does not remove that step.",
      "The linked source is the AAO Specialist 2025 notification. Its 200 x 230 photograph, 140 x 60 signature and four-document scanning instructions should not be projected onto ADO recruitment or a later AAO cycle without checking that cycle's notice.",
      "At 20 to 50 KB the photograph has a 30 KB window, while the 10 to 20 KB signature has only 10 KB. Prepare the black-ink signature from a tight crop of its own sheet; using the photograph's export settings ignores both the different geometry and narrower band.",
      "The prepared photograph and the registration-time live image are two separate inputs named by the notification. Keep a clean original of the uploaded image, but complete the webcam or phone capture inside the LIC registration flow when prompted.",
      "The thumb impression and declaration are not handled by this photo-and-signature resizer. Prepare them from the notification's own instructions and do not force either document into the 140 x 60 signature canvas merely because all four scans appear in one registration sequence.",
    ]
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
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
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
    applicationNotes: [
      "Four uploads, not two: photograph at 4.5cm x 3.5cm, signature in black ink, a LEFT THUMB IMPRESSION on white paper in black or blue ink, and a HAND-WRITTEN DECLARATION. The notice supplies the declaration text to copy out and requires it in your own handwriting, in English, and not in capitals. The notice covers the case where a candidate has no left thumb — the right thumb, or a finger of the left hand starting from the forefinger, is used instead — and it asks specifically that the impression is not smudged.",
      "A signature written in CAPITAL LETTERS will not be accepted. This sits separately from the file-size rule, so a signature comfortably inside the band can still be refused for how it was written.",
      "Caps, hats and dark glasses are not acceptable in the photograph. Religious headwear is allowed provided it does not cover the face. A live photograph is also captured during the process, in addition to the file you upload.",
      "The file geometry is asymmetric: a 200 x 230 portrait photograph and a 140 x 60 landscape signature. Crop each from its own source rather than resizing one generic canvas, and keep the photograph within 20 to 50 KB while the signature stays within 10 to 20 KB.",
      "This preset is scoped to the Administrative Officer 2025 advertisement and its pages 11 to 12. An Assistant application or a later AO advertisement needs its own check even if the interface is hosted on the same IBPS application platform.",
      "The live capture and four prepared document images form five separate inputs in the cited workflow. Completing one does not populate the others, so review the upload labels before assigning files with similar thumbnails.",
      "Keep the declaration text exactly as supplied by the advertisement when preparing that separate scan. This resizer does not generate, edit or validate the declaration wording; its photo and signature outputs cover only two of the five inputs.",
    ]
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
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
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
    photoFormat: "JPG / JPEG",
    photoBackground: "White",
    sigFormat: "JPG / JPEG",
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
    applicationNotes: [
      "CAT wants a square 1200 x 1200 pixel photograph and a signature at 80mm x 35mm, each as JPG or JPEG and each no larger than 80 KB, at a minimum of 150 pixels per inch. The square photograph is the unusual part: a standard 35x45mm passport crop is the wrong shape for this form.",
      "The photograph must be no more than six months old and on a white background. It is also affixed to your admit card on test day, and the instructions tell candidates to keep sufficient printed copies of the same image — so print spares of exactly what you upload.",
      "The square 1200x1200 requirement means you cannot start from a 35x45mm passport crop — the proportions are wrong and trimming one to a square leaves the head oversized in the frame. Crop square from your original photograph instead, then check the result is still at least 150 pixels per inch at the size CAT asks for.",
      "The signature is specified physically at 80 x 35 mm while the photograph is specified as a 1200 x 1200 square. Keep these as separate source files: converting the portrait canvas into the signature shape would discard the original proportions and add no useful signature detail.",
    ]
  },
  clat: {
    id: "clat",
    name: "CLAT (Common Law Admission Test)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoBackground: "Plain",
    description:
      "Compatibility preset for the CLAT application. The public CLAT 2026 instructions confirm a front-facing recent passport-size photograph with a plain background and a candidate signature, but publish no KB, pixel, aspect-ratio, DPI, file-format or ink limits. The stored 20-50 KB photo and 10-20 KB signature bands remain unconfirmed; check the current application screen before use.",
    source: {
      url: "https://consortiumofnlus.ac.in/clat-2026/ug-instructions.html",
      label: "CLAT 2026 UG application instructions",
    },
    verification: "needs-review",
    context:
      "CLAT is run by the Consortium of National Law Universities. Its public 2026 instructions identify the photo and signature uploads but do not expose their digital validation limits, so confirm the current application screen before preparing either file.",
    applicationNotes: [
      "The Consortium's instructions describe what the photograph must SHOW — recent, front-facing, plain background, with a separate signature — but do not publish numeric file-size or pixel limits the way most Indian applications do. Any site quoting you an exact KB figure for CLAT is supplying one the Consortium has not.",
      "Because no published limit governs, prepare a clean, correctly framed photograph and take the binding constraint from whatever the upload screen enforces at the time you apply. The figures stored here exist so the tool has a sensible default, not because the Consortium states them.",
      "Because the Consortium publishes no numeric limits, the practical test is whether the upload screen accepts your file. Prepare a clean, well-lit, front-facing photograph at a sensible size and keep the original to hand, so you can re-export at a different size if the form objects.",
      "The Consortium's instructions cover the photograph and signature upload and nothing beyond it, so treat anything you read elsewhere about where that image is reused later as unverified. Prepare a clean current photograph and keep the original file.",
    ]
  },
  "army-agniveer": {
    id: "army-agniveer",
    name: "Army Agniveer (Indian Army CEE)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    description:
      "Compatibility preset for Indian Army Agniveer registration. The recruiting-year 2027 notice confirms that a recent photograph is uploaded on joinindianarmy.nic.in, but publishes no photo/signature KB band, pixel dimensions, aspect ratio, format or name/date rule. The stored 20-50 KB photo and 10-20 KB signature bands remain unconfirmed; check the current candidate portal before use.",
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
    photoFormat: "JPG / JPEG",
    sigFormat: "JPG / JPEG",
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
    photoFormat: "JPEG / JPG / JPE",
    signatureInk: "Black ink on white paper",
    description:
      "Uttar Pradesh Police Recruitment & Promotion Board (UPPBPB) online registration — constable, SI and other posts. The figures recorded here are photo 35×45 mm JPEG/JPG/JPE at 20-50 KB and signature 35×15 mm at 5-20 KB in black ink, but the linked notice is an image-only Hindi scan whose upload section we have not been able to read, so these are unconfirmed. Confirm the current limits on your own notification and at the upload screen, which validates the file.",
    source: {
      url: "https://uppbpb.gov.in/FilesUploaded/Notice/CONSTABLE-VIGYAPTIc7be0cc8-3365-471e-9237-447c528d341a.pdf",
      label: "UPPBPB Constable recruitment notification (uppbpb.gov.in)",
    },
    // ⚠ The linked notice is an image-only Hindi scan. Nobody has OCR'd or
    // manually read its upload section, so an "official · Verified" badge over
    // precise KB figures claims a reading that was never done. Downgraded until
    // the exact section is extracted.
    verification: "needs-review",
    context:
      "UP Police (UPPBPB) recruits Constables, Sub-Inspectors and other posts under the Uttar Pradesh Police Recruitment & Promotion Board; limits are set per recruitment notification and the portal validates the file at upload, so re-check the current notification's numbers before applying.",
    applicationNotes: [
      "The linked constable notification is an image-only Hindi scan, and its upload section has not been extracted reliably in this review. The displayed 20 to 50 KB photograph and 5 to 20 KB signature figures therefore remain compatibility values, not a claimed transcription from that notice.",
      "The preset records a 35 x 45 mm portrait shape, a 35 x 15 mm landscape signature and black ink on white paper. Treat every one of those fields as provisional until the current recruitment screen shows the rule; a post-specific UPPBPB notice can differ from another police recruitment.",
      "JPEG, JPG and JPE are listed as possible extensions, but the active field may expose a narrower encoded-format list. Check the file's real format and the preview after upload; changing only the extension text does not convert image data.",
      "Constable and Sub-Inspector recruitments are separate cycles under the same board. Keep the original photograph and signature so they can be exported again if the current cycle displays different geometry or byte limits than this compatibility preset.",
    ],
  },
  // ---- Indian identity documents ----
  pan: {
    id: "pan",
    name: "PAN Card (NSDL / Protean & UTIITSL)",
    photoLimitKb: 20,
    sigLimitKb: 10,
    // 3.5 cm (h) × 2.5 cm (w) at the mandated 200 DPI → ~197×276 px.
    photoWidthPx: PAN_PHOTO_WIDTH_PX,
    photoHeightPx: PAN_PHOTO_HEIGHT_PX,
    // Signature 2 cm (h) × 4.5 cm (w) at 200 DPI → ~354×157 px.
    sigWidthPx: 354,
    sigHeightPx: 157,
    photoAspectRatio: 2.5 / 3.5,
    sigAspectRatio: 4.5 / 2,
    photoFormat: "JPEG",
    sigFormat: "JPEG",
    description:
      `Online PAN application (Form 49A/49AA via Protean-NSDL or UTIITSL). Photo ${PAN_PHOTO_HEIGHT_CM}×${PAN_PHOTO_WIDTH_CM} cm (height×width) colour JPEG at ${PAN_SCAN_DPI} DPI, max 20 KB; signature 2×4.5 cm JPEG at ${PAN_SCAN_DPI} DPI, max 10 KB. Application methods can differ, so confirm the current instructions for the route you use.`,
    source: {
      url: "https://tin.tin.proteantech.in/pan/InstructionDSC.html",
      label: "Protean (NSDL e-Gov) PAN instructions",
    },
    verification: "official",
    verifiedOn: "2026-06-11",
    dpi: PAN_SCAN_DPI, // officially mandated scan resolution
    context:
      "A PAN card application (Form 49A or 49AA) can be filed through Protean (formerly NSDL e-Gov) or UTIITSL. This preset records the linked Protean instructions; confirm the current photo and signature fields on the application route you use.",
    applicationNotes: [
      "PAN specifies a scan resolution rather than a pixel canvas: the photograph, signature and supporting documents are all to be scanned at 200 DPI. That is a property of how you digitise the original, so scan at that setting rather than upscaling a smaller file afterwards.",
      "Online submission through this route depends on holding a valid Digital Signature Certificate issued by an authorised Certifying Authority in India. Without one, the application follows a different path, and no photo preparation changes that.",
      "A PAN application submitted on paper takes printed photographs affixed to the form rather than an upload, and the two routes are not interchangeable. Decide which you are using before preparing anything: a file scanned at 200 DPI for the online route is not the same artefact as a print you paste on a form.",
      `${PAN_SCAN_DPI} DPI is a scanning setting rather than a property you can add afterwards. Scanning the published ${PAN_PHOTO_HEIGHT_CM} cm-high x ${PAN_PHOTO_WIDTH_CM} cm-wide photograph at ${PAN_SCAN_DPI} DPI produces roughly ${PAN_PHOTO_WIDTH_PX} x ${PAN_PHOTO_HEIGHT_PX} pixels (width x height); re-tagging a smaller file to ${PAN_SCAN_DPI} DPI leaves it the same file with a different label.`,
    ]
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
    photoBackground: "White",
    description:
      "ECI Form 6 specifies a recent, good-quality, unsigned colour passport-size photograph measuring 4.5×3.5 cm on a white background, with eyes open and both face edges visible. The public instructions do not publish a digital file-size cap, pixel dimensions, format or DPI. The stored 2 MB target is compatibility-only; confirm the current Voters' Service Portal upload screen before preparing a digital file.",
    source: {
      url: "https://voters.eci.gov.in/guidelines/Form-6_en.pdf",
      label: "ECI Form 6 guidelines (voters.eci.gov.in)",
    },
    verification: "needs-review",
    context:
      "Form 6 supports new-elector registration. Its public ECI guidance confirms the photograph's physical size and composition but not the online upload cap; there is no separate signature image in this preset. Confirm the current portal instructions before upload.",
    applicationNotes: [
      "Form 6 asks for the photograph to be PASTED in the space provided, not uploaded. It specifies a passport-size colour photograph of 4.5cm x 3.5cm on a white background, so what you need from a tool here is a correctly sized print rather than a file that meets a KB limit.",
      "The form asks for an UNSIGNED photograph. Several Indian applications want your name or signature across the image; this one specifically does not, and signing it is a reason for the form to come back.",
      "It states that both edges of the face must be clearly visible and the eyes open. A three-quarter angle, hair across the cheek, or a crop that clips an ear are the framing faults this wording is aimed at.",
    ]
  },
  cuet: {
    id: "cuet",
    name: "CUET (Common University Entrance Test)",
    photoLimitKb: 200,
    photoMinKb: 10,
    sigLimitKb: 50,
    sigMinKb: 10,
    photoFormat: "JPG / JPEG",
    photoBackground: "White",
    sigFormat: "JPG / JPEG",
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
    applicationNotes: [
      "The photograph you upload is also pasted on the attendance sheet at the centre, so the file you submit needs a printed twin. Preparing one image and printing that same image is the point; a different photograph taken later will not match.",
      "Both files are JPG or JPEG and the bands differ: the photograph between 10 and 200 KB, the signature between 10 and 50 KB, and both must be clearly legible rather than merely inside the limit.",
      "File size alone does not prove legibility. Inspect the exported signature at its actual dimensions; if strokes have broken up, export again at a larger size within the published 10 to 50 KB band.",
      "The CUET bulletin publishes no fixed pixel width or height for either asset. Preserve the portrait crop and handwritten signature proportions instead of forcing a canvas borrowed from CTET, banking recruitment or another NTA examination.",
      "The photo instruction asks for about 80 percent face coverage on white. That composition check happens before compression: crop from the original, inspect the face and background, and only then bring the JPG or JPEG inside the 10 to 200 KB band.",
      "A live photograph is captured during the application in addition to the prepared upload. The compatibility tool prepares the file only; it cannot perform, replace or validate the capture requested inside the CUET registration session.",
    ]
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
    photoFormat: "JPG / JPEG",
    photoBackground: "Plain light",
    sigFormat: "JPG / JPEG",
    description:
      "Kerala Public Service Commission (Thulasi portal — thulasi.psc.kerala.gov.in). Photo 150×200 px, under 30 KB, JPG/JPEG, plain light background, with the candidate's name and the date of photography printed at the bottom; signature 150×100 px, under 30 KB. Compare both exported files with the current Thulasi fields.",
    source: {
      url: "https://www.keralapsc.gov.in/sites/default/files/inline-files/otr.pdf",
      label: "Kerala PSC One-Time Registration instructions",
    },
    verification: "official",
    verifiedOn: "2026-07-01",
    requiresNameDate: true,
    context:
      "Kerala Public Service Commission uses its own Thulasi portal for all recruitments. The photo and signature upload limits (150×200 px / 30 KB and 150×100 px / 30 KB) differ from the standard national exam pattern, and Kerala PSC requires your name and the date of photography printed on the photo.",
    applicationNotes: [
      "Kerala PSC fixes the portrait at 150 x 200 pixels and the signature at 150 x 100. Their widths match but their heights and orientations do not, so verify width and height in order rather than treating 150 as evidence that the files share a canvas.",
      "Both files have a 30 KB ceiling and no stored minimum. The photograph is JPG or JPEG on a plain light background; the signature is a separate JPG or JPEG. Compress each below the maximum while preserving readable facial and handwriting detail.",
      "The candidate's name and photograph date belong at the bottom of the portrait. Add the text before the final 150 x 200 export, then inspect it at actual size so the lettering has not been clipped or blurred by the resize.",
      "A normal passport image without the required name and date is not the same asset even if its pixels and bytes match. Keep the caption area inside the published canvas rather than enlarging the image beyond 200 pixels to make room afterward.",
      "This record is tied to the Thulasi One-Time Registration instructions reviewed on the displayed date. Compare the current portal fields before upload, especially if Kerala PSC has replaced the OTR guide or changed how an existing profile photograph is reused.",
    ],
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
    photoFormat: "JPEG / JPG",
    photoBackground: "White",
    sigFormat: "JPEG / JPG",
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
    applicationNotes: [
      "NIELIT publishes two deliberately transposed canvases: the photograph is 132 pixels wide by 170 high, while the signature or left-thumb impression is 170 wide by 132 high. Read width before height; using the portrait pair for the signature produces the wrong orientation.",
      "The photograph's 132:170 ratio is effectively the same shape as 3.5 x 4.5 cm, while the signature's 170:132 canvas follows its 4.5 x 3.5 cm landscape instruction. Crop to those shapes rather than stretching an existing square or banking-exam image.",
      "Both assets are JPEG or JPG, but their size and resolution bands differ. The photograph is 5 to 50 KB at 96 to 300 DPI; the signature is 5 to 20 KB at 96 to 200 DPI. Export and inspect them separately instead of reusing one compression setting.",
      "The signature or left-thumb impression is made in black or blue ink on white paper. Trim unused paper before compression so the 170 x 132 canvas preserves the marks rather than spending its limited area on an empty border.",
      "Version 1.11 covers the DLC examination family named in the guide: BCC, CCC, CCC+, ECC and ACC. The record is not a generic NIELIT portal rule for every course, so another NIELIT application needs its own current instructions.",
    ],
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
    photoBackground: "Plain white or off-white",
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
      "UPSSSC online-application compatibility preset. The former UPSSSC photo/signature guideline URL no longer resolves, and the current official NIC page about UPSSSC's examination system publishes no upload figures. The stored photo 50-100 KB / 3.5×4.5 cm and signature 20-50 KB / 3.5×1.5 cm targets remain unconfirmed; confirm the current figures and formats in the active application before use.",
    source: {
      url: "https://up.nic.in/news/nic-uttar-pradesh-develops-advanced-examination-management-system-for-upsssc/",
      label: "NIC Uttar Pradesh — UPSSSC Examination Management System overview",
    },
    verification: "needs-review",
    context:
      "The current official NIC Uttar Pradesh overview confirms that its examination-management system supports UPSSSC application management, but it gives no photo or signature validation figures. The former UPSSSC guideline host was unreachable during this review, so check the active recruitment form before preparing files.",
    applicationNotes: [
      "The linked NIC Uttar Pradesh article confirms the application-management system, not an image specification. It contains no support for the displayed 50 to 100 KB photograph, 20 to 50 KB signature or their 3.5:4.5 and 3.5:1.5 compatibility shapes.",
      "The former guideline URL no longer resolves, so an archived value cannot be represented as a current first-party rule. Use the active recruitment form to confirm upload versus capture, encoded formats, both byte boundaries and any geometry before preparing either asset.",
      "The compatibility photograph and signature have different orientations and bands. If the current form confirms them, crop the portrait and handwriting independently; if it does not, discard the defaults rather than forcing the current files into an inherited template.",
      "UPSSSC applications can draw profile information into a post-specific recruitment. Inspect the actual field shown in the cycle you are submitting, including any preview or validation message, because a system overview cannot establish whether an older profile image is reused.",
      "Retain the uncropped photograph and a clean signature scan while checking the portal. Source originals let you respond to a new pixel canvas or lower ceiling without recompressing a 50 KB compatibility export and losing detail twice.",
    ],
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
      "BSF (Border Security Force) Constable/HC/SI recruitment. Signature 10-20 KB, 6.0cm×2.0cm — confirmed via the SSC GD 2026 notice (SSC administers BSF's Constable GD hiring stream). That same notice describes the photo step as a live webcam capture through the application portal, not a file-size/dimension upload — so the 20-50 KB photo figure here is an unconfirmed standard-pattern assumption for BSF's own SI/HC recruitment (a separate stream from SSC GD), not something this source confirms. Confirm the current post-specific notice before using the photo target.",
    source: {
      url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/notice_01122025.pdf",
      label: "SSC GD Constable (CAPFs incl. BSF) 2026 notice",
    },
    verification: "needs-review",
    context:
      "BSF (Border Security Force) recruits Constable (GD/Tradesmen) via the common SSC GD exam, and Head Constable/Sub-Inspector through its own portal (rectt.bsf.gov.in) — the two streams may have different upload specs. Always confirm the current notification before applying.",
    applicationNotes: [
      "The cited SSC GD 2026 notice covers the Constable GD route and describes a live webcam photograph rather than a prepared-photo upload. For that route, a 20 to 50 KB photo file is not supported by this source and cannot replace the capture performed inside the SSC application.",
      "The same notice supports a separate 10 to 20 KB signature at 6.0 x 2.0 cm. Its 3:1 landscape shape is recorded here, but the notice does not turn that signature rule into a photograph rule for BSF's own Head Constable or Sub-Inspector portal.",
      "BSF's post-specific recruitment and SSC's common CAPF recruitment are different workflows. Identify the conducting portal named in the advertisement before using a preset; the authority name alone does not determine whether the photograph is live or uploaded.",
      "For an SSC GD application, prepare the signature and complete the live camera step when prompted. For rectt.bsf.gov.in, take every photo, signature, format and byte value from that post's own notice or signed-in field because the linked SSC document does not supply them.",
    ],
  },

  crpf: {
    id: "crpf",
    name: "CRPF (Central Reserve Police)",
    photoLimitKb: 100,
    photoMinKb: 50,
    sigLimitKb: 100,
    sigMinKb: 50,
    photoAspectRatio: 35 / 45,
    photoFormat: "JPG / JPEG",
    photoBackground: "Plain colour",
    sigFormat: "JPG / JPEG / PNG",
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
    applicationNotes: [
      "The DATE the photograph was taken must be printed on the photograph itself, and the notice states plainly that applications without that date printed on the photograph are rejected. This is a formatting requirement that no amount of correct sizing compensates for.",
      "The photograph must be no more than three months old, about 35 mm wide by 45 mm high, as JPG or JPEG between 50 and 100 KB. The lower bound matters: a heavily compressed file below 50 KB falls outside the accepted band.",
      "The date printed on the photograph has to remain legible after compression: small grey text can disappear once the file is squeezed into the 50 to 100 KB band. Print it dark and large enough to survive.",
      "Add the date before compressing, then inspect it at actual size in the exported file rather than relying on the editor preview.",
      "The photograph is limited to JPG or JPEG, while the signature field also lists PNG. Check the encoded type for each asset; a PNG signature is within the recorded format list, but a PNG photograph is not.",
      "No fixed signature pixel or centimetre dimensions are published in the cited advertisement. Crop the black-ink writing tightly without clipping strokes, preserve its natural proportion, and do not force it into a canvas borrowed from SSC or a banking application.",
    ]
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
    photoFormat: "JPEG",
    photoBackground: "Plain white",
    sigFormat: "JPEG",
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
    description:
      "Compatibility preset for ITBP online recruitment. The reachable ITBP career page links to its recruitment portal but publishes no photo or signature KB, pixel, aspect-ratio, format or background rule. The stored 20-50 KB photo and 10-20 KB signature bands remain unconfirmed; check the current post-specific recruitment application before use.",
    source: {
      url: "https://www.itbpolice.nic.in/Home/Career/1000",
      label: "ITBP official career page linking to the recruitment portal",
    },
    verification: "needs-review",
    context:
      "ITBP conducts post-specific recruitments through its recruitment portal, while Constable GD can also run through SSC. Public notices reviewed did not expose the application widget's numeric image rules, so confirm the current post-specific upload screen.",
    applicationNotes: [
      "The official career page confirms the route into ITBP recruitment but publishes no image validation fields. The 20 to 50 KB photograph and 10 to 20 KB signature bands are compatibility defaults rather than values read from that page.",
      "No first-party public evidence in this record establishes pixels, proportions, encoded format, background shade, signature ink or whether the current post captures a photograph live. Check each of those properties in the post-specific notice and application session.",
      "Constable GD can be administered through SSC while an ITBP Head Constable, Sub-Inspector or specialist recruitment can use the force's own portal. A rule from one conducting system must not be carried into the other merely because both lead to ITBP posts.",
      "If the active form requests uploads, record its minimum and maximum separately for the portrait and signature before exporting. If it requests camera capture, use that interface; a prepared compatibility photograph does not perform or validate a live step.",
      "Keep source-quality originals until the post and portal are confirmed. Re-exporting from the originals protects face and ink detail if the real field differs from the provisional byte bands displayed on this page.",
    ],
  },

  "navy-agniveer": {
    id: "navy-agniveer",
    name: "Indian Navy Agniveer",
    photoLimitKb: 50,
    photoMinKb: 10,
    description:
      "Indian Navy Agniveer SSR/MR recruitment. The notice requires a 10-50 KB recent colour passport-style photo with the candidate holding a black slate showing their name and the photograph date in white chalk, plus a separate webcam live photograph during the application. It publishes no photo pixel dimensions or separate signature upload.",
    source: {
      url: "https://www.joinindiannavy.gov.in/files/Advt_Agniveer_MR_English.pdf",
      label: "Indian Navy Agniveer MR 02/2025, 01/2026 and 02/2026 notice, paragraph 34",
    },
    verification: "official",
    verifiedOn: "2026-07-18",
    requiresSlateNameDate: true,
    context:
      "Indian Navy Agniveer applications require both the prepared slate photograph upload and an additional webcam live photograph. This hybrid workflow is not the replacement live-capture flow represented by isLiveCapture. The slate is physical, not a digital name/date strip; the notice lists no fixed pixels or separate signature upload.",
    applicationNotes: [
      "The photograph must be recent in a specific sense: the notice names a month before which the photograph must not have been taken, so an image from an earlier application cycle is not reusable even if it still looks like you. Check the date named in the notification you are applying under.",
      "The recorded upload target begins at 10 KB. Compress carefully and check the face is still legible at that size rather than compressing to the number and submitting unseen.",
      "Agniveer entries run in batches with their own advertisement each cycle, and the photograph date rule is tied to that cycle rather than to a rolling number of months. Read the date named in the notification you are applying under before deciding an existing photograph is recent enough.",
    ]
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
    photoFormat: "JPG",
    photoBackground: "Light-shade plain",
    sigFormat: "JPG / JPEG",
    description:
      "Historical EPFO Social Security Assistant preset from the 2023 direct-recruitment advertisement: photo 10-200 KB JPG on a light-shade plain background, with approximately 80% face coverage and no spectacles; signature 4-30 KB JPG/JPEG. EPFO has not published a newer SSA direct-recruitment notice, so check the current cycle before use.",
    source: {
      url: "https://www.epfindia.gov.in/site_docs/PDFs/Recruitments_PDFs/Advertisement_for_SSA_24032023.pdf",
      label: "EPFO SSA Advertisement (epfindia.gov.in, 2023)",
    },
    verification: "needs-review",
    context:
      "EPFO's 2023 SSA recruitment was conducted by NTA and its published image rules remain available in the archived advertisement. Recruitment workflows vary by post and cycle, so confirm the current EPFO or conducting-body notice before preparing files.",
    applicationNotes: [
      "The signature band is much tighter than the photograph's — 4 to 30 KB against 10 to 200 KB. Start from a clean, tightly cropped signature on white paper so background texture does not consume the limited file-size budget.",
      "Both files upload as JPG or JPEG. Prepare the signature independently because its 4 to 30 KB band is tighter, and inspect whether every stroke remains legible in the exported file.",
      "The signature window spans 26 KB, while the photograph window spans 190 KB. Do not reuse the photograph's export settings: configure and inspect the signature independently inside its 4 to 30 KB band.",
      "The photograph instruction asks for approximately 80 percent face coverage on a plain light-shade background and no spectacles. Those composition fields are independent of the generous 10 to 200 KB range; inspect the crop and face visibility before optimising bytes.",
      "This preset is historical and scoped to the 2023 Social Security Assistant advertisement conducted by NTA. It is not evidence for another EPFO post or a new recruitment cycle, so compare every field with the current EPFO or conducting-body notice before reuse.",
      "No fixed photograph or signature pixel canvas is recorded from the advertisement. Preserve the portrait and handwriting proportions instead of forcing a 200 x 230 banking template simply because the byte bands appear in an online recruitment workflow.",
    ]
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
    photoFormat: "JPG / JPEG",
    photoBackground: "Light or preferably white",
    sigFormat: "JPG / JPEG",
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
    applicationNotes: [
      "Block capitals are rejected outright as a signature. FCI states this apart from any file rule, so an image meeting every size and format requirement still fails when the name is printed rather than signed. Use the running hand you would use on a bank form.",
      "Alongside the photograph at 4.5 cm by 3.5 cm and the signature, a thumb impression is scanned and uploaded. Your photograph and biometric data are also captured at the examination centre and matched against what you submitted, so the uploaded image needs to be a current likeness.",
      "The thumb impression is taken with an ink stamp pad on plain paper rather than captured digitally, so it is worth doing before you sit down to fill the form. A smudged impression is the one element you cannot fix by editing, and re-doing it means finding an ink pad again.",
      "The photograph is stated as 4.5 cm by 3.5 cm, which is the same portrait proportion as 35 x 45 mm written height-first. Start from that shape, while still checking the current recruitment cycle's framing and background rules.",
    ]
  },
};

export const PORTAL_KEYS = Object.keys(PORTAL_PRESETS) as Array<keyof typeof PORTAL_PRESETS>;
