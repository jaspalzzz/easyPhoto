import { describe, expect, it } from "vitest";
import { matchesAspectRatio } from "@/lib/imaging";

describe("matchesAspectRatio", () => {
  it("accepts exact fixed-pixel and integer-rounded portal ratios", () => {
    expect(matchesAspectRatio(130, 170, 130 / 170)).toBe(true);
    expect(matchesAspectRatio(373, 480, 35 / 45)).toBe(true);
  });

  it("rejects a square image for a portrait portal ratio", () => {
    expect(matchesAspectRatio(870, 870, 35 / 45)).toBe(false);
  });
});
