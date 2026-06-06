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
    printMm: { width: 35, height: 45 }, // ICAO standard, effective Sep 2025
    // ICAO Doc 9303 (adopted by India Sep 2025) = head 70-80% of frame height =
    // 31.5-36mm on a 45mm photo. The earlier aggregator value 36-38mm
    // contradicted this same 70-80% band (gave ~82%); 32-36 is self-consistent.
    // Re-confirm the exact mm at passportindia.gov.in.
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
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
      "India switched to ICAO 35x45mm from Sep 1, 2025 (was 51x51mm). " +
      "CONFIRMED (official PSK form 'DOs & DON'Ts for Photograph'): printed " +
      "photo is 4.5cm x 3.5cm (45x35mm), PLAIN WHITE background, dark clothing, " +
      "frontal full face, natural expression, eyes open, both ears visible, head " +
      "centred, no glasses glare, no shadows, head coverings only for religious " +
      "reasons. NOTE: 'Photograph in computer print will NOT be accepted' — the " +
      "pasted print must be a real photo-paper lab print, so a home/inkjet " +
      "printout may be rejected (advise a photo lab). " +
      "ONLINE upload caps are not officially confirmed: sources report 250KB / " +
      "300KB / 1MB, so we target the commonly-cited 630x810 size and keep the " +
      "file under the STRICTEST reported limit (≤250KB), which satisfies all " +
      "three. Head height set to the ICAO 32-36mm (70-80% of frame) the country " +
      "adopted, not the inconsistent aggregator 36-38mm. Re-confirm the online " +
      "pixel/KB limits at passportindia.gov.in. OCI card is a DIFFERENT spec: " +
      "51x51mm square, LIGHT (not white) background — handle separately.",
    advisory:
      "For the printed paper form, use a professional photo-lab print — " +
      "home/computer printouts are not accepted. For online upload we target " +
      "~630×810px and keep the file under the strictest reported limit (250 KB); " +
      "please confirm the current limit on passportindia.gov.in.",
    source: "https://www.passportindia.gov.in/",
    verified: "aggregator", // digital upload caps + head height STILL UNCONFIRMED
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
        "Light, uniform. Light grey is the safest universal choice; " +
        "pure white is risky for France/Switzerland.",
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
      "ICAO Doc 9303 standard. Background colour is the main per-state " +
      "variation: default to light grey, offer white as a secondary option. " +
      "Same 35x45mm applies to most EU national passports too.",
    source: "https://schengenvisainfo.com/photo/",
    verified: "aggregator",
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
    verified: "aggregator",
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
export const LAUNCH_ORDER = ["us", "canada", "schengen", "uk", "india"];

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
