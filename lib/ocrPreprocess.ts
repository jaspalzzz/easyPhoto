/**
 * Image preprocessing for OCR (browser-only, Canvas 2D).
 * ------------------------------------------------------
 * Tesseract's LSTM engine is tuned for text scanned at ~300 DPI with a capital
 * height of ~30px. Phone photos of documents and ID cards usually fall well
 * short, which is the dominant cause of poor recognition. This module lifts the
 * input toward that band BEFORE recognition:
 *
 *   decode (HEIC-safe) → grayscale (Rec.601 luma) → upscale (bicubic) →
 *   percentile contrast stretch → [optional Otsu binarization]
 *
 * Order matters: geometry (scale) before tone (contrast) before threshold.
 * Binarization is OFF by default — for colour ID cards (Aadhaar/PAN have
 * tricolour headers, guilloché backgrounds and ghost images) a global threshold
 * crushes detail and HURTS the LSTM, which already handles grayscale well. It is
 * exposed for clean, evenly-lit scans where it helps.
 *
 * Nothing is uploaded; all pixels stay in the browser.
 */

import { ensureDecodable } from "./heic";

export interface PreprocessOptions {
  /**
   * Target for the longest edge of the working image. Small inputs are upscaled
   * toward this; large inputs are capped here to bound WASM/canvas memory.
   * Default 2000 — plenty for a single document or card, safe on mobile.
   */
  targetLongEdge?: number;
  /** Max upscale factor for small inputs (avoids ballooning tiny thumbnails). */
  maxUpscale?: number;
  /** Apply Otsu global binarization. Default false (see module note). */
  binarize?: boolean;
  /** Apply the 1%/99% percentile contrast stretch. Default true. */
  contrastStretch?: boolean;
  /**
   * Auto-detect and correct document skew via horizontal projection profiles.
   * Scans –12° … +12° in 1° steps on a 200 px probe image, picks the angle
   * that maximises row-projection variance (text lines most horizontal), then
   * rotates the full-resolution canvas to correct. Safe to leave on for ID
   * cards — adds <10 ms on a probe image. Default false.
   */
  deskew?: boolean;
}

const DEFAULTS: Required<PreprocessOptions> = {
  targetLongEdge: 2000,
  maxUpscale: 3,
  binarize: false,
  contrastStretch: true,
  deskew: false,
};

/** Rec.601 luma — the conventional grayscale weighting for OCR. */
function luma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export type GrayChannel = "luma" | "r" | "g" | "b";

/**
 * Pick the grayscale source with the most tonal spread (std dev), biased
 * toward luma unless a single channel clearly beats it.
 *
 * Why: luma is right for neutral documents, but Indian ID cards print dark
 * text over strongly-coloured art — PAN's cyan/blue guilloché is the worst
 * case, where luma renders background and ink to similar mid-grays and the
 * LSTM gets mush. In a single colour channel the same card separates cleanly
 * (a cyan background is bright in G/B while the ink stays dark). Std dev over
 * the channel is a cheap, robust proxy for that separation. The 15% margin
 * keeps ordinary photos and scans on the well-tested luma path.
 */
export function bestGrayChannel(std: Record<GrayChannel, number>): GrayChannel {
  let best: GrayChannel = "luma";
  let bestStd = std.luma * 1.15;
  for (const ch of ["r", "g", "b"] as const) {
    if (std[ch] > bestStd) {
      best = ch;
      bestStd = std[ch];
    }
  }
  return best;
}

/** Std dev of luma + each colour channel over a sparse pixel sample. */
function channelStats(data: Uint8ClampedArray): Record<GrayChannel, number> {
  const sums = { luma: 0, r: 0, g: 0, b: 0 };
  const sqs = { luma: 0, r: 0, g: 0, b: 0 };
  let count = 0;
  // Every 8th pixel is plenty for global statistics and keeps this pass cheap.
  for (let i = 0; i < data.length; i += 32) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const y = luma(r, g, b);
    sums.luma += y; sqs.luma += y * y;
    sums.r += r; sqs.r += r * r;
    sums.g += g; sqs.g += g * g;
    sums.b += b; sqs.b += b * b;
    count++;
  }
  const std = (sum: number, sq: number) => {
    const mean = sum / count;
    return Math.sqrt(Math.max(0, sq / count - mean * mean));
  };
  return {
    luma: std(sums.luma, sqs.luma),
    r: std(sums.r, sqs.r),
    g: std(sums.g, sqs.g),
    b: std(sums.b, sqs.b),
  };
}

/**
 * Decode `file` to an HTMLImageElement, honouring browser EXIF orientation.
 * Returns the element plus an object URL the caller must revoke.
 */
async function decodeImage(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  const decodable = await ensureDecodable(file);
  const url = URL.createObjectURL(decodable);
  try {
    const img = new Image();
    // Browsers apply EXIF orientation to <img> by default; no manual rotation.
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read that image — it may be corrupt or an unsupported format."));
      img.src = url;
    });
    return { img, url };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/** Compute the working dimensions: upscale small inputs, cap large ones. */
function workingSize(
  w: number,
  h: number,
  targetLongEdge: number,
  maxUpscale: number
): { width: number; height: number } {
  const longest = Math.max(w, h);
  let scale = targetLongEdge / longest;
  // Upscale small images (capped), or shrink oversized ones; never below 1x
  // for a downscale-only safety when already near target.
  if (scale > 1) scale = Math.min(scale, maxUpscale);
  const width = Math.max(1, Math.round(w * scale));
  const height = Math.max(1, Math.round(h * scale));
  return { width, height };
}

/** In-place grayscale + optional percentile contrast stretch + optional Otsu. */
function toneMap(data: Uint8ClampedArray, opts: Required<PreprocessOptions>): void {
  const n = data.length;

  // 1) Grayscale — from the channel with the best tonal separation (see
  //    bestGrayChannel), building a histogram as we go.
  const channel = bestGrayChannel(channelStats(data));
  const offset = channel === "r" ? 0 : channel === "g" ? 1 : channel === "b" ? 2 : -1;
  const hist = new Uint32Array(256);
  for (let i = 0; i < n; i += 4) {
    const y = offset >= 0 ? data[i + offset] : luma(data[i], data[i + 1], data[i + 2]) | 0;
    data[i] = data[i + 1] = data[i + 2] = y;
    hist[y]++;
  }

  const pixelCount = n / 4;

  // 2) Percentile (1%/99%) contrast stretch — robust to a few glare/shadow
  //    outliers that a raw min/max stretch would be flattened by.
  if (opts.contrastStretch) {
    const lowCut = pixelCount * 0.01;
    const highCut = pixelCount * 0.99;
    let cum = 0;
    let lo = 0;
    let hi = 255;
    for (let v = 0; v < 256; v++) {
      cum += hist[v];
      if (cum >= lowCut) { lo = v; break; }
    }
    cum = 0;
    for (let v = 0; v < 256; v++) {
      cum += hist[v];
      if (cum >= highCut) { hi = v; break; }
    }
    if (hi > lo) {
      const range = hi - lo;
      const lut = new Uint8ClampedArray(256);
      for (let v = 0; v < 256; v++) {
        lut[v] = Math.max(0, Math.min(255, Math.round(((v - lo) * 255) / range)));
      }
      for (let i = 0; i < n; i += 4) {
        const y = lut[data[i]];
        data[i] = data[i + 1] = data[i + 2] = y;
      }
    }
  }

  // 3) Optional Otsu global binarization (recompute histogram post-stretch).
  if (opts.binarize) {
    const h2 = new Uint32Array(256);
    for (let i = 0; i < n; i += 4) h2[data[i]]++;
    const t = otsuThreshold(h2, pixelCount);
    for (let i = 0; i < n; i += 4) {
      const y = data[i] > t ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = y;
    }
  }
}

/**
 * Estimate the skew angle of a (already-grayscale) canvas using horizontal
 * projection profiles. Scans –12 … +12° in 1° steps on a 200 px probe copy.
 * Returns the angle (degrees) that should be APPLIED (not corrected) — i.e. if
 * text is tilted +5° clockwise, this returns +5.
 */
export function estimateDeskewAngle(canvas: HTMLCanvasElement): number {
  const PROBE_W = 200;
  const PROBE_H = Math.max(1, Math.round((PROBE_W * canvas.height) / canvas.width));

  const probe = document.createElement("canvas");
  probe.width = PROBE_W;
  probe.height = PROBE_H;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  if (!pctx) return 0;
  pctx.drawImage(canvas, 0, 0, PROBE_W, PROBE_H);
  const px = pctx.getImageData(0, 0, PROBE_W, PROBE_H).data;

  const cx = PROBE_W / 2;
  const cy = PROBE_H / 2;
  let bestAngle = 0;
  let bestVariance = -1;

  for (let deg = -12; deg <= 12; deg++) {
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Compute horizontal projection by sampling the probe with inverse rotation.
    const projection = new Float32Array(PROBE_H);
    for (let y = 0; y < PROBE_H; y++) {
      let dark = 0;
      for (let x = 0; x < PROBE_W; x++) {
        const dx = x - cx;
        const dy = y - cy;
        // Inverse rotate: map rotated (x,y) → original (ox, oy)
        const ox = Math.round(cos * dx + sin * dy + cx);
        const oy = Math.round(-sin * dx + cos * dy + cy);
        if (ox >= 0 && ox < PROBE_W && oy >= 0 && oy < PROBE_H) {
          if (px[(oy * PROBE_W + ox) * 4] < 128) dark++;
        }
      }
      projection[y] = dark;
    }

    let sum = 0;
    for (let i = 0; i < projection.length; i++) sum += projection[i];
    const mean = sum / projection.length;
    let variance = 0;
    for (let i = 0; i < projection.length; i++) {
      const d = projection[i] - mean;
      variance += d * d;
    }

    if (variance > bestVariance) {
      bestVariance = variance;
      bestAngle = deg;
    }
  }

  return bestAngle;
}

/**
 * Rotate `canvas` by `angleDeg` degrees, expanding the output canvas to fit
 * the full rotated image (white background, no cropping). Returns the original
 * canvas unchanged when |angleDeg| < 0.5°.
 */
export function deskewCanvas(
  canvas: HTMLCanvasElement,
  angleDeg: number
): HTMLCanvasElement {
  if (Math.abs(angleDeg) < 0.5) return canvas;

  const rad = (-angleDeg * Math.PI) / 180; // negate: correct the detected tilt
  const absCos = Math.abs(Math.cos(rad));
  const absSin = Math.abs(Math.sin(rad));
  const W = canvas.width;
  const H = canvas.height;
  const newW = Math.round(W * absCos + H * absSin);
  const newH = Math.round(W * absSin + H * absCos);

  const out = document.createElement("canvas");
  out.width = newW;
  out.height = newH;
  const ctx = out.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, newW, newH);
  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  ctx.drawImage(canvas, -W / 2, -H / 2);

  return out;
}

/** Otsu's method: threshold that maximises between-class variance. */
function otsuThreshold(hist: Uint32Array, total: number): number {
  let sum = 0;
  for (let v = 0; v < 256; v++) sum += v * hist[v];

  let sumB = 0;
  let wB = 0;
  let maxVar = -1;
  let threshold = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxVar) {
      maxVar = between;
      threshold = t;
    }
  }
  return threshold;
}

/**
 * Preprocess a user-selected image for OCR and return a canvas ready to feed to
 * Tesseract. The caller owns the canvas; it can be passed directly to
 * `recognizeImage`.
 */
export async function preprocessForOcr(
  file: File,
  options: PreprocessOptions = {}
): Promise<HTMLCanvasElement> {
  const opts = { ...DEFAULTS, ...options };
  const { img, url } = await decodeImage(file);
  try {
    const { width, height } = workingSize(
      img.naturalWidth,
      img.naturalHeight,
      opts.targetLongEdge,
      opts.maxUpscale
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Your browser blocked image processing (no canvas context).");

    // High-quality (bicubic) resampling — never nearest-neighbour, which leaves
    // stair-stepped edges the LSTM struggles with.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    toneMap(imageData.data, opts);
    ctx.putImageData(imageData, 0, 0);

    if (opts.deskew) {
      const angle = estimateDeskewAngle(canvas);
      return deskewCanvas(canvas, angle);
    }

    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}
