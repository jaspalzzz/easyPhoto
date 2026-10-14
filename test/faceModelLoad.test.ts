/**
 * The face model load shared by every face tool (detectFace → getLandmarker)
 * must be bounded and must never cache a failure: a stall ends in
 * FaceModelLoadError, and after any failed load the next call loads afresh.
 *
 * MediaPipe is stubbed — the real one needs WebGL/wasm and CDN downloads.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const vision = vi.hoisted(() => ({
  forVisionTasks: vi.fn(),
  createFromOptions: vi.fn(),
}));
vi.mock("@mediapipe/tasks-vision", () => ({
  FilesetResolver: { forVisionTasks: vision.forVisionTasks },
  FaceLandmarker: { createFromOptions: vision.createFromOptions },
}));

import {
  detectFace,
  disposeLandmarker,
  FaceDetectionError,
  FaceModelLoadError,
  NoFaceError,
  FACE_MODEL_LOAD_ERROR,
  FACE_MODEL_LOAD_TIMEOUT_MS,
} from "@/lib/faceDetection";

const SIZE = { width: 1000, height: 1000 };
const IMAGE = {} as HTMLCanvasElement;

/** A landmarker whose detect() finds one face (all 478 points at the centre). */
function landmarker(faces = 1) {
  const pts = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5 }));
  return {
    detect: vi.fn(() => ({ faceLandmarks: Array.from({ length: faces }, () => pts) })),
    close: vi.fn(),
  };
}

/** Track a promise's outcome without awaiting it (a hang must not hang the test). */
function outcome<T>(p: Promise<T>) {
  const o: { value?: T; error?: Error } = {};
  p.then(
    (v) => (o.value = v),
    (e) => (o.error = e)
  );
  return o;
}

beforeEach(async () => {
  vi.useFakeTimers();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vision.forVisionTasks.mockResolvedValue({});
  await disposeLandmarker();
});

afterEach(() => {
  vision.forVisionTasks.mockReset();
  vision.createFromOptions.mockReset();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("face model load", () => {
  it("gives up with FaceModelLoadError when the model download stalls", async () => {
    vision.createFromOptions.mockReturnValue(new Promise(() => {}));
    const run = outcome(detectFace(IMAGE, SIZE));

    await vi.advanceTimersByTimeAsync(FACE_MODEL_LOAD_TIMEOUT_MS - 1);
    expect(run.error, "must not give up before the limit").toBeUndefined();

    await vi.advanceTimersByTimeAsync(1);
    expect(run.error).toBeInstanceOf(FaceModelLoadError);
    // Still a FaceDetectionError, so the passport maker offers a plain Retry.
    expect(run.error).toBeInstanceOf(FaceDetectionError);
    expect(run.error).not.toBeInstanceOf(NoFaceError);
    expect(run.error?.message).toBe(FACE_MODEL_LOAD_ERROR);
  });

  it("does not cache a failed load: the next call loads afresh and succeeds", async () => {
    vision.forVisionTasks.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(detectFace(IMAGE, SIZE)).rejects.toBeInstanceOf(FaceModelLoadError);

    vision.createFromOptions.mockResolvedValue(landmarker());
    await expect(detectFace(IMAGE, SIZE)).resolves.toMatchObject({ faceCount: 1 });
    expect(vision.forVisionTasks).toHaveBeenCalledTimes(2);
  });

  it("does not cache a timed-out load either", async () => {
    vision.createFromOptions.mockReturnValueOnce(new Promise(() => {}));
    const first = outcome(detectFace(IMAGE, SIZE));
    await vi.advanceTimersByTimeAsync(FACE_MODEL_LOAD_TIMEOUT_MS);
    expect(first.error).toBeInstanceOf(FaceModelLoadError);

    vision.createFromOptions.mockResolvedValue(landmarker());
    await expect(detectFace(IMAGE, SIZE)).resolves.toMatchObject({ faceCount: 1 });
  });

  it("closes a landmarker that finishes loading after the time limit", async () => {
    const late = landmarker();
    let finish: (v: unknown) => void = () => {};
    vision.createFromOptions.mockReturnValueOnce(new Promise((r) => (finish = r)));
    const run = outcome(detectFace(IMAGE, SIZE));
    await vi.advanceTimersByTimeAsync(FACE_MODEL_LOAD_TIMEOUT_MS);
    expect(run.error).toBeInstanceOf(FaceModelLoadError);

    finish(late);
    await vi.advanceTimersByTimeAsync(0);
    expect(late.close).toHaveBeenCalled();
  });

  it("keeps the GPU → CPU fallback and the no-face verdict", async () => {
    vision.createFromOptions
      .mockRejectedValueOnce(new Error("GPU delegate unavailable"))
      .mockResolvedValueOnce(landmarker(0));
    await expect(detectFace(IMAGE, SIZE)).rejects.toBeInstanceOf(NoFaceError);
    expect(vision.createFromOptions).toHaveBeenCalledTimes(2);
  });
});
