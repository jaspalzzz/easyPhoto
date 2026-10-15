/**
 * /tools/resize-kb/: an optional minimum for forms that give a KB range
 * ("20 KB to 50 KB"), owner-approved 15 Oct 2026.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseMinKb } from "@/components/tools/ResizeKbTool";
import { PHOTO_RESIZE_FAQ } from "@/lib/faqs";
import { kbCapBytes, kbFloorBytes } from "@/lib/utils";

describe("parseMinKb", () => {
  it("treats an empty box as no minimum", () => {
    expect(parseMinKb("", 50)).toEqual({ minKb: null, error: null });
    expect(parseMinKb("   ", 50)).toEqual({ minKb: null, error: null });
  });

  it("accepts a whole number below the target", () => {
    expect(parseMinKb("20", 50)).toEqual({ minKb: 20, error: null });
    expect(parseMinKb(" 10 ", 20)).toEqual({ minKb: 10, error: null });
  });

  it.each(["abc", "0", "-5", "12.5", "1e3"])("rejects %j", (text) => {
    expect(parseMinKb(text, 50).error).toMatch(/whole number/);
  });

  it("needs room for the minimum in both KB conventions", () => {
    // 20 KB counted as 1024 bytes is 20,480 B, so the cap (1000-byte KB) must be at least 21 KB.
    expect(parseMinKb("20", 21)).toEqual({ minKb: 20, error: null });
    expect(kbFloorBytes(20)).toBeLessThanOrEqual(kbCapBytes(21));
    expect(parseMinKb("20", 20).error).toBe("For a 20 KB minimum, set the target to 21 KB or more.");
    expect(parseMinKb("50", 50).error).toMatch(/set the target to 52 KB or more/);
  });
});

describe("resize-kb page", () => {
  const page = fs.readFileSync(path.join("app", "tools", "resize-kb", "page.tsx"), "utf8");

  it("offers the minimum box and explains ranges", () => {
    expect(page).toContain("<ResizeKbTool targetFromUrl minField />");
    expect(page).toContain("When your form gives a range, such as 20 KB to 50 KB");
  });

  it("answers making a photo bigger in KB, honestly", () => {
    const faq = PHOTO_RESIZE_FAQ.find((f) => f.q === "Can I make a photo bigger in KB?");
    expect(faq?.a).toContain("The picture itself does not change");
  });
});
