import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * Background removal must really work on a page that is NOT cross-origin
 * isolated. The COEP header that isolates a page now covers only the AI pages
 * (public/_headers) so ads can load elsewhere, and a visitor who reaches an AI
 * tool by an in-site link (or a tool-to-tool hand-off) keeps the previous
 * page's document, without isolation. In June 2026 the then-model failed in
 * exactly that state and the tool silently returned the original background,
 * so this test checks the pixels, not just that a Download button appeared.
 * The dev server sends no COEP header, so every page here is unisolated.
 */
test("background-removal: a real transparent cutout without cross-origin isolation", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/tools/background-removal/");
  expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(false);

  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  const downloadBtn = page.getByRole("button", { name: /download transparent png/i });
  await expect(downloadBtn).toBeVisible({ timeout: 90_000 });
  const [download] = await Promise.all([page.waitForEvent("download"), downloadBtn.click()]);
  const bytes = fs.readFileSync((await download.path())!);

  const { cornerAlpha, centreAlpha } = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0);
    const a = (x: number, y: number) => g.getImageData(x, y, 1, 1).data[3];
    // Corners are background in the fixture; the middle of the face is not.
    const corners = [a(5, 5), a(c.width - 6, 5), a(5, Math.round(c.height * 0.4))];
    return { cornerAlpha: Math.max(...corners), centreAlpha: a(Math.round(c.width / 2), Math.round(c.height * 0.35)) };
  }, bytes.toString("base64"));

  expect(cornerAlpha, "background corners must be transparent").toBeLessThan(40);
  expect(centreAlpha, "the face must stay opaque").toBeGreaterThan(200);
});
