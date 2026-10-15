import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { EXAM_SIZE_GUIDE_FAQ_ITEMS } from "@/lib/examGuideCopy";

/*
 * UPSC's "Instructions for Uploading the Photo & Signature" (re-read 15 Oct
 * 2026) apply to CSE, NDA and CDS alike: a mandatory live photograph matched
 * with the upload, and one signature image of 350–500 pixels holding three
 * signatures in black ink. Before this check the NDA/CDS post said the
 * signature had no pixel size and took blue ink, and neither UPSC post
 * mentioned the live photo.
 */
const POSTS = [
  "app/blog/nda-cds-photo-signature-guide-2026/page.tsx",
  "app/blog/upsc-cse-ias-photo-signature-guide-2026/page.tsx",
  "app/blog/exam-photo-signature-size-guide/page.tsx",
];

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
const visibleText = (file: string) => read(file).replace(/\s+/g, " ");

describe("UPSC blog posts match UPSC's upload instructions", () => {
  it("still matches the records the posts were checked against", () => {
    for (const id of ["upsc", "nda", "cds"] as const) {
      expect(PORTAL_PRESETS[id].sigSidePx).toEqual({ min: 350, max: 500 });
      expect(PORTAL_PRESETS[id].sigMinKb).toBe(20);
      expect(PORTAL_PRESETS[id].sigLimitKb).toBe(100);
    }
  });

  it.each(POSTS)("%s gives the signature pixels and the live photo", (file) => {
    const text = visibleText(file);
    expect(text).toMatch(/350–500(?:&nbsp;| )(?:px|pixels)/);
    expect(text).toMatch(/live photo/i);
  });

  it.each(POSTS)("%s doesn't offer blue ink or deny a signature pixel size", (file) => {
    const text = visibleText(file);
    expect(text).not.toMatch(/black or blue/i);
    expect(text).not.toMatch(/blue accepted/i);
    expect(text).not.toMatch(/all-capitals (?:signatures )?(?:are )?rejected|<td[^>]*>Rejected</i);
  });

  it("the NDA/CDS signature row gives UPSC's pixel range", () => {
    const row = read(POSTS[0]).match(/Pixel dimensions<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>/);
    expect(row?.[1]).toBe("No fixed size published");
    expect(row?.[2]).toBe("350–500&nbsp;px");
  });

  it("the size guide's UPSC answer includes the pixels and the live photo", () => {
    const upsc = EXAM_SIZE_GUIDE_FAQ_ITEMS.find((f) => /UPSC photo and signature sizes/.test(f.q));
    expect(upsc?.a).toMatch(/350–500 pixels/);
    expect(upsc?.a).toMatch(/live photograph/);
  });

  it("links SBI careers at its current address", () => {
    const text = read(POSTS[2]);
    expect(text).not.toContain("sbi.co.in/careers");
    expect(text).toContain("https://sbi.bank.in/web/careers");
  });
});
