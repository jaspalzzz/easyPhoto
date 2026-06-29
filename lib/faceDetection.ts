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

export interface Point {
  x: number;
  y: number;
}

export interface DetectionResult extends FaceMeasurements {
  /** Number of faces the model found (we expect exactly 1). */
  faceCount: number;
  /** Horizontal span of the face oval — used by segmentation to find the crown. */
  faceXSpan: { min: number; max: number };
  /** True when crownY is a landmark extrapolation, not a measured value. */
  crownIsEstimated: boolean;
  /** Centre of each eye (source-image px) — midpoint of its inner/outer corners. */
  leftEyeCenter: Point;
  rightEyeCenter: Point;
  /**
   * Head roll in degrees: the tilt of the eye line off horizontal. 0 = level.
   * Positive = the image-right eye sits lower (head tilted clockwise). Drives
   * the "eyes level" compliance check and the straighten tool.
   */
  rollDeg: number;
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
      const create = (delegate: "GPU" | "CPU") =>
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate },
          runningMode: "IMAGE",
          numFaces: 1,
        });
      // GPU is faster, but its delegate fails to init on some browsers/older
      // Android (no WebGL2, blocked GPU). Fall back to CPU so detection still
      // works instead of throwing and failing the whole photo flow.
      try {
        return await create("GPU");
      } catch {
        return await create("CPU");
      }
    })();
  }
  return landmarkerPromise;
}

/**
 * Free the FaceLandmarker (GPU + WASM memory) and reset the cache. On
 * memory-constrained devices (iPhone), call this right after detection so the
 * heavy segmentation model isn't competing with MediaPipe for the tab's tiny
 * memory budget. The next detect() lazily re-creates it (model is HTTP-cached).
 */
export async function disposeLandmarker(): Promise<void> {
  if (!landmarkerPromise) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lm = (await landmarkerPromise) as any;
    lm?.close?.();
  } catch {
    /* already gone / no close() — ignore */
  } finally {
    landmarkerPromise = null;
  }
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
    throw new NoFaceError(
      "No face detected. If this is a full-body or wide shot, crop in close to your head and shoulders, then retry."
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

  // Per-eye centres (midpoint of each eye's inner+outer corner).
  const lEye = { x: (lOuter.x + lInner.x) / 2, y: (lOuter.y + lInner.y) / 2 };
  const rEye = { x: (rOuter.x + rInner.x) / 2, y: (rOuter.y + rInner.y) / 2 };

  // Roll = tilt of the eye line off horizontal. Order the two eyes by image-x so
  // the sign is stable regardless of MediaPipe's left/right landmark naming.
  const [leftPt, rightPt] = lEye.x <= rEye.x ? [lEye, rEye] : [rEye, lEye];
  const rollDeg = (Math.atan2(rightPt.y - leftPt.y, rightPt.x - leftPt.x) * 180) / Math.PI;

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
    leftEyeCenter: leftPt,
    rightEyeCenter: rightPt,
    rollDeg,
  };
}

export class FaceDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FaceDetectionError";
  }
}

/**
 * Raised specifically when the model finds zero faces (distinct from a
 * detection timeout, which uses the base FaceDetectionError). Lets the UI
 * offer a crop-and-retry recovery path instead of a generic dead-end — a
 * full-body or wide shot often just needs the head cropped in closer.
 */
export class NoFaceError extends FaceDetectionError {
  constructor(message: string) {
    super(message);
    this.name = "NoFaceError";
  }
}
