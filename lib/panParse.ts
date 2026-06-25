/**
 * Parse PAN-card fields from raw OCR text (pure, no DOM).
 * ------------------------------------------------------
 * PAN has a fixed AAAAA9999A shape, which lets us safely repair the classic
 * OCR letter/digit confusions (O↔0, I↔1, S↔5, B↔8) per position before
 * matching, then validate the holder-type character. Name / Father's Name are
 * anchored on their printed labels with a structural fallback. Unit-tested.
 */

import { isValidPan, panEntityType } from "./idValidation";

export interface PanFields {
  panNumber: string;
  panValid: boolean;
  /** Holder type from the 4th char (e.g. "Individual"), or "". */
  panEntity: string;
  name: string;
  fathersName: string;
  dob: string;
}

const NAME_SKIP =
  /income\s*tax|government|india|govt|permanent|account|number|department|signature|date|birth|\bdob\b/i;

/**
 * Repair OCR confusions using PAN's fixed layout: positions 1–5 and 10 are
 * letters, 6–9 are digits. Map characters into the class their position demands.
 */
function repairPan(token: string): string {
  const toLetter: Record<string, string> = { "0": "O", "1": "I", "5": "S", "8": "B", "2": "Z", "6": "G" };
  const toDigit: Record<string, string> = { O: "0", I: "1", S: "5", B: "8", Z: "2", G: "6", D: "0" };
  const chars = token.toUpperCase().split("");
  if (chars.length !== 10) return token.toUpperCase();
  return chars
    .map((c, i) => {
      if (i < 5 || i === 9) return /[A-Z]/.test(c) ? c : toLetter[c] ?? c;
      return /[0-9]/.test(c) ? c : toDigit[c] ?? c;
    })
    .join("");
}

/** Find the best PAN candidate in the text, applying positional repair. */
function extractPan(raw: string): { pan: string; valid: boolean } {
  const upper = raw.toUpperCase();
  // Direct, strict match first.
  const direct = upper.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/);
  if (direct && isValidPan(direct[0])) return { pan: direct[0], valid: true };

  // Otherwise scan 10-char alphanumeric tokens and repair them.
  const tokens = upper.match(/[A-Z0-9]{10}/g) ?? [];
  for (const t of tokens) {
    const repaired = repairPan(t);
    if (isValidPan(repaired)) return { pan: repaired, valid: true };
  }
  // Last resort: report a loose match unvalidated so the user can correct it.
  if (direct) return { pan: direct[0], valid: false };
  return { pan: "", valid: false };
}

export function parsePanFields(raw: string): PanFields {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  const { pan, valid } = extractPan(raw);
  const panEntity = valid ? panEntityType(pan) : "";

  const dobMatch = raw.match(/\b(\d{2})[\/\-.\s](\d{2})[\/\-.\s](\d{4})\b/);
  const dob = dobMatch ? `${dobMatch[1]}/${dobMatch[2]}/${dobMatch[3]}` : "";

  // Label-anchored extraction: value on the next non-empty line after a label.
  const valueAfter = (labelRe: RegExp): string => {
    const idx = lines.findIndex((l) => labelRe.test(l));
    if (idx < 0) return "";
    // Some cards print "Name SACHIN" on one line; prefer inline, else next line.
    const inline = lines[idx].replace(labelRe, "").trim();
    if (inline && /[A-Za-z]/.test(inline) && !NAME_SKIP.test(inline)) return inline;
    return lines[idx + 1] ?? "";
  };

  let name = valueAfter(/^\s*name\b\s*:?-?\s*/i);
  let fathersName = valueAfter(/father'?s?\b.*name\s*:?-?\s*/i);

  // Structural fallback when labels weren't recognised: the two prominent
  // all-caps Latin lines that aren't headings are Name then Father's Name.
  if (!name || !fathersName) {
    const candidates = lines.filter(
      (l) => l.length > 2 && l.length < 48 && !/\d/.test(l) && !NAME_SKIP.test(l) && /^[A-Za-z][A-Za-z\s.'-]*$/.test(l)
    );
    if (!name) name = candidates[0] ?? "";
    if (!fathersName) fathersName = candidates.find((c) => c !== name) ?? "";
  }

  return { panNumber: pan, panValid: valid, panEntity, name, fathersName, dob };
}
