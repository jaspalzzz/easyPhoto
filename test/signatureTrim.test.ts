/**
 * Signature auto-crop: keep every stroke of the signature, ignore everything else.
 *
 * Regression: the density floor (minRun ≈ 0.5% of the smaller side) is thicker
 * than a ballpoint line on a phone photo, so rows holding only an ascender or a
 * lead-in stroke were treated as noise and cut off the cleaned signature.
 */
import { describe, expect, it } from "vitest";
import { attachedInkBBox, signatureTrimAttach, type BBox } from "@/lib/signature";

const W = 2000;
const H = 1500;
const STROKE = 5; // a ballpoint line on a photo this size
const { minRun, keepAttached } = signatureTrimAttach(W, H);

function mask(draw: (fill: (x: number, y: number, w: number, h: number) => void) => void) {
  const ink = new Uint8Array(W * H);
  const fill = (x0: number, y0: number, w: number, h: number) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) ink[y * W + x] = 1;
  };
  draw(fill);
  return { width: W, height: H, ink };
}

/** Signature body, a thin ascender above it and a thin lead-in stroke to its left. */
function signature(fill: (x: number, y: number, w: number, h: number) => void, stroke = STROKE) {
  fill(600, 1000, 800, stroke); // baseline
  for (let x = 600; x < 1400; x += 60) fill(x, 925, stroke, 75); // letter bodies
  fill(825, 800, stroke, 125); // ascender of an 'l'
  fill(450, 975, 150, stroke); // lead-in stroke
}
// Lead-in starts at x 450, baseline ends at x 1399; ascender tops at y 800, baseline bottoms at y 1004.
const FULL: BBox = { x: 450, y: 800, width: 1400 - 450, height: 1005 - 800 };

/** The legacy density-floor-only box: no shapes may extend the core. */
const coreOnly = (m: ReturnType<typeof mask>) =>
  attachedInkBBox(m, minRun, { attachGap: 0, minSpeckArea: Number.POSITIVE_INFINITY });

describe("signature trim keeps thin strokes attached to the signature", () => {
  it("the density floor is thicker than the pen line here (the bug's precondition)", () => {
    expect(minRun).toBeGreaterThan(STROKE);
  });

  it("the density floor alone cuts the ascender and lead-in off (the old crop)", () => {
    const old = coreOnly(mask((f) => signature(f)))!;
    expect(old.y).toBeGreaterThan(FULL.y + 100); // ascender lost
    expect(old.x).toBeGreaterThan(FULL.x + 100); // lead-in lost
  });

  it("keeps the whole signature, thin strokes included", () => {
    expect(attachedInkBBox(mask((f) => signature(f)), minRun, keepAttached)).toEqual(FULL);
  });

  it("keeps a separate dot or pen lift just beyond the signature", () => {
    // 16 px past the baseline's right end: too sparse for the density floor,
    // so it only extends the box if it's kept as an attached stroke.
    const m = mask((f) => {
      signature(f);
      f(1416, 990, 8, 8);
    });
    const old = coreOnly(m)!;
    expect(old.x + old.width).toBeLessThan(1416); // the density floor drops it…
    expect(attachedInkBBox(m, minRun, keepAttached)).toEqual({ ...FULL, width: 1424 - FULL.x }); // …this keeps it
  });
});

describe("signature trim still ignores what isn't signature", () => {
  it("ignores dust specks near the image edges", () => {
    const m = mask((f) => {
      signature(f);
      f(40, 40, 3, 3);
      f(1950, 1450, 2, 2);
    });
    expect(attachedInkBBox(m, minRun, keepAttached)).toEqual(FULL);
  });

  it("ignores faint paper texture scattered over the whole photo", () => {
    let seed = 7;
    const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const m = mask((f) => {
      signature(f);
      for (let i = 0; i < W * H * 0.001; i++) f(Math.floor(rand() * W), Math.floor(rand() * H), 1, 1);
    });
    const box = attachedInkBBox(m, minRun, keepAttached)!;
    // A texture pixel touching a stroke end can add a pixel or two; never the whole page.
    expect(Math.abs(box.x - FULL.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(box.y - FULL.y)).toBeLessThanOrEqual(2);
    expect(Math.abs(box.width - FULL.width)).toBeLessThanOrEqual(8);
    expect(Math.abs(box.height - FULL.height)).toBeLessThanOrEqual(8);
  });

  it("ignores a pen mark that is ink-sized but far from the signature", () => {
    // Big enough to count as ink (36 px ≥ the speck limit), too sparse for the
    // density floor, and well beyond the attach gap — so it must not be pulled in.
    const m = mask((f) => {
      signature(f);
      f(1800, 100, 6, 6);
    });
    expect(attachedInkBBox(m, minRun, keepAttached)).toEqual(FULL);
  });

  it("leaves a signature with thick strokes exactly as the density floor had it", () => {
    const m = mask((f) => signature(f, 20));
    expect(attachedInkBBox(m, minRun, keepAttached)).toEqual(coreOnly(m));
  });

  it("returns null when there's no ink", () => {
    expect(attachedInkBBox(mask(() => {}), minRun, keepAttached)).toBeNull();
  });
});

describe("signatureTrimAttach", () => {
  it("scales with the photo: a 12 MP photo gets a 15 px floor, 60 px gap and 56 px speck limit", () => {
    expect(signatureTrimAttach(4000, 3000)).toEqual({
      minRun: 15,
      keepAttached: { attachGap: 60, minSpeckArea: 56 },
    });
  });
});
