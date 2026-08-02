/**
 * Guards which country advisories survive onto a visa maker page.
 *
 * The maker template used to drop `advisory` on every visa page. The intent was
 * right for records that also describe a passport — Australia's advisory is
 * about the passport guarantor, India's is about PSK capture, and neither means
 * anything on a visa page. But the same blanket rule silently deleted the
 * advisories on visa-only records, which is where the warning matters most:
 * Canada's says the 35x45mm size covers temporary residence and not permanent
 * residence, and Japan's says MOFA publishes no single size. Both were written
 * to answer an accuracy review and neither reached a reader.
 *
 * This asserts the data side of that contract, so a new visa-only advisory
 * cannot be added on the assumption it will render when the template would in
 * fact discard it.
 */
import { describe, it, expect } from "vitest";
import { COUNTRY_SPECS, type CountrySpec } from "@/lib/countrySpecs";

/** Mirrors the predicate in app/[maker]/page.tsx. */
const describesAPassport = (spec: CountrySpec) =>
  spec.documents.some((d) => /passport/i.test(d));

const withAdvisory = Object.entries(COUNTRY_SPECS).filter(
  ([, spec]) => spec.advisory,
);

describe("country advisory scope", () => {
  it("has advisories to check", () => {
    expect(withAdvisory.length).toBeGreaterThan(0);
  });

  it("keeps the advisory on visa-only records", () => {
    const visaOnly = withAdvisory.filter(([, s]) => !describesAPassport(s));
    // These exist to warn a visa applicant; dropping them defeats the point.
    expect(visaOnly.map(([k]) => k).sort()).toEqual(["canada", "japan"]);
    for (const [, spec] of visaOnly) {
      expect(describesAPassport(spec)).toBe(false);
    }
  });

  it("scopes Canada's advisory to temporary residence", () => {
    const canada = COUNTRY_SPECS.canada!;
    expect(canada.documents).not.toContain("Passport");
    // The claim Codex flagged: the temporary-residence size was presented as
    // covering PR, Express Entry and renewal too.
    expect(canada.advisory).toMatch(/temporary-residence/i);
    expect(canada.advisory).toMatch(/permanent residence/i);
    for (const field of [canada.advisory ?? "", canada.notes]) {
      expect(field).not.toMatch(/use this for[^.]*express entry/i);
    }
  });

  it("does not present Japan's size as the single MOFA rule", () => {
    const japan = COUNTRY_SPECS.japan!;
    // Missions genuinely differ (45x45 vs 35x45 vs 2x2in), so the record must
    // not be flagged as authority-confirmed and must say the size can change.
    expect(japan.verified).not.toBe("gov");
    expect(japan.advisory).toMatch(/mission/i);
  });
});
