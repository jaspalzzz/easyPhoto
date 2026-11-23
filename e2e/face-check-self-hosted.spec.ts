import { test, expect } from "@playwright/test";
import path from "path";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * The face check must not need jsDelivr or Google Cloud Storage. Until
 * 21 Nov 2026 its engine and model were downloaded from those two hosts on
 * first use, and a stall at either left every face tool waiting. They are now
 * files of this site (lib/faceModelAssets.ts). Here both outside hosts are
 * blocked outright and the UPSC face-coverage check must still measure the
 * photo, having loaded its files from the page's own origin.
 */
test("upsc face check works with jsDelivr and Google Cloud Storage blocked", async ({ page, baseURL }) => {
  const blocked: string[] = [];
  await page.route(/cdn\.jsdelivr\.net|storage\.googleapis\.com/, (route) => {
    blocked.push(route.request().url());
    return route.abort();
  });
  const faceFiles: string[] = [];
  page.on("response", (response) => {
    if (/vision_wasm|face_landmarker/.test(response.url())) faceFiles.push(response.url());
  });

  await page.goto("/exam-requirements/upsc/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  await expect(page.getByText(/your face fills about \d+% of the photo/i)).toBeVisible({ timeout: 30_000 });

  expect(blocked, "the face check asked an outside host for a file").toEqual([]);
  expect(faceFiles.length, "engine loader, engine binary and model").toBeGreaterThanOrEqual(3);
  const origin = new URL(baseURL!).origin;
  expect(faceFiles.filter((url) => new URL(url).origin !== origin)).toEqual([]);
});
