import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

/**
 * Merge photo + signature (/tools/photo-signature-merge/). Both images are
 * drawn in the page so the test needs no fixtures:
 * - a flat dark "photo" (so any grey in the result comes from the signature);
 * - a signature on grey phone-photo paper with a shadow across it.
 */

async function makeImages(page: Page): Promise<{ photo: Buffer; signature: Buffer }> {
  const [photo, signature] = await page.evaluate(async () => {
    const jpeg = async (draw: (g: CanvasRenderingContext2D) => void, w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d")!);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.95));
      let bin = "";
      for (const b of new Uint8Array(await blob.arrayBuffer())) bin += String.fromCharCode(b);
      return btoa(bin);
    };
    const photo = await jpeg((g) => {
      g.fillStyle = "rgb(30,60,90)";
      g.fillRect(0, 0, 600, 800);
    }, 600, 800);
    const signature = await jpeg((g) => {
      // Grey paper, darker towards the right (a shadow), as in a phone photo.
      const grad = g.createLinearGradient(0, 0, 1200, 0);
      grad.addColorStop(0, "rgb(200,200,195)");
      grad.addColorStop(1, "rgb(150,150,145)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 1200, 900);
      g.strokeStyle = "rgb(20,30,90)";
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(400, 480);
      g.bezierCurveTo(480, 380, 560, 560, 640, 440);
      g.bezierCurveTo(700, 360, 760, 540, 820, 450);
      g.stroke();
    }, 1200, 900);
    return [photo, signature];
  });
  return { photo: Buffer.from(photo, "base64"), signature: Buffer.from(signature, "base64") };
}

async function upload(page: Page) {
  const { photo, signature } = await makeImages(page);
  const inputs = page.locator('input[type="file"]');
  await inputs.nth(0).setInputFiles({ name: "photo.jpg", mimeType: "image/jpeg", buffer: photo });
  await inputs.nth(1).setInputFiles({ name: "signature.jpg", mimeType: "image/jpeg", buffer: signature });
  await expect(page.getByRole("button", { name: /merge into one image/i })).toBeVisible({ timeout: 15_000 });
}

async function mergeAndDownload(page: Page): Promise<Buffer> {
  await page.getByRole("button", { name: /merge into one image/i }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download jpg/i }).click({ timeout: 15_000 }),
  ]);
  return fs.readFileSync((await download.path())!);
}

/** Share of the image's pixels that are mid-grey (luma 110–230). */
async function greyShare(page: Page, bytes: Buffer): Promise<{ grey: number; w: number; h: number }> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let grey = 0;
    for (let i = 0; i < d.length; i += 4) {
      const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      if (l > 110 && l < 230) grey += 1;
    }
    return { grey: grey / (d.length / 4), w: c.width, h: c.height };
  }, bytes.toString("base64"));
}

test("merge: grey phone-photo paper around the signature comes out white", async ({ page }) => {
  await page.goto("/tools/photo-signature-merge/");
  await upload(page);
  const bytes = await mergeAndDownload(page);
  const { grey, h } = await greyShare(page, bytes);
  // The old fixed-threshold trim kept the whole grey sheet: the result was
  // taller than the photo plus a signature strip and largely grey.
  expect(grey, `${(grey * 100).toFixed(1)}% grey pixels`).toBeLessThan(0.03);
  expect(h).toBeLessThan(900);
});

test("merge: 35 × 45 mm at 200 DPI under 50 KB gives exact pixels, the DPI and the KB", async ({ page }) => {
  await page.goto("/tools/photo-signature-merge/");
  await upload(page);
  await page.getByRole("button", { name: "Size in mm" }).click();
  await page.getByLabel("Keep the file under").check();
  const bytes = await mergeAndDownload(page);
  const { w, h } = await greyShare(page, bytes);
  expect([w, h]).toEqual([276, 354]); // 35 mm and 45 mm at 200 DPI
  expect(bytes.length).toBeLessThanOrEqual(50 * 1000);
  // JFIF APP0: density units 1 (dpi) and X density 200.
  const app0 = bytes.indexOf(Buffer.from("JFIF\0"));
  expect(app0).toBeGreaterThan(0);
  expect(bytes[app0 + 7]).toBe(1);
  expect(bytes.readUInt16BE(app0 + 8)).toBe(200);
});
