import { test, expect, type Page } from "@playwright/test";

/**
 * Output-certification for the signature cluster (the site's evergreen,
 * click-earning USP). Each test drives the real upload -> process -> download
 * flow and asserts on the ACTUAL output bytes/pixels, not just that a button
 * appeared. transparent-signature / signature-resize / signature-cleaner all
 * share SignatureWorkflowTool, so certifying transparent + resize exercises
 * both branches of that shared engine (clean-to-PNG and KB compression).
 */

/** A "scanned" signature: black ink shape centred on white paper. The ink is
 * a filled disc, so after whiteToTransparent + trim-to-content the output's
 * corners are former paper (transparent) and its centre is ink (opaque) —
 * giving unambiguous pixels to assert on. `detail` sprinkles extra strokes to
 * make the natural PNG non-trivially large, so a KB target actually bites. */
async function makeScannedSignature(page: Page, detail = false): Promise<Buffer> {
  const dataUrl = await page.evaluate((withDetail) => {
    const w = 600;
    const h = 300;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#111111";
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 120, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    if (withDetail) {
      // Deterministic pseudo-strokes (no Math.random — stable across runs)
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      for (let i = 0; i < 400; i++) {
        const a = (i * 137.5 * Math.PI) / 180;
        const r = 20 + (i % 90);
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * (r * 0.55));
        ctx.stroke();
      }
    }
    return canvas.toDataURL("image/png");
  }, detail);
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/** `copies` filled signature blobs stacked one below another, with clear space between them. */
async function makeStackedSignatures(page: Page, copies: number): Promise<Buffer> {
  const dataUrl = await page.evaluate((n) => {
    const w = 600;
    const band = 200;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = band * n;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, canvas.height);
    ctx.fillStyle = "#111111";
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.ellipse(w / 2, band * i + band / 2, 180, 55, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas.toDataURL("image/png");
  }, copies);
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/** Reads a downloaded image's pixel at (xFrac, yFrac) of its natural size. */
async function samplePixel(
  page: Page,
  base64: string,
  mime: string,
  xFrac: number,
  yFrac: number
): Promise<number[]> {
  return page.evaluate(
    async ({ b64, m, xf, yf }) => {
      const img = new Image();
      img.src = `data:${m};base64,${b64}`;
      await new Promise((res, rej) => {
        img.onload = () => res(undefined);
        img.onerror = rej;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const x = Math.round(img.naturalWidth * xf);
      const y = Math.round(img.naturalHeight * yf);
      const d = ctx.getImageData(x, y, 1, 1).data;
      return [d[0], d[1], d[2], d[3]];
    },
    { b64: base64, m: mime, xf: xFrac, yf: yFrac }
  );
}

async function readDownloadBase64(download: import("@playwright/test").Download) {
  const path = await download.path();
  expect(path, "download did not save").not.toBeNull();
  const fs = await import("fs");
  return fs.readFileSync(path!).toString("base64");
}

test("transparent-signature: removes the white paper (transparent) and keeps the ink (opaque)", async ({
  page,
}) => {
  await page.goto("/tools/transparent-signature/");
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeScannedSignature(page),
  });

  const download = page.locator("#sig-download");
  await expect(download).toBeVisible({ timeout: 30_000 });

  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    download.click(),
  ]);
  const b64 = await readDownloadBase64(dl);

  // Centre = former ink → opaque + dark. Corner = former paper → transparent.
  const centre = await samplePixel(page, b64, "image/png", 0.5, 0.5);
  const corner = await samplePixel(page, b64, "image/png", 0.04, 0.04);

  expect(centre[3], `centre alpha, got ${centre}`).toBeGreaterThan(200);
  expect(centre[0] + centre[1] + centre[2], `centre should be dark ink`).toBeLessThan(180);
  expect(corner[3], `corner should be transparent paper, got alpha ${corner[3]}`).toBeLessThan(40);

  await page
    .getByRole("button", { name: /add this signature to an exam kit/i })
    .click();
  await expect(page).toHaveURL(/\/tools\/exam-package\/$/);
  await expect(page.getByText(/Which exam or form are you applying for/i)).toBeVisible();
});

test("signature-resize: output is genuinely bound to the KB target", async ({ page }) => {
  await page.goto("/tools/signature-resize/");
  await page.setInputFiles('input[type="file"]', {
    name: "sig-detailed.png",
    mimeType: "image/png",
    buffer: await makeScannedSignature(page, true),
  });

  // Resize tab is the default for this route; a first output renders on load.
  const download = page.locator("#sig-download");
  await expect(download).toBeVisible({ timeout: 30_000 });

  // Drive a tight target and confirm the reported output size actually obeys
  // it. The KB target is a range slider (Compress-to-KB is the default mode).
  const target = 15;
  const kbSlider = page.locator("#sig-resize-target-kb");
  await expect(kbSlider).toBeVisible();
  await kbSlider.fill(String(target));

  // The displayed "File size: X.XX KB" must settle at or under the cap, and the
  // "couldn't fit" warning must be absent.
  const sizeText = page.getByText(/File size:/i);
  await expect(sizeText).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(
      async () => {
        const t = (await sizeText.textContent()) ?? "";
        const m = t.match(/([\d.]+)\s*KB/i);
        return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY;
      },
      { timeout: 30_000, message: `output never settled under ${target} KB` }
    )
    .toBeLessThanOrEqual(target);

  await expect(page.getByText(/Could not fit under/i)).toHaveCount(0);

  // And the actual downloaded bytes must match the promise, not just the label.
  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    download.click(),
  ]);
  const b64 = await readDownloadBase64(dl);
  const bytes = Buffer.from(b64, "base64").length;
  // Portals count 1 KB as 1000 or 1024 bytes; the cap must hold in both.
  expect(bytes, `downloaded ${bytes} B`).toBeLessThanOrEqual(target * 1000);
});

// /upsc-signature-resizer/ is a retired route (host redirect to the UPSC exam
// page, which opens on the photo tab), so the test opens the signature tab itself.
test("upsc exam page: signature exports a JPG inside the stored 20–100 KB band", async ({ page }) => {
  await page.goto("/exam-requirements/upsc/");
  await page.getByRole("button", { name: /clean & compress signature/i }).click();
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeStackedSignatures(page, 3),
  });
  const download = page.getByRole("button", { name: /download .*jpg/i });
  await expect(download).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/needs your signature 3 times/i)).toHaveCount(1); // the pre-upload instruction only
  const [dl] = await Promise.all([page.waitForEvent("download"), download.click()]);
  const b64 = await readDownloadBase64(dl);
  const bytes = Buffer.from(b64, "base64");
  expect(bytes[0]).toBe(0xff);
  expect(bytes[1]).toBe(0xd8);
  expect(bytes.length).toBeGreaterThanOrEqual(20 * 1024);
  expect(bytes.length).toBeLessThanOrEqual(100 * 1000);
});

// PAN's official spec mandates 200 DPI scans; the photo export already carried
// it, the signature export didn't (JFIF density 1:1, units 0).
test("pan exam page: signature JPG carries the mandated 200 DPI", async ({ page }) => {
  await page.goto("/exam-requirements/pan/");
  await page.getByRole("button", { name: /clean & compress signature/i }).click();
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeStackedSignatures(page, 1),
  });
  const download = page.getByRole("button", { name: /download .*jpg/i });
  await expect(download).toBeVisible({ timeout: 30_000 });
  const [dl] = await Promise.all([page.waitForEvent("download"), download.click()]);
  const bytes = Buffer.from(await readDownloadBase64(dl), "base64");
  expect(bytes[0]).toBe(0xff);
  expect(bytes[1]).toBe(0xd8);
  // JFIF APP0: units byte 13 (1 = dots per inch), X density bytes 14-15, Y 16-17.
  expect(bytes.subarray(6, 10).toString("latin1")).toBe("JFIF");
  expect(bytes[13]).toBe(1);
  expect((bytes[14] << 8) | bytes[15]).toBe(200);
  expect((bytes[16] << 8) | bytes[17]).toBe(200);
});

// Sarathi's PhotoSign.pdf: "The image file should be JPG format", signature
// 256×64 px, 10–20 KB. The tool used to export a transparent PNG here.
test("driving-licence exam page: signature exports a 256x64 JPG inside 10–20 KB", async ({ page }) => {
  await page.goto("/exam-requirements/driving-licence/");
  await page.getByRole("button", { name: /clean & compress signature/i }).click();
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeStackedSignatures(page, 1),
  });
  const download = page.getByRole("button", { name: /download .*jpg/i });
  await expect(download).toBeVisible({ timeout: 30_000 });
  const [dl] = await Promise.all([page.waitForEvent("download"), download.click()]);
  const b64 = await readDownloadBase64(dl);
  const bytes = Buffer.from(b64, "base64");
  expect(bytes[0]).toBe(0xff);
  expect(bytes[1]).toBe(0xd8);
  expect(bytes.length).toBeGreaterThanOrEqual(10 * 1024);
  expect(bytes.length).toBeLessThanOrEqual(20 * 1024);
  const dims = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${data}`;
    await img.decode();
    return [img.naturalWidth, img.naturalHeight];
  }, b64);
  expect(dims).toEqual([256, 64]);
});

// SSC publishes the signature as "about 6.0 cm (width) x 2.0 cm (height)" and
// no pixel size. The tool used to export the signature trimmed tight to its
// ink, whatever its shape; it must come out at 3:1, with margins, not cropped.
test("ssc exam page: signature exports at SSC's 6.0 × 2.0 cm (3:1) shape", async ({ page }) => {
  await page.goto("/exam-requirements/ssc/");
  await page.locator('#resizer input[type="file"]').first().setInputFiles({
    name: "sig.png",
    mimeType: "image/png",
    // A 240 × 140 ink blob: far from 3:1 once trimmed.
    buffer: await makeScannedSignature(page),
  });
  const download = page.getByRole("button", { name: /download .*jpg/i });
  await expect(download).toBeVisible({ timeout: 30_000 });
  const [dl] = await Promise.all([page.waitForEvent("download"), download.click()]);
  const b64 = await readDownloadBase64(dl);
  const [w, h] = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${data}`;
    await img.decode();
    return [img.naturalWidth, img.naturalHeight];
  }, b64);
  expect(Math.abs(w / h - 3) / 3, `exported ${w}×${h}`).toBeLessThan(0.03);
  // Still inside SSC's 10–20 KB band whether the portal counts 1000 or 1024 bytes.
  const bytes = Buffer.from(b64, "base64").length;
  expect(bytes).toBeGreaterThanOrEqual(10 * 1024);
  expect(bytes).toBeLessThanOrEqual(20 * 1000);
});

test("upsc exam page: warns when the signature image has fewer than three signatures", async ({ page }) => {
  await page.goto("/exam-requirements/upsc/");
  await page.getByRole("button", { name: /clean & compress signature/i }).click();
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeStackedSignatures(page, 1),
  });
  await expect(page.getByRole("button", { name: /download .*jpg/i })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("alert").filter({ hasText: /only 1 signature found/i })).toBeVisible();
});

test("signature-crop: auto-detect crops the output tighter than the input", async ({ page }) => {
  await page.goto("/tools/signature-crop/");

  // 600x300 canvas with a centred ink disc (~240x140) surrounded by white
  // paper. Auto-detect should crop to roughly the ink box, well inside 600x300.
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeScannedSignature(page),
  });

  const dlBtn = page.getByRole("button", { name: /download png/i });
  await expect(dlBtn).toBeEnabled({ timeout: 30_000 });

  const [dl] = await Promise.all([page.waitForEvent("download"), dlBtn.click()]);
  const b64 = await readDownloadBase64(dl);

  const [w, h] = await page.evaluate(async (b) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b}`;
    await new Promise((res, rej) => {
      img.onload = () => res(undefined);
      img.onerror = rej;
    });
    return [img.naturalWidth, img.naturalHeight];
  }, b64);

  expect(w, `cropped width ${w} should be < input 600`).toBeLessThan(600);
  expect(h, `cropped height ${h} should be < input 300`).toBeLessThan(300);
  // ...but not cropped to nothing — the ink must survive.
  expect(w, "cropped width should still contain the ink").toBeGreaterThan(80);
  expect(h, "cropped height should still contain the ink").toBeGreaterThan(40);
});

test("sign-pdf: places a signature and exports a valid PDF with every page preserved", async ({
  page,
}) => {
  const { PDFDocument, StandardFonts } = await import("pdf-lib");
  const srcDoc = await PDFDocument.create();
  const font = await srcDoc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < 2; i++) {
    const p = srcDoc.addPage([400, 600]);
    p.drawText(`Page ${i + 1}`, { x: 50, y: 540, size: 24, font });
  }
  const inputBytes = await srcDoc.save();

  await page.goto("/tools/sign-pdf/");
  await page.setInputFiles('input[type="file"]', {
    name: "doc.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(inputBytes),
  });
  await expect(page.getByText(/Page 1 of 2/i)).toBeVisible({ timeout: 30_000 });

  // Create a signature via the pad's upload tab, then place it on the page.
  await page.locator("#pdf-signer-create-sig-btn").click();
  await page.locator("#sig-pad-tab-upload").click();
  await page.setInputFiles("#sig-pad-upload-file-input", {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeScannedSignature(page),
  });
  await expect(page.getByText(/current signature/i)).toBeVisible({ timeout: 15_000 });
  await page.locator("#pdf-signer-add-sig-btn").click();
  await expect(page.getByRole("group", { name: /signature overlay/i })).toBeVisible();

  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#pdf-signer-save-btn").click(),
  ]);
  const b64 = await readDownloadBase64(dl);
  const outBytes = Buffer.from(b64, "base64");

  // The output must be a structurally valid PDF (parses), keep both pages
  // (lossless copyPages, not a re-render that drops content), and grow because
  // the signature image is now embedded.
  const outDoc = await PDFDocument.load(outBytes);
  expect(outDoc.getPageCount(), "both pages must survive signing").toBe(2);
  expect(outBytes.length, "signed PDF should carry the embedded signature").toBeGreaterThan(
    inputBytes.length
  );
});

// UPPBPB Constable notice (31 Dec 2025) §5.8: JPG/JPEG, "140 X 60 पिक्सल",
// "30 KB से 50 KB". The page used to set 5–20 KB with no size or format, so
// the tool made a small transparent PNG the form would refuse.
test("up-police exam page: signature exports a 140 × 60 JPG of 30–50 KB", async ({ page }) => {
  await page.goto("/exam-requirements/up-police/");
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeStackedSignatures(page, 1),
  });
  const download = page.locator("#sig-download");
  await expect(download).toHaveText(/jpg/i, { timeout: 30_000 });
  const [dl] = await Promise.all([page.waitForEvent("download"), download.click()]);
  const bytes = Buffer.from(await readDownloadBase64(dl), "base64");
  expect(bytes[0]).toBe(0xff);
  expect(bytes[1]).toBe(0xd8);
  let width = 0;
  let height = 0;
  for (let i = 2; i + 9 < bytes.length; i += 2 + bytes.readUInt16BE(i + 2)) {
    if (bytes[i + 1] >= 0xc0 && bytes[i + 1] <= 0xc2) {
      height = bytes.readUInt16BE(i + 5);
      width = bytes.readUInt16BE(i + 7);
      break;
    }
  }
  expect([width, height]).toEqual([140, 60]);
  expect(bytes.length).toBeGreaterThanOrEqual(30 * 1024);
  expect(bytes.length).toBeLessThanOrEqual(50 * 1000);
});
