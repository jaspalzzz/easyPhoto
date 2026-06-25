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
}

const DEFAULTS: Required<PreprocessOptions> = {
  targetLongEdge: 2000,
  maxUpscale: 3,
  binarize: false,
  contrastStretch: true,
};

/** Rec.601 luma — the conventional grayscale weighting for OCR. */
function luma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
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

  // 1) Grayscale via Rec.601 luma, building a histogram as we go.
  const hist = new Uint32Array(256);
  for (let i = 0; i < n; i += 4) {
    const y = luma(data[i], data[i + 1], data[i + 2]) | 0;
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

    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}
