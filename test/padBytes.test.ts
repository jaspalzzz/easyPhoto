import { describe, expect, it } from "vitest";
import {
  padJpegBytesToMin,
  padPngBytesToMin,
} from "@/lib/padBytes";

/** Minimal structurally-valid JPEG: SOI + one COM segment + EOI. */
function tinyJpeg(): Uint8Array {
  return new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xfe, 0x00, 0x04, 0x41, 0x42, // COM len=4 "AB"
    0xff, 0xd9, // EOI
  ]);
}

/** Minimal structurally-valid PNG: signature + IHDR-ish chunk + IEND. */
function tinyPng(): Uint8Array {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  // Fake 0-length chunk "IHDR" (CRC value irrelevant for the padder)
  const ihdr = [0, 0, 0, 0, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 0];
  // IEND: len 0, "IEND", CRC AE 42 60 82 (the real constant)
  const iend = [0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82];
  return new Uint8Array([...sig, ...ihdr, ...iend]);
}

describe("padJpegBytesToMin", () => {
  it("returns input unchanged when already at/above the minimum", () => {
    const src = tinyJpeg();
    expect(padJpegBytesToMin(src, src.length)).toBe(src);
    expect(padJpegBytesToMin(src, 4)).toBe(src);
  });

  it("pads to at least the requested minimum", () => {
    const src = tinyJpeg();
    const out = padJpegBytesToMin(src, 20 * 1024);
    expect(out.length).toBeGreaterThanOrEqual(20 * 1024);
    // Overshoot is bounded by one minimal segment (4 bytes).
    expect(out.length).toBeLessThanOrEqual(20 * 1024 + 4);
  });

  it("preserves SOI at the start and the original tail bytes", () => {
    const src = tinyJpeg();
    const out = padJpegBytesToMin(src, 1024);
    expect([out[0], out[1]]).toEqual([0xff, 0xd8]);
    // Inserted segment is a COM marker right after SOI.
    expect([out[2], out[3]]).toEqual([0xff, 0xfe]);
    // Original stream tail (EOI) still ends the file.
    expect([out[out.length - 2], out[out.length - 1]]).toEqual([0xff, 0xd9]);
  });

  it("handles minimums above one COM segment (65533 payload) via chaining", () => {
    const src = tinyJpeg();
    const min = 200 * 1024; // needs 4 segments
    const out = padJpegBytesToMin(src, min);
    expect(out.length).toBeGreaterThanOrEqual(min);
  });

  it("refuses to touch non-JPEG data", () => {
    const notJpeg = new Uint8Array([1, 2, 3, 4]);
    expect(padJpegBytesToMin(notJpeg, 1024)).toBe(notJpeg);
  });
});

describe("padPngBytesToMin", () => {
  it("returns input unchanged when already at/above the minimum", () => {
    const src = tinyPng();
    expect(padPngBytesToMin(src, src.length)).toBe(src);
  });

  it("pads to at least the requested minimum and keeps IEND last", () => {
    const src = tinyPng();
    const min = 10 * 1024;
    const out = padPngBytesToMin(src, min);
    expect(out.length).toBeGreaterThanOrEqual(min);
    // IEND must still be the final 12 bytes.
    const tail = out.subarray(out.length - 12);
    expect([tail[4], tail[5], tail[6], tail[7]]).toEqual([
      0x49, 0x45, 0x4e, 0x44,
    ]);
  });

  it("inserted chunk is ancillary ('prVt') with a valid structure", () => {
    const src = tinyPng();
    const out = padPngBytesToMin(src, 1024);
    // First inserted chunk sits where IEND used to start.
    const at = src.length - 12;
    expect([out[at + 4], out[at + 5], out[at + 6], out[at + 7]]).toEqual([
      0x70, 0x72, 0x56, 0x74, // "prVt"
    ]);
  });

  it("refuses to touch non-PNG data", () => {
    const notPng = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(padPngBytesToMin(notPng, 1024)).toBe(notPng);
  });
});
