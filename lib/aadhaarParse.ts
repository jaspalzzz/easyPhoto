/**
 * Parse Aadhaar fields from raw OCR text (pure, no DOM).
 * ------------------------------------------------------
 * Aadhaar cards interleave Hindi and English. With eng+hin recognition the
 * Hindi lines come through as Devanagari (not ASCII garbage), so a Latin-only
 * name filter cleanly skips them. Every extracted number is checksum-validated
 * (see {@link isValidAadhaar}) so a stray 12-digit run is never reported as an
 * Aadhaar. Unit-tested against representative OCR dumps.
 */

import {
  isValidAadhaar,
  isValidVid,
  formatAadhaar,
} from "./idValidation";

export interface AadhaarFields {
  /** 12-digit number formatted "#### #### ####", or "" if none found. */
  aadhaarNumber: string;
  /** True when the number passed the Verhoeff + prefix checks. */
  aadhaarValid: boolean;
  /** Masked number (e.g. "XXXX XXXX 1234") when only the last 4 are printed. */
  aadhaarMasked: string;
  /** 16-digit VID, formatted in groups of 4, or "". */
  vid: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
}

const NAME_SKIP =
  /aadhaar|government|india|unique|identification|authority|\bdob\b|date|birth|year|male|female|transgender|address|help|enrol|vid|govt|proof|citizenship/i;

/** Latin proper-name shape: starts with a letter, only name-safe characters. */
const NAME_SHAPE = /^[A-Za-z][A-Za-z\s.'-]*$/;

/**
 * Pull every maximal digit-run (spaces allowed inside) and slide validity
 * windows over it. Returns the first window for which `validate` passes.
 */
function findValidNumber(
  text: string,
  windowLen: number,
  validate: (digits: string) => boolean
): string {
  const groups = text.match(/[0-9][0-9\s]{6,}[0-9]/g) ?? [];
  for (const g of groups) {
    const digits = g.replace(/\D/g, "");
    for (let i = 0; i + windowLen <= digits.length; i++) {
      const candidate = digits.slice(i, i + windowLen);
      if (validate(candidate)) return candidate;
    }
  }
  return "";
}

export function parseAadhaarFields(raw: string): AadhaarFields {
  const text = raw.replace(/\r/g, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // VID is 16 digits; resolve it first so its trailing 12 digits can't be
  // mistaken for an Aadhaar.
  const vidDigits = findValidNumber(text, 16, isValidVid);
  const vid = vidDigits ? formatAadhaar(vidDigits) : "";

  // Aadhaar: first checksum-valid 12-digit window not inside the VID.
  const textWithoutVid = vidDigits ? text.replace(new RegExp(vidDigits.replace(/(\d{4})(?=\d)/g, "$1\\s?"), "g"), " ") : text;
  const aadhaarDigits = findValidNumber(textWithoutVid, 12, isValidAadhaar);
  const aadhaarNumber = aadhaarDigits ? formatAadhaar(aadhaarDigits) : "";
  const aadhaarValid = aadhaarDigits !== "";

  // Masked card: only last 4 digits printed (e.g. "XXXX XXXX 1234").
  let aadhaarMasked = "";
  if (!aadhaarNumber) {
    const m = text.match(/[X*x]{4}\s*[X*x]{4}\s*(\d{4})/);
    if (m) aadhaarMasked = `XXXX XXXX ${m[1]}`;
  }

  // DOB: DD/MM/YYYY (any separator) or a bare "Year of Birth: YYYY".
  const dobMatch =
    text.match(/\b(\d{2})[\/\-.\s](\d{2})[\/\-.\s](\d{4})\b/) ||
    text.match(/Year\s*of\s*Birth\s*[:\-]?\s*(\d{4})/i);
  let dob = "";
  if (dobMatch) {
    dob = dobMatch.length === 4 ? `${dobMatch[1]}/${dobMatch[2]}/${dobMatch[3]}` : dobMatch[1];
  }

  // Gender: English or Hindi (पुरुष = male, महिला = female).
  let gender = "";
  if (/\b(female)\b/i.test(text) || /महिला|स्त्री/.test(text)) gender = "Female";
  else if (/\b(male)\b/i.test(text) || /पुरुष/.test(text)) gender = "Male";
  else if (/\btransgender\b/i.test(text) || /ट्रांसजेंडर/.test(text)) gender = "Transgender";

  // Name: the English line nearest above the DOB that looks like a real name.
  const dobLineIdx = lines.findIndex((l) => dob && l.includes(dob.split("/")[0]) && /\d{4}/.test(l));
  const isNameLine = (l: string) =>
    l.length > 2 && l.length < 48 && !/\d/.test(l) && !NAME_SKIP.test(l) && NAME_SHAPE.test(l);
  let name = "";
  if (dobLineIdx > 0) {
    for (let i = dobLineIdx - 1; i >= 0; i--) {
      if (isNameLine(lines[i])) { name = lines[i]; break; }
    }
  }
  if (!name) name = lines.find(isNameLine) ?? "";

  // Address: the "Address"/relation label line plus the next few lines.
  const addrIdx = lines.findIndex((l) =>
    /\b(address|s\/o|w\/o|d\/o|c\/o|house|flat|village|po:|dist|pin)\b/i.test(l)
  );
  const address =
    addrIdx >= 0 ? lines.slice(addrIdx, addrIdx + 4).join(", ").replace(/\s*,\s*/g, ", ") : "";

  return { aadhaarNumber, aadhaarValid, aadhaarMasked, vid, name, dob, gender, address };
}
