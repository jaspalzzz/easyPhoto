#!/usr/bin/env node
/**
 * scripts/prepare-imgly-folder.mjs
 *
 * Downloads the @imgly/background-removal CPU-mode assets into a local folder
 * (./imgly-upload/imgly/) with the exact filenames R2 needs, so the whole
 * folder can be drag-dropped into the easyphoto-models bucket via the
 * Cloudflare dashboard.
 *
 * Why not wrangler? The local wrangler credential is bound to a DIFFERENT
 * Cloudflare account that coincidentally also has a bucket named
 * "easyphoto-models". The account that owns the models.easyphoto.in custom
 * domain (account 1476f4ecf60fd637fb5ee7e1258ae876) is not reachable with that
 * credential, so CLI upload lands in the wrong bucket. Dashboard drag-drop on
 * the correct account sidesteps the whole auth problem.
 *
 * Usage:
 *   node scripts/prepare-imgly-folder.mjs
 *
 * Then in the Cloudflare dashboard:
 *   R2 > easyphoto-models > Objects > drag the LOCAL "imgly" folder onto the
 *   bucket root. The 27 objects land under the imgly/ prefix automatically.
 *
 * Verify after upload:
 *   curl -I https://models.easyphoto.in/imgly/resources.json   -> 200 OK
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const IMGLY_VERSION = "1.7.0";
const IMGLY_CDN = `https://staticimgly.com/@imgly/background-removal-data/${IMGLY_VERSION}/dist/`;
const OUT_DIR = join(process.cwd(), "imgly-upload", "imgly");

// CPU-mode only — removeBackground() is never called with device:"gpu", so the
// jsep/WebGPU WASM variants are never fetched by the library at runtime.
const NEEDED_KEYS = [
  "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.mjs",
  "/models/isnet_fp16",
];

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n📦  Fetching imgly v${IMGLY_VERSION} resources manifest…`);
  const manifestRes = await fetch(`${IMGLY_CDN}resources.json`);
  if (!manifestRes.ok)
    throw new Error(`Failed to fetch resources.json: HTTP ${manifestRes.status}`);
  const allResources = await manifestRes.json();

  const filtered = {};
  for (const key of NEEDED_KEYS) {
    if (!allResources[key])
      throw new Error(`Key "${key}" not found in staticimgly resources.json`);
    filtered[key] = allResources[key];
  }

  // Collect unique chunk names (content-hashed; unique by definition).
  const uniqueChunks = new Map();
  for (const entry of Object.values(filtered)) {
    for (const chunk of entry.chunks) {
      if (!uniqueChunks.has(chunk.name)) {
        uniqueChunks.set(chunk.name, `${IMGLY_CDN}${chunk.name}`);
      }
    }
  }

  const total = uniqueChunks.size;
  const totalBytes = NEEDED_KEYS.reduce((s, k) => s + (filtered[k]?.size ?? 0), 0);
  console.log(`   ${total} chunk files (${mb(totalBytes)} uncompressed)\n`);

  let done = 0;
  for (const [chunkName, url] of uniqueChunks) {
    done++;
    process.stdout.write(`  [${String(done).padStart(2)}/${total}] ${chunkName.slice(0, 16)}…  `);
    const buf = await fetchBuffer(url);
    writeFileSync(join(OUT_DIR, chunkName), buf);
    console.log(`✓  (${mb(buf.length)})`);
  }

  // Trimmed manifest — only the 3 CPU-mode file entries.
  writeFileSync(join(OUT_DIR, "resources.json"), JSON.stringify(filtered));
  console.log(`\n  [resources.json]  ✓  (${NEEDED_KEYS.length} entries)`);

  console.log(`
✅  Done. ${total + 1} files written to:
      ${OUT_DIR}

Next (Cloudflare dashboard, on the account that owns models.easyphoto.in):
  1. R2 > easyphoto-models > Objects
  2. Drag the LOCAL "imgly" folder (${join(process.cwd(), "imgly-upload")}/imgly)
     onto the bucket root — objects land under the imgly/ prefix.
  3. Verify:  curl -I https://models.easyphoto.in/imgly/resources.json  -> 200
`);
}

main().catch((e) => {
  console.error("\n❌  Error:", e.message);
  process.exit(1);
});
