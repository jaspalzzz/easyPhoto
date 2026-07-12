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
  expect(bytes / 1024, `downloaded ${(bytes / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(target + 0.5);
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
