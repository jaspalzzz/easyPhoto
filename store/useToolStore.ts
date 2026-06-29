/**
 * Tool state — Zustand, IN-MEMORY ONLY.
 * -------------------------------------
 * Hard privacy rule: image data lives here in memory and nowhere else. NO
 * localStorage / IndexedDB persistence of photos. Nothing is uploaded.
 */

import { create } from "zustand";
import { renderSpec as toRenderSpec, type CountrySpec } from "@/lib/countrySpecs";
import type { CropRect, CropResult } from "@/lib/headPositioning";
import { recommendedDigitalDpi } from "@/lib/headPositioning";
import {
  detectFace,
  disposeLandmarker,
  FaceDetectionError,
  NoFaceError,
  type DetectionResult,
} from "@/lib/faceDetection";
import {
  buildPreset,
  buildPresetFromCrop,
  loadImageFromFile,
  canvasToObjectURL,
} from "@/lib/pipeline";
import {
  removeBg,
  removeBgWebGPU,
  webgpuSupportsF16,
  findCrownY,
  compositeFull,
} from "@/lib/segmentation";
import { ensureDecodable } from "@/lib/heic";
import { track, deviceClass, type EngineLabel } from "@/lib/analytics";

/**
 * Upper bound for a single segmentation attempt. webgpu/fp16 finishes in
 * seconds; wasm/fp32 on a weak CPU can legitimately take ~30–60s, so this is
 * generous. A timeout just triggers the next engine / graceful fallback — it
 * never strands the user on the spinner.
 */
const SEGMENTATION_TIMEOUT_MS = 120_000;

/** One background-removal engine configuration (RMBG-1.4 via transformers.js). */
interface SegEngine {
  device: string;
  dtype: string;
  inputSize: number;
  threads?: number;
}

/** Map an engine config to its analytics label. */
function engineToLabel(e: SegEngine): EngineLabel {
  if (e.device === "webgpu" && e.dtype === "fp16") return "webgpu-fp16";
  if (e.device === "wasm" && e.dtype === "fp32") return "wasm-fp32";
  if (e.device === "wasm" && e.dtype === "q8") return "wasm-q8";
  return "none";
}

/** Reject with a friendly message if a promise doesn't settle in time. */
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new FaceDetectionError(message)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

export type ToolStatus =
  | "idle"
  | "loading"
  | "detecting"
  | "segmenting"
  | "rendering"
  | "ready"
  | "error";

/**
 * Why processing failed — drives the recovery UI. "no-face" offers crop-and-
 * retry; "timeout" offers a plain retry; "error" is a generic dead-end.
 */
export type ToolErrorKind = "no-face" | "timeout" | "error";

export interface Preset {
  result: CropResult;
  canvas: HTMLCanvasElement;
  dpi: number;
  previewUrl: string;
}

interface ToolState {
  spec: CountrySpec | null;
  status: ToolStatus;
  error: string | null;
  errorKind: ToolErrorKind | null;

  sourceUrl: string | null;
  sourceImage: HTMLImageElement | null;
  sourceFile: File | null;
  sourceSize: { width: number; height: number } | null;
  measurements: DetectionResult | null;

  /** Raw RGBA person cutout at source dims — re-composited when bg changes. */
  cutout: HTMLCanvasElement | null;
  /** Person cutout over the spec background, at source dims (Phase 2). */
  composite: HTMLCanvasElement | null;
  compositeUrl: string | null;
  /** True once background removal succeeded; false means Phase-1 fallback. */
  segmented: boolean;
  segmentationFailed: boolean;

  print: Preset | null;
  digital: Preset | null;

  /** A photo chosen in the hero, to be processed once the country page mounts. */
  pendingFile: File | null;
  brightness: number;
  contrast: number;

  setSpec: (spec: CountrySpec) => void;
  setPendingFile: (file: File | null) => void;
  setBrightness: (b: number) => void;
  setContrast: (c: number) => void;
  processFile: (file: File) => Promise<void>;
  applyManualCrop: (cropRect: CropRect) => Promise<void>;
  cropAndRetry: (cropRect: CropRect) => Promise<void>;
  recomputeAuto: () => Promise<void>;
  reset: () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
  spec: null,
  status: "idle",
  error: null,
  errorKind: null,
  sourceUrl: null,
  sourceImage: null,
  sourceFile: null,
  sourceSize: null,
  measurements: null,
  cutout: null,
  composite: null,
  compositeUrl: null,
  segmented: false,
  segmentationFailed: false,
  print: null,
  digital: null,
  pendingFile: null,
  brightness: 100,
  contrast: 100,

  setPendingFile: (file) => set({ pendingFile: file }),

  setBrightness: (b) => {
    set({ brightness: b });
    void rebuildPresets(set, get);
  },

  setContrast: (c) => {
    set({ contrast: c });
    void rebuildPresets(set, get);
  },

  setSpec: (spec) => {
    const prev = get();
    set({ spec });
    if (prev.sourceImage && prev.measurements) {
      // Re-composite the cutout over the new country's background, then rerun.
      if (prev.cutout) {
        if (prev.compositeUrl) URL.revokeObjectURL(prev.compositeUrl);
        const composite = compositeFull(prev.cutout, spec.background.hex);
        // Object URL is async; set the canvas now, swap the URL in when ready.
        set({ composite, compositeUrl: null });
        void canvasToObjectURL(composite).then((compositeUrl) => {
          if (get().composite === composite) set({ compositeUrl });
          else URL.revokeObjectURL(compositeUrl);
        });
      }
      void rebuildPresets(set, get);
    }
  },

  processFile: async (file) => {
    const state = get();
    if (!state.spec) {
      set({ status: "error", error: "Pick a country first." });
      return;
    }
    if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl);
    if (state.compositeUrl) URL.revokeObjectURL(state.compositeUrl);
    // Preview URLs are now object URLs — revoke the previous ones too so a new
    // upload (without an explicit reset) doesn't leak them.
    if (state.print?.previewUrl) URL.revokeObjectURL(state.print.previewUrl);
    if (state.digital?.previewUrl) URL.revokeObjectURL(state.digital.previewUrl);

    set({
      status: "loading",
      error: null,
      errorKind: null,
      print: null,
      digital: null,
      measurements: null,
      cutout: null,
      composite: null,
      compositeUrl: null,
      segmented: false,
      segmentationFailed: false,
      sourceFile: file,
      brightness: 100,
      contrast: 100,
    });

    // Privacy-safe analytics: anonymous outcome only — no file/photo data.
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    const dev = deviceClass();
    let usedEngine: EngineLabel = "none";
    track({ name: "tool_start", tool: "passport-photo", device: dev });

    try {
      // iPhone HEIC → JPEG (no-op for already-decodable formats).
      const decodable = await ensureDecodable(file);
      set({ sourceFile: decodable });
      const { image, size, url } = await loadImageFromFile(decodable);
      set({ sourceImage: image, sourceSize: size, sourceUrl: url });

      set({ status: "detecting" });
      // Bound detection so a stalled model/inference can never strand the user
      // on an endless spinner. Generous (covers slow first-run model downloads).
      const measurements = await withTimeout(
        detectFace(image, size),
        90_000,
        "Face detection timed out. Check your connection and try a smaller, clearer photo."
      );

      // Segmentation: real background removal + the PREFERRED crownY.
      set({ status: "segmenting" });
      // Engine choice is about device MEMORY, not quality preference. Every path
      // is 100% on-device; only the model downloads (never the photo).
      //   • Desktop            → RMBG-1.4 (BiRefNet): webgpu/fp16 if the GPU has
      //                          it, else wasm/fp32 @ 1024px (desktop RAM has
      //                          headroom). Far cleaner HAIR/fine-edge matting
      //                          than isnet, which leaves opaque background
      //                          islands in wispy/curly/grey hair. isnet (@imgly)
      //                          stays as the final reliability fallback (it is on
      //                          a different model CDN, so a single-CDN outage of
      //                          one engine is still recoverable).
      //   • Android, f16 GPU   → RMBG-1.4 webgpu/fp16. Fast + premium.   [Redmi]
      //   • Android, no f16    → RMBG-1.4 wasm/q8 @ 1024px. q8 keeps FULL
      //                          resolution but is ~4× lighter+faster than fp32,
      //                          which intermittently OOM'd low-RAM Android
      //                          (e.g. 6GB MIUI: only ~1/3 runs completed at
      //                          fp32). (q8-on-webgpu corrupts; fp32-on-webgpu
      //                          crashes those GPUs.)                     [OnePlus]
      //   • iOS                → RMBG-1.4 wasm/q8, single-thread, small input.
      //                          Safari tab memory is tight; this is the lightest
      //                          path. Old 4GB iPhones still can't fit it and
      //                          fall back gracefully below; iPhone 12+ succeed.
      const ua =
        typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      // Ordered engine candidates: try the best for the device, then fall back
      // at RUNTIME if it throws (a GPU can pass the capability probe yet fail
      // mid-inference — e.g. device-lost). Each attempt is time-bounded.
      const engines: SegEngine[] = [];
      if (isMobile) {
        if (isIOS) {
          engines.push({ device: "wasm", dtype: "q8", inputSize: 256, threads: 1 });
        } else if (await webgpuSupportsF16()) {
          engines.push({ device: "webgpu", dtype: "fp16", inputSize: 1024 });
          // If the GPU dies mid-run, the q8 model on CPU still produces a clean
          // cutout at full 1024px (lighter than fp32 → fits low-RAM Android).
          engines.push({ device: "wasm", dtype: "q8", inputSize: 1024 });
        } else {
          engines.push({ device: "wasm", dtype: "q8", inputSize: 1024 });
        }
      }
      // Detection is done; on mobile, free MediaPipe (GPU+WASM) BEFORE loading
      // the segmentation runtime so the two don't fight for the tab's memory
      // budget — important on low-memory phones.
      if (isMobile && engines.length) {
        await disposeLandmarker();
      }
      try {
        let cutout: HTMLCanvasElement | null = null;
        if (isMobile && engines.length) {
          let lastErr: unknown = null;
          for (const eng of engines) {
            try {
              // Pass the already-decoded image (no re-decode / no fetch).
              cutout = await withTimeout(
                removeBgWebGPU(image, size, eng),
                SEGMENTATION_TIMEOUT_MS,
                "Background removal timed out."
              );
              usedEngine = engineToLabel(eng);
              break;
            } catch (e) {
              lastErr = e;
              console.warn(
                `Segmentation engine ${eng.device}/${eng.dtype} failed; trying next.`,
                e
              );
            }
          }
          if (!cutout) throw lastErr ?? new Error("All segmentation engines failed.");
        } else {
          // Desktop: RMBG-1.4 (BiRefNet) is the PRIMARY — it mattes hair and
          // fine edges far more cleanly than isnet, which retains opaque
          // background islands in wispy/curly/grey hair (the visible artifact on
          // the passport maker, our USP tool). Try the best engine for the GPU,
          // then fall back at runtime: webgpu/fp16 → wasm/fp32 (desktop RAM has
          // headroom for full precision) → isnet (@imgly). isnet remains the
          // final safety net because its model is on a DIFFERENT CDN, so a
          // single-CDN stall of either engine is still recoverable. This does NOT
          // touch the mobile branch above (the iOS/Android engine matrix).
          // inputSize is the inference resolution: the model emits an
          // inputSize² matte that is then upscaled to the source photo. At
          // 1024px any larger photo gets a bilinearly-stretched (soft) matte —
          // the gray "haze" around hair. Desktop GPUs have the headroom to run
          // RMBG at 2048px, giving a ~4× sharper matte and crisp hair edges
          // (WebGPU only; the wasm CPU fallback stays at 1024 — 2048 on wasm is
          // too slow). If a weak/integrated GPU can't fit 2048 it throws and we
          // fall through to wasm/1024 (previous quality), so this never regresses
          // reliability — only raises the ceiling where the GPU allows.
          const desktopEngines: SegEngine[] = (await webgpuSupportsF16())
            ? [
                { device: "webgpu", dtype: "fp16", inputSize: 2048 },
                { device: "webgpu", dtype: "fp16", inputSize: 1024 },
                { device: "wasm", dtype: "fp32", inputSize: 1024 },
              ]
            : [{ device: "wasm", dtype: "fp32", inputSize: 1024 }];
          let lastErr: unknown = null;
          for (const eng of desktopEngines) {
            try {
              cutout = await withTimeout(
                removeBgWebGPU(image, size, eng),
                SEGMENTATION_TIMEOUT_MS,
                "Background removal timed out."
              );
              usedEngine = engineToLabel(eng);
              break;
            } catch (e) {
              lastErr = e;
              console.warn(
                `Desktop segmentation engine ${eng.device}/${eng.dtype} failed; trying next.`,
                e
              );
            }
          }
          if (!cutout) {
            // Both RMBG engines failed — fall back to isnet (different CDN).
            console.warn(
              "Desktop RMBG-1.4 segmentation failed; falling back to isnet.",
              lastErr
            );
            cutout = await withTimeout(
              removeBg(decodable, size),
              SEGMENTATION_TIMEOUT_MS,
              "Background removal timed out."
            );
            usedEngine = "isnet";
          }
        }
        const crownY = findCrownY(cutout, measurements.faceXSpan);
        if (crownY != null && crownY < measurements.chinY) {
          measurements.crownY = crownY;
          measurements.crownIsEstimated = false;
        }
        const composite = compositeFull(cutout, get().spec!.background.hex);
        set({
          measurements,
          cutout,
          composite,
          compositeUrl: await canvasToObjectURL(composite),
          segmented: true,
        });
      } catch (segErr) {
        // Graceful fallback: crop the original (correct sizing), keep the
        // landmark-estimated crownY, surface segmentationFailed to the user.
        // Hit on low-memory iOS where the model can't be allocated.
        console.warn("Background removal failed; using original image.", segErr);
        set({ measurements, segmented: false, segmentationFailed: true });
      }

      set({ status: "rendering" });
      await rebuildPresets(set, get);
      set({ status: "ready" });
      track({
        name: "tool_success",
        tool: "passport-photo",
        device: dev,
        engine: usedEngine,
        ms:
          typeof performance !== "undefined"
            ? Math.round(performance.now() - t0)
            : undefined,
      });
    } catch (err) {
      const message =
        err instanceof FaceDetectionError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong processing that photo.";
      // NoFaceError → crop-and-retry recovery; a bare FaceDetectionError here is
      // the detection timeout; anything else is a generic/decode failure.
      const errorKind: ToolErrorKind = err instanceof NoFaceError
        ? "no-face"
        : err instanceof FaceDetectionError
          ? "timeout"
          : "error";
      set({ status: "error", error: message, errorKind });
      track({
        name: "tool_failure",
        tool: "passport-photo",
        device: dev,
        reason: err instanceof NoFaceError ? "no-face" : "error",
      });
    }
  },

  applyManualCrop: async (cropRect) => {
    const { spec, sourceImage, sourceSize, measurements, composite, print, digital, brightness, contrast } =
      get();
    if (!spec || !sourceImage || !sourceSize || !measurements) return;

    const renderSource = composite ?? sourceImage;
    const rspec = toRenderSpec(spec);
    const printDpi = rspec.dpiMin ?? 300;
    const digitalDpi = recommendedDigitalDpi(rspec);

    if (print?.previewUrl) URL.revokeObjectURL(print.previewUrl);
    if (digital?.previewUrl) URL.revokeObjectURL(digital.previewUrl);

    const printPreset = await buildPresetFromCrop(
      renderSource,
      sourceSize,
      cropRect,
      measurements,
      rspec,
      printDpi,
      { brightness, contrast }
    );
    const digitalPreset = await buildPresetFromCrop(
      renderSource,
      sourceSize,
      cropRect,
      measurements,
      rspec,
      digitalDpi,
      { brightness, contrast }
    );

    set({
      print: {
        ...printPreset,
        dpi: printDpi,
        previewUrl: await canvasToObjectURL(printPreset.canvas),
      },
      digital: {
        ...digitalPreset,
        dpi: digitalDpi,
        previewUrl: await canvasToObjectURL(digitalPreset.canvas),
      },
    });
  },

  cropAndRetry: async (cropRect) => {
    // Recovery path for a no-face result: the user boxes their head on the
    // original photo; we crop that region and re-run the FULL pipeline on it.
    // A tighter crop makes the face large enough for MediaPipe to detect — the
    // common failure mode on full-body / wide / group shots.
    const { sourceImage, sourceSize, sourceFile } = get();
    if (!sourceImage || !sourceSize) return;

    // Clamp the crop to the image bounds (the cropper can report a box that
    // slightly overruns the natural edges).
    const sx = Math.max(0, Math.min(cropRect.sx, sourceSize.width - 1));
    const sy = Math.max(0, Math.min(cropRect.sy, sourceSize.height - 1));
    const sw = Math.max(1, Math.min(cropRect.sw, sourceSize.width - sx));
    const sh = Math.max(1, Math.min(cropRect.sh, sourceSize.height - sy));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      set({
        status: "error",
        error: "Couldn't prepare the crop. Try another photo.",
        errorKind: "error",
      });
      return;
    }
    ctx.drawImage(sourceImage, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) {
      set({
        status: "error",
        error: "Couldn't prepare the crop. Try another photo.",
        errorKind: "error",
      });
      return;
    }

    const baseName = sourceFile?.name?.replace(/\.[^.]+$/, "") ?? "photo";
    const file = new File([blob], `${baseName}-cropped.png`, { type: "image/png" });
    // Re-enter the standard pipeline — detection, segmentation, render, and all
    // error handling are reused. If the crop still has no face, the user simply
    // lands back on the recovery screen and can crop tighter or pick a new photo.
    await get().processFile(file);
  },

  recomputeAuto: async () => {
    await rebuildPresets(set, get);
  },

  reset: () => {
    const { sourceUrl, compositeUrl, print, digital } = get();
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (compositeUrl) URL.revokeObjectURL(compositeUrl);
    if (print?.previewUrl) URL.revokeObjectURL(print.previewUrl);
    if (digital?.previewUrl) URL.revokeObjectURL(digital.previewUrl);
    set({
      status: "idle",
      error: null,
      errorKind: null,
      sourceUrl: null,
      sourceImage: null,
      sourceFile: null,
      sourceSize: null,
      measurements: null,
      cutout: null,
      composite: null,
      compositeUrl: null,
      segmented: false,
      segmentationFailed: false,
      print: null,
      digital: null,
      brightness: 100,
      contrast: 100,
    });
  },
}));

/** Build (or rebuild) the print + digital presets from current measurements. */
async function rebuildPresets(
  set: (partial: Partial<ToolState>) => void,
  get: () => ToolState
) {
  const { spec, sourceImage, sourceSize, measurements, composite, print, digital, brightness, contrast } =
    get();
  if (!spec || !sourceImage || !sourceSize || !measurements) return;

  if (print?.previewUrl) URL.revokeObjectURL(print.previewUrl);
  if (digital?.previewUrl) URL.revokeObjectURL(digital.previewUrl);

  const renderSource = composite ?? sourceImage;
  const rspec = toRenderSpec(spec);
  const printDpi = rspec.dpiMin ?? 300;
  const digitalDpi = recommendedDigitalDpi(rspec);

  const printPreset = await buildPreset(
    renderSource,
    sourceSize,
    measurements,
    rspec,
    { dpi: printDpi, source: sourceSize, brightness, contrast }
  );
  const digitalPreset = await buildPreset(
    renderSource,
    sourceSize,
    measurements,
    rspec,
    { dpi: digitalDpi, source: sourceSize, brightness, contrast }
  );

  set({
    print: {
      ...printPreset,
      dpi: printDpi,
      previewUrl: await canvasToObjectURL(printPreset.canvas),
    },
    digital: {
      ...digitalPreset,
      dpi: digitalDpi,
      previewUrl: await canvasToObjectURL(digitalPreset.canvas),
    },
  });
}
