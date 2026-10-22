/**
 * Head-Positioning Engine
 * -----------------------
 * Takes face measurements + a country spec and returns the exact crop
 * rectangle + output dimensions that land the head inside the country's
 * required size band. This is the function that decides pass-vs-reject,
 * so it is intentionally PURE: no DOM, no model dependency, fully testable.
 *
 * Pipeline position:
 *   image -> face detection (MediaPipe) -> {measurements} -> computeCrop()
 *         -> renderToCanvas() -> background replace -> export presets
 *
 * Measurements are in SOURCE-image pixels:
 *   crownY      top of head/hair      (smaller Y)
 *   chinY       bottom of chin        (larger Y)
 *   eyeCenterY  midpoint of both eyes
 *   faceCenterX horizontal face centre
 *
 * Tested against US / UK / India specs. See notes at the bottom for how to
 * obtain crownY reliably (it is the hardest measurement to get right).
 *
 * NOTE: Faithful TypeScript port of the verified JS engine. Logic and values
 * are identical to the source — types were added, math was NOT changed.
 */

import type { CountrySpec } from "./countrySpecs";

export interface FaceMeasurements {
  chinY: number;
  crownY: number;
  eyeCenterY?: number;
  faceCenterX: number;
}

export interface ComputeCropOpts {
  dpi?: number;
  topMarginRatio?: number;
  maxUpscale?: number;
  source?: { width: number; height: number };
  /**
   * Force an exact output size in pixels, overriding the mm-x-DPI calculation.
   *
   * Some authorities require an EXACT upload size rather than a minimum —
   * Singapore's visa upload must be 400x514, Saudi's eVisa 200x200. No integer
   * DPI reproduces those from the print size (51mm at 100 DPI rounds to 201,
   * not 200), so the digital preset has to be told the target directly.
   * Callers pass `spec.digital.px`; the ratios there match the print ratio, so
   * this changes resolution and not framing.
   */
  exactOutput?: { width: number; height: number };
  /**
   * User-facing sentence appended to the "smaller than the online-upload
   * minimum" warning, naming the download in the calling tool that does meet
   * it (e.g. the passport tool's "JPG for upload"). Tools that offer no
   * upload-size file omit it and the warning says to print this file instead.
   */
  digitalUploadHint?: string;
}

export interface CropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface CropResult {
  crop: CropRect;
  output: { width: number; height: number };
  dpi: number;
  achieved: {
    headPercentOfFrame: number;
    upscale: number;
  };
  warnings: string[];
}

const HEAD_NOT_MEASURED_MESSAGE =
  "We couldn't measure the head in this photo. Use a clear, front-facing " +
  "photo with your whole head and shoulders visible.";
const SIZE_UNAVAILABLE_MESSAGE =
  "We can't make a photo at this size right now. Choose a different size, " +
  "or try again later.";

/** Scaling the source up past this factor makes the result visibly soft. */
export const DEFAULT_MAX_UPSCALE = 1.15;

// Crop warnings are shown to applicants verbatim. CompliancePanel lifts the
// first two into its "Retake recommended" box, so each says the whole fact once.
export const LOW_RESOLUTION_WARNING =
  "This photo is lower-resolution than ideal, so the result may look soft " +
  "when printed. A higher-resolution photo will look sharper.";
export const PAST_EDGES_WARNING =
  "The head is too close to the photo edges to leave the required margin, " +
  "so it may not sit centred in the result. Retake from a bit further back " +
  "so there's space above the head and around the shoulders.";
// Fires only when a size's own head-height and head-percentage rules
// disagree; test/headPositioning.test.ts keeps every shipped size clear of it.
export const CONFLICTING_HEAD_RULES_WARNING =
  "The official rules for this photo give two head sizes that don't match. " +
  "We sized the head to the height in millimetres.";

export const mmToPx = (mm: number, dpi: number): number =>
  Math.round((mm / 25.4) * dpi);

/** Aim for the CENTRE of the allowed head-height band — maximum error margin. */
export const targetHeadMm = (spec: CountrySpec): number =>
  (spec.headHeightMm.min + spec.headHeightMm.max) / 2;

/**
 * DPI needed so a print-sized photo also satisfies the country's DIGITAL
 * pixel minimum. Use this for the online-upload export preset; use ~300 DPI
 * for the print preset. (e.g. UK at 300 DPI = 413x531, below its 600x750
 * online minimum — this returns the higher DPI that fixes that.)
 */
export function recommendedDigitalDpi(spec: CountrySpec, baseDpi = 300): number {
  const min = spec.digital?.pxMin;
  if (!min) return baseDpi;
  if (!spec.printMm.width || !spec.printMm.height) return baseDpi;
  const needW = (min.width * 25.4) / spec.printMm.width;
  const needH = (min.height * 25.4) / spec.printMm.height;
  return Math.ceil(Math.max(baseDpi, needW, needH));
}

/**
 * @param face   face measurements in source-image pixels
 * @param spec   a COUNTRY_SPECS entry
 * @param opts
 *   dpi            output resolution (default spec.dpiMin || 300)
 *   topMarginRatio crown placement when no eye spec (0=top, 1=bottom; default 0.45)
 *   maxUpscale     warn above this upscale factor (default 1.15)
 *   source         {width,height} of the source image — enables bounds checking
 */
export function computeCrop(
  face: FaceMeasurements,
  spec: CountrySpec,
  opts: ComputeCropOpts = {}
): CropResult {
  const dpi = opts.dpi ?? spec.dpiMin ?? 300;
  const topMarginRatio = opts.topMarginRatio ?? 0.45;
  const maxUpscale = opts.maxUpscale ?? DEFAULT_MAX_UPSCALE;
  const warnings: string[] = [];

  const outW = opts.exactOutput?.width ?? mmToPx(spec.printMm.width, dpi);
  const outH = opts.exactOutput?.height ?? mmToPx(spec.printMm.height, dpi);

  // Every millimetre-derived measurement below (head height, eye line) has to
  // be expressed in the pixels of the canvas we are actually producing. When an
  // exact output size is forced, that canvas is NOT `dpi` — Saudi's 200x200 from
  // a 51x51mm spec is ~100 DPI. Leaving the head target at 300 DPI asked for a
  // 455px head inside a 200px frame and the crop cut through the face.
  const geomDpi = opts.exactOutput
    ? (outH / spec.printMm.height) * 25.4
    : dpi;

  const srcHeadPx = face.chinY - face.crownY;
  // These messages reach users verbatim (the photo tools show Error.message),
  // so they describe what to do, not which field is wrong.
  if (srcHeadPx <= 0) throw new Error(HEAD_NOT_MEASURED_MESSAGE);

  const tgtHeadPx = mmToPx(targetHeadMm(spec), geomDpi);
  // Zero head or print height is a data error in the size record itself.
  if (tgtHeadPx <= 0 || outH <= 0) throw new Error(SIZE_UNAVAILABLE_MESSAGE);

  // Source-space crop height so the head fills the right fraction of OUTPUT.
  const cropH = (srcHeadPx * outH) / tgtHeadPx;
  const cropW = cropH * (outW / outH);

  // Vertical anchor: prefer the eye line when the spec defines it (most
  // precise), otherwise place the crown by the top-margin ratio.
  let cropTopY: number;
  if (spec.eyeHeightFromBottomMm && face.eyeCenterY != null) {
    const tgtEyePx = mmToPx(
      (spec.eyeHeightFromBottomMm.min + spec.eyeHeightFromBottomMm.max) / 2,
      geomDpi
    );
    const outEyeFromTop = outH - tgtEyePx;
    cropTopY = face.eyeCenterY - cropH * (outEyeFromTop / outH);
  } else {
    const outCrownFromTop = (outH - tgtHeadPx) * topMarginRatio;
    cropTopY = face.crownY - cropH * (outCrownFromTop / outH);
  }

  let cropLeftX = face.faceCenterX - cropW / 2;

  // --- Quality / compliance checks -------------------------------------
  const upscale = outH / cropH;
  if (upscale > maxUpscale) warnings.push(LOW_RESOLUTION_WARNING);

  // Cross-check the achieved head fraction against the percentage band.
  const headPct = (tgtHeadPx / outH) * 100;
  if (
    spec.headPercentOfFrame &&
    (headPct > spec.headPercentOfFrame.max + 0.5 ||
      headPct < spec.headPercentOfFrame.min - 0.5)
  )
    warnings.push(CONFLICTING_HEAD_RULES_WARNING);

  const src = opts.source;
  if (src?.width && src?.height) {
    const outOfBounds =
      cropLeftX < 0 ||
      cropTopY < 0 ||
      cropLeftX + cropW > src.width ||
      cropTopY + cropH > src.height;
    if (outOfBounds) {
      warnings.push(PAST_EDGES_WARNING);
      cropLeftX = Math.max(0, Math.min(cropLeftX, src.width - cropW));
      cropTopY = Math.max(0, Math.min(cropTopY, src.height - cropH));
    }
  }

  if (
    spec.digital?.pxMin &&
    (outW < spec.digital.pxMin.width || outH < spec.digital.pxMin.height)
  )
    warnings.push(
      `This print-size file (${outW}×${outH} px) is smaller than the ` +
        `${spec.digital.pxMin.width}×${spec.digital.pxMin.height} px minimum ` +
        `for online upload. ` +
        (opts.digitalUploadHint ?? "Use it for printing only.")
    );

  return {
    crop: {
      sx: Math.round(cropLeftX),
      sy: Math.round(cropTopY),
      sw: Math.round(cropW),
      sh: Math.round(cropH),
    },
    output: { width: outW, height: outH },
    dpi,
    achieved: {
      headPercentOfFrame: +headPct.toFixed(1),
      upscale: +upscale.toFixed(3),
    },
    warnings,
  };
}

/**
 * Browser-only: render a computed crop to a canvas at exact output pixels.
 * @param image  loaded <img>/ImageBitmap (the SOURCE)
 * @param result the output of computeCrop()
 */
export function renderToCanvas(
  image: CanvasImageSource,
  result: CropResult
): HTMLCanvasElement {
  const { crop, output } = result;
  const canvas = document.createElement("canvas");
  canvas.width = output.width;
  canvas.height = output.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh, // source rect
    0,
    0,
    output.width,
    output.height // dest rect
  );
  return canvas;
}

/* ─────────────────────────────────────────────────────────────────────
 * GETTING crownY (the hardest input — read before wiring in detection)
 * ─────────────────────────────────────────────────────────────────────
 * Face-landmark models (MediaPipe FaceMesh, face-api.js) detect the FACE,
 * not the hair, so their topmost point is the forehead/hairline — NOT the
 * true top of the head. Two ways to recover crownY:
 *
 * 1. PREFERRED — segmentation mask (you need it for background removal
 *    anyway). Within the head's horizontal span, the topmost non-background
 *    pixel of the person mask IS the crown, hair included. Most accurate.
 *
 * 2. FALLBACK — landmark extrapolation. From FaceMesh: take the brow line
 *    and chin, then estimate crownY a fixed fraction above the forehead
 *    landmark. Rough; only use when no mask is available.
 *
 * chinY, eyeCenterY, faceCenterX come straight from landmarks:
 *   chinY       = landmark 152 (chin tip)
 *   eyeCenterY  = average Y of left/right eye centres (e.g. 159/386 region)
 *   faceCenterX = midpoint X of the face oval
 * ───────────────────────────────────────────────────────────────────── */
