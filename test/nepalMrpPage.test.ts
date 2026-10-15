/**
 * Nepal maker page answers "MRP size photo" (owner-approved 15 Oct 2026) and
 * shows visitors plain text instead of the record's developer notes.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import sitemap from "@/app/sitemap";

const page = fs.readFileSync(path.join("app", "[maker]", "page.tsx"), "utf8");

describe("Nepal MRP size photo page", () => {
  it("has the MRP title and H1, with no size in the title", () => {
    expect(page).toContain('nepal: "Nepal MRP Size Photo & Passport Photo Maker"');
    expect(page).toContain('nepal: "Nepal MRP Size Photo Maker"');
    expect(COUNTRY_SPECS.nepal.verified).toBe("aggregator");
  });

  it("gives visitors a plain Good to know, not the developer notes", () => {
    const entry = page.match(/^\s+nepal:\n\s+"([^"]+)"/m)![1];
    expect(entry).toContain("MRP size photo");
    expect(entry).toContain("does not publish it");
    expect(entry).toContain("in the past six months");
    expect(entry).not.toMatch(/⚠|SCOPE|this record/i);
  });

  it("moves only the Nepal maker's date", () => {
    const dates = Object.fromEntries(sitemap().map((e) => [e.url.replace(/^https:\/\/[^/]+/, ""), String(e.lastModified)]));
    expect(dates["/nepal-passport-photo-maker/"]).toBe("2026-10-15");
    expect(dates["/pakistan-passport-photo-maker/"]).not.toBe("2026-10-15");
  });
});
