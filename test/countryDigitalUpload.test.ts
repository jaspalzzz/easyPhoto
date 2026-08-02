/**
 * Guards which country pages answer "what file size does the upload need?".
 *
 * Two different things look alike in this registry:
 *
 *   fileSizeKb: null + pixel figures  -> there IS an upload, the authority just
 *                                        publishes no KB band (17 countries)
 *   no pixel figures at all           -> there is NO upload; the application
 *                                        takes printed photographs (Ireland)
 *
 * A first pass at suppressing the Irish contradiction tested `fileSizeKb` and
 * stripped the question from all 17 of the first group as well. This asserts
 * the distinction directly so that cannot recur silently.
 */
import { describe, it, expect } from "vitest";
import { COUNTRY_SPECS, acceptsDigitalUpload } from "@/lib/countrySpecs";
import { countryFaqItems } from "@/lib/faqs";

const UPLOAD_Q = /file size does .* online .* upload need/i;

describe("digital upload detection", () => {
  it("counts a record with pixel figures but no KB band as an upload", () => {
    const noBandButPixels = Object.values(COUNTRY_SPECS).filter(
      (s) => !s.digital.fileSizeKb && acceptsDigitalUpload(s),
    );
    // These are the ones the bad predicate silently dropped.
    expect(noBandButPixels.length).toBeGreaterThanOrEqual(15);
  });

  it("treats a print-only application as having no upload", () => {
    const ireland = COUNTRY_SPECS.ireland!;
    expect(acceptsDigitalUpload(ireland)).toBe(false);
    const qs = countryFaqItems(ireland, "visa").map((f) => f.q);
    expect(qs.some((q) => UPLOAD_Q.test(q))).toBe(false);
  });

  it("asks the upload question on every country that accepts one", () => {
    for (const [key, spec] of Object.entries(COUNTRY_SPECS)) {
      if (!acceptsDigitalUpload(spec)) continue;
      const qs = countryFaqItems(spec, "visa").map((f) => f.q);
      expect(
        qs.some((q) => UPLOAD_Q.test(q)),
        `${key} accepts an upload but its FAQ never mentions one`,
      ).toBe(true);
    }
  });

  it("keeps New Zealand's minimum file size, which rejection depends on", () => {
    // INZ rejects a photo that is too SMALL (under 512 KB) as well as too
    // large. Dropping the min would leave a compressed export silently invalid.
    const nz = COUNTRY_SPECS["new-zealand"]!;
    expect(nz.digital.fileSizeKb?.min).toBe(512);
    expect(nz.notes).toMatch(/512 KB/);
  });
});
