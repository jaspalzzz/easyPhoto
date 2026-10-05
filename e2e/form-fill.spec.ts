import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

/** Fixtures are described in test/formFillRestricted.test.ts. */
const FIXTURES = path.join(__dirname, "..", "test", "fixtures", "form-fill");

test("form-fill: an owner-restricted PDF that allows filling is filled with its fields kept", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto("/tools/form-fill/");
  await page.setInputFiles('input[type="file"]', path.join(FIXTURES, "form-fill-allowed-rc4.pdf"));

  await expect(page.getByText("4 form fields detected")).toBeVisible({ timeout: 20_000 });
  await page.getByLabel("full_name").fill("JASPAL KUMAR");
  await page.getByLabel("state").selectOption("Punjab");
  await page.getByLabel("gender").selectOption("Female");
  await page.getByLabel("agree").selectOption("true");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /fill & download pdf/i }).click();
  const saved = await (await download).path();
  await expect(
    page.getByText("This PDF has restrictions set by its issuer, so the filled copy keeps them and its fields stay editable.")
  ).toBeVisible();

  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(saved)) }).promise;
  const objects = (await doc.getFieldObjects()) as Record<string, { type: string; value: unknown }[]>;
  const value = (name: string) => objects[name].find((w) => w.type)?.value;
  expect([value("full_name"), value("state"), value("gender"), value("agree")]).toEqual([
    "JASPAL KUMAR",
    "Punjab",
    "Female",
    "Yes",
  ]);
  expect(await doc.getPermissions()).not.toBeNull(); // still restricted, as issued
  await doc.destroy();
  expect(runtimeErrors).toEqual([]);
});

test("form-fill: an owner-restricted PDF that forbids filling says so and lists no fields", async ({ page }) => {
  await page.goto("/tools/form-fill/");
  await page.setInputFiles('input[type="file"]', path.join(FIXTURES, "form-print-only-rc4.pdf"));

  await expect(
    page.getByText(
      "This PDF's issuer doesn't allow its form to be filled outside their own software, so it can't be filled here. Use the form the issuer provides, or ask them for a fillable copy."
    )
  ).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/form fields? detected/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /fill & download pdf/i })).toHaveCount(0);
});

test("form-fill: a password-protected PDF is not sent to Unlock PDF", async ({ page }) => {
  await page.goto("/tools/form-fill/");
  await page.setInputFiles('input[type="file"]', path.join(FIXTURES, "form-password.pdf"));

  await expect(page.getByText(/needs a password to open, so its form can't be filled here/)).toBeVisible({
    timeout: 20_000,
  });
  // Unlock PDF rebuilds pages as images, which would drop every form field.
  await expect(page.getByRole("link", { name: "Unlock PDF tool" })).toHaveCount(0);
});
