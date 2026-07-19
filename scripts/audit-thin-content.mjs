import fs from "node:fs";
import path from "node:path";

const exportRoot = path.resolve(process.env.CONTENT_EXPORT_DIR || "out");
const sitemapFile = path.join(exportRoot, "sitemap.xml");
const minimumWords = Number(process.env.MIN_BODY_WORDS || 300);

if (!fs.existsSync(sitemapFile)) {
  console.error(`Missing ${sitemapFile}; run npm run build first.`);
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapFile, "utf8");
const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(.*?)<\/loc>/g)].map(
  (match) => match[1] || "/"
);

function htmlFile(route) {
  if (route === "/") return path.join(exportRoot, "index.html");
  const directoryFile = path.join(exportRoot, route, "index.html");
  if (fs.existsSync(directoryFile)) return directoryFile;
  return path.join(exportRoot, `${route.replace(/\/$/, "")}.html`);
}

function visibleMainText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  return main
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&[a-z0-9#]+;/gi, " ");
}

function wordCount(text) {
  return (text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []).length;
}

const results = routes.map((route) => {
  const file = htmlFile(route);
  if (!fs.existsSync(file)) return { route, words: 0, missing: true };
  return {
    route,
    words: wordCount(visibleMainText(fs.readFileSync(file, "utf8"))),
    missing: false,
  };
});

const failures = results
  .filter(({ words, missing }) => missing || words < minimumWords)
  .sort((a, b) => a.words - b.words);

console.log(
  `Scanned ${results.length} indexed pages; minimum visible body copy: ${minimumWords} words.`
);
if (failures.length) {
  console.error("Pages below the body-copy floor:");
  for (const result of failures) {
    console.error(`${String(result.words).padStart(4)}  ${result.route}`);
  }
  process.exit(1);
}

console.log("All indexed pages meet the visible body-copy floor.");
