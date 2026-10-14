/**
 * aspectPadding (lib/signature.ts): grows a trimmed signature to an exam's
 * published shape by adding margins only, so no stroke is ever cut.
 */
import { describe, expect, it } from "vitest";
import { aspectPadding } from "@/lib/signature";

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
