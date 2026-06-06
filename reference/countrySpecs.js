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
 */

export const COUNTRY_SPECS = {
  // ─────────────────────────────────────────────────────────────
  us: {
    id: "us",
    label: "United States",
    documents: ["Passport", "Passport Card", "Visa (DS-160)"], // same spec across these
    printMm: { width: 51, height: 51 },          // 2 x 2 inch, square
    headHeightMm: { min: 25, max: 35 },          // chin to top of head (1 to 1-3/8 in)
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
    glasses: false,                              // not allowed since Nov 2016
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
    documents: ["Passport (Passport Seva)"],     // OCI is a DIFFERENT spec — see notes
    printMm: { width: 35, height: 45 },          // ICAO standard, effective Sep 2025
    headHeightMm: { min: 36, max: 38 },          // notably LARGE face — top rejection cause
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white (strict — Passport Seva checks luminance)",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF"],
    },
    digital: {
      // Passport Seva online upload — FILE SIZE CAP IS DISPUTED across sources
      px: { width: 630, height: 810 },           // commonly cited target
      fileSizeKb: { min: 10, max: 250 },         // ⚠ sources vary: 250 / 300 / 1024 KB
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "discouraged",
    smileAllowed: "neutral preferred",
    notes:
      "⚠ HIGHEST-RISK ENTRY. India switched to ICAO 35x45mm from Sep 1, 2025 " +
      "(was 51x51mm). The Passport Seva file-size cap is reported " +
      "inconsistently (250KB / 300KB / 1MB) across third-party sources. " +
      "VERIFY pixel + file-size limits DIRECTLY at passportindia.gov.in " +
      "before enabling India in production. OCI card is a DIFFERENT spec: " +
      "51x51mm square, LIGHT (not white) background — handle separately.",
    source: "https://www.passportindia.gov.in/",
    verified: "aggregator", // PRIMARY SOURCE CHECK STILL REQUIRED
  },

  // ─────────────────────────────────────────────────────────────
  schengen: {
    id: "schengen",
    label: "Schengen Visa",
    documents: ["Schengen Visa (all 29 states)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },          // ~70-80% of frame; ~2/3 face coverage
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description:
        "Light, uniform. Light grey is the safest universal choice; " +
        "pure white is risky for France/Switzerland.",
      hex: "#DCDCDC",                            // ~RGB 220 light grey — safest
      acceptableHex: ["#DCDCDC", "#C8C8C8", "#FFFFFF"],
    },
    digital: {
      // No single EU-wide online cap; VFS portals vary. 300 DPI ~ 413x531.
      pxApprox300dpi: { width: 413, height: 531 },
      pxApprox600dpi: { width: 827, height: 1063 },
      fileSizeKb: null,                          // varies by VFS/consulate portal
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
    printMm: { width: 35, height: 45 },          // printed often quoted as 45x35
    headHeightMm: { min: 29, max: 34 },          // chin to crown
    headPercentOfFrame: { min: 65, max: 75 },    // head + top of shoulders
    background: {
      description: "Plain light grey or cream — NOT white (top UK rejection cause)",
      hex: "#EFEAD9",                            // light cream
      acceptableHex: ["#EFEAD9", "#DCDCDC"],     // cream or light grey
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
    printMm: { width: 50, height: 70 },          // 50x70mm — passport print size (unique)
    visaPrintMm: { width: 35, height: 45 },      // Canada VISA/permit/PR uses 35x45mm
    headHeightMm: { min: 31, max: 36 },          // chin to crown
    background: {
      description: "Plain white or light-coloured, uniform, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAF7"],
    },
    digital: {
      // PR / Express Entry / online renewal digital photo
      fileSizeKb: { min: 240, max: 5120 },       // ⚠ verify per IRCC portal
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
  },
};

/**
 * Quick launch-readiness audit:
 *   us       → READY (gov-verified)
 *   canada   → READY for visa/PR/renewal only (gov-verified; passport print excluded)
 *   schengen → verify per-state background defaults
 *   uk       → re-check gov.uk background shade + digital caps
 *   india    → BLOCKED until passportindia.gov.in file-size/pixel caps confirmed
 */
export const LAUNCH_ORDER = ["us", "canada", "schengen", "uk", "india"];
