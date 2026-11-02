import { describe, expect, it } from "vitest";
import { hubCountries, makerPagesByKind, MAKER_PAGES, primaryMakerPath } from "@/lib/makerPages";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { isDeindexed } from "@/lib/deindexed";

/** Every path that actually gets a generated maker route. */
const REAL_MAKER_PATHS = new Set(MAKER_PAGES.map((m) => `/${m.slug}/`));
/** Retired makers whose replacement guide carries the same tool. */
const REPLACEMENT_PAGES = new Set(["/schengen-visa-photo/", "/canada-passport-photo/"]);

/**
 * Regression guard for a bug that shipped once: the passport hub's picker and
 * its "size by country" grid drew from different sources and disagreed (22 vs 7
 * countries). Both now read hubCountries(), so these invariants must hold.
 */
describe("hubCountries — single source of truth for hub country lists", () => {
  it("passport hub lists every launch country that still has an indexed page", () => {
    const expected = LAUNCH_ORDER.filter(
      (id) => !isDeindexed(primaryMakerPath(id)) || id === "schengen" || id === "canada",
    );
    expect(hubCountries("passport").map((c) => c.key)).toEqual(expected);
  });

  it("passport hub includes countries without a dedicated passport page (e.g. uae)", () => {
    const ids = hubCountries("passport").map((c) => c.key);
    expect(ids).toContain("uae");
    expect(ids).toContain("schengen");
  });

  it("visa hub matches the indexed visa maker pages, plus the Schengen and Canada guides", () => {
    const indexed = makerPagesByKind("visa").filter((m) => !isDeindexed(`/${m.slug}/`));
    expect(hubCountries("visa").length).toBe(indexed.length + 2);
  });

  it("never sends a picker to a retired or hidden page", () => {
    // Regression: the pickers listed Kuwait, Qatar, Bahrain, Spain and Portugal
    // after those makers began to 301 elsewhere (round 3, 1 Nov 2026).
    for (const kind of ["passport", "visa"] as const) {
      for (const c of hubCountries(kind)) {
        expect(isDeindexed(c.path), `${c.label} → ${c.path}`).toBe(false);
      }
    }
  });

  it("every hub link points at a REAL generated page (no 404s)", () => {
    // Guards the saudi-evisa class of bug: primaryMakerPath must resolve to a
    // registered slug (e.g. /saudi-visa-photo-maker/), not a string-built one
    // (/saudi-evisa-visa-photo-maker/) that is never generated.
    for (const kind of ["passport", "visa"] as const) {
      for (const c of hubCountries(kind)) {
        expect(REAL_MAKER_PATHS.has(c.path) || REPLACEMENT_PAGES.has(c.path)).toBe(true);
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
