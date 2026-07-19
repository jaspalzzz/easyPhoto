import { describe, expect, it } from "vitest";
import { displayFileFormatBundle } from "@/lib/fileFormats";

describe("Exam Kit format receipt", () => {
  it("does not present JPG and JPEG as different formats", () => {
    expect(displayFileFormatBundle(["jpg", "jpeg"])).toBe("JPG");
  });

  it("keeps genuinely different formats visible", () => {
    expect(displayFileFormatBundle(["jpg", "png"])).toBe("JPG + PNG");
  });
});
