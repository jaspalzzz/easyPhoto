import { describe, expect, it } from "vitest";
import { hubCountries, makerPagesByKind, MAKER_PAGES } from "@/lib/makerPages";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";

/** Every path that actually gets a generated maker route. */
const REAL_MAKER_PATHS = new Set(MAKER_PAGES.map((m) => `/${m.slug}/`));

/**
 * Regression guard for a bug that shipped once: the passport hub's picker and
 * its "size by country" grid drew from different sources and disagreed (22 vs 7
 * countries). Both now read hubCountries(), so these invariants must hold.
 */
describe("hubCountries — single source of truth for hub country lists", () => {
  it("passport hub lists EVERY launch country (not just bespoke passport pages)", () => {
    expect(hubCountries("passport").length).toBe(LAUNCH_ORDER.length);
    expect(hubCountries("passport").length).toBeGreaterThanOrEqual(22);
  });

  it("passport hub includes countries without a dedicated passport page (e.g. germany)", () => {
    const ids = hubCountries("passport").map((c) => c.key);
    expect(ids).toContain("germany");
    expect(ids).toContain("schengen");
  });

  it("visa hub matches the visa maker pages exactly", () => {
    expect(hubCountries("visa").length).toBe(makerPagesByKind("visa").length);
  });

  it("every hub link points at a REAL generated maker route (no 404s)", () => {
    // Guards the saudi-evisa class of bug: primaryMakerPath must resolve to a
    // registered slug (e.g. /saudi-visa-photo-maker/), not a string-built one
    // (/saudi-evisa-visa-photo-maker/) that is never generated.
    for (const kind of ["passport", "visa"] as const) {
      for (const c of hubCountries(kind)) {
        expect(REAL_MAKER_PATHS.has(c.path)).toBe(true);
      }
    }
  });

  it("every entry has a path, a flag and a spec with print dimensions", () => {
    for (const kind of ["passport", "visa"] as const) {
      for (const c of hubCountries(kind)) {
        expect(c.path).toMatch(/^\/[a-z0-9-]+\/$/);
        expect(c.flag).toBeTruthy();
        expect(c.label).toBeTruthy();
        expect(c.spec).toBeTruthy();
      }
    }
  });
});
