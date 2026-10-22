import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

/**
 * "Sign across the edge" on /tools/sign-image/: white paper is added below and
 * beside the photo so a signature can run off the photo onto the paper, as
 * forms mean by "sign across the photo" (334 impressions at position ~5,
 * 0 clicks, GSC 25 Sep – 12 Oct 2026). The tool used to keep every signature
 * inside the photo.
 */

const W = 800;
const H = 600;

async function pngFromCanvas(page: Page, kind: "doc" | "sig"): Promise<Buffer> {
  const dataUrl = await page.evaluate((k) => {
    const c = document.createElement("canvas");
    const g = c.getContext("2d")!;
    if (k === "doc") {
      c.width = 800;
      c.height = 600;
      g.fillStyle = "#dddddd";
      g.fillRect(0, 0, c.width, c.height);
    } else {
      c.width = 400;
      c.height = 120;
      g.fillStyle = "#ffffff";
      g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = "#0000ff";
      g.fillRect(40, 20, 320, 80);
    }
    return c.toDataURL("image/png");
  }, kind);
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function setUp(page: Page) {
  await page.goto("/tools/sign-image/");
  await page.setInputFiles("#image-signer-file-input", {
    name: "document.png",
    mimeType: "image/png",
    buffer: await pngFromCanvas(page, "doc"),
  });
  await expect(page.getByAltText("Document Base")).toBeVisible();
  await page.getByRole("button", { name: /create signature/i }).click();
  await page.locator("#sig-pad-tab-upload").click();
  await page.setInputFiles("#sig-pad-upload-file-input", {
    name: "signature.png",
    mimeType: "image/png",
    buffer: await pngFromCanvas(page, "sig"),
  });
  await expect(page.getByText(/current signature/i)).toBeVisible({ timeout: 15_000 });
}

async function save(page: Page): Promise<Buffer> {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#image-signer-save-btn").click(),
  ]);
  return fs.readFileSync((await download.path())!);
}

/** Size of the saved JPEG and how many blue-ink pixels sit above and below the photo's bottom edge. */
async function inspect(page: Page, bytes: Buffer, edgeY: number) {
  return page.evaluate(
    async ({ b64, edge }) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let above = 0;
      let below = 0;
      for (let y = 0; y < c.height; y += 1) {
        for (let x = 0; x < c.width; x += 1) {
          const i = (y * c.width + x) * 4;
          if (d[i + 2] > 150 && d[i] < 90 && d[i + 1] < 90) {
            if (y < edge) above += 1;
            else below += 1;
          }
        }
      }
      return { w: c.width, h: c.height, above, below };
    },
    { b64: bytes.toString("base64"), edge: edgeY }
  );
}

test("sign across the edge: paper is added and a signature can cross the photo's bottom edge", async ({ page }) => {
  await setUp(page);
  await page.locator("#image-signer-across-edge").check();
  // 800 × 600 photo + 8% of the width each side + 40% of the height below.
  await expect(page.getByText(/Dimensions: 928×840px/)).toBeVisible();

  await page.getByRole("button", { name: /place on document/i }).click();
  const overlay = page.getByRole("group", { name: /signature overlay/i });
  await expect(overlay).toBeVisible();
  await page.waitForTimeout(400);

  // Drag the signature down until its middle sits on the photo's bottom edge.
  const frame = (await page.getByAltText("Document Base").boundingBox())!;
  const box = (await overlay.boundingBox())!;
  const edgeOnScreen = frame.y + (H / 840) * frame.height;
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, edgeOnScreen, { steps: 8 });
  await page.mouse.up();

  const { w, h, above, below } = await inspect(page, await save(page), H);
  expect([w, h]).toEqual([928, 840]);
  expect(above, "ink on the photo").toBeGreaterThan(200);
  expect(below, "ink on the paper below the photo").toBeGreaterThan(200);
});

test("sign across the edge: turning it off returns the photo to its own size", async ({ page }) => {
  await setUp(page);
  const toggle = page.locator("#image-signer-across-edge");
  await toggle.check();
  await expect(page.getByText(/Dimensions: 928×840px/)).toBeVisible();
  await toggle.uncheck();
  await expect(page.getByText(new RegExp(`Dimensions: ${W}×${H}px`))).toBeVisible();
});

test("sign on photo: 'Keep the file under 50 KB' saves at most 50 KB", async ({ page }) => {
  await setUp(page);
  await page.getByRole("button", { name: /place on document/i }).click();
  await page.getByLabel("Keep the file under").check();
  const bytes = await save(page);
  expect(bytes.length, `${bytes.length} B`).toBeLessThanOrEqual(50 * 1000);
  await expect(page.getByText(/Saved at \d+ × \d+ px/)).toBeVisible();
});
