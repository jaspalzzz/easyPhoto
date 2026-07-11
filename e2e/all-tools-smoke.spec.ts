import { test, expect } from "@playwright/test";
import { READY_TOOLS } from "../lib/toolsCatalog";

/**
 * Product-wide browser smoke coverage. This deliberately proves route and UI
 * integrity only; a tool is not output-certified until a workflow test also
 * validates its generated file or result.
 */
for (const tool of READY_TOOLS) {
  test(`${tool.slug}: renders a usable tool page`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    const response = await page.goto(`/tools/${tool.slug}/`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.ok(), `HTTP failure for ${tool.slug}`).toBe(true);
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).not.toHaveText("");

    const toolInterface = page.locator(
      'input[type="file"], input[type="text"], input[type="number"], select, textarea, button',
    );
    await expect(toolInterface.first(), `No interactive UI for ${tool.slug}`).toBeVisible();

    const overflow = await page.evaluate(() =>
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
        - document.documentElement.clientWidth,
    );
    expect(overflow, `Horizontal overflow for ${tool.slug}`).toBeLessThanOrEqual(1);
    expect(runtimeErrors, `Browser errors for ${tool.slug}`).toEqual([]);
  });
}
