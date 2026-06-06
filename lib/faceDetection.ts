/**
 * Face detection — MediaPipe Tasks Vision FaceLandmarker.
 * -------------------------------------------------------
 * Produces the measurements the head-positioning engine needs, in
 * SOURCE-image pixels:
 *   chinY       landmark 152 (chin tip)
 *   eyeCenterY  average Y of the eye corners
 *   faceCenterX midpoint X between the outer eye corners
 *   crownY      FALLBACK estimate extrapolated above the forehead landmark.
 *
 * IMPORTANT: crownY here is the rough landmark fallback documented in
 * headPositioning.ts. The PREFERRED crownY comes from the segmentation alpha
 * mask (Phase 2, lib/segmentation.ts) — landmarks cannot see through hair.
 *
 * Privacy: the FaceLandmarker model + wasm are downloaded once from a CDN.
 * These are ML assets only — NO image bytes ever leave the device. All
 * inference runs locally in the browser.
 */

import type { FaceMeasurements } from "./headPositioning";

// Pinned versions keep the wasm + model in lock-step and the result reproducible.
// MUST match the installed @mediapipe/tasks-vision package version (the JS API
// is bundled from the package; the wasm is fetched from this CDN path).
const TASKS_VISION_VERSION = "0.10.35";
const WASM_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// MediaPipe FaceLandmarker (468 + iris) indices we rely on.
const IDX = {
  chin: 152,
  foreheadTop: 10, // top of forehead / hairline area
  leftEyeOuter: 33,
  leftEyeInner: 133,
  rightEyeOuter: 263,
  rightEyeInner: 362,
} as const;

export interface DetectionResult extends FaceMeasurements {
  /** Number of faces the model found (we expect exactly 1). */
  faceCount: number;
  /** Horizontal span of the face oval — used by segmentation to find the crown. */
  faceXSpan: { min: number; max: number };
  /** True when crownY is a landmark extrapolation, not a measured value. */
  crownIsEstimated: boolean;
}

// Lazy singleton so the heavy model only loads once, on first use.
let landmarkerPromise: Promise<unknown> | null = null;

async function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FilesetResolver, FaceLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      return FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "IMAGE",
        numFaces: 1,
      });
    })();
  }
  return landmarkerPromise;
}

/**
 * Detect a single face and return measurements in source-image pixels.
 * @param image a loaded HTMLImageElement / ImageBitmap / canvas
 * @param size  the natural pixel dimensions of the image
 */
export async function detectFace(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  size: { width: number; height: number }
): Promise<DetectionResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const landmarker = (await getLandmarker()) as any;
  const res = landmarker.detect(image);
  const faces = res?.faceLandmarks ?? [];
  if (faces.length === 0) {
    throw new FaceDetectionError(
      "No face detected. Use a clear, front-facing photo with the whole head visible."
    );
  }

  const lm = faces[0] as Array<{ x: number; y: number }>;
  const px = (i: number) => ({ x: lm[i].x * size.width, y: lm[i].y * size.height });

  const chin = px(IDX.chin);
  const lOuter = px(IDX.leftEyeOuter);
  const lInner = px(IDX.leftEyeInner);
  const rOuter = px(IDX.rightEyeOuter);
  const rInner = px(IDX.rightEyeInner);
  const forehead = px(IDX.foreheadTop);

  const eyeCenterY = (lOuter.y + lInner.y + rOuter.y + rInner.y) / 4;
  const faceCenterX = (lOuter.x + rOuter.x) / 2;

  // Fallback crown estimate: the true top of the head sits above the forehead
  // landmark by roughly the forehead→eye distance. Clamp to image top.
  const foreheadToEye = Math.max(0, eyeCenterY - forehead.y);
  const crownY = Math.max(0, forehead.y - foreheadToEye * 0.9);

  // Horizontal face span from the full landmark set (for Phase 2 crown search).
  let minX = Infinity;
  let maxX = -Infinity;
  for (const p of lm) {
    const x = p.x * size.width;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }

  return {
    chinY: chin.y,
    eyeCenterY,
    faceCenterX,
    crownY,
    faceCount: faces.length,
    faceXSpan: { min: minX, max: maxX },
    crownIsEstimated: true,
  };
}

export class FaceDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FaceDetectionError";
  }
}
