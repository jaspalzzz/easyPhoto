import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const FACE_PHOTO = path.join(__dirname, "fixtures", "face-photo.jpg");

/**
 * Certifies the exam application kit — the most complex, highest-intent
 * workflow an applicant actually completes: pick exam -> photo -> signature ->
 * bundled ZIP. A break here fails the whole "get it right the first time"
 * promise. Asserts on the ACTUAL ZIP contents, not just that a download fired.
 */

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

test("exam-package: SSC bundles a compliant photo + signature + README into a valid ZIP", async ({
  page,
}) => {
  await page.goto("/tools/exam-package/");

  // Step 1 — pick an exam that requires BOTH photo and signature. Scope to the
  // exam CARDS (button.ep-card) — a bare /SSC/i button also matches the nav
  // mega-menu's "SSC Photo Tool" entry, which is not the wizard's selector.
  await page.locator("button.ep-card").filter({ hasText: "SSC" }).first().click();
  await expect(page.getByText(/Upload your passport-style photo/i)).toBeVisible();

  // Step 2 — photo. The kit auto-sizes it to the SSC spec; the "Next: signature"
  // button only appears once a real processed asset exists.
  await page.setInputFiles('input[type="file"]', FACE_PHOTO);
  const nextPhoto = page.getByRole("button", { name: /next: signature/i });
  await expect(nextPhoto).toBeVisible({ timeout: 30_000 });
  await nextPhoto.click();

  // Step 3 — signature.
  await expect(page.getByText(/Upload a scan\/photo of your signature/i)).toBeVisible();
  await page.setInputFiles('input[type="file"]', {
    name: "sig.png",
    mimeType: "image/png",
    buffer: await makeScannedSignature(page),
  });
  const finish = page.getByRole("button", { name: /^finish/i });
  await expect(finish).toBeVisible({ timeout: 30_000 });
  await finish.click();

  // Step 4 — bundle.
  const zipBtn = page.getByRole("button", { name: /download all as zip/i });
  await expect(zipBtn).toBeVisible();
  const [dl] = await Promise.all([page.waitForEvent("download"), zipBtn.click()]);
  const zipPath = await dl.path();
  expect(zipPath, "zip did not download").not.toBeNull();

  // Verify the ZIP is real and carries all three artefacts with valid contents.
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(fs.readFileSync(zipPath!));
  const names = Object.keys(zip.files);

  const photoName = names.find((n) => /-photo\.jpg$/i.test(n));
  const sigName = names.find((n) => /-signature\.png$/i.test(n));
  const readmeName = names.find((n) => /README/i.test(n));
  expect(photoName, `photo missing from zip: ${names}`).toBeTruthy();
  expect(sigName, `signature missing from zip: ${names}`).toBeTruthy();
  expect(readmeName, `README missing from zip: ${names}`).toBeTruthy();

  // The photo must be a real, non-empty JPEG (FF D8 magic bytes).
  const photoBuf = await zip.file(photoName!)!.async("nodebuffer");
  expect(photoBuf.length, "photo is empty").toBeGreaterThan(1000);
  expect(photoBuf[0]).toBe(0xff);
  expect(photoBuf[1]).toBe(0xd8);

  // The signature must be a real, non-empty PNG (89 50 magic bytes).
  const sigBuf = await zip.file(sigName!)!.async("nodebuffer");
  expect(sigBuf.length, "signature is empty").toBeGreaterThan(100);
  expect(sigBuf[0]).toBe(0x89);
  expect(sigBuf[1]).toBe(0x50);
});
