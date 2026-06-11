import { describe, it, expect } from "vitest";
import type { PortalSpec } from "@/lib/portalPresets";
import {
  specProvenance,
  isSpecStale,
  specsNeedingReview,
  allPortalSpecs,
} from "@/lib/specRegistry";

const base: PortalSpec = {
  id: "test",
  name: "Test Portal",
  photoLimitKb: 50,
  description: "test",
};

describe("specRegistry — provenance", () => {
  it("marks an official, dated spec as verified with a friendly label", () => {
    const p = specProvenance({
      ...base,
      verification: "official",
      verifiedOn: "2026-06-08",
      source: { url: "https://ssc.gov.in", label: "SSC official portal" },
    });
    expect(p.verified).toBe(true);
    expect(p.label).toContain("Verified 8 Jun 2026");
    expect(p.label).toContain("SSC official portal");
    expect(p.url).toBe("https://ssc.gov.in");
  });

  it("does NOT claim verification for needs-review specs", () => {
    const p = specProvenance({
      ...base,
      verification: "needs-review",
      source: { url: "https://x.gov", label: "X" },
    });
    expect(p.verified).toBe(false);
    expect(p.label.toLowerCase()).toContain("confirm");
    expect(p.url).toBe("https://x.gov"); // still points users to the source
  });
});

describe("specRegistry — staleness", () => {
  const today = "2026-06-08";

  it("treats needs-review / undated specs as stale", () => {
    expect(isSpecStale({ ...base, verification: "needs-review" }, 6, today)).toBe(true);
    expect(isSpecStale({ ...base, verification: "official" }, 6, today)).toBe(true); // no date
  });

  it("recent official specs are NOT stale; old ones are", () => {
    const recent = { ...base, verification: "official" as const, verifiedOn: "2026-04-01" };
    const old = { ...base, verification: "official" as const, verifiedOn: "2025-01-01" };
    expect(isSpecStale(recent, 6, today)).toBe(false);
    expect(isSpecStale(old, 6, today)).toBe(true);
  });

  it("verified portals are NOT in the review list; unverified ones are", () => {
    const review = specsNeedingReview(6, today).map((s) => s.id);
    // Verified against official sources on 2026-06-08:
    expect(review).not.toContain("ssc");
    expect(review).not.toContain("ibps");
    expect(review).not.toContain("sbi");
    // Still pending re-confirmation (conflicting/variable sources):
    // (upsc/rrb were verified on 2026-06-08; these two are needs-review.)
    expect(review).toContain("driving-licence");
    expect(review).toContain("voter-id");
    // Not all are verified yet — the review list must be non-empty.
    expect(review.length).toBeGreaterThan(0);
    expect(review.length).toBeLessThan(allPortalSpecs().length);
  });
});
