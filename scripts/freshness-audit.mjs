/**
 * Exam content freshness audit.
 *
 *   node scripts/freshness-audit.mjs            # human-readable report
 *   node scripts/freshness-audit.mjs --md       # markdown (for the GitHub issue)
 *   AUDIT_TODAY=2026-07-01 node scripts/...      # pin "today" for testing
 *
 * WHY THIS EXISTS
 * ---------------
 * Freshness is a ranking signal, and exam pages spike in traffic right as a
 * notification/exam window approaches. This audit surfaces, on a cadence, the
 * pages that need a human to re-confirm against the official source BEFORE that
 * spike — prioritised by imminence, not just age.
 *
 * It NEVER changes spec numbers. A wrong KB/px value = a rejected application,
 * so verification stays human-in-the-loop: this tool tells you exactly what to
 * check, where, and which field to bump. It reads lib/examCalendar.ts and
 * lib/portalPresets.ts by lightweight regex (same no-build approach as
 * check-specs.mjs) so it has zero dependencies and runs anywhere.
 *
 * Exit code is non-zero when anything needs attention, so CI / the GitHub
 * Action can decide whether to open an issue.
 */
import { readFileSync } from "node:fs";

const MD = process.argv.includes("--md");
const TODAY = process.env.AUDIT_TODAY || new Date().toISOString().slice(0, 10);

// Tuning knobs — all in days.
const CYCLE_NOW_DAYS = 45; // cycle within this window → refresh the page now
const CYCLE_SOON_DAYS = 90; // heads-up window
const SPEC_STALE_DAYS = 180; // verifiedOn older than this → re-verify (≈6 months)

const dir = new URL("../lib/", import.meta.url);

// ── date helpers ────────────────────────────────────────────────────────────
const asDate = (iso) => new Date(`${iso}T00:00:00Z`);
const daysBetween = (aISO, bISO) =>
  Math.round((asDate(bISO) - asDate(aISO)) / 86_400_000);
const daysUntil = (iso) => daysBetween(TODAY, iso); // future → positive
const daysSince = (iso) => (iso ? daysBetween(iso, TODAY) : Infinity); // past → positive

// ── parse lib/portalPresets.ts (keyed objects) ──────────────────────────────
function loadSpecs() {
  const src = readFileSync(new URL("portalPresets.ts", dir), "utf8");
  const blocks = src.split(/\n {2}[a-z0-9"'-]+: \{/i).slice(1);
  return blocks.map((b) => ({
    id: (b.match(/id:\s*"([^"]+)"/) || [])[1] ?? "?",
    verification: (b.match(/verification:\s*"([^"]+)"/) || [])[1] ?? "none",
    verifiedOn: (b.match(/verifiedOn:\s*"([^"]+)"/) || [])[1] ?? null,
    url: (b.match(/source:\s*\{\s*url:\s*"([^"]+)"/) || [])[1] ?? null,
  }));
}

// ── parse lib/examCalendar.ts (array of objects) ────────────────────────────
function loadCalendar() {
  const src = readFileSync(new URL("examCalendar.ts", dir), "utf8");
  const arr = src.slice(
    src.indexOf("EXAM_CALENDAR"),
    src.indexOf("\n];", src.indexOf("EXAM_CALENDAR")),
  );
  return arr
    .split(/\n {2}\{/)
    .slice(1)
    .map((b) => ({
      id: (b.match(/id:\s*"([^"]+)"/) || [])[1] ?? "?",
      name: (b.match(/name:\s*"([^"]+)"/) || [])[1] ?? "?",
      window: (b.match(/window:\s*"([^"]+)"/) || [])[1] ?? "?",
      startISO: (b.match(/startISO:\s*"([^"]+)"/) || [])[1] ?? null,
      status: (b.match(/status:\s*"([^"]+)"/) || [])[1] ?? "?",
      specPath: (b.match(/specPath:\s*"([^"]+)"/) || [])[1] ?? null,
      url: (b.match(/url:\s*"([^"]+)"/) || [])[1] ?? null,
      verifiedOn: (b.match(/verifiedOn:\s*"([^"]+)"/) || [])[1] ?? null,
    }));
}

// portalId from a /exam-requirements/{id}/ path → links a cycle to its spec.
const portalIdFromPath = (p) =>
  (p && (p.match(/\/exam-requirements\/([^/]+)\//) || [])[1]) || null;

// ── build the report ────────────────────────────────────────────────────────
const specs = loadSpecs();
const specById = new Map(specs.map((s) => [s.id, s]));
const calendar = loadCalendar();

const isSpecStale = (s) =>
  !s || s.verification !== "official" || !s.verifiedOn || daysSince(s.verifiedOn) >= SPEC_STALE_DAYS;

const actNow = []; // cycles within CYCLE_NOW_DAYS
const soon = []; // cycles within CYCLE_SOON_DAYS
const past = []; // cycles already started → roll to next cycle
for (const e of calendar) {
  if (!e.startISO) continue;
  const d = daysUntil(e.startISO);
  const linkedSpec = specById.get(portalIdFromPath(e.specPath));
  const enriched = {
    ...e,
    daysUntil: d,
    specStale: isSpecStale(linkedSpec),
    linkedSpecId: linkedSpec?.id ?? portalIdFromPath(e.specPath),
  };
  if (d < 0) past.push(enriched);
  else if (d <= CYCLE_NOW_DAYS) actNow.push(enriched);
  else if (d <= CYCLE_SOON_DAYS) soon.push(enriched);
}
actNow.sort((a, b) => a.daysUntil - b.daysUntil);
soon.sort((a, b) => a.daysUntil - b.daysUntil);

// Stale specs NOT already surfaced by an imminent cycle.
const cycleSpecIds = new Set([...actNow, ...soon].map((e) => e.linkedSpecId));
const staleSpecs = specs
  .filter(isSpecStale)
  .filter((s) => !cycleSpecIds.has(s.id))
  .sort((a, b) => daysSince(b.verifiedOn) - daysSince(a.verifiedOn));

const actionCount = actNow.length + past.length + staleSpecs.length;

// ── render ──────────────────────────────────────────────────────────────────
const lines = [];
const h = (t) => lines.push(MD ? `\n## ${t}` : `\n${t}`);
const li = (t) => lines.push(MD ? `- ${t}` : `  • ${t}`);

lines.push(MD ? `# 🗓 Exam content freshness — ${TODAY}` : `\nExam content freshness — ${TODAY}`);
lines.push(
  `${actionCount === 0 ? "✅ Nothing needs attention." : `⚠️ ${actionCount} item(s) need a human review.`}`,
);
lines.push(
  MD
    ? `\n> Verify every number against the official source, then bump \`verifiedOn\` (and \`status\`/dates) in the file noted. Never change spec values from memory.`
    : "",
);

if (actNow.length) {
  h(`🔴 Refresh now — exam cycle within ${CYCLE_NOW_DAYS} days`);
  for (const e of actNow) {
    li(
      `**${e.name}** — ${e.window} (${e.daysUntil}d away) → ${MD ? `[${e.specPath}](https://easyphoto.in${e.specPath})` : e.specPath}`,
    );
    if (e.status === "tentative")
      lines.push(MD ? `  - confirm the exact date and set \`status: "confirmed"\` in \`lib/examCalendar.ts\`` : `      ↳ confirm exact date → status:"confirmed" (lib/examCalendar.ts)`);
    if (e.specStale)
      lines.push(MD ? `  - re-verify the **${e.linkedSpecId}** spec before the traffic spike, bump \`verifiedOn\` in \`lib/portalPresets.ts\`` : `      ↳ re-verify ${e.linkedSpecId} spec, bump verifiedOn (lib/portalPresets.ts)`);
    lines.push(MD ? `  - source: ${e.url}` : `      source: ${e.url}`);
  }
}

if (past.length) {
  h("⏮ Roll forward — exam date already passed");
  for (const e of past)
    li(`**${e.name}** — ${e.window} (${-e.daysUntil}d ago) → update \`lib/examCalendar.ts\` to the next cycle, source: ${e.url}`);
}

if (staleSpecs.length) {
  h(`🟠 Stale specs — last verified > ${Math.round(SPEC_STALE_DAYS / 30)} months ago`);
  for (const s of staleSpecs) {
    const reason =
      s.verification !== "official" ? `status=${s.verification}` : !s.verifiedOn ? "no verifiedOn" : `verified ${Math.round(daysSince(s.verifiedOn) / 30)} mo ago`;
    li(`**${s.id}** (${reason}) → ${MD ? `[/exam-requirements/${s.id}/](https://easyphoto.in/exam-requirements/${s.id}/)` : `/exam-requirements/${s.id}/`} · source: ${s.url ?? "(none)"}`);
  }
}

if (soon.length) {
  h(`🟡 Heads-up — exam cycle in ${CYCLE_NOW_DAYS}–${CYCLE_SOON_DAYS} days`);
  for (const e of soon) li(`${e.name} — ${e.window} (${e.daysUntil}d away)`);
}

lines.push("");
const out = lines.join("\n");
console.log(out);

// Machine-readable tail for CI / the Action.
console.log(MD ? `<!-- ACTION_NEEDED=${actionCount} -->` : `ACTION_NEEDED=${actionCount}`);
process.exit(actionCount > 0 ? 1 : 0);
