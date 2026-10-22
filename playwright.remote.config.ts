import { defineConfig, devices } from "@playwright/test";

/**
 * Runs the e2e suite against a DEPLOYED site instead of the local dev server —
 * the dev preview before a release, production after it (CLAUDE.md §6.4–6.5):
 *
 *   E2E_BASE_URL=https://dev.easyphoto.pages.dev npx playwright test -c playwright.remote.config.ts
 *   E2E_BASE_URL=https://easyphoto.in npx playwright test -c playwright.remote.config.ts
 *
 * ML specs download models from models.easyphoto.in, so they need that host
 * reachable; rerun a single failure once before calling it a bug.
 */
export default defineConfig({
  testDir: "./e2e",
  workers: 2,
  timeout: 120_000,
  reporter: [["list"]],
  use: { baseURL: process.env.E2E_BASE_URL || "https://easyphoto.in" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
