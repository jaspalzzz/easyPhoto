import { defineConfig, devices } from "@playwright/test";

/**
 * Real browser-driven E2E tests for the upload → process → download flow of
 * each tool — unit tests already cover the underlying compression/PDF logic
 * in isolation, but nothing previously exercised a tool end-to-end the way a
 * user actually would.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Capped even locally: several of these tests load the same ~large ML
  // model (background removal, face detection) — running many at once
  // causes CPU/memory contention that reads as flakiness, not real bugs.
  workers: 2,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Dev server (not the static export): pdfjs and the ML models behave
  // consistently under Playwright's real browser either way, and dev avoids
  // needing a fresh `next build` before every local test run.
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { NEXT_DIST_DIR: ".next-e2e" },
  },
});
