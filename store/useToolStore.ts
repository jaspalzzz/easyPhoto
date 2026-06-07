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
  FaceDetectionError,
  type DetectionResult,
} from "@/lib/faceDetection";
import {
  buildPreset,
  buildPresetFromCrop,
  loadImageFromFile,
} from "@/lib/pipeline";
import {
  removeBg,
  removeBgWebGPU,
  isWebGPUSupported,
  webgpuSupportsF16,
  describeWebGPU,
  findCrownY,
  compositeFull,
} from "@/lib/segmentation";
import { ensureDecodable } from "@/lib/heic";

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
  /** TEMP diagnostic: why segmentation fell back (shown on dev). */
  segDiagnostic: string | null;

  print: Preset | null;
  digital: Preset | null;

  /** A photo chosen in the hero, to be processed once the country page mounts. */
  pendingFile: File | null;

  setSpec: (spec: CountrySpec) => void;
  setPendingFile: (file: File | null) => void;
  processFile: (file: File) => Promise<void>;
  applyManualCrop: (cropRect: CropRect) => Promise<void>;
  recomputeAuto: () => Promise<void>;
  reset: () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
  spec: null,
  status: "idle",
  error: null,
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
      segDiagnostic: null,
  print: null,
  digital: null,
  pendingFile: null,

  setPendingFile: (file) => set({ pendingFile: file }),

  setSpec: (spec) => {
    const prev = get();
    set({ spec });
    if (prev.sourceImage && prev.measurements) {
      // Re-composite the cutout over the new country's background, then rerun.
      if (prev.cutout) {
        if (prev.compositeUrl) URL.revokeObjectURL(prev.compositeUrl);
        const composite = compositeFull(prev.cutout, spec.background.hex);
        set({ composite, compositeUrl: composite.toDataURL("image/png") });
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

    set({
      status: "loading",
      error: null,
      print: null,
      digital: null,
      measurements: null,
      cutout: null,
      composite: null,
      compositeUrl: null,
      segmented: false,
      segmentationFailed: false,
      segDiagnostic: null,
      sourceFile: file,
    });

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
      // Engine choice is about MEMORY, not quality preference:
      //   • Desktop → isnet (onnxruntime WASM). Proven, unchanged.
      //   • Android → RMBG-1.4 on WebGPU (fp16). isnet's WASM heap OOMs there;
      //     WebGPU runs on GPU memory. Premium quality.
      //   • iOS → WebGPU OOMs at model-load even at 512², so run RMBG on the
      //     WASM runtime with the quantized (q8) model at a small input. Lower
      //     memory, no WebGPU flag needed, works in iOS Chrome too.
      //   • Android without WebGPU → best-effort WASM q8 as well.
      // All paths are 100% on-device; only the model downloads.
      const ua =
        typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      let webgpuOK = false;
      let webgpuF16 = false;
      let webgpuDetail = "desktop-path";
      if (isMobile && !isIOS) {
        try {
          webgpuOK = await isWebGPUSupported();
          webgpuF16 = webgpuOK && (await webgpuSupportsF16());
          webgpuDetail = await describeWebGPU();
        } catch (e) {
          webgpuOK = false;
          webgpuDetail = `probe threw: ${(e as Error)?.message ?? e}`;
        }
      }
      // Pick the engine for the diagnostic + the actual call.
      //   • WebGPU + shader-f16  → webgpu/fp16 (fast, premium).            [Redmi]
      //   • WebGPU, no f16       → webgpu/fp32 (clean; q8-on-webgpu        [OnePlus]
      //                            outputs CORRUPTION, so use full precision).
      //   • iOS                  → wasm/q8, single-thread, small input —   [iPhone]
      //                            iPhone tab memory is tight; threaded ORT
      //                            pre-reserves too much and OOMs.
      //   • Android, no WebGPU   → wasm/q8, multi-thread, 1024.
      let engine: {
        device: string;
        dtype: string;
        inputSize: number;
        threads?: number;
      } | null = null;
      if (isMobile) {
        if (isIOS) {
          engine = { device: "wasm", dtype: "q8", inputSize: 384, threads: 1 };
        } else if (webgpuOK) {
          engine = webgpuF16
            ? { device: "webgpu", dtype: "fp16", inputSize: 1024 }
            : { device: "webgpu", dtype: "fp32", inputSize: 1024 };
        } else {
          engine = { device: "wasm", dtype: "q8", inputSize: 1024 };
        }
      }
      const rmbgInputSize = engine?.inputSize ?? 0;
      const engineLabel = engine ? `${engine.device}/${engine.dtype}` : "isnet";
      try {
        let cutout: HTMLCanvasElement;
        if (isMobile && engine) {
          // Pass the already-decoded image element (no re-decode / no fetch).
          cutout = await removeBgWebGPU(image, size, engine);
        } else {
          cutout = await removeBg(decodable, size);
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
          compositeUrl: composite.toDataURL("image/png"),
          segmented: true,
        });
      } catch (segErr) {
        // Fallback to Phase-1 behaviour: crop the original, keep the
        // landmark-estimated crownY. Surfaced to the user via segmentationFailed.
        const reason =
          segErr instanceof Error ? `${segErr.name}: ${segErr.message}` : String(segErr);
        // TEMP diagnostic so we can see on the phone WHY it fell back.
        const diag = `mobile=${isMobile} eng=${engineLabel} webgpu=${webgpuOK} in=${rmbgInputSize} [${webgpuDetail}] · ${reason}`;
        console.warn("Background removal failed; using original image.", diag, segErr);
        set({
          measurements,
          segmented: false,
          segmentationFailed: true,
          segDiagnostic: diag,
        });
      }

      set({ status: "rendering" });
      await rebuildPresets(set, get);
      set({ status: "ready" });
    } catch (err) {
      const message =
        err instanceof FaceDetectionError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong processing that photo.";
      set({ status: "error", error: message });
    }
  },

  applyManualCrop: async (cropRect) => {
    const { spec, sourceImage, sourceSize, measurements, composite, print, digital } =
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
      printDpi
    );
    const digitalPreset = await buildPresetFromCrop(
      renderSource,
      sourceSize,
      cropRect,
      measurements,
      rspec,
      digitalDpi
    );

    set({
      print: {
        ...printPreset,
        dpi: printDpi,
        previewUrl: printPreset.canvas.toDataURL("image/png"),
      },
      digital: {
        ...digitalPreset,
        dpi: digitalDpi,
        previewUrl: digitalPreset.canvas.toDataURL("image/png"),
      },
    });
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
      segDiagnostic: null,
      print: null,
      digital: null,
    });
  },
}));

/** Build (or rebuild) the print + digital presets from current measurements. */
async function rebuildPresets(
  set: (partial: Partial<ToolState>) => void,
  get: () => ToolState
) {
  const { spec, sourceImage, sourceSize, measurements, composite, print, digital } =
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
    { dpi: printDpi, source: sourceSize }
  );
  const digitalPreset = await buildPreset(
    renderSource,
    sourceSize,
    measurements,
    rspec,
    { dpi: digitalDpi, source: sourceSize }
  );

  set({
    print: {
      ...printPreset,
      dpi: printDpi,
      previewUrl: printPreset.canvas.toDataURL("image/png"),
    },
    digital: {
      ...digitalPreset,
      dpi: digitalDpi,
      previewUrl: digitalPreset.canvas.toDataURL("image/png"),
    },
  });
}
