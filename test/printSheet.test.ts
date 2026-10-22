/**
 * Print-sheet placement: photos are placed at their exact millimetre size.
 * The standalone print-sheet tool used to shrink each photo to (paper ÷ count),
 * printing "6 on A4" as 73×94 mm photos instead of 35×45 mm passport size.
 */
import { describe, expect, it } from "vitest";
import { PAPER_DIMENSIONS, sheetPlacements } from "@/lib/printSheet";

const PASSPORT = { width: 35, height: 45 };

describe("sheetPlacements", () => {
  it("places the requested copies inside the sheet, without overlap", () => {
    const { layout, placements } = sheetPlacements(PASSPORT, { paperSize: "a4", marginMm: 5, gapMm: 2, copies: 6 });
    expect(placements).toHaveLength(6);
    for (const p of placements) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + PASSPORT.width).toBeLessThanOrEqual(layout.sheet.w);
      expect(p.y + PASSPORT.height).toBeLessThanOrEqual(layout.sheet.h);
    }
    for (let i = 0; i < placements.length; i++) {
      for (let j = i + 1; j < placements.length; j++) {
        const a = placements[i]!;
        const b = placements[j]!;
        const apart = a.x + PASSPORT.width <= b.x || b.x + PASSPORT.width <= a.x || a.y + PASSPORT.height <= b.y || b.y + PASSPORT.height <= a.y;
        expect(apart).toBe(true);
      }
    }
  });

  it("clamps to capacity and defaults to a full sheet", () => {
    const full = sheetPlacements(PASSPORT, { paperSize: "4x6", marginMm: 5, gapMm: 2 });
    expect(full.placements).toHaveLength(full.layout.capacity);
    expect(sheetPlacements(PASSPORT, { paperSize: "4x6", marginMm: 5, gapMm: 2, copies: 99 }).placements).toHaveLength(full.layout.capacity);
  });

  it("fits realistic counts: 6 passport photos on 4×6 in, 2 US 2×2 on 4×6 in", () => {
    expect(sheetPlacements(PASSPORT, { paperSize: "4x6", marginMm: 5, gapMm: 2 }).layout.capacity).toBe(6);
    expect(sheetPlacements({ width: 51, height: 51 }, { paperSize: "4x6", marginMm: 5, gapMm: 2 }).layout.capacity).toBe(2);
  });

  it("knows every paper the print-sheet tool offers", () => {
    for (const k of ["a4", "a5", "4x6", "5x6", "4x4"] as const) {
      expect(PAPER_DIMENSIONS[k].w).toBeGreaterThan(0);
    }
  });
});
