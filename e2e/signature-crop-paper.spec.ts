import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

/**
 * /tools/signature-crop/ "Paper around the signature": crop and remove the
 * paper in one step (the two results ranking above us for "how to crop
 * signature from image" do one or the other). The fixture is a phone-style
 * photo: grey, shadowed paper with dark blue ink.
 */
async function greyPaperSignature(page: Page): Promise<Buffer> {
  const b64 = await page.evaluate(async () => {
    const c = document.createElement("canvas");
    c.width = 900;
    c.height = 500;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 900, 0);
    grad.addColorStop(0, "rgb(200,200,195)");
    grad.addColorStop(1, "rgb(150,150,145)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 900, 500);
    g.strokeStyle = "rgb(20,30,90)";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(250, 280);
    g.bezierCurveTo(330, 180, 410, 360, 490, 240);
    g.bezierCurveTo(550, 160, 610, 340, 670, 250);
    g.stroke();
    const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.95));
    let bin = "";
    for (const x of new Uint8Array(await blob.arrayBuffer())) bin += String.fromCharCode(x);
    return btoa(bin);
  });
  return Buffer.from(b64, "base64");
}

async function stats(page: Page, bytes: Buffer, mime: string) {
  return page.evaluate(
    async ({ b64, type }) => {
      const img = new Image();
      img.src = `data:${type};base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let clear = 0, white = 0, grey = 0, ink = 0;
      for (let i = 0; i < d.length; i += 4) {
        const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (d[i + 3] < 20) clear += 1;
        else if (l > 245) white += 1;
        else if (l > 110) grey += 1;
        else ink += 1;
      }
      const n = d.length / 4;
      return { clear: clear / n, white: white / n, grey: grey / n, ink: ink / n };
    },
    { b64: bytes.toString("base64"), type: mime }
  );
}

async function setUp(page: Page) {
  await page.goto("/tools/signature-crop/");
  await page.setInputFiles('input[type="file"]', {
    name: "signature.jpg",
    mimeType: "image/jpeg",
    buffer: await greyPaperSignature(page),
  });
  await expect(page.getByRole("button", { name: /auto-detect/i })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: /auto-detect/i }).click();
}

async function download(page: Page, name: RegExp): Promise<Buffer> {
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name }).click()]);
  return fs.readFileSync((await dl.path())!);
}

test("signature crop: 'Transparent' removes grey phone-photo paper and keeps the ink", async ({ page }) => {
  await setUp(page);
  await page.getByRole("button", { name: "Transparent" }).click();
  await page.waitForTimeout(800); // debounced preview
  const s = await stats(page, await download(page, /download png/i), "image/png");
  expect(s.clear, `${(s.clear * 100).toFixed(1)}% transparent`).toBeGreaterThan(0.6);
  expect(s.grey, `${(s.grey * 100).toFixed(1)}% grey paper left`).toBeLessThan(0.05);
  expect(s.ink).toBeGreaterThan(0.01);
});

test("signature crop: 'White' gives a white-paper JPG; 'Keep as is' leaves the paper", async ({ page }) => {
  await setUp(page);
  const kept = await stats(page, await download(page, /^jpg$/i), "image/jpeg");
  expect(kept.grey, "the original grey paper is kept by default").toBeGreaterThan(0.5);

  await page.getByRole("button", { name: "White" }).click();
  await page.waitForTimeout(800);
  const white = await stats(page, await download(page, /^jpg$/i), "image/jpeg");
  expect(white.grey, `${(white.grey * 100).toFixed(1)}% grey paper left`).toBeLessThan(0.05);
  expect(white.white).toBeGreaterThan(0.6);
});
