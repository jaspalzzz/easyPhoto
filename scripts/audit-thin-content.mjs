import fs from "node:fs";
import path from "node:path";

const exportRoot = path.resolve(process.env.CONTENT_EXPORT_DIR || "out");
const sitemapFile = path.join(exportRoot, "sitemap.xml");
// Total visible words is a weak signal: a page can clear it entirely on shared
// template furniture — the same FAQ, privacy line and related-tool blurbs that
// appear on dozens of pages. Two "low value content" rejections landed while
// every page passed a 300-word total.
//
// So the gate measures UNIQUE editorial words: visible words in sentences that
// do not appear on three or more other indexed pages. That is the copy actually
// written for this page. The total is still reported, because a page can be
// unique and still too slight.
const minimumWords = Number(process.env.MIN_BODY_WORDS || 300);
const minimumUniqueWords = Number(process.env.MIN_UNIQUE_WORDS || 300);

// Required disclosure pages. Their job is to state a policy plainly, not to
// carry editorial depth, and padding them would make them worse. They are kept
// indexed deliberately — an ad reviewer looks for them — so they are exempt from
// the unique-copy floor while still held to the visible-words floor.
const DISCLOSURE_PAGES = new Set([
  "/contact/",
  "/terms/",
  "/disclaimer/",
  "/editorial-policy/",
  "/corrections-policy/",
  "/source-methodology/",
  "/how-photo-checking-works/",
  "/authors/jaspal-kumar/",
]);
/** A sentence appearing on at least this many pages is treated as furniture. */
const sharedPageThreshold = Number(process.env.SHARED_SENTENCE_PAGES || 3);

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

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter((line) => line.split(" ").length >= 6);
}

const pages = routes.map((route) => {
  const file = htmlFile(route);
  if (!fs.existsSync(file)) return { route, missing: true, text: "" };
  return { route, missing: false, text: visibleMainText(fs.readFileSync(file, "utf8")) };
});

// How many pages each sentence appears on.
const sentencePages = new Map();
for (const page of pages) {
  for (const sentence of new Set(sentences(page.text))) {
    sentencePages.set(sentence, (sentencePages.get(sentence) || 0) + 1);
  }
}

const results = pages.map((page) => {
  if (page.missing) return { route: page.route, words: 0, unique: 0, missing: true };
  const unique = sentences(page.text)
    .filter((sentence) => (sentencePages.get(sentence) || 0) < sharedPageThreshold)
    .join(" ");
  return {
    route: page.route,
    words: wordCount(page.text),
    unique: wordCount(unique),
    missing: false,
  };
});

const failures = results
  .filter(
    ({ route, words, unique, missing }) =>
      missing ||
      words < minimumWords ||
      (unique < minimumUniqueWords && !DISCLOSURE_PAGES.has(route))
  )
  .sort((a, b) => a.unique - b.unique);

console.log(
  `Scanned ${results.length} indexed pages; floors: ${minimumWords} visible words, ` +
    `${minimumUniqueWords} unique (sentences on fewer than ${sharedPageThreshold} pages).`
);
if (failures.length) {
  console.error("Pages below a floor (unique / total):");
  for (const result of failures) {
    console.error(
      `${String(result.unique).padStart(4)} / ${String(result.words).padEnd(5)} ${result.route}`
    );
  }
  process.exit(1);
}

console.log("All indexed pages carry enough of their own editorial copy.");
