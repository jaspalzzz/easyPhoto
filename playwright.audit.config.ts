import { defineConfig, devices } from "@playwright/test";

/**
 * Exam output audit (docs/output-audit-plan-2026-10.md): every exam's real
 * photo and signature tools, driven in a browser with a standard set of
 * inputs; each download is checked against the exam's rules.
 *
 *   npm run build && npm run audit:outputs                       # local static export
 *   AUDIT_BASE_URL=https://dev.easyphoto.pages.dev npm run audit:outputs
 *
 * Results land in audit-report/ (REPORT.md + one JSON per run).
 */
const PORT = Number(process.env.AUDIT_PORT) || 39317;
const remote = process.env.AUDIT_BASE_URL;

export default defineConfig({
  testDir: "./audit",
  fullyParallel: true,
  workers: Number(process.env.AUDIT_WORKERS) || 4,
  timeout: 90_000,
  reporter: [["list"]],
  use: { baseURL: remote || `http://127.0.0.1:${PORT}`, acceptDownloads: true },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: remote
    ? undefined
    : {
        command: `node scripts/audit/serve-out.mjs`,
        url: `http://127.0.0.1:${PORT}/`,
        reuseExistingServer: false,
        env: { AUDIT_PORT: String(PORT) },
      },
});
