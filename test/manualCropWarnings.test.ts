/**
 * The manual re-crop path (buildPresetFromCrop) writes its own warnings rather
 * than calling computeCrop, so it is checked separately: on 18 Oct 2026 it
 * still told applicants "needs 2.50x upscaling (> 1.15) … Request a higher-res
 * photo" after the automatic path had been reworded.
 *
 * Rendering is stubbed — jsdom has no 2D canvas — because only the warnings
 * are under test here.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("pica", () => ({
  default: () => ({ resize: async () => undefined }),
}));
vi.mock("@/lib/background", () => ({ fillBackground: vi.fn() }));

import { buildPresetFromCrop } from "@/lib/pipeline";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { codeReferences } from "./quality/codeReferences";

const { india } = COUNTRY_SPECS;
const measurements = { crownY: 100, chinY: 250, eyeCenterY: 160, faceCenterX: 240 };

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});

describe("buildPresetFromCrop — warnings", () => {
  it("tells the applicant a small re-crop will look soft, in plain words", async () => {
    // A 480x600 upload re-cropped to 180x231 px, rendered at 300 DPI (413x531).
    const { result } = await buildPresetFromCrop(
      document.createElement("canvas"),
      { width: 480, height: 600 },
      { sx: 150, sy: 40, sw: 180, sh: 231 },
      measurements,
      india,
      300
    );
    expect(result.achieved.upscale).toBeGreaterThan(1.15);
    expect(result.warnings).toContain(
      "This photo is lower-resolution than ideal, so the result may look soft " +
        "when printed. A higher-resolution photo will look sharper."
    );
    for (const w of result.warnings) expect(codeReferences(w)).toEqual([]);
  });

  it("does not warn when the re-crop has enough pixels", async () => {
    const { result } = await buildPresetFromCrop(
      document.createElement("canvas"),
      { width: 2000, height: 2600 },
      { sx: 400, sy: 200, sw: 800, sh: 1028 },
      { crownY: 300, chinY: 1080, eyeCenterY: 600, faceCenterX: 800 },
      india,
      300
    );
    expect(result.warnings.some((w) => /soft/.test(w))).toBe(false);
  });
});
