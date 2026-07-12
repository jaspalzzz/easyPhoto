import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * Certifies the resize-KB engine and the voter-ID portal workflow — the other
 * emerging click cluster in GSC ("voter id photo size in mb", "voter id photo
 * resize"). The voter-ID resizer is ResizeKbTool wired to the ECI spec, so a
 * bug in either the spec surfacing or the compressor breaks a click earner.
 */

async function decode(page: Page, bytes: Buffer): Promise<[number, number]> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await new Promise((res, rej) => {
      img.onload = () => res(undefined);
      img.onerror = rej;
    });
    return [img.naturalWidth, img.naturalHeight] as [number, number];
  }, bytes.toString("base64"));
}

/** Sets the KB target, compresses, waits for the receipt, downloads. Returns
 * the downloaded bytes. */
async function compressAndDownload(page: Page, target: number): Promise<Buffer> {
  await page.locator('input[type="number"]').first().fill(String(target));
  await page.getByRole("button", { name: /compress to size/i }).click();
  await expect(page.getByText(new RegExp(`needs ≤ ${target} KB`, "i"))).toBeVisible({
    timeout: 30_000,
  });
  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download jpg/i }).click(),
  ]);
  const p = await dl.path();
  expect(p, "download did not save").not.toBeNull();
  return fs.readFileSync(p!);
}

test("resize-kb: the downloaded file genuinely stays under the target and decodes", async ({
  page,
}) => {
  await page.goto("/tools/resize-kb/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);

  const bytes = await compressAndDownload(page, 25);
  // The promise the tool makes to an applicant: the FILE, not just the label.
  expect(bytes.length / 1024, `downloaded ${(bytes.length / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(25);

  const [w, h] = await decode(page, bytes);
  expect(w, "output must be a valid, non-empty image").toBeGreaterThan(0);
  expect(h).toBeGreaterThan(0);
});

test("resize-kb: a very tight 10 KB target still yields a valid, non-corrupt image", async ({
  page,
}) => {
  await page.goto("/tools/resize-kb/");
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);

  const bytes = await compressAndDownload(page, 10);
  expect(bytes.length / 1024, `downloaded ${(bytes.length / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(10);
  // Must still decode to a real image — a tiny target must not corrupt output.
  const [w, h] = await decode(page, bytes);
  expect(w, "10 KB output still decodes").toBeGreaterThan(20);
  expect(h).toBeGreaterThan(20);
});

test("voter-id-photo-resizer: surfaces the ECI spec and binds output to a set target", async ({
  page,
}) => {
  await page.goto("/voter-id-photo-resizer/");

  // The literal answer a "voter id photo size in mb" searcher is looking for
  // must be on the page (ECI Form 6 cap ~2 MB = 2048 KB).
  await expect(page.getByText(/2048 KB/i).first()).toBeVisible();

  // The embedded resizer (defaultKb 2048) must still compress to a tight target
  // — the spec description itself recommends ~100-300 KB for fast upload.
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  const bytes = await compressAndDownload(page, 100);
  expect(bytes.length / 1024, `downloaded ${(bytes.length / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(100);
});
