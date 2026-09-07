import { describe, it, expect } from "vitest";
import {
  boxBlur,
  toGrayPlane,
  illuminationGain,
  adaptiveThreshold,
  enhancePixels,
  channelSpread,
} from "@/lib/scanEnhance";

/**
 * Synthetic page: paper brightness falls steeply from left to right, as if lit
 * from one side, with dark text ruled down both halves.
 *
 * The point of the fixture is that the ink on the bright side is *lighter in
 * absolute terms* than the paper on the dark side. No single global cut can
 * separate ink from paper across the whole page — which is precisely the
 * failure this module exists to fix.
 */
function litPage(width = 120, height = 60) {
  const rgba = new Uint8ClampedArray(width * height * 4);
  const isInk = (x: number, y: number) =>
    y % 10 >= 3 && y % 10 <= 5 && x % 8 >= 2 && x % 8 <= 4;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const paper = 230 - (x / (width - 1)) * 170; // 230 -> 60
      const value = isInk(x, y) ? paper * 0.45 : paper;
      const i = (y * width + x) * 4;
      rgba[i] = rgba[i + 1] = rgba[i + 2] = value;
      rgba[i + 3] = 255;
    }
  }
  return { rgba, width, height, isInk };
}

function naiveBoxBlur(
  src: Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  const out = new Float32Array(src.length);
  const clamp = (v: number, max: number) => (v < 0 ? 0 : v > max ? max : v);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          sum += src[clamp(y + dy, height - 1) * width + clamp(x + dx, width - 1)];
          n++;
        }
      }
      out[y * width + x] = sum / n;
    }
  }
  return out;
}

describe("boxBlur", () => {
  it("leaves a constant image unchanged", () => {
    const src = new Float32Array(50 * 40).fill(137);
    const out = boxBlur(src, 50, 40, 6);
    for (const v of out) expect(v).toBeCloseTo(137, 4);
  });

  it("is the identity at radius 0", () => {
    const src = Float32Array.from({ length: 25 }, (_, i) => i * 3);
    expect(Array.from(boxBlur(src, 5, 5, 0))).toEqual(Array.from(src));
  });

  it("matches a naive two-dimensional convolution", () => {
    // The sliding-window version is O(n) rather than O(n·r²); this pins it to
    // the obvious-but-slow implementation so an off-by-one in the window slide
    // cannot pass silently.
    const width = 17;
    const height = 13;
    const src = Float32Array.from(
      { length: width * height },
      (_, i) => (i * 37) % 251
    );
    for (const radius of [1, 3, 5]) {
      const fast = boxBlur(src, width, height, radius);
      const slow = naiveBoxBlur(src, width, height, radius);
      for (let i = 0; i < fast.length; i++) {
        expect(fast[i]).toBeCloseTo(slow[i], 3);
      }
    }
  });
});

describe("illuminationGain", () => {
  it("flattens a lighting gradient toward uniform paper", () => {
    const { rgba, width, height } = litPage();
    const gray = toGrayPlane(rgba, "luma");
    const gain = illuminationGain(gray, width, height, 12);

    // Sample paper (non-ink) pixels from the bright and dark ends and confirm
    // they converge after correction, having started far apart.
    const at = (x: number, y: number) => y * width + x;
    const brightPaper = gray[at(2, 0)];
    const darkPaper = gray[at(width - 3, 0)];
    expect(brightPaper - darkPaper).toBeGreaterThan(100);

    const brightCorrected = gray[at(2, 0)] * gain[at(2, 0)];
    const darkCorrected = gray[at(width - 3, 0)] * gain[at(width - 3, 0)];
    expect(Math.abs(brightCorrected - darkCorrected)).toBeLessThan(40);
  });

  it("does not divide by zero on a black region", () => {
    const gray = new Float32Array(16 * 16).fill(0);
    const gain = illuminationGain(gray, 16, 16, 4);
    for (const g of gain) expect(Number.isFinite(g)).toBe(true);
  });
});

describe("adaptiveThreshold", () => {
  it("emits only pure black and pure white", () => {
    const { rgba, width, height } = litPage();
    const out = adaptiveThreshold(toGrayPlane(rgba), width, height, 4);
    for (const v of out) expect(v === 0 || v === 255).toBe(true);
  });

  it("recovers text across a lighting gradient where a global cut cannot", () => {
    const { rgba, width, height, isInk } = litPage();
    const gray = toGrayPlane(rgba, "luma");

    // Balanced accuracy, not raw accuracy. Ink covers a small fraction of the
    // page, so a plain hit-rate is dominated by paper and flatters a global cut
    // that floods the shadowed half with black. Scoring each class separately
    // and taking the worse of the two exposes exactly that failure.
    const score = (values: ArrayLike<number>) => {
      let inkHit = 0;
      let inkTotal = 0;
      let paperHit = 0;
      let paperTotal = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const isDark = values[y * width + x] < 128;
          if (isInk(x, y)) {
            inkTotal++;
            if (isDark) inkHit++;
          } else {
            paperTotal++;
            if (!isDark) paperHit++;
          }
        }
      }
      return Math.min(inkHit / inkTotal, paperHit / paperTotal);
    };

    // Best possible single global cut, found by brute force — we are not
    // strawmanning it with an arbitrary 128.
    let bestGlobal = 0;
    for (let cut = 1; cut < 255; cut++) {
      const binarised = Float32Array.from(gray, (v) => (v < cut ? 0 : 255));
      bestGlobal = Math.max(bestGlobal, score(binarised));
    }

    const adaptive = adaptiveThreshold(gray, width, height, 5, 0.12);
    const adaptiveScore = score(adaptive);

    expect(adaptiveScore).toBeGreaterThan(0.95);
    expect(adaptiveScore).toBeGreaterThan(bestGlobal + 0.1);
  });
});

describe("enhancePixels", () => {
  it("returns an untouched copy in original mode", () => {
    const { rgba, width, height } = litPage(20, 10);
    const out = enhancePixels(rgba, width, height, "original");
    expect(Array.from(out)).toEqual(Array.from(rgba));
    expect(out).not.toBe(rgba);
  });

  it("never mutates its input", () => {
    const { rgba, width, height } = litPage(20, 10);
    const before = Array.from(rgba);
    enhancePixels(rgba, width, height, "blackwhite");
    enhancePixels(rgba, width, height, "colour");
    expect(Array.from(rgba)).toEqual(before);
  });

  it("produces neutral grey in greyscale mode", () => {
    const { rgba, width, height } = litPage(40, 20);
    const out = enhancePixels(rgba, width, height, "greyscale");
    for (let i = 0; i < out.length; i += 4) {
      expect(out[i]).toBe(out[i + 1]);
      expect(out[i + 1]).toBe(out[i + 2]);
    }
  });

  it("produces only black and white in blackwhite mode", () => {
    const { rgba, width, height } = litPage(40, 20);
    const out = enhancePixels(rgba, width, height, "blackwhite");
    for (let i = 0; i < out.length; i += 4) {
      expect(out[i] === 0 || out[i] === 255).toBe(true);
    }
  });

  it("brightens the shadowed side in colour mode while keeping alpha", () => {
    const { rgba, width, height } = litPage();
    const out = enhancePixels(rgba, width, height, "colour");
    const darkPaper = ((0 * width) + (width - 3)) * 4;
    expect(out[darkPaper]).toBeGreaterThan(rgba[darkPaper]);
    for (let i = 3; i < out.length; i += 4) expect(out[i]).toBe(255);
  });

  it("preserves hue in colour mode", () => {
    // A red-tinted page must stay red-dominant after the lighting is flattened.
    const width = 32;
    const height = 32;
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      const i = p * 4;
      rgba[i] = 180; rgba[i + 1] = 90; rgba[i + 2] = 60; rgba[i + 3] = 255;
    }
    const out = enhancePixels(rgba, width, height, "colour");
    for (let i = 0; i < out.length; i += 4) {
      expect(out[i]).toBeGreaterThan(out[i + 1]);
      expect(out[i + 1]).toBeGreaterThan(out[i + 2]);
    }
  });
});

describe("channelSpread", () => {
  it("reports the widest spread for the channel that actually varies", () => {
    const width = 32;
    const height = 32;
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      const i = p * 4;
      // Stride 71 is coprime with the sampler's 8-pixel step, so the sparse
      // sample sees the full range. A period-2 pattern would alias to a
      // constant and report zero spread — a property of the sampling, not a
      // defect, but one a fixture must not walk into.
      rgba[i] = (p * 71) % 256;
      rgba[i + 1] = 128;
      rgba[i + 2] = 128;
      rgba[i + 3] = 255;
    }
    const spread = channelSpread(rgba);
    expect(spread.r).toBeGreaterThan(spread.g);
    expect(spread.r).toBeGreaterThan(spread.b);
  });

  it("returns zeros for an empty buffer rather than NaN", () => {
    const spread = channelSpread(new Uint8ClampedArray(0));
    for (const v of Object.values(spread)) expect(Number.isFinite(v)).toBe(true);
  });
});
