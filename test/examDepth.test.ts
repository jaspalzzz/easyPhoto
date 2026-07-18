import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(
  path.join(process.cwd(), "app/exam-requirements/[exam]/page.tsx"),
  "utf8"
);

describe("high-demand exam depth", () => {
  it("keeps Army Agniveer guidance honest about unpublished upload figures", () => {
    const block = pageSource.match(
      /\{exam === "army-agniveer"[\s\S]*?\{\/\* Common rejection reasons/
    )?.[0];

    expect(block).toBeTruthy();
    expect(block).toContain("does not publish a photo or");
    expect(block).toContain("figures shown in this compatibility tool therefore remain");
    expect(block).toContain("follow the live portal rather than forcing the file");
    expect(block).toContain('href="/tools/exam-package/"');
    expect(block).toContain(
      'href="/blog/how-to-prepare-documents-for-exam-applications-india/"'
    );
    expect(block).not.toMatch(/\b(?:130|170|200|230|413|531)\s*(?:px|KB)\b/i);
  });

  it("keeps contextual guide links on the two already-rich workflow pages", () => {
    expect(pageSource).toContain('href="/blog/driving-licence-photo-size-sarathi/"');
    expect(pageSource).toContain(
      'href="/blog/how-to-prepare-documents-for-exam-applications-india/"'
    );
  });
});
