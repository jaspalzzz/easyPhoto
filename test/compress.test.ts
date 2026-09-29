import { describe, it, expect } from "vitest";
import {
  buildScales,
  compressToCap,
  DEFAULT_MIN_QUALITY,
  LAST_RESORT_MIN_QUALITY,
  searchUnderCap,
  type Encoder,
} from "@/lib/compress";

/**
 * Deterministic encoder model: bytes grow monotonically with both dimension
 * scale (area ∝ scale²) and quality. Lets us unit-test the search algorithm
 * without a real canvas / JPEG codec (which jsdom doesn't provide).
 */
function model(base: number): Encoder<{ scale: number; quality: number }> {
  return async (scale, quality) => ({
    bytes: Math.round(base * scale * scale * (0.2 + 0.8 * quality)),
    payload: { scale, quality },
  });
}

describe("buildScales", () => {
  it("descends from 1 to minScale inclusive", () => {
    const s = buildScales(0.5, 0.85);
    expect(s[0]).toBe(1);
    expect(s[s.length - 1]).toBe(0.5);
    for (let i = 1; i < s.length; i++) expect(s[i]).toBeLessThan(s[i - 1]);
  });
});

describe("searchUnderCap", () => {
  it("keeps full size + top quality when it already fits", async () => {
    // bytes(1, 0.95) = 960 ≤ 1000
    const res = await searchUnderCap(model(1000), { maxBytes: 1000 });
    expect(res.underCap).toBe(true);
    expect(res.scale).toBe(1);
    expect(res.quality).toBe(0.95);
    expect(res.bytes).toBeLessThanOrEqual(1000);
  });

  it("drops quality (not size) when top quality overflows but min fits", async () => {
    // bytes(1,0.4)=520 ≤ 700 < 960 = bytes(1,0.95)
    const res = await searchUnderCap(model(1000), { maxBytes: 700 });
    expect(res.underCap).toBe(true);
    expect(res.scale).toBe(1); // never downscaled
    expect(res.bytes).toBeLessThanOrEqual(700);
    expect(res.quality).toBeGreaterThan(0.4); // pushed above the floor
    expect(res.quality).toBeLessThan(0.95);
  });

  it("downscales as a fallback, choosing the largest scale that fits", async () => {
    // bytes(1,0.4)=520 > 300, so quality alone can't fit → must shrink.
    const res = await searchUnderCap(model(1000), { maxBytes: 300, minScale: 0.25 });
    expect(res.underCap).toBe(true);
    expect(res.scale).toBeLessThan(1);
    expect(res.scale).toBeGreaterThan(0.6); // didn't shrink more than necessary
    expect(res.bytes).toBeLessThanOrEqual(300);
  });

  it("never goes below minScale; flags underCap:false when impossible", async () => {
    // bytes(0.5,0.4)=130 > 100, and we may not shrink past minScale 0.5.
    const res = await searchUnderCap(model(1000), { maxBytes: 100, minScale: 0.5 });
    expect(res.underCap).toBe(false);
    expect(res.scale).toBe(0.5); // the smallest allowed
    expect(res.bytes).toBe(130); // smallest achievable encoding
  });

  it("respects a minScale of 1 (no downscaling allowed)", async () => {
    const res = await searchUnderCap(model(1000), { maxBytes: 100, minScale: 1 });
    expect(res.underCap).toBe(false);
    expect(res.scale).toBe(1);
  });

  it("a generous minScale lets a small target succeed via downscaling", async () => {
    // Same impossible-at-full-size case, but now allowed to shrink to 0.1.
    const res = await searchUnderCap(model(1000), { maxBytes: 100, minScale: 0.1 });
    expect(res.underCap).toBe(true);
    expect(res.scale).toBeLessThan(1);
    expect(res.bytes).toBeLessThanOrEqual(100);
  });
});

describe("searchUnderCap — last-resort quality floor", () => {
  it("closes a small gap at fixed pixels by going below minQuality (Driving Licence 420×525 ≤ 20 KB)", async () => {
    // bytes(1, 0.4) = 520 > 500: impossible at the normal floor, fits at ~0.35.
    const res = await searchUnderCap(model(1000), { maxBytes: 500, minScale: 1, lastResortMinQuality: 0.2 });
    expect(res.underCap).toBe(true);
    expect(res.scale).toBe(1);
    expect(res.bytes).toBeLessThanOrEqual(500);
    expect(res.quality).toBeLessThan(0.4);
    expect(res.quality).toBeGreaterThanOrEqual(0.2);
  });

  it("still reports underCap:false (the normal-floor encoding) when even the floor can't fit", async () => {
    const res = await searchUnderCap(model(1000), { maxBytes: 100, minScale: 1, lastResortMinQuality: 0.2 });
    expect(res.underCap).toBe(false);
    expect(res.quality).toBe(0.4);
  });

  it("is never used when a normal encoding fits", async () => {
    const res = await searchUnderCap(model(1000), { maxBytes: 700, lastResortMinQuality: 0.2 });
    expect(res.quality).toBeGreaterThan(0.4);
  });
});


describe("compressToCap — low-quality fallback is opt-in", () => {
  /**
   * A canvas whose JPEG size grows with quality: 1000 × (0.3 + q) bytes, so a
   * 600-byte cap is impossible at the normal 0.4 floor (700 B) and reachable
   * only below it. minScale 1 keeps compressToCap at this exact canvas, the
   * fixed-pixel case (Driving Licence 420×525) the fallback exists for.
   */
  function sizedCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 420;
    canvas.height = 525;
    canvas.toBlob = (cb: BlobCallback, type?: string, quality = 0.92) =>
      cb(new Blob([new Uint8Array(Math.round(1000 * (0.3 + quality)))], { type }));
    return canvas;
  }
  const capKb = 600 / 1024;

  it("keeps the normal floor by default and reports that the cap wasn't met", async () => {
    const res = await compressToCap(sizedCanvas(), capKb, { minScale: 1 });
    expect(res.underCap).toBe(false);
    expect(res.qualityReduced).toBe(false);
    expect(res.quality).toBe(DEFAULT_MIN_QUALITY);
  });

  it("drops below the floor only when the caller opts in, and flags it", async () => {
    const res = await compressToCap(sizedCanvas(), capKb, { minScale: 1, allowLowQualityFallback: true });
    expect(res.underCap).toBe(true);
    expect(res.qualityReduced).toBe(true);
    expect(res.bytes).toBeLessThanOrEqual(600);
    expect(res.quality).toBeLessThan(DEFAULT_MIN_QUALITY);
    expect(res.quality).toBeGreaterThanOrEqual(LAST_RESORT_MIN_QUALITY);
  });

  it("doesn't flag a result that fit at normal quality", async () => {
    const res = await compressToCap(sizedCanvas(), 1000 / 1024, { minScale: 1, allowLowQualityFallback: true });
    expect(res.underCap).toBe(true);
    expect(res.qualityReduced).toBe(false);
  });
});
