/**
 * Coverage for the face-geometry and background checks in lib/photoCheck.ts.
 *
 * This is the engine behind the compliance checker, and it was the only
 * unproven layer of it: the file-level checks in lib/compliance.ts already had
 * 11 tests, while the part that actually differentiates the tool — head size,
 * tilt, framing — had none. That is the wrong way round for a page we intend
 * to point outreach at, because a wrong head-size verdict on a real photo is
 * the thing a reader would remember.
 *
 * Both dependencies are stubbed rather than exercised: `detectFace` needs
 * MediaPipe (a CDN model download and a real GPU/wasm context) and the
 * background sampler needs a 2D canvas, which jsdom does not implement. So
 * these tests pin the DECISION BOUNDARIES around fixed inputs — which is where
 * the bugs in threshold code actually live — not the model's accuracy.
 */
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";

const detectFace = vi.hoisted(() => vi.fn());
vi.mock("@/lib/faceDetection", () => ({ detectFace }));

import { checkPhotoQuality, type PhotoCheck } from "@/lib/photoCheck";

const SIZE = { width: 1000, height: 1000 };

/** A face that passes every geometry check, so each test varies one field. */
function face(over: Record<string, unknown> = {}) {
  return {
    faceCount: 1,
    faceCenterX: 500,
    crownY: 200,
    chinY: 800, // 600/1000 => 60% head height
    eyeCenterY: 400, // 0.40 band
    faceXSpan: { min: 300, max: 700 },
    crownIsEstimated: false,
    leftEyeCenter: { x: 430, y: 400 },
    rightEyeCenter: { x: 570, y: 400 },
    rollDeg: 0,
    ...over,
  };
}

/**
 * Stub a 2D canvas whose pixels are decided by `lumaAt`. The sampler scales the
 * image to a 320px cap and reads a strip from 2% to 14% of the height, so the
 * callback receives the SCALED coordinates the code actually samples.
 */
function stubCanvas(lumaAt: (x: number, y: number, w: number, h: number) => number) {
  const proto = globalThis.HTMLCanvasElement.prototype as unknown as {
    getContext: unknown;
  };
  const original = proto.getContext;
  proto.getContext = function (this: HTMLCanvasElement) {
    const w = this.width;
    const h = this.height;
    return {
      drawImage: () => {},
      getImageData: () => {
        const data = new Uint8ClampedArray(w * h * 4);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const L = lumaAt(x, y, w, h);
            const i = (y * w + x) * 4;
            // Grey pixel: luma() of (v,v,v) is exactly v.
            data[i] = data[i + 1] = data[i + 2] = L;
            data[i + 3] = 255;
          }
        }
        return { data };
      },
    };
  };
  return () => {
    proto.getContext = original;
  };
}

const get = (checks: PhotoCheck[], label: string) => checks.find((c) => c.label === label);
const statusOf = async (over: Record<string, unknown>, label: string) => {
  detectFace.mockResolvedValue(face(over));
  return get(await checkPhotoQuality({} as HTMLImageElement, SIZE), label)?.status;
};

/**
 * jsdom has no 2D canvas and logs a loud "Not implemented" for every call, which
 * would drown the `npm run verify` output. The sampler already treats a null
 * context as "no background data available", so default to that explicitly and
 * let stubCanvas() opt in where the background checks are the subject.
 */
beforeEach(() => {
  (
    globalThis.HTMLCanvasElement.prototype as unknown as { getContext: unknown }
  ).getContext = () => null;
});

afterEach(() => {
  detectFace.mockReset();
});

describe("face presence", () => {
  it("fails when no face is detected", async () => {
    detectFace.mockRejectedValue(new Error("no model"));
    const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
    expect(get(checks, "Face detected")?.status).toBe("fail");
  });

  it("does not report geometry checks when there is no face to measure", async () => {
    detectFace.mockRejectedValue(new Error("no model"));
    const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
    for (const l of ["Head size", "Eyes level", "Head centred", "Whole head visible"]) {
      expect(get(checks, l), `${l} must not be claimed without a face`).toBeUndefined();
    }
  });

  it("fails 'One person only' when more than one face is found", async () => {
    expect(await statusOf({ faceCount: 2 }, "One person only")).toBe("fail");
    expect(await statusOf({ faceCount: 1 }, "One person only")).toBe("pass");
  });
});

describe("head centring — boundary is 0.12 of width", () => {
  it("passes exactly at the boundary", async () => {
    // |620/1000 - 0.5| = 0.12
    expect(await statusOf({ faceCenterX: 620 }, "Head centred")).toBe("pass");
  });
  it("warns just past it", async () => {
    expect(await statusOf({ faceCenterX: 621 }, "Head centred")).toBe("warn");
  });
  it("warns when off-centre to the left as well as the right", async () => {
    expect(await statusOf({ faceCenterX: 379 }, "Head centred")).toBe("warn");
  });
});

describe("head size — pass band is 45%..92% of frame height", () => {
  it("warns below the band", async () => {
    expect(await statusOf({ crownY: 200, chinY: 640 }, "Head size")).toBe("warn"); // 44%
  });
  it("passes at the lower edge", async () => {
    expect(await statusOf({ crownY: 200, chinY: 650 }, "Head size")).toBe("pass"); // 45%
  });
  it("passes at the upper edge", async () => {
    expect(await statusOf({ crownY: 40, chinY: 960 }, "Head size")).toBe("pass"); // 92%
  });
  it("warns above the band", async () => {
    expect(await statusOf({ crownY: 30, chinY: 960 }, "Head size")).toBe("warn"); // 93%
  });
  it("reports the measured percentage, not a fixed string", async () => {
    detectFace.mockResolvedValue(face({ crownY: 200, chinY: 800 }));
    const c = get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Head size");
    expect(c?.detail).toContain("60%");
  });
});

describe("eyes level — 5 deg passes, 10 warns, beyond fails", () => {
  it("passes at 5 degrees", async () => {
    expect(await statusOf({ rollDeg: 5 }, "Eyes level")).toBe("pass");
  });
  it("warns between 5 and 10", async () => {
    expect(await statusOf({ rollDeg: 7 }, "Eyes level")).toBe("warn");
    expect(await statusOf({ rollDeg: 10 }, "Eyes level")).toBe("warn");
  });
  it("fails beyond 10", async () => {
    expect(await statusOf({ rollDeg: 10.1 }, "Eyes level")).toBe("fail");
  });
  it("treats tilt in either direction the same", async () => {
    expect(await statusOf({ rollDeg: -12 }, "Eyes level")).toBe("fail");
  });
  it("offers the straighten tool when tilted", async () => {
    detectFace.mockResolvedValue(face({ rollDeg: 12 }));
    const c = get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Eyes level");
    expect(c?.href).toBe("/tools/straighten-photo/");
  });
});

describe("eye position — pass band is 0.30..0.55 of height", () => {
  it("passes at both edges", async () => {
    expect(await statusOf({ eyeCenterY: 300 }, "Eye position")).toBe("pass");
    expect(await statusOf({ eyeCenterY: 550 }, "Eye position")).toBe("pass");
  });
  it("warns outside the band, and says which way", async () => {
    detectFace.mockResolvedValue(face({ eyeCenterY: 290 }));
    const high = get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Eye position");
    expect(high?.status).toBe("warn");
    expect(high?.detail).toContain("high");

    detectFace.mockResolvedValue(face({ eyeCenterY: 560 }));
    const low = get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Eye position");
    expect(low?.status).toBe("warn");
    expect(low?.detail).toContain("low");
  });
  it("omits the check entirely when the eye line was not measured", async () => {
    detectFace.mockResolvedValue(face({ eyeCenterY: undefined }));
    const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
    expect(get(checks, "Eye position")).toBeUndefined();
  });
});

describe("whole head visible", () => {
  it("passes with a margin above the crown and clear of the sides", async () => {
    expect(await statusOf({}, "Whole head visible")).toBe("pass");
  });
  it("warns when the crown is nearly at the top edge", async () => {
    expect(await statusOf({ crownY: 20 }, "Whole head visible")).toBe("warn"); // 2% < 3%
  });
  it("warns when the face touches the left or right edge", async () => {
    expect(await statusOf({ faceXSpan: { min: 1, max: 700 } }, "Whole head visible")).toBe("warn");
    expect(await statusOf({ faceXSpan: { min: 300, max: 999 } }, "Whole head visible")).toBe("warn");
  });
  it("warns when the chin runs off the bottom", async () => {
    expect(await statusOf({ chinY: 999 }, "Whole head visible")).toBe("warn");
  });
});

describe("background and lighting — heuristics, never worse than warn", () => {
  it("passes a bright even background", async () => {
    const restore = stubCanvas(() => 220);
    try {
      detectFace.mockResolvedValue(face());
      const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
      expect(get(checks, "Plain light background")?.status).toBe("pass");
      expect(get(checks, "Even lighting")?.status).toBe("pass");
    } finally {
      restore();
    }
  });

  it("warns on a dark background but never fails", async () => {
    const restore = stubCanvas(() => 120);
    try {
      detectFace.mockResolvedValue(face());
      const c = get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Plain light background");
      expect(c?.status).toBe("warn");
      expect(c?.status).not.toBe("fail");
    } finally {
      restore();
    }
  });

  it("passes exactly at the brightness boundary of 200", async () => {
    const restore = stubCanvas(() => 200);
    try {
      detectFace.mockResolvedValue(face());
      expect(
        get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Plain light background")?.status,
      ).toBe("pass");
    } finally {
      restore();
    }
  });

  it("warns when one side of the background is in shadow", async () => {
    // Left third dark, right third bright: a >35 luma split must be caught.
    const restore = stubCanvas((x, _y, w) => (x < w / 3 ? 170 : 230));
    try {
      detectFace.mockResolvedValue(face());
      expect(
        get(await checkPhotoQuality({} as HTMLImageElement, SIZE), "Even lighting")?.status,
      ).toBe("warn");
    } finally {
      restore();
    }
  });

  it("skips background checks rather than guessing when no canvas is available", async () => {
    detectFace.mockResolvedValue(face());
    const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
    expect(get(checks, "Plain light background")).toBeUndefined();
    expect(get(checks, "Even lighting")).toBeUndefined();
  });
});

describe("honesty contract", () => {
  it("never returns a bare status without an explanation", async () => {
    detectFace.mockResolvedValue(face());
    for (const c of await checkPhotoQuality({} as HTMLImageElement, SIZE)) {
      expect(c.detail, `${c.label} must explain itself`).toBeTruthy();
    }
  });

  it("always offers a concrete fix on anything not passing", async () => {
    detectFace.mockResolvedValue(face({ rollDeg: 20, faceCenterX: 900, crownY: 10 }));
    const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
    const bad = checks.filter((c) => c.status !== "pass");
    expect(bad.length).toBeGreaterThan(0);
    for (const c of bad) {
      expect(c.fix, `${c.label} flags a problem but offers no fix`).toBeTruthy();
    }
  });
});
