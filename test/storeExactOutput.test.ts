/**
 * Guards the WIRING, not just the maths.
 *
 * `countryDigitalUpload.test.ts` calls computeCrop with `exactOutput` directly,
 * so it stays green even if the store stops passing `digital.px` — which is the
 * only thing that makes the real export correct. Deleting `rspec.digital?.px`
 * from either store call site would have shipped 413x531 for Singapore again
 * with a full suite passing.
 *
 * So this drives the store with the pipeline mocked and asserts what the two
 * preset builders actually receive, on both the automatic and manual paths.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const buildPreset = vi.hoisted(() => vi.fn());
const buildPresetFromCrop = vi.hoisted(() => vi.fn());
const canvasToObjectURL = vi.hoisted(() => vi.fn(async () => "blob:stub"));

vi.mock("@/lib/pipeline", () => ({
  buildPreset,
  buildPresetFromCrop,
  canvasToObjectURL,
  loadImageFromFile: vi.fn(),
  renderPhoto: vi.fn(),
}));

import { useToolStore } from "@/store/useToolStore";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const stubResult = {
  result: {
    crop: { sx: 0, sy: 0, sw: 100, sh: 100 },
    output: { width: 1, height: 1 },
    dpi: 300,
    achieved: { headPercentOfFrame: 75, upscale: 1 },
    warnings: [],
  },
  canvas: {} as HTMLCanvasElement,
};

/** Minimum state for the store to attempt a rebuild. */
function primeStore(specKey: string) {
  useToolStore.setState({
    spec: COUNTRY_SPECS[specKey]!,
    sourceImage: {} as HTMLImageElement,
    sourceSize: { width: 2000, height: 2600 },
    measurements: {
      crownY: 100,
      chinY: 400,
      eyeCenterY: 220,
      faceCenterX: 1000,
    },
    composite: null,
    print: null,
    digital: null,
    brightness: 100,
    contrast: 100,
  } as never);
}

beforeEach(() => {
  buildPreset.mockReset().mockResolvedValue(stubResult);
  buildPresetFromCrop.mockReset().mockResolvedValue(stubResult);
});

describe("store passes exact upload sizes to the export", () => {
  it("sends digital.px on the manual-crop path", async () => {
    primeStore("singapore");
    await useToolStore
      .getState()
      .applyManualCrop({ sx: 0, sy: 0, sw: 800, sh: 1028 });

    expect(buildPresetFromCrop).toHaveBeenCalledTimes(2);
    // buildPresetFromCrop(src, size, crop, measurements, spec, dpi,
    //                      adjustments, exactOutput) — index 7.
    const EXACT_ARG = 7;
    expect(buildPresetFromCrop.mock.calls[1][EXACT_ARG]).toEqual({
      width: 400,
      height: 514,
    });
    // The print preset must NOT be forced to the upload size.
    expect(buildPresetFromCrop.mock.calls[0][EXACT_ARG]).toBeUndefined();
  });

  it("sends digital.px on the automatic path", async () => {
    // recomputeAuto() -> rebuildPresets() -> buildPreset(). Covered separately
    // because it is a different call site: dropping `exactOutput` from the
    // automatic branch alone previously left every test green.
    primeStore("singapore");
    await useToolStore.getState().recomputeAuto();

    expect(buildPreset).toHaveBeenCalledTimes(2);
    // buildPreset(src, size, measurements, spec, opts) — opts is index 4.
    const digitalOpts = buildPreset.mock.calls[1][4];
    expect(digitalOpts.exactOutput).toEqual({ width: 400, height: 514 });
    // The print preset must not be forced to the upload size.
    expect(buildPreset.mock.calls[0][4].exactOutput).toBeUndefined();
  });

  it("leaves a record without an exact size unforced on the automatic path", async () => {
    primeStore("uk");
    await useToolStore.getState().recomputeAuto();
    expect(buildPreset.mock.calls[1][4].exactOutput).toBeUndefined();
  });

  it("leaves records without an exact size unforced", async () => {
    primeStore("uk");
    await useToolStore
      .getState()
      .applyManualCrop({ sx: 0, sy: 0, sw: 800, sh: 1028 });

    expect(buildPresetFromCrop.mock.calls[1][7]).toBeUndefined();
  });
});
