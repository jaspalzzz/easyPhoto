import { describe, it, expect } from "vitest";
import { COUNTRY_SPECS, effectivePrintMm } from "@/lib/countrySpecs";
import { maxCopiesPerSheet } from "@/lib/printSheet";
import { generateBatchFilename } from "@/lib/utils";

const { us, uk, schengen, canada } = COUNTRY_SPECS;

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

describe("maxCopiesPerSheet", () => {
  describe("default 4×6 inch sheet", () => {
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

  describe("custom paper sizes & margins", () => {
    it("fits more photos on A4 sheet than 4x6", () => {
      const a4Count = maxCopiesPerSheet({ width: 35, height: 45 }, { paperSize: "a4" });
      const classicCount = maxCopiesPerSheet({ width: 35, height: 45 }, { paperSize: "4x6" });
      expect(a4Count).toBeGreaterThan(classicCount);
      expect(a4Count).toBe(30); // A4 fits 30 photos (35x45mm) with default 4mm margins and 3mm gaps
    });

    it("fits more photos with smaller margins/gaps", () => {
      const tightCount = maxCopiesPerSheet(
        { width: 35, height: 45 },
        { paperSize: "4x6", marginMm: 1, gapMm: 1 }
      );
      const looseCount = maxCopiesPerSheet(
        { width: 35, height: 45 },
        { paperSize: "4x6", marginMm: 10, gapMm: 5 }
      );
      expect(tightCount).toBeGreaterThan(looseCount);
    });

    it("respects copies clamp limit", () => {
      // should match layout capacity
      expect(maxCopiesPerSheet({ width: 35, height: 45 }, { paperSize: "5x7" })).toBe(9);
    });
  });
});

describe("generateBatchFilename", () => {
  it("pads numbers correctly based on hash count", () => {
    expect(generateBatchFilename("doc_###", 0, "jpg")).toBe("doc_001.jpg");
    expect(generateBatchFilename("doc_###", 9, "jpg")).toBe("doc_010.jpg");
    expect(generateBatchFilename("doc_###", 99, "jpg")).toBe("doc_100.jpg");
  });

  it("works with single hash", () => {
    expect(generateBatchFilename("pic_#", 4, "png")).toBe("pic_5.png");
  });

  it("falls back to suffix naming if no hash found", () => {
    expect(generateBatchFilename("scan", 2, "webp")).toBe("scan_3.webp");
  });
});
