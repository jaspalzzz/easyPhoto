/**
 * Write for applicants, not for us (CLAUDE.md §3).
 *
 * The 6 Oct 2026 guideline audit found our own vocabulary all over user-facing
 * copy — "Prepare your SSC photo & signature to the selected stored target",
 * "has not been extracted reliably in this review" — which reads as unreviewed
 * machine text. Google's generative-AI guidance asks for exactly that review.
 *
 * This is the source-level half: the multi-word phrases that only ever appear
 * as copy, counted per file (comments excluded). It runs without a build.
 * Single words that also name code ("stored", "preset", "registry",
 * "extracted") are counted per page in the RENDERED text by
 * scripts/quality-gate.mjs. Both ratchets live in
 * test/fixtures/quality/jargon-allowlist.json and may only fall.
 *
 * boundedClaims.test.ts is the zero-tolerance list; these phrases have
 * hundreds of existing uses, so they ratchet down instead of being banned.
 */
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { explain, ratchetCounts, readFixture } from "@/scripts/quality/ratchet.mjs";
import { sourceFiles, stripComments } from "./quality/sourceFiles";

const FIXTURE = "jargon-allowlist.json";
const ROOTS = ["app", "components", "lib"];

export const JARGON_PHRASES: Record<string, RegExp> = {
  "stored … target": /\bstored\s+(?:[\w×–-]+\s+){0,3}?targets?\b/gi,
  "selected stored": /\bselected\s+stored\b/gi,
  "selected target": /\bselected\s+target\b/gi,
  "compatibility-only": /\bcompatibility[-\s]only\b/gi,
  "compatibility target": /\bcompatibility\s+targets?\b/gi,
  "in this review": /\bin\s+this\s+review\b/gi,
};

export function jargonCounts(source: string): Record<string, number> {
  const copy = stripComments(source);
  const out: Record<string, number> = {};
  for (const [phrase, pattern] of Object.entries(JARGON_PHRASES)) {
    const count = (copy.match(pattern) ?? []).length;
    if (count > 0) out[phrase] = count;
  }
  return out;
}

export function currentSourceJargon(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const file of sourceFiles(ROOTS, /\.(?:ts|tsx)$/)) {
    for (const [phrase, count] of Object.entries(jargonCounts(fs.readFileSync(file, "utf8")))) {
      out[`${file} — ${phrase}`] = count;
    }
  }
  return out;
}

describe("user-facing copy does not use internal vocabulary", () => {
  it("recognises the phrases the audit found", () => {
    expect(jargonCounts(`"Prepare your photo to the selected stored target"`)).toEqual({
      "stored … target": 1,
      "selected stored": 1,
    });
    expect(jargonCounts(`"The stored 20–50 KB photo target is compatibility-only."`)).toEqual({
      "stored … target": 1,
      "compatibility-only": 1,
    });
    expect(jargonCounts(`"has not been extracted reliably in this review"`)).toEqual({ "in this review": 1 });
  });

  it("ignores comments", () => {
    expect(jargonCounts("// the selected stored target\nconst x = 1;")).toEqual({});
  });

  it("no file uses more internal phrases than recorded (counts only fall)", () => {
    const problems = ratchetCounts({
      fixture: FIXTURE,
      section: "sourcePhrases",
      what: "internal-vocabulary phrase in copy",
      current: currentSourceJargon(),
      allowed: readFixture(FIXTURE).sourcePhrases,
    });
    expect(problems, explain(problems)).toEqual([]);
  });
});
