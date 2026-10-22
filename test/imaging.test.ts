import { describe, expect, it } from "vitest";
import { canvasToBlob, matchesAspectRatio } from "@/lib/imaging";
import { codeReferences } from "./quality/codeReferences";

describe("matchesAspectRatio", () => {
  it("accepts exact fixed-pixel and integer-rounded portal ratios", () => {
    expect(matchesAspectRatio(130, 170, 130 / 170)).toBe(true);
    expect(matchesAspectRatio(373, 480, 35 / 45)).toBe(true);
  });

  it("rejects a square image for a portrait portal ratio", () => {
    expect(matchesAspectRatio(870, 870, 35 / 45)).toBe(false);
  });
});

describe("canvasToBlob", () => {
  it("rejects with plain guidance, not a code reference, when the browser returns no blob", async () => {
    // A phone out of canvas memory hands toBlob's callback null; the tools
    // show the rejection's message to the user as-is.
    const canvas = {
      toBlob: (cb: BlobCallback) => cb(null),
    } as unknown as HTMLCanvasElement;
    const error = await canvasToBlob(canvas, "image/jpeg").catch((e: Error) => e);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(/^Your browser couldn't create the image file/);
    expect(codeReferences((error as Error).message)).toEqual([]);
  });
});
