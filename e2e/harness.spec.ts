import { test, expect } from "@playwright/test";

/**
 * Guards the E2E harness itself. `reuseExistingServer` (playwright.config.ts)
 * trusts *anything* answering on the configured port — it previously reused
 * an unrelated project's server that happened to be running on the same
 * port, so the whole suite silently tested the wrong app. A real crash then
 * only ever surfaced downstream as an inexplicable mid-suite connection
 * failure. This test fails fast and obviously if that ever happens again.
 */
test("harness sanity: the dev server under test is actually easyPhoto", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok(), "homepage did not return 200").toBe(true);
  await expect(page).toHaveTitle(/easyPhoto/i);
});
