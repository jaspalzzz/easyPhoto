/**
 * Meta descriptions on the generated maker pages must fit the snippet, and must
 * not double their punctuation.
 *
 * Both defects were live. `spec.background.description` is registry prose
 * written for the page body, so its length is unbounded — Schengen's runs 150
 * characters on its own — and the template inlined it whole. That produced a
 * 246-character description on /schengen-visa-photo-maker/ and 13 of 20 maker
 * pages over the limit. Because the field already ends in a full stop and the
 * template appended another, the same snippet read "…handling the application..
 * Make one free…".
 *
 * Written as an invariant over every registered maker page rather than as a
 * check on the two records that happened to be worst, so a future country entry
 * with long prose is caught by the same rule.
 */
import { describe, expect, it } from "vitest";
import { MAKER_PAGES } from "@/lib/makerPages";
import {
  META_DESCRIPTION_LIMIT,
  clampDescription,
  firstSentence,
} from "@/lib/seo";
import { generateMetadata } from "@/app/[maker]/page";

async function descriptionFor(slug: string): Promise<string> {
  const meta = await generateMetadata({ params: Promise.resolve({ maker: slug }) });
  return String((meta as { description?: string }).description ?? "");
}

describe("maker page meta descriptions", () => {
  it("has maker pages to check", () => {
    expect(MAKER_PAGES.length).toBeGreaterThan(10);
  });

  it("keeps every maker description within the snippet limit", async () => {
    const over: string[] = [];
    for (const page of MAKER_PAGES) {
      const d = await descriptionFor(page.slug);
      if (d.length > META_DESCRIPTION_LIMIT) {
        over.push(`/${page.slug}/ is ${d.length} chars`);
      }
    }
    expect(over, "descriptions over the snippet limit").toEqual([]);
  });

  it("never doubles a full stop in a maker description", async () => {
    const bad: string[] = [];
    for (const page of MAKER_PAGES) {
      const d = await descriptionFor(page.slug);
      if (/\.\s*\./.test(d)) bad.push(`/${page.slug}/: "${d.slice(0, 90)}"`);
    }
    expect(bad, "doubled full stops").toEqual([]);
  });

  it("composes copy that fits without the clamp having to truncate it", async () => {
    // The clamp is a safety net, and a net that is always catching hides the
    // problem it was meant to backstop: with the full background prose inlined,
    // every description still came in under the limit, but four of them ended
    // mid-phrase on an ellipsis, and the doubled full stop was simply truncated
    // away before anyone could see it. Asserting the net is never reached is
    // what makes the length guard meaningful.
    const truncated: string[] = [];
    for (const page of MAKER_PAGES) {
      const d = await descriptionFor(page.slug);
      if (d.endsWith("…")) truncated.push(`/${page.slug}/ (${d.length} chars)`);
    }
    expect(truncated, "descriptions cut mid-phrase by the clamp").toEqual([]);
  });

  it("still says something specific on every maker page", async () => {
    // A length guard is trivially satisfiable by emitting nothing useful.
    for (const page of MAKER_PAGES) {
      const d = await descriptionFor(page.slug);
      expect(d.length, `/${page.slug}/ description too short`).toBeGreaterThan(60);
      expect(d, `/${page.slug}/ must state the print size`).toMatch(/\d+×\d+mm/);
    }
  });
});

describe("firstSentence", () => {
  it("takes the opening sentence and drops its full stop", () => {
    expect(firstSentence("Plain and light-coloured. This preset uses grey.")).toBe(
      "Plain and light-coloured",
    );
  });

  it("leaves a single unterminated sentence intact", () => {
    expect(firstSentence("White or off-white")).toBe("White or off-white");
  });

  it("does not split on a decimal point or an abbreviation mid-clause", () => {
    // No whitespace after the stop, so it is not a sentence boundary.
    expect(firstSentence("Plain white, 35.5mm margin")).toBe(
      "Plain white, 35.5mm margin",
    );
  });
});

describe("clampDescription", () => {
  it("leaves text within the limit untouched", () => {
    expect(clampDescription("short enough")).toBe("short enough");
  });

  it("never returns more than the limit", () => {
    const long = "word ".repeat(80);
    expect(clampDescription(long).length).toBeLessThanOrEqual(
      META_DESCRIPTION_LIMIT,
    );
  });

  it("cuts on a word boundary rather than mid-word", () => {
    const out = clampDescription(`${"a".repeat(150)} boundaryword tail`);
    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toContain("boundarywor…");
  });

  it("strips a trailing separator before the ellipsis", () => {
    const out = clampDescription(`${"x".repeat(140)} something, tail here`);
    expect(out).not.toMatch(/[,;:—–-]…$/);
  });
});
