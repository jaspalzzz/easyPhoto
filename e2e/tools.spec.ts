import { test, expect } from "@playwright/test";
import path from "path";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * Real upload → process → download coverage for the highest-traffic tools.
 * Unit tests already cover the underlying compression/PDF logic in
 * isolation; these exercise the actual browser flow a user goes through.
 */

test("resize-kb: compressing to a target actually binds to that target", async ({ page }) => {
  await page.goto("/tools/resize-kb/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);

  // Two different targets must produce genuinely different output sizes —
  // this is the exact regression a prior session's maxQuality bug caused
  // (every target produced the same byte-identical file).
  const targetInput = page.locator('input[type="text"], input[type="number"]').first();
  const compressBtn = page.getByRole("button", { name: /compress to size/i });

  await targetInput.fill("20");
  await compressBtn.click();
  await expect(page.getByText(/needs ≤ 20 KB/i)).toBeVisible({ timeout: 30_000 });
  const result20 = await page.getByText(/KB \(needs ≤ 20 KB\)/i).textContent();

  await targetInput.fill("200");
  await compressBtn.click();
  await expect(page.getByText(/needs ≤ 200 KB/i)).toBeVisible({ timeout: 30_000 });
  const result200 = await page.getByText(/KB \(needs ≤ 200 KB\)/i).textContent();

  expect(result20).not.toBeNull();
  expect(result200).not.toBeNull();
  expect(result20).not.toEqual(result200);
});

test("background-removal: produces a transparent cutout and offers next steps", async ({ page }) => {
  await page.goto("/tools/background-removal/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);

  // ML model load + inference genuinely takes time on a cold run, and more
  // when several Playwright workers load the same model concurrently.
  await expect(page.getByRole("button", { name: /download transparent png/i })).toBeVisible({
    timeout: 60_000,
  });

  // The workflow-chaining feature: next-step suggestions must appear after
  // a real result exists, not just render an empty/broken panel.
  await expect(page.getByText(/continue editing/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /add white background/i })).toBeVisible();
});

test("background-removal → white-background: workflow handoff carries the file with zero re-upload", async ({ page }) => {
  await page.goto("/tools/background-removal/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  await expect(page.getByRole("button", { name: /download transparent png/i })).toBeVisible({
    timeout: 45_000,
  });

  await page.getByRole("button", { name: /add white background/i }).click();
  await expect(page).toHaveURL(/\/tools\/white-background\//);

  // The receiving tool must show a result immediately — no empty dropzone,
  // no re-upload prompt. This is the exact bug class a prior session fixed.
  await expect(page.getByText(/photo-no-bg/i)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: /drop a photo|click to browse/i })).toHaveCount(0);
});

test("image-to-text: OCR extracts real text from an uploaded image", async ({ page }) => {
  await page.goto("/tools/image-to-text/");

  // Build a synthetic image with known text directly in the browser, so the
  // assertion is exact rather than approximate.
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 600, 200);
    ctx.fillStyle = "black";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("TEST OCR 12345", 20, 110);
    return canvas.toDataURL("image/png");
  });
  const buffer = Buffer.from(dataUrl.split(",")[1], "base64");

  await page.setInputFiles('input[type="file"]', {
    name: "ocr-test.png",
    mimeType: "image/png",
    buffer,
  });

  await page.getByRole("button", { name: /extract text/i }).click();
  const extracted = page.locator("textarea, [aria-label='Extracted text']").first();
  await expect(extracted).toContainText("TEST OCR", { timeout: 30_000 });
});

test("no-face recovery: offers crop-and-retry instead of a dead end", async ({ page }) => {
  await page.goto("/tools/resume-photo/");

  const buffer = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#888899";
    ctx.fillRect(0, 0, 400, 400);
    return canvas.toDataURL("image/png").split(",")[1];
  });

  await page.setInputFiles('input[type="file"]', {
    name: "no-face.png",
    mimeType: "image/png",
    buffer: Buffer.from(buffer, "base64"),
  });

  await expect(page.getByText(/no face detected/i)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: /crop to your face.*retry/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /try another photo/i })).toBeVisible();
});
