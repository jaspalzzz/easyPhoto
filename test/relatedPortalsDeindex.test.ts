/**
 * relatedPortals() must never point an indexed exam page at a deindexed one.
 *
 * Before this fix, every one of the 23 currently-indexed exam pages emitted
 * at least one related link to a noindexed sibling — 68 of 138 slots
 * site-wide (49%). State-PSC pages were worst: `uppsc` and `tgpsc` are the
 * only two of twelve state-PSC portals still indexed, so their same-category
 * pool was almost entirely dead, and `uppsc` filled all six of its slots
 * with noindexed pages. `ibps`, `sbi`, `army-agniveer` and `airforce-agniveer`
 * — real earners — each spent four of six slots the same way.
 *
 * This is checked as an invariant over the live registry rather than a fixed
 * list of the pages found broken, so a future deindex decision (or a
 * category losing more members) is caught the same way.
 */
import { describe, expect, it } from "vitest";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { relatedPortals } from "@/lib/specRegistry";
import { isDeindexed } from "@/lib/deindexed";

const indexedIds = PORTAL_KEYS.filter(
  (id) => !isDeindexed(`/exam-requirements/${id}/`),
);

describe("relatedPortals excludes deindexed pages", () => {
  it("has indexed exam pages to check", () => {
    expect(indexedIds.length).toBeGreaterThan(5);
  });

  it("never returns a deindexed portal for any indexed exam page", () => {
    const offenders: string[] = [];
    for (const id of indexedIds) {
      const dead = relatedPortals(id, 6).filter((r) =>
        isDeindexed(`/exam-requirements/${r.id}/`),
      );
      if (dead.length) {
        offenders.push(`${id} -> ${dead.map((d) => d.id).join(", ")}`);
      }
    }
    expect(offenders, "indexed exam pages linking to deindexed siblings").toEqual([]);
  });

  it("still fills up to the limit from other categories when its own is nearly gone", () => {
    // uppsc's own category (state-psc) has only 2 of 12 members left indexed
    // (itself and tgpsc). The fix must top up from other categories rather
    // than returning a short list.
    const r = relatedPortals("uppsc", 6);
    expect(r.length).toBe(6);
    expect(r.some((x) => x.id === "tgpsc")).toBe(true);
  });

  it("never recommends the page to itself", () => {
    for (const id of indexedIds) {
      expect(relatedPortals(id, 6).some((r) => r.id === id)).toBe(false);
    }
  });
});
