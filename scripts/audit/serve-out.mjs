// Serves the static export (out/) for the output audit, like Cloudflare Pages:
// "/path/" → out/path/index.html. Local only; no redirects or headers.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.env.AUDIT_ROOT || "out");
const port = Number(process.env.AUDIT_PORT) || 39317;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".wasm": "application/wasm",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = path.join(root, url);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "content-type": "text/html" });
      return fs.createReadStream(path.join(root, "404.html")).pipe(res);
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, "127.0.0.1", () => console.log(`audit server: ${root} on http://127.0.0.1:${port}`));
