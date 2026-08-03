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
import { computeCrop } from "@/lib/headPositioning";

const UPLOAD_Q = /file size does .* online .* upload need/i;

describe("digital upload detection", () => {
  it("counts a record with pixel figures but no KB band as an upload", () => {
    const noBandButPixels = Object.values(COUNTRY_SPECS).filter(
      (s) => !s.digital.fileSizeKb && acceptsDigitalUpload(s),
    );
    // These are the ones the bad predicate silently dropped. Asserted as a
    // property with a floor well below the current count, not pinned to it:
    // recording a real KB band for a country legitimately moves the number, and
    // a test that fails on correct data teaches people to edit the test.
    expect(noBandButPixels.length).toBeGreaterThan(5);
    for (const spec of noBandButPixels) {
      expect(spec.digital.fileSizeKb).toBeFalsy();
      expect(acceptsDigitalUpload(spec)).toBe(true);
    }
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

/**
 * Exact upload sizes must survive the export pipeline, not just the registry.
 *
 * Singapore's visa upload must be exactly 400x514 and Saudi's eVisa exactly
 * 200x200. `recommendedDigitalDpi()` reads only `pxMin`, so both records fell
 * through to 300 DPI and exported the mm-derived size instead (413x531 for
 * Singapore). No integer DPI reproduces either target — 51mm at 100 DPI rounds
 * to 201, not 200 — so `computeCrop` has to be handed the size directly.
 */
describe("exact upload sizes reach the export", () => {
  const face = { crownY: 100, chinY: 400, eyeCenterY: 220, faceCenterX: 1000 };
  const source = { width: 2000, height: 2600 };

  it("exports Singapore at exactly 400x514", () => {
    const spec = COUNTRY_SPECS.singapore!;
    const px = spec.digital.px!;
    expect(px).toEqual({ width: 400, height: 514 });

    const withExact = computeCrop(face, spec, { source, exactOutput: px });
    expect(withExact.output).toEqual({ width: 400, height: 514 });

    // Without it, the mm-x-DPI path returns something else — the shipped bug.
    const withoutExact = computeCrop(face, spec, { source });
    expect(withoutExact.output).not.toEqual({ width: 400, height: 514 });
  });

  it("exports the Saudi eVisa at exactly 200x200", () => {
    const spec = COUNTRY_SPECS["saudi-evisa"]!;
    const px = spec.digital.px!;
    const out = computeCrop(face, spec, { source, exactOutput: px });
    expect(out.output).toEqual({ width: 200, height: 200 });
  });

  it("scales head geometry to the exact canvas, not the nominal DPI", () => {
    // The first version of exactOutput overrode only the canvas size. Head and
    // eye targets stayed at 300 DPI, so Saudi asked for a ~455px head inside a
    // 200px frame (227%) and the crop cut through the face.
    for (const key of ["singapore", "saudi-evisa"] as const) {
      const spec = COUNTRY_SPECS[key]!;
      const out = computeCrop(face, spec, {
        source,
        exactOutput: spec.digital.px,
      });
      const band = spec.headPercentOfFrame;
      expect(band, `${key} needs a head band to check against`).toBeDefined();
      expect(
        out.achieved.headPercentOfFrame,
        `${key} head must land inside its own ${band!.min}-${band!.max}% band`,
      ).toBeGreaterThanOrEqual(band!.min);
      expect(out.achieved.headPercentOfFrame).toBeLessThanOrEqual(band!.max);
    }
  });

  it("leaves records without an exact size on the DPI path", () => {
    const uk = COUNTRY_SPECS.uk!;
    expect(uk.digital.px).toBeUndefined();
    const out = computeCrop(face, uk, { source });
    expect(out.output.width).toBeGreaterThan(0);
  });
});
