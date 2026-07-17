/**
 * Spec verification checklist.
 *
 *   node scripts/check-specs.mjs
 *
 * Fails for stale/undated official specs and for needs-review presets that do
 * not document a source plus an explicit current-instructions disclosure.
 * A documented needs-review preset remains visible in the report but does not
 * block CI: uncertainty is allowed only when it is sourced and disclosed.
 */
import { readFileSync } from "node:fs";

const MAX_MONTHS = 6;
const today = new Date().toISOString().slice(0, 10);

// Parse portalPresets.ts without a build step: pull each entry's id, verification,
// verifiedOn, source metadata and review disclosure via lightweight regex over
// the source file.
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
  const sourceBlock = (b.match(/source:\s*\{([\s\S]*?)\}/) || [])[1] ?? "";
  const url = (sourceBlock.match(/url:\s*"([^"]+)"/) || [])[1] ?? null;
  const sourceLabel = (sourceBlock.match(/label:\s*"([^"]+)"/) || [])[1] ?? null;
  const hasCurrentDisclosure =
    /\b(?:confirm|check|verify)\b[\s\S]{0,120}\b(?:current|latest)\b/i.test(b) ||
    /\b(?:current|latest)\b[\s\S]{0,120}\b(?:confirm|check|verify)\b/i.test(b);
  return { id, verification, verifiedOn, url, sourceLabel, hasCurrentDisclosure };
});

const documentedReviews = specs.filter(
  (s) =>
    s.verification === "needs-review" &&
    /^https?:\/\//.test(s.url ?? "") &&
    !!s.sourceLabel &&
    s.hasCurrentDisclosure
);

/**
 * An "official · Verified {date} · {source}" badge is a promise that someone
 * checked the number against a document. A bare homepage cannot evidence a KB
 * band or a pixel dimension — you cannot open it and find the claim.
 *
 * NDA and CDS both cited only "https://upsconline.nic.in" while asserting a
 * 350x450 photo and a 10-50 KB signature. UPSC's actual instruction PDF, which
 * governs "any examination" on that portal, publishes no photo pixel spec and
 * requires 20-100 KB — so a signature built to our band was rejectable. The
 * homepage citation is what let an unverifiable claim look verified.
 *
 * This is a ratchet, not a wall: the existing backlog is grandfathered so the
 * build keeps working, but the count can only go down. Re-verify a spec against
 * a real document and lower the baseline.
 */
const isBareDomain = (url) => {
  try {
    return new URL(url).pathname.replace(/\/+$/, "") === "";
  } catch {
    return false;
  }
};
const undocumented = specs.filter(
  (s) => s.verification === "official" && s.url && isBareDomain(s.url)
);
const UNDOCUMENTED_BASELINE = 11;

const blocking = specs.filter((s) => {
  if (s.verification === "official") {
    return !s.verifiedOn || monthsSince(s.verifiedOn) >= MAX_MONTHS;
  }
  if (s.verification === "needs-review") {
    return !documentedReviews.includes(s);
  }
  return true;
});

console.log(`\nSpec registry check — ${specs.length} specs, ${today}\n`);

if (undocumented.length > UNDOCUMENTED_BASELINE) {
  console.log(
    `${undocumented.length} official specs cite only a homepage, up from the ${UNDOCUMENTED_BASELINE} already known.\n` +
      `An "official · Verified" badge needs a document you can open and find the number in.\n`
  );
  for (const s of undocumented) console.log(`  • ${s.id.padEnd(16)} ${s.url}`);
  console.log("\nCite the actual notice/instruction PDF, or mark the spec needs-review.\n");
  process.exit(1);
}
if (undocumented.length > 0) {
  console.log(
    `⚠ ${undocumented.length} official specs cite only a homepage, so their "Verified" badge is not ` +
      `evidenced (baseline ${UNDOCUMENTED_BASELINE}; this count may not grow):`
  );
  console.log(`  ${undocumented.map((s) => s.id).join(", ")}\n`);
}

if (blocking.length === 0) {
  const officialCount = specs.filter((s) => s.verification === "official").length;
  console.log(`✓ ${officialCount} official specs are dated and within the review window.`);
  if (documentedReviews.length > 0) {
    console.log(
      `✓ ${documentedReviews.length} needs-review preset(s) have a documented source and current-instructions disclosure:`
    );
    for (const s of documentedReviews) {
      console.log(`  • ${s.id.padEnd(16)} source: ${s.url}`);
    }
  }
  console.log("");
  process.exit(0);
}
console.log(`${blocking.length} spec(s) BLOCK THE REGISTRY CHECK:\n`);
for (const s of blocking) {
  let reason;
  if (s.verification === "official") {
    reason = !s.verifiedOn
      ? "official status has no verifiedOn date"
      : `official verification is ${monthsSince(s.verifiedOn)} months old`;
  } else if (s.verification === "needs-review") {
    const missing = [];
    if (!/^https?:\/\//.test(s.url ?? "")) missing.push("source URL");
    if (!s.sourceLabel) missing.push("source label");
    if (!s.hasCurrentDisclosure) missing.push("current-instructions disclosure");
    reason = `needs-review is undocumented: missing ${missing.join(", ")}`;
  } else {
    reason = `unsupported verification status=${s.verification}`;
  }
  console.log(`  • ${s.id.padEnd(16)} ${reason}`);
  console.log(`    source: ${s.url ?? "(none)"}`);
}
console.log(
  "\nTo clear: date a confirmed official spec, or document a needs-review source and explicitly tell users to confirm the current instructions.\n"
);
process.exit(1);
