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

/**
 * Whether the application accepts a digital photograph at all.
 *
 * Most records carry `fileSizeKb: null` because the authority publishes pixel
 * dimensions but no KB band — that is a missing figure, not a missing upload,
 * and those pages should still answer "what file size do I need?" (with "the
 * limit varies by portal, check your form"). Only a genuinely print-only
 * application has no pixel figures at all: an Irish visa takes two printed
 * photographs with details written on the back and nothing is uploaded.
 *
 * Checking `fileSizeKb` alone conflates the two and silently strips the upload
 * question from 17 countries that do have one.
 */
/**
 * The spec a maker page hands to the tool for a given document kind.
 *
 * Advisories on records that also cover a passport are written about the
 * passport — Australia's guarantor rule, India's PSK capture — so they are
 * dropped on a visa page. Records that only ever describe a visa carry
 * visa-scoped advisories, and dropping those hid the warning on the one page
 * the applicant lands on.
 *
 * This lives here, rather than inline in the page, so the behaviour can be
 * asserted directly. A test that re-implements the predicate and then filters
 * by it proves nothing: it passes whatever the page does.
 */
export function specForDocumentKind(
  spec: CountrySpec,
  kind: "passport" | "visa",
): CountrySpec {
  const alsoCoversAPassport = spec.documents.some((d) => /passport/i.test(d));
  return kind === "visa" && alsoCoversAPassport
    ? { ...spec, advisory: undefined }
    : spec;
}

/** Human phrasing for an upload limit that may be a ceiling with no floor. */
export function formatFileSizeKb(band: FileSizeKb): string {
  return band.min === undefined
    ? `under ${band.max} KB`
    : `${band.min}–${band.max} KB`;
}

export function acceptsDigitalUpload(spec: CountrySpec): boolean {
  const d = spec.digital;
  return Boolean(
    d.fileSizeKb ||
      d.px ||
      d.pxMin ||
      d.pxMax ||
      d.pxApprox300dpi ||
      d.pxApprox600dpi,
  );
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Range {
  min: number;
  max: number;
}

/**
 * An upload size limit.
 *
 * `min` is optional because most authorities publish only a ceiling. Singapore's
 * visa guide says "Image file size must be less than 60Kbytes" and states no
 * floor; recording `{min: 10, max: 60}` presented an invented 10 KB as though
 * ICA required it.
 */
export interface FileSizeKb {
  min?: number;
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
  fileSizeKb: FileSizeKb | null;
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
  /**
   * Practical points about THIS application, from the source in `source` or
   * from the research recorded in `notes`.
   *
   * The country maker pages were a shared frame around a different set of
   * numbers — a median of about 100 words of their own inside 500 visible.
   * These are what a reader of that specific application needs and cannot get
   * from the figures alone. Never generalise one authority's rule onto another.
   */
  applicationNotes?: readonly string[];
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
      // The overseas ICAO guidance specifies 630x810 rather than a floor, and
      // the DPI path produced 631x811 — over by a pixel on both axes, which
      // fails an exact check and gains nothing against a minimum. Recording it
      // as exact satisfies both readings.
      px: { width: 630, height: 810 },
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
      description: "Any plain light colour — light grey, cream, ivory or white",
      hex: "#EFEAD9", // light cream — also suits Schengen consulates wanting grey
      // White belongs here: HMPO names "different shades of white (cream, ivory
      // or vanilla) and light grey". Omitting it made the data contradict the
      // description, which is the contradiction a phrasing guard cannot see.
      acceptableHex: ["#EFEAD9", "#DCDCDC", "#FFFFFF", "#FAFAFA"]
    },
    digital: {
      // gov.uk online application ("digital photo code")
      pxMin: { width: 600, height: 750 },
      fileSizeKb: { min: 50, max: 10240 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    // HMPO allows frames over the eye socket provided both eyes stay visible;
    // "not permitted / medical exemption" is the US rule, not the UK's.
    glasses: "allowed if both eyes stay clearly visible and free of glare",
    smileAllowed: "neutral only (biometric)",
    notes:
      "⚠ CORRECTION: this record previously said white was rejected. HM Passport " +
      "Office's published standard accepts a photo taken against ANY plain light " +
      "background, giving 'different shades of white (cream, ivory or vanilla) " +
      "and light grey' as examples. White is acceptable. Light grey is used as " +
      "the default here because it also satisfies Schengen states that do reject " +
      "white, not because the UK requires it. Separately, the gov.uk digital " +
      "service tells customers the photo must be 'unedited', while HMPO's " +
      "examiner standard allows a digitally edited background provided the edit " +
      "does not affect the image of the customer. The two are not identical, so " +
      "do not claim either automatic acceptance or automatic rejection for a " +
      "replaced background: an unedited capture against a suitable wall is the " +
      "safer route for the online code. " +
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
    // ⚠ SCOPED to temporary residence only. `documents` is rendered to users as
    // "Prepared for the published requirements of: …", so it must list only the
    // applications these figures actually cover. PR and Express Entry specify a
    // pixel-based upload rather than this millimetre size, and the printed
    // passport booklet is 50x70mm requiring a commercial photographer's
    // certification — neither belongs in this list.
    documents: ["Visitor visa", "Study permit", "Work permit"],
    printMm: { width: 50, height: 70 }, // 50x70mm — passport print size (unique)
    visaPrintMm: { width: 35, height: 45 }, // Canada VISA/permit/PR uses 35x45mm
    headHeightMm: { min: 31, max: 36 }, // chin to crown
    background: {
      description: "Plain white or light-coloured, uniform, no shadows",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAF7"],
    },
    digital: {
      // ⚠ No band. The IRCC temporary-resident specification describes TWO
      // PRINTED photographs and publishes no upload limit, so the 240 KB-5 MB
      // figure previously here was unsourced. Downgrading the record's flag was
      // not enough: the page still printed the range, put it in FAQ schema, and
      // compressed exports against a 5 MB cap that nobody set.
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "allowed if no glare and eyes clearly visible",
    smileAllowed: "neutral only",
    notes:
      "⚠ DO NOT advertise this for the PRINTED Canadian PASSPORT. canada.ca " +
      "requires a commercial photographer's certification + guarantor " +
      "signature on the back, which a DIY tool cannot provide. The 35×45mm " +
      "figure here is the IRCC temporary-residence specification — visitor " +
      "visa, study permit and work permit. Permanent residence, Express Entry " +
      "and passport renewal are separate processes that publish their own " +
      "photo instructions; do not assume this size or file-size band applies " +
      "to them. Re-confirm the caps on whichever IRCC portal you are filing on.",
    // Was pointed at the PASSPORT photo page while `documents` lists visitor,
    // study and work — the citation backed a different application from the one
    // the page claims to serve.
    source:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/temporary-resident-visa-application-photograph-specifications.html",
    verified: "conditional",
    advisory:
      "Not for the printed Canadian PASSPORT (that requires a certified " +
      "photographer + guarantor signature on the back). The 35×45mm size here " +
      "is IRCC's temporary-residence specification — visitor visa, study " +
      "permit, work permit. If you are filing for permanent residence, " +
      "Express Entry or a passport renewal, check that application's own " +
      "photo instructions before you use this crop.",
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
    applicationNotes: [
      "Germany is the Schengen state that genuinely refuses a white background. Its published sample sheet asks for a single-colour LIGHT GREY backdrop, so a photograph prepared to the Indian or American white standard is the wrong colour here even though the 35x45mm frame is identical. This is the opposite of the UK, which accepts shades of white — do not carry one rule across to the other.",
      "The frame and head band follow the EU Visa Code that every Schengen state shares: 35x45mm with the head 32-36mm chin to crown, roughly 70-80% of the image. What distinguishes a German application is the background colour and the insistence that it be a single flat tone with no gradient from a shadow behind you.",
      "The same sheet covers the national (D) visa and residence permit routes as well as the Schengen visa, so one correctly prepared photograph serves all three. Confirm against the mission handling your application before printing.",
      "If your appointment is at a visa application centre rather than the mission itself, the centre may photograph you on site. Bringing a prepared print is still worth doing as a fallback, but ask when you book — paying for prints you do not need is avoidable.",
      "German missions and their visa centres publish sample photographs alongside the written rule, and comparing your result against the sample is quicker than re-reading the specification. If your photograph looks unlike the sample in head size or background tone, it will read that way to an examiner too.",
    ]
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
    applicationNotes: [
      "France's own guidance points at the ISO/IEC photograph standard rather than publishing a separate French rule, so the framing is the common Schengen one: 35x45mm, head 32-36mm chin to crown, neutral expression, no glasses glare.",
      "On background, France is more permissive than Germany and less than the UK: a plain light colour is accepted and white is not formally banned, but light grey is the safer choice in practice because it survives inspection at any Schengen consulate, including the ones that do refuse white. If you are applying to several Schengen states, prepare grey once rather than white and re-do it.",
      "A long-stay VLS-TS application uses the same photograph specification as the short-stay Schengen visa, so the two do not need different images.",
    ]
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
      "Per the Italy Visa Management Service, the outsourced visa application " +
      "centre operator — NOT an Italian government host: colour photo, 30x40mm " +
      "or 35x45mm (we use 35x45mm), face 70-80% of the frame, on a WHITE " +
      "background with no frames, taken within the last 6 months. Italy is a " +
      "Schengen state, so the binding rule is the EU Visa Code; re-confirm " +
      "against the consulate handling your application.",
    source: "https://italyvms.com/photo-requirements/",
    // The operator publishes the figures, but it is a contractor, not the
    // issuing authority. `gov` would overstate what this source proves.
    verified: "aggregator",
    applicationNotes: [
      "The figures here come from the outsourced visa application centre operator rather than an Italian government host, which is why this record is not marked government-confirmed. Italy is a Schengen state, so the binding rule is the EU Visa Code and the ICAO framing it points to, and the centre's sheet is a restatement of that rather than a separate Italian standard.",
      "That sheet gives 30x40mm or 35x45mm and this tool uses 35x45mm, which is the size accepted across Schengen. Face 70-80% of the frame, white background, no borders or frames, taken within the last six months.",
      "Because a private operator publishes the figures, re-confirm against the consulate handling your application before printing — particularly if your appointment is not booked through that centre.",
      "If you are applying for a Schengen visa through Italy but travelling to several member states, the same photograph serves the whole application — the visa is issued by the state you spend most time in, not by each one separately.",
    ]
  },

  // ─────────────────────────────────────────────────────────────
  netherlands: {
    id: "netherlands",
    label: "Netherlands",
    // ⚠ The Netherlands is the exception among Schengen states in this registry:
    // its own Schengen visa checklist tells applicants to bring "a photo that
    // meets DUTCH requirements", so the national 26-30mm chin-to-crown figure
    // governs a visa application here, NOT the wider band used for Germany,
    // France, Spain and Portugal. Do not "harmonise" this to the others.
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
      "chin-to-crown (ages 11+), face width 16-20mm, plain light grey / light " +
      "blue / white background, max 6 months old, min 400 DPI for prints. The " +
      "Netherlands applies these national criteria to Schengen visa " +
      "applications submitted to it - its own visa checklist asks for a photo " +
      "meeting Dutch requirements - so the head here is deliberately smaller " +
      "than on our German or French visa pages. If you apply through an " +
      "external service provider, a digital photo is taken at the appointment.",
    source: "https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements",
    verified: "gov",
    applicationNotes: [
      "The Netherlands applies its OWN national photo criteria to a Schengen visa submitted to it, which is unusual: its visa checklist tells applicants to bring a photo meeting Dutch requirements rather than a generic Schengen one. That means a smaller head than our German or French pages show — 26 to 30 mm chin to crown for ages 11 and over.",
      "Background may be light grey, light blue or white, and prints want a minimum of 400 DPI. If you apply through an external service provider, a digital photo is taken at your appointment and you do not need to bring one.",
      "The Dutch national criteria that govern here also cover the driving licence and identity card, so a photograph prepared for one of those is already correct for this application. That is unusual: in most countries the visa and the national document specifications differ.",
    ]
  },

  // ─────────────────────────────────────────────────────────────
  ireland: {
    id: "ireland",
    label: "Ireland",
    documents: ["Ireland visa (Immigration Service Delivery)"],
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Completely plain light grey, cream or white; no shadows",
      hex: "#F5F5F0",
      acceptableHex: ["#F5F5F0", "#DCDCDC", "#FFFFFF"],
    },
    // No pxMin: an Irish visa application takes two PRINTED photographs, so
    // there is no upload for a pixel minimum to apply to. The 715x951 figure
    // this record used to carry belongs to the DFA online PASSPORT service,
    // which is a different application and has no maker page here.
    digital: {
      fileSizeKb: null,
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove if possible",
    smileAllowed: "neutral only (biometric)",
    notes:
      "Irish VISA photograph, per Immigration Service Delivery: TWO identical " +
      "printed colour photographs on photographic paper, 35x45mm minimum up to " +
      "38x50mm, face 70-80% of the frame, plain light grey / cream / white " +
      "background, taken within the last 6 months, with the applicant's name and " +
      "transaction number written in block letters on the back of each. The visa " +
      "application takes prints, not an upload, so no digital pixel or file-size " +
      "figure applies to it.",
    source: "https://www.irishimmigration.ie/photograph-rules-for-visa-applications/",
    verified: "gov",
    applicationNotes: [
      "An Irish visa application takes TWO IDENTICAL PRINTED photographs, not an upload. There is no pixel size or file-size limit to meet because nothing is submitted digitally on this route.",
      "Your name and the visa transaction number must be written in block letters on the BACK of each photograph. That step is part of the requirement, not an optional extra, and it is done by hand after printing.",
      "Immigration Service Delivery describes prints on photographic paper between 35 x 45 mm and 38 x 50 mm. Prepare and print at that size rather than preparing a file to a KB target.",
    ]
  },

  // ─────────────────────────────────────────────────────────────
  uae: {
    id: "uae",
    label: "UAE",
    // ⚠ Emirates ID is not covered by this record. 43x55 is the visa-channel
    // size (GDRFA Dubai and typing centres). We do NOT assert a size for
    // Emirates ID: the ICP guide gives a width range of 35-40mm and no fixed
    // height, so "Emirates ID is 35x45" would be inventing a figure.
    documents: ["UAE visit / tourist visa", "Employment & residence visa"],
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
      "visible. Note that the linked ICP guide is the ICAO standard document: it " +
      "sets out the framing, background and quality rules, but the 43x55mm print " +
      "size is the UAE visa-channel convention rather than a figure that guide " +
      "states - the guide gives a 35-40mm width range and no fixed height. An " +
      "Emirates ID or other ICP application is a separate specification we do " +
      "not reproduce here. Confirm with your typing centre or portal first.",
    advisory:
      "43×55mm is the UAE VISA size. An Emirates ID or other ICP Smart Services " +
      "application uses a different specification, which we do not publish " +
      "because ICP's guide gives only a width range and no fixed height — check " +
      "ICP directly rather than reusing this crop. File limits also differ by " +
      "channel (ICP, GDRFA, typing centre), so check the one you are using.",
    source: "https://icp.gov.ae/wp-content/uploads/2021/11/icao_english.pdf",
    verified: "aggregator",
    applicationNotes: [
      "43 x 55 mm is the size commonly used for UAE visa applications through typing centres and GDRFA channels. We have not found an ICP page establishing it across every visit, employment and residence route, and ICP's own services state other dimensions in places, so confirm against the channel you are applying through. It is not the Emirates ID size.",
      "The ICP guide linked here is the ICAO standard document. It supports the framing, background and quality rules — face covering 70-80%, no tint or glare on glasses, head covering for religious reasons only with the full face visible — but it does not itself state the 43 x 55 mm print size, which is the channel convention.",
      "File limits differ by channel (ICP, GDRFA, or a typing centre), so check the one you are actually submitting through.",
    ]
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
    applicationNotes: [
      "The Saudi eVisa photograph is SQUARE — 200 x 200 pixels, between 5 KB and 100 KB — so a 35 x 45 mm passport crop is the wrong shape for it entirely.",
      "The portal asks for the face to fill roughly 70-80% of the frame, which it expresses as about 1.4 by 1.6 inches from chin to crown, on a plain white background with no pattern and no shadow, and no more than six months old.",
      "The eVisa is issued electronically and the photograph is uploaded rather than printed, so there is no print size to match — the pixel figures are the whole requirement. Prepare from the original image rather than scanning a printed copy, which loses detail the 200x200 frame cannot spare.",
      "The eVisa is approved electronically and often quickly, so an upload refused for the photograph is the main thing that stalls it. Because the frame is only 200x200, check the face is legible at that size on screen before submitting rather than judging it at full resolution.",
    ]
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
      "⚠ Unconfirmed. 35×45 mm on plain white is the default used here, but the " +
      "NPRA host does not resolve from our checks and no Bahraini government " +
      "page stating a photo size could be read, so nothing here is confirmed " +
      "against the authority. Neutral expression, taken within 6 months.",
    advisory:
      "We could not confirm Bahrain's visa photo size against any government " +
      "page — the NPRA site did not respond. 35×45 mm is a common default, not " +
      "a verified requirement. Use the size printed on your own application, or " +
      "ask the visa centre handling it.",
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
      "⚠ Published figures for Kuwait disagree sharply. 35×45 mm is the default " +
      "used here, but circulating guides also give 40×60 mm and a square " +
      "51×51 mm. No Kuwaiti government page states a size we could read " +
      "directly. Plain white background, neutral expression, head covering for " +
      "religious reasons only with the full face visible.",
    advisory:
      "Sources disagree on Kuwait's visa photo size — 35×45 mm, 40×60 mm and " +
      "51×51 mm are all in circulation, and we could not confirm any of them " +
      "against a Kuwaiti government page. Take the size from your own " +
      "application or visa centre before printing.",
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
      "⚠ Published figures for Qatar disagree. 35×45 mm is the default used " +
      "here, but circulating guides also give 38×48 mm for standard visa " +
      "applications and 30×40 mm for the e-visa. No Ministry of Interior page " +
      "states a size we could read directly, so the figure on your own " +
      "application is the one that counts.",
    advisory:
      "Sources disagree on Qatar's visa photo size — 35×45 mm, 38×48 mm and " +
      "30×40 mm for the e-visa are all in circulation. Check the size stated on " +
      "your application or in Metrash before printing or uploading; we could " +
      "not confirm any of them against a Ministry of Interior page.",
    source: "https://www.moi.gov.qa/",
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
      "⚠ Published figures for Oman disagree. 35×45 mm is what the Royal Oman " +
      "Police eVisa route is generally described as taking, and it is the " +
      "default used here, but widely-circulated guides also give 40×60 mm for " +
      "counter/consular applications. No public ROP page states a size we could " +
      "read directly, so treat this as a starting size and take the figure from " +
      "the application you are actually filling in.",
    advisory:
      "Sources disagree on Oman's visa photo size: 35×45 mm is commonly cited " +
      "for the ROP eVisa, while 40×60 mm is cited for consular applications. " +
      "Check the size on your own application form before printing or " +
      "uploading — we could not confirm either against a Royal Oman Police page.",
    source: "https://evisa.rop.gov.om/",
    verified: "aggregator",
    applicationNotes: [
      "Published figures for Oman disagree with each other. 35x45mm is what the Royal Oman Police eVisa route is generally described as taking and it is the default used here, while widely circulated guides give 40x60mm for counter and consular applications. No ROP page we could open states either figure.",
      "Take the size from the application in front of you rather than from any guide, including this one. If you are applying through an agent or a typing centre, ask them which of the two they submit at — the difference is large enough that a print made to the wrong one is unusable.",
      "Plain white background, neutral expression, and a photograph taken within the last six months are consistent across every source we found, so those parts are safe to prepare to.",
      "Oman issues several visa types through the ROP portal and through sponsors, and the route you use decides which figure applies. If a sponsor or employer submits on your behalf, send them the original photograph rather than a crop you prepared, so they can size it to whatever their channel asks for.",
    ]
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
      // ⚠ Published figures conflict. A reviewer reading the current DGI&P
      // e-services instructions reports 350x467 px, JPEG/JPG and a 3 MB cap for
      // the online route; the pages we could previously reach gave 45x35mm and
      // "up to 5 MB", and a further DGI&P document mentions 60 KB. We cannot
      // reach any of them from this network to settle it, so the cap is the
      // most conservative — a file under 3 MB satisfies every reading — and the
      // record is no longer flagged government-confirmed.
      pxMin: { width: 350, height: 467 },
      fileSizeKb: { max: 3072 },
      formats: ["jpg"],
    },
    // 600 DPI was scan guidance, not a stated upload requirement.
    dpiMin: 300,
    glasses: "not allowed",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Pakistani passport photo: 35x45mm (the DGIP online-renewal portal states " +
      "45mm high x 35mm wide, professionally taken, upload up to 5 MB, 600 DPI " +
      "scan guidance) on a plain white background. Head band uses the ICAO " +
      "70-80% convention. In-country first-time applications capture biometrics " +
      "live at the office; the upload path serves online renewals (onlinemrp)." ,
    source: "https://onlinemrp.dgip.gov.pk/photo-requirements/",
    // DGIP's own online-renewal portal states the 45x35mm size and the 5 MB cap.
    verified: "aggregator",
    applicationNotes: [
      "\u26a0 The published figures for the online route do not agree with each other. A reading of the current DGI&P e-services instructions gives 350 x 467 pixels, JPEG or JPG, with a 3 MB ceiling. Other DGI&P pages give 45 mm by 35 mm and a 5 MB ceiling, and a further document mentions 60 KB. We could not open any of them from our network to settle which governs today, so treat the figure on the screen in front of you as binding and keep the file under 3 MB, which satisfies every version.",
      "This route serves online renewals. A first-time application inside Pakistan captures the photograph and biometrics at the office instead, so a prepared file is not what that process needs at all.",
      "A first-time passport applicant inside Pakistan is photographed at the office, so this preset serves the online renewal route and overseas missions. If you are renewing from abroad, ask the mission which of the conflicting figures its portal enforces before you prepare anything.",
    ]
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
      "⚠ SCOPE: the Nepali ePassport does NOT take a supplied photograph. The " +
      "Department of Passports states that staff capture it during live " +
      "enrollment and the applicant need not bring one; a photograph is " +
      "required only for a child under five who cannot sit still for the " +
      "capture. This record therefore serves that exception, overseas missions " +
      "that still ask for a print, and framing checks — not the ordinary " +
      "ePassport route. 35x45mm on plain white, neutral expression, taken " +
      "within 6 months: consistent across reputable guides but NOT confirmed " +
      "against a Department page stating those figures.",
    source: "https://nepalpassport.gov.np/process/process-47",
    verified: "aggregator",
    applicationNotes: [
      "⚠ For a Nepali ePassport you do NOT bring a photograph. The Department of Passports answers this directly: staff photograph you during live enrollment at the enrollment centre, so an applicant does not need to carry one. Any guide telling you to bring two prints is describing the older machine-readable workflow, not the current ePassport process.",
      "The exception is a child under five. The Department states that a photograph IS required for children too young to sit still for the live capture, so that is the one case where preparing a print is the right thing to do.",
      "Because the photograph is normally taken for you, what matters at the centre is your appearance rather than a file: the enrollment photo is the one that goes in the passport. A tool like this is useful for the under-five exception, for an overseas mission that still asks for a print, or for checking framing before you go.",
      "The 35x45mm figures recorded here come from published guides rather than a Department page stating them, and are marked as needing confirmation. Confirm against the enrollment centre or mission handling your application.",
      "If you are applying through a Nepali mission abroad rather than at a district office in Nepal, ask that mission directly: several still work to the older machine-readable process and do request a print, which is the opposite of what the domestic ePassport route now does.",
    ],
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
    // The Spanish consular page this cited now 404s. The 35x45mm biometric
    // photo for a Schengen visa is set by the EU Visa Code, which applies to
    // Spain as a Schengen state and is the primary source for the figure.
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02009R0810-20200202",
    verified: "gov",
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
    // The Portuguese consular page this cited now 404s. Portugal is a Schengen
    // state, so the 35x45mm requirement comes from the EU Visa Code.
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02009R0810-20200202",
    verified: "gov",
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
      // The published spec gives two RANGES — horizontal 354-420, vertical
      // 472-560 — and they were previously transcribed as if each pair were one
      // photo, giving a 354x420 minimum. That is 52px shorter than the real
      // minimum height, so a photo built to it is rejected for being too small.
      // Both correct pairs are exactly 3:4; the old pair was not.
      pxMin: { width: 354, height: 472 },
      pxMax: { width: 420, height: 560 },
      // ⚠ The DPI path cannot serve this record. China's PRINT is 33x48mm
      // (ratio 0.6875) but the DIGITAL upload must be 3:4, and 33x48mm at
      // 300 DPI gives 390x567 — taller than the 560 maximum. Pinning the exact
      // published maximum gives the right ratio inside both ranges.
      px: { width: 420, height: 560 },
      fileSizeKb: { min: 40, max: 120 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "best avoided — no tint, no glare, eyes fully visible",
    smileAllowed: "neutral, mouth closed",
    notes:
      "China visa photo: a distinctive 33x48mm (not the usual 35x45), white " +
      "background, head 28-33mm chin-to-crown. Digital upload (COVA / consulate): " +
      "JPEG, 354x472 to 420x560 px, 40-120 KB. The Chinese Visa Application " +
      "Service Centre FAQ states the 48x33mm print size; the pixel ranges are " +
      "consistent across reputable guides but are not on that page, so confirm " +
      "them on the consulate or COVA portal before submitting.",
    source:
      "https://www.visaforchina.cn/SYD3_EN/qianzhengyewu/jichuzhishi/changjianwenti/355135188537315328.html",
    verified: "aggregator",
    applicationNotes: [
      "China publishes two RANGES rather than one size: 354 to 420 pixels wide and 472 to 560 pixels high. Reading them as a single pair gives 354 x 420, which is 52 pixels short of the minimum accepted height — a mistake worth avoiding because the file looks correct until it is refused.",
      "The print is a distinctive 33 x 48 mm rather than the usual 35 x 45, and the digital upload is 3:4 rather than the print's proportion, so the two are genuinely different shapes.",
      "The Visa Application Service Centre states the printed size and asks for glossy photo paper; the pixel ranges and the 40-120 KB band come from published guides rather than that page, so confirm them on the consulate or COVA portal.",
      "Chinese visa applications are usually lodged through a Visa Application Service Centre rather than the embassy directly, and the centre checks the photograph at the counter. Taking a spare print and the digital file to the appointment saves a second trip if the first is refused.",
      "The photograph is checked against the one in your passport and against you at the counter, so a recent image matters. Chinese visa centres are known for returning photographs at the desk rather than after submission, which is inconvenient but at least immediate.",
    ]
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
      // ⚠ 60 KB is the VISA figure and it is real: ICA's SAVE visa application
      // guide states "Image file size must be less than 60Kbytes" and "Image
      // dimension must be 400 x 514 pixels". The 8 MB / five-format allowance on
      // ICA's generic photo-guidelines page is for passports, ID cards and
      // e-Services — applying it to a visa upload produces a rejected file.
      fileSizeKb: { max: 60 }, // ICA states a ceiling only; no minimum published
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Singapore visa photo (ICA): 35x45mm on plain white, taken within 3 " +
      "months. The visa upload is a JPEG of exactly 400x514 px and under 60 KB, " +
      "per ICA's SAVE visa application guide - a tight cap, and different from " +
      "the 8 MB allowed on ICA's general photo-guidelines page, which covers " +
      "passports and ID cards rather than visas. No head coverings except for " +
      "religious reasons.",
    source:
      "https://www.ica.gov.sg/docs/default-source/ica/files/save-non-pub-ava_sp-user-guide-for-family-visa-application.pdf",
    verified: "gov",
    applicationNotes: [
      "ICA's visa guide is stricter than its general photo page and the difference matters: a visa upload is exactly 400 x 514 pixels and under 60 KB, where the general guidance for passports and ID cards allows 8 MB. Preparing to the 8 MB figure produces a file a visa application refuses.",
      "That 60 KB ceiling is tight for a 400 x 514 image, so compress deliberately and check the face is still clear rather than compressing blindly to the number.",
    ]
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
      // ⚠ INZ sets a MINIMUM as well as a maximum (512 KB - 3.14 MB). A photo
      // compressed below 512 KB is rejected, which is the opposite of the usual
      // "get under the cap" advice, so this band must not be dropped.
      fileSizeKb: { min: 512, max: 3140 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, eyes open, looking at camera",
    notes:
      "New Zealand visa / NZeTA photo: 35x45mm print, plain light/neutral " +
      "background (light grey, off-white or cream). Online: JPEG in portrait " +
      "3:4, 900x1200 to 2250x3000 px, and the file must be between 512 KB and " +
      "3.14 MB - Immigration NZ rejects a photo that is too small as well as " +
      "one that is too large. Face must cover 70-80% of the frame, taken " +
      "within the last 6 months. Immigration NZ does not accept photos " +
      "altered by AI editing tools.",
    source:
      "https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/applying-online/uploading-documents-and-photos/visa-and-nzeta-photos/",
    verified: "gov",
    applicationNotes: [
      "Immigration New Zealand rejects a photo for being too SMALL as well as too large. The accepted band is 512 KB to 3.14 MB, so the usual instinct — compress it down — produces a file INZ will not take. This is the reverse of nearly every other application on this site.",
      "The upload is JPEG in portrait 3:4 between 900 x 1200 and 2250 x 3000 pixels, with the face covering 70-80% of the frame and taken within the last six months. INZ also states it does not accept photos altered by AI editing tools.",
      "For a paper application the print is the familiar 35 x 45 mm; the pixel and file-size rules above apply to the online route only.",
      "The 3:4 portrait ratio is worth setting deliberately rather than trusting a crop by eye. A photograph a little wider than 3:4 will still meet the pixel minimums and the file-size band while failing the shape check, which is the fault most likely to survive your own inspection.",
    ]
  },

  // ─────────────────────────────────────────────────────────────
  japan: {
    id: "japan",
    label: "Japan",
    documents: ["Japan visa (MOFA)"],
    // MOFA's own visa application form (mofa.go.jp/files/000124525.pdf) prints
    // the photo box as 45mm x 35mm — height x width in the Japanese convention,
    // i.e. 35 wide by 45 tall. The form the applicant actually fills in outranks
    // the 45x45 square previously defaulted to here. Mission variation is still
    // real (Denver publishes 35x45 or 2x2in), which the advisory covers.
    printMm: { width: 35, height: 45 },
    headHeightMm: { min: 34, max: 36 },
    headPercentOfFrame: { min: 70, max: 80 },
    background: {
      description: "Plain white, no shadows or pattern",
      hex: "#FFFFFF",
      acceptableHex: ["#FFFFFF", "#FAFAFA"],
    },
    digital: {
      // Was `square: true` with 531x531, left behind when printMm became 35x45
      // — the page then advertised a portrait print and a square upload at once.
      pxApprox300dpi: { width: 413, height: 531 }, // 35x45mm at 300 DPI
      fileSizeKb: null, // ≤120 KB where uploaded digitally (see notes)
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, mouth closed",
    notes:
      "Japan visa photo (MOFA): 35x45mm on plain white, taken within 6 " +
      "months, two prints required for paper applications. The MOFA visa " +
      "application form specifies the photo as 45mm high x 35mm wide. Some " +
      "consulates publish other sizes, including 45x45mm square and 2x2 inch " +
      "— check yours. Digital uploads are JPEG, " +
      "typically 120 KB or less. MOFA itself says the requirements vary by the " +
      "mission handling your application, so the size on your consulate's page " +
      "overrides the default used here.",
    advisory:
      "35×45mm is the size printed on MOFA's own visa application form, and is " +
      "used here. Individual missions do publish other sizes — 45×45mm square " +
      "and 2×2 inch both appear — so check your embassy or consulate's " +
      "photograph page and switch the size if it differs before you print.",
    source: "https://www.mofa.go.jp/files/000124525.pdf",
    verified: "aggregator",
    applicationNotes: [
      "There is no single Japanese visa photo size. MOFA states the requirement depends on the mission handling your application, and missions genuinely differ — 45 x 45 mm square appears at some, 35 x 45 mm or 2 x 2 inch at others.",
      "35 x 45 mm is used here because it is the size printed on MOFA's own visa application form. Check your embassy or consulate's photograph page before printing and switch if it differs.",
      "One photograph is the general requirement; two identical prints are asked of applicants from Russia, the CIS states and Georgia. The photograph should be no more than six months old.",
      "Because the size varies by mission, check before you print rather than after. The consulate page for the city you are applying in is the authority, and printing to the wrong one of the three sizes in circulation wastes the whole set.",
      "Japanese missions frequently require the photograph to be affixed to a printed application form rather than uploaded, so prints matter more here than a file. Print at least one spare at whichever size your mission specifies.",
    ]
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
      // Published guides agree on a 10-120 KB eVisa band. No imi.gov.my page
      // states it, hence this record stays `aggregator`.
      fileSizeKb: { min: 10, max: 120 },
      formats: ["jpg"],
    },
    dpiMin: 300,
    glasses: "remove unless medically required",
    smileAllowed: "neutral, full front view",
    notes:
      "Malaysia visa / eVisa photo: a distinctive 35x50mm, plain white " +
      "background (light grey or cream sometimes accepted), head 30-35mm, face " +
      "60-70% of the frame. A dark-coloured shirt is recommended. Published " +
      "guides agree the eVisa upload must be JPEG between roughly 10 and 120 KB, " +
      "which is a tight band - but no Immigration Department page states it, so " +
      "check the limit shown on the eVisa form before submitting.",
    source: "https://malaysiavisa.imi.gov.my",
    verified: "aggregator",
    applicationNotes: [
      "Malaysia's 35 x 50 mm is unusual — taller than the 35 x 45 mm used almost everywhere else — so a standard passport crop is the wrong proportion and stretching it to fit distorts the face.",
      "Published guides agree the eVisa upload must be JPEG between roughly 10 and 120 KB, which is a tight band. No Immigration Department page states it, so check the limit shown on the eVisa form itself before submitting.",
    ]
  },
};

/**
 * Quick launch-readiness audit:
 *   us       → READY (gov-verified)
 *   canada   → READY for temporary residence only — visitor visa, study
 *               permit, work permit (gov-verified; printed passport excluded)
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
