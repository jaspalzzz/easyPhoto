import { defineConfig, devices } from "@playwright/test";

/**
 * Real browser-driven E2E tests for the upload → process → download flow of
 * each tool — unit tests already cover the underlying compression/PDF logic
 * in isolation, but nothing previously exercised a tool end-to-end the way a
 * user actually would.
 */
// A distinctive, project-specific port. 3100 previously collided with an
// unrelated Next.js project on the same machine — `reuseExistingServer`
// blindly trusts *anything* answering on the port, so tests silently ran
// against the wrong app with no error, surfacing later as inexplicable
// mid-suite connection failures. Override via E2E_PORT if this ever collides.
const PORT = Number(process.env.E2E_PORT) || 39217;
const BASE_URL = `http://127.0.0.1:${PORT}`;

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
    baseURL: BASE_URL,
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
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { NEXT_DIST_DIR: ".next-e2e" },
    // Surface a real dev-server crash instead of swallowing it — a failure
    // that only shows up as a downstream ERR_CONNECTION_REFUSED is not
    // trustworthy; we need the server's own stderr to diagnose it.
    stdout: "pipe",
    stderr: "pipe",
  },
});
