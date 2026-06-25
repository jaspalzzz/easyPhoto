#!/usr/bin/env node
/**
 * scripts/upload-imgly-to-r2.mjs
 *
 * One-time setup: downloads the @imgly/background-removal assets needed for
 * the isnet_fp16 CPU fallback and uploads them to Cloudflare R2, so
 * staticimgly.com can be removed from the CSP connect-src.
 *
 * Only the CPU-mode files are fetched (no jsep/WebGPU variants):
 *   - /onnxruntime-web/ort-wasm-simd-threaded.wasm  (~11 MB, 3 chunks)
 *   - /onnxruntime-web/ort-wasm-simd-threaded.mjs   (tiny, 1 chunk)
 *   - /models/isnet_fp16                             (~84 MB, 22 chunks)
 * Total: ~26 chunk files + 1 trimmed resources.json = 27 R2 objects.
 *
 * Usage:
 *   node scripts/upload-imgly-to-r2.mjs <bucket-name>
 *   node scripts/upload-imgly-to-r2.mjs <bucket-name> --account-id <CF_ACCOUNT_ID>
 *
 * Prerequisites:
 *   - npx wrangler@latest (no global install needed)
 *   - wrangler authenticated: npx wrangler login  — OR —
 *     CLOUDFLARE_API_TOKEN env var set (preferred in CI)
 *   - The R2 bucket already has the public domain models.easyphoto.in bound
 *
 * After running this script, verify:
 *   curl -I https://models.easyphoto.in/imgly/resources.json   → 200 OK
 *
 * THEN commit the code changes:
 *   lib/segmentation.ts  — publicPath added to removeBackground() call
 *   public/_headers      — staticimgly.com removed from connect-src
 */

import { execSync } from "child_process";
import { writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const IMGLY_VERSION = "1.7.0";
const IMGLY_CDN = `https://staticimgly.com/@imgly/background-removal-data/${IMGLY_VERSION}/dist/`;
const R2_PREFIX = "imgly";

// CPU-mode only: skip jsep (WebGPU) WASM variants — we call removeBackground()
// without device:"gpu" so those files are never fetched by the library.
const NEEDED_KEYS = [
  "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.mjs",
  "/models/isnet_fp16",
];

// ─── CLI args ────────────────────────────────────────────────────────────────

const bucket = process.argv[2];
if (!bucket) {
  console.error(
    "Usage: node scripts/upload-imgly-to-r2.mjs <bucket-name> [--account-id <id>]"
  );
  process.exit(1);
}
// Forward extra args (--account-id, etc.) verbatim to wrangler.
const extraArgs = process.argv.slice(3).join(" ");

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function wranglerPut(r2Key, tmpFile, contentType = "") {
  const ct = contentType ? `--content-type "${contentType}"` : "";
  execSync(
    `npx --yes wrangler r2 object put "${bucket}/${r2Key}" --file "${tmpFile}" ${ct} ${extraArgs}`.trim(),
    { stdio: "pipe" }
  );
}

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📦  Fetching imgly v${IMGLY_VERSION} resources manifest…`);
  const manifestRes = await fetch(`${IMGLY_CDN}resources.json`);
  if (!manifestRes.ok)
    throw new Error(`Failed to fetch resources.json: HTTP ${manifestRes.status}`);
  const allResources = await manifestRes.json();

  // Filter to CPU-mode files only and validate they exist.
  const filtered = {};
  for (const key of NEEDED_KEYS) {
    if (!allResources[key])
      throw new Error(`Key "${key}" not found in staticimgly resources.json`);
    filtered[key] = allResources[key];
  }

  // Deduplicate chunk names (chunk hashes are unique by content; no two files
  // share a chunk, but deduplicate defensively).
  const uniqueChunks = new Map(); // name → { url, size }
  for (const [fileKey, entry] of Object.entries(filtered)) {
    for (const chunk of entry.chunks) {
      if (!uniqueChunks.has(chunk.name)) {
        uniqueChunks.set(chunk.name, {
          url: `${IMGLY_CDN}${chunk.name}`,
          fileKey,
        });
      }
    }
  }

  const total = uniqueChunks.size;
  const totalBytes = NEEDED_KEYS.reduce(
    (s, k) => s + (filtered[k]?.size ?? 0),
    0
  );
  console.log(
    `   ${total} chunk files to upload  (${mb(totalBytes)} uncompressed)\n`
  );

  // ── Upload chunks ──────────────────────────────────────────────────────────
  let done = 0;
  const tmpFile = join(tmpdir(), "imgly-chunk.bin");
  for (const [chunkName, { url }] of uniqueChunks) {
    done++;
    const shortName = chunkName.slice(0, 16) + "…";
    process.stdout.write(`  [${String(done).padStart(2)}/${total}] ${shortName}  `);

    const buf = await fetchBuffer(url);
    writeFileSync(tmpFile, buf);
    wranglerPut(`${R2_PREFIX}/${chunkName}`, tmpFile);
    rmSync(tmpFile, { force: true });

    console.log(`✓  (${mb(buf.length)})`);
  }

  // ── Upload trimmed resources.json ──────────────────────────────────────────
  const resourcesTmp = join(tmpdir(), "imgly-resources.json");
  writeFileSync(resourcesTmp, JSON.stringify(filtered));
  process.stdout.write(`\n  [resources.json]  `);
  wranglerPut(`${R2_PREFIX}/resources.json`, resourcesTmp, "application/json");
  rmSync(resourcesTmp, { force: true });
  console.log(`✓  (${NEEDED_KEYS.length} entries)`);

  // ── Verify ────────────────────────────────────────────────────────────────
  console.log("\n🔍  Verifying resources.json is publicly reachable…");
  const check = await fetch(
    `https://models.easyphoto.in/${R2_PREFIX}/resources.json`
  );
  if (check.ok) {
    const body = await check.json();
    const keys = Object.keys(body);
    console.log(`   ✅  Reachable — ${keys.length} entries: ${keys.join(", ")}`);
  } else {
    console.warn(
      `   ⚠️  HTTP ${check.status} — the file may still be propagating, or the public domain isn't bound to this bucket.`
    );
  }

  console.log(`
✅  imgly assets uploaded to R2 bucket "${bucket}" under "${R2_PREFIX}/".

Next steps (do these AFTER verifying the URL above returns 200):
  1. git add lib/segmentation.ts public/_headers
  2. git commit -m "feat: self-host imgly on R2, remove staticimgly.com from CSP"
  3. Move to production as usual.
`);
}

main().catch((e) => {
  console.error("\n❌  Error:", e.message);
  process.exit(1);
});
