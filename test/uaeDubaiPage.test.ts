/**
 * UAE visa page names Dubai, which searchers type (owner-approved 15 Oct 2026),
 * without stating the aggregator-sourced 43 × 55 mm in its title.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import sitemap from "@/app/sitemap";

const page = fs.readFileSync(path.join("app", "[maker]", "page.tsx"), "utf8");

describe("UAE & Dubai visa page", () => {
  it("uses a page-only name, leaving the shared label for cards elsewhere", () => {
    expect(page).toContain('uae: "UAE & Dubai"');
    expect(COUNTRY_SPECS.uae.label).toBe("UAE");
  });

  it("keeps the unverified size out of the title", () => {
    expect(COUNTRY_SPECS.uae.verified).toBe("aggregator");
    const titleLine = page.split("\n").find((l) => l.includes("Photo Size & Maker`"))!;
    expect(titleLine).not.toMatch(/\d+\s*[×x]\s*\d+/);
  });

  it("names GDRFA as Dubai's office", () => {
    expect(COUNTRY_SPECS.uae.applicationNotes?.[0]).toContain("GDRFA, the residency and visa office for Dubai");
  });

  it("dates the UAE maker by its own last text change (Good to know rewritten 1 Nov 2026)", () => {
    const dates = Object.fromEntries(sitemap().map((e) => [e.url.replace(/^https:\/\/[^/]+/, ""), String(e.lastModified)]));
    expect(dates["/uae-visa-photo-maker/"]).toBe("2026-11-01");
  });
});
