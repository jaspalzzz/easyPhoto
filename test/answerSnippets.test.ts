/**
 * Short answers that search and AI results quote (Bing AI report, 14 Oct
 * 2026): the passport size in cm and pixels, and how to hit a KB limit. Each
 * figure must match what the tools actually do.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PASSPORT_FAQ, PHOTO_RESIZE_FAQ } from "@/lib/faqs";
import { mmToPx } from "@/lib/headPositioning";
import { kbCapBytes } from "@/lib/utils";

describe("passport size answer", () => {
  const answer = PASSPORT_FAQ.find((f) => f.q === "What size is a passport photo?")?.a ?? "";

  it("gives the size in mm, cm and pixels at 300 DPI", () => {
    expect(answer).toContain("35 mm × 45 mm (3.5 cm × 4.5 cm)");
    expect(answer).toContain("Printed at 300 DPI, that is 413 × 531 pixels.");
  });

  it("uses the same mm-to-pixel rounding as the photo pipeline", () => {
    expect([mmToPx(35, 300), mmToPx(45, 300)]).toEqual([413, 531]);
  });
});

describe("resize by KB how-to", () => {
  const page = fs.readFileSync(path.join("app", "tools", "resize-kb", "page.tsx"), "utf8");

  it("is titled in the words searchers use (Bing: \"photo resizer in kb\")", () => {
    expect(page).toContain('title: "Photo Resizer in KB — Resize Image to 20, 50, 100 KB"');
    expect(page).toContain('title="Photo Resizer in KB"');
  });

  it("answers the common KB sizes in one how-to section", () => {
    expect(page).toContain("Resize a photo to 20 KB, 50 KB, 100 KB or 200 KB");
  });

  it("promises a file under the limit in both KB conventions, as the compressor enforces", () => {
    expect(page).toMatch(/counts 1 KB as 1,000 or 1,024 bytes/);
    for (const kb of [20, 50, 100, 200]) {
      expect(kbCapBytes(kb)).toBeLessThanOrEqual(kb * 1000);
    }
  });

  it("does not repeat the how-to as separate per-size FAQs", () => {
    const sizeHowTos = PHOTO_RESIZE_FAQ.filter((f) => /\b(20|50|100|200) ?KB\b/i.test(f.q));
    expect(sizeHowTos).toEqual([]);
  });
});
