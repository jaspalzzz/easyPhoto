/**
 * Where the browser gets the face-detection engine and its model: from this
 * site, as files the build emits under /_next/static/media/ with a content
 * hash in the name (cached for a year, public/_headers).
 *
 * Until 21 Nov 2026 the engine (11 MB) came from cdn.jsdelivr.net and the
 * model (3.8 MB) from storage.googleapis.com on every first use. Two bursts
 * of 30-second timeouts in the face check on 20 and 21 Nov fit a stall at one
 * of those hosts, and Google served the model with a one-hour cache, so
 * returning visitors downloaded it again.
 *
 * - The engine files ship inside the installed @mediapipe/tasks-vision
 *   package, so they always match the JavaScript API bundled from it. There
 *   is no version number to keep in step by hand.
 * - The model is lib/models/face_landmarker.task (see lib/models/README.md).
 *
 * `new URL(file, import.meta.url)` makes the bundler copy the file as it is
 * and return its address; nothing here is parsed or executed at build time.
 */

/** The two files MediaPipe needs to start: a loader script and the wasm binary. */
export interface FaceEngineFiles {
  wasmLoaderPath: string;
  wasmBinaryPath: string;
}

const SIMD: FaceEngineFiles = {
  wasmLoaderPath: new URL("@mediapipe/tasks-vision/vision_wasm_internal.js", import.meta.url).href,
  wasmBinaryPath: new URL("@mediapipe/tasks-vision/vision_wasm_internal.wasm", import.meta.url).href,
};

const NO_SIMD: FaceEngineFiles = {
  wasmLoaderPath: new URL("@mediapipe/tasks-vision/vision_wasm_nosimd_internal.js", import.meta.url).href,
  wasmBinaryPath: new URL("@mediapipe/tasks-vision/vision_wasm_nosimd_internal.wasm", import.meta.url).href,
};

/** The engine build for this device: with WebAssembly SIMD when it has it. */
export function faceEngineFiles(simdSupported: boolean): FaceEngineFiles {
  return simdSupported ? SIMD : NO_SIMD;
}

export const FACE_MODEL_URL = new URL("./models/face_landmarker.task", import.meta.url).href;
