/**
 * Square face-crop engine (LinkedIn / profile photos).
 * ----------------------------------------------------
 * Given face measurements (from lib/faceDetection) this returns the exact
 * SQUARE crop rectangle that centres the face horizontally and places the eye
 * line in the upper third — the framing a professional headshot wants and that
 * LinkedIn's circular avatar expects. Pure (no DOM, no model) so it is fully
 * unit-testable, mirroring lib/headPositioning.
 *
 * Measurements are in SOURCE-image pixels (same convention as FaceMeasurements):
 *   crownY      top of head        (smaller Y)
 *   chinY       bottom of chin     (larger Y)
 *   eyeCenterY  midpoint of eyes
 *   faceCenterX horizontal centre
 */

import type { FaceMeasurements } from "./headPositioning";

export interface SquareCropOpts {
  /** Output side length in px (e.g. 400). */
  side: number;
  /** Head height (crown→chin) as a fraction of the square. Default 0.62. */
  headRatio?: number;
  /** Eye-line position from the top of the square (0=top, 1=bottom). Default 0.42. */
  eyeFromTop?: number;
  /** Warn above this upscale factor. Default 1.1. */
  maxUpscale?: number;
}

export interface SquareCropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface SquareCropResult {
  crop: SquareCropRect;
  output: { width: number; height: number };
  achieved: { headRatio: number; upscale: number };
  warnings: string[];
}

/**
 * Compute a square, face-centred crop.
 * @param face   face measurements in source-image pixels
 * @param source natural { width, height } of the source image (for bounds)
 * @param opts   see SquareCropOpts
 */
export function computeSquareFaceCrop(
  face: FaceMeasurements,
  source: { width: number; height: number },
  opts: SquareCropOpts
): SquareCropResult {
  const side = opts.side;
  const headRatio = opts.headRatio ?? 0.62;
  const eyeFromTop = opts.eyeFromTop ?? 0.42;
  const maxUpscale = opts.maxUpscale ?? 1.1;
  const warnings: string[] = [];

  const headPx = face.chinY - face.crownY;
  if (headPx <= 0)
    throw new Error("crownY must sit above chinY (a smaller Y value).");

  // Square side in SOURCE px so the head fills `headRatio` of the frame.
  let cropSide = headPx / headRatio;

  // The square can't be larger than the smaller image dimension.
  const maxSide = Math.min(source.width, source.height);
  if (cropSide > maxSide) {
    cropSide = maxSide;
    warnings.push(
      "Not enough margin around the head for ideal framing — using the largest square that fits. For more headroom, use a photo with space around the head."
    );
  }

  // Vertical anchor: put the eye line in the upper third (fallback: crown).
  let cropTopY =
    face.eyeCenterY != null
      ? face.eyeCenterY - cropSide * eyeFromTop
      : face.crownY - cropSide * 0.1;
  let cropLeftX = face.faceCenterX - cropSide / 2;

  // Clamp inside the image (can't sample outside the source).
  cropLeftX = Math.max(0, Math.min(cropLeftX, source.width - cropSide));
  cropTopY = Math.max(0, Math.min(cropTopY, source.height - cropSide));

  const upscale = side / cropSide;
  if (upscale > maxUpscale)
    warnings.push(
      `Low source resolution: needs ${upscale.toFixed(2)}x upscaling for ${side}px output. Result may look soft — use a higher-resolution photo.`
    );

  return {
    crop: {
      sx: Math.round(cropLeftX),
      sy: Math.round(cropTopY),
      sw: Math.round(cropSide),
      sh: Math.round(cropSide),
    },
    output: { width: side, height: side },
    achieved: {
      headRatio: +(headPx / cropSide).toFixed(3),
      upscale: +upscale.toFixed(3),
    },
    warnings,
  };
}

/** Centered square fallback when no face is detected. */
export function centerSquareCrop(source: {
  width: number;
  height: number;
}): SquareCropRect {
  const s = Math.min(source.width, source.height);
  return {
    sx: Math.round((source.width - s) / 2),
    sy: Math.round((source.height - s) / 2),
    sw: s,
    sh: s,
  };
}
