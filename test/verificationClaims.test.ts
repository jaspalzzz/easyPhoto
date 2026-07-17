/**
 * Guards the "verified against the official source" claim.
 *
 * Exam pages carry a trust line in their meta description. Claiming a spec is
 * "verified against the official source" is only honest when the spec is
 * actually confirmed (verification: "official") AND dated. 11 of 52 presets are
 * needs-review — asserting they are verified is an AdSense misleading-
 * representation risk and, worse, tells an applicant a number is trustworthy
 * when it has not been checked.
 *
 * The exam-requirements meta description gates the claim on
 * specProvenance(spec).verified. This test drives generateMetadata for a
 * verified and an unverified preset and asserts the claim only appears for the
 * verified one, so the gate cannot be flattened back to an unconditional claim.
 */
import { describe, it, expect } from "vitest";
import { generateMetadata } from "@/app/exam-requirements/[exam]/page";
import { allPortalSpecs, specProvenance } from "@/lib/specRegistry";

const VERIFIED_CLAIM = /verified against the official source/i;

async function descriptionFor(exam: string): Promise<string> {
  const meta = await generateMetadata({ params: Promise.resolve({ exam }) });
  return String(meta.description ?? "");
}

describe("exam meta descriptions only claim 'verified' for verified specs", () => {
  it("a verified preset (upsc) claims verification", async () => {
    expect(specProvenance(allPortalSpecs().find((s) => s.id === "upsc")!).verified).toBe(true);
    expect(await descriptionFor("upsc")).toMatch(VERIFIED_CLAIM);
  });

  it("a needs-review preset (ssc) does NOT claim verification", async () => {
    expect(specProvenance(allPortalSpecs().find((s) => s.id === "ssc")!).verified).toBe(false);
    const desc = await descriptionFor("ssc");
    expect(desc).not.toMatch(VERIFIED_CLAIM);
    expect(desc).toMatch(/confirm the current figures/i);
  });

  it("no needs-review preset's description asserts verification", async () => {
    const needsReview = allPortalSpecs().filter((s) => !specProvenance(s).verified);
    expect(needsReview.length, "expected some needs-review presets to exist").toBeGreaterThan(0);
    for (const spec of needsReview) {
      const desc = await descriptionFor(spec.id);
      expect(desc, `${spec.id} wrongly claims verification`).not.toMatch(VERIFIED_CLAIM);
    }
  });
});
