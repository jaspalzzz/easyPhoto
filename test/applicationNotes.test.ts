/**
 * The acceptance rule for `applicationNotes`, encoded.
 *
 * These notes were written to raise pages over a differentiation threshold, and
 * a review found that around a third of the newest paragraphs had drifted into
 * padding. The three failure shapes were consistent, so they are checked rather
 * than remembered:
 *
 *   - PREVALENCE: "the most common reason", "more common than", "the main thing
 *     that stalls it" — asserts a frequency nobody measured.
 *   - OUTCOME: "will be rejected", "causes rejection" — promises an authority's
 *     decision. (boundedClaims covers the public copy; this covers these notes.)
 *   - LATER STAGES: "checked against you at document verification", "at every
 *     physical stage" — speculates about processing beyond what the notice says.
 *
 * A statement in these notes must be one of: quoted or paraphrased from the
 * cited source; arithmetic from published dimensions; or a description of what
 * this tool does. Anything else belongs in a blog post, not on a spec page.
 */
import { describe, expect, it } from "vitest";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const BANNED: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "prevalence claim (a frequency nobody measured)",
    pattern:
      /\b(?:the\s+)?(?:most|more|less)\s+common(?:est)?\b|\bthe main (?:thing|reason|cause)\b|\bmost candidates\b|\busually the\b/i,
  },
  {
    label: "guaranteed outcome from an authority",
    pattern:
      /\b(?:will|shall)\s+be\s+(?:rejected|refused|returned|cancelled)\b|\bcauses?\s+(?:a\s+)?rejection\b|\bguarantees?\s+acceptance\b/i,
  },
  {
    label: "speculation about a later processing stage",
    pattern:
      /\b(?:checked|matched|verified)\s+against\s+you\s+at\b|\bat\s+document\s+verification\b|\bat\s+every\s+(?:stage|physical|medical)\b|\bfollows\s+you\s+through\b/i,
  },
];

type Note = { owner: string; text: string };

function allNotes(): Note[] {
  const out: Note[] = [];
  for (const key of PORTAL_KEYS) {
    const notes = PORTAL_PRESETS[key]?.applicationNotes;
    if (notes) for (const text of notes) out.push({ owner: `exam:${key}`, text });
  }
  for (const [key, spec] of Object.entries(COUNTRY_SPECS)) {
    const notes = spec.applicationNotes;
    if (notes) for (const text of notes) out.push({ owner: `country:${key}`, text });
  }
  return out;
}

describe("applicationNotes acceptance rule", () => {
  const notes = allNotes();

  it("has notes to check", () => {
    expect(notes.length).toBeGreaterThan(50);
  });

  it("makes no prevalence, outcome or later-stage claims", () => {
    const offenders: string[] = [];
    for (const { owner, text } of notes) {
      for (const { label, pattern } of BANNED) {
        const hit = text.match(pattern);
        if (hit) offenders.push(`${owner} — ${label}: "${hit[0]}"`);
      }
    }
    expect(offenders, "unsupported claims in applicationNotes").toEqual([]);
  });

  it("does not repeat a whole note across two records", () => {
    // A note written twice is shared furniture, not differentiation, and costs
    // unshared words on both pages.
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const { owner, text } of notes) {
      const key = text.trim().toLowerCase();
      const first = seen.get(key);
      if (first) dupes.push(`${first} and ${owner} share a note verbatim`);
      else seen.set(key, owner);
    }
    expect(dupes).toEqual([]);
  });
});
