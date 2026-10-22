/**
 * Ratchet comparisons shared by the vitest guards and scripts/quality-gate.mjs.
 *
 * Every guideline guard starts from what is true on the day it was written:
 * today's offenders are recorded in test/fixtures/quality/*.json. A check then
 * fails in BOTH directions —
 *   - a new or bigger violation fails (the site may not drift further), and
 *   - an allowance that is no longer used fails too, asking for it to be
 *     deleted or lowered, so the recorded baseline can only move down.
 */
import fs from "node:fs";
import path from "node:path";
export const FIXTURE_DIR = path.join("test", "fixtures", "quality");

export const NEVER_LOOSEN =
  "Never raise a baseline or add an allowlist entry to make this pass — fix the cause. " +
  "Only the owner can approve a looser baseline, in chat, with the reason in the commit message.";

/** @param {string} name fixture file name inside test/fixtures/quality/ */
export function fixturePath(name) {
  return path.join(FIXTURE_DIR, name);
}

/**
 * Paths are relative to the repository root, the working directory of both
 * `npx vitest run` and `npm run quality` (as for the other scripts/ audits).
 *
 * @param {string} name
 */
export function readFixture(name) {
  return JSON.parse(fs.readFileSync(fixturePath(name), "utf8"));
}

/** A problem that adds or worsens a violation, as opposed to one that asks for a cleanup. */
const REGRESSION = /^(?:NEW|WORSE|CHANGED):/;

/**
 * The failure message for a list of problems: one per line, then — when any
 * of them is a regression — the reminder that the fix is never a looser
 * baseline.
 *
 * @param {string[]} problems
 */
export function explain(problems) {
  return problems.some((problem) => REGRESSION.test(problem)) ? [...problems, NEVER_LOOSEN].join("\n") : problems.join("\n");
}

/**
 * Per-key counts that may only fall. A key missing from `allowed` is allowed 0.
 *
 * @param {{ fixture: string, section: string, what: string,
 *           current: Record<string, number>, allowed: Record<string, number> }} options
 * @returns {string[]} problems; empty when the ratchet holds
 */
export function ratchetCounts({ fixture, section, what, current, allowed }) {
  const problems = [];
  const where = `${fixturePath(fixture)} → ${section}`;
  for (const [key, count] of Object.entries(current)) {
    const limit = allowed[key] ?? 0;
    if (count > limit) {
      problems.push(
        limit === 0
          ? `NEW: ${key} — ${what}: ${count} (none allowed; not in ${where}).`
          : `WORSE: ${key} — ${what}: ${count}, recorded baseline ${limit}.`
      );
    }
  }
  for (const [key, limit] of Object.entries(allowed)) {
    const count = current[key] ?? 0;
    if (count === 0) {
      problems.push(`FIXED: ${key} — ${what} is now 0. Delete "${key}" from ${where} so it cannot come back.`);
    } else if (count < limit) {
      problems.push(`IMPROVED: ${key} — ${what}: ${count} (baseline ${limit}). Lower "${key}" to ${count} in ${where}.`);
    }
  }
  return problems;
}

/**
 * Known offenders that may only be removed.
 *
 * @param {{ fixture: string, section: string, what: string,
 *           current: string[], allowed: string[] }} options
 * @returns {string[]}
 */
export function ratchetSet({ fixture, section, what, current, allowed }) {
  const where = `${fixturePath(fixture)} → ${section}`;
  const known = new Set(allowed);
  const now = new Set(current);
  return [
    ...[...now].filter((key) => !known.has(key)).map((key) => `NEW: ${key} — ${what} (not in ${where}).`),
    ...[...known]
      .filter((key) => !now.has(key))
      .map((key) => `FIXED: ${key} — no longer a ${what}. Delete "${key}" from ${where} so it cannot come back.`),
  ];
}

/**
 * Known exceptions whose recorded value must stay exactly as recorded: a
 * changed value is a new exception, a resolved one must be deleted.
 *
 * @param {{ fixture: string, section: string, what: string,
 *           current: Record<string, unknown>, allowed: Record<string, unknown> }} options
 * @returns {string[]}
 */
export function ratchetExceptions({ fixture, section, what, current, allowed }) {
  const problems = [];
  const where = `${fixturePath(fixture)} → ${section}`;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const [key, value] of Object.entries(current)) {
    if (!(key in allowed)) {
      problems.push(`NEW: ${key} — ${what}: ${JSON.stringify(value)} (not in ${where}).`);
    } else if (!same(value, allowed[key])) {
      problems.push(
        `CHANGED: ${key} — ${what} is now ${JSON.stringify(value)}, recorded ${JSON.stringify(allowed[key])}. ` +
          "Resolve it instead of re-recording it."
      );
    }
  }
  for (const key of Object.keys(allowed)) {
    if (!(key in current)) {
      problems.push(`FIXED: ${key} — no longer a ${what}. Delete "${key}" from ${where}.`);
    }
  }
  return problems;
}
