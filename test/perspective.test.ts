import { describe, it, expect } from "vitest";
import {
  solveHomography,
  projectPoint,
  isConvexQuad,
  estimateOutputSize,
  type Quad,
} from "@/lib/perspective";

/**
 * The homography is the one piece of the document scanner that can be wrong
 * without looking wrong — a slightly off transform still produces a plausible
 * rectangle. So these tests assert exact corner correspondence and the
 * specifically *projective* behaviour that separates a real perspective
 * correction from a cheap affine stretch.
 */

const RECT: Quad = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 200 },
  { x: 0, y: 200 },
];

/** A page photographed from below: the top edge is the narrower one. */
const TRAPEZOID: Quad = [
  { x: 30, y: 10 },
  { x: 70, y: 10 },
  { x: 95, y: 190 },
  { x: 5, y: 190 },
];

function expectPointClose(actual: { x: number; y: number }, expected: { x: number; y: number }) {
  expect(actual.x).toBeCloseTo(expected.x, 6);
  expect(actual.y).toBeCloseTo(expected.y, 6);
}

describe("solveHomography", () => {
  it("maps every corner exactly onto its counterpart", () => {
    const h = solveHomography(RECT, TRAPEZOID);
    for (let i = 0; i < 4; i++) {
      expectPointClose(projectPoint(h, RECT[i]), TRAPEZOID[i]);
    }
  });

  it("is the identity when a quad maps to itself", () => {
    const h = solveHomography(TRAPEZOID, TRAPEZOID);
    expectPointClose(projectPoint(h, { x: 42, y: 77 }), { x: 42, y: 77 });
  });

  it("inverts: solving the reverse direction round-trips an interior point", () => {
    const forward = solveHomography(RECT, TRAPEZOID);
    const backward = solveHomography(TRAPEZOID, RECT);
    const start = { x: 25, y: 140 };
    const there = projectPoint(forward, start);
    expectPointClose(projectPoint(backward, there), start);
  });

  it("is genuinely projective, not affine", () => {
    // Under an affine map the centre of the rectangle would land on the
    // centroid of the quad. Perspective pulls it toward the narrow edge, so
    // equality here would mean we had silently degraded to an affine fit.
    const h = solveHomography(RECT, TRAPEZOID);
    const centre = projectPoint(h, { x: 50, y: 100 });
    const centroidY =
      TRAPEZOID.reduce((sum, p) => sum + p.y, 0) / 4;
    expect(centre.y).not.toBeCloseTo(centroidY, 2);
    // Foreshortening squashes the receding half of the page into fewer pixels,
    // so the document's true midline lands nearer the narrow (far) edge than
    // the centroid does — above it, i.e. at a smaller y.
    expect(centre.y).toBeLessThan(centroidY);
    // ...but still inside the page, not collapsed onto the far edge itself.
    expect(centre.y).toBeGreaterThan(TRAPEZOID[0].y);
  });

  it("preserves straight lines (the defining property of a projective map)", () => {
    const h = solveHomography(RECT, TRAPEZOID);
    const a = projectPoint(h, { x: 0, y: 0 });
    const b = projectPoint(h, { x: 50, y: 100 });
    const c = projectPoint(h, { x: 100, y: 200 });
    // Collinear before, collinear after: cross product of the two segments ~0.
    const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    expect(Math.abs(cross)).toBeLessThan(1e-6);
  });

  it("throws on collinear corners rather than returning a silent nonsense fit", () => {
    const collinear: Quad = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
    ];
    expect(() => solveHomography(RECT, collinear)).toThrow(/collinear or coincident/);
  });

  it("throws on coincident corners", () => {
    const duplicated: Quad = [
      { x: 5, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 5 },
    ];
    expect(() => solveHomography(duplicated, RECT)).toThrow();
  });
});

describe("isConvexQuad", () => {
  it("accepts a proper rectangle and a proper trapezoid", () => {
    expect(isConvexQuad(RECT)).toBe(true);
    expect(isConvexQuad(TRAPEZOID)).toBe(true);
  });

  it("rejects a bow-tie made by dragging one corner past its neighbour", () => {
    const bowTie: Quad = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 200 },
      { x: 100, y: 200 },
    ];
    expect(isConvexQuad(bowTie)).toBe(false);
  });

  it("rejects four collinear points", () => {
    const line: Quad = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    expect(isConvexQuad(line)).toBe(false);
  });

  it("accepts the same shape wound anticlockwise", () => {
    const reversed = [...RECT].reverse() as unknown as Quad;
    expect(isConvexQuad(reversed)).toBe(true);
  });
});

describe("estimateOutputSize", () => {
  it("returns the exact dimensions of an axis-aligned rectangle", () => {
    expect(estimateOutputSize(RECT)).toEqual({ width: 100, height: 200 });
  });

  it("takes the longer of each pair of opposite edges", () => {
    // Top edge 40 wide, bottom edge 90 wide -> keep 90 rather than averaging.
    expect(estimateOutputSize(TRAPEZOID).width).toBe(90);
  });

  it("scales down to maxDimension while preserving aspect ratio", () => {
    const { width, height } = estimateOutputSize(RECT, 100);
    expect(height).toBe(100);
    expect(width).toBe(50);
  });

  it("does not upscale when the quad is already smaller than maxDimension", () => {
    expect(estimateOutputSize(RECT, 5000)).toEqual({ width: 100, height: 200 });
  });

  it("never returns a zero dimension for a degenerate quad", () => {
    const flat: Quad = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    const { width, height } = estimateOutputSize(flat);
    expect(width).toBeGreaterThanOrEqual(1);
    expect(height).toBeGreaterThanOrEqual(1);
  });
});
