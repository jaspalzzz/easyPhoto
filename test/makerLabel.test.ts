/**
 * The maker heading must never repeat the document word.
 *
 * `/schengen-visa-photo-maker/` shipped "Schengen Visa Visa Photo Size & Maker"
 * as its <title>, "Schengen Visa Visa Photo Maker" as its <h1>, and the same
 * string as the SoftwareApplication schema name. The cause was structural, not
 * a typo: the template appended the kind to `spec.label`, and that label
 * already ended in "Visa" for this record.
 *
 * The guard is written as an invariant over every registered maker page rather
 * than as a check for the word "Visa", so a future label ending in "Passport"
 * — or a new record like an "India e-Visa" — is caught by the same rule instead
 * of by anyone remembering this incident.
 */
import { describe, expect, it } from "vitest";
import { MAKER_PAGES, labelWithDoc, makerSpec } from "@/lib/makerPages";

/** Any word repeated back-to-back, case-insensitively. */
const REPEATED_WORD = /\b(\w+)\s+\1\b/i;

describe("maker heading construction", () => {
  it("has maker pages to check", () => {
    expect(MAKER_PAGES.length).toBeGreaterThan(10);
  });

  it("never repeats the document word on any registered maker page", () => {
    const offenders: string[] = [];
    for (const page of MAKER_PAGES) {
      const spec = makerSpec(page.slug);
      if (!spec) continue;
      const Doc = page.kind === "visa" ? "Visa" : "Passport";
      // The three strings the page actually publishes.
      const heading = `${labelWithDoc(spec.label, page.kind, Doc)} Photo Maker`;
      const title = `${labelWithDoc(spec.label, page.kind, Doc)} Photo Size & Maker`;
      const prose = `${labelWithDoc(spec.label, page.kind)} photo`;
      for (const [what, value] of [
        ["h1", heading],
        ["title", title],
        ["prose", prose],
      ] as const) {
        const hit = value.match(REPEATED_WORD);
        if (hit) offenders.push(`/${page.slug}/ ${what}: "${value}" repeats "${hit[0]}"`);
      }
    }
    expect(offenders, "maker strings repeating a word").toEqual([]);
  });

  it("still appends the document word when the label does not carry it", () => {
    // The fix must not silently drop the word for ordinary country labels.
    expect(labelWithDoc("United States", "passport", "Passport")).toBe(
      "United States Passport",
    );
    expect(labelWithDoc("Japan", "visa", "Visa")).toBe("Japan Visa");
    expect(labelWithDoc("United States", "passport")).toBe(
      "United States passport",
    );
  });

  it("drops the duplicate only when the label already ends with the kind", () => {
    expect(labelWithDoc("Schengen Visa", "visa", "Visa")).toBe("Schengen Visa");
    expect(labelWithDoc("Schengen Visa", "visa")).toBe("Schengen Visa");
    // Ends with a different document word: still appended, not swallowed.
    expect(labelWithDoc("Schengen Visa", "passport", "Passport")).toBe(
      "Schengen Visa Passport",
    );
    // Substring, not the final word — must not match.
    expect(labelWithDoc("Visa Republic", "visa", "Visa")).toBe(
      "Visa Republic Visa",
    );
  });
});
