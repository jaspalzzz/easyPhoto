import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

async function decodeJpeg(page: Page, bytes: Buffer): Promise<[number, number]> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("export did not decode"));
    });
    return [img.naturalWidth, img.naturalHeight];
  }, bytes.toString("base64"));
}

for (const preset of [
  { id: "tnpsc", label: "TNPSC", dimensions: [130, 170] as [number, number] },
  { id: "kerala-psc", label: "Kerala PSC", dimensions: [150, 200] as [number, number] },
]) {
  test(`name-date tool: ${preset.label} keeps the strip inside the published final frame`, async ({
    page,
  }) => {
    await page.goto("/tools/photo-with-name-date/");
    await page.setInputFiles('input[type="file"]', FACE_PHOTO);
    const presetSelect = page.getByLabel("Select Exam Preset");
    await presetSelect.selectOption(preset.id);
    await page.getByLabel("Candidate Name").fill("TEST USER");
    await expect(page.getByAltText(/real-time preview/i)).toBeVisible({ timeout: 30_000 });

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /download & export jpg/i }).click(),
    ]);
    const filePath = await download.path();
    expect(filePath).not.toBeNull();
    const bytes = fs.readFileSync(filePath!);
    expect(bytes[0]).toBe(0xff);
    expect(bytes[1]).toBe(0xd8);
    expect(await decodeJpeg(page, bytes)).toEqual(preset.dimensions);
    if (preset.id === "tnpsc") {
      expect(bytes.length).toBeGreaterThanOrEqual(20 * 1024);
      expect(bytes.length).toBeLessThanOrEqual(50 * 1000); // passes 1000- and 1024-byte KB portals
    }
  });
}

test("TNPSC workflow carries the sized photo through name/date into the Exam Kit", async ({
  page,
}) => {
  await page.goto("/exam-requirements/tnpsc/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  await page.getByRole("button", { name: /compress to size/i }).click();

  const addStrip = page.getByRole("button", { name: /add the required name & date/i });
  await expect(addStrip).toBeVisible({ timeout: 30_000 });
  await addStrip.click();
  await expect(page).toHaveURL(/\/tools\/photo-with-name-date\/$/);

  const presetSelect = page.getByLabel("Select Exam Preset");
  await expect(presetSelect).toHaveValue("tnpsc", { timeout: 15_000 });
  await page.getByLabel("Candidate Name").fill("TEST USER");
  await expect(page.getByAltText(/real-time preview/i)).toBeVisible({ timeout: 30_000 });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download & export jpg/i }).click(),
  ]);
  expect(await download.path()).not.toBeNull();

  const continueToKit = page.getByRole("button", { name: /continue in the exam kit/i });
  await expect(continueToKit).toBeVisible();
  await continueToKit.click();
  await expect(page).toHaveURL(/\/tools\/exam-package\/$/);
  await expect(page.getByText(/^TNPSC$/i)).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText(/upload a scan\/photo of your signature/i)).toBeVisible({
    timeout: 30_000,
  });
});

async function makeScannedSignature(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 300;
    const x = c.getContext("2d")!;
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, 600, 300);
    x.fillStyle = "#111111";
    x.beginPath();
    x.ellipse(300, 150, 120, 70, 0, 0, Math.PI * 2);
    x.fill();
    return c.toDataURL("image/png");
  });
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/**
 * PSNR (dB) of the exported photo area against a reference drawn straight from
 * the original upload with the name/date cropper's default framing (centred,
 * aspect-locked, autoCropArea 0.8). Only the photo rows above the strip are
 * compared; the strip itself is synthetic text.
 */
async function photoAreaPsnr(
  page: Page,
  original: Buffer,
  exported: Buffer,
  frame: { width: number; height: number; stripPx: number }
): Promise<number> {
  return page.evaluate(
    async ({ originalB64, exportedB64, width, height, stripPx }) => {
      const load = async (src: string) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        return img;
      };
      const source = await load(`data:image/jpeg;base64,${originalB64}`);
      const output = await load(`data:image/jpeg;base64,${exportedB64}`);
      const photoHeight = height - stripPx;
      const aspect = width / photoHeight;
      let cropW = source.naturalWidth;
      let cropH = source.naturalHeight;
      if (cropH * aspect > cropW) cropH = cropW / aspect;
      else cropW = cropH * aspect;
      cropW *= 0.8;
      cropH *= 0.8;
      const sx = (source.naturalWidth - cropW) / 2;
      const sy = (source.naturalHeight - cropH) / 2;

      const pixels = (draw: (ctx: CanvasRenderingContext2D) => void) => {
        const c = document.createElement("canvas");
        c.width = width;
        c.height = height;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        draw(ctx);
        return ctx.getImageData(0, 0, width, height).data;
      };
      const ref = pixels((ctx) =>
        ctx.drawImage(source, sx, sy, cropW, cropH, 0, 0, width, photoHeight)
      );
      const out = pixels((ctx) => ctx.drawImage(output, 0, 0));
      // Stop short of the strip's 1px separator line.
      const rows = photoHeight - 3;
      let sum = 0;
      let n = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          for (let ch = 0; ch < 3; ch++) {
            const d = ref[i + ch] - out[i + ch];
            sum += d * d;
            n++;
          }
        }
      }
      return 10 * Math.log10((255 * 255) / (sum / n));
    },
    {
      originalB64: original.toString("base64"),
      exportedB64: exported.toString("base64"),
      ...frame,
    }
  );
}

test("Exam Kit name/date step stamps the original upload and encodes the TNPSC photo once", async ({
  page,
}) => {
  // Record the type of every File the page decodes, so the test can see what
  // the Exam Kit receives back from the strip tool.
  await page.addInitScript(() => {
    const decoded: string[] = [];
    (window as unknown as { __decodedFiles: string[] }).__decodedFiles = decoded;
    const createObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (obj: Blob | MediaSource) => {
      if (obj instanceof File) decoded.push(obj.type);
      return createObjectURL(obj);
    };
  });
  await page.goto("/tools/exam-package/");
  await page.locator("button.ep-card").filter({ hasText: "TNPSC" }).first().click();
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);

  const addStrip = page.getByRole("button", { name: /add name & date to this photo/i });
  await expect(addStrip).toBeVisible({ timeout: 30_000 });
  await addStrip.click();
  await expect(page).toHaveURL(/\/tools\/photo-with-name-date\/$/, { timeout: 30_000 });

  // The strip tool must crop from the original upload, not from the Exam Kit's
  // already-compressed 130x170 JPEG.
  await expect(page.getByText(/face-photo\.jpg · 1024×1024px/)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByLabel("Select Exam Preset")).toHaveValue("tnpsc");
  await page.getByLabel("Candidate Name").fill("TEST USER");
  await expect(page.getByAltText(/real-time preview/i)).toBeVisible({ timeout: 30_000 });
  await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download & export jpg/i }).click(),
  ]);
  await page.evaluate(() => {
    (window as unknown as { __decodedFiles: string[] }).__decodedFiles.length = 0;
  });
  await page.getByRole("button", { name: /continue in the exam kit/i }).click();
  await expect(page).toHaveURL(/\/tools\/exam-package\/$/, { timeout: 30_000 });

  await expect(page.getByText(/upload a scan\/photo of your signature/i)).toBeVisible({
    timeout: 30_000,
  });
  // The stamped photo comes back lossless, so the Exam Kit's encode to the
  // TNPSC band is the only JPEG generation (not a re-encode of the strip
  // tool's JPEG).
  expect(
    await page.evaluate(() => (window as unknown as { __decodedFiles: string[] }).__decodedFiles)
  ).toEqual(["image/png"]);
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeScannedSignature(page),
  });
  const finish = page.getByRole("button", { name: /^finish/i });
  await expect(finish).toBeEnabled({ timeout: 30_000 });
  await finish.click();

  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download all as zip/i }).click(),
  ]);
  const zipPath = await dl.path();
  expect(zipPath).not.toBeNull();
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(fs.readFileSync(zipPath!));
  const photo = await zip.file(/-photo\.jpg$/i)[0].async("nodebuffer");

  // Published spec: JPEG, exactly 130x170 px, 20-50 KB.
  expect(photo[0]).toBe(0xff);
  expect(photo[1]).toBe(0xd8);
  expect(await decodeJpeg(page, photo)).toEqual([130, 170]);
  expect(photo.length).toBeGreaterThanOrEqual(20 * 1024);
  expect(photo.length).toBeLessThanOrEqual(50 * 1000);

  // One encode from the full-quality composite keeps the photo faithful to the
  // upload. Re-encoding the already-banded JPEG (and cropping it again) did not.
  const psnr = await photoAreaPsnr(page, fs.readFileSync(FACE_PHOTO), photo, {
    width: 130,
    height: 170,
    stripPx: 55,
  });
  console.log(`TNPSC kit photo: ${photo.length} bytes, photo-area PSNR ${psnr.toFixed(2)} dB`);
  // Measured: 32.4 dB with this fix; 10.7 dB when the strip tool cropped the
  // Exam Kit's banded 130x170 JPEG.
  expect(psnr).toBeGreaterThanOrEqual(30);
});
