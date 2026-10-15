import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

/**
 * /tools/sign-image/ (owner-approved 15 Oct 2026):
 * - "Type Name" makes a signature from your typed name in a handwriting style
 *   ("sign on image for my name"; SignHouse and DigiSigner offer it);
 * - a PNG upload is saved as a PNG ("sign on image png").
 * The handwriting fonts must not load until the Type tab is opened.
 */

async function imageFile(page: Page, type: "image/png" | "image/jpeg"): Promise<Buffer> {
  const dataUrl = await page.evaluate((t) => {
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 600;
    const g = c.getContext("2d")!;
    g.fillStyle = "#dddddd";
    g.fillRect(0, 0, c.width, c.height);
    return c.toDataURL(t);
  }, type);
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function typeSignature(page: Page, name: string) {
  await page.getByRole("button", { name: /create signature/i }).click();
  await page.locator("#sig-pad-tab-type").click();
  await page.locator("#sig-pad-type-name").fill(name);
  await page.locator("#sig-pad-type-style-classic").click();
  await page.locator("#sig-pad-type-apply-btn").click();
  await expect(page.getByText(/current signature/i)).toBeVisible({ timeout: 15_000 });
}

async function save(page: Page) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#image-signer-save-btn").click(),
  ]);
  return { name: download.suggestedFilename(), bytes: fs.readFileSync((await download.path())!) };
}

test("sign-image: a typed name becomes a signature, and a PNG is saved as a PNG", async ({ page }) => {
  const fontRequests: string[] = [];
  page.on("request", (req) => {
    if (req.resourceType() === "font") fontRequests.push(req.url());
  });

  await page.goto("/tools/sign-image/");
  await page.setInputFiles("#image-signer-file-input", {
    name: "document.png",
    mimeType: "image/png",
    buffer: await imageFile(page, "image/png"),
  });
  await expect(page.getByAltText("Document Base")).toBeVisible();
  const fontsBeforeTyping = fontRequests.length;

  await typeSignature(page, "Ravi Kumar");
  // The handwriting fonts arrive only after the Type tab opens.
  expect(fontRequests.length).toBeGreaterThan(fontsBeforeTyping);

  // The typed signature is a real image with ink on a transparent background.
  const ink = await page.getByAltText("Ready Signature").evaluate(async (el) => {
    const img = el as HTMLImageElement;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let opaque = 0;
    let clear = 0;
    for (let i = 3; i < d.length; i += 4) {
      if (d[i] > 128) opaque++;
      else if (d[i] === 0) clear++;
    }
    return { w: c.width, h: c.height, opaque, clear };
  });
  expect(ink.w).toBeGreaterThan(ink.h);
  expect(ink.opaque).toBeGreaterThan(500);
  expect(ink.clear).toBeGreaterThan(ink.opaque);

  await page.locator("#image-signer-add-sig-btn").click();
  const png = await save(page);
  expect(png.name).toBe("document-signed.png");
  expect(png.bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
});

test("sign-image: a JPG photo is still saved as a JPG", async ({ page }) => {
  await page.goto("/tools/sign-image/");
  await page.setInputFiles("#image-signer-file-input", {
    name: "photo.jpg",
    mimeType: "image/jpeg",
    buffer: await imageFile(page, "image/jpeg"),
  });
  await expect(page.getByAltText("Document Base")).toBeVisible();
  await typeSignature(page, "Asha");
  await page.locator("#image-signer-add-sig-btn").click();
  const jpg = await save(page);
  expect(jpg.name).toBe("photo-signed.jpg");
  expect(jpg.bytes.subarray(0, 2).toString("hex")).toBe("ffd8");
});
