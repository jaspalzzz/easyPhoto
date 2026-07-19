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
 *   "aggregator" = sourced from reputable third-party guides; should be
 *                  re-confirmed against the primary gov portal when possible
 *   "conditional" = some values are retained for a separately scoped workflow
 *                   or tool compatibility and must not be presented as universal
 *
 * GOLDEN RULE: a wrong number here = a rejected photo = a dead reputation.
 * Treat this file as the product. Re-verify on a schedule; specs change quietly.
 *
 * Last verified: 2026-06-04
 *
 * NOTE: This is a faithful TypeScript port of the verified JS foundation.
 * The values are sacred — types were added, numbers were NOT touched.
 */

export type Verified = "gov" | "aggregator" | "conditional";

/** Date attached to country records marked `gov` in this registry review. */
export const COUNTRY_SPECS_VERIFIED_ON = "2026-06-04";

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
    documents: [
      "Passport — child below 4 (printed photo)",
      "Passport — overseas ICAO photograph",
    ], // Ordinary adult domestic applicants are photographed at PSK/POPSK.
    printMm: { width: 35, height: 45 }, // Confirmed for the below-4 printed-photo exception.
    // The official below-4 and overseas ICAO guidance specifies 80-85% face
    // coverage. On a 45mm-high frame that is ~36-38mm chin-to-crown.
    headHeightMm: { min: 36, max: 38 },
    headPercentOfFrame: { min: 80, max: 85 },
    background: {
      description: "Plain white (below-4 print and overseas ICAO guidance)",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF"],
    },
    digital: {
      // 630x810 is confirmed only in the overseas Indian-mission ICAO guidance.
      // The 10-250 KB band is retained for backwards-compatible export behavior;
      // no current official source was found for that band in the ordinary
      // domestic fresh/reissue workflow. Do not label it a PSK/POPSK upload rule.
      pxMin: { width: 630, height: 810 },
      fileSizeKb: { min: 10, max: 250 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "discouraged",
    smileAllowed: "neutral preferred",
    notes:
      "Ordinary adult fresh/reissue applicants in India do not upload or carry a " +
      "passport photograph: Passport Seva captures the photograph and biometrics " +
      "at the PSK/POPSK. A recent 45x35mm white-background print is required only " +
      "for a child below four. Overseas Indian missions use a separate ICAO " +
      "workflow; their current guidance specifies a 630x810px colour image, white " +
      "background and 80-85% face coverage for capture or upload. No live official " +
      "source was found for a 10-250 KB ordinary domestic Passport Seva upload, so " +
      "that export band is conditional and retained only for compatibility. OCI " +
      "and Indian e-Visa use separate square-photo specifications.",
    advisory:
      "Ordinary adults are photographed at the PSK/POPSK; do not upload or carry " +
      "a photo unless your specific workflow says otherwise. The 45×35mm white " +
      "print applies to children below four. The 630×810px export is for overseas " +
      "ICAO guidance; the stored 10–250 KB band is unverified.",
    source:
      "https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf",
    verified: "conditional",
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
      "renewal (digital). Re-confirm IRCC digital file-size caps on the official portal.",
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
      "the back by your guarantor — this tool prepares the selected dimensions and background; you " +
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
      "and also sign section 11 of the form. This tool prepares the selected " +
      "image dimensions and background; the endorsement is added by hand after printing.",
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

  // ─────────────────────────────────────────────────────────────
  uae: {
    id: "uae",
    label: "UAE",
    documents: ["UAE visit / tourist visa", "Employment & residence visa", "Emirates ID"],
    printMm: { width: 43, height: 55 },
    // ICP's official ICAO guide mandates face = 70–80% of the photo; for the
    // 43×55 visa print that band is ≈39–44mm chin to crown.
    headHeightMm: { min: 39, max: 44 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white (ICP guide: plain light-coloured), no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 508, height: 650 },
      fileSizeKb: null, // limits vary by channel (ICP / GDRFA / typing centre)
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "allowed if eyes clearly visible — no tint, no glare",
    smileAllowed: "neutral, mouth closed",
    notes:
      "UAE visa/residence photo: 43x55mm on plain white — the size used across " +
      "visit, employment and residence channels. The ICP federal photo guide " +
      "(ICAO) confirms: face 70-80% of the photo, max 6 months old, plain " +
      "light-coloured background, neutral expression, glasses only without tint " +
      "or glare, head covering for religious reasons only with the full face " +
      "visible. Print size is the channel convention — confirm with your typing " +
      "centre / portal before submitting.",
    source: "https://icp.gov.ae/wp-content/uploads/2021/11/icao_english.pdf",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  "saudi-evisa": {
    id: "saudi-evisa",
    label: "Saudi Arabia",
    documents: ["Saudi eVisa (tourist)", "Enjaz visa application"],
    // Square, digital-first (like the Indian e-Visa): a 51×51mm physical
    // equivalent makes the DPI→pixel math produce a compliant square; the
    // binding rule is the official 200×200 px upload.
    printMm: { width: 51, height: 51 },
    headHeightMm: { min: 36, max: 41 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no patterns, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA"],
    },
    digital: {
      square: true,
      px: { width: 200, height: 200 },
      fileSizeKb: { min: 5, max: 100 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided (eyes must be clearly visible)",
    smileAllowed: "neutral, facing straight at the camera",
    notes:
      "Saudi eVisa photo, CONFIRMED on the official visa.visitsaudi.com photo " +
      "specifications page: exactly 200x200 px, 5-100 KB, white background with " +
      "no pattern or shadows, face 70-80% of the photo, head square to the " +
      "camera with ears and cheeks visible, max 6 months old, head coverings " +
      "for religious reasons only. The consulate (paper) channel uses a 4x6cm " +
      "print — this page targets the eVisa upload.",
    source: "https://visa.visitsaudi.com/Home/PhotoSpecifications",
    verified: "gov",
  },

  // ─────────────────────────────────────────────────────────────
  bahrain: {
    id: "bahrain",
    label: "Bahrain",
    documents: ["Bahrain visa", "Bahrain residence permit (CPR)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or patterns",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided (eyes must be clearly visible)",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Bahrain visa / CPR photo: 35×45 mm on plain white background, neutral " +
      "expression, taken within 6 months. Confirm current requirements with the " +
      "Nationality, Passports & Residence Affairs (NPRA) portal or your visa agent.",
    source: "https://www.npra.gov.bh",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  kuwait: {
    id: "kuwait",
    label: "Kuwait",
    documents: ["Kuwait visa", "Kuwait residence permit (Civil ID)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or patterns",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided (eyes must be clearly visible)",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Kuwait visa / Civil ID photo: 35×45 mm on plain white background, neutral " +
      "expression, head covering for religious reasons only with full face visible. " +
      "Confirm requirements with the Kuwait Ministry of Foreign Affairs or your " +
      "visa centre before submitting.",
    source: "https://e.gov.kw",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  qatar: {
    id: "qatar",
    label: "Qatar",
    documents: ["Qatar visa", "Qatar Residence Permit (QID)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or patterns",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided (eyes must be clearly visible)",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Qatar visa / QID photo: 35×45 mm on plain white background, neutral " +
      "expression, taken within 6 months. For e-visas and QID applications verify " +
      "current photo requirements on the Qatar Ministry of Interior (MOI) portal.",
    source: "https://portal.moi.gov.qa",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  oman: {
    id: "oman",
    label: "Oman",
    documents: ["Oman visa", "Oman residence permit"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or patterns",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided (eyes must be clearly visible)",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Oman visa / residence photo: 35×45 mm on plain white background, neutral " +
      "expression, taken within 6 months. Confirm requirements via the Royal Oman " +
      "Police e-services portal (rop.gov.om) or your visa processing agent.",
    source: "https://www.rop.gov.om",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  pakistan: {
    id: "pakistan",
    label: "Pakistan",
    documents: ["Pakistani passport (DGIP online renewal)", "NICOP / POC (NADRA)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or patterns",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null, // DGIP online portal accepts up to 5 MB
      formats: ["jpg"],
    },
    dpiMin: 600,
    glasses: "not allowed",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Pakistani passport photo: 35x45mm (the DGIP online-renewal portal states " +
      "45mm high x 35mm wide, professionally taken, upload up to 5 MB, 600 DPI " +
      "scan guidance) on a plain white background. Head band uses the ICAO " +
      "70-80% convention. In-country first-time applications capture biometrics " +
      "live at the office; the upload path serves online renewals (onlinemrp)." ,
    source: "https://onlinemrp.dgip.gov.pk/photo-requirements/",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  nepal: {
    id: "nepal",
    label: "Nepal",
    documents: ["Nepali passport (MRP/e-passport form photo)", "Government forms"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 31, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F5"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Nepali MRP/passport-size photo: 35x45mm on plain white, neutral " +
      "expression, taken within 6 months — the standard photo Nepali passport " +
      "pre-enrolment and government forms expect. Numbers are consistent across " +
      "reputable guides but not yet confirmed against a single official spec " +
      "page — re-check your application's notice before submitting.",
    source: "https://nepalpassport.gov.np",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  spain: {
    id: "spain",
    label: "Spain",
    documents: ["Spain Schengen Visa", "National (D) visa"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain light grey or white, even lighting, no shadows",
      hex: "#DCDCDC",
      acceptableHex: ["#DCDCDC", "#D3D3D3", "#FFFFFF"],
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
      "Spain Schengen-visa photo: the standard ICAO 35x45mm biometric photo, " +
      "face 70-80% of the height, on a plain light background (grey is the safe " +
      "default across Schengen consulates). NOTE: Spain's domestic passport/DNI " +
      "uses a smaller 26x32mm photo — that is a different document; this page " +
      "is for the visa.",
    source: "https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Schengen-visas.aspx",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  portugal: {
    id: "portugal",
    label: "Portugal",
    documents: ["Portugal Schengen Visa", "National (D) visa / residence"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain light grey or white, even lighting, no shadows",
      hex: "#DCDCDC",
      acceptableHex: ["#DCDCDC", "#D3D3D3", "#FFFFFF"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 531 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "not permitted (Portugal rejects glasses in ID photos)",
    smileAllowed: "neutral only (biometric)",
    notes:
      "Portugal Schengen-visa photo: standard ICAO 35x45mm biometric photo, " +
      "face 70-80%, plain light background. Portugal is notably strict on " +
      "glasses — remove them even if prescription. The Portuguese Citizen Card " +
      "uses a smaller 30x40mm photo — a different document from the visa.",
    source: "https://vistos.mne.gov.pt/en/short-stay-visas-schengen",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  china: {
    id: "china",
    label: "China",
    documents: ["China visa (tourist L / business M)"],
    printMm: { width: 33, height: 48 },
    headHeightMm: { min: 28, max: 33 },
    headPercentOfFrame: { min: 58, max: 69 },
    background: {
      description: "Plain white, no shadows or pattern",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA"],
    },
    digital: {
      pxMin: { width: 354, height: 420 },
      pxMax: { width: 472, height: 560 },
      fileSizeKb: { min: 40, max: 120 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided — no tint, no glare, eyes fully visible",
    smileAllowed: "neutral, mouth closed",
    notes:
      "China visa photo: a distinctive 33x48mm (not the usual 35x45), white " +
      "background, head 28-33mm chin-to-crown. Digital upload (COVA / consulate): " +
      "JPEG, 354x420 to 472x560 px, 40-120 KB. Numbers are consistent across " +
      "reputable guides — confirm on the consulate / COVA portal before submitting.",
    source: "https://www.visaforchina.cn",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  singapore: {
    id: "singapore",
    label: "Singapore",
    documents: ["Singapore visa (ICA)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA"],
    },
    digital: {
      px: { width: 400, height: 514 },
      fileSizeKb: null, // online: JPEG, ≤60 KB (see notes)
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Singapore visa photo (ICA): 35x45mm on plain white, taken within 3 " +
      "months. Online upload is 400x514 px JPEG, 60 KB or less. No head " +
      "coverings except for religious reasons. Confirm on the ICA portal.",
    source: "https://www.ica.gov.sg",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  "new-zealand": {
    id: "new-zealand",
    label: "New Zealand",
    documents: ["New Zealand visa / NZeTA"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain light grey, off-white or cream; no shadows",
      hex: "#F5F5F0",
      acceptableHex: ["#F5F5F0", "#DCDCDC", "#FFFFFF"],
    },
    digital: {
      pxMin: { width: 900, height: 1200 },
      pxMax: { width: 2250, height: 3000 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, eyes open, looking at camera",
    notes:
      "New Zealand visa / NZeTA photo: 35x45mm print, plain light/neutral " +
      "background (light grey, off-white or cream). Online: JPEG, 900x1200 to " +
      "2250x3000 px, max 6 months old. Immigration NZ does not accept photos " +
      "altered by AI editing tools. Confirm on immigration.govt.nz.",
    source: "https://www.immigration.govt.nz",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  japan: {
    id: "japan",
    label: "Japan",
    documents: ["Japan visa (MOFA)"],
    // Square; consulates also accept 35x45 and 2x2in, but 45x45 is the
    // most-cited MOFA size. The square print + the pixels are the binding rule.
    printMm: { width: 45, height: 45 },
    headHeightMm: { min: 34, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or pattern",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA"],
    },
    digital: {
      square: true,
      pxApprox300dpi: { width: 531, height: 531 },
      fileSizeKb: null, // ≤120 KB where uploaded digitally (see notes)
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Japan visa photo (MOFA): 45x45mm square on plain white, taken within 6 " +
      "months, two prints required for paper applications. Some consulates also " +
      "accept 35x45mm or 2x2 inch — check yours. Digital uploads are JPEG, " +
      "typically 120 KB or less.",
    source: "https://www.mofa.go.jp",
    verified: "aggregator",
  },

  // ─────────────────────────────────────────────────────────────
  malaysia: {
    id: "malaysia",
    label: "Malaysia",
    documents: ["Malaysia visa / eVisa"],
    printMm: { width: 35, height: 50 },
    headHeightMm: { min: 30, max: 35 },
    headPercentOfFrame: { min: 60, max: 70 },
    background: {
      description: "Plain white (light grey / cream also accepted), no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA", "#F5F5F0"],
    },
    digital: {
      pxApprox300dpi: { width: 413, height: 591 },
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, full front view",
    notes:
      "Malaysia visa / eVisa photo: a distinctive 35x50mm, plain white " +
      "background (light grey or cream sometimes accepted), head 30-35mm, face " +
      "60-70% of the frame. A dark-coloured shirt is recommended. Confirm on the " +
      "official Malaysia eVisa portal before submitting.",
    source: "https://malaysiavisa.imi.gov.my",
    verified: "aggregator",
  },
};

/**
 * Quick launch-readiness audit:
 *   us       → READY (gov-verified)
 *   canada   → READY for visa/PR/renewal only (gov-verified; passport print excluded)
 *   schengen → verify per-state background defaults
 *   uk       → re-check gov.uk background shade + digital caps
 *   india    → CONDITIONAL: domestic adults use PSK/POPSK capture; 45x35mm is
 *              the below-four print; 630x810 belongs to overseas ICAO guidance;
 *              stored KB limits remain unverified (see india.advisory).
 */
// India first — primary market (easyphoto.in). Order drives the hero chips,
// home grid, footer and sitemap. Do not surface the compatibility KB band as an
// ordinary domestic Passport Seva upload requirement.
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
  "uae",
  "saudi-evisa",
  "bahrain",
  "kuwait",
  "qatar",
  "oman",
  "pakistan",
  "nepal",
  "spain",
  "portugal",
  "china",
  "singapore",
  "new-zealand",
  "japan",
  "malaysia",
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
