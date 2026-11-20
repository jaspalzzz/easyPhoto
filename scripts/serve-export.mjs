#!/usr/bin/env node
// Serve the static export (out/) with the cross-origin isolation headers that
// public/_headers gives each path, the way Cloudflare Pages does.
//
//   npm run build && node scripts/serve-export.mjs [port] [outDir]
//
// `next dev` and a plain file server send no such headers, so every page there
// is unisolated and the difference between an AI page and any other page
// cannot be seen. e2e/isolation-navigation.spec.ts starts this server.
//
// Only Cross-Origin-* headers are applied. The Content-Security-Policy in
// _headers upgrades requests to https, which a local http server cannot serve.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2]) || 39218;
const outDir = path.resolve(process.argv[3] || path.join(ROOT, "out"));
const headersFile = path.join(ROOT, "public", "_headers");

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  console.error(`No export at ${outDir}. Run "npm run build" first.`);
  process.exit(1);
}

/** [{ pattern: RegExp, headers: [name, value][] }] for Cross-Origin-* headers. */
function isolationRules() {
  const rules = [];
  let current = null;
  for (const line of fs.readFileSync(headersFile, "utf8").split("\n")) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    if (/^\S/.test(line)) {
      const escaped = line.trim().split("*").map((part) => part.replace(/[.?+^$()[\]{}|\\/]/g, "\\$&"));
      current = { pattern: new RegExp(`^${escaped.join(".*")}$`), headers: [] };
      rules.push(current);
      continue;
    }
    const header = line.trim().match(/^(Cross-Origin-[A-Za-z-]+):\s*(.+)$/);
    if (current && header) current.headers.push([header[1], header[2]]);
  }
  return rules.filter((rule) => rule.headers.length > 0);
}

const RULES = isolationRules();

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

function resolveFile(urlPath) {
  const file = path.join(outDir, urlPath);
  if (!file.startsWith(outDir)) return null;
  const candidates = urlPath.endsWith("/") ? [path.join(file, "index.html")] : [file, `${file}.html`];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  const file = resolveFile(urlPath);
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const headers = { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" };
  for (const rule of RULES) {
    if (!rule.pattern.test(urlPath)) continue;
    for (const [name, value] of rule.headers) headers[name] = value;
  }
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`serve-export: http://127.0.0.1:${port} (${RULES.length} isolated path rules)`);
});
