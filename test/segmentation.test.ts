import { describe, it, expect } from "vitest";
import { boxFilter2D } from "@/lib/segmentation";

describe("boxFilter2D", () => {
  it("blurs a simple 3x3 grid correctly with radius 1", () => {
    // 3x3 source grid:
    // 1 2 3
    // 4 5 6
    // 7 8 9
    const src = new Float32Array([
      1, 2, 3,
      4, 5, 6,
      7, 8, 9
    ]);
    const w = 3;
    const h = 3;
    const r = 1;
    const dest = new Float32Array(w * h);

    boxFilter2D(src, w, h, r, dest);

    // Let's manually verify the horizontal pass first:
    // Row 0: 1 2 3 -> padding r=1 gives:
    // x=-1 (clamped to index 0 -> value 1)
    // x=0  (value 1)
    // x=1  (value 2)
    // Sum for col 0: 1+1+2 = 4 -> mean: 4/3 = 1.333
    // Col 1: window [0,1,2] -> values 1, 2, 3 -> sum 6 -> mean 2.0
    // Col 2: window [1,2,3] -> indices [1,2,2] -> values 2, 3, 3 -> sum 8 -> mean 2.667
    //
    // So Temp:
    // 1.333   2.0   2.667
    // 4.333   5.0   5.667
    // 7.333   8.0   8.667
    //
    // Vertical pass:
    // Col 0: 1.333, 4.333, 7.333
    // Row 0: window [-1,0,1] -> indices [0,0,1] -> values 1.333, 1.333, 4.333 -> sum 7 -> mean 7/3 = 2.333
    // Row 1: window [0,1,2] -> values 1.333, 4.333, 7.333 -> sum 13 -> mean 13/3 = 4.333
    // Row 2: window [1,2,3] -> indices [1,2,2] -> values 4.333, 7.333, 7.333 -> sum 19 -> mean 19/3 = 6.333
    //
    // Let's assert:
    // Dest[0]: 2.333...
    // Dest[3] (Row 1 Col 0): 4.333...
    // Dest[6] (Row 2 Col 0): 6.333...

    expect(dest[0]).toBeCloseTo(7 / 3, 3);
    // Temp col 1: 2.0, 5.0, 8.0.
    // Row 0 window [-1,0,1] -> indices [0,0,1] -> values 2.0, 2.0, 5.0 -> sum 9 -> mean 3.0
    expect(dest[1]).toBeCloseTo(3.0, 3);
    expect(dest[4]).toBeCloseTo(5.0, 3); // Col 1 Row 1: (2.0 + 5.0 + 8.0) / 3 = 5.0
  });

  it("handles extreme sizes like 1x1 gracefully", () => {
    const src = new Float32Array([42]);
    const dest = new Float32Array(1);
    boxFilter2D(src, 1, 1, 1, dest);
    expect(dest[0]).toBe(42);
  });
});
