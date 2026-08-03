/**
 * Regression guards for `applicationNotes`.
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
 * this tool does. These lexical checks catch known failure shapes; they do not
 * prove source support. High-risk derived claims get explicit invariants below,
 * and source review remains a separate requirement.
 */
import { describe, expect, it } from "vitest";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

const BANNED: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "prevalence claim (a frequency nobody measured)",
    pattern:
      /\b(?:the\s+)?(?:most|more|less)\s+common(?:est)?\b|\bthe main (?:thing|reason|cause)\b|\bmost candidates\b|\b(?:often|usually|rarely|commonly|typically|probably)\b|\bthe failures? (?:come|comes) from\b|\bthe (?:file|part|thing) that (?:fails|candidates get wrong)\b/i,
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

  it("keeps PAN arithmetic and portrait orientation tied to the published scan", () => {
    const pan = PORTAL_PRESETS.pan!;
    const arithmetic = pan.applicationNotes?.find((note) =>
      note.includes("scanning setting rather than a property"),
    );
    const width = Math.round((2.5 / 2.54) * 200);
    const height = Math.round((3.5 / 2.54) * 200);

    expect(pan.dpi).toBe(200);
    expect(pan.description).toContain("3.5×2.5 cm (height×width)");
    expect(pan.photoWidthPx).toBe(width);
    expect(pan.photoHeightPx).toBe(height);
    expect(arithmetic).toContain(`3.5 cm-high x 2.5 cm-wide`);
    expect(arithmetic).toContain(`${width} x ${height} pixels`);
    expect(arithmetic).not.toContain("276 x 354");
  });

  it("recalculates retained comparisons from the stored dimensions", () => {
    const netherlands = COUNTRY_SPECS.netherlands!;
    const netherlandsArithmetic = netherlands.applicationNotes?.find((note) =>
      note.includes("head band on a 45 mm frame"),
    );
    const headMin = Math.round(
      (netherlands.headHeightMm!.min / netherlands.printMm.height) * 100,
    );
    const headMax = Math.round(
      (netherlands.headHeightMm!.max / netherlands.printMm.height) * 100,
    );
    expect(netherlandsArithmetic).toContain(`${headMin} to ${headMax} percent`);

    const gate = PORTAL_PRESETS.gate!;
    const gateArithmetic = gate.applicationNotes?.find((note) =>
      note.includes("published aspect band"),
    );
    expect(gateArithmetic).toContain(gate.photoAspectRatio!.toFixed(2));

    const epfo = PORTAL_PRESETS.epfo!;
    const epfoArithmetic = epfo.applicationNotes?.find((note) =>
      note.includes("signature window spans"),
    );
    expect(epfoArithmetic).toContain(
      `${epfo.sigLimitKb! - epfo.sigMinKb!} KB`,
    );
    expect(epfoArithmetic).toContain(
      `${epfo.photoLimitKb - epfo.photoMinKb!} KB`,
    );
  });

  it("keeps corrected country scope and public fallback fields aligned", () => {
    const germany = COUNTRY_SPECS.germany!;
    const germanyCopy = [
      germany.background.description,
      germany.notes,
      ...(germany.applicationNotes ?? []),
    ].join(" ");
    expect(germanyCopy).not.toMatch(/reject(?:s|ed)? white|white is .*reject/i);

    const uae = COUNTRY_SPECS.uae!;
    expect(uae.documents.join(" ")).not.toMatch(/employment|residence/i);
    expect(uae.documents.join(" ")).toMatch(/typing-centre|GDRFA/i);
  });
});
