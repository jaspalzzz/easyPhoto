import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

/**
 * /tools/resize-kb/: a form range such as "20 KB to 50 KB". A small photo is
 * raised into the band; a target too close to the minimum is refused with a
 * plain message. Exam pages keep their official minimum and show no box.
 */

async function smallJpeg(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 120;
    c.height = 150;
    const g = c.getContext("2d")!;
    g.fillStyle = "#e6e0d6";
    g.fillRect(0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.9);
  });
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function load(page: Page) {
  await page.goto("/tools/resize-kb/");
  await page.setInputFiles('input[type="file"]', { name: "small.jpg", mimeType: "image/jpeg", buffer: await smallJpeg(page) });
  await expect(page.getByLabel("Minimum size in KB, optional")).toBeVisible({ timeout: 15_000 });
}

test("resize-kb: a 20–50 KB range raises a tiny photo into the band", async ({ page }) => {
  await load(page);
  await page.getByLabel("Minimum size in KB, optional").fill("20");
  await page.getByLabel("Target size in KB").fill("50");
  await page.getByRole("button", { name: /compress to size/i }).click();
  await expect(page.getByText(/needs 20–50 KB/)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/for 20–50 KB range/)).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download jpg/i }).click(),
  ]);
  const bytes = fs.readFileSync((await download.path())!);
  expect(bytes.length).toBeGreaterThanOrEqual(20 * 1024);
  expect(bytes.length).toBeLessThanOrEqual(50 * 1000);
  expect(bytes.subarray(0, 2).toString("hex")).toBe("ffd8");
});

test("resize-kb: a target too close to the minimum is refused plainly", async ({ page }) => {
  await load(page);
  await page.getByLabel("Minimum size in KB, optional").fill("50");
  await page.getByLabel("Target size in KB").fill("50");
  await page.getByRole("button", { name: /compress to size/i }).click();
  await expect(page.getByText("For a 50 KB minimum, set the target to 52 KB or more.")).toBeVisible();
  await expect(page.getByRole("button", { name: /download jpg/i })).toHaveCount(0);
});

test("exam pages keep their official minimum and show no Minimum box", async ({ page }) => {
  await page.goto("/exam-requirements/ibps/");
  await page.setInputFiles('input[type="file"]', { name: "small.jpg", mimeType: "image/jpeg", buffer: await smallJpeg(page) });
  await expect(page.getByLabel("Target size in KB").first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByLabel("Minimum size in KB, optional")).toHaveCount(0);
});
