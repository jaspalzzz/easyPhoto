/**
 * Dedicated "resize to N KB" landing pages — high-intent (esp. India forms).
 * Keyword-rich, root-level slugs: /photo-resize-to-20kb/.
 */
export const KB_TARGETS = [10, 20, 30, 50, 100, 200] as const;

export type KbTarget = (typeof KB_TARGETS)[number];

export const kbSlug = (kb: number) => `photo-resize-to-${kb}kb`;
export const kbPath = (kb: number) => `/${kbSlug(kb)}/`;

export const SIGNATURE_KB_TARGETS = [10, 20, 50, 100] as const;
export type SignatureKbTarget = (typeof SIGNATURE_KB_TARGETS)[number];
export const sigKbSlug = (kb: number) => `signature-resize-to-${kb}kb`;
export const sigKbPath = (kb: number) => `/${sigKbSlug(kb)}/`;

/** Dedicated "compress PDF to N KB" landing pages — marksheets, certificates, forms. */
export const PDF_KB_TARGETS = [50, 100, 200, 500] as const;
export type PdfKbTarget = (typeof PDF_KB_TARGETS)[number];
export const pdfKbSlug = (kb: number) => `compress-pdf-to-${kb}kb`;
export const pdfKbPath = (kb: number) => `/${pdfKbSlug(kb)}/`;

/**
 * Per-target editorial content so each "resize to N KB" page is genuinely
 * distinct (different real use cases, tip and FAQ), not a template with the
 * number swapped. Drives KbResizeLanding / PdfKbLanding and the signature pages.
 */
export interface KbUseCase {
  /** Section heading for "where this size applies" — unique per target. */
  heading: string;
  /** Lead paragraph unique to this size. */
  intro: string;
  /** Specific, real contexts where this exact size applies. */
  useCases: { label: string; detail: string }[];
  /** Practical tip unique to this size. */
  tip: string;
  /** A lead FAQ unique to this size. */
  faq: { q: string; a: string };
  /**
   * Size-specific quality-tradeoff FAQ. Replaces the landing components'
   * generic "will it reduce quality" answer — that answer is genuinely
   * different per target (10 KB visibly softens a face; 200 KB doesn't),
   * and the one-size-fits-all phrasing read as templated boilerplate.
   */
  qualityFaq: { q: string; a: string };
}

export const PHOTO_KB_USECASES: Record<number, KbUseCase> = {
  10: {
    heading: "Where a 10 KB photo is used",
    intro:
      "10 KB is one of the smallest photo limits you will meet — reserved for portals that store huge numbers of ID photos and for older state-government forms with strict upload caps.",
    useCases: [
      { label: "Legacy state-government portals", detail: "Some older state PSC and municipal forms cap the photo at 10 KB to keep their databases small." },
      { label: "ID-card and token photo fields", detail: "Library cards, gate passes and internal ID systems often accept only a tiny 10 KB headshot." },
      { label: "Strict ‘maximum 10 KB’ instructions", detail: "When a form explicitly says the photo must be under 10 KB, this preset hits it without guesswork." },
    ],
    tip: "At 10 KB a passport-style photo will look soft — only use it when the form truly demands ≤10 KB. If the field is actually for a signature, use the signature resizer instead.",
    faq: {
      q: "Is 10 KB too small for a clear face photo?",
      a: "It is tight. We keep the maximum quality that still fits 10 KB, but fine detail is lost at that size — if your form allows 20 KB or 50 KB, prefer that for a sharper photo.",
    },
    qualityFaq: {
      q: "How much quality is lost at 10 KB?",
      a: "A fair amount of fine detail — hitting 10 KB usually needs heavy JPEG compression and often smaller dimensions too, so skin texture and hair detail soften noticeably. The face stays recognisable, which is what these strict portals are checking for.",
    },
  },
  20: {
    heading: "Where a 20 KB photo is used",
    intro:
      "20 KB is the common lower band for Indian exam photos — small enough to upload fast, large enough to keep a head-and-shoulders shot readable.",
    useCases: [
      { label: "SSC, RRB and state PSC exams", detail: "Many staff-selection and railway recruitment forms accept a photo around 20 KB." },
      { label: "Bank recruitment forms", detail: "IBPS and some bank portals sit in the 20–50 KB photo band; 20 KB clears the lower limit." },
      { label: "College and scholarship portals", detail: "University admission and scholarship sites frequently ask for a roughly 20 KB photo." },
    ],
    tip: "Pair a 20 KB photo with a 10–20 KB signature — most exam forms want the signature even smaller than the photo.",
    faq: {
      q: "Which exams ask for a 20 KB photo?",
      a: "It is common across SSC, RRB and several state PSC and university forms. Always confirm the exact figure on your form, then set it above.",
    },
    qualityFaq: {
      q: "Will a 20 KB photo still look sharp?",
      a: "At typical exam dimensions (around 350×450 px) a 20 KB JPEG keeps the face clearly defined — the background and clothing lose subtle texture first. It reads perfectly well at the size portals actually display it.",
    },
  },
  30: {
    heading: "Where a 30 KB photo is used",
    intro:
      "30 KB sits between the strict exam band and the more generous government limit — a size you will see on certain admission and scholarship portals.",
    useCases: [
      { label: "Scholarship portals", detail: "National and state scholarship sites sometimes cap the photo at 30 KB." },
      { label: "University admission forms", detail: "Several college portals ask for a photo around 30 KB alongside scanned documents." },
      { label: "State recruitment boards", detail: "Some state-level recruitment forms use a 30 KB photo ceiling." },
    ],
    tip: "30 KB gives noticeably better clarity than 20 KB — if your form's ceiling is 30 KB or higher, use the full allowance for a sharper photo.",
    faq: {
      q: "Is 30 KB enough for a sharp passport-style photo?",
      a: "Yes — at 30 KB a correctly cropped head-and-shoulders photo stays clear on screen and in print at ID size.",
    },
    qualityFaq: {
      q: "Will compressing to 30 KB reduce quality?",
      a: "Barely, at exam dimensions — 30 KB gives enough headroom that compression artefacts are hard to spot without zooming in. It is a comfortable middle ground between the strict 20 KB band and the 50 KB default.",
    },
  },
  50: {
    heading: "Where a 50 KB photo is used",
    intro:
      "50 KB is the most common exam-photo cap in India — the safe default for the majority of UPSC, SSC, NTA and bank application forms.",
    useCases: [
      { label: "UPSC and SSC application forms", detail: "Most civil-services and staff-selection forms accept a photo up to 50 KB." },
      { label: "NTA exams (NEET, JEE)", detail: "National Testing Agency portals commonly allow a photo around 20–50 KB." },
      { label: "Bank and PSU recruitment", detail: "Bank and public-sector job forms typically permit up to 50 KB for the photo." },
    ],
    tip: "When a form just says ‘photo under 50 KB’, this is your default — it balances a sharp photo with a small file.",
    faq: {
      q: "Is 50 KB the standard exam photo size?",
      a: "For most Indian exams, yes — 50 KB is the most widely accepted photo cap. Confirm your form's exact limit, but 50 KB is the safe default.",
    },
    qualityFaq: {
      q: "Will compressing to 50 KB reduce quality?",
      a: "Not visibly for a passport-style photo — at the few-hundred-pixel dimensions exam portals use, 50 KB keeps the image essentially artefact-free. Quality only becomes a real concern below about 20 KB.",
    },
  },
  100: {
    heading: "Where a 100 KB photo is used",
    intro:
      "100 KB is a common target for some visa, identity and government-form photo uploads, but each portal sets its own limit.",
    useCases: [
      { label: "Visa applications", detail: "Some visa portals allow a photo around this size; confirm the live form's exact range." },
      { label: "PAN, ID and KYC forms", detail: "PAN card and KYC uploads commonly permit around 100 KB." },
      { label: "Recruitment forms", detail: "Some recruitment portals use a 100 KB ceiling for a clear head-and-shoulders photo." },
    ],
    tip: "For passport and visa photos, get the exact dimensions and white background right first with the passport photo maker, then compress to 100 KB here.",
    faq: {
      q: "Why do passport and visa forms allow 100 KB?",
      a: "Travel documents need a clearer face for verification, so they permit a larger file than exam forms. 100 KB keeps the photo sharp while meeting the cap.",
    },
    qualityFaq: {
      q: "Will compressing to 100 KB reduce quality?",
      a: "It depends on the starting image and target dimensions. At typical portal dimensions, 100 KB often preserves clear facial detail; inspect the exported image before submitting.",
    },
  },
  200: {
    heading: "Where a 200 KB photo is used",
    intro:
      "200 KB is a generous limit for higher-resolution photo and document uploads — common on visa document fields and some job portals.",
    useCases: [
      { label: "Visa supporting documents", detail: "Document-photo fields on visa portals often allow up to 200 KB." },
      { label: "Job and HR portals", detail: "Corporate application sites frequently permit a 200 KB photo or scan." },
      { label: "Scanned photo IDs", detail: "Uploads of scanned ID photos use the larger 200 KB headroom for legibility." },
    ],
    tip: "200 KB leaves room for a high-resolution image — only compress this far if your form's limit is 200 KB; for exam photos, a smaller size is expected.",
    faq: {
      q: "Is 200 KB too large for an exam photo?",
      a: "Usually yes — most exams cap at 50 KB. Use 200 KB for visa documents, job portals or any field that explicitly allows it.",
    },
    qualityFaq: {
      q: "Will compressing to 200 KB reduce quality?",
      a: "No — 200 KB is more than a portal-sized photo needs. A photo only shrinks meaningfully to reach this cap when it starts out as a multi-megabyte camera image, and that reduction is invisible at upload dimensions.",
    },
  },
};

export const PDF_KB_USECASES: Record<number, KbUseCase> = {
  50: {
    heading: "What fits in a 50 KB PDF",
    intro:
      "50 KB is a hard squeeze for a PDF — right for a single-page certificate that a portal wants kept very small.",
    useCases: [
      { label: "Caste / category certificates", detail: "Single-page SC/ST/OBC and EWS certificates compress well to 50 KB." },
      { label: "Income and domicile certificates", detail: "One-page state-issued certificates fit comfortably under 50 KB." },
      { label: "A single marksheet page", detail: "One page of a marksheet, in greyscale, lands under 50 KB while staying readable." },
    ],
    tip: "For a 50 KB target, extract just the page you need first with the PDF split tool — compressing a multi-page file this hard makes the text hard to read.",
    faq: {
      q: "Can a marksheet really fit in 50 KB?",
      a: "A single page can. Multi-page marksheets should be split first — at 50 KB across many pages the text becomes too soft to read.",
    },
    qualityFaq: {
      q: "How readable is a PDF squeezed to 50 KB?",
      a: "A single page stays readable — the text softens but remains clear at normal reading size. This is the one target where page count really matters: spreading 50 KB across several pages makes the text hard to read.",
    },
  },
  100: {
    heading: "What fits in a 100 KB PDF",
    intro:
      "100 KB is the most common document cap on Indian exam and government portals — the standard target for marksheets and certificates.",
    useCases: [
      { label: "10th and 12th marksheets", detail: "Single-page board marksheets compress cleanly to under 100 KB." },
      { label: "Degree and diploma certificates", detail: "One-page graduation certificates fit the 100 KB cap with room to spare." },
      { label: "Exam-portal document uploads", detail: "Most SSC, UPSC and bank portals cap supporting documents at 100 KB." },
    ],
    tip: "100 KB is the safe default for most certificate uploads — if a portal doesn't state a limit, aim here.",
    faq: {
      q: "Is 100 KB the standard certificate size?",
      a: "For most exam and government portals, yes — 100 KB is the most common document cap. Confirm your form's exact limit before uploading.",
    },
    qualityFaq: {
      q: "Will text stay sharp in a 100 KB PDF?",
      a: "For one or two pages, yes — 100 KB keeps typical certificate and marksheet text clean. Dense small print or documents with many pages will start to soften; split those first.",
    },
  },
  200: {
    heading: "What fits in a 200 KB PDF",
    intro:
      "200 KB gives a multi-page or detailed document room to stay legible — used where portals allow a slightly larger upload.",
    useCases: [
      { label: "Degree certificates with detail", detail: "Certificates with seals and fine print stay sharp at 200 KB." },
      { label: "Two-page documents", detail: "A two-page certificate or letter fits 200 KB without splitting." },
      { label: "Scholarship and job portals", detail: "Several scholarship and recruitment sites allow documents up to 200 KB." },
    ],
    tip: "If your form allows 200 KB, use it — your scanned text stays much clearer than at 50–100 KB.",
    faq: {
      q: "When should I use 200 KB instead of 100 KB?",
      a: "Use 200 KB when the portal allows it and your document has fine print or two pages — the extra headroom keeps the text readable.",
    },
    qualityFaq: {
      q: "How much quality does a 200 KB PDF keep?",
      a: "Enough for fine print — seals, stamps and small text on a one-to-two-page document stay sharp at 200 KB. It is the size where compression stops being the limiting factor for typical certificates.",
    },
  },
  500: {
    heading: "What fits in a 500 KB PDF",
    intro:
      "500 KB is a lenient cap for larger or combined documents — experience letters, multi-page proofs and merged PDFs.",
    useCases: [
      { label: "Experience letters and NOCs", detail: "One- to two-page letters keep crisp text at 500 KB." },
      { label: "Multi-page certificate sets", detail: "Several pages combined into one PDF fit comfortably under 500 KB." },
      { label: "Merged proof documents", detail: "A merged set of IDs or proofs stays legible within a 500 KB cap." },
    ],
    tip: "Need to combine files first? Merge them, then compress the single PDF to 500 KB here.",
    faq: {
      q: "Will text stay selectable at 500 KB?",
      a: "To hit a fixed KB target the pages are rendered to images, so text isn't selectable — but at 500 KB it stays sharp and easy to read.",
    },
    qualityFaq: {
      q: "Does compressing to 500 KB lose anything visible?",
      a: "Very little — 500 KB comfortably holds several pages with crisp text. At this size the practical trade-off is the render-to-image step, not the compression itself.",
    },
  },
};

export const SIGNATURE_KB_USECASES: Record<number, KbUseCase> = {
  10: {
    heading: "Where a 10 KB signature is used",
    intro:
      "10 KB is the strictest signature limit — the lower bound that staff-selection and banking exams expect.",
    useCases: [
      { label: "SSC, IBPS and SBI", detail: "These forms usually want the signature in a 10–20 KB band; 10 KB clears the floor." },
      { label: "RRB recruitment", detail: "Railway recruitment signature uploads sit in the same small range." },
      { label: "Strict ‘≤10 KB’ fields", detail: "When a form says the signature must be under 10 KB, this preset hits it." },
    ],
    tip: "A signature compresses smaller than a photo — 10 KB is usually achievable while keeping the ink crisp.",
    faq: {
      q: "Which exams want a 10 KB signature?",
      a: "SSC, IBPS, SBI and RRB forms commonly cap the signature in the 10–20 KB range. Set the exact figure your form shows.",
    },
    qualityFaq: {
      q: "Will my signature stay crisp at 10 KB?",
      a: "Usually yes — ink strokes on a clean background compress far better than a photo, so 10 KB typically keeps sharp edges. Only very faint, pencil-thin strokes risk thinning out; go over your signature with a bolder pen if that happens.",
    },
  },
  20: {
    heading: "Where a 20 KB signature is used",
    intro:
      "20 KB is the standard exam-signature cap — the size most staff-selection and banking forms expect.",
    useCases: [
      { label: "SSC and IBPS", detail: "Most staff-selection and bank forms cap the signature at around 20 KB." },
      { label: "State PSC forms", detail: "Many state public-service commissions use a 20 KB signature limit." },
      { label: "RRB and PSU jobs", detail: "Railway and public-sector recruitment signatures sit at roughly 20 KB." },
    ],
    tip: "Pair a 20 KB signature with a 20–50 KB photo — the signature is almost always the smaller of the two.",
    faq: {
      q: "Is 20 KB the usual signature size?",
      a: "Yes — 20 KB is the most common exam-signature cap. Confirm your form's limit, but 20 KB clears most portals.",
    },
    qualityFaq: {
      q: "Will 20 KB reduce my signature's quality?",
      a: "Rarely noticeably — 20 KB is comfortable for a trimmed signature. If the result looks blurry, the cause is almost always the original photo being out of focus or poorly lit, not the compression.",
    },
  },
  50: {
    heading: "Where a 50 KB signature is used",
    intro:
      "50 KB is a more generous signature allowance — used by portals that accept a larger, higher-fidelity signature image.",
    useCases: [
      { label: "CSIR NET and UGC exams", detail: "Some national testing portals allow the signature up to 50 KB." },
      { label: "State PSCs with larger caps", detail: "Certain state commissions permit a 50 KB signature." },
      { label: "University and scholarship forms", detail: "A number of university portals accept signatures up to 50 KB." },
    ],
    tip: "If your form allows 50 KB, the signature stays smooth with no compression artefacts on the ink edges.",
    faq: {
      q: "When is a 50 KB signature needed?",
      a: "On portals that explicitly allow it — CSIR NET, some state PSCs and university forms. For SSC and bank forms, a smaller 10–20 KB signature is expected.",
    },
    qualityFaq: {
      q: "Does a 50 KB signature look better than a 20 KB one?",
      a: "Slightly — at 50 KB the ink edges keep full smoothness with no compression artefacts at all. It only matters if your form allows it; the smaller caps still stay perfectly legible.",
    },
  },
  100: {
    heading: "Where a 100 KB signature is used",
    intro:
      "100 KB is the largest signature size you will typically meet — used where a form accepts a full-resolution signature sheet.",
    useCases: [
      { label: "UPSC signature uploads", detail: "Civil-services forms accept a larger, clearer signature image." },
      { label: "Forms accepting a signature sheet", detail: "Portals that take a scanned signature strip allow up to 100 KB." },
      { label: "Documents needing a crisp signature", detail: "Where the signature prints on a certificate, the 100 KB headroom keeps it sharp." },
    ],
    tip: "Only compress to 100 KB if your form allows it — most exams want the signature far smaller, in the 10–20 KB range.",
    faq: {
      q: "Do any forms really want a 100 KB signature?",
      a: "Some do — UPSC and forms that accept a full signature sheet. Most exams, though, cap the signature at 10–20 KB, so check before using 100 KB.",
    },
    qualityFaq: {
      q: "Why allow a signature as large as 100 KB?",
      a: "Forms that print your signature on a certificate or accept a full scanned signature sheet want maximum fidelity — at 100 KB every stroke and pressure variation of the original ink survives intact.",
    },
  },
};
