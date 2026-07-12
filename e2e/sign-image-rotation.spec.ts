import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

const BASE_W = 800;
const BASE_H = 600;

/** A plain, neutral "document" background — never confused with the
 * signature's red/blue ink when sampling exported pixels. */
async function makeBaseDocument(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ({ w, h }) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#dddddd";
      ctx.fillRect(0, 0, w, h);
      return canvas.toDataURL("image/png");
    },
    { w: BASE_W, h: BASE_H }
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/**
 * A "photographed" signature: solid red-left / blue-right ink on a white
 * paper margin. SignaturePad's upload path runs whiteToTransparent (luma
 * threshold ~200, keeps anything with luma <= ~175) then trims to the ink's
 * alpha bounding box — pure red (luma ~76) and pure blue (luma ~29) both
 * survive fully opaque with original color, and the white margin is
 * stripped, leaving one tight red|blue rectangle with no internal gaps.
 */
async function makeSplitSignaturePhoto(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const w = 400;
    const h = 120;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    const inkW = (w - 80) / 2;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(40, 20, inkW, h - 40);
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(40 + inkW, 20, inkW, h - 40);
    return canvas.toDataURL("image/png");
  });
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/** Uploads the base document, creates the split-color signature via the
 * pad's upload tab, and places it on the document. Returns the overlay
 * locator once a placement exists and its layout has settled. */
async function placeTestSignature(page: Page) {
  await page.goto("/tools/sign-image/");

  await page.setInputFiles("#image-signer-file-input", {
    name: "document.png",
    mimeType: "image/png",
    buffer: await makeBaseDocument(page),
  });
  await expect(page.getByAltText("Document Base")).toBeVisible();

  await page.getByRole("button", { name: /create signature/i }).click();
  await page.locator("#sig-pad-tab-upload").click();
  await page.setInputFiles("#sig-pad-upload-file-input", {
    name: "signature.png",
    mimeType: "image/png",
    buffer: await makeSplitSignaturePhoto(page),
  });
  await expect(page.getByText(/current signature/i)).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: /place on document/i }).click();

  const overlay = page.getByRole("group", { name: /signature overlay/i });
  await expect(overlay).toBeVisible();
  // Let SignatureOverlay's aspect-ratio auto-height effect settle before any
  // geometry is read, or a stale (pre-adjustment) box gets captured.
  await page.waitForTimeout(400);

  return overlay;
}

test.describe("sign-image: signature rotation", () => {
  test("drag-to-rotate and the [ ] keyboard fine-tune both update the angle", async ({ page }) => {
    const overlay = await placeTestSignature(page);

    const handle = page.locator('[aria-label="Rotate signature"]');
    await expect(handle).toBeVisible();
    const handleBox = (await handle.boundingBox())!;
    const overlayBox = (await overlay.boundingBox())!;
    const cx = overlayBox.x + overlayBox.width / 2;
    const cy = overlayBox.y + overlayBox.height / 2;

    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2
    );
    await page.mouse.down();
    // Directly right of centre, same height: atan2(0, +dx) + 90 = 90°.
    await page.mouse.move(cx + 200, cy, { steps: 10 });
    await page.mouse.up();

    // This is the exact capability a manual test found missing: dragging the
    // handle must visibly rotate the on-screen signature, not just move it.
    await expect(overlay).toHaveCSS("transform", /matrix/);
    await expect(page.getByText("90°")).toBeVisible();

    // Keyboard fine-tune is a separate code path — verify it independently.
    await overlay.focus();
    await page.keyboard.press("]");
    await page.keyboard.press("]");
    await expect(page.getByText("92°")).toBeVisible();
    await page.keyboard.press("[");
    await expect(page.getByText("91°")).toBeVisible();
  });

  test("rotation is genuinely baked into the exported pixels, not just a CSS artifact", async ({
    page,
  }) => {
    const overlay = await placeTestSignature(page);

    const baseImgBox = (await page.getByAltText("Document Base").boundingBox())!;
    // Read placement geometry BEFORE rotating — rotation changes the visual
    // (post-transform) bounding box but not the underlying x/y/width/height
    // the export uses, so this must be captured pre-rotation.
    const overlayBoxPre = (await overlay.boundingBox())!;

    const xPct = (overlayBoxPre.x - baseImgBox.x) / baseImgBox.width;
    const yPct = (overlayBoxPre.y - baseImgBox.y) / baseImgBox.height;
    const wPct = overlayBoxPre.width / baseImgBox.width;
    const hPct = overlayBoxPre.height / baseImgBox.height;

    const handle = page.locator('[aria-label="Rotate signature"]');
    const handleBox = (await handle.boundingBox())!;
    const cx = overlayBoxPre.x + overlayBoxPre.width / 2;
    const cy = overlayBoxPre.y + overlayBoxPre.height / 2;

    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(cx + 200, cy, { steps: 10 });
    await page.mouse.up();
    await expect(page.getByText("90°")).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /save image/i }).click(),
    ]);
    const filePath = await download.path();
    expect(filePath, "download did not save to a local path").not.toBeNull();
    const base64 = fs.readFileSync(filePath!).toString("base64");

    const W = wPct * BASE_W;
    const H = hPct * BASE_H;
    const centerX = xPct * BASE_W + W / 2;
    const centerY = yPct * BASE_H + H / 2;

    // Rotated 90° about the centre: a point at local (u, v) in the UNROTATED
    // signature (u along its width axis, v along its height) lands at export
    // canvas (cx - v, cy + u). Sampling the left-ink half (u<0) and
    // right-ink half (u>0) at v=0 must show red-then-blue running
    // TOP-to-BOTTOM if rotation genuinely reached the export — a left/right
    // layout here would mean rotation never made it into the pixels.
    const redPoint = { x: Math.round(centerX), y: Math.round(centerY - W / 4) };
    const bluePoint = { x: Math.round(centerX), y: Math.round(centerY + W / 4) };

    const [redRGB, blueRGB] = await page.evaluate(
      async ({ b64, points }) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${b64}`;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(undefined);
          img.onerror = reject;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        return points.map(({ x, y }) => {
          const d = ctx.getImageData(x, y, 1, 1).data;
          return [d[0], d[1], d[2]];
        });
      },
      { b64: base64, points: [redPoint, bluePoint] }
    );

    expect(
      redRGB[0],
      `expected red at ${JSON.stringify(redPoint)}, got rgb(${redRGB})`
    ).toBeGreaterThan(150);
    expect(redRGB[2]).toBeLessThan(100);
    expect(
      blueRGB[2],
      `expected blue at ${JSON.stringify(bluePoint)}, got rgb(${blueRGB})`
    ).toBeGreaterThan(150);
    expect(blueRGB[0]).toBeLessThan(100);
  });
});
