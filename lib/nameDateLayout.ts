/**
 * Text layout for the name/date strip printed under exam photos.
 *
 * The strip must show the WHOLE name: a clipped name is worse than a small one,
 * because the portal compares it with the application. The old renderer only
 * shrank each line down to 8 px and then drew it anyway, so on a narrow preset
 * (TNPSC is 130 px wide) any name over ~20 characters was cut off at both
 * edges. This picks the layout — the name on one line, or wrapped at a word
 * boundary — that allows the largest name font, and reports when even that is
 * below a legible size so the UI can warn instead of exporting silently.
 *
 * The date is sized on its own: an over-long name shrinks only the name, never
 * the date (a shared size turned the date into an unreadable smudge too).
 */

/** Width of `text` rendered at `fontPx` (bold sans-serif in the real canvas). */
export type MeasureText = (text: string, fontPx: number) => number;

export interface StripLine {
  text: string;
  fontPx: number;
}

export interface StripTextLayout {
  lines: StripLine[];
  /** False when the name or date only fits below the legible minimum. */
  legible: boolean;
}

/** Line box height as a multiple of the font size. */
export const STRIP_LINE_HEIGHT = 1.25;
/** Smallest font treated as readable on the printed/uploaded photo. */
export const MIN_LEGIBLE_FONT_PX = 8;

/** Split `text` at the word boundary that makes the longer half shortest. */
function balancedSplit(text: string, measure: MeasureText, refPx: number): [string, string] | null {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2) return null;
  let best: [string, string] | null = null;
  let bestWidth = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const widest = Math.max(measure(a, refPx), measure(b, refPx));
    if (widest < bestWidth) {
      bestWidth = widest;
      best = [a, b];
    }
  }
  return best;
}

/** Largest whole-pixel font (≤ cap, ≥ 1) at which every line fits `boxW`. */
function widthFittingFont(lines: string[], measure: MeasureText, boxW: number, cap: number): number {
  let px = Math.max(1, Math.floor(cap));
  while (px > 1 && lines.some((l) => measure(l, px) > boxW)) px--;
  return px;
}

/**
 * Lay out `name` (first) and `date` inside a boxW × boxH text area.
 * Empty fields are skipped. Returns no lines when both are empty.
 */
export function layoutStripText(
  name: string,
  date: string,
  measure: MeasureText,
  boxW: number,
  boxH: number,
  maxFontPx: number,
): StripTextLayout {
  const n = name.trim();
  const d = date.trim();
  if (!n && !d) return { lines: [], legible: true };

  const nameCandidates: string[][] = n ? [[n]] : [[]];
  const split = n ? balancedSplit(n, measure, maxFontPx) : null;
  if (split) nameCandidates.push(split);

  let best: StripTextLayout | null = null;
  let bestNamePx = -1;
  for (const nameLines of nameCandidates) {
    const rows = nameLines.length + (d ? 1 : 0);
    // Each row gets a fair share of the height; the date takes at most its share.
    const shareCap = Math.min(maxFontPx, boxH / (rows * STRIP_LINE_HEIGHT));
    const datePx = d ? widthFittingFont([d], measure, boxW, shareCap) : 0;
    const nameCap = nameLines.length
      ? Math.min(maxFontPx, (boxH - datePx * STRIP_LINE_HEIGHT) / (nameLines.length * STRIP_LINE_HEIGHT))
      : 0;
    const namePx = nameLines.length ? widthFittingFont(nameLines, measure, boxW, nameCap) : Infinity;

    // Prefer the bigger name font; on a tie keep the earlier (fewer-line) layout.
    if (namePx > bestNamePx) {
      bestNamePx = namePx;
      best = {
        lines: [
          ...nameLines.map((text) => ({ text, fontPx: namePx })),
          ...(d ? [{ text: d, fontPx: datePx }] : []),
        ],
        legible: namePx >= MIN_LEGIBLE_FONT_PX && (!d || datePx >= MIN_LEGIBLE_FONT_PX),
      };
    }
  }
  return best!;
}
