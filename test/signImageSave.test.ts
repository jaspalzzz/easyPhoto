/** /tools/sign-image/: a PNG upload is saved as a PNG ("sign on image png"). */
import { describe, expect, it } from "vitest";
import { savesAsPng } from "@/components/tools/SignImageTool";

describe("savesAsPng", () => {
  const png = { type: "image/png", name: "scan.png" };
  it("keeps a PNG as PNG", () => expect(savesAsPng(png, false)).toBe(true));
  it("recognises a PNG by its name when the type is missing", () =>
    expect(savesAsPng({ type: "", name: "SCAN.PNG" }, false)).toBe(true));
  it("saves JPG, WebP and HEIC uploads as JPG", () => {
    for (const f of [
      { type: "image/jpeg", name: "a.jpg" },
      { type: "image/webp", name: "a.webp" },
      { type: "image/heic", name: "a.heic" },
    ]) {
      expect(savesAsPng(f, false), f.name).toBe(false);
    }
  });
  it("uses JPG whenever a KB limit is set", () => expect(savesAsPng(png, true)).toBe(false));
  it("uses JPG with no file", () => expect(savesAsPng(null, false)).toBe(false));
});
