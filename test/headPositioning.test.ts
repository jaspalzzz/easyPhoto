import { describe, it, expect } from "vitest";
import {
  mmToPx,
  targetHeadMm,
  recommendedDigitalDpi,
  computeCrop,
  type FaceMeasurements,
} from "@/lib/headPositioning";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const { us, uk, india } = COUNTRY_SPECS;

/** Build a face with a generous source so only the asserted warning fires. */
function face(over: Partial<FaceMeasurements> = {}): FaceMeasurements {
  return { chinY: 700, crownY: 300, eyeCenterY: 500, faceCenterX: 600, ...over };
}

describe("mmToPx", () => {
  it("converts exactly one inch at 300 DPI", () => {
    expect(mmToPx(25.4, 300)).toBe(300);
  });
  it("matches the US 2-inch print size", () => {
    expect(mmToPx(51, 300)).toBe(602);
  });
});

describe("targetHeadMm", () => {
  it("aims for the centre of each band", () => {
    expect(targetHeadMm(us)).toBe(30); // (25+35)/2
    expect(targetHeadMm(uk)).toBe(31.5); // (29+34)/2
    expect(targetHeadMm(india)).toBe(37); // (36+38)/2 — official 80-85% face coverage
  });
});

describe("recommendedDigitalDpi", () => {
  it("keeps US at base DPI (300 already clears 600x600)", () => {
    expect(recommendedDigitalDpi(us)).toBe(300);
  });
  it("raises UK DPI so output clears its 600x750 online minimum", () => {
    const dpi = recommendedDigitalDpi(uk);
    expect(dpi).toBeGreaterThan(300);
    // At the recommended DPI, the print-sized output must clear the px minimum.
    expect(mmToPx(uk.printMm.width, dpi)).toBeGreaterThanOrEqual(
      uk.digital.pxMin!.width
    );
    expect(mmToPx(uk.printMm.height, dpi)).toBeGreaterThanOrEqual(
      uk.digital.pxMin!.height
    );
  });
});

describe("computeCrop — US happy path", () => {
  const result = computeCrop(face(), us, {
    source: { width: 1200, height: 1200 },
  });

  it("produces the exact print output size", () => {
    expect(result.output).toEqual({ width: 602, height: 602 });
  });

  it("lands the head height inside the country band", () => {
    const pct = result.achieved.headPercentOfFrame;
    expect(pct).toBeGreaterThanOrEqual(us.headPercentOfFrame!.min);
    expect(pct).toBeLessThanOrEqual(us.headPercentOfFrame!.max);
  });

  it("emits no warnings for a high-res, well-framed source", () => {
    expect(result.warnings).toEqual([]);
  });

  it("returns integer crop coordinates within source bounds", () => {
    const { sx, sy, sw, sh } = result.crop;
    [sx, sy, sw, sh].forEach((n) => expect(Number.isInteger(n)).toBe(true));
    expect(sx).toBeGreaterThanOrEqual(0);
    expect(sy).toBeGreaterThanOrEqual(0);
    expect(sx + sw).toBeLessThanOrEqual(1200);
    expect(sy + sh).toBeLessThanOrEqual(1200);
  });
});

describe("computeCrop — warnings", () => {
  it("warns when the source head is too small (needs upscaling)", () => {
    // srcHeadPx = 150 << target → heavy upscale.
    const result = computeCrop(face({ chinY: 450, crownY: 300 }), us, {
      source: { width: 1200, height: 1200 },
    });
    expect(result.achieved.upscale).toBeGreaterThan(1.15);
    expect(result.warnings.some((w) => /upscal/i.test(w))).toBe(true);
  });

  it("warns and clamps when the ideal crop exceeds the photo edges", () => {
    const result = computeCrop(face(), us, {
      source: { width: 200, height: 200 },
    });
    expect(result.warnings.some((w) => /past the photo edges/i.test(w))).toBe(
      true
    );
    // Clamped to stay inside the source.
    expect(result.crop.sx).toBeGreaterThanOrEqual(0);
    expect(result.crop.sy).toBeGreaterThanOrEqual(0);
  });

  it("warns when print-DPI output is below the digital upload minimum (UK)", () => {
    const result = computeCrop(face(), uk, {
      dpi: 300,
      source: { width: 1200, height: 1200 },
    });
    expect(
      result.warnings.some((w) => /digital upload minimum/i.test(w))
    ).toBe(true);
  });

  it("clears the digital-minimum warning at recommendedDigitalDpi (UK)", () => {
    const result = computeCrop(face(), uk, {
      dpi: recommendedDigitalDpi(uk),
      source: { width: 2000, height: 2000 },
    });
    expect(
      result.warnings.some((w) => /digital upload minimum/i.test(w))
    ).toBe(false);
  });

  it("India's corrected head band (32-36mm) lands in its 70-80% frame band", () => {
    // After aligning India to the ICAO standard it adopted, the head size is
    // self-consistent — no more spec-inconsistency warning.
    const result = computeCrop(face(), india, {
      source: { width: 1200, height: 1200 },
    });
    const pct = result.achieved.headPercentOfFrame;
    expect(pct).toBeGreaterThanOrEqual(india.headPercentOfFrame!.min);
    expect(pct).toBeLessThanOrEqual(india.headPercentOfFrame!.max);
    expect(result.warnings.some((w) => /Spec inconsistency/i.test(w))).toBe(
      false
    );
  });

  it("still flags a genuinely inconsistent spec (head mm vs % band)", () => {
    // Synthetic spec: 40mm head on a 45mm photo = ~89%, far outside 70-80%.
    const broken = {
      ...india,
      headHeightMm: { min: 40, max: 40 },
      headPercentOfFrame: { min: 70, max: 80 },
    };
    const result = computeCrop(face(), broken, {
      source: { width: 1200, height: 1200 },
    });
    expect(result.warnings.some((w) => /Spec inconsistency/i.test(w))).toBe(
      true
    );
  });

  it("throws when crownY is not above chinY", () => {
    expect(() =>
      computeCrop(face({ chinY: 100, crownY: 300 }), us)
    ).toThrow(/crownY/);
  });
});
