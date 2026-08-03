/**
 * Data invariants for background colour, stated explicitly rather than parsed.
 *
 * A regex guard over copy caught the phrasings we had already thought of and
 * passed ten more. Worse, it could not see a record whose prose said one thing
 * while its data said another: the UK description read "any plain light colour
 * … or white" while `acceptableHex` listed only cream and grey.
 *
 * A first attempt at this file tried to read the claim out of the description
 * and immediately mis-parsed "rejects white" as an acceptance. Inferring intent
 * from prose is the brittleness we are trying to leave behind, so the
 * expectation is written down per country, against the source that establishes
 * it, and the data is checked against that.
 */
import { describe, expect, it } from "vitest";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const WHITES = ["#FFFFFF", "#FAFAFA", "#FAFAF7"];

/** Authorities whose published standard permits a white background. */
const WHITE_PERMITTED: Record<string, string> = {
  // "any plain background that is any light colour (for example different
  // shades of white (cream, ivory or vanilla) and light grey)"
  uk: "gov.uk photographic standards",
  us: "travel.state.gov — white or off-white",
  india: "PSK/overseas ICAO guidance — plain white",
  italy: "visa centre guidance — plain white",
  netherlands: "netherlandsworldwide.nl — light grey, light blue or white",
};

/** Authorities that specifically ask for grey and refuse white. */
const WHITE_REFUSED: Record<string, string> = {
  germany: "germany.info — single-colour light grey, white rejected",
};

const hasWhite = (key: string) =>
  COUNTRY_SPECS[key]!.background.acceptableHex.some((hex) =>
    WHITES.includes(hex.toUpperCase()),
  );

describe("background data matches the published standard", () => {
  it("permits white where the authority permits it", () => {
    for (const [key, source] of Object.entries(WHITE_PERMITTED)) {
      expect(COUNTRY_SPECS[key], `${key} missing from registry`).toBeDefined();
      expect(hasWhite(key), `${key} must accept white — ${source}`).toBe(true);
    }
  });

  it("refuses white where the authority refuses it", () => {
    for (const [key, source] of Object.entries(WHITE_REFUSED)) {
      expect(hasWhite(key), `${key} must not accept white — ${source}`).toBe(
        false,
      );
    }
  });

  it("never describes a white-permitting authority as refusing white", () => {
    for (const key of Object.keys(WHITE_PERMITTED)) {
      expect(
        COUNTRY_SPECS[key]!.background.description,
        `${key} description contradicts its own acceptableHex`,
      ).not.toMatch(/not white|no white|rejects? white|except white/i);
    }
  });

  it("keeps UK glasses on the published standard, not the US rule", () => {
    // HMPO allows frames over the eye socket provided both eyes stay visible.
    const uk = COUNTRY_SPECS.uk!;
    expect(uk.glasses).not.toBe(false);
    expect(String(uk.glasses)).toMatch(/allow/i);
  });
});
