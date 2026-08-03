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
import { pageMetadata } from "@/lib/seo";

const headers = fs.readFileSync(
  path.join(process.cwd(), "public", "_headers"),
  "utf8",
);

/**
 * Paths in _headers carrying a noindex X-Robots-Tag, restricted to /tools/.
 *
 * Parses each block up to the next unindented route line. A fixed look-ahead
 * window was wrong: deleting one route's X-Robots-Tag let the window reach into
 * the NEXT block and credit that header to the wrong page, so the check passed
 * on a page that had lost its rule.
 */
function noindexedPathsInHeaders(): Set<string> {
  const found = new Set<string>();
  const lines = headers.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    // Any route line, not just /tools/ — the list is no longer tool-only.
    if (!line.startsWith("/") || line.includes("*") || line.includes(".")) continue;
    let hasRule = false;
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j]!;
      // A new route (or any unindented non-comment content) ends this block.
      if (next.startsWith("/") || (next.trim() !== "" && !/^\s/.test(next))) break;
      if (/X-Robots-Tag:\s*noindex/i.test(next)) {
        hasRule = true;
        break;
      }
    }
    if (hasRule) found.add(line.trim().replace(/\/?$/, "/"));
  }
  return found;
}

describe("deindexed pages", () => {
  it("lists pages to remove", () => {
    expect(DEINDEXED_PATHS.length).toBeGreaterThan(0);
  });

  it("marks every sitemap-excluded page noindex in _headers", () => {
    const inHeaders = noindexedPathsInHeaders();
    for (const p of DEINDEXED_PATHS) {
      expect(
        inHeaders.has(p),
        `${p} is excluded from the sitemap but has no noindex header`,
      ).toBe(true);
    }
  });

  it("does not noindex a page that is still in the sitemap", () => {
    for (const p of noindexedPathsInHeaders()) {
      expect(
        isDeindexed(p),
        `${p} serves noindex but is not in DEINDEXED_PATHS, so the sitemap still lists it`,
      ).toBe(true);
    }
  });

  it("puts a robots meta tag on every deindexed page", () => {
    // The X-Robots-Tag header depends on edge path matching, and the rules were
    // originally written without the trailing slash the site canonicalises to,
    // so they would not have matched the served URL. The tag must also ship in
    // the page's own HTML, which pageMetadata derives from this same list.
    for (const p of DEINDEXED_PATHS) {
      const meta = pageMetadata({ title: "t", description: "d", path: p });
      expect(meta.robots, `${p} must carry robots noindex`).toEqual({
        index: false,
        follow: true,
      });
    }
  });

  it("does not put a robots meta tag on a page that stays indexed", () => {
    for (const p of ["/tools/sign-image/", "/contact/", "/tools/"]) {
      const meta = pageMetadata({ title: "t", description: "d", path: p });
      expect(meta.robots, `${p} must stay indexable`).toBeUndefined();
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

  it("keeps every redirect line well-formed", () => {
    // The deindexed-target check silently skips a line it cannot parse, so a
    // corrupted rule passed it. A scripted edit once spliced two rules into
    // "/tools//tools/form-resizer/nabard/ /exam-requirements/ 301/form-resizer/
    // lic/ ..." and the suite stayed green. Malformed lines are dead rules.
    const redirects = fs.readFileSync(
      path.join(process.cwd(), "public", "_redirects"),
      "utf8",
    );
    const malformed: string[] = [];
    redirects.split("\n").forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const parts = trimmed.split(/\s+/);
      const ok =
        parts.length === 3 &&
        parts[0]!.startsWith("/") &&
        (parts[1]!.startsWith("/") || parts[1]!.startsWith("http")) &&
        ["200", "301", "302", "308"].includes(parts[2]!);
      if (!ok) malformed.push(`line ${index + 1}: ${trimmed.slice(0, 90)}`);
    });
    expect(malformed, "malformed redirect rules").toEqual([]);
  });

  it("never redirects to a deindexed page", () => {
    // A 301 is a canonicalisation signal. Aiming one at a noindexed page asks
    // Google to consolidate onto a URL it may not show — four retired
    // PDF-compression URLs did exactly that after /tools/pdf-compress/ left the
    // index. Redirect targets must be pages that can actually rank.
    const redirects = fs.readFileSync(
      path.join(process.cwd(), "public", "_redirects"),
      "utf8",
    );
    const offenders: string[] = [];
    for (const line of redirects.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [from, to] = trimmed.split(/\s+/);
      if (!from || !to || !to.startsWith("/")) continue;
      // Compare the path only; a ?target= query does not change the document.
      const target = to.split("?")[0]!;
      if (isDeindexed(target)) offenders.push(`${from} -> ${to}`);
    }
    expect(offenders, "redirects landing on a noindexed page").toEqual([]);
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
