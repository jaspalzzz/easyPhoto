import type { DetectionResult } from "./faceDetection";

/**
 * Background segmentation — @imgly/background-removal.
 * ---------------------------------------------------
 * Runs an ONNX model fully client-side to cut the person out of the photo.
 * We use the cutout for two things:
 *   1. Background replacement — composite the person over spec.background.hex.
 *   2. crownY — the PREFERRED crown measurement. Landmark models can't see
 *      through hair, but the cutout's alpha mask can: within the head's
 *      horizontal span, the topmost opaque pixel IS the true top of the head.
 *
 * Privacy: the model + wasm download from a CDN (assets only). NO image bytes
 * ever leave the device — inference is local.
 *
 * Lazy-loaded so the (heavy) model never blocks first paint.
 */

// ── Person segmentation via MediaPipe ImageSegmenter (selfie) ───────────────
// The passport pipeline uses this instead of the heavy onnxruntime model: the
// MediaPipe selfie model is ~250KB and runs in the SAME wasm runtime that face
// detection already uses, so it stays within iOS Safari's memory limit (the
// onnxruntime model OOMs on iPhone). The cutout contract is identical to
// removeBg, so findCrownY/compositeFull are unchanged.
const SEG_WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const SELFIE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let segmenterPromise: Promise<any> | null = null;
async function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { FilesetResolver, ImageSegmenter } = await import(
        "@mediapipe/tasks-vision"
      );
      const fileset = await FilesetResolver.forVisionTasks(SEG_WASM_BASE);
      return ImageSegmenter.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: SELFIE_MODEL_URL, delegate: "GPU" },
        runningMode: "IMAGE",
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      });
    })();
  }
  return segmenterPromise;
}

/**
 * Helper: O(N) 2D box filter using horizontal and vertical sliding window passes.
 * Exported for testing.
 */
export function boxFilter2D(src: Float32Array, w: number, h: number, r: number, dest: Float32Array) {
  const temp = new Float32Array(w * h);

  // Horizontal blur
  for (let y = 0; y < h; y++) {
    const rowOffset = y * w;
    let sum = 0;

    // Initialize window
    for (let x = -r; x <= r; x++) {
      const px = Math.max(0, Math.min(w - 1, x));
      sum += src[rowOffset + px];
    }

    for (let x = 0; x < w; x++) {
      temp[rowOffset + x] = sum / (2 * r + 1);

      const nextX = Math.min(w - 1, x + r + 1);
      const prevX = Math.max(0, x - r);
      sum += src[rowOffset + nextX] - src[rowOffset + prevX];
    }
  }

  // Vertical blur
  for (let x = 0; x < w; x++) {
    let sum = 0;

    // Initialize window
    for (let y = -r; y <= r; y++) {
      const py = Math.max(0, Math.min(h - 1, y));
      sum += temp[py * w + x];
    }

    for (let y = 0; y < h; y++) {
      dest[y * w + x] = sum / (2 * r + 1);

      const nextY = Math.min(h - 1, y + r + 1);
      const prevY = Math.max(0, y - r);
      sum += temp[nextY * w + x] - temp[prevY * w + x];
    }
  }
}

/**
 * Cut the person out of the photo with MediaPipe selfie segmentation refined via Fast Guided Filter.
 * Returns an RGBA canvas at SOURCE dimensions (person opaque, background transparent) — the
 * same contract as removeBg, so the rest of the pipeline is untouched.
 */
export async function segmentPerson(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  size: { width: number; height: number },
  measurements?: DetectionResult
): Promise<HTMLCanvasElement> {
  const segmenter = await getSegmenter();
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.drawImage(image as CanvasImageSource, 0, 0, size.width, size.height);

  const result = segmenter.segment(image);
  const mask = result.confidenceMasks?.[0];
  if (!mask) {
    result.close?.();
    throw new Error("Segmentation produced no mask.");
  }
  const conf: Float32Array = mask.getAsFloat32Array();
  const mw: number = mask.width;
  const mh: number = mask.height;

  // 1. Get downsampled grayscale guidance image
  const subCanvas = document.createElement("canvas");
  subCanvas.width = mw;
  subCanvas.height = mh;
  const subCtx = subCanvas.getContext("2d");
  if (!subCtx) throw new Error("Could not acquire 2D sub-canvas context.");
  subCtx.imageSmoothingEnabled = true;
  subCtx.imageSmoothingQuality = "high";
  subCtx.drawImage(image as CanvasImageSource, 0, 0, mw, mh);
  const subImgData = subCtx.getImageData(0, 0, mw, mh);
  const subD = subImgData.data;

  const I_sub = new Float32Array(mw * mh);
  for (let i = 0; i < mw * mh; i++) {
    const r = subD[i * 4] / 255;
    const g = subD[i * 4 + 1] / 255;
    const b = subD[i * 4 + 2] / 255;
    I_sub[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // 2. Prepare clean low-res starting mask using smoothstep
  const LO = 0.4;
  const HI = 0.62;
  const span = HI - LO;
  const p_sub = new Float32Array(mw * mh);
  for (let i = 0; i < mw * mh; i++) {
    const c = conf[i];
    let t = (c - LO) / span;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    p_sub[i] = t * t * (3 - 2 * t);
  }

  // Restrict mask to the head/shoulders region using face landmarks to discard background clutter (like headphones)
  if (measurements) {
    const scaleX = mw / size.width;
    const scaleY = mh / size.height;
    const lowResFaceCenterX = measurements.faceCenterX * scaleX;
    const lowResChinY = measurements.chinY * scaleY;
    const lowResFaceWidth = Math.max(10, (measurements.faceXSpan.max - measurements.faceXSpan.min) * scaleX);

    // Width boundaries: head is approx face width * 0.95 on each side of center
    const headHalfWidth = lowResFaceWidth * 0.95;
    const transitionWidth = lowResFaceWidth * 0.25;
    const maxHalfWidth = lowResFaceWidth * 1.25;

    for (let i = 0; i < mw * mh; i++) {
      const row = Math.floor(i / mw);
      const col = i % mw;

      let halfWidth = headHalfWidth;
      if (row > lowResChinY) {
        // Widen constraint downwards to accommodate shoulders
        halfWidth += (row - lowResChinY) * 0.45;
      }
      halfWidth = Math.min(maxHalfWidth, halfWidth);

      const dx = Math.abs(col - lowResFaceCenterX);
      let weight = 1.0;
      if (dx > halfWidth) {
        if (dx > halfWidth + transitionWidth) {
          weight = 0.0;
        } else {
          weight = 1.0 - (dx - halfWidth) / transitionWidth;
        }
      }
      p_sub[i] *= weight;
    }
  }


  // 3. Compute Fast Guided Filter coefficients (a and b) in the downsampled domain
  const r_filter = 4; // filter radius
  const eps = 1e-4;   // regularization parameter

  const II = new Float32Array(mw * mh);
  const Ip = new Float32Array(mw * mh);
  for (let i = 0; i < mw * mh; i++) {
    II[i] = I_sub[i] * I_sub[i];
    Ip[i] = I_sub[i] * p_sub[i];
  }

  const mean_I = new Float32Array(mw * mh);
  const mean_p = new Float32Array(mw * mh);
  const mean_II = new Float32Array(mw * mh);
  const mean_Ip = new Float32Array(mw * mh);

  boxFilter2D(I_sub, mw, mh, r_filter, mean_I);
  boxFilter2D(p_sub, mw, mh, r_filter, mean_p);
  boxFilter2D(II, mw, mh, r_filter, mean_II);
  boxFilter2D(Ip, mw, mh, r_filter, mean_Ip);

  const a = new Float32Array(mw * mh);
  const b = new Float32Array(mw * mh);
  for (let i = 0; i < mw * mh; i++) {
    const varI = mean_II[i] - mean_I[i] * mean_I[i];
    const covIp = mean_Ip[i] - mean_I[i] * mean_p[i];
    a[i] = covIp / (varI + eps);
    b[i] = mean_p[i] - a[i] * mean_I[i];
  }

  const mean_a = new Float32Array(mw * mh);
  const mean_b = new Float32Array(mw * mh);
  boxFilter2D(a, mw, mh, r_filter, mean_a);
  boxFilter2D(b, mw, mh, r_filter, mean_b);

  // 4. Upsample coefficients bilinearly and apply the linear model at original resolution
  const imgData = ctx.getImageData(0, 0, size.width, size.height);
  const d = imgData.data;

  const sx = size.width > 1 ? (mw - 1) / (size.width - 1) : 0;
  const sy = size.height > 1 ? (mh - 1) / (size.height - 1) : 0;

  for (let y = 0; y < size.height; y++) {
    const gy = y * sy;
    const y0 = Math.floor(gy);
    const y1 = Math.min(mh - 1, y0 + 1);
    const ty = gy - y0;

    const rowOffset_y0 = y0 * mw;
    const rowOffset_y1 = y1 * mw;
    const rowOffset_orig = y * size.width;

    for (let x = 0; x < size.width; x++) {
      const gx = x * sx;
      const x0 = Math.floor(gx);
      const x1 = Math.min(mw - 1, x0 + 1);
      const tx = gx - x0;

      // Bilinear interpolation for mean_a
      const w00_a = mean_a[rowOffset_y0 + x0];
      const w10_a = mean_a[rowOffset_y0 + x1];
      const w01_a = mean_a[rowOffset_y1 + x0];
      const w11_a = mean_a[rowOffset_y1 + x1];
      const val_a = (w00_a * (1 - tx) + w10_a * tx) * (1 - ty) + (w01_a * (1 - tx) + w11_a * tx) * ty;

      // Bilinear interpolation for mean_b
      const w00_b = mean_b[rowOffset_y0 + x0];
      const w10_b = mean_b[rowOffset_y0 + x1];
      const w01_b = mean_b[rowOffset_y1 + x0];
      const w11_b = mean_b[rowOffset_y1 + x1];
      const val_b = (w00_b * (1 - tx) + w10_b * tx) * (1 - ty) + (w01_b * (1 - tx) + w11_b * tx) * ty;

      // Get high-res grayscale guidance I_val
      const idx = (rowOffset_orig + x) * 4;
      const r = d[idx] / 255;
      const g = d[idx + 1] / 255;
      const b = d[idx + 2] / 255;
      const I_val = 0.299 * r + 0.587 * g + 0.114 * b;

      // Linear model: q = a * I + b
      const q = val_a * I_val + val_b;

      // Set alpha channel (clamped to [0, 255])
      d[idx + 3] = Math.max(0, Math.min(255, q * 255)) | 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  mask.close?.();
  result.close?.();
  return canvas;
}

/**
 * Remove the background from a source image, returning an RGBA cutout canvas
 * drawn at the SOURCE dimensions (so all coordinates stay in source space,
 * matching the face measurements fed to computeCrop).
 */
export async function removeBg(
  source: Blob,
  size: { width: number; height: number },
  // fp16 = best quality (desktop). quint8 = ~half the memory (memory-constrained
  // mobile). The caller can step down the ladder if fp16 runs out of memory.
  model: "isnet_fp16" | "isnet_quint8" = "isnet_fp16"
): Promise<HTMLCanvasElement> {
  const { removeBackground } = await import("@imgly/background-removal");
  const cutBlob = await removeBackground(source, {
    model,
    output: { format: "image/png" },
  });

  const bitmap = await createImageBitmap(cutBlob);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  // Draw scaled to source dims in case the model returned a different size.
  ctx.drawImage(bitmap, 0, 0, size.width, size.height);
  bitmap.close?.();
  return canvas;
}

/**
 * Topmost opaque pixel of the cutout within the head's horizontal span = crownY.
 * Requires a small run of opaque pixels per row to ignore stray mask specks.
 *
 * @returns crownY in source pixels, or null if no opaque region is found.
 */
export function findCrownY(
  cutout: HTMLCanvasElement,
  xSpan: { min: number; max: number },
  opts: { alphaThreshold?: number } = {}
): number | null {
  const alphaThreshold = opts.alphaThreshold ?? 128;
  const w = cutout.width;
  const h = cutout.height;
  const ctx = cutout.getContext("2d");
  if (!ctx) return null;

  // Constrain the search to the head's horizontal span (a little padding helps
  // catch hair that flares wider than the face oval).
  const pad = Math.round((xSpan.max - xSpan.min) * 0.1);
  const x0 = Math.max(0, Math.floor(xSpan.min - pad));
  const x1 = Math.min(w - 1, Math.ceil(xSpan.max + pad));
  const spanW = Math.max(1, x1 - x0 + 1);
  // Require ~2% of the span (min 3px) opaque to count as real head, not noise.
  const minRun = Math.max(3, Math.round(spanW * 0.02));

  const { data } = ctx.getImageData(x0, 0, spanW, h);
  for (let y = 0; y < h; y++) {
    let opaque = 0;
    const rowStart = y * spanW * 4;
    for (let i = 0; i < spanW; i++) {
      if (data[rowStart + i * 4 + 3] >= alphaThreshold) {
        if (++opaque >= minRun) return y;
      }
    }
  }
  return null;
}

/**
 * Composite a cutout over the spec background colour at full source dimensions.
 * The result is a fully-opaque image (spec bg behind the person) that the crop
 * + Pica resize then operate on — so the exported photo has the correct,
 * per-country background. NEVER hardcode white here.
 */
export function compositeFull(
  cutout: HTMLCanvasElement,
  hex: string
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = cutout.width;
  out.height = cutout.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(cutout, 0, 0);
  return out;
}

/**
 * Detect WebGPU support in the browser.
 */
export async function isWebGPUSupported(): Promise<boolean> {
  const nav = typeof navigator !== "undefined" ? (navigator as any) : undefined;
  if (typeof window === "undefined" || !nav || !nav.gpu) {
    return false;
  }
  try {
    const adapter = await nav.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rmbgPipelinePromise: Promise<any> | null = null;
async function getRMBGPipeline() {
  if (!rmbgPipelinePromise) {
    const { pipeline } = await import("@huggingface/transformers");
    rmbgPipelinePromise = pipeline("image-segmentation", "briaai/RMBG-1.4", {
      device: "webgpu",
      dtype: "fp32", // Safe for mobile WebGPU
    });
  }
  return rmbgPipelinePromise;
}

/**
 * Remove the background from a source image using WebGPU-accelerated briaai/RMBG-1.4.
 * Returns an RGBA cutout canvas drawn at the SOURCE dimensions.
 */
export async function removeBgWebGPU(
  source: Blob,
  size: { width: number; height: number }
): Promise<HTMLCanvasElement> {
  const pipe = await getRMBGPipeline();

  const imgUrl = URL.createObjectURL(source);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawImg: any;
  try {
    const { RawImage: RawImageClass } = await import("@huggingface/transformers");
    rawImg = await RawImageClass.fromURL(imgUrl);
  } finally {
    URL.revokeObjectURL(imgUrl);
  }

  // Run image segmentation
  const result = await pipe(rawImg);

  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");

  // Draw the original image to get the color pixels
  const srcCanvas = rawImg.toCanvas();
  ctx.drawImage(srcCanvas, 0, 0, size.width, size.height);

  const imgData = ctx.getImageData(0, 0, size.width, size.height);
  const d = imgData.data;

  // The result of briaai/RMBG-1.4 is usually an array of segment objects
  const maskImg = Array.isArray(result) ? result[0].mask : result.mask;
  if (!maskImg) {
    throw new Error("RMBG-1.4 output contains no mask.");
  }

  // Resize mask to match original image dimensions
  const resizedMask = await maskImg.resize(size.width, size.height);
  const maskData = resizedMask.data;
  const channels = resizedMask.channels || 1;

  // Set the alpha channel based on the mask
  for (let i = 0; i < size.width * size.height; i++) {
    d[i * 4 + 3] = maskData[i * channels];
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
