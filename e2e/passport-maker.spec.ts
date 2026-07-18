import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * Certifies the Tier-1 passport maker (the higher-RPM segment). The maker is
 * PhotoTool wired to a CountrySpec: upload -> detect face -> remove background
 * -> crop to the country's exact print spec -> export a digital photo. All
 * countries share this engine, so certifying the US (whose 2x2-inch spec is
 * unambiguously SQUARE) proves the spec actually drives output geometry;
 * other countries differ only in spec data.
 */

test("us-passport maker: exports a square 2x2 photo per the US spec", async ({ page }) => {
  // The full ML pipeline (face landmarks + background segmentation model) is
  // genuinely slow on a cold run, especially under concurrent workers.
  test.setTimeout(120_000);

  await page.goto("/us-passport-photo-maker/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);

  // The digital-photo download ("JPG for upload") only appears once the ML
  // pipeline has produced a cropped, background-applied result.
  const dlBtn = page.getByRole("button", { name: /jpg for upload/i });
  await expect(dlBtn).toBeVisible({ timeout: 90_000 });

  const [dl] = await Promise.all([page.waitForEvent("download"), dlBtn.click()]);
  const p = await dl.path();
  expect(p, "digital photo did not download").not.toBeNull();
  const bytes = fs.readFileSync(p!);

  const [w, h] = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await new Promise((res, rej) => {
      img.onload = () => res(undefined);
      img.onerror = rej;
    });
    return [img.naturalWidth, img.naturalHeight] as [number, number];
  }, bytes.toString("base64"));

  // US passport = 2x2 inch = 1:1. The country spec must produce a SQUARE output
  // at or above the 600px digital minimum — a portrait crop here would mean the
  // spec never reached the exporter.
  expect(w, `output ${w}x${h} must be square (US 2x2)`).toBe(h);
  expect(w, "US digital minimum is 600px").toBeGreaterThanOrEqual(600);

  await page.getByRole("button", { name: /adjust the file size/i }).click();
  await expect(page).toHaveURL(/\/tools\/resize-kb\/$/);
  await expect(page.getByText(/us-passport-digital\.jpg/i).first()).toBeVisible({
    timeout: 15_000,
  });
});
