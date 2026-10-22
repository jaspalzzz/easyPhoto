/**
 * Guideline quality gate for the built site — `npm run build && npm run quality`.
 *
 * Guards the patterns behind the July 2026 demotion, found again by the 6 Oct
 * 2026 guideline audit, on the HTML Google actually receives (out/):
 *   1. template similarity per family (name/number-normalised 5-word shingles)
 *   2. FAQ questions repeated across indexed pages
 *   3. structured data that is not visible, rating markup, non-free offers
 *   4. JSON-LD dateModified vs sitemap lastmod
 *   5. internal vocabulary in rendered copy
 *   6. unverified exam pages showing a stored KB figure as the requirement
 *
 * Every check is a ratchet against test/fixtures/quality/*.json: it fails on a
 * new or worse violation AND when a recorded allowance is no longer used, so
 * the baseline can only move down. The source-level halves of these rules run
 * in `npx vitest run` (see test/*.test.ts that import scripts/quality/).
 *
 * Pure Node, no dependencies. Set CONTENT_EXPORT_DIR to check another export.
 */
import fs from "node:fs";
import path from "node:path";
import {
  findStructuredDataProblems,
  loadSite,
  measureDateModifiedVsLastmod,
  measureRenderedJargon,
  measureSimilarity,
  measureSiteWideFaqDuplicates,
  measureUnverifiedRequirementCards,
  MAX_PAGES_PER_QUESTION,
} from "./quality/measure.mjs";
import { SHINGLE_SIZE } from "./quality/shingles.mjs";
import {
  fixturePath,
  explain,
  ratchetCounts,
  ratchetExceptions,
  ratchetSet,
  readFixture,
} from "./quality/ratchet.mjs";

const startedAt = Date.now();
const exportRoot = path.resolve(process.env.CONTENT_EXPORT_DIR || "out");

if (!fs.existsSync(path.join(exportRoot, "sitemap.xml"))) {
  console.error(
    `\nquality gate: no static export at ${exportRoot} (missing sitemap.xml).\n` +
      "Run `npm run build` first — this gate checks the built HTML, not the source.\n"
  );
  process.exit(1);
}

const site = loadSite(exportRoot);
const results = [];

function record(name, problems, summary) {
  results.push({ name, problems, summary });
}

/** Floating-point baselines are stored rounded up to 4 places. */
const ceil4 = (value) => Math.ceil(value * 1e4) / 1e4;

// ── 1. Template similarity ───────────────────────────────────────────────────
{
  const FIXTURE = "similarity-baseline.json";
  const baseline = readFixture(FIXTURE);
  const where = fixturePath(FIXTURE);
  const problems = [];
  const summary = [];
  if (baseline.shingleSize !== SHINGLE_SIZE) {
    problems.push(
      `CHANGED: ${where} was recorded with ${baseline.shingleSize}-word shingles but the gate measures ${SHINGLE_SIZE}. ` +
        "Changing the measure re-baselines every family and needs the owner's approval."
    );
  }
  const measured = measureSimilarity(site);
  for (const [family, current] of Object.entries(measured)) {
    const recorded = baseline.families[family];
    if (!recorded) {
      problems.push(`NEW: ${family} — no baseline in ${where}. A family's first baseline needs the owner's approval.`);
      continue;
    }
    const max = ceil4(current.maxJaccard);
    summary.push(`${family} max ${max.toFixed(4)} (≤ ${recorded.maxJaccard})`);
    if (max > recorded.maxJaccard) {
      problems.push(
        `WORSE: ${family} — max pairwise similarity ${max.toFixed(4)} > baseline ${recorded.maxJaccard} ` +
          `(${current.maxPair.join(" ~ ")}). Make the pages differ in substance.`
      );
    } else if (recorded.maxJaccard - max > baseline.tightenWhenImprovedBy.jaccard) {
      problems.push(`IMPROVED: ${family} — max similarity is ${max.toFixed(4)}. Lower families.${family}.maxJaccard to ${max} in ${where}.`);
    }
    for (const [route, words] of Object.entries(current.unsharedWords)) {
      const floor = recorded.minUnsharedWords[route];
      if (floor === undefined) {
        if (words < baseline.newPageMinUnsharedWords) {
          problems.push(
            `NEW: ${route} — ${words} words not shared with other ${family} pages; a new page needs ≥ ${baseline.newPageMinUnsharedWords}.`
          );
        } else {
          problems.push(`NEW: ${route} — not in ${where}. Record families.${family}.minUnsharedWords["${route}"] = ${words} (an indexed page needs the owner's approval, CLAUDE.md §1).`);
        }
      } else if (words < floor) {
        problems.push(`WORSE: ${route} — ${words} words not shared with other ${family} pages, recorded minimum ${floor}.`);
      } else if (words - floor > baseline.tightenWhenImprovedBy.words) {
        problems.push(`IMPROVED: ${route} — now ${words} unshared words. Raise families.${family}.minUnsharedWords["${route}"] to ${words} in ${where}.`);
      }
    }
    for (const route of Object.keys(recorded.minUnsharedWords)) {
      if (!(route in current.unsharedWords)) {
        problems.push(`GONE: ${route} is no longer an indexed ${family} page. Delete it from ${where}.`);
      }
    }
  }
  record("template similarity", problems, summary.join("; "));
}

// ── 2. FAQ questions repeated across indexed pages ───────────────────────────
{
  const FIXTURE = "faq-template-allowlist.json";
  const current = measureSiteWideFaqDuplicates(site);
  record(
    "site-wide FAQ duplicates",
    ratchetCounts({
      fixture: FIXTURE,
      section: "siteWideDuplicateQuestions",
      what: `indexed pages asking this FAQ question (target ≤ ${MAX_PAGES_PER_QUESTION})`,
      current,
      allowed: readFixture(FIXTURE).siteWideDuplicateQuestions,
    }),
    `${Object.keys(current).length} question(s) above ${MAX_PAGES_PER_QUESTION} pages`
  );
}

// ── 3. Structured data matches the visible page ──────────────────────────────
{
  const { problems, checked } = findStructuredDataProblems(site);
  record(
    "structured data matches visible text",
    problems.map((problem) => `NEW: ${problem}. Structured data must describe what the reader sees.`),
    `${checked} FAQ/headline/breadcrumb strings visible; no rating markup; offers free`
  );
}

// ── 4. Dates ─────────────────────────────────────────────────────────────────
{
  const FIXTURE = "date-exceptions.json";
  const current = measureDateModifiedVsLastmod(site);
  const today = new Date().toISOString().slice(0, 10);
  const problems = ratchetExceptions({
    fixture: FIXTURE,
    section: "dateModifiedVsLastmod",
    what: "JSON-LD dateModified vs sitemap lastmod disagreement",
    current,
    allowed: readFixture(FIXTURE).dateModifiedVsLastmod,
  });
  for (const { route, lastmod } of site.sitemap) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod) || lastmod > today) {
      problems.push(`NEW: ${route} — sitemap lastmod "${lastmod}" is missing, malformed or after today (${today}). Never fake freshness.`);
    }
  }
  record("dates agree", problems, `${Object.keys(current).length} recorded disagreement(s)`);
}

// ── 5. Internal vocabulary in rendered copy ──────────────────────────────────
{
  const FIXTURE = "jargon-allowlist.json";
  const current = measureRenderedJargon(site);
  const total = Object.values(current).reduce((sum, count) => sum + count, 0);
  const pages = new Set(Object.keys(current).map((key) => key.split(" — ")[0]));
  record(
    "internal vocabulary",
    ratchetCounts({
      fixture: FIXTURE,
      section: "renderedPages",
      what: "internal word in title/meta/main text",
      current,
      allowed: readFixture(FIXTURE).renderedPages,
    }),
    `${total} uses on ${pages.size} pages`
  );
}

// ── 6. Unverified exam pages: the requirement card ───────────────────────────
{
  const FIXTURE = "unpublished-claims-allowlist.json";
  const current = measureUnverifiedRequirementCards(site);
  record(
    "unpublished numbers not shown as the requirement",
    ratchetSet({
      fixture: FIXTURE,
      section: "renderedFields",
      what: "stored KB figure shown as the requirement on an unverified exam page",
      current,
      allowed: readFixture(FIXTURE).renderedFields,
    }),
    `${current.length} recorded card(s)`
  );
}

// ── Report ───────────────────────────────────────────────────────────────────
let failed = 0;
for (const { name, problems, summary } of results) {
  if (problems.length === 0) {
    console.log(`✓ ${name} — ${summary}`);
  } else {
    failed += 1;
    console.error(`✗ ${name} — ${problems.length} problem(s)`);
    console.error(explain(problems).replace(/^/gm, "    "));
  }
}
const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log(`\nquality gate: ${results.length - failed}/${results.length} checks passed on ${site.pages.size} indexed pages in ${seconds}s`);
if (failed) process.exit(1);
