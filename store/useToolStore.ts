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
  webgpuSupportsF16,
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
      // Engine choice is about device MEMORY, not quality preference. Every path
      // is 100% on-device; only the model downloads (never the photo).
      //   • Desktop            → isnet (@imgly, onnxruntime WASM). Proven.
      //   • Android, f16 GPU   → RMBG-1.4 webgpu/fp16. Fast + premium.   [Redmi]
      //   • Android, no f16    → RMBG-1.4 wasm/fp32 (full model on CPU). Clean
      //                          edges, slower. (q8-on-webgpu corrupts output,
      //                          fp32-on-webgpu crashes those GPUs.)        [OnePlus]
      //   • iOS                → RMBG-1.4 wasm/q8, single-thread, small input.
      //                          Safari tab memory is tight; this is the lightest
      //                          path. Old 4GB iPhones still can't fit it and
      //                          fall back gracefully below; iPhone 12+ succeed.
      const ua =
        typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      let engine: {
        device: string;
        dtype: string;
        inputSize: number;
        threads?: number;
      } | null = null;
      if (isMobile) {
        if (isIOS) {
          engine = { device: "wasm", dtype: "q8", inputSize: 256, threads: 1 };
        } else if (await webgpuSupportsF16()) {
          engine = { device: "webgpu", dtype: "fp16", inputSize: 1024 };
        } else {
          engine = { device: "wasm", dtype: "fp32", inputSize: 1024 };
        }
      }
      // Detection is done; on mobile, free MediaPipe (GPU+WASM) BEFORE loading
      // the segmentation runtime so the two don't fight for the tab's memory
      // budget — important on low-memory phones.
      if (isMobile && engine) {
        await disposeLandmarker();
      }
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
        // Graceful fallback: crop the original (correct sizing), keep the
        // landmark-estimated crownY, surface segmentationFailed to the user.
        // Hit on low-memory iOS where the model can't be allocated.
        console.warn("Background removal failed; using original image.", segErr);
        set({ measurements, segmented: false, segmentationFailed: true });
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
