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
    // Self-hosted on R2 — keeps staticimgly.com out of the CSP and hides the
    // model identity from competitors. Assets live under the seg/imgly/ prefix
    // of the easyphoto-models bucket. Staging helper: scripts/prepare-imgly-folder.mjs
    publicPath: "https://models.easyphoto.in/seg/imgly/",
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
  // Un-spill old-background colour from the soft hair edge (same finish the RMBG
  // path gets), so the isnet fallback composites cleanly too.
  decontaminateForeground(canvas);
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
 * Foreground decontamination (edge un-spill) — operates on raw RGBA bytes.
 *
 * At a soft hair edge the cutout's colour is α·F + (1−α)·B_old, so the ORIGINAL
 * background colour is baked into every translucent pixel. Composited onto a NEW
 * background it resurfaces as a faint fringe — e.g. warm room light behind grey
 * hair shows up as a brown halo on a white passport. (This is the gap between
 * our output and a studio matte; a better MASK alone can't fix it because the
 * colour, not the alpha, is wrong.)
 *
 * Fix: nudge the COLOUR of translucent edge pixels toward the true foreground
 * colour bled in from the adjacent opaque hair, weighting neighbours by α² so
 * the trusted opaque pixels dominate. Alpha is left untouched, so soft wisps are
 * KEPT — only their contaminated colour is corrected. A few passes cover the
 * thin 1–3px fringe. Near-invisible outermost wisps (α below ~10%) are skipped:
 * they barely contribute to the composite and aren't worth smearing colour into.
 *
 * In-place, allocation-light (one Int32 index of the edge band), so it is safe
 * on the memory-tight mobile cutout path too.
 */
function decontaminateData(
  d: Uint8ClampedArray,
  w: number,
  h: number
): void {
  if (w < 3 || h < 3) return;
  const n = w * h;
  const LOW = 24; // below this α a pixel is ~invisible once composited
  const SOLID = 230; // at/above this α the colour is trusted true foreground
  const PASSES = 3;

  // Index the translucent edge band once (two passes: count, then fill).
  let count = 0;
  for (let i = 0; i < n; i++) {
    const a = d[i * 4 + 3];
    if (a >= LOW && a < SOLID) count++;
  }
  if (!count) return;
  const band = new Int32Array(count);
  let bi = 0;
  for (let i = 0; i < n; i++) {
    const a = d[i * 4 + 3];
    if (a >= LOW && a < SOLID) band[bi++] = i;
  }

  for (let p = 0; p < PASSES; p++) {
    for (let k = 0; k < count; k++) {
      const i = band[k];
      const x = i % w;
      const y = (i - x) / w;
      let sw = 0;
      let sr = 0;
      let sg = 0;
      let sb = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const j = (ny * w + nx) * 4;
          const an = d[j + 3] / 255;
          const wgt = an * an; // α²: opaque (true-FG) neighbours dominate
          if (wgt <= 0) continue;
          sw += wgt;
          sr += wgt * d[j];
          sg += wgt * d[j + 1];
          sb += wgt * d[j + 2];
        }
      }
      if (sw > 0) {
        const o = i * 4;
        d[o] = sr / sw;
        d[o + 1] = sg / sw;
        d[o + 2] = sb / sw;
      }
    }
  }
}

/**
 * Matte denoise (despeckle) — operates on raw RGBA bytes, ALPHA channel only.
 *
 * The model's matte is copied straight to the output alpha, so any per-pixel
 * speckle the model emits becomes visible grain. On low-contrast cases (grey
 * hair on a light background) the model is uncertain and the matte comes back
 * speckled — isolated pixels whose alpha jumps far from their neighbours. That
 * speckle IS the "noise" at the hair edge.
 *
 * We replace ONLY genuine outliers: a pixel whose alpha differs from its 3×3
 * median by more than OUTLIER is snapped to that median; everything else is left
 * exactly as-is. Crucially this is NOT a blur — consistent soft wisps (alpha
 * close to their neighbours) pass through untouched, and the certain interior
 * (α≈255) and exterior (α≈0) are skipped entirely, so a clean matte is a no-op.
 * That's why it fixes the noisy grey-hair case without degrading the 8 clean
 * ones. Snapshots alpha so the median always reads the ORIGINAL matte.
 */
function denoiseMatteData(d: Uint8ClampedArray, w: number, h: number): void {
  if (w < 3 || h < 3) return;
  const n = w * h;
  const LOW = 12; // ≤ this α is certain background — can't be edge speckle
  const HIGH = 243; // ≥ this α is certain foreground — leave solid hair alone
  const OUTLIER = 64; // α must deviate this far from the local median to count
  // Snapshot the alpha plane: the median must read the original matte, not the
  // partly-despeckled one, or corrections would cascade pixel-to-pixel.
  const a = new Uint8Array(n);
  for (let i = 0; i < n; i++) a[i] = d[i * 4 + 3];
  const m = new Uint8Array(9);
  for (let i = 0; i < n; i++) {
    const av = a[i];
    if (av <= LOW || av >= HIGH) continue; // only the uncertain band can speckle
    const x = i % w;
    const y = (i - x) / w;
    let c = 0;
    for (let dy = -1; dy <= 1; dy++) {
      const ny = y + dy < 0 ? 0 : y + dy >= h ? h - 1 : y + dy;
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx < 0 ? 0 : x + dx >= w ? w - 1 : x + dx;
        m[c++] = a[ny * w + nx];
      }
    }
    // Insertion sort of the 9 samples → median at index 4.
    for (let p = 1; p < 9; p++) {
      const v = m[p];
      let q = p - 1;
      while (q >= 0 && m[q] > v) {
        m[q + 1] = m[q];
        q--;
      }
      m[q + 1] = v;
    }
    const med = m[4];
    if (Math.abs(av - med) > OUTLIER) d[i * 4 + 3] = med;
  }
}

/**
 * Full matte cleanup applied to every cutout before compositing: despeckle the
 * alpha (kill model noise), then un-spill the old background colour from the
 * soft edge. Order matters — denoise the matte first so colour decontamination
 * reads a clean alpha band.
 */
function cleanCutoutData(d: Uint8ClampedArray, w: number, h: number): void {
  denoiseMatteData(d, w, h);
  decontaminateData(d, w, h);
}

/**
 * Canvas wrapper around {@link cleanCutoutData} for cutouts produced outside
 * finishCutout (the isnet/@imgly fallback). Reads the pixels, despeckles +
 * un-spills, writes them back. No-op-safe if the context can't be acquired.
 */
export function decontaminateForeground(cutout: HTMLCanvasElement): void {
  const ctx = cutout.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  const img = ctx.getImageData(0, 0, cutout.width, cutout.height);
  cleanCutoutData(img.data, cutout.width, cutout.height);
  ctx.putImageData(img, 0, 0);
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

// R2 folder for the self-hosted weights: models.easyphoto.in/<SEG_ID>/onnx/…
// The edge + every visitor's browser cache this URL ~forever (see public/_headers
// + the CF Cache Rule), and transformers.js does a HARD cache hit by URL with NO
// revalidation. So to ship a NEW model you MUST cache-bust by changing this id and
// uploading under the matching new R2 folder (e.g. "seg-v2/"). NEVER overwrite the
// files in place — returning users would be pinned to the stale model until their
// browser evicts it, which a Cloudflare purge cannot fix. Bump = clean rollout.
const SEG_ID = "seg";

// RMBG-1.4's image preprocessor settings. transformers REQUIRES a
// preprocessor_config.json to exist (a 404 throws, even though we also pass this
// inline to AutoProcessor). We deliberately do NOT host it on R2 — instead the
// fetch wrapper serves it synthetically from here, so there is ZERO Hugging Face
// traffic in normal operation (the model name never leaks) and no extra R2 object
// to keep in sync. `size` is a placeholder; the real per-call size is set inline.
const RMBG_PREPROCESSOR = {
  do_normalize: true,
  do_pad: false,
  do_rescale: true,
  do_resize: true,
  image_mean: [0.5, 0.5, 0.5],
  image_std: [1, 1, 1],
  feature_extractor_type: "ImageFeatureExtractor",
  resample: 2,
  rescale_factor: 0.00392156862745098,
  size: { width: 1024, height: 1024 },
};

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

  // Self-host the model on our own R2 domain under a NEUTRAL id ("seg"), so the
  // URL (models.easyphoto.in/seg/onnx/model_*.onnx) never reveals "briaai/RMBG-1.4"
  // and we don't depend on huggingface.co.
  // R2 layout: seg/onnx/{model_quantized,model_fp16,model}.onnx + seg/config.json
  //
  // The host is PINNED ONCE and never mutated. transformers builds each file URL
  // lazily from env.remoteHost at fetch time (config.json and model.onnx are
  // separate fetches), so flipping env.remoteHost mid-load — as an inline
  // R2→HF fallback used to — races with an in-flight "seg" load and resolves it
  // against the wrong host, producing bogus `huggingface.co/seg/...` 401s.
  // Instead the reliability fallback (R2 outage → Hugging Face, same weights)
  // lives in a fetch wrapper, so the host stays constant and the name never
  // leaks in the primary URL.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (transformers as any).env;
  if (env && !env.__epSegPinned) {
    env.__epSegPinned = true;
    env.allowRemoteModels = true;
    env.remoteHost = "https://models.easyphoto.in/";
    env.remotePathTemplate = "{model}/"; // {model}=SEG_ID → models.easyphoto.in/<SEG_ID>/<file>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const origFetch: typeof fetch = env.fetch
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        env.fetch.bind(env)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).fetch.bind(globalThis);
    const segFile = new RegExp(`/${SEG_ID}/(.+)$`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    env.fetch = async (input: any, init?: any) => {
      const url = typeof input === "string" ? input : input?.url ?? "";
      const m = segFile.exec(url);
      if (m) {
        const file = m[1]; // "onnx/model_quantized.onnx" | "config.json" | …
        // Serve the required preprocessor config from code — never the network —
        // so no Hugging Face request (and no model-name leak) ever fires for it.
        if (file === "preprocessor_config.json") {
          return new Response(JSON.stringify(RMBG_PREPROCESSOR), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        const isWeights = /\.onnx$/i.test(file);
        try {
          const res = await origFetch(
            `https://models.easyphoto.in/${SEG_ID}/${file}`,
            init
          );
          if (res.ok) return res;
          // 404 on a NON-weight file (e.g. preprocessor_config.json, which we
          // don't host because the config is supplied inline) means "absent on
          // R2", not "R2 down". Return the 404 so transformers uses the inline
          // config — do NOT fall through to Hugging Face, which would leak the
          // model name in the network on every run. Only weights (and server
          // errors) get the reliability mirror below.
          if (res.status === 404 && !isWeights) return res;
        } catch {
          /* R2 unreachable — fall through to the mirror below */
        }
        // Silent reliability fallback: identical weights, different origin. Only
        // fires if R2 is genuinely down (network error / 5xx) or a weight file is
        // missing; the model name is never surfaced in the primary URL.
        // NOTE: keep this mirror in sync with whatever weights SEG_ID points at.
        return origFetch(
          `https://huggingface.co/briaai/RMBG-1.4/resolve/main/${file}`,
          init
        );
      }
      return origFetch(input, init);
    };
  }

  const modelKey = `${opts.device}:${opts.dtype}:${opts.threads ?? 0}`;
  if (!rmbgModelPromise || rmbgModelKey !== modelKey) {
    rmbgModelKey = modelKey;
    rmbgModelPromise = AutoModel.from_pretrained(SEG_ID, {
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
    // Neutral id; the preprocessor_config.json fetch is served synthetically by
    // the fetch wrapper above (from RMBG_PREPROCESSOR), and we also pass the
    // config inline here — so the processor never reaches the network and no
    // model name leaks regardless of source.
    rmbgProcessorPromise = AutoProcessor.from_pretrained(SEG_ID, {
      // RMBG-1.4 ships no preprocessor recognised by AutoProcessor, so supply it.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: {
        ...RMBG_PREPROCESSOR,
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
 * thread; Android f16 GPU → webgpu/fp16; other Android → wasm/q8 @ 1024px.
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
            { device: "wasm", dtype: "q8", inputSize: 1024 },
          ]
        : [{ device: "wasm", dtype: "q8", inputSize: 1024 }];

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

  // Desktop: RMBG-1.4 (BiRefNet) first — significantly better hair/fine-edge
  // quality than imgly's ISNet. WebGPU fp16 on capable GPUs, WASM q8 fallback,
  // then imgly as a final safety net if both RMBG paths fail.
  // 2048px inference on WebGPU = a ~4× sharper matte (crisper hair edges, less
  // upscaling haze) than 1024px; desktop GPUs have the headroom. Falls through
  // to 1024 GPU then wasm/1024 if a weak GPU can't fit it — never a regression.
  const desktopEngines: { device: string; dtype: string; inputSize: number }[] =
    (await webgpuSupportsF16())
      ? [
          { device: "webgpu", dtype: "fp16", inputSize: 2048 },
          { device: "webgpu", dtype: "fp16", inputSize: 1024 },
          { device: "wasm", dtype: "q8", inputSize: 1024 },
        ]
      : [{ device: "wasm", dtype: "q8", inputSize: 1024 }];

  for (const eng of desktopEngines) {
    try {
      return await removeBgWebGPU(image, size, eng);
    } catch {
      /* try next engine */
    }
  }
  // imgly/ISNet: universally available, lower hair quality, reliable fallback.
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
  // (A de-halo alpha curve was tried here but didn't help: the artifact is the
  // model keeping OPAQUE background near wispy hair, not a soft fringe — an
  // alpha curve can't remove fully-opaque pixels. Reverted to a direct copy.)
  const CHUNK = 1_000_000;
  for (let start = 0; start < total; start += CHUNK) {
    const end = Math.min(total, start + CHUNK);
    for (let i = start; i < end; i++) {
      d[i * 4 + 3] = md[i * ch]; // mask value -> alpha (foreground opaque)
    }
    if (end < total) await new Promise((r) => setTimeout(r, 0));
  }
  // Clean the matte before compositing: despeckle the model's alpha (kills the
  // grey-hair noise) then un-spill the old background colour from the soft edge.
  // Reuses the buffer we already hold — no extra getImageData on this hot,
  // mobile-shared path.
  cleanCutoutData(d, size.width, size.height);
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
