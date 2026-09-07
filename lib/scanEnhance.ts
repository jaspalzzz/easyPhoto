/**
 * Document-tuned enhancement — the "make it look scanned" step.
 * -------------------------------------------------------------
 * A phone photo of a page carries the room's lighting with it: one corner is
 * bright, the opposite one falls into shadow, and the paper is never white.
 * A global tone curve cannot fix that, because the correct mapping differs
 * across the page. So we estimate the illumination field itself (a heavily
 * blurred copy of the image is a good approximation of "how lit is this area")
 * and divide it out. Paper flattens to white, ink keeps its contrast.
 *
 * This is deliberately NOT the `ocrPreprocess` path. That one runs binarization
 * OFF by default because Aadhaar and PAN cards print text over tricolour and
 * guilloché artwork, where a threshold destroys the very detail the LSTM needs.
 * Here the subject is a page, the output is for a human to read, and local
 * thresholding is exactly what produces a clean scan. Same repo, opposite
 * defaults, for good reasons — don't merge them.
 *
 * The pixel maths is pure and DOM-free so it can be tested in node. Only
 * `enhanceImageData` deals in ImageData.
 *
 * Nothing is uploaded; all pixels stay in the browser.
 */

import { bestGrayChannel, type GrayChannel } from "./ocrPreprocess";

export type ScanMode = "original" | "greyscale" | "blackwhite" | "colour";

export interface EnhanceOptions {
  /**
   * Radius of the illumination estimate, in pixels. Must be comfortably larger
   * than the text so that glyphs blur away and only the lighting field remains;
   * too small and the letters erase themselves. Defaults to ~1/16 of the short
   * edge, which holds across page sizes.
   */
  illuminationRadius?: number;
  /**
   * Radius of the local mean used for thresholding. Roughly a few character
   * widths. Defaults to ~1/64 of the short edge.
   */
  thresholdRadius?: number;
  /**
   * How far below the local mean a pixel must fall to be called ink, as a
   * fraction of that mean. Higher keeps more faint detail but also more
   * paper texture and noise. Default 0.12.
   */
  thresholdBias?: number;
}

/** Illumination radius as a fraction of the short edge. */
const ILLUMINATION_RADIUS_RATIO = 1 / 16;
/** Local-mean radius as a fraction of the short edge. */
const THRESHOLD_RADIUS_RATIO = 1 / 64;
const DEFAULT_THRESHOLD_BIAS = 0.12;
const MIN_ILLUMINATION_RADIUS = 8;
const MIN_THRESHOLD_RADIUS = 3;

/** Rec.601 luma, matching the OCR path's weighting. */
function luma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Std dev of luma and each colour channel over a sparse sample, in the shape
 * `bestGrayChannel` expects. Sampling every 8th pixel is ample for a global
 * statistic and keeps this pass cheap on a full-resolution photo.
 */
export function channelSpread(
  rgba: Uint8ClampedArray
): Record<GrayChannel, number> {
  const sums = { luma: 0, r: 0, g: 0, b: 0 };
  const squares = { luma: 0, r: 0, g: 0, b: 0 };
  let count = 0;
  for (let i = 0; i < rgba.length; i += 32) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const y = luma(r, g, b);
    sums.luma += y; squares.luma += y * y;
    sums.r += r; squares.r += r * r;
    sums.g += g; squares.g += g * g;
    sums.b += b; squares.b += b * b;
    count++;
  }
  if (count === 0) return { luma: 0, r: 0, g: 0, b: 0 };
  const std = (sum: number, sq: number) => {
    const mean = sum / count;
    return Math.sqrt(Math.max(0, sq / count - mean * mean));
  };
  return {
    luma: std(sums.luma, squares.luma),
    r: std(sums.r, squares.r),
    g: std(sums.g, squares.g),
    b: std(sums.b, squares.b),
  };
}

/** Flatten RGBA to a single-channel grayscale plane. */
export function toGrayPlane(
  rgba: Uint8ClampedArray,
  channel: GrayChannel = "luma"
): Float32Array {
  const pixels = rgba.length / 4;
  const out = new Float32Array(pixels);
  for (let p = 0; p < pixels; p++) {
    const i = p * 4;
    out[p] =
      channel === "luma"
        ? luma(rgba[i], rgba[i + 1], rgba[i + 2])
        : rgba[i + (channel === "r" ? 0 : channel === "g" ? 1 : 2)];
  }
  return out;
}

function clampIndex(value: number, max: number): number {
  return value < 0 ? 0 : value > max ? max : value;
}

/**
 * Separable box blur with a sliding window, O(pixels) regardless of radius.
 *
 * Edges are handled by clamping the sample index, so the window always holds
 * a full 2r+1 samples. Reflecting instead would be marginally better at the
 * border, but clamping keeps a bright margin from darkening the illumination
 * estimate at the page edge, which matters more here.
 */
export function boxBlur(
  src: Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  if (radius <= 0) return Float32Array.from(src);
  const window = radius * 2 + 1;
  const horizontal = new Float32Array(src.length);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let sum = 0;
    for (let k = -radius; k <= radius; k++) {
      sum += src[row + clampIndex(k, width - 1)];
    }
    for (let x = 0; x < width; x++) {
      horizontal[row + x] = sum / window;
      sum += src[row + clampIndex(x + radius + 1, width - 1)];
      sum -= src[row + clampIndex(x - radius, width - 1)];
    }
  }

  const out = new Float32Array(src.length);
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let k = -radius; k <= radius; k++) {
      sum += horizontal[clampIndex(k, height - 1) * width + x];
    }
    for (let y = 0; y < height; y++) {
      out[y * width + x] = sum / window;
      sum += horizontal[clampIndex(y + radius + 1, height - 1) * width + x];
      sum -= horizontal[clampIndex(y - radius, height - 1) * width + x];
    }
  }
  return out;
}

/**
 * Per-pixel gain that flattens the lighting field: how much each pixel must be
 * brightened for its local paper to read as white.
 *
 * Returned as a gain rather than an applied result so colour mode can use the
 * same field across all three channels and keep hues intact.
 */
export function illuminationGain(
  gray: Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  const illumination = boxBlur(gray, width, height, radius);
  const gain = new Float32Array(illumination.length);
  for (let i = 0; i < illumination.length; i++) {
    // Guard the divide: a genuinely black region has no paper to recover, and
    // dividing by ~0 would explode sensor noise into confetti.
    gain[i] = illumination[i] < 1 ? 1 : 255 / illumination[i];
  }
  return gain;
}

/**
 * Local-mean ("adaptive") threshold. A pixel is ink when it sits more than
 * `bias` below the mean of its neighbourhood.
 *
 * This is the whole reason the module exists: a global threshold has to pick
 * one cut for the entire page, so on a photo with a lighting gradient it either
 * loses the text in the shadow or floods the bright side with black. A local
 * mean moves the cut with the lighting.
 */
export function adaptiveThreshold(
  gray: Float32Array,
  width: number,
  height: number,
  radius: number,
  bias: number = DEFAULT_THRESHOLD_BIAS
): Uint8ClampedArray {
  const means = boxBlur(gray, width, height, radius);
  const out = new Uint8ClampedArray(gray.length);
  for (let i = 0; i < gray.length; i++) {
    out[i] = gray[i] < means[i] * (1 - bias) ? 0 : 255;
  }
  return out;
}

function resolveRadii(
  width: number,
  height: number,
  options: EnhanceOptions
): { illumination: number; threshold: number } {
  const shortEdge = Math.min(width, height);
  return {
    illumination: Math.max(
      MIN_ILLUMINATION_RADIUS,
      Math.round(options.illuminationRadius ?? shortEdge * ILLUMINATION_RADIUS_RATIO)
    ),
    threshold: Math.max(
      MIN_THRESHOLD_RADIUS,
      Math.round(options.thresholdRadius ?? shortEdge * THRESHOLD_RADIUS_RATIO)
    ),
  };
}

/**
 * Apply a scan-style enhancement, returning fresh pixels. The input is not
 * mutated, so switching modes in the UI can always re-run from the original.
 */
export function enhancePixels(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  mode: ScanMode,
  options: EnhanceOptions = {}
  // Pinned to an ArrayBuffer (not ArrayBufferLike): the ImageData constructor
  // rejects a SharedArrayBuffer-backed view, and inference widens without this.
): Uint8ClampedArray<ArrayBuffer> {
  if (mode === "original") return Uint8ClampedArray.from(rgba);

  const radii = resolveRadii(width, height, options);
  const bias = options.thresholdBias ?? DEFAULT_THRESHOLD_BIAS;
  const out = new Uint8ClampedArray(rgba.length);

  if (mode === "colour") {
    // Flatten the lighting but keep the hues — right for letterheads, stamps,
    // and anything where colour carries meaning.
    const gray = toGrayPlane(rgba, "luma");
    const gain = illuminationGain(gray, width, height, radii.illumination);
    for (let p = 0; p < gain.length; p++) {
      const i = p * 4;
      out[i] = rgba[i] * gain[p];
      out[i + 1] = rgba[i + 1] * gain[p];
      out[i + 2] = rgba[i + 2] * gain[p];
      out[i + 3] = rgba[i + 3];
    }
    return out;
  }

  // Greyscale and B&W both start from the channel with the most tonal spread,
  // reusing the OCR path's channel-selection policy.
  const channel = bestGrayChannel(channelSpread(rgba));
  const gray = toGrayPlane(rgba, channel);
  const gain = illuminationGain(gray, width, height, radii.illumination);

  const flattened = new Float32Array(gray.length);
  for (let p = 0; p < gray.length; p++) {
    flattened[p] = Math.min(255, gray[p] * gain[p]);
  }

  const values =
    mode === "blackwhite"
      ? adaptiveThreshold(flattened, width, height, radii.threshold, bias)
      : flattened;

  for (let p = 0; p < gray.length; p++) {
    const i = p * 4;
    const v = values[p];
    out[i] = v;
    out[i + 1] = v;
    out[i + 2] = v;
    out[i + 3] = rgba[i + 3];
  }
  return out;
}

/**
 * ImageData-level wrapper. Browser-only only in the sense that ImageData is a
 * DOM type; the work itself is the pure function above.
 */
export function enhanceImageData(
  source: ImageData,
  mode: ScanMode,
  options: EnhanceOptions = {}
): ImageData {
  const pixels = enhancePixels(
    source.data,
    source.width,
    source.height,
    mode,
    options
  );
  return new ImageData(pixels, source.width, source.height);
}
