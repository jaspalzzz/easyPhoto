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

const output = execFileSync("node", ["scripts/audit-thin-content.mjs"], {
  encoding: "utf8",
  env: { ...process.env, MIN_UNIQUE_WORDS: "0" },
});
const match = output.match(/Below the (\d+)-unshared target[^:]*: (\d+) of (\d+)/);
if (!match) {
  console.error("Could not read the below-target count from the thin-content audit.");
  process.exit(1);
}
const [, target, countRaw, totalRaw] = match;
const count = Number(countRaw);
const total = Number(totalRaw);

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
