/**
 * The compliance checker's page copy states exact thresholds. This pins that
 * copy to the behaviour it describes.
 *
 * The page now documents the real numbers — head height 45–92% of the frame,
 * tilt 5° pass / 10° warn, centring within 0.12, eye line 0.30–0.55 — because
 * that specificity is the reason the page is worth citing. It also creates a
 * silent-drift risk of exactly the kind this project has been bitten by before:
 * change a threshold in lib/photoCheck.ts and the prose keeps confidently
 * stating the old one, with nothing to catch it.
 *
 * So the boundaries are DERIVED by probing the engine, then asserted against
 * the rendered copy. Changing a threshold without updating the page fails here,
 * and so does changing the page without the engine agreeing.
 */
import * as React from "react";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";

const detectFace = vi.hoisted(() => vi.fn());
vi.mock("@/lib/faceDetection", () => ({ detectFace }));

import { checkPhotoQuality } from "@/lib/photoCheck";
import { ToolDepth } from "@/components/tools/ToolDepth";

const SIZE = { width: 1000, height: 1000 };

function face(over: Record<string, unknown> = {}) {
  return {
    faceCount: 1, faceCenterX: 500, crownY: 200, chinY: 800, eyeCenterY: 400,
    faceXSpan: { min: 300, max: 700 }, crownIsEstimated: false,
    leftEyeCenter: { x: 430, y: 400 }, rightEyeCenter: { x: 570, y: 400 },
    rollDeg: 0, ...over,
  };
}

beforeEach(() => {
  (globalThis.HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext =
    () => null;
});
afterEach(() => detectFace.mockReset());

async function statusOf(over: Record<string, unknown>, label: string) {
  detectFace.mockResolvedValue(face(over));
  const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
  return checks.find((c) => c.label === label)?.status;
}

/** Flatten a rendered tree to plain text. */
function textOf(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ");
  const el = node as React.ReactElement<Record<string, unknown>>;
  if (!el?.props) return "";
  return textOf((el.props as { children?: unknown }).children);
}

const copy = () => textOf(ToolDepth({ slug: "compliance-checker" })).replace(/\s+/g, " ");

/** Smallest integer head-height percentage that passes. */
async function lowestPassingHeadPct(): Promise<number> {
  for (let pct = 20; pct <= 100; pct++) {
    const span = Math.round((pct / 100) * SIZE.height);
    if ((await statusOf({ crownY: 100, chinY: 100 + span }, "Head size")) === "pass") return pct;
  }
  throw new Error("no passing head size found");
}

/** Largest integer head-height percentage that still passes. */
async function highestPassingHeadPct(): Promise<number> {
  let best = 0;
  for (let pct = 20; pct <= 100; pct++) {
    const span = Math.round((pct / 100) * SIZE.height);
    if ((await statusOf({ crownY: 0, chinY: span }, "Head size")) === "pass") best = pct;
  }
  return best;
}

describe("the checker page documents the thresholds the engine actually uses", () => {
  it("renders the depth copy on the flagship page at all", () => {
    const t = copy();
    expect(t.length, "compliance-checker must have depth copy").toBeGreaterThan(400);
  });

  it("states the head-height band the engine enforces", async () => {
    const low = await lowestPassingHeadPct();
    const high = await highestPassingHeadPct();
    expect(low).toBe(45);
    expect(high).toBe(92);
    expect(copy(), `copy must state the ${low}-${high}% band`).toContain(
      `between ${low} and ${high} percent`,
    );
  });

  it("states the tilt thresholds the engine enforces", async () => {
    expect(await statusOf({ rollDeg: 5 }, "Eyes level")).toBe("pass");
    expect(await statusOf({ rollDeg: 5.1 }, "Eyes level")).toBe("warn");
    expect(await statusOf({ rollDeg: 10 }, "Eyes level")).toBe("warn");
    expect(await statusOf({ rollDeg: 10.1 }, "Eyes level")).toBe("fail");
    const t = copy();
    expect(t).toContain("within 5 degrees");
    expect(t).toContain("between 5 and 10");
  });

  it("states the centring tolerance the engine enforces", async () => {
    expect(await statusOf({ faceCenterX: 620 }, "Head centred")).toBe("pass"); // 0.12
    expect(await statusOf({ faceCenterX: 621 }, "Head centred")).toBe("warn");
    expect(copy()).toContain("within 12 percent");
  });

  it("states the eye-line band the engine enforces", async () => {
    expect(await statusOf({ eyeCenterY: 300 }, "Eye position")).toBe("pass");
    expect(await statusOf({ eyeCenterY: 550 }, "Eye position")).toBe("pass");
    expect(await statusOf({ eyeCenterY: 560 }, "Eye position")).toBe("warn");
    expect(copy()).toContain("between 30 and 55 percent");
  });

  it("only claims warn-only heuristics while that is still true", async () => {
    // The copy promises background and lighting can never fail, so probe the
    // worst case rather than trusting the sentence: a dark, one-sided
    // background must still come back as warn.
    const proto = globalThis.HTMLCanvasElement.prototype as unknown as { getContext: unknown };
    proto.getContext = function (this: HTMLCanvasElement) {
      const w = this.width, h = this.height;
      return {
        drawImage: () => {},
        getImageData: () => {
          const data = new Uint8ClampedArray(w * h * 4);
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const L = x < w / 3 ? 10 : 90; // dark AND heavily uneven
              const i = (y * w + x) * 4;
              data[i] = data[i + 1] = data[i + 2] = L;
              data[i + 3] = 255;
            }
          }
          return { data };
        },
      };
    };
    detectFace.mockResolvedValue(face());
    const checks = await checkPhotoQuality({} as HTMLImageElement, SIZE);
    const bg = checks.find((c) => c.label === "Plain light background");
    const light = checks.find((c) => c.label === "Even lighting");
    expect(bg?.status, "background must warn, never fail").toBe("warn");
    expect(light?.status, "lighting must warn, never fail").toBe("warn");
    expect(copy()).toContain("can only ever warn, never fail");
  });

  it("keeps the crown-estimation caveat, which is a known measurement limit", () => {
    const t = copy();
    expect(t).toContain("extrapolated");
    expect(t.toLowerCase()).toContain("cannot see through hair");
  });

  it("still says plainly what it cannot judge", () => {
    const t = copy().toLowerCase();
    for (const claim of ["recent", "expression", "not an acceptance prediction"]) {
      expect(t, `copy must retain: ${claim}`).toContain(claim);
    }
  });
});
