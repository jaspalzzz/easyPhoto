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
      expect(bytes.length).toBeLessThanOrEqual(50 * 1024);
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
