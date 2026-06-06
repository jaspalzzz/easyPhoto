import { describe, it, expect } from "vitest";
import { COUNTRY_SPECS, effectivePrintMm } from "@/lib/countrySpecs";
import { maxCopiesPerSheet } from "@/lib/printSheet";

const { us, uk, canada, schengen } = COUNTRY_SPECS;

describe("effectivePrintMm", () => {
  it("uses the standard print size for most countries", () => {
    expect(effectivePrintMm(us)).toEqual({ width: 51, height: 51 });
    expect(effectivePrintMm(uk)).toEqual({ width: 35, height: 45 });
    expect(effectivePrintMm(schengen)).toEqual({ width: 35, height: 45 });
  });

  it("serves Canada's visa size (35×45), NOT the unsupported passport print (50×70)", () => {
    expect(effectivePrintMm(canada)).toEqual({ width: 35, height: 45 });
    expect(effectivePrintMm(canada)).not.toEqual(canada.printMm);
  });
});

describe("maxCopiesPerSheet (4×6 inch)", () => {
  it("fits two 2×2-inch US photos", () => {
    expect(maxCopiesPerSheet(effectivePrintMm(us))).toBe(2);
  });

  it("fits six 35×45mm photos", () => {
    expect(maxCopiesPerSheet({ width: 35, height: 45 })).toBe(6);
  });

  it("returns 0 for a photo larger than the sheet", () => {
    expect(maxCopiesPerSheet({ width: 200, height: 200 })).toBe(0);
  });
});
