/**
 * Keeps the deindex decision consistent across the two places it has to land.
 *
 * A page leaves the index only if BOTH are true: it is absent from the sitemap
 * and it serves `X-Robots-Tag: noindex`. Those live in different files —
 * app/sitemap.ts (via lib/deindexed.ts) and public/_headers — and nothing
 * connects them at build time. Half-applying it is worse than not doing it:
 * a page in the sitemap that serves noindex is a direct contradiction to a
 * crawler, and a page missing from the sitemap that still indexes is the thin
 * content we were trying to remove.
 *
 * It also guards the pages that must NOT be caught: the trust pages an AdSense
 * reviewer looks for, and the thin-but-earning tools.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { DEINDEXED_PATHS, isDeindexed } from "@/lib/deindexed";

const headers = fs.readFileSync(
  path.join(process.cwd(), "public", "_headers"),
  "utf8",
);

/** Paths in _headers carrying a noindex X-Robots-Tag, restricted to /tools/. */
function noindexedToolPathsInHeaders(): Set<string> {
  const found = new Set<string>();
  const lines = headers.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.startsWith("/tools/") || line.includes("*")) continue;
    const following = lines.slice(i + 1, i + 4).join("\n");
    if (/X-Robots-Tag:\s*noindex/i.test(following)) {
      found.add(line.trim().replace(/\/?$/, "/"));
    }
  }
  return found;
}

describe("deindexed pages", () => {
  it("lists pages to remove", () => {
    expect(DEINDEXED_PATHS.length).toBeGreaterThan(0);
  });

  it("marks every sitemap-excluded page noindex in _headers", () => {
    const inHeaders = noindexedToolPathsInHeaders();
    for (const p of DEINDEXED_PATHS) {
      expect(
        inHeaders.has(p),
        `${p} is excluded from the sitemap but has no noindex header`,
      ).toBe(true);
    }
  });

  it("does not noindex a page that is still in the sitemap", () => {
    for (const p of noindexedToolPathsInHeaders()) {
      expect(
        isDeindexed(p),
        `${p} serves noindex but is not in DEINDEXED_PATHS, so the sitemap still lists it`,
      ).toBe(true);
    }
  });

  it("keeps the thin-but-earning tools indexed", () => {
    // Chosen on traffic, not length. sign-image is 405 words and is the single
    // biggest tool earner; a word-count rule would have removed it.
    for (const keep of [
      "/tools/sign-image/",
      "/tools/resume-photo/",
      "/tools/face-centering/",
      "/tools/white-background/",
      "/tools/pan-card-ocr/",
      "/tools/aadhaar-ocr/",
      "/tools/",
    ]) {
      expect(isDeindexed(keep), `${keep} earns traffic and must stay`).toBe(
        false,
      );
    }
  });

  it("keeps the trust pages an ad reviewer looks for", () => {
    // Thin by nature, but they are the E-E-A-T signals a review wants to see.
    for (const keep of [
      "/contact/",
      "/terms/",
      "/disclaimer/",
      "/editorial-policy/",
      "/corrections-policy/",
      "/source-methodology/",
      "/authors/jaspal-kumar/",
      "/how-photo-checking-works/",
    ]) {
      expect(isDeindexed(keep), `${keep} is a trust page and must stay`).toBe(
        false,
      );
    }
  });
});
