import { describe, it, expect } from "vitest";
import {
  buildScales,
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
