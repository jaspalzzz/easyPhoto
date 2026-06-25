/**
 * Government-ID checksum & format validation (pure, no DOM).
 * ----------------------------------------------------------
 * Used to confirm that a candidate string extracted by OCR is a *real*
 * Aadhaar / VID / PAN rather than an incidental number that happens to match
 * the shape. Validation is what separates a guess from a verified field — the
 * Verhoeff check digit alone rejects the overwhelming majority of OCR false
 * positives (random 12-digit runs, phone numbers, PIN codes).
 *
 * Nothing here touches the network or the DOM; it is unit-tested in isolation.
 */

// --- Verhoeff algorithm (used by UIDAI for Aadhaar & VID check digits) -------
// Tables are the canonical dihedral-group D5 multiplication table, the
// permutation table, and the multiplicative-inverse table. See
// https://en.wikipedia.org/wiki/Verhoeff_algorithm

const D_TABLE: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const P_TABLE: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const INV_TABLE: readonly number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Verhoeff checksum of a digit string. A valid number (with its check digit
 * included) has a checksum of 0. Returns -1 if the input has non-digit chars.
 */
function verhoeffChecksum(digits: string): number {
  if (!/^\d+$/.test(digits)) return -1;
  let c = 0;
  const reversed = digits.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = D_TABLE[c][P_TABLE[i % 8][Number(reversed[i])]];
  }
  return c;
}

/** True if the digit string (check digit included) passes the Verhoeff check. */
export function isVerhoeffValid(digits: string): boolean {
  return verhoeffChecksum(digits) === 0;
}

/**
 * Compute the Verhoeff check digit that should be appended to `digits` to make
 * it valid. Appending a placeholder "0" aligns the positional indices.
 */
export function verhoeffCheckDigit(digits: string): number {
  return INV_TABLE[verhoeffChecksum(`${digits}0`)];
}

// --- Aadhaar / VID -----------------------------------------------------------

/**
 * A genuine Aadhaar is 12 digits, never starts with 0 or 1, and the 12th digit
 * is a Verhoeff check over the first 11. We validate all three so an arbitrary
 * 12-digit OCR run isn't mistaken for an Aadhaar.
 */
export function isValidAadhaar(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 12) return false;
  if (/^[01]/.test(digits)) return false;
  return isVerhoeffValid(digits);
}

/** VID is a 16-digit Verhoeff-checked virtual ID printed in 4 groups of 4. */
export function isValidVid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 16) return false;
  return isVerhoeffValid(digits);
}

/** Format 12 digits as the printed "#### #### ####" grouping. */
export function formatAadhaar(digits: string): string {
  const d = digits.replace(/\D/g, "");
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

// --- PAN ---------------------------------------------------------------------

/** PAN holder-type codes (4th character). */
const PAN_ENTITY_TYPES: Record<string, string> = {
  P: "Individual",
  C: "Company",
  H: "Hindu Undivided Family",
  F: "Firm / LLP",
  A: "Association of Persons",
  T: "Trust",
  B: "Body of Individuals",
  L: "Local Authority",
  J: "Artificial Juridical Person",
  G: "Government",
};

/** Loose PAN shape: 5 letters, 4 digits, 1 letter. */
export const PAN_REGEX = /\b([A-Z]{5}[0-9]{4}[A-Z])\b/;

/**
 * A PAN is structurally valid if it matches AAAAA9999A and its 4th character is
 * a known holder-type code. The 10th char is an opaque check char (algorithm
 * not public) so we only confirm it is a letter.
 */
export function isValidPan(value: string): boolean {
  const pan = value.toUpperCase().trim();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return false;
  return pan[3] in PAN_ENTITY_TYPES;
}

/** Human-readable holder type for a PAN's 4th character, or "" if unknown. */
export function panEntityType(value: string): string {
  const pan = value.toUpperCase().trim();
  if (pan.length < 4) return "";
  return PAN_ENTITY_TYPES[pan[3]] ?? "";
}
