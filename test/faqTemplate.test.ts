/**
 * No shared FAQ templates (CLAUDE.md §3).
 *
 * The 6 Oct 2026 guideline audit found every indexed exam page carrying the
 * same six FAQ questions with only the exam name swapped, and some answers
 * assembled from data fields into sentences that are not English ("…a
 * background that does not match White"). Google's helpful-content guidance
 * scores exactly this mass-produced pattern.
 *
 * A question, after masking the page's own exam/country name and its numbers,
 * may appear on at most MAX_PAGES_PER_QUESTION indexed template pages. Today's
 * wider templates are recorded in test/fixtures/quality/faq-template-allowlist.json
 * and may only shrink. The rendered, site-wide duplicate check (FAQ constants
 * reused on several tool pages) lives in scripts/quality-gate.mjs.
 */
import { describe, expect, it } from "vitest";
import { explain, ratchetCounts, ratchetSet, readFixture } from "@/scripts/quality/ratchet.mjs";
import {
  examTemplatePages,
  makerTemplatePages,
  normaliseTemplateText,
  type TemplatePage,
} from "./quality/templatePages";

const FIXTURE = "faq-template-allowlist.json";
/** The target the ratchet moves toward; questions within it need no entry. */
export const MAX_PAGES_PER_QUESTION = 3;

/**
 * A data value spliced mid-sentence keeps its registry capitalisation — "does
 * not match White", "does not match Light grey" — which is how a generated
 * fragment shows itself in prose.
 */
const SPLICED_VALUE = /\bdoes not match [A-Z][a-z]/;

function templatePages(): TemplatePage[] {
  return [...examTemplatePages(), ...makerTemplatePages()];
}

/** Normalised question → number of indexed template pages it appears on. */
export function currentQuestionSpread(pages: TemplatePage[] = templatePages()): Record<string, number> {
  const routesByQuestion = new Map<string, Set<string>>();
  for (const page of pages) {
    for (const { q } of page.faqItems) {
      const key = normaliseTemplateText(q, page.names);
      if (!routesByQuestion.has(key)) routesByQuestion.set(key, new Set());
      routesByQuestion.get(key)!.add(page.route);
    }
  }
  return Object.fromEntries(
    [...routesByQuestion]
      .filter(([, routes]) => routes.size > MAX_PAGES_PER_QUESTION)
      .map(([question, routes]) => [question, routes.size])
  );
}

/** Routes whose FAQ contains a spliced, capitalised data value mid-sentence. */
export function currentSplicedAnswers(pages: TemplatePage[] = templatePages()): string[] {
  return pages
    .filter((page) => page.faqItems.some(({ q, a }) => SPLICED_VALUE.test(q) || SPLICED_VALUE.test(a)))
    .map((page) => page.route);
}

describe("FAQ questions are not one template with the name swapped", () => {
  it("normalises the page's own name and numbers, and nothing else", () => {
    const names = ["SSC (Staff Selection Commission)", "Staff Selection Commission", "SSC"];
    expect(normaliseTemplateText("How do I resize my photo to 20–50 KB for SSC (Staff Selection Commission)?", names)).toBe(
      "How do I resize my photo to #–# KB for {name}?"
    );
    expect(normaliseTemplateText("Is an Indian photo different?", ["India"])).toBe("Is an Indian photo different?");
  });

  it("recognises a name-swapped question shared by more than three pages", () => {
    const page = (route: string, name: string): TemplatePage => ({
      route,
      names: [name],
      faqItems: [{ q: `Is this ${name} resizer free?`, a: "Yes." }],
    });
    const spread = currentQuestionSpread(["A", "B", "C", "D"].map((n) => page(`/${n}/`, `Exam ${n}`)));
    expect(spread).toEqual({ "Is this {name} resizer free?": 4 });
  });

  it("recognises a spliced data value in an answer", () => {
    expect(SPLICED_VALUE.test("Check the bands, a background that does not match White, then…")).toBe(true);
    expect(SPLICED_VALUE.test("If the photo does not match the stored canvas, re-crop it.")).toBe(false);
  });

  it("covers every indexed exam and maker page", () => {
    expect(examTemplatePages().length).toBeGreaterThan(0);
    expect(makerTemplatePages().length).toBeGreaterThan(0);
  });

  it("no question appears on more pages than recorded, and the record only shrinks toward 3", () => {
    const fixture = readFixture(FIXTURE);
    const problems = ratchetCounts({
      fixture: FIXTURE,
      section: "nameSwappedQuestions",
      what: `indexed exam/maker pages asking this question (target ≤ ${MAX_PAGES_PER_QUESTION})`,
      current: currentQuestionSpread(),
      allowed: fixture.nameSwappedQuestions,
    });
    expect(problems, explain(problems)).toEqual([]);
  });

  it("no new FAQ answer splices a data value into a sentence", () => {
    const fixture = readFixture(FIXTURE);
    const problems = ratchetSet({
      fixture: FIXTURE,
      section: "splicedValueAnswers",
      what: 'FAQ with a generated "does not match {Value}" fragment',
      current: currentSplicedAnswers(),
      allowed: fixture.splicedValueAnswers,
    });
    expect(problems, explain(problems)).toEqual([]);
  });
});
