import fs from "node:fs";
import path from "node:path";

const exportRoot = path.resolve(process.env.CONTENT_EXPORT_DIR || "out");
const sitemapFile = path.join(exportRoot, "sitemap.xml");
// TF-IDF discounts navigation/tool vocabulary repeated across the whole site.
//
// The gate was 0.80 and its comment claimed that caught "the known NDA/CDS
// clone". It could not: that pair measured 0.7301, so the check passed while the
// duplication it was written for sat untouched through two low-value-content
// rejections. 0.70 is the top of the band an external audit recommended; every
// indexed pair now measures below it, the worst being 0.6749.
const threshold = Number(process.env.CONTENT_SIMILARITY_LIMIT || 0.7);

// Cosine similarity compares whole pages, so it cannot see a paragraph repeated
// WITHIN one page. NDA and CDS each printed the same authority paragraph twice —
// once in the intro and again inside the embedded tool — which inflates length
// without adding anything a reader can use.
const repeatLimit = Number(process.env.REPEATED_SENTENCE_LIMIT || 1);

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

function visibleText(route) {
  const html = fs.readFileSync(htmlFile(route), "utf8");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  return main
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .toLowerCase();
}

function termFrequency(text) {
  const frequencies = new Map();
  for (const word of text.match(/[\p{L}\p{N}]+/gu) || []) {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }
  return frequencies;
}

function cosine(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const value of a.values()) normA += value * value;
  for (const value of b.values()) normB += value * value;
  for (const [word, value] of a) dot += value * (b.get(word) || 0);
  return dot / Math.sqrt(normA * normB);
}

const documents = routes.map((route) => {
  const text = visibleText(route);
  return { route, text, terms: termFrequency(text) };
});
const documentFrequency = new Map();
for (const document of documents) {
  for (const word of document.terms.keys()) {
    documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1);
  }
}

for (const document of documents) {
  const weighted = new Map();
  for (const [word, count] of document.terms) {
    const tf = 1 + Math.log(count);
    const idf = Math.log(
      (documents.length + 1) / ((documentFrequency.get(word) || 0) + 1)
    );
    weighted.set(word, tf * idf);
  }
  document.terms = weighted;
}
const pairs = [];
for (let left = 0; left < documents.length; left += 1) {
  for (let right = left + 1; right < documents.length; right += 1) {
    const score = cosine(documents[left].terms, documents[right].terms);
    if (score >= threshold) {
      pairs.push({ left: documents[left].route, right: documents[right].route, score });
    }
  }
}

// ── Repeated sentences inside a single page ────────────────────────────────
const repeats = [];
for (const doc of documents) {
  const seen = new Map();
  for (const sentence of doc.text.split(/(?<=[.!?])\s+/)) {
    const normalized = sentence.trim().toLowerCase().replace(/\s+/g, " ");
    // Short lines are labels and headings, not prose.
    if (normalized.split(" ").length < 12) continue;
    seen.set(normalized, (seen.get(normalized) || 0) + 1);
  }
  const worst = [...seen.entries()].filter(([, n]) => n > repeatLimit);
  if (worst.length) {
    repeats.push({
      route: doc.route,
      count: worst.length,
      sample: worst[0][0].slice(0, 90),
    });
  }
}

pairs.sort((a, b) => b.score - a.score);
console.log(
  `Compared ${documents.length} indexed pages at TF-IDF cosine threshold ${threshold.toFixed(2)}.`
);
let failed = false;
if (pairs.length) {
  console.error("Near-duplicate pairs:");
  for (const pair of pairs) {
    console.error(`${pair.score.toFixed(4)}  ${pair.left}  ${pair.right}`);
  }
  failed = true;
}
if (repeats.length) {
  console.error("Pages repeating their own paragraphs:");
  for (const repeat of repeats) {
    console.error(`  ${repeat.route}  (${repeat.count}x)  "${repeat.sample}…"`);
  }
  failed = true;
}
if (failed) process.exit(1);

console.log(
  "No indexed page pair meets the similarity threshold, and no page repeats its own paragraphs."
);
