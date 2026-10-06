/**
 * Static demos are labelled (CLAUDE.md §3; Google spam policies: misleading
 * functionality).
 *
 * A pass/fail or "checks passed" visual that is not produced from the user's
 * own file is an illustration, and the reader must be told so. The 6 Oct 2026
 * guideline audit found the homepage card in components/site/WhyRejected.tsx
 * showing a fixed "6/6 Checks Passed … Lighting Good … Eyes visible Yes" with
 * no label. AiShowcase.tsx shows the same kind of card but says "Example
 * walkthrough below, shown with a sample photo" — that is the standard.
 *
 * A component file that renders a fixed pass result as JSX text must also
 * render visible text containing "Example". Today's unlabelled files are
 * recorded in test/fixtures/quality/example-label-exceptions.json and may only
 * be removed.
 */
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { explain, ratchetSet, readFixture } from "@/scripts/quality/ratchet.mjs";
import { sourceFiles } from "./quality/sourceFiles";

const FIXTURE = "example-label-exceptions.json";
const ROOTS = ["app", "components"];

/** A result badge that can only be fixed text when it is a JSX text node. */
const STATIC_PASS = /^(?:all\s+)?pass(?:ed|es)?!?$|\bchecks?\s+passed\b|\ball\s+checks?\s+pass|^\d+\s*\/\s*\d+$/i;
const EXAMPLE_LABEL = /\bexample\b/i;

/**
 * Literal text between JSX tags. Text produced by an expression (`{status}`)
 * is computed from the user's file and is not a fixed result, so it is not
 * collected; neither are attributes or `{/* comments *\/}`.
 */
export function jsxTextNodes(source: string): string[] {
  const markup = source.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/<br\s*\/?>/gi, " ");
  return [...markup.matchAll(/>([^<>{}]+)</g)]
    .map(([, text]) => text.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function isUnlabelledStaticPass(source: string): boolean {
  const nodes = jsxTextNodes(source);
  return nodes.some((text) => STATIC_PASS.test(text)) && !nodes.some((text) => EXAMPLE_LABEL.test(text));
}

export function currentUnlabelledStaticPasses(): string[] {
  return sourceFiles(ROOTS, /\.tsx$/).filter((file) => isUnlabelledStaticPass(fs.readFileSync(file, "utf8")));
}

describe("fixed pass/fail visuals carry a visible Example label", () => {
  it("flags a fixed result card without a label", () => {
    expect(isUnlabelledStaticPass(`<p className="x">6/6</p><p>Checks Passed</p>`)).toBe(true);
    expect(isUnlabelledStaticPass(`<span>\n  Pass\n</span>`)).toBe(true);
  });

  it("accepts the card once it says it is an example", () => {
    expect(isUnlabelledStaticPass(`<p>Example result</p><p>Checks Passed</p>`)).toBe(false);
  });

  it("ignores results computed from the user's file and alt text", () => {
    expect(isUnlabelledStaticPass(`<span>{ok ? "Pass" : "Fail"}</span><img alt="Checks passed" />`)).toBe(false);
  });

  it("no component adds an unlabelled static pass visual (recorded exceptions only shrink)", () => {
    const problems = ratchetSet({
      fixture: FIXTURE,
      section: "unlabelledStaticPass",
      what: 'fixed pass/"checks passed" visual without a visible "Example" label',
      current: currentUnlabelledStaticPasses(),
      allowed: readFixture(FIXTURE).unlabelledStaticPass,
    });
    expect(problems, explain(problems)).toEqual([]);
  });
});
