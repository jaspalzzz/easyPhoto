/**
 * Paper whitening for phone photos of signatures (lib/paperFlatten.ts). The
 * merge tool used to trim at a fixed luma of 235, so grey paper from a phone
 * photo (luma ~150–200) was all kept: the merged image carried a grey block
 * and all the empty paper around the signature.
 */
import { describe, expect, it } from "vitest";
import { flattenPaper, paperLevels, upsampleLevels } from "@/lib/paperFlatten";

const luma = (d: Uint8ClampedArray, i: number) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

/** A `w × h` RGBA image: paper of luma `paper(x, y)`, with one dark ink row. */
function photo(w: number, h: number, paper: (x: number, y: number) => number, inkRow: number, ink = 40) {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const v = y === inkRow && x > 4 && x < w - 4 ? ink : paper(x, y);
      d.set([v, v, v, 255], (y * w + x) * 4);
    }
  }
  return d;
}

/** Runs the whole pipeline the merge tool uses: small copy → levels → upsample → flatten. */
function whiten(d: Uint8ClampedArray, w: number, h: number, step = 4) {
  const sw = Math.ceil(w / step);
  const sh = Math.ceil(h / step);
  const small = new Uint8ClampedArray(sw * sh * 4);
  for (let y = 0; y < sh; y += 1) {
    for (let x = 0; x < sw; x += 1) {
      const src = (Math.min(h - 1, y * step) * w + Math.min(w - 1, x * step)) * 4;
      small.set(d.subarray(src, src + 4), (y * sw + x) * 4);
    }
  }
  const paper = upsampleLevels(paperLevels(small, sw, sh, 1), sw, sh, w, h);
  flattenPaper(d, paper);
  return d;
}

describe("flattenPaper", () => {
  it("turns grey phone-photo paper white and keeps the ink dark", () => {
    const w = 64;
    const h = 32;
    const d = whiten(photo(w, h, () => 170, 16), w, h);
    expect(luma(d, (4 * w + 10) * 4)).toBeGreaterThan(250); // paper
    expect(luma(d, (16 * w + 30) * 4)).toBeLessThan(90); // ink
  });

  it("whitens a shadow that darkens the paper from 225 to 140 across the photo", () => {
    const w = 96;
    const h = 32;
    const d = whiten(photo(w, h, (x) => 225 - (85 * x) / (w - 1), 16), w, h);
    for (const x of [2, 30, 60, 93]) expect(luma(d, (4 * w + x) * 4)).toBeGreaterThan(245);
    expect(luma(d, (16 * w + 80) * 4)).toBeLessThan(100); // ink in the shadow stays ink
  });

  it("leaves white paper white and ink unchanged", () => {
    const w = 40;
    const h = 20;
    const d = whiten(photo(w, h, () => 255, 10, 30), w, h);
    expect(luma(d, (2 * w + 2) * 4)).toBe(255);
    expect(luma(d, (10 * w + 20) * 4)).toBeLessThan(40);
  });

  it("keeps blue ink blue", () => {
    const w = 40;
    const h = 20;
    const d = photo(w, h, () => 180, -1);
    const i = (10 * w + 20) * 4;
    d.set([20, 40, 120, 255], i);
    whiten(d, w, h);
    expect(d[i + 2]).toBeGreaterThan(d[i] + 60);
  });
});

describe("paperLevels", () => {
  it("ignores a one-pixel ink stroke when estimating the paper", () => {
    const w = 5;
    const h = 5;
    const d = photo(w, h, () => 200, -1);
    d.set([30, 30, 30, 255], (2 * w + 2) * 4);
    expect(paperLevels(d, w, h, 1)[2 * w + 2]).toBe(200);
  });
});
