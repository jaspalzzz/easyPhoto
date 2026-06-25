import { describe, it, expect } from "vitest";
import { parseAadhaarFields } from "@/lib/aadhaarParse";
import { parsePanFields } from "@/lib/panParse";
import { verhoeffCheckDigit, formatAadhaar } from "@/lib/idValidation";

// A genuinely checksum-valid Aadhaar used across the parser tests.
const AADHAAR = "23412345123" + String(verhoeffCheckDigit("23412345123"));
const AADHAAR_SPACED = formatAadhaar(AADHAAR);

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
});
