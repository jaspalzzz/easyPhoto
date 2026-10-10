/**
 * aspectPadding (lib/signature.ts): grows a trimmed signature to an exam's
 * published shape by adding margins only, so no stroke is ever cut.
 */
import { describe, expect, it } from "vitest";
import { aspectPadding, sideRangeFit } from "@/lib/signature";

describe("aspectPadding", () => {
  it("adds space above and below a signature wider than the shape", () => {
    // SSC's ~6.0 × 2.0 cm = 3:1; a tight crop of 1124 × 308 is 3.65:1.
    expect(aspectPadding(1124, 308, 6 / 2)).toEqual({ width: 1124, height: 375, x: 0, y: 33 });
  });

  it("adds space left and right of a signature taller than the shape", () => {
    expect(aspectPadding(240, 140, 3)).toEqual({ width: 420, height: 140, x: 90, y: 0 });
  });

  it("never shrinks either side, so the ink always fits", () => {
    for (const [w, h, r] of [
      [1124, 308, 3],
      [240, 140, 3],
      [500, 500, 3.5 / 1.5],
      [900, 120, 2],
    ] as const) {
      const pad = aspectPadding(w, h, r)!;
      expect(pad.width).toBeGreaterThanOrEqual(w);
      expect(pad.height).toBeGreaterThanOrEqual(h);
      expect(pad.x + w).toBeLessThanOrEqual(pad.width);
      expect(pad.y + h).toBeLessThanOrEqual(pad.height);
      expect(Math.abs(pad.width / pad.height - r) / r).toBeLessThan(0.01);
    }
  });

  it("leaves a signature already within 3% of the shape alone", () => {
    expect(aspectPadding(600, 200, 3)).toBeNull();
    expect(aspectPadding(610, 200, 3)).toBeNull();
  });

  it("ignores unusable input", () => {
    expect(aspectPadding(0, 100, 3)).toBeNull();
    expect(aspectPadding(100, 0, 3)).toBeNull();
    expect(aspectPadding(100, 50, 0)).toBeNull();
    expect(aspectPadding(100, 50, Number.NaN)).toBeNull();
  });
});

// UPSC: "The height and width of signature image must be between 350 and 500
// pixels" — the form refused our 384 × 534 three-signature output.
describe("sideRangeFit", () => {
  it("shrinks a too-tall three-signature image into 350–500 on both sides", () => {
    expect(sideRangeFit(384, 534, 350, 500)).toEqual({ pad: null, width: 360, height: 500 });
  });

  it("adds side margins to a stack too narrow for the range, then scales", () => {
    expect(sideRangeFit(300, 900, 350, 500)).toEqual({
      pad: { width: 630, height: 900, x: 165, y: 0 },
      width: 350,
      height: 500,
    });
  });

  it("adds top and bottom margins to a signature too wide for the range", () => {
    expect(sideRangeFit(1200, 300, 350, 500)).toEqual({
      pad: { width: 1200, height: 840, x: 0, y: 270 },
      width: 500,
      height: 350,
    });
  });

  it("enlarges a small image until its short side reaches the minimum", () => {
    expect(sideRangeFit(200, 250, 350, 500)).toEqual({ pad: null, width: 350, height: 438 });
  });

  it("always lands inside the range and never crops", () => {
    for (const [w, h] of [
      [384, 534], [600, 600], [3000, 4000], [2400, 700], [120, 900], [350, 500], [499, 351], [1, 1000],
    ] as const) {
      const fit = sideRangeFit(w, h, 350, 500);
      const out = fit ?? { pad: null, width: w, height: h };
      for (const side of [out.width, out.height]) {
        expect(side).toBeGreaterThanOrEqual(350);
        expect(side).toBeLessThanOrEqual(500);
      }
      if (fit?.pad) {
        expect(fit.pad.x + w).toBeLessThanOrEqual(fit.pad.width);
        expect(fit.pad.y + h).toBeLessThanOrEqual(fit.pad.height);
      }
    }
  });

  it("leaves an image already in range alone and ignores unusable input", () => {
    expect(sideRangeFit(400, 450, 350, 500)).toBeNull();
    expect(sideRangeFit(0, 450, 350, 500)).toBeNull();
    expect(sideRangeFit(400, 450, 500, 350)).toBeNull();
  });
});
