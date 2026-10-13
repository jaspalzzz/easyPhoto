/**
 * Output audit rules (audit/checks.ts): the file-header reader and the checks
 * every exam download must pass. See docs/output-audit-plan-2026-10.md.
 */
import { describe, expect, it } from "vitest";
import { checkFile, readFileFacts, rulesFor, type FileFacts } from "../audit/checks";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

/** Minimal JPEG header: SOI, APP0 JFIF with density, SOF0 with the size. */
function jpeg(width: number, height: number, dpi?: number): Uint8Array {
  const app0 = [0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, dpi ? 1 : 0, (dpi ?? 1) >> 8, (dpi ?? 1) & 255, (dpi ?? 1) >> 8, (dpi ?? 1) & 255, 0, 0];
  const sof = [0xff, 0xc0, 0x00, 0x11, 0x08, height >> 8, height & 255, width >> 8, width & 255, 0x03, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1];
  return new Uint8Array([0xff, 0xd8, ...app0, ...sof, 0xff, 0xd9]);
}

const facts = (o: Partial<FileFacts>): FileFacts => ({ format: "jpeg", bytes: 30_000, width: 200, height: 230, ...o });
const failed = (r: ReturnType<typeof checkFile>) => r.filter((c) => !c.pass).map((c) => c.check);

describe("readFileFacts", () => {
  it("reads a JPEG's pixel size and declared DPI", () => {
    expect(readFileFacts(jpeg(384, 534, 200))).toMatchObject({ format: "jpeg", width: 384, height: 534, dpi: 200 });
  });

  it("reports no DPI when the JFIF density is only an aspect ratio", () => {
    expect(readFileFacts(jpeg(10, 10)).dpi).toBeUndefined();
  });

  it("reads a PNG's size", () => {
    const png = new Uint8Array(33);
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 1, 44, 0, 0, 0, 150]);
    expect(readFileFacts(png)).toMatchObject({ format: "png", width: 300, height: 150 });
  });

  it("rejects anything else", () => {
    expect(readFileFacts(new Uint8Array([1, 2, 3])).format).toBe("unknown");
  });
});

describe("checkFile", () => {
  it("catches the UPSC signature that came out 384 × 534 (#99)", () => {
    const rules = rulesFor(PORTAL_PRESETS.upsc, "signature")!;
    expect(failed(checkFile(rules, facts({ width: 384, height: 534, bytes: 20_480 })))).toEqual(["side range"]);
    expect(failed(checkFile(rules, facts({ width: 360, height: 500, bytes: 20_480 })))).toEqual([]);
  });

  it("catches the OCI photo that came out 2168 × 2168 (#103)", () => {
    const rules = rulesFor(PORTAL_PRESETS.oci, "photo")!;
    expect(failed(checkFile(rules, facts({ width: 2168, height: 2168, bytes: 198_000 })))).toEqual(["side range"]);
    expect(failed(checkFile(rules, facts({ width: 150, height: 150, bytes: 20_000 })))).toEqual(["side range"]);
    expect(failed(checkFile(rules, facts({ width: 900, height: 900, bytes: 192_764 })))).toEqual([]);
  });

  it("holds the cap in 1,000-byte KB and the floor in 1,024-byte KB", () => {
    const rules = rulesFor(PORTAL_PRESETS.ibps, "photo")!;
    expect(failed(checkFile(rules, facts({ bytes: 50_001, dpi: 200 })))).toEqual(["max size"]);
    expect(failed(checkFile(rules, facts({ bytes: 20_479, dpi: 200 })))).toEqual(["min size"]);
    expect(failed(checkFile(rules, facts({ bytes: 20_480, dpi: 200 })))).toEqual([]);
  });

  it("requires the exact published pixels and DPI", () => {
    const rules = rulesFor(PORTAL_PRESETS.ibps, "photo")!;
    expect(failed(checkFile(rules, facts({ width: 201, dpi: 200 })))).toEqual(["pixels"]);
    expect(failed(checkFile(rules, facts({ dpi: 96 })))).toEqual(["dpi"]);
  });

  it("allows one pixel of rounding on a published shape", () => {
    const rules = rulesFor(PORTAL_PRESETS["voter-id"], "photo")!;
    expect(failed(checkFile(rules, facts({ width: 350, height: 450 })))).toEqual([]);
    expect(failed(checkFile(rules, facts({ width: 351, height: 450 })))).toEqual([]);
    expect(failed(checkFile(rules, facts({ width: 400, height: 450 })))).toEqual(["shape"]);
  });

  it("fails a PNG where the exam asks for JPG", () => {
    const rules = rulesFor(PORTAL_PRESETS.upsc, "photo")!;
    expect(failed(checkFile(rules, facts({ format: "png" })))).toEqual(["format"]);
  });

  it("has no rules for files an exam doesn't take", () => {
    expect(rulesFor(PORTAL_PRESETS["voter-id"], "signature")).toBeNull();
  });
});
