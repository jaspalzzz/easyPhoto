/**
 * Spec verification checklist.
 *
 *   node scripts/check-specs.mjs
 *
 * Lists every portal spec whose numbers haven't been confirmed against the
 * official source (or are older than the staleness window). Run periodically —
 * spec accuracy is the product. Exits non-zero if anything needs review so it
 * can gate CI later if you want.
 */
import { readFileSync } from "node:fs";

const MAX_MONTHS = 6;
const today = new Date().toISOString().slice(0, 10);

// Parse portalPresets.ts without a build step: pull each entry's id, verification,
// verifiedOn, and source.url via lightweight regex over the source file.
const src = readFileSync(new URL("../lib/portalPresets.ts", import.meta.url), "utf8");
const blocks = src.split(/\n  [a-z0-9"'-]+: \{/i).slice(1);

function monthsSince(iso) {
  if (!iso) return Infinity;
  const [y1, m1, d1] = iso.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  let m = (y2 - y1) * 12 + (m2 - m1);
  if (d2 < d1) m -= 1;
  return m;
}

const specs = blocks.map((b) => {
  const id = (b.match(/id:\s*"([^"]+)"/) || [])[1] ?? "?";
  const verification = (b.match(/verification:\s*"([^"]+)"/) || [])[1] ?? "none";
  const verifiedOn = (b.match(/verifiedOn:\s*"([^"]+)"/) || [])[1] ?? null;
  const url = (b.match(/source:\s*\{\s*url:\s*"([^"]+)"/) || [])[1] ?? null;
  return { id, verification, verifiedOn, url };
});

const needsReview = specs.filter(
  (s) =>
    s.verification !== "official" ||
    !s.verifiedOn ||
    monthsSince(s.verifiedOn) >= MAX_MONTHS
);

console.log(`\nSpec registry check — ${specs.length} specs, ${today}\n`);
if (needsReview.length === 0) {
  console.log("✓ All specs verified and within the review window.\n");
  process.exit(0);
}
console.log(`${needsReview.length} spec(s) NEED VERIFICATION against their official source:\n`);
for (const s of needsReview) {
  const reason =
    s.verification !== "official"
      ? `status=${s.verification}`
      : !s.verifiedOn
        ? "no verifiedOn date"
        : `last verified ${monthsSince(s.verifiedOn)} months ago`;
  console.log(`  • ${s.id.padEnd(16)} ${reason}`);
  console.log(`    source: ${s.url ?? "(none)"}`);
}
console.log(
  "\nTo clear: confirm the numbers on the source, then set verification:\"official\" + verifiedOn:\"YYYY-MM-DD\".\n"
);
process.exit(1);
