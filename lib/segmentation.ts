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

// ── Premium matting via RMBG-1.4 (transformers.js) ──────────────────────────
// isnet (onnxruntime WASM) OOMs on mobile, so phones run RMBG-1.4 instead:
// webgpu/fp16 on f16-capable GPUs, otherwise the WASM runtime. Privacy: only
// the model downloads (from Hugging Face); the image never leaves the device.

/**
 * Whether the WebGPU adapter supports the `shader-f16` feature. fp16 models
 * fail at model-load on adapters without it ("device does not support fp16"),
 * so callers fall back to a WASM path there.
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

/**
 * Drop the cached RMBG model/processor so the WASM heap can be reclaimed.
 * The next run re-instantiates from the browser's HTTP cache (no re-download
 * on a warm cache) — a few seconds of setup traded for ~150MB of tab memory,
 * which is the difference between working and crashing on low-RAM iPhones.
 */
export function disposeRMBG(): void {
  const pending = rmbgModelPromise;
  rmbgModelPromise = null;
  rmbgProcessorPromise = null;
  rmbgProcessorSize = 0;
  rmbgModelKey = "";
  // Actually release the ORT InferenceSession. With wasm.proxy=true the model
  // lives in a Web Worker, so nulling the JS promise alone leaves the worker's
  // ~150MB WASM heap resident — the OOM guard would silently do nothing. The
  // model's dispose() releases the session (and signals the proxy worker).
  pending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.then((m: any) => m?.dispose?.())
    .catch(() => {
      /* model failed to load or has no dispose(); nothing to release */
    });
}

async function getRMBG(opts: {
  device: string;
  dtype: string;
  inputSize: number;
  threads?: number;
}) {
  const transformers = await import("@huggingface/transformers");
  const { AutoModel, AutoProcessor } = transformers;
  // Constrain WASM threads BEFORE the session is created. The threaded ORT
  // build allocates a large SharedArrayBuffer; single-thread uses a smaller,
  // growable heap — lower peak memory on constrained phones (iOS).
  if (opts.device === "wasm") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wasmEnv = (transformers as any).env?.backends?.onnx?.wasm;
      if (wasmEnv) {
        if (opts.threads) wasmEnv.numThreads = opts.threads;
        // Run ONNX in a Web Worker so inference NEVER blocks the main thread.
        // On low-end phones (iPhone 11, mid Android) a main-thread run froze the
        // whole page — couldn't scroll, the FAQ/footer stopped painting, and it
        // sometimes crashed. With numThreads=1 the heap stays small AND the UI
        // thread stays free. (Was previously false to save memory; the worker
        // copy is cheap next to keeping the page responsive.)
        wasmEnv.proxy = true;
      }
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

    // Build the model input at inputSize×inputSize ONLY. The network never sees
    // more than that, so loading a full 12–48MP photo into RawImage is wasted
    // memory (a 12MP photo = ~140MB float heap → OOM/crash on iOS Safari). A
    // small pre-resized canvas cuts that ~98%. We draw the already-decoded
    // source (HTMLImageElement) — no fetch (blob: dies under COEP on Android
    // Chrome) and no createImageBitmap (InvalidStateError on some browsers).
    stage.at = "decode";
    const modelCanvas = document.createElement("canvas");
    modelCanvas.width = inputSize;
    modelCanvas.height = inputSize;
    const mctx = modelCanvas.getContext("2d");
    if (!mctx) throw new Error("Could not acquire 2D canvas context.");
    mctx.drawImage(source, 0, 0, inputSize, inputSize);
    const rawImg = RawImage.fromCanvas(modelCanvas);

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
    // Compose at SOURCE resolution from the ORIGINAL image (full RGB quality)
    // with the mask upscaled to match — only here do we touch full dimensions.
    const cutout = await finishCutout(source, maskImg, size);
    // On the memory-tight path (iOS small-input wasm) drop the cached model
    // after a successful run: the session's WASM heap is the single biggest
    // allocation in the tab, and the weights re-load from HTTP cache if the
    // user runs again. Larger-input engines keep the cache (re-runs are
    // common and desktop/Android have headroom).
    if (inputSize <= 256) disposeRMBG();
    return cutout;
  } catch (e) {
    // Tag the failing stage for logs; the store turns this into a graceful
    // fallback (original background + notice), never a hard failure.
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    throw new Error(`[${stage.at}] ${msg}`);
  }
}

/**
 * Device-aware background removal for the STANDALONE tools (Background Remover,
 * White Background) — previously they called the untuned imgly path at full
 * resolution on the main thread, which lagged/crashed low-end phones. This routes
 * mobile through the same worker-backed, memory-tuned RMBG engines the passport
 * flow uses, falling back to imgly only on desktop (plenty of headroom there).
 *
 * NOTE: the engine matrix below MIRRORS the one in store/useToolStore.ts (the
 * sacred device matrix) — keep the two in sync. iOS → wasm/q8/256px single-
 * thread; Android f16 GPU → webgpu/fp16; other Android → wasm/fp32.
 */
export async function removeBgSmart(
  image: CanvasImageSource,
  blob: Blob,
  size: { width: number; height: number }
): Promise<HTMLCanvasElement> {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  if (isMobile) {
    const engines: {
      device: string;
      dtype: string;
      inputSize: number;
      threads?: number;
    }[] = isIOS
      ? [{ device: "wasm", dtype: "q8", inputSize: 256, threads: 1 }]
      : (await webgpuSupportsF16())
        ? [
            { device: "webgpu", dtype: "fp16", inputSize: 1024 },
            { device: "wasm", dtype: "fp32", inputSize: 1024 },
          ]
        : [{ device: "wasm", dtype: "fp32", inputSize: 1024 }];

    let lastErr: unknown;
    for (const eng of engines) {
      try {
        return await removeBgWebGPU(image, size, eng);
      } catch (e) {
        lastErr = e; // try the next candidate
      }
    }
    // Do NOT fall back to imgly on mobile — that's the full main-thread model
    // these phones can't run (the very thing that crashed them). Surface the
    // error so the tool shows its graceful "try again" state instead.
    throw lastErr ?? new Error("All mobile segmentation engines failed.");
  }

  // Desktop only: the full imgly model (plenty of headroom).
  return removeBg(blob, size);
}

/** Apply the alpha matte to the source image at the target size. */
async function finishCutout(
  source: CanvasImageSource,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maskImg: any,
  size: { width: number; height: number }
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.drawImage(source, 0, 0, size.width, size.height);

  const imgData = ctx.getImageData(0, 0, size.width, size.height);
  const d = imgData.data;
  const md: ArrayLike<number> = maskImg.data;
  const ch: number = maskImg.channels || 1;
  const total = size.width * size.height;
  // Apply the matte in ~1M-pixel slices, yielding to the event loop between
  // each. After inference (now off-thread in a worker) this per-pixel pass was
  // the only remaining main-thread step — running it in one burst caused a
  // visible blip at "the moment of output" on fast-GPU phones (Android).
  // Chunking turns a single ~50ms freeze into sub-frame slices the browser can
  // paint between, with negligible added latency.
  const CHUNK = 1_000_000;
  for (let start = 0; start < total; start += CHUNK) {
    const end = Math.min(total, start + CHUNK);
    for (let i = start; i < end; i++) {
      d[i * 4 + 3] = md[i * ch]; // mask value -> alpha (foreground opaque)
    }
    if (end < total) await new Promise((r) => setTimeout(r, 0));
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
