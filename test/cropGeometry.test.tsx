/**
 * Ratio-locked crops must keep their ratio when the box hits the image edge.
 * The old code set height = width / ratio and then clamped only the height, so
 * a 9:16 crop of a square photo came out 4:5 (819×1024).
 */
import { describe, expect, it } from "vitest";
import { fitAspect } from "@/components/tools/ImageCropTool";
import { SPEC_OPTIONS } from "@/components/tools/AutoCropTool";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

describe("fitAspect", () => {
  it.each([
    [9 / 16, 1024, 1024],
    [3 / 4, 1024, 1024],
    [16 / 9, 1024, 1024],
    [1, 4032, 3024],
    [9 / 16, 4032, 3024],
    [4 / 3, 3024, 4032],
  ])("ratio %f inside %i×%i stays exact and in bounds", (ratio, W, H) => {
    const { w, h } = fitAspect(W * 0.8, ratio, W, H);
    expect(w / h).toBeCloseTo(ratio, 9);
    expect(w).toBeLessThanOrEqual(W);
    expect(h).toBeLessThanOrEqual(H + 1e-9);
  });

  it("never grows beyond the requested width", () => {
    expect(fitAspect(100, 1, 1000, 1000)).toEqual({ w: 100, h: 100 });
  });
});

describe("auto-crop options", () => {
  it("every option is a real country spec (eu/au used to match nothing)", () => {
    for (const o of SPEC_OPTIONS) expect(COUNTRY_SPECS[o.id], o.id).toBeDefined();
  });
});
