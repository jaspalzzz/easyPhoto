/** Document scanner and exam kit wording (owner-approved 15 Oct 2026). */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (slug: string) => fs.readFileSync(path.join("app", "tools", slug, "page.tsx"), "utf8");

describe("document scanner", () => {
  const page = read("document-scanner");
  it("uses the words people search: scan a photo or JPG into a scanned copy", () => {
    expect(page).toContain('title: "Scan Photo Online — JPG to Scanned Copy, PDF or JPG"');
    expect(page).toContain('title="Scan a Photo or JPG Online"');
    expect(page).toContain("Turn a photo into a scanned copy");
  });
});

describe("exam kit", () => {
  it("describes itself without internal words", () => {
    const description = read("exam-package").match(/description:\s*([\s\S]*?),\n\s*path:/)![1];
    expect(description).not.toMatch(/\b(stored|selected|preset|target)\b/i);
  });
});
