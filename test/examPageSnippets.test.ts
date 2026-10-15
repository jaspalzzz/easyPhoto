/**
 * Exam pages in searchers' words (owner-approved 15 Oct 2026). Each wording
 * names only what the page's official sources cover.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EXAM_GUIDES } from "@/components/site/exam";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { examPageLastModified } from "@/lib/examPageDates";

const template = fs.readFileSync(path.join("app", "exam-requirements", "[exam]", "page.tsx"), "utf8");
const sscGuide = fs.readFileSync(path.join("components", "site", "exam", "SscGuide.tsx"), "utf8");

describe("SSC description", () => {
  it("names only exams whose 2026 notices the page cites", () => {
    const meta = EXAM_GUIDES.ssc.metaDescription!;
    for (const exam of ["CGL", "CHSL", "CPO", "GD", "JE", "Steno"]) {
      expect(meta).toContain(exam);
      expect(sscGuide).toContain(exam);
    }
    expect(meta).not.toMatch(/\bMTS\b/);
  });
});

describe("UPSC description", () => {
  it("names the 75% face rule and the three-signature image", () => {
    const meta = EXAM_GUIDES.upsc.metaDescription!;
    expect(meta).toContain("at least 75%");
    expect(meta).toContain("signed three times");
    expect(meta).toContain(`${PORTAL_PRESETS.upsc.photoMinKb}–${PORTAL_PRESETS.upsc.photoLimitKb} KB`);
  });
});

describe("Air Force Agniveer", () => {
  it("is titled the way people search, with the notice's KB band and slate rule", () => {
    expect(template).toContain('"airforce-agniveer": "Air Force Agniveer Vayu Photo Size 2026 (100–200 KB) — easyPhoto"');
    expect(template).toMatch(/Air Force Agniveer Vayu photo: [\s\S]*black slate[\s\S]*white chalk/);
    const spec = PORTAL_PRESETS["airforce-agniveer"];
    expect([spec.photoMinKb, spec.photoLimitKb]).toEqual([100, 200]);
    expect(spec.requiresSlateNameDate).toBe(true);
  });
});

describe("Voter ID", () => {
  it("has 'resizer' in its H1", () => {
    expect(template).toContain('"voter-id": "Voter ID Photo Resizer & Size (ECI Form 6)"');
  });
});

describe("dates", () => {
  it("move for the four changed pages", () => {
    for (const id of ["ssc", "upsc", "voter-id", "airforce-agniveer"]) {
      expect(examPageLastModified(id)).toBe("2026-10-15");
    }
  });
});
