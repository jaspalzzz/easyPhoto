import { test, expect, type Page } from "@playwright/test";

/**
 * A stalled OCR engine download must end in a clear error, never leave the
 * tool on "Loading OCR engine… 0%". The engine requests are made to hang (a
 * route handler that never responds) and the page clock is fast-forwarded
 * past the 90 s load limit in lib/ocr.ts, so this runs in seconds.
 */
const PAST_LOAD_LIMIT_MS = 91_000;

// Tesseract: the worker script, the wasm core (jsDelivr) and language data.
const OCR_ENGINE = /tesseract\.js-core@|tesseract\.js-data|\/tessdata\/worker\.min\.js/;
const ENGINE_ERROR = /text recognition engine couldn.t be loaded/i;

async function uploadTextImage(page: Page) {
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
  await page.setInputFiles('input[type="file"]', {
    name: "ocr-test.png",
    mimeType: "image/png",
    buffer: Buffer.from(dataUrl.split(",")[1], "base64"),
  });
}

test("image-to-text: a stalled OCR engine ends in a clear error, not 'Loading OCR engine… 0%'", async ({ page }) => {
  await page.clock.install();
  let stalled: () => void = () => {};
  const firstStalled = new Promise<void>((r) => (stalled = r));
  await page.route(OCR_ENGINE, () => stalled()); // never fulfilled: the download hangs

  await page.goto("/tools/image-to-text/");
  await uploadTextImage(page);
  await page.getByRole("button", { name: /extract text/i }).click();
  await firstStalled;
  await expect(page.getByText(/loading ocr engine/i)).toBeVisible();

  await page.clock.fastForward(PAST_LOAD_LIMIT_MS);
  await expect(page.getByText(ENGINE_ERROR)).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/loading ocr engine/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /extract text/i })).toBeEnabled();
});

test("image-to-text: a failed language download ends in a clear error right away", async ({ page }) => {
  await page.route(/tesseract\.js-data/, (route) => route.abort("internetdisconnected"));

  await page.goto("/tools/image-to-text/");
  await uploadTextImage(page);
  await page.getByRole("button", { name: /extract text/i }).click();

  // No clock games: tesseract.js reports this failure only via errorHandler,
  // so without it the tool hung here forever.
  await expect(page.getByText(ENGINE_ERROR)).toBeVisible({ timeout: 20_000 });
});
