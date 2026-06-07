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
 * Cut the person out of the photo with MediaPipe selfie segmentation. Returns an
 * RGBA canvas at SOURCE dimensions (person opaque, background transparent) — the
 * same contract as removeBg, so the rest of the pipeline is untouched.
 */
export async function segmentPerson(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  size: { width: number; height: number }
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

  const imgData = ctx.getImageData(0, 0, size.width, size.height);
  const d = imgData.data;
  // Smoothly upsample the coarse (e.g. 256²) confidence mask with BILINEAR
  // sampling, then run a smoothstep so low-confidence background speckle drops
  // to fully transparent and the person edge is a soft, clean transition
  // instead of a jagged/blocky cutout.
  const sx = mw / size.width;
  const sy = mh / size.height;
  const LO = 0.4;
  const HI = 0.62;
  const span = HI - LO;
  for (let y = 0; y < size.height; y++) {
    const fy = Math.min(mh - 1.001, y * sy);
    const y0 = fy | 0;
    const ty = fy - y0;
    const r0 = y0 * mw;
    const r1 = Math.min(mh - 1, y0 + 1) * mw;
    for (let x = 0; x < size.width; x++) {
      const fx = Math.min(mw - 1.001, x * sx);
      const x0 = fx | 0;
      const tx = fx - x0;
      const x1 = Math.min(mw - 1, x0 + 1);
      const top = conf[r0 + x0] * (1 - tx) + conf[r0 + x1] * tx;
      const bot = conf[r1 + x0] * (1 - tx) + conf[r1 + x1] * tx;
      const c = top * (1 - ty) + bot * ty; // bilinear-sampled confidence
      let t = (c - LO) / span;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const a = t * t * (3 - 2 * t); // smoothstep
      d[(y * size.width + x) * 4 + 3] = (a * 255) | 0;
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
