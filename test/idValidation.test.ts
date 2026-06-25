import { describe, it, expect } from "vitest";
import {
  isVerhoeffValid,
  verhoeffCheckDigit,
  isValidAadhaar,
  isValidVid,
  formatAadhaar,
  isValidPan,
  panEntityType,
} from "@/lib/idValidation";

describe("Verhoeff checksum", () => {
  // Independently verifiable anchors from the canonical Verhoeff worked example.
  it("computes the check digit for 236 as 3", () => {
    expect(verhoeffCheckDigit("236")).toBe(3);
  });

  it("validates 2363 (236 + check digit 3)", () => {
    expect(isVerhoeffValid("2363")).toBe(true);
  });

  it("rejects a number with a wrong check digit", () => {
    expect(isVerhoeffValid("2364")).toBe(false);
  });

  it("round-trips: appending the computed check digit yields a valid number", () => {
    for (const base of ["234123451", "98765432109", "55555555555"]) {
      const full = base + String(verhoeffCheckDigit(base));
      expect(isVerhoeffValid(full)).toBe(true);
    }
  });

  it("returns false for non-digit input", () => {
    expect(isVerhoeffValid("12A4")).toBe(false);
  });
});

describe("Aadhaar validation", () => {
  // Build a genuinely valid 12-digit Aadhaar from a fixed 11-digit prefix.
  const prefix11 = "23412345123";
  const validAadhaar = prefix11 + String(verhoeffCheckDigit(prefix11));

  it("accepts a checksum-valid 12-digit number", () => {
    expect(validAadhaar).toHaveLength(12);
    expect(isValidAadhaar(validAadhaar)).toBe(true);
  });

  it("accepts the same number with the printed group spacing", () => {
    expect(isValidAadhaar(formatAadhaar(validAadhaar))).toBe(true);
  });

  it("rejects numbers that start with 0 or 1", () => {
    expect(isValidAadhaar("0" + validAadhaar.slice(1))).toBe(false);
    expect(isValidAadhaar("1" + validAadhaar.slice(1))).toBe(false);
  });

  it("rejects wrong-length and checksum-failing numbers", () => {
    expect(isValidAadhaar("23412345")).toBe(false); // too short
    // Flip the real check digit to a different one → checksum must fail.
    const wrongCheck = String((Number(validAadhaar[11]) + 1) % 10);
    expect(isValidAadhaar(prefix11 + wrongCheck)).toBe(false);
  });
});

describe("VID validation", () => {
  const prefix15 = "912345678901234";
  const validVid = prefix15 + String(verhoeffCheckDigit(prefix15));

  it("accepts a checksum-valid 16-digit VID", () => {
    expect(validVid).toHaveLength(16);
    expect(isValidVid(validVid)).toBe(true);
  });

  it("rejects a 12-digit number as a VID", () => {
    expect(isValidVid("234123451234")).toBe(false);
  });
});

describe("formatAadhaar", () => {
  it("groups 12 digits into 4-4-4", () => {
    expect(formatAadhaar("234123451234")).toBe("2341 2345 1234");
  });
  it("strips existing spacing before regrouping", () => {
    expect(formatAadhaar("2341 2345 1234")).toBe("2341 2345 1234");
  });
});

describe("PAN validation", () => {
  it("accepts a well-formed individual PAN", () => {
    expect(isValidPan("ABCPE1234F")).toBe(true);
    expect(panEntityType("ABCPE1234F")).toBe("Individual");
  });

  it("accepts a company PAN", () => {
    expect(isValidPan("AAACI1234Q")).toBe(true);
    expect(panEntityType("AAACI1234Q")).toBe("Company");
  });

  it("rejects an unknown holder-type character (4th position)", () => {
    expect(isValidPan("ABCXE1234F")).toBe(false); // X is not a valid type
  });

  it("rejects malformed PANs", () => {
    expect(isValidPan("ABCDE12345")).toBe(false); // last char must be a letter
    expect(isValidPan("ABCP1234F")).toBe(false); // too short
    expect(isValidPan("12CPE1234F")).toBe(false); // first chars must be letters
  });

  it("is case-insensitive", () => {
    expect(isValidPan("abcpe1234f")).toBe(true);
  });
});
