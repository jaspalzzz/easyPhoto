import { afterEach, describe, expect, it, vi } from "vitest";

// compressPdfToTarget renders pages with pdfjs, which jsdom can't run. Only its
// "already under the target" short-circuit is under test here, so rendering is
// stubbed to "no pages" — reaching it means the file was NOT passed through.
vi.mock("@/lib/pdfToImages", () => ({ pdfToCanvases: async () => [] }));

import { compressToCap } from "@/lib/compress";
import { pngUnderKb } from "@/lib/imaging";
import { compressPdfToTarget } from "@/lib/pdfCompress";
import { KB_TARGETS, SIGNATURE_KB_TARGETS } from "@/lib/kbTargets";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { kbCapBytes, kbFloorBytes, minCapKbForFloor } from "@/lib/utils";

/**
 * Portals disagree on 1 KB = 1000 or 1024 bytes. Production outputs landed just
 * under the 1024-byte cap (resize-kb 50 KB → 50,928 B; UPSC photo 200 KB →
 * 203,886 B), which a 1000-byte portal rejects. Every output must sit at or
 * under maxKb × 1000 and at or over minKb × 1024 so both conventions accept it.
 */

// jsdom's Blob lacks arrayBuffer(); real browsers have it. padBlobToMin needs it.
if (typeof Blob !== "undefined" && !Blob.prototype.arrayBuffer) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Blob.prototype as any).arrayBuffer = function (this: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as ArrayBuffer);
      fr.onerror = () => reject(fr.error);
      fr.readAsArrayBuffer(this);
    });
  };
}

/** A JPEG-shaped payload (SOI … EOI) of exactly `size` bytes, so padding applies. */
function jpegBytes(size: number): Uint8Array {
  const b = new Uint8Array(size);
  b[0] = 0xff;
  b[1] = 0xd8;
  b[size - 2] = 0xff;
  b[size - 1] = 0xd9;
  return b;
}

/**
 * A fixed-pixel canvas whose JPEG grows with quality: at q = 1 it is
 * `topBytes`, at q = 0 about a quarter of that. The quality search can land
 * anywhere in between, so it lands right at whatever byte cap it is given.
 */
function jpegCanvas(topBytes: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 525;
  canvas.toBlob = (cb: BlobCallback, type?: string, quality = 0.92) =>
    cb(new Blob([jpegBytes(Math.round(topBytes * (0.25 + 0.75 * quality)))] as BlobPart[], { type }));
  return canvas;
}

describe("KB limit helpers", () => {
  it("enforce caps in 1000-byte KB and floors in 1024-byte KB", () => {
    expect(kbCapBytes(50)).toBe(50_000);
    expect(kbFloorBytes(20)).toBe(20_480);
  });

  it("minCapKbForFloor is the smallest whole-KB cap that still holds the floor", () => {
    for (let minKb = 1; minKb <= 500; minKb++) {
      const capKb = minCapKbForFloor(minKb);
      expect(kbFloorBytes(minKb)).toBeLessThanOrEqual(kbCapBytes(capKb));
      expect(kbFloorBytes(minKb)).toBeGreaterThan(kbCapBytes(capKb - 1));
    }
    expect(minCapKbForFloor(20)).toBe(21);
    expect(minCapKbForFloor(10)).toBe(11);
  });

  it("every stored portal band is satisfiable under both conventions", () => {
    const infeasible: string[] = [];
    for (const spec of Object.values(PORTAL_PRESETS)) {
      const bands = [
        ["photo", spec.photoMinKb, spec.photoLimitKb],
        ["signature", spec.sigMinKb, spec.sigLimitKb],
      ] as const;
      for (const [kind, minKb, maxKb] of bands) {
        if (minKb && maxKb && kbFloorBytes(minKb) > kbCapBytes(maxKb)) {
          infeasible.push(`${spec.id} ${kind} ${minKb}–${maxKb} KB`);
        }
      }
    }
    expect(infeasible).toEqual([]);
  });
});

describe("compressToCap — output passes 1000- and 1024-byte portals", () => {
  // The one-tap ?target= presets plus the production failures (UPSC 200 KB).
  const targets = [...new Set<number>([...KB_TARGETS, ...SIGNATURE_KB_TARGETS])];

  it.each(targets)("a %s KB target lands at or under target × 1000 bytes", async (kb) => {
    const res = await compressToCap(jpegCanvas(kb * 1200), kb, { minScale: 1, maxQuality: 1 });
    expect(res.underCap).toBe(true);
    expect(res.bytes).toBeLessThanOrEqual(kb * 1000);
    expect(res.blob.size).toBe(res.bytes);
  });

  it("pads a small result to the band floor counted in 1024-byte KB (IBPS 20–50 KB)", async () => {
    const res = await compressToCap(jpegCanvas(4_000), 50, { minScale: 1, minKb: 20 });
    expect(res.underCap).toBe(true);
    expect(res.bytes).toBeGreaterThanOrEqual(20 * 1024);
    expect(res.bytes).toBeLessThanOrEqual(50 * 1000);
  });

  it("a fixed-frame 20 KB cap (Driving Licence) still fits via the low-quality fallback", async () => {
    // 20,350 B at the normal 0.4 floor: under 20 × 1024, over 20 × 1000.
    const res = await compressToCap(jpegCanvas(37_000), 20, {
      minScale: 1,
      allowLowQualityFallback: true,
    });
    expect(res.underCap).toBe(true);
    expect(res.bytes).toBeLessThanOrEqual(20 * 1000);
  });
});

describe("pngUnderKb — transparent signatures pass 1000-byte portals", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shrinks a 20,300-byte PNG for a 20 KB cap instead of accepting it", async () => {
    // PNG size ∝ pixel area: 20,300 B at full size — under 20 × 1024 but over 20 × 1000.
    const bytesPerPixel = 20_300 / (400 * 200);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: () => {},
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(function (
      this: HTMLCanvasElement,
      cb: BlobCallback,
      type?: string
    ) {
      cb(new Blob([new Uint8Array(Math.round(this.width * this.height * bytesPerPixel))], { type }));
    });
    const source = document.createElement("canvas");
    source.width = 400;
    source.height = 200;

    const res = await pngUnderKb(source, 20);
    expect(res.underCap).toBe(true);
    expect(res.bytes).toBeLessThanOrEqual(20 * 1000);
  });
});

describe("compressPdfToTarget — 'already under' means under both conventions", () => {
  const pdf = (size: number) =>
    new File([new Uint8Array(size)], "doc.pdf", { type: "application/pdf" });

  it("passes a PDF under target × 1000 bytes through untouched", async () => {
    const res = await compressPdfToTarget(pdf(49_900), 50);
    expect(res.alreadyUnder).toBe(true);
    expect(res.bytes).toBe(49_900);
  });

  it("does not pass a 50,500-byte PDF through as 'under 50 KB'", async () => {
    // Reaching the (stubbed) renderer proves it went on to compress the file.
    await expect(compressPdfToTarget(pdf(50_500), 50)).rejects.toThrow(/no readable pages/i);
  });
});
