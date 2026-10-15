/**
 * Google shows about 160 characters of a description; longer ones are cut
 * mid-sentence. Every indexed tool page stays within that (owner, 15 Oct 2026).
 * Reads the built pages, so it runs after `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const out = path.join("out");
const indexedTools = fs
  .readFileSync(path.join("test", "fixtures", "sitemap-baseline.txt"), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.startsWith("/tools/") && l !== "/tools/");

/**
 * Known longer descriptions, left for an owner decision (not in the 22 Oct
 * release). The number may only fall; delete the entry once it fits.
 */
const ALLOWED_OVER: Record<string, number> = {
  "/tools/compliance-checker/": 167,
};

const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

describe.skipIf(!fs.existsSync(path.join(out, "sitemap.xml")))("indexed tool descriptions", () => {
  it.each(indexedTools)("%s is at most 160 characters", (route) => {
    const html = fs.readFileSync(path.join(out, route, "index.html"), "utf8");
    const description = decode(html.match(/<meta name="description" content="([^"]*)"/)![1]);
    expect(description.length, description).toBeLessThanOrEqual(ALLOWED_OVER[route] ?? 160);
  });
});
