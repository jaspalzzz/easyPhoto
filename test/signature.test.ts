import { describe, expect, it } from "vitest";
import { resolveSignatureInkRgb, signatureKbFloor, signatureStrokeOffsets } from "@/lib/signature";
import { padBlobToMin, padJpegBytesToMin } from "@/lib/padBytes";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { kbCapBytes, kbFloorBytes } from "@/lib/utils";

describe("signature ink controls", () => {
  it("resolves the built-in ink colour presets", () => {
    expect(resolveSignatureInkRgb("original")).toBeNull();
    expect(resolveSignatureInkRgb("black")).toEqual({ r: 0, g: 0, b: 0 });
    expect(resolveSignatureInkRgb("dark-blue")).toEqual({ r: 11, g: 42, b: 111 });
    expect(resolveSignatureInkRgb("blue")).toEqual({ r: 0, g: 51, b: 203 });
    expect(resolveSignatureInkRgb("red")).toEqual({ r: 180, g: 35, b: 24 });
  });

  it("uses a custom six-digit hex colour and safely falls back for invalid input", () => {
    expect(resolveSignatureInkRgb("custom", "#12aBef")).toEqual({
      r: 18,
      g: 171,
      b: 239,
    });
    expect(resolveSignatureInkRgb("custom", "not-a-colour")).toEqual({
      r: 0,
      g: 51,
      b: 203,
    });
  });

  it("builds a bounded circular brush for stroke expansion", () => {
    expect(signatureStrokeOffsets(0)).toEqual([{ x: 0, y: 0 }]);

    const radiusTwo = signatureStrokeOffsets(2);
    expect(radiusTwo).toContainEqual({ x: 0, y: 0 });
    expect(radiusTwo).toContainEqual({ x: 2, y: 0 });
    expect(radiusTwo).toContainEqual({ x: 0, y: -2 });
    expect(radiusTwo).not.toContainEqual({ x: 2, y: 2 });

    expect(signatureStrokeOffsets(99)).toEqual(signatureStrokeOffsets(6));
    expect(signatureStrokeOffsets(-5)).toEqual([{ x: 0, y: 0 }]);
  });
});

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

describe("signature KB floor", () => {
  // What the standalone tool exported for IBPS/RRB before the floor followed the preset.
  const REGRESSION_OUTPUT_KB = 7.8;
  const { ibps, rrb } = PORTAL_PRESETS;

  it("IBPS and RRB publish a floor above the old 7.8 KB output", () => {
    // Guards the spec data the fix depends on: without a floor there is nothing to enforce.
    expect(ibps?.sigMinKb).toBeGreaterThan(REGRESSION_OUTPUT_KB);
    expect(rrb?.sigMinKb).toBeGreaterThan(REGRESSION_OUTPUT_KB);
  });

  it("applies the selected preset's floor on the standalone tool, which has no page floor", () => {
    expect(signatureKbFloor(ibps, undefined)).toBe(ibps?.sigMinKb);
    expect(signatureKbFloor(rrb, undefined)).toBe(rrb?.sigMinKb);
  });

  it("switching an IBPS page to the RRB preset uses RRB's floor, not the page's", () => {
    expect(signatureKbFloor(rrb, ibps?.sigMinKb)).toBe(rrb?.sigMinKb);
  });

  it("falls back to the page's floor only when no preset is selected", () => {
    expect(signatureKbFloor(undefined, 10)).toBe(10);
    expect(signatureKbFloor(undefined, undefined)).toBeUndefined();
    // A selected preset with no published floor must not inherit the page's.
    expect(signatureKbFloor({}, 10)).toBeUndefined();
  });

  it.each([
    ["IBPS", ibps],
    ["RRB", rrb],
  ])("pads a %s signature from 7.8 KB up to its floor without breaking its cap", async (_label, preset) => {
    const floorKb = signatureKbFloor(preset, undefined)!;
    const minimalJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xfe, 0x00, 0x04, 0x41, 0x42, 0xff, 0xd9]);
    const tooSmall = new Blob([padJpegBytesToMin(minimalJpeg, REGRESSION_OUTPUT_KB * 1024) as BlobPart], { type: "image/jpeg" });

    const out = await padBlobToMin(tooSmall, kbFloorBytes(floorKb));

    expect(out.size).toBeGreaterThanOrEqual(kbFloorBytes(floorKb));
    expect(out.size).toBeLessThanOrEqual(kbCapBytes(preset!.sigLimitKb!));
  });
});
