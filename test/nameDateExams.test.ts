/**
 * "Which exams need a photo with name and date?" on /tools/photo-with-name-date/:
 * every answer is tied to an official record, and the lists stay in step with
 * the exams the tool offers.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PHOTO_NAME_DATE_FAQ } from "@/lib/faqs";
import { noStripExams, slateExams, stripExams } from "@/lib/nameDateExams";
import { NAME_DATE_PRESETS } from "@/lib/nameDatePresets";
import { PORTAL_PRESETS, type PortalSpec } from "@/lib/portalPresets";
import { allPortalSpecs, formatIsoDate } from "@/lib/specRegistry";

const page = fs.readFileSync(path.join("app", "tools", "photo-with-name-date", "page.tsx"), "utf8");

describe("which exams need a photo with name and date", () => {
  it("lists exactly the exams the tool has presets for", () => {
    expect(stripExams().map((r) => r.id).sort()).toEqual(NAME_DATE_PRESETS.map((p) => p.specId).sort());
    expect(stripExams().map((r) => r.id)).toEqual(expect.arrayContaining(["tnpsc", "appsc", "kerala-psc"]));
  });

  it("gives TNPSC's published layout and its date rule", () => {
    const tnpsc = stripExams().find((r) => r.id === "tnpsc")!;
    expect(tnpsc.rule).toContain("in the bottom 55 px of a 130×170 px photo");
    expect(tnpsc.rule).toContain("on or after the date of the notification");
  });

  it("lists every slate exam and says the tool can't add a slate", () => {
    const slate = allPortalSpecs().filter((s) => s.requiresSlateNameDate).map((s) => s.id).sort();
    expect(slateExams().map((r) => r.id).sort()).toEqual(slate);
    for (const r of slateExams()) expect(r.rule).toContain("This tool can't add a slate.");
  });

  it("answers SSC, UPSC, IBPS and NEET with no strip", () => {
    expect(noStripExams().map((r) => r.id)).toEqual(["ssc", "upsc", "ibps", "nta"]);
    for (const r of noStripExams()) {
      expect(PORTAL_PRESETS[r.id].requiresNameDate, `${r.id} is flagged as needing a strip`).not.toBe(true);
      expect(PORTAL_PRESETS[r.id].requiresSlateNameDate).not.toBe(true);
    }
  });

  it("shows each answer's official source and the date it was checked", () => {
    for (const r of [...stripExams(), ...slateExams(), ...noStripExams()]) {
      const spec = PORTAL_PRESETS[r.id];
      expect(spec.verification, r.id).toBe("official");
      expect(r.sourceUrl).toBe(spec.source!.url);
      expect(r.checked).toBe(formatIsoDate(spec.verifiedOn!));
    }
  });

  it("refuses an answer without an official source", () => {
    const unsourced: PortalSpec = { ...PORTAL_PRESETS.tnpsc, id: "test-unsourced", source: undefined };
    expect(() => stripExams([unsourced])).toThrow(/official source/);
  });
});

describe("the name and date page", () => {
  it("is titled in searchers' words", () => {
    expect(page).toContain('title: "Photo with Name and Date — Add to Passport Size Photo Online"');
  });

  it("renders the section from the registry, not hand-copied lists", () => {
    expect(page).toContain("Which exams need a photo with name and date (2026)?");
    expect(page).toMatch(/stripExams\(\)[\s\S]*slateExams\(\)[\s\S]*noStripExams\(\)/);
  });

  it("does not repeat the section's exam answers in its FAQ", () => {
    for (const f of PHOTO_NAME_DATE_FAQ) {
      expect(f.q + f.a, f.q).not.toMatch(/\b(UPSC|SSC|IBPS|APPSC|Kerala PSC|TNPSC|Agniveer)\b/);
    }
  });
});
