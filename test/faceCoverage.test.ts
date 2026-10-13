/**
 * Face coverage (lib/faceCoverage.ts) against UPSC's own sample photos.
 * Landmark boxes and the true head boxes were measured on 10 Oct 2026 with the
 * site's face detector (docs/feature-upsc-face-coverage-2026-10.md): UPSC
 * rejected akash_1 (head 38.6% of the photo) and akash_2 (58.0%) and accepted
 * akash_3 (84.3%).
 */
import { describe, expect, it } from "vitest";
import {
  estimateHeadBox,
  headCoverage,
  headInCrop,
  headIsCut,
  planCloserCrop,
  type FaceLandmarkBox,
} from "@/lib/faceCoverage";

/** A landmark box of the measured size, centred on the measured head, chin at the measured y. */
function sample(width: number, height: number, faceW: number, faceH: number, chin: number, cx: number) {
  const face: FaceLandmarkBox = {
    xSpan: { min: cx - faceW / 2, max: cx + faceW / 2 },
    ySpan: { min: chin - faceH, max: chin },
  };
  return { width, height, face };
}

const AKASH_1 = sample(1024, 1024, 0.425 * 1024, 0.51 * 1024, 741, (234 + 781) / 2);
const AKASH_2 = sample(808, 861, 0.542 * 808, 0.612 * 861, 738, (133 + 680) / 2);
const AKASH_3 = sample(619, 775, 0.705 * 619, 0.675 * 775, 741, (29 + 575) / 2);

const coverageOf = (s: typeof AKASH_1) => headCoverage(estimateHeadBox(s.face), s.width, s.height);

describe("headCoverage on UPSC's samples", () => {
  it("reproduces the measured head share within 1.5 points", () => {
    expect(coverageOf(AKASH_1)).toBeCloseTo(0.386, 1);
    expect(Math.abs(coverageOf(AKASH_1) - 0.386)).toBeLessThan(0.015);
    expect(Math.abs(coverageOf(AKASH_2) - 0.58)).toBeLessThan(0.015);
    expect(Math.abs(coverageOf(AKASH_3) - 0.843)).toBeLessThan(0.015);
  });

  it("puts UPSC's rejected samples under 75% and its accepted one above", () => {
    expect(coverageOf(AKASH_1)).toBeLessThan(0.75);
    expect(coverageOf(AKASH_2)).toBeLessThan(0.75);
    expect(coverageOf(AKASH_3)).toBeGreaterThanOrEqual(0.75);
  });

  it("estimates the accepted sample's ears inside the photo, as measured (29 and 575 px)", () => {
    const head = estimateHeadBox(AKASH_3.face);
    expect(head.left).toBeGreaterThan(20);
    expect(head.right).toBeLessThan(585);
    expect(headIsCut(head, AKASH_3.width)).toBe(false);
  });
});

describe("planCloserCrop", () => {
  it("crops a too-small face to about the target without cutting the head", () => {
    for (const s of [AKASH_1, AKASH_2]) {
      const head = estimateHeadBox(s.face);
      const crop = planCloserCrop(head, s.width, s.height)!;
      expect(crop).not.toBeNull();
      const inCrop = headInCrop(head, crop);
      expect(inCrop.left).toBeGreaterThanOrEqual(0);
      expect(inCrop.right).toBeLessThanOrEqual(crop.width);
      expect(inCrop.bottom).toBeLessThanOrEqual(crop.height);
      const after = headCoverage(inCrop, crop.width, crop.height);
      expect(after).toBeGreaterThanOrEqual(0.75);
      expect(after).toBeLessThan(0.9);
    }
  });

  it("leaves room above the head for hair the estimate doesn't reach", () => {
    // A small head with space above it (UPSC's samples all reach the top edge).
    const s = sample(1000, 1000, 300, 360, 700, 500);
    const head = estimateHeadBox(s.face);
    const inCrop = headInCrop(head, planCloserCrop(head, s.width, s.height)!);
    expect(inCrop.top).toBeGreaterThanOrEqual(0.07 * (head.bottom - head.top));
  });

  it("leaves a photo that already meets the target alone", () => {
    expect(planCloserCrop(estimateHeadBox(AKASH_3.face), AKASH_3.width, AKASH_3.height)).toBeNull();
  });

  it("keeps the crop inside the photo when the hair reaches the top edge", () => {
    const s = sample(1000, 1000, 300, 360, 420, 500); // hair runs off the top
    const crop = planCloserCrop(estimateHeadBox(s.face), s.width, s.height)!;
    expect(crop).not.toBeNull();
    expect(crop.x).toBeGreaterThanOrEqual(0);
    expect(crop.y).toBe(0);
    expect(crop.x + crop.width).toBeLessThanOrEqual(1000);
    expect(crop.y + crop.height).toBeGreaterThanOrEqual(420);
  });

  it("refuses to crop when the photo already cuts off the side of the head", () => {
    const s = sample(1000, 1000, 300, 360, 700, 150); // ear past the left edge
    expect(planCloserCrop(estimateHeadBox(s.face), s.width, s.height)).toBeNull();
  });
});

describe("headIsCut", () => {
  it("flags a photo that cuts off the ears (UPSC's 'Too Close' sample)", () => {
    const s = sample(400, 500, 380, 420, 480, 200); // head wider than the photo
    expect(headIsCut(estimateHeadBox(s.face), s.width)).toBe(true);
  });

  it("allows hair touching the top edge, as in UPSC's accepted sample", () => {
    expect(headIsCut(estimateHeadBox(AKASH_3.face), AKASH_3.width)).toBe(false);
  });
});
