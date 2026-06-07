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

/**
 * Remove the background from a source image, returning an RGBA cutout canvas
 * drawn at the SOURCE dimensions (so all coordinates stay in source space,
 * matching the face measurements fed to computeCrop).
 */
export async function removeBg(
  source: Blob,
  size: { width: number; height: number }
): Promise<HTMLCanvasElement> {
  const { removeBackground } = await import("@imgly/background-removal");
  const cutBlob = await removeBackground(source, {
    // fp16 balances quality vs. speed; default output is a transparent PNG.
    model: "isnet_fp16",
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

// ── Premium matting on WebGPU (RMBG-1.4) ────────────────────────────────────
// onnxruntime/isnet OOMs on mobile (WASM heap). RMBG-1.4 via transformers.js on
// WebGPU runs on GPU memory instead, so it works on mobile that supports WebGPU.
// Privacy: only the model downloads (from Hugging Face); the image stays local.
// fp16 keeps GPU memory + download small enough for mobile GPUs.

/** True if the browser exposes a usable WebGPU adapter. */
export async function isWebGPUSupported(): Promise<boolean> {
  const gpu =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu
      : undefined;
  if (!gpu) return false;
  try {
    return !!(await gpu.requestAdapter());
  } catch {
    return false;
  }
}

/**
 * Whether the WebGPU adapter supports the `shader-f16` feature. fp16 models
 * fail at model-load on adapters without it ("device does not support fp16"),
 * so we fall back to the q8 model there.
 */
export async function webgpuSupportsF16(): Promise<boolean> {
  const gpu =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & {
          gpu?: {
            requestAdapter: () => Promise<{
              features?: { has: (f: string) => boolean };
            } | null>;
          };
        }).gpu
      : undefined;
  if (!gpu) return false;
  try {
    const adapter = await gpu.requestAdapter();
    return !!adapter?.features?.has("shader-f16");
  } catch {
    return false;
  }
}

/**
 * Human-readable WebGPU status — used only for on-screen diagnostics so we can
 * tell, from the phone, WHY the adapter is unavailable.
 */
export async function describeWebGPU(): Promise<string> {
  const gpu =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & {
          gpu?: {
            requestAdapter: (o?: unknown) => Promise<unknown>;
          };
        }).gpu
      : undefined;
  const ctx =
    typeof window !== "undefined" && "isSecureContext" in window
      ? (window as Window & { isSecureContext: boolean }).isSecureContext
      : "?";
  if (!gpu) return `no navigator.gpu (secureCtx=${ctx})`;
  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) {
      // Some devices only expose a software fallback; probe that too.
      try {
        const fb = await gpu.requestAdapter({ forceFallbackAdapter: true });
        return fb
          ? "adapter=null but fallback OK (GPU blocklisted)"
          : "adapter=null, no fallback (unsupported GPU)";
      } catch (e2) {
        return `adapter=null, fallback threw: ${(e2 as Error)?.message ?? e2}`;
      }
    }
    return "adapter OK";
  } catch (e) {
    return `requestAdapter threw: ${(e as Error)?.name}: ${(e as Error)?.message}`;
  }
}

// RMBG-1.4 is a CUSTOM architecture: its config.json has no standard model_type,
// so pipeline("image-segmentation", …) and AutoModel auto-resolution both fail
// with "unsupported model type". The supported path is AutoModel +
// AutoProcessor with explicit configs (model_type: "custom" + the processor
// settings RMBG-1.4 expects). We cache model + processor; failures reset so one
// error can't permanently disable the path.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rmbgModelPromise: Promise<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rmbgProcessorPromise: Promise<any> | null = null;
let rmbgProcessorSize = 0;
let rmbgModelKey = "";

async function getRMBG(opts: {
  device: string;
  dtype: string;
  inputSize: number;
  threads?: number;
}) {
  const transformers = await import("@huggingface/transformers");
  const { AutoModel, AutoProcessor } = transformers;
  // Constrain WASM threads BEFORE the session is created. Threaded ORT
  // pre-reserves a large SharedArrayBuffer; single-thread uses a smaller,
  // growable heap — the difference between fitting and OOM on iPhone 11.
  if (opts.device === "wasm" && opts.threads) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (transformers as any).env.backends.onnx.wasm.numThreads = opts.threads;
    } catch {
      /* env shape changed; ignore */
    }
  }
  const modelKey = `${opts.device}:${opts.dtype}:${opts.threads ?? 0}`;
  if (!rmbgModelPromise || rmbgModelKey !== modelKey) {
    rmbgModelKey = modelKey;
    rmbgModelPromise = AutoModel.from_pretrained("briaai/RMBG-1.4", {
      // webgpu (Android) is fast; wasm (iOS, where webgpu OOMs at model-load)
      // is universal. q8 keeps memory low; fp16 balances quality on GPU.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      device: opts.device as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dtype: opts.dtype as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: { model_type: "custom" } as any,
    }).catch((e: unknown) => {
      rmbgModelPromise = null;
      throw e;
    });
  }
  // RMBG/ISNet is fully convolutional, so the inference resolution is a free
  // memory↔quality knob. Low-RAM phones (e.g. iPhone 11) OOM at 1024², so we
  // run them smaller. If the requested size changes, rebuild the processor.
  if (!rmbgProcessorPromise || rmbgProcessorSize !== opts.inputSize) {
    rmbgProcessorSize = opts.inputSize;
    rmbgProcessorPromise = AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
      // RMBG-1.4 ships no preprocessor recognised by AutoProcessor, so supply it.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        image_std: [1, 1, 1],
        feature_extractor_type: "ImageFeatureExtractor",
        resample: 2,
        rescale_factor: 0.00392156862745098,
        size: { width: opts.inputSize, height: opts.inputSize },
      } as any,
    }).catch((e: unknown) => {
      rmbgProcessorPromise = null;
      throw e;
    });
  }
  const [model, processor] = await Promise.all([
    rmbgModelPromise,
    rmbgProcessorPromise,
  ]);
  return { model, processor };
}

/**
 * Premium background matting via WebGPU (RMBG-1.4). Returns an RGBA cutout canvas
 * at SOURCE dimensions (person opaque, background transparent) — same contract
 * as removeBg, so findCrownY/compositeFull are unchanged.
 */
export async function removeBgWebGPU(
  source: CanvasImageSource,
  size: { width: number; height: number },
  opts: {
    device?: string;
    dtype?: string;
    inputSize?: number;
    threads?: number;
  } = {}
): Promise<HTMLCanvasElement> {
  const device = opts.device ?? "webgpu";
  const dtype = opts.dtype ?? "fp16";
  const inputSize = opts.inputSize ?? 1024;

  // TEMP diagnostic: name the exact stage so an on-device failure says where.
  const stage = { at: "model-load" };

  try {
    const { model, processor } = await getRMBG({
      device,
      dtype,
      inputSize,
      threads: opts.threads,
    });
    const { RawImage } = await import("@huggingface/transformers");

    // Draw the ALREADY-DECODED source (an HTMLImageElement the store decoded for
    // face detection) onto a canvas. No fetch (blob: fetch dies under COEP on
    // Android Chrome) and no createImageBitmap (which throws InvalidStateError
    // on some Android/iOS browsers for valid JPEGs). Both proved fragile.
    stage.at = "decode";
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = size.width;
    srcCanvas.height = size.height;
    const sctx = srcCanvas.getContext("2d");
    if (!sctx) throw new Error("Could not acquire 2D canvas context.");
    sctx.drawImage(source, 0, 0, size.width, size.height);
    const rawImg = RawImage.fromCanvas(srcCanvas);

    // Preprocess → infer → model returns a single-channel alpha matte (0..1).
    stage.at = "preprocess";
    const { pixel_values } = await processor(rawImg);
    stage.at = "inference";
    const { output } = await model({ input: pixel_values });
    if (!output) throw new Error("RMBG-1.4 produced no output tensor.");
    stage.at = "compose";
    const maskImg = await RawImage.fromTensor(
      output[0].mul(255).to("uint8")
    ).resize(size.width, size.height);
    return finishCutout(srcCanvas, maskImg, size);
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    throw new Error(`[${stage.at}] ${msg}`);
  }
}

/** Apply the alpha matte to the source image at the target size. */
function finishCutout(
  srcCanvas: HTMLCanvasElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maskImg: any,
  size: { width: number; height: number }
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.drawImage(srcCanvas, 0, 0, size.width, size.height);

  const imgData = ctx.getImageData(0, 0, size.width, size.height);
  const d = imgData.data;
  const md: ArrayLike<number> = maskImg.data;
  const ch: number = maskImg.channels || 1;
  for (let i = 0; i < size.width * size.height; i++) {
    d[i * 4 + 3] = md[i * ch]; // mask value -> alpha (foreground opaque)
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
