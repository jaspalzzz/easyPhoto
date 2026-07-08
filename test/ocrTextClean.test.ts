import { describe, expect, it } from "vitest";
import { cleanOcrText } from "@/lib/ocrTextClean";

describe("cleanOcrText", () => {
  it("keeps Hindi text instead of treating Devanagari as OCR noise", () => {
    const raw = [
      "यहाँ एक प्रेरणादायक और लोकप्रिय हिंदी कहानी 'मेहनत का फल' दी गई है.",
      "",
      "एक बार की बात है, एक गाँव में राम नाम का एक गरीब किसान रहता था।",
    ].join("\n");

    expect(cleanOcrText(raw)).toContain("मेहनत का फल");
    expect(cleanOcrText(raw)).toContain("गरीब किसान");
  });

  it("still removes pure punctuation and border fragments", () => {
    const raw = ["====", "|", "Hello", "———"].join("\n");

    expect(cleanOcrText(raw)).toBe("Hello");
  });
});
