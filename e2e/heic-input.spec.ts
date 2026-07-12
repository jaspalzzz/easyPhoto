import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const FACE_HEIC = path.join(__dirname, "fixtures", "face-photo.heic");

/**
 * Certifies the HEIC input path — the single highest real-user-impact gap for
 * a mobile-heavy India audience. iPhones shoot HEIC by default, and only Safari
 * decodes it natively; on Chrome/Android the tools rely on ensureDecodable()
 * running the heic2any WASM converter (lib/heic.ts). Playwright's Chromium is
 * exactly that non-Safari path — if this regresses, every iPhone-on-Chrome user
 * silently can't use any upload tool. Asserts the HEIC genuinely becomes a valid
 * processed JPEG, not just that no error showed.
 */

test("HEIC input: an iPhone HEIC decodes and processes on a non-Safari browser", async ({
  page,
}) => {
  test.setTimeout(90_000); // heic2any WASM decode is genuinely heavy

  await page.goto("/tools/resize-kb/");
  await page.setInputFiles('input[type="file"]', FACE_HEIC);

  await page.locator('input[type="number"]').first().fill("30");
  await page.getByRole("button", { name: /compress to size/i }).click();

  // The result receipt only appears if the HEIC was decoded and compressed —
  // i.e. the whole HEIC → JPEG → compress path worked.
  await expect(page.getByText(/needs ≤ 30 KB/i)).toBeVisible({ timeout: 60_000 });

  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download jpg/i }).click(),
  ]);
  const bytes = fs.readFileSync((await dl.path())!);

  // A real, decodable JPEG under the cap — proof the HEIC was actually converted,
  // not passed through broken.
  expect(bytes.length / 1024, `downloaded ${(bytes.length / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(30);
  expect(bytes[0], "output is a JPEG (FF D8)").toBe(0xff);
  expect(bytes[1]).toBe(0xd8);

  const [w, h] = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await new Promise((res, rej) => {
      img.onload = () => res(undefined);
      img.onerror = rej;
    });
    return [img.naturalWidth, img.naturalHeight] as [number, number];
  }, bytes.toString("base64"));
  expect(w, "decoded to a real image").toBeGreaterThan(0);
  expect(h).toBeGreaterThan(0);
});
