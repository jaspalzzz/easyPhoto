import { describe, expect, it } from "vitest";
import { resolveSignatureInkRgb, signatureStrokeOffsets } from "@/lib/signature";

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
