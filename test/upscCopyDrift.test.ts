/**
 * Guards against the UPSC/NDA/CDS spec drift that shipped to production.
 *
 * The registry was corrected — UPSC and its portal siblings (NDA, CDS) use a
 * 20–200 KB photo and a 20–100 KB three-signature sheet, with NO fixed pixel
 * size, NO square-crop rule, and NO name/date strip. But hand-written blog and
 * marketing copy still asserted the old, invented "20–300 KB / 350×350 px square
 * / name and date mandatory" specification across ~13 files. Some of those were
 * meta descriptions and OG social cards, so the wrong numbers reached search
 * results and share previews.
 *
 * The values 350×350 and the 20–300 KB band no longer describe any exam preset,
 * so this scan bans them in exam/UPSC context. It deliberately does NOT touch the
 * Indian e-Visa, which is genuinely a square 350×350–1000×1000 photo — those
 * files are allowlisted.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { allPortalSpecs } from "@/lib/specRegistry";
import { SUB_EXAM_RESIZERS } from "@/lib/subExamResizers";

const ROOTS = ["app", "components", "lib"];
const SOURCE_EXT = /\.(ts|tsx)$/;

// Files that legitimately describe the Indian e-Visa square photo
// (350×350–1000×1000). The e-Visa really is square; the exam claim was not.
const EVISA_ALLOWLIST = new Set([
  join("app", "[maker]", "page.tsx"),
  join("lib", "makerContent.ts"),
  join("lib", "countrySpecs.ts"),
]);

// This test file states the banned strings to describe them; skip itself.
const SELF = join("test", "upscCopyDrift.test.ts");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return SOURCE_EXT.test(entry.name) ? [path] : [];
  });
}

/** Normalise HTML entities and unicode so "350&#215;350" and "350×350" match alike. */
function normalise(text: string): string {
  return text
    .replace(/&#215;|&times;/gi, "×")
    .replace(/&nbsp;/gi, " ")
    .replace(/&ndash;|&#8211;/gi, "–");
}

describe("UPSC/exam copy does not reassert the retired 350×350 / 20–300 KB spec", () => {
  it("UPSC sub-exam copy does not claim a name/date strip", () => {
    const notes = SUB_EXAM_RESIZERS.filter((item) => item.parentId === "upsc")
      .map((item) => item.note)
      .join("\n");
    expect(notes).toMatch(/do not list|no listed|do not.*name-and-date/i);
    expect(notes).not.toMatch(/requires your name|printed name-and-date requirement|name-and-date-on-photo rule/i);
  });
  it("no exam preset uses a 350×350 square or a 20–300 KB band (registry sanity)", () => {
    // A 350px width paired with a taller height (e.g. NTA 350×450) is legitimate;
    // only the 350×350 SQUARE was the invented UPSC claim.
    const isSquare350 = (w?: number, h?: number) => w === 350 && h === 350;
    for (const s of allPortalSpecs()) {
      expect(
        isSquare350(s.photoWidthPx, s.photoHeightPx) || isSquare350(s.sigWidthPx, s.sigHeightPx),
        `${s.id} unexpectedly uses a 350×350 square`
      ).toBe(false);
      const band = (min?: number, max?: number) => min === 20 && max === 300;
      expect(
        band(s.photoMinKb, s.photoLimitKb) || band(s.sigMinKb, s.sigLimitKb),
        `${s.id} unexpectedly uses a 20–300 KB band`
      ).toBe(false);
    }
  });

  it("no source file outside the e-Visa allowlist ships 350×350 or a 20–300 KB exam band", () => {
    const offenders: string[] = [];
    // "350×350" (square) and "20–300 KB" are the two fingerprints of the drift.
    const SQUARE = /350\s*×\s*350/;
    const BAND = /20\s*[–-]\s*300\s*KB/;

    for (const root of ROOTS) {
      for (const file of sourceFiles(root)) {
        if (EVISA_ALLOWLIST.has(file) || file === SELF) continue;
        const text = normalise(readFileSync(file, "utf8"));
        text.split("\n").forEach((line, i) => {
          if (SQUARE.test(line) || BAND.test(line)) offenders.push(`${file}:${i + 1}`);
        });
      }
    }

    expect(
      offenders,
      `These lines reassert the retired UPSC spec (350×350 square / 20–300 KB). ` +
        `UPSC is 20–200 KB photo, 20–100 KB signature, no fixed pixel size:\n  ` +
        offenders.join("\n  ")
    ).toEqual([]);
  });
});
