import { describe, it, expect } from "vitest";
import {
  computeSquareFaceCrop,
  centerSquareCrop,
} from "@/lib/squareFaceCrop";
import type { FaceMeasurements } from "@/lib/headPositioning";

// A face in a 1000x1500 portrait: head 360px tall, centred at x=500.
const face: FaceMeasurements = {
  crownY: 300,
  chinY: 660, // headPx = 360
  eyeCenterY: 430,
  faceCenterX: 500,
};
const source = { width: 1000, height: 1500 };

describe("computeSquareFaceCrop", () => {
  it("produces a square crop (sw === sh) and square output", () => {
    const r = computeSquareFaceCrop(face, source, { side: 400 });
    expect(r.crop.sw).toBe(r.crop.sh);
    expect(r.output).toEqual({ width: 400, height: 400 });
  });

  it("sizes the crop so the head fills ~headRatio of the frame", () => {
    const r = computeSquareFaceCrop(face, source, { side: 400, headRatio: 0.6 });
    // headPx 360 / 0.6 = 600 -> crop side ~600, achieved ratio ~0.6
    expect(r.crop.sw).toBe(600);
    expect(r.achieved.headRatio).toBeCloseTo(0.6, 2);
  });

  it("centres horizontally on the face", () => {
    const r = computeSquareFaceCrop(face, source, { side: 400, headRatio: 0.6 });
    const cropCenterX = r.crop.sx + r.crop.sw / 2;
    expect(cropCenterX).toBeCloseTo(face.faceCenterX, 0);
  });

  it("places the eye line in the upper portion of the crop", () => {
    const r = computeSquareFaceCrop(face, source, {
      side: 400,
      headRatio: 0.6,
      eyeFromTop: 0.42,
    });
    const eyeFromTop = (face.eyeCenterY! - r.crop.sy) / r.crop.sw;
    expect(eyeFromTop).toBeCloseTo(0.42, 2);
  });

  it("clamps the crop inside the image bounds", () => {
    const r = computeSquareFaceCrop(face, source, { side: 400 });
    expect(r.crop.sx).toBeGreaterThanOrEqual(0);
    expect(r.crop.sy).toBeGreaterThanOrEqual(0);
    expect(r.crop.sx + r.crop.sw).toBeLessThanOrEqual(source.width);
    expect(r.crop.sy + r.crop.sh).toBeLessThanOrEqual(source.height);
  });

  it("warns and clamps when the head leaves no margin (square can't fit)", () => {
    // Tiny image where the desired square exceeds both dimensions.
    const tiny = { width: 400, height: 400 };
    const bigHead: FaceMeasurements = {
      crownY: 40,
      chinY: 360, // headPx 320 -> /0.62 ~516 > 400
      eyeCenterY: 150,
      faceCenterX: 200,
    };
    const r = computeSquareFaceCrop(bigHead, tiny, { side: 400 });
    expect(r.crop.sw).toBe(400);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("warns when the source must be upscaled to reach the target size", () => {
    // Small crop (head 120px) but a large 800px target -> upscale.
    const small: FaceMeasurements = {
      crownY: 100,
      chinY: 220, // headPx 120 -> /0.62 ~194 crop side
      eyeCenterY: 150,
      faceCenterX: 300,
    };
    const r = computeSquareFaceCrop(small, { width: 600, height: 600 }, { side: 800 });
    expect(r.achieved.upscale).toBeGreaterThan(1.1);
    expect(r.warnings.some((w) => /upscal/i.test(w))).toBe(true);
  });

  it("throws when crownY is not above chinY", () => {
    expect(() =>
      computeSquareFaceCrop(
        { crownY: 500, chinY: 400, faceCenterX: 100 },
        source,
        { side: 400 }
      )
    ).toThrow();
  });
});

describe("centerSquareCrop", () => {
  it("returns the largest centred square for a landscape image", () => {
    const r = centerSquareCrop({ width: 1600, height: 900 });
    expect(r.sw).toBe(900);
    expect(r.sh).toBe(900);
    expect(r.sx).toBe(350); // (1600-900)/2
    expect(r.sy).toBe(0);
  });
});
