/**
 * Reachability check for every spec's cited source URL.
 *
 * Each spec page renders a "Confirm on official portal" link. That link is the
 * whole basis of the trust claim — it invites the user to check our numbers
 * against the authority. A link that 404s, times out, or trips a browser
 * certificate warning does the opposite: it makes a verified spec look invented.
 *
 * Government hosts rot constantly — certificates lapse, exam bodies rotate their
 * host each cycle (GATE moves to a new IIT annually), notices get re-filed. So
 * this cannot be a build gate: it needs network, and a transient timeout must
 * never block a deploy. Run it periodically and act on what it finds:
 *
 *   node scripts/check-links.mjs
 *
 * Exit code is always 0 — this reports, it does not police.
 */
import { readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const src = readFileSync(new URL("../lib/portalPresets.ts", import.meta.url), "utf8");

const specs = [];
for (const block of src.split(/\n  (?=[a-z0-9-]+: \{)/)) {
  const id = (block.match(/id:\s*"([^"]+)"/) || [])[1];
  const url = (block.match(/url:\s*"(https?:[^"]+)"/) || [])[1];
  const verification = (block.match(/verification:\s*"([^"]+)"/) || [])[1];
  if (id && url) specs.push({ id, url, verification });
}

const TIMEOUT_MS = 20000;

/**
 * Probe with curl, not fetch. Node builds its TLS chain differently and reports
 * UNABLE_TO_VERIFY_LEAF_SIGNATURE for hosts (upsconline.nic.in among them) that
 * curl and real browsers load without complaint. We are checking what a user
 * experiences, so the system trust store is the one that counts — a checker that
 * invents failures is worse than no checker, particularly this one.
 */
async function probe({ id, url, verification }) {
  try {
    const { stdout } = await run(
      "curl",
      [
        "-sSL", "--max-time", String(TIMEOUT_MS / 1000),
        "-o", "/dev/null", "-w", "%{http_code}",
        "-A", "Mozilla/5.0 (compatible; easyphoto-linkcheck)",
        url,
      ],
      { timeout: TIMEOUT_MS + 5000 }
    );
    const code = stdout.trim();
    return { id, url, verification, ok: code === "200", detail: `HTTP ${code}` };
  } catch (err) {
    // curl exits non-zero on TLS and DNS failures — the worst of the set, since
    // the user gets a full-page browser security interstitial rather than a 404.
    const msg = String(err.stderr || err.message || "").trim();
    const reason =
      /certificate has expired/i.test(msg) ? "CERTIFICATE EXPIRED"
      : /SSL certificate problem/i.test(msg) ? "TLS FAILURE"
      : /Could not resolve host/i.test(msg) ? "DNS: HOST DOES NOT RESOLVE"
      : /timed out/i.test(msg) ? "TIMED OUT"
      : msg.split("\n")[0].slice(0, 40) || "unreachable";
    return { id, url, verification, ok: false, detail: reason };
  }
}

const results = await Promise.all(specs.map(probe));
const broken = results.filter((r) => !r.ok);

console.log(`\nSource link check — ${specs.length} cited sources\n`);
if (broken.length === 0) {
  console.log("✓ every cited source URL is reachable.\n");
  process.exit(0);
}

console.log(`${broken.length} cited source(s) did not resolve to a 200:\n`);
for (const r of broken.sort((a, b) => a.id.localeCompare(b.id))) {
  console.log(`  • ${r.id.padEnd(16)} ${r.detail.padEnd(28)} ${r.verification ?? "-"}`);
  console.log(`    ${r.url}`);
}
console.log(
  `\nA 403 or timeout is often just the host refusing a scripted request — open it in a\n` +
    `browser before editing. A certificate error or 404 is real: users see it too.\n`
);
process.exit(0);
