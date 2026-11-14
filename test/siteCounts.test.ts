/**
 * A count printed beside a link must match what the link opens.
 *
 * Until 14 Nov 2026 the homepage and /about/ printed registry sizes ("52 exams
 * & forms", "26 countries") while the hubs they linked to listed 11 forms and
 * 9 countries; the rest had been retired or hidden as thin. On the old code
 * SITE_COUNTS had no examPages / countryPages and these assertions fail.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SITE_COUNTS } from "@/components/site/siteCounts";
import { isDeindexed } from "@/lib/deindexed";
import { hubCountries } from "@/lib/makerPages";
import { examPagePath, listedPortalSpecs } from "@/lib/specRegistry";

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("site counts match the pages a visitor can open", () => {
  it("counts exam forms that have their own page", () => {
    expect(SITE_COUNTS.examPages).toBe(listedPortalSpecs().length);
  });

  it("only says every exam page is source-checked while that is true", () => {
    // The homepage card says "Each page links the authority's own notice and
    // gives the date it was checked". If a listed page loses its official
    // check, that sentence has to change with it.
    expect(SITE_COUNTS.examPagesWithOfficialDate).toBe(SITE_COUNTS.examPages);
  });

  it("counts countries and regions the makers offer", () => {
    const paths = new Set(
      [...hubCountries("passport"), ...hubCountries("visa")].map((c) => c.path),
    );
    expect(SITE_COUNTS.countryPages).toBe(paths.size);
    for (const p of paths) expect(isDeindexed(p), `${p} is hidden`).toBe(false);
  });

  it("keeps the Exam Kit's wider count inside the Exam Kit", () => {
    // The kit and checker offer more exams than have pages. That number may
    // appear only where it describes the kit.
    for (const file of [
      "components/site/StatsBand.tsx",
      "components/site/ChoosePath.tsx",
      "app/about/page.tsx",
    ]) {
      expect(read(file), file).not.toMatch(/examKitForms/);
    }
  });
});

describe("tools never send a visitor to a hidden or retired exam page", () => {
  it("gives a page path only for a listed exam", () => {
    expect(examPagePath("ssc")).toBe("/exam-requirements/ssc/");
    // Retired on 2 Nov 2026 (301 to the hub) but still offered in the checker.
    expect(examPagePath("army-agniveer")).toBeNull();
    // Hidden since Aug 2026, retired 14 Nov 2026.
    expect(examPagePath("bpsc")).toBeNull();
  });

  it("builds every exam link in client tools through the listed-page rule", () => {
    for (const file of [
      "components/tools/ComplianceCheckerTool.tsx",
      "components/tools/KbExamLinks.tsx",
      "components/site/RecentTools.tsx",
    ]) {
      const src = read(file);
      const usesRule = /examPagePath|listedPortalSpecs/.test(src);
      expect(usesRule, `${file} links exam pages without the listed-page rule`).toBe(true);
      expect(src, file).not.toMatch(/\/exam-requirements\/\$\{(spec\.id|id)\}/);
    }
  });

  it("does not link hidden tools from indexed tools", () => {
    expect(read("components/tools/FaceCenteringTool.tsx")).not.toMatch(
      /\/tools\/(image-crop|auto-crop)\//,
    );
    expect(read("components/tools/DpiConverterTool.tsx")).not.toMatch(
      /\/tools\/format-converter\//,
    );
  });
});
