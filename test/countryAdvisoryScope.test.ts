/**
 * Guards which country advisories survive onto a visa maker page.
 *
 * The maker template used to drop `advisory` on every visa page. The intent was
 * right for records that also describe a passport — Australia's advisory is
 * about the passport guarantor, India's about PSK capture, and neither means
 * anything on a visa page. But the same blanket rule silently deleted the
 * advisories on visa-only records, which is where the warning matters most:
 * Canada's says the 35x45mm size covers temporary residence and not permanent
 * residence, and Japan's says missions publish different sizes. Both were
 * written to answer an accuracy review and neither reached a reader.
 *
 * An earlier version of this file re-implemented the page's predicate, filtered
 * the records by it, then asserted the same predicate — which is true by
 * construction and would have passed even with the blanket removal restored.
 * It therefore tests `specForDocumentKind`, the function the page actually
 * calls, and asserts on the returned spec.
 */
import { describe, it, expect } from "vitest";
import {
  COUNTRY_SPECS,
  specForDocumentKind,
  type CountrySpec,
} from "@/lib/countrySpecs";

const entries = Object.entries(COUNTRY_SPECS);
const withAdvisory = entries.filter(([, s]) => s.advisory);
const describesAPassport = (s: CountrySpec) =>
  s.documents.some((d) => /passport/i.test(d));

describe("advisory scoping on maker pages", () => {
  it("has advisories to check", () => {
    expect(withAdvisory.length).toBeGreaterThan(0);
  });

  it("delivers the advisory to a visa page for visa-only records", () => {
    const visaOnly = withAdvisory.filter(([, s]) => !describesAPassport(s));
    expect(visaOnly.length).toBeGreaterThan(0);
    for (const [key, spec] of visaOnly) {
      // The assertion is on the OUTPUT of the page's transformation, so a
      // blanket `advisory: undefined` on visa pages fails here.
      expect(
        specForDocumentKind(spec, "visa").advisory,
        `${key} is visa-only; its advisory must survive onto the visa page`,
      ).toBe(spec.advisory);
    }
  });

  it("withholds a passport-scoped advisory from a visa page", () => {
    const alsoPassport = withAdvisory.filter(([, s]) => describesAPassport(s));
    expect(alsoPassport.length).toBeGreaterThan(0);
    for (const [key, spec] of alsoPassport) {
      expect(
        specForDocumentKind(spec, "visa").advisory,
        `${key} covers a passport, so its advisory is passport-scoped`,
      ).toBeUndefined();
      // ...but the passport page still shows it.
      expect(specForDocumentKind(spec, "passport").advisory).toBe(spec.advisory);
    }
  });

  it("never mutates the registry record", () => {
    const australia = COUNTRY_SPECS.australia!;
    const before = australia.advisory;
    specForDocumentKind(australia, "visa");
    expect(COUNTRY_SPECS.australia!.advisory).toBe(before);
  });

  it("scopes Canada's advisory to temporary residence", () => {
    const canada = COUNTRY_SPECS.canada!;
    expect(canada.documents).not.toContain("Passport");
    expect(canada.advisory).toMatch(/temporary-residence/i);
    expect(canada.advisory).toMatch(/permanent residence/i);
    for (const field of [canada.advisory ?? "", canada.notes]) {
      expect(field).not.toMatch(/use this for[^.]*express entry/i);
    }
  });

  it("does not present Japan's size as the single MOFA rule", () => {
    const japan = COUNTRY_SPECS.japan!;
    // MOFA's application form gives 35x45, but missions publish other sizes,
    // so this must not be flagged as authority-confirmed for every applicant.
    expect(japan.verified).not.toBe("gov");
    expect(japan.printMm).toEqual({ width: 35, height: 45 });
    expect(japan.advisory).toMatch(/mission/i);
  });
});
