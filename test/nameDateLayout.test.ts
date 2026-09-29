/**
 * The name/date strip must never clip the candidate's name. It used to shrink
 * each line only down to 8 px and then draw it anyway, so on TNPSC's 130 px
 * frame any name over ~20 characters was cut off at both edges.
 */
import { describe, expect, it } from "vitest";
import {
  layoutStripText,
  MIN_LEGIBLE_FONT_PX,
  STRIP_LINE_HEIGHT,
  type MeasureText,
  type StripLine,
} from "@/lib/nameDateLayout";

// Monospace-ish model: each character is 0.6 em wide.
const measure: MeasureText = (text, px) => text.length * px * 0.6;

function fits(lines: StripLine[], boxW: number, boxH: number) {
  const height = lines.reduce((sum, l) => sum + l.fontPx * STRIP_LINE_HEIGHT, 0);
  return lines.every((l) => measure(l.text, l.fontPx) <= boxW) && height <= boxH + 1e-9;
}
const texts = (lines: StripLine[]) => lines.map((l) => l.text);

describe("layoutStripText", () => {
  it("keeps the preset font when the text already fits (no visual change)", () => {
    const l = layoutStripText("RAVI KUMAR", "01/01/2026", measure, 500, 80, 30);
    expect(l.lines).toEqual([
      { text: "RAVI KUMAR", fontPx: 30 },
      { text: "01/01/2026", fontPx: 30 },
    ]);
    expect(l.legible).toBe(true);
  });

  it("wraps a long name at a word boundary instead of clipping it (TNPSC 130 px)", () => {
    const name = "VENKATARAMAN SUBRAMANIAN KRISHNAMURTHY";
    const boxW = 130 * 0.95;
    const boxH = 26 * 0.8;
    const l = layoutStripText(name, "01/01/2026", measure, boxW, boxH, 8);
    expect(texts(l.lines).join(" ")).toBe(`${name} 01/01/2026`); // nothing lost
    expect(fits(l.lines, boxW, boxH)).toBe(true);
  });

  it("every returned layout fits its box, whatever the input", () => {
    for (const name of ["A", "TEST USER", "A".repeat(40), "AB CD EF GH IJ KL MN OP QR ST"]) {
      for (const boxW of [60, 123.5, 400]) {
        const l = layoutStripText(name, "31/12/2026", measure, boxW, 30, 20);
        expect(fits(l.lines, boxW, 30)).toBe(true);
      }
    }
  });

  it("an over-long name shrinks only itself — the date stays legible", () => {
    const l = layoutStripText("A".repeat(40), "01/01/2026", measure, 100, 40, 12);
    const [nameLine, dateLine] = l.lines;
    expect(nameLine!.fontPx).toBeLessThan(MIN_LEGIBLE_FONT_PX);
    expect(dateLine!.fontPx).toBeGreaterThanOrEqual(MIN_LEGIBLE_FONT_PX);
    expect(l.legible).toBe(false); // the UI warns
  });

  it("handles a missing name or date, and both empty", () => {
    expect(texts(layoutStripText("", "01/01/2026", measure, 300, 60, 20).lines)).toEqual(["01/01/2026"]);
    expect(texts(layoutStripText("TEST USER", "", measure, 300, 60, 20).lines)).toEqual(["TEST USER"]);
    expect(layoutStripText("  ", " ", measure, 300, 60, 20)).toEqual({ lines: [], legible: true });
  });
});
