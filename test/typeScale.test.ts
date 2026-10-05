import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * The site's type scale (owner-approved option C, Oct 2026). Before it, components
 * used 38 hand-picked sizes on top of Tailwind's steps, so nothing had a clear
 * level. Arbitrary `text-[…]` sizes must be one of these steps — 15px is kept
 * as the mobile intro/lead size so the tool stays near the top on phones.
 */
const SCALE_PX = [12, 14, 15, 16, 18, 20, 24, 30, 36, 48];
/** Decorative badge glyphs (7–8px) and the one display numeral (56px). */
const EXCEPTIONS_PX = [7, 8, 56];

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

describe("type scale", () => {
  it("uses only scale steps for arbitrary text sizes in components and pages", () => {
    const root = path.resolve(__dirname, "..");
    const offScale: string[] = [];
    for (const file of [...sourceFiles(path.join(root, "components")), ...sourceFiles(path.join(root, "app"))]) {
      const src = fs.readFileSync(file, "utf8");
      for (const m of src.matchAll(/\btext-\[([0-9.]+)(px|rem)\]/g)) {
        const px = parseFloat(m[1]) * (m[2] === "rem" ? 16 : 1);
        if (!SCALE_PX.includes(px) && !EXCEPTIONS_PX.includes(px)) {
          offScale.push(`${path.relative(root, file)}: ${m[0]}`);
        }
      }
    }
    expect(offScale).toEqual([]);
  });
});
