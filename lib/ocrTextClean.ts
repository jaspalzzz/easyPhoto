/**
 * Post-processing for raw Tesseract output.
 *
 * Tesseract produces artefacts on real photos: border fragments, stray
 * brackets/pipes from table rules, multi-space runs, and empty lines.
 * This layer makes the text readable without touching the parser input
 * used by aadhaarParse / panParse (those parsers still receive raw text
 * so positional heuristics work correctly).
 */

const RE_NO_ALPHANUM = /^[^A-Za-z0-9]+$/;
const RE_BORDER = /^[-—–_=~•\.]{2,}$/;
const RE_STRAY_EDGE = /^[\|\/\\\[\]{}<>]+|[\|\/\\\[\]{}<>]+$/g;

/** Remove obvious OCR noise and normalise whitespace. */
export function cleanOcrText(raw: string): string {
  if (!raw) return raw;

  const lines = raw.split("\n").map((l) => {
    const line = l
      .trim()
      .replace(/  +/g, " ") // collapse internal multi-spaces
      .replace(RE_STRAY_EDGE, "") // strip stray leading/trailing brackets/pipes
      .trim();
    return line;
  });

  const filtered = lines.filter((line) => {
    if (!line) return true; // blanks handled in the run-collapse below

    // Lines with no alphanumeric content at all (pure punctuation / symbols)
    if (RE_NO_ALPHANUM.test(line)) return false;

    // Horizontal rule / border decoration (e.g. "———", "====")
    if (RE_BORDER.test(line)) return false;

    return true;
  });

  // Collapse runs of blank lines to at most one
  const result: string[] = [];
  let blanks = 0;
  for (const line of filtered) {
    if (!line) {
      blanks++;
      if (blanks <= 1) result.push("");
    } else {
      blanks = 0;
      result.push(line);
    }
  }

  return result.join("\n").trim();
}

/** Rough heuristic: does the OCR text look like a known ID card? */
export function detectIdCard(text: string): "aadhaar" | "pan" | null {
  const t = text.toLowerCase();
  if (
    t.includes("aadhaar") ||
    t.includes("uidai") ||
    t.includes("unique identification")
  )
    return "aadhaar";
  if (
    t.includes("income tax") ||
    t.includes("permanent account") ||
    // PAN format detected even if label was missed
    /\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(text)
  )
    return "pan";
  return null;
}
