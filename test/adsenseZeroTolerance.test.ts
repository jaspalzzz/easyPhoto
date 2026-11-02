/**
 * Zero tolerance for what AdSense reviewers count as "low value content"
 * (rejected again 1 Nov 2026). Two guarantees the quality gate does not
 * already cover:
 *
 * 1. Every indexed country maker shows visitor-facing "Good to know" copy.
 *    Without an entry the page falls back to `spec.notes`, the internal
 *    record ("⚠ SCOPE … we have NOT found …"), which reads as unreviewed text.
 * 2. A page taken out of the search index never loads the ad script. An ad
 *    request is how Google's ad crawler finds a page, so a hidden page must
 *    never make one.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isAdSenseExcludedPath } from "@/lib/adExclusions";
import { DEINDEXED_PATHS, isDeindexed } from "@/lib/deindexed";
import { MAKER_PAGES, makerSpec } from "@/lib/makerPages";
import { getMakerContent } from "@/lib/makerContent";

const makerSource = fs.readFileSync(path.join(process.cwd(), "app/[maker]/page.tsx"), "utf8");
const goodToKnow = makerSource.slice(
  makerSource.indexOf("const GOOD_TO_KNOW"),
  makerSource.indexOf("\n};", makerSource.indexOf("const GOOD_TO_KNOW"))
);

describe("AdSense zero tolerance", () => {
  it("gives every indexed maker visitor-facing copy of its own, never the developer notes", () => {
    // Good to know is optional since 2 Nov 2026: where it only repeated the
    // body it was cut (one fact once per page). What must never return is the
    // old `?? spec.notes` fallback, which printed developer documentation.
    expect(makerSource).not.toMatch(/GOOD_TO_KNOW\[spec\.id\]\s*\?\?\s*spec\.notes/);
    const missing = MAKER_PAGES.filter((m) => !isDeindexed(`/${m.slug}/`))
      .filter((m) => {
        const id = makerSpec(m.slug)!.id;
        return !new RegExp(`(^|\\n)\\s*"?${id}"?:`).test(goodToKnow) && !getMakerContent(m.slug)?.intro;
      })
      .map((m) => m.slug);
    expect(missing).toEqual([]);
  });

  it("never lets a page hidden from search request ads", () => {
    expect(DEINDEXED_PATHS.filter((p) => !isAdSenseExcludedPath(p))).toEqual([]);
  });
});
