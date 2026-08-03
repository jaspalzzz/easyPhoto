/**
 * A gate that fails on the thing an ordinary build is allowed to tolerate.
 *
 * `npm run verify` blocks only where a page has essentially nothing of its own
 * (50 unshared words). That is a regression floor, and passing it says nothing
 * about whether the site is ready for an ad review. This script holds the
 * remediation target instead: it fails whenever the count of pages below the
 * target RISES above the recorded baseline.
 *
 * A ratchet rather than an absolute bar, because an absolute bar at the target
 * would fail 72 of 156 pages today and simply be bypassed. Lower the baseline
 * as pages are fixed; never raise it to make a build pass.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const baselineFile = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "adsense-readiness-baseline.json",
);
const baseline = JSON.parse(fs.readFileSync(baselineFile, "utf8"));

// The target is FORCED from the baseline, not inherited. Passing
// TARGET_UNIQUE_WORDS=1 in the environment previously lowered the bar the child
// measured against and the gate exited 0 with the site unchanged — a gate that
// can be told to pass is not a gate.
const output = execFileSync("node", ["scripts/audit-thin-content.mjs"], {
  encoding: "utf8",
  env: {
    ...process.env,
    MIN_UNIQUE_WORDS: "0",
    TARGET_UNIQUE_WORDS: String(baseline.targetUnsharedWords),
  },
});
const match = output.match(/Below the (\d+)-unshared target[^:]*: (\d+) of (\d+)/);
if (!match) {
  console.error("Could not read the below-target count from the thin-content audit.");
  process.exit(1);
}
const [, targetRaw, countRaw, totalRaw] = match;
const target = Number(targetRaw);
const count = Number(countRaw);
const total = Number(totalRaw);

// Validate what came back rather than trusting it. A malformed baseline, or a
// child that measured against a different target or a different corpus, must
// fail loudly instead of reporting a number nobody can interpret.
for (const [label, value] of [
  ["targetUnsharedWords", baseline.targetUnsharedWords],
  ["pagesBelowTarget", baseline.pagesBelowTarget],
  ["indexedPages", baseline.indexedPages],
]) {
  if (!Number.isInteger(value) || value < 0) {
    console.error(`Baseline field ${label} is not a non-negative integer: ${value}`);
    process.exit(1);
  }
}
if (target !== baseline.targetUnsharedWords) {
  console.error(
    `Audit measured against ${target} unshared words, baseline records ` +
      `${baseline.targetUnsharedWords}. Refusing to compare different targets.`,
  );
  process.exit(1);
}
if (total !== baseline.indexedPages) {
  console.error(
    `Indexed page count changed: ${total} now, ${baseline.indexedPages} at baseline. ` +
      `The below-target count is not comparable across a different corpus — ` +
      `re-record the baseline deliberately.`,
  );
  process.exit(1);
}

console.log(
  `AdSense readiness: ${count} of ${total} indexed pages hold fewer than ${target} ` +
    `unshared words (baseline ${baseline.pagesBelowTarget}).`,
);

if (count > baseline.pagesBelowTarget) {
  console.error(
    `REGRESSION: ${count - baseline.pagesBelowTarget} more page(s) fell below the ` +
      `target than the recorded baseline. Fix the content or justify and update ` +
      `${path.basename(baselineFile)} deliberately.`,
  );
  process.exit(1);
}
if (count < baseline.pagesBelowTarget) {
  console.log(
    `Improved by ${baseline.pagesBelowTarget - count}. Update the baseline to lock it in.`,
  );
}
if (count > 0) {
  console.error(
    `NOT READY for an AdSense review: ${count} page(s) remain below the target. ` +
      `A passing \`npm run verify\` does not mean otherwise.`,
  );
  process.exit(2);
}
