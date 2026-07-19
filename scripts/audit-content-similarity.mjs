import fs from "node:fs";
import path from "node:path";

const exportRoot = path.resolve(process.env.CONTENT_EXPORT_DIR || "out");
const sitemapFile = path.join(exportRoot, "sitemap.xml");
// TF-IDF discounts navigation/tool vocabulary repeated across the whole site.
// A 0.80 TF-IDF cosine threshold catches the known NDA/CDS clone while avoiding
// false positives caused only by a shared upload workspace. Override for audits.
const threshold = Number(process.env.CONTENT_SIMILARITY_LIMIT || 0.8);

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

function termFrequency(route) {
  const html = fs.readFileSync(htmlFile(route), "utf8");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const text = main
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .toLowerCase();
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

const documents = routes.map((route) => ({ route, terms: termFrequency(route) }));
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

pairs.sort((a, b) => b.score - a.score);
console.log(
  `Compared ${documents.length} indexed pages at TF-IDF cosine threshold ${threshold.toFixed(2)}.`
);
if (pairs.length) {
  console.error("Near-duplicate pairs:");
  for (const pair of pairs) {
    console.error(`${pair.score.toFixed(4)}  ${pair.left}  ${pair.right}`);
  }
  process.exit(1);
}

console.log("No indexed page pair meets or exceeds the similarity threshold.");
