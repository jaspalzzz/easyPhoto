/**
 * Passport / Visa Photo Specifications — Launch Country Database
 * -------------------------------------------------------------
 * Foundation data for the photo tool. Each entry feeds:
 *   (a) the auto-crop / head-positioning engine (printMm + headHeightMm)
 *   (b) the background-replacement target color (background.hex)
 *   (c) the export presets (digital pixel range + file-size caps)
 *   (d) the SEO landing page content (the human-readable spec)
 *
 * `verified` field:
 *   "gov"        = confirmed against the official government source
 *   "aggregator" = sourced from reputable third-party guides; MUST be
 *                  re-checked against the primary gov portal before launch
 *
 * GOLDEN RULE: a wrong number here = a rejected photo = a dead reputation.
 * Treat this file as the product. Re-verify on a schedule; specs change quietly.
 *
 * Last verified: 2026-06-04
 *
 * NOTE: This is a faithful TypeScript port of the verified JS foundation.
 * The values are sacred — types were added, numbers were NOT touched.
 */

export type Verified = "gov" | "aggregator";

export interface Dimensions {
  width: number;
  height: number;
}

export interface Range {
  min: number;
  max: number;
}

export interface BackgroundSpec {
  description: string;
  hex: string;
  acceptableHex: string[];
}

export interface DigitalSpec {
  pxMin?: Dimensions;
  pxMax?: Dimensions;
  px?: Dimensions;
  pxApprox300dpi?: Dimensions;
  pxApprox600dpi?: Dimensions;
  square?: boolean;
  fileSizeKb: Range | null;
  formats: string[];
}

export interface CountrySpec {
  id: string;
  label: string;
  documents: string[];
  printMm: Dimensions;
  visaPrintMm?: Dimensions;
  headHeightMm: Range;
  headPercentOfFrame?: Range;
  eyeHeightFromBottomMm?: Range;
  background: BackgroundSpec;
  digital: DigitalSpec;
  dpiMin: number;
  glasses: boolean | string;
  smileAllowed: string;
  notes: string;
  source: string;
  verified: Verified;
  /**
   * Non-blocking, user-facing caveat shown in the tool (e.g. "lab-print
   * required", "not for the printed passport"). Use this instead of hard-gating
   * a country when the tool can still produce a useful, honest result.
   */
  advisory?: string;
}

export const COUNTRY_SPECS: Record<string, CountrySpec> = {
  // ─────────────────────────────────────────────────────────────
  us: {
    id: "us",
    label: "United States",
    documents: ["Passport", "Passport Card", "Visa (DS-160)"], // same spec across these
    printMm: { width: 51, height: 51 }, // 2 x 2 inch, square
    headHeightMm: { min: 25, max: 35 }, // chin to top of head (1 to 1-3/8 in)
    headPercentOfFrame: { min: 50, max: 69 },
    eyeHeightFromBottomMm: { min: 28, max: 35 }, // 1-1/8 to 1-3/8 in
    background: {
      description: "White or off-white",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAF7"],
    },
    digital: {
      // Online renewal uploader
      pxMin: { width: 600, height: 600 },
      pxMax: { width: 1200, height: 1200 },
      square: true,
      fileSizeKb: { min: 54, max: 10240 },
      formats: ["jpg", "png", "heic", "heif"], // per travel.state.gov renewal uploader
    },
    dpiMin: 300,
    glasses: false, // not allowed since Nov 2016
    smileAllowed: "closed-mouth only",
    notes:
      "DV Lottery is a SEPARATE, stricter spec (square 600x600, JPEG only, " +
      "<= 240 KB) — do not reuse the passport preset for it. Same 2x2 spec " +
      "applies to US visa photos via DS-160.",
    source: "https://travel.state.gov/en/passports/apply/help/photos.html",
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  india: {
    id: "india",
    label: "India",
    documents: ["Passport (Passport Seva)"], // OCI is a DIFFERENT spec — see notes
    printMm: { width: 35, height: 45 }, // 4.5x3.5cm — official Passport Seva
    // Official Passport Seva photo-upload instructions: the FACE must cover
    // 80-85% of the photo. On a 45mm-high photo that is ~36-38mm chin-to-crown
    // (midpoint 37mm ≈ 82%). Confirmed 2026-06; do not lower without re-checking.
    headHeightMm: { min: 36, max: 38 },
    headPercentOfFrame: { min: 80, max: 85 },
    background: {
      description: "Plain white (strict — Passport Seva checks luminance)",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF"],
    },
    digital: {
      // Passport Seva online upload. Sources disagree on the cap (250/300/1024
      // KB); we honour the STRICTEST (≤250 KB), which satisfies all three at
      // once. pxMin drives output to the commonly-cited 630×810 target.
      pxMin: { width: 630, height: 810 },
      fileSizeKb: { min: 10, max: 250 }, // strictest of the disputed caps
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "discouraged",
    smileAllowed: "neutral preferred",
    notes:
      "Domestic Passport Seva has long specified a 4.5cm x 3.5cm (45x35mm) " +
      "printed photo; the widely-reported '51x51mm → 35x45mm' ICAO switch " +
      "(effective Sep 1, 2025) applies to Indian EMBASSIES/CONSULATES abroad " +
      "(NRI/VFS), NOT the domestic portal. CONFIRMED (official PSK 'DOs & DON'Ts " +
      "for Photograph'): printed photo 45x35mm, PLAIN WHITE background, dark " +
      "clothing, frontal full face, natural expression, eyes open, both ears " +
      "visible, head centred, no glasses glare, no shadows, head coverings only " +
      "for religious reasons. 'Photograph in computer print will NOT be accepted' " +
      "— the pasted print must be a real photo-paper lab print. " +
      "CONFIRMED online upload (official Passport Seva photo-upload PDF): image " +
      "must be EXACTLY 630x810 px and under 250 KB, JPEG. " +
      "Head coverage retargeted to the official 80-85% face (head 36-38mm). " +
      "OCI card is a DIFFERENT spec: 51x51mm square, LIGHT (not white) " +
      "background — handle separately. The Indian e-VISA (for foreigners) is " +
      "also different: square 350-1000px, white — see the india-visa spec.",
    advisory:
      "For the printed paper form, use a professional photo-lab print — " +
      "home/computer printouts are not accepted. For online upload we target " +
      "~630×810px and keep the file under the strictest reported limit (250 KB); " +
      "please confirm the current limit on passportindia.gov.in.",
    source: "https://www.passportindia.gov.in/",
    // Verified 2026-06 vs official Passport Seva PDFs: 45x35mm, white bg,
    // 630x810px / <250KB, computer-print rule, 80-85% face coverage — all match.
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  // Indian e-VISA (for FOREIGN nationals visiting India) — a SQUARE digital
  // photo, completely different from the 35x45mm Indian passport above.
  "india-evisa": {
    id: "india-evisa",
    label: "India",
    documents: ["Indian e-Visa (tourist / business / medical)"],
    // Square, digital-first. We use a 51x51mm (2x2in) physical equivalent so the
    // DPI→pixel math produces a compliant square; the binding rule is the pixels.
    printMm: { width: 51, height: 51 },
    // No official face-coverage % is published for the e-Visa; "full head, top of
    // hair to bottom of chin, centred" — inferred moderate band, headPercent omitted.
    headHeightMm: { min: 30, max: 36 },
    background: {
      description: "Plain light-coloured or white, no shadows, no border",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F0F0F0"],
    },
    digital: {
      square: true,
      pxMin: { width: 350, height: 350 },
      pxMax: { width: 1000, height: 1000 },
      fileSizeKb: { min: 10, max: 300 }, // PDF says ≤300KB; live form allows ≤1MB — 300 satisfies both
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "not allowed (no spectacles)",
    smileAllowed: "neutral, eyes open",
    notes:
      "Indian e-Visa photo (foreign visitors), CONFIRMED on the official " +
      "indianvisaonline.gov.in portal + VSS_IMAGE.pdf: SQUARE (height = width), " +
      "JPEG, 350x350 to 1000x1000 px, plain light-coloured or white background, " +
      "no border, no shadows, full face front view, eyes open, no spectacles, " +
      "head centred showing the full head. File size 10 KB minimum; the PDF caps " +
      "at 300 KB while the live form allows up to 1 MB — we target ≤300 KB to " +
      "satisfy both. No official face-coverage percentage is published. This is " +
      "DIFFERENT from the Indian passport (35x45mm) and the OCI card (square but " +
      "light — not white — background).",
    source: "https://indianvisaonline.gov.in/evisa/Registration",
    // Verified 2026-06 vs indianvisaonline.gov.in + official VSS_IMAGE.pdf.
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  schengen: {
    id: "schengen",
    label: "Schengen Visa",
    documents: ["Schengen Visa (all 29 states)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 }, // ~70-80% of frame; ~2/3 face coverage
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description:
        "Light, uniform. Light grey is the safest universal choice; white is " +
        "officially accepted by some states (e.g. France) but NOT by Switzerland, " +
        "which requires a grey background.",
      hex: "#DCDCDC", // ~RGB 220 light grey — safest
      acceptableHex: ["#DCDCDC", "#C8C8C8", "#FFFFFF"],
    },
    digital: {
      // No single EU-wide online cap; VFS portals vary. 300 DPI ~ 413x531.
      pxApprox300dpi: { width: 413, height: 531 },
      pxApprox600dpi: { width: 827, height: 1063 },
      fileSizeKb: null, // varies by VFS/consulate portal
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "strongly discouraged",
    smileAllowed: "neutral only",
    notes:
      "ICAO Doc 9303 standard (per EU Visa Code Reg. 810/2009 Art.13(4)). " +
      "Background colour is the main per-state variation: France officially " +
      "accepts white; Switzerland requires grey and rejects white; light grey " +
      "satisfies all. Default to light grey. 29 Schengen states as of 2026 " +
      "(Bulgaria & Romania joined 2025-01-01). Same 35x45mm applies to most EU " +
      "national passports too.",
    source:
      "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02009R0810-20200202",
    // Verified 2026-06 vs EU Visa Code + ICAO Doc 9303 + France-visas/Swiss SEM.
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  uk: {
    id: "uk",
    label: "United Kingdom",
    documents: ["Passport (HMPO)", "Most UK visas"],
    printMm: { width: 35, height: 45 }, // printed often quoted as 45x35
    headHeightMm: { min: 29, max: 34 }, // chin to crown
    headPercentOfFrame: { min: 65, max: 75 }, // head + top of shoulders
    background: {
      description: "Plain light grey or cream — NOT white (top UK rejection cause)",
      hex: "#EFEAD9", // light cream
      acceptableHex: ["#EFEAD9", "#DCDCDC"], // cream or light grey
    },
    digital: {
      // gov.uk online application ("digital photo code")
      pxMin: { width: 600, height: 750 },
      fileSizeKb: { min: 50, max: 10240 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove if possible",
    smileAllowed: "neutral only (biometric)",
    notes:
      "Do NOT default UK to a white background — light grey/cream only. " +
      "Online flow issues a 'digital photo code' the user enters on gov.uk.",
    source: "https://www.gov.uk/photos-for-passports",
    // Verified 2026-06 vs gov.uk/photos-for-passports/photo-requirements: 45x35mm,
    // head 29-34mm, cream/light-grey bg, 600x750px min, 50KB-10MB — all confirmed.
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  canada: {
    id: "canada",
    label: "Canada",
    // ⚠ SCOPED: printed PASSPORT requires a commercial photographer +
    // guarantor signature on the back — a self-serve tool CANNOT satisfy it.
    documents: ["Visa / Study / Work / Visitor", "PR / Express Entry", "Online passport renewal"],
    printMm: { width: 50, height: 70 }, // 50x70mm — passport print size (unique)
    visaPrintMm: { width: 35, height: 45 }, // Canada VISA/permit/PR uses 35x45mm
    headHeightMm: { min: 31, max: 36 }, // chin to crown
    background: {
      description: "Plain white or light-coloured, uniform, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAF7"],
    },
    digital: {
      // PR / Express Entry / online renewal digital photo
      fileSizeKb: { min: 240, max: 5120 }, // ⚠ verify per IRCC portal
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "allowed if no glare and eyes clearly visible",
    smileAllowed: "neutral only",
    notes:
      "⚠ DO NOT advertise this for the PRINTED Canadian PASSPORT. canada.ca " +
      "requires a commercial photographer's certification + guarantor " +
      "signature on the back, which a DIY tool cannot provide. Serve only: " +
      "Canada visa/permit (35x45mm), PR/Express Entry, and online passport " +
      "renewal (digital). Verify IRCC digital file-size caps before launch.",
    source:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html",
    verified: "gov",
    advisory:
      "Not for the printed Canadian PASSPORT (that requires a certified " +
      "photographer + guarantor signature on the back). Use this for Canada " +
      "visa/permit, PR/Express Entry, and online passport renewal (35×45mm).",
  },

  // ─────────────────────────────────────────────────────────────
  australia: {
    id: "australia",
    label: "Australia",
    documents: ["Passport (APO)", "Australian visa"],
    // Official AU passport photo is a RANGE: 35-40mm wide x 45-50mm high.
    // We target the common lower bound (35x45mm), within spec.
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 }, // chin to crown (face ~2/3 of photo)
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white or light grey, uniform, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#F0F0F0", "#DCDCDC"],
    },
    digital: {
      // Printed photos are standard for AU passport (endorsed by a guarantor).
      // Online/app renewal accepts a digital photo; caps not pinned here.
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove (not permitted unless for medical reasons)",
    smileAllowed: "neutral only",
    notes:
      "Australian passport photos are 35-40mm wide x 45-50mm high (we use " +
      "35x45mm) with the head 32-36mm chin-to-crown on a plain white or light " +
      "grey background. The PRINTED passport photo must be endorsed (signed) on " +
      "the back by your guarantor — this tool makes the compliant photo; you " +
      "still need the guarantor's signature. Verify current specs at " +
      "passports.gov.au before submitting.",
    source: "https://www.passports.gov.au/help/passport-photos",
    // Verified 2026-06 vs passports.gov.au: 35-40x45-50mm, head 32-36mm, white/
    // light-grey bg, guarantor endorses back of one photo. No official applicant
    // digital-upload spec exists (print-based process) — fileSizeKb stays null.
    verified: "gov",
    advisory:
      "For the printed Australian passport, your guarantor must endorse the back " +
      "of one photo in black pen — “This is a true photo of [full name]” — " +
      "and also sign section 11 of the form. This tool produces the compliant " +
      "image; the endorsement is added by hand after printing.",
  },

  // ─────────────────────────────────────────────────────────────
  // Study-abroad / Schengen destinations (O4). All ICAO 35x45mm; the
  // load-bearing per-country difference is background colour.
  // ─────────────────────────────────────────────────────────────
  germany: {
    id: "germany",
    label: "Germany",
    documents: ["Germany Schengen Visa", "National (D) Visa", "Residence permit"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description:
        "Neutral / light grey — Germany requires a single-colour light grey background and rejects white",
      hex: "#D3D3D3",
      acceptableHex: ["#D3D3D3", "#DCDCDC", "#C8C8C8"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 600,
    glasses: "not permitted unless medically required",
    smileAllowed: "neutral only (biometric)",
    notes:
      "ICAO biometric photo, 35x45mm, face 70-80% of the height (≈32-36mm chin to " +
      "crown). Germany is strict on the background: it must be a neutral / light " +
      "grey — pure white is commonly rejected. From the German Missions sample-photo " +
      "template (Auswärtiges Amt / Bundesdruckerei).",
    source:
      "https://www.germany.info/resource/blob/906790/6e3eee9fd4d86e16aaefe0e92d809332/dd-sample-photos-data.pdf",
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  france: {
    id: "france",
    label: "France",
    documents: ["France Schengen Visa", "Long-stay (VLS-TS) Visa"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description:
        "Plain light-coloured background; light grey is strongly preferred (pure white is often rejected in practice)",
      hex: "#D3D3D3",
      acceptableHex: ["#D3D3D3", "#DCDCDC", "#FFFFFF"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "strongly discouraged",
    smileAllowed: "neutral only (biometric)",
    notes:
      "ICAO biometric photo per France-Visas: 35x45mm (official width given as " +
      "35-40mm), face 32-36mm (70-80% of height), max 6 months old, plain " +
      "light-coloured background. Light grey is the safe choice.",
    source:
      "https://france-visas.gouv.fr/documents/d/france-visas/iso_iec_fv_visa_photograph_requirements_en",
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  italy: {
    id: "italy",
    label: "Italy",
    documents: ["Italy Schengen Visa", "National (D) Visa"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white background, colour photo, no frames",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAF7"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "not permitted unless medically required",
    smileAllowed: "neutral only (biometric)",
    notes:
      "Per the official Italy Visa Management Service: colour photo, 30x40mm or " +
      "35x45mm (we use 35x45mm), face 70-80% of the frame, on a WHITE background " +
      "with no frames, taken within the last 6 months.",
    source: "https://italyvms.com/photo-requirements/",
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  netherlands: {
    id: "netherlands",
    label: "Netherlands",
    documents: ["Netherlands Schengen Visa", "MVV / residence", "Dutch passport"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 26, max: 30 }, // chin to crown, ages 11+ (official)
    headPercentOfFrame: { min: 58, max: 67 },
    background: {
      description: "Plain, uniform light grey, light blue or white; no shadows",
      hex: "#D3D3D3",
      acceptableHex: ["#D3D3D3", "#DCDCDC", "#FFFFFF"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 400,
    glasses: "not permitted unless medically required",
    smileAllowed: "neutral only (biometric)",
    notes:
      "Per the official Dutch government portal: 35x45mm, colour, face 26-30mm " +
      "chin-to-crown (ages 11+), face width 16-20mm, plain light grey / light blue " +
      "/ white background, max 6 months old, min 400 DPI for prints.",
    source: "https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements",
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  ireland: {
    id: "ireland",
    label: "Ireland",
    documents: ["Irish passport (DFA)", "Ireland visa / study"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Completely plain light grey, cream or white; no shadows",
      hex: "#F5F5F0",
      acceptableHex: ["#F5F5F0", "#DCDCDC", "#FFFFFF"],
    },
    digital: {
      pxMin: { width: 715, height: 951 },
      fileSizeKb: null, // online: JPEG up to 9 MB, no published minimum
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove if possible",
    smileAllowed: "neutral only (biometric)",
    notes:
      "Per the Irish DFA Passport Service: print size 35x45mm up to 38x50mm, face " +
      "70-80% of the frame, plain light grey / cream / white background. Online " +
      "photo: JPEG, minimum 715x951 px, up to 9 MB; max 6 months old, no selfies.",
    source: "https://www.dfa.ie/passports/photo-guidelines/",
    verified: "gov",
  },
};

/**
 * Quick launch-readiness audit:
 *   us       → READY (gov-verified)
 *   canada   → READY for visa/PR/renewal only (gov-verified; passport print excluded)
 *   schengen → verify per-state background defaults
 *   uk       → re-check gov.uk background shade + digital caps
 *   india    → AVAILABLE with caveats: print spec confirmed; online upload
 *              caps unconfirmed, so we target the strictest reported limit
 *              (≤250KB @ ~630×810) and show an advisory (see india.advisory).
 */
// India first — primary market (easyphoto.in). Order drives the hero chips,
// home grid, footer and sitemap. (NOTE: India's online-upload specs are still
// the inferred/strictest-cap values — see india.notes — re-verify when possible.)
export const LAUNCH_ORDER = [
  "india",
  "us",
  "canada",
  "uk",
  "australia",
  "schengen",
  "germany",
  "france",
  "italy",
  "netherlands",
  "ireland",
];

/**
 * Hard production gate — countries whose specs are too uncertain to produce
 * any usable output. Currently empty: India was un-gated once its print spec
 * was officially confirmed and its online output pinned to the strictest
 * interpretation. Countries with lesser caveats use `spec.advisory` (a
 * non-blocking note) instead of this hard block.
 */
export const PRODUCTION_BLOCKED: string[] = [];

export function isProductionReady(spec: CountrySpec): boolean {
  return !PRODUCTION_BLOCKED.includes(spec.id);
}

export function getSpec(country: string): CountrySpec | undefined {
  return COUNTRY_SPECS[country];
}

/**
 * The print size the tool actually PRODUCES.
 *
 * Canada's printed passport (50×70mm) is unsupported (it needs a commercial
 * photographer's certification + guarantor signature a DIY tool can't provide),
 * so we serve its visa/PR/renewal format (35×45mm). For every other country
 * this is just `printMm`. Derived only — the sacred spec data is untouched.
 */
export function effectivePrintMm(spec: CountrySpec): Dimensions {
  return spec.visaPrintMm ?? spec.printMm;
}

/** A spec whose printMm reflects what the tool produces (see effectivePrintMm). */
export function renderSpec(spec: CountrySpec): CountrySpec {
  const eff = effectivePrintMm(spec);
  if (eff === spec.printMm) return spec;
  return { ...spec, printMm: eff };
}
