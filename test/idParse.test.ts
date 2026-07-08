import { describe, it, expect } from "vitest";
import { parseAadhaarFields } from "@/lib/aadhaarParse";
import { parsePanFields } from "@/lib/panParse";
import { verhoeffCheckDigit, formatAadhaar } from "@/lib/idValidation";

// A genuinely checksum-valid Aadhaar used across the parser tests.
const AADHAAR = "23412345123" + String(verhoeffCheckDigit("23412345123"));
const AADHAAR_SPACED = formatAadhaar(AADHAAR);

// A genuinely checksum-valid 16-digit VID (15 digits + Verhoeff check digit).
const VID = "888811110000222" + String(verhoeffCheckDigit("888811110000222"));
const VID_SPACED = formatAadhaar(VID);

describe("parseAadhaarFields", () => {
  it("extracts a checksum-valid Aadhaar number from a realistic OCR dump", () => {
    // Mimics eng+hin output: Hindi name line first, English next, then number.
    const raw = [
      "Government of India",
      "जसपाल कुमार",
      "Jaspal Kumar",
      "जन्म तिथि/DOB: 02/11/1989",
      "पुरुष/ MALE",
      AADHAAR_SPACED,
    ].join("\n");

    const f = parseAadhaarFields(raw);
    expect(f.aadhaarNumber).toBe(AADHAAR_SPACED);
    expect(f.aadhaarValid).toBe(true);
    expect(f.name).toBe("Jaspal Kumar");
    expect(f.dob).toBe("02/11/1989");
    expect(f.gender).toBe("Male");
  });

  it("never picks the garbled Hindi line as the name", () => {
    // The exact failure the user hit: English-only OCR turned Hindi into junk.
    const raw = ["-r = Po", "Jaspal Kumar", "DOB: 02/11/1989", "MALE", AADHAAR_SPACED].join("\n");
    const f = parseAadhaarFields(raw);
    expect(f.name).toBe("Jaspal Kumar");
  });

  it("does not report an invalid 12-digit run as an Aadhaar", () => {
    const raw = ["Some Name", "0000 0000 0000", "MALE"].join("\n");
    const f = parseAadhaarFields(raw);
    expect(f.aadhaarValid).toBe(false);
    expect(f.aadhaarNumber).toBe("");
  });

  it("detects a masked Aadhaar when only the last 4 digits are printed", () => {
    const raw = ["Jaspal Kumar", "XXXX XXXX 5129", "MALE"].join("\n");
    const f = parseAadhaarFields(raw);
    expect(f.aadhaarMasked).toBe("XXXX XXXX 5129");
    expect(f.aadhaarNumber).toBe("");
  });

  it("reads Hindi gender markers", () => {
    expect(parseAadhaarFields("कोई नाम\nमहिला\n" + AADHAAR_SPACED).gender).toBe("Female");
    expect(parseAadhaarFields("कोई नाम\nपुरुष\n" + AADHAAR_SPACED).gender).toBe("Male");
  });

  it("handles 'Year of Birth' cards", () => {
    const f = parseAadhaarFields(["Ramesh Singh", "Year of Birth: 1985", "MALE", AADHAAR_SPACED].join("\n"));
    expect(f.dob).toBe("1985");
  });

  it("does not mistake the 'Aadhaar issued' date for the date of birth", () => {
    const raw = [
      "Government of India",
      "Aadhaar no. issued: 28/12/2011",
      "Jaspal Kumar",
      "जन्म तिथि/DOB: 02/11/1989",
      "पुरुष/ MALE",
      AADHAAR_SPACED,
    ].join("\n");
    expect(parseAadhaarFields(raw).dob).toBe("02/11/1989");
  });

  it("reports no DOB rather than the issue date when the real DOB is unreadable", () => {
    const raw = [
      "Government of India",
      "Aadhaar no. issued: 28/12/2011",
      "Jaspal Kumar",
      "पुरुष/ MALE",
      AADHAAR_SPACED,
    ].join("\n");
    expect(parseAadhaarFields(raw).dob).toBe("");
  });

  it("ignores an unlabelled 16-digit run instead of reporting a phantom VID", () => {
    const raw = ["Jaspal Kumar", VID_SPACED, "MALE"].join("\n");
    expect(parseAadhaarFields(raw).vid).toBe("");
  });

  it("reports the VID when the card actually labels one", () => {
    const raw = ["Jaspal Kumar", `VID: ${VID_SPACED}`, "MALE"].join("\n");
    expect(parseAadhaarFields(raw).vid).toBe(VID_SPACED);
  });

  it("prefers the printed 4-4-4 grouped number over a checksum-lucky window in junk", () => {
    // Rotated numeric passes add junk digit runs; ~1 in 10 random 12-digit
    // windows passes Verhoeff. A junk run containing such a window must not
    // beat the real number printed in the official grouping — even when the
    // junk appears FIRST in the text.
    const junkValid = "99887766554" + String(verhoeffCheckDigit("99887766554"));
    const junkRun = `7${junkValid}9`; // 14-digit run; valid window inside
    const raw = ["Jaspal Kumar", junkRun, "MALE", AADHAAR_SPACED].join("\n");
    const f = parseAadhaarFields(raw);
    expect(f.aadhaarNumber).toBe(AADHAAR_SPACED);
  });

  it("never fuses digit runs across line breaks (real rotated-pass fixture)", () => {
    // Verbatim numeric-pass output captured from a live rotated-pass run: the
    // true number sits cleanly on its own line, surrounded by junk digit
    // lines. Joining runs across newlines used to create a 25-digit mega-run
    // whose sliding window "895081090802" happened to pass Verhoeff and beat
    // the real number.
    const numeric =
      "506 0 108\n\n95081\n\n0908 027111989\n\n81\n2341 2345 1235\n6  1\n\n2";
    const raw = "Jaspal Kumar\nDOB: 02/11/1989\nMALE";
    const f = parseAadhaarFields(raw, numeric);
    expect(f.aadhaarNumber).toBe("2341 2345 1235");
  });
});

describe("parsePanFields", () => {
  it("extracts a valid PAN and labelled fields", () => {
    const raw = [
      "INCOME TAX DEPARTMENT",
      "GOVT. OF INDIA",
      "Permanent Account Number",
      "ABCPE1234F",
      "Name",
      "SACHIN KUMAR",
      "Father's Name",
      "RAMESH KUMAR",
      "Date of Birth",
      "15/08/1990",
    ].join("\n");

    const f = parsePanFields(raw);
    expect(f.panNumber).toBe("ABCPE1234F");
    expect(f.panValid).toBe(true);
    expect(f.panEntity).toBe("Individual");
    expect(f.name).toBe("SACHIN KUMAR");
    expect(f.fathersName).toBe("RAMESH KUMAR");
    expect(f.dob).toBe("15/08/1990");
  });

  it("repairs OCR letter/digit confusion in the PAN", () => {
    // O for 0 in the digit zone, and a digit where a letter belongs.
    const raw = "Permanent Account Number\nABCPE1Z34F".replace("1Z34", "I234");
    const f = parsePanFields(raw);
    expect(f.panNumber).toBe("ABCPE1234F");
    expect(f.panValid).toBe(true);
  });

  it("falls back to structural name detection without labels", () => {
    const raw = ["AAACI1234Q", "SACHIN KUMAR", "RAMESH KUMAR", "15/08/1990"].join("\n");
    const f = parsePanFields(raw);
    expect(f.name).toBe("SACHIN KUMAR");
    expect(f.fathersName).toBe("RAMESH KUMAR");
  });

  it("never reports garbled header fragments as names (fallback is anchored below the header)", () => {
    // The user-reported failure: a weak read shredded "INCOME TAX DEPARTMENT"
    // into fragments that the old label-less fallback picked as names.
    const raw = [
      "WCOME TAX DEP",
      "AX DER",
      "ARTMENT",
      "Permanent Account Number Card",
      "CNEPT0762R",
      "TASHU",
      "MAKHAN LAL",
      "09/10/2002",
    ].join("\n");
    const f = parsePanFields(raw);
    expect(f.panNumber).toBe("CNEPT0762R");
    expect(f.name).toBe("TASHU");
    expect(f.fathersName).toBe("MAKHAN LAL");
  });

  it("reads bilingual 'नाम / Name' and 'पिता का नाम / Father's Name' labels", () => {
    // The exact real-card layout that broke the old "^name" anchor and made
    // the parser grab header fragments instead of the printed names.
    const raw = [
      "आयकर विभाग / INCOME TAX DEPARTMENT",
      "भारत सरकार / GOVT. OF INDIA",
      "स्थायी लेखा संख्या कार्ड / Permanent Account Number Card",
      "CNEPT0762R",
      "नाम / Name",
      "TASHU",
      "पिता का नाम / Father's Name",
      "MAKHAN LAL",
      "जन्म की तारीख / Date of Birth",
      "09/10/2002",
    ].join("\n");
    const f = parsePanFields(raw);
    expect(f.panNumber).toBe("CNEPT0762R");
    expect(f.name).toBe("TASHU");
    expect(f.fathersName).toBe("MAKHAN LAL");
    expect(f.dob).toBe("09/10/2002");
  });

  it("does not fill father's name with repeated OCR fragments from a weak bilingual read", () => {
    const raw = [
      "नाम / Name",
      "TASHU",
      "पिता का नाम / Father's Name",
      "wir SE SE",
      "जन्म की तारीख / Date of Birth",
      "09/10/2002",
    ].join("\n");

    const f = parsePanFields(raw);
    expect(f.name).toBe("TASHU");
    expect(f.fathersName).toBe("");
    expect(f.dob).toBe("09/10/2002");
  });
});
