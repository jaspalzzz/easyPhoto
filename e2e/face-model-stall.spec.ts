import { test, expect, type Page } from "@playwright/test";
import path from "path";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * A stalled face-model download must end in a clear error in every face tool,
 * never an endless spinner or a false "no face". Each test makes the model's
 * requests hang forever (a route handler that never responds), then
 * fast-forwards the page clock past the 90 s load limit in
 * lib/faceDetection.ts, so the suite runs in seconds instead of minutes.
 */
const PAST_LOAD_LIMIT_MS = 91_000;

// MediaPipe FaceLandmarker: the wasm runtime (jsDelivr) and the model file.
const FACE_ENGINE = /tasks-vision@[^/]+\/wasm\/|face_landmarker\.task/;

/** Hang every request matching `pattern`; resolves once the first one is made. */
async function stallRequests(page: Page, pattern: RegExp): Promise<() => Promise<void>> {
  let seen: () => void = () => {};
  const firstStalled = new Promise<void>((r) => (seen = r));
  await page.route(pattern, () => {
    seen(); // never fulfil, continue or abort: the download just stalls
  });
  return () => firstStalled;
}

async function stallFaceModelAndUpload(page: Page, url: string) {
  await page.clock.install();
  const stalled = await stallRequests(page, FACE_ENGINE);
  await page.goto(url);
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  await stalled();
  await page.clock.fastForward(PAST_LOAD_LIMIT_MS);
}

const MODEL_ERROR = /face detection model couldn.t be loaded/i;

test("auto-crop: a stalled face model ends in a clear error", async ({ page }) => {
  await stallFaceModelAndUpload(page, "/tools/auto-crop/");
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/detecting face & cropping/i)).toHaveCount(0);
});

test("face-centering: a stalled face model is reported, not shown as 'no face'", async ({ page }) => {
  await stallFaceModelAndUpload(page, "/tools/face-centering/");
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/no face was detected/i)).toHaveCount(0);
});

test("straighten-photo: a stalled face model is reported, manual slider stays usable", async ({ page }) => {
  await stallFaceModelAndUpload(page, "/tools/straighten-photo/");
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/detecting tilt/i)).toHaveCount(0);
  await expect(page.getByText(/no face detected/i)).toHaveCount(0);
});

test("red-eye-removal: a stalled face model is reported, not shown as 'no face'", async ({ page }) => {
  await stallFaceModelAndUpload(page, "/tools/red-eye-removal/");
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/checking the photo for a face/i)).toHaveCount(0);
  await expect(page.getByText(/no face was detected/i)).toHaveCount(0);
});

test("linkedin-photo: a stalled face model falls back to a centred crop and says why", async ({ page }) => {
  await stallFaceModelAndUpload(page, "/tools/linkedin-photo/");
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/we couldn.t detect a face/i)).toHaveCount(0);
});

test("passport maker: a stalled face model ends in an error with Retry", async ({ page }) => {
  await stallFaceModelAndUpload(page, "/us-passport-photo-maker/");
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByRole("button", { name: /^retry$/i })).toBeVisible();
});

test("passport maker: a failed face-model load is not cached, so Retry loads it afresh", async ({ page }) => {
  // While offline, every engine request fails like a network blip; once back
  // online they just hang, so the test needs no real network and only counts
  // whether Retry makes a fresh attempt.
  let online = false;
  let retried = 0;
  await page.route(FACE_ENGINE, (route) => {
    if (!online) return route.abort("internetdisconnected");
    retried++;
  });
  await page.goto("/us-passport-photo-maker/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  await expect(page.getByText(MODEL_ERROR)).toBeVisible({ timeout: 30_000 });

  // Previously the rejected load stayed cached for the whole session, so
  // Retry failed instantly without ever touching the network again.
  online = true;
  await page.getByRole("button", { name: /^retry$/i }).click();
  await expect.poll(() => retried, { timeout: 5_000 }).toBeGreaterThan(0);
  await expect(page.getByText(MODEL_ERROR)).toHaveCount(0);
});
