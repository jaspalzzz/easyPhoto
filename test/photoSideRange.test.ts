/**
 * sideRangeScale (lib/imaging.ts): OCI publishes a photo of 200–900 px on each
 * side ("The maximum dimensions are 900 pixels (width) x 900 pixels (height)");
 * our phone-photo output came out 2168 × 2168 and the portal refuses it.
 */
import { describe, expect, it } from "vitest";
import { sideRangeScale } from "@/lib/imaging";

describe("sideRangeScale", () => {
  it("shrinks a photo larger than the maximum", () => {
    expect(2168 * sideRangeScale(2168, 2168, 200, 900)).toBe(900);
  });

  it("enlarges a photo below the minimum", () => {
    expect(150 * sideRangeScale(150, 150, 200, 900)).toBe(200);
  });

  it("leaves a photo already in range alone", () => {
    expect(sideRangeScale(600, 600, 200, 900)).toBe(1);
    expect(sideRangeScale(900, 200, 200, 900)).toBe(1);
  });

  it("keeps the cap when no size fits both limits", () => {
    expect(sideRangeScale(2000, 100, 200, 900)).toBeCloseTo(0.45);
  });

  it("ignores unusable input", () => {
    expect(sideRangeScale(0, 100, 200, 900)).toBe(1);
    expect(sideRangeScale(100, 100, 900, 200)).toBe(1);
  });
});
