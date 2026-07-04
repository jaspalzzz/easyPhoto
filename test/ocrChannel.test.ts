import { describe, it, expect } from "vitest";
import { bestGrayChannel } from "@/lib/ocrPreprocess";

describe("bestGrayChannel", () => {
  it("keeps luma for neutral documents (no channel clearly better)", () => {
    expect(bestGrayChannel({ luma: 60, r: 62, g: 61, b: 58 })).toBe("luma");
  });

  it("keeps luma when a channel is only marginally better (under the 15% bias)", () => {
    expect(bestGrayChannel({ luma: 60, r: 66, g: 60, b: 60 })).toBe("luma");
  });

  it("picks the high-contrast channel on a blue/cyan card (PAN case)", () => {
    // Dark ink on a cyan guilloché: luma flattens the contrast, while the
    // green/blue channels keep the background bright and the ink dark.
    expect(bestGrayChannel({ luma: 30, r: 25, g: 55, b: 58 })).toBe("b");
  });

  it("picks red when red separates best (e.g. teal text on warm paper)", () => {
    expect(bestGrayChannel({ luma: 28, r: 52, g: 30, b: 26 })).toBe("r");
  });
});
