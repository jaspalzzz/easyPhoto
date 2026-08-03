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
// Two numbers, and the gap between them is the point.
//
// `minimumUniqueWords` BLOCKS. It is set where a page has essentially nothing of
// its own — template with the name swapped — and every indexed page currently
// clears it.
//
// `targetUniqueWords` does NOT block; it is reported every run. On the current
// site 72 of 156 indexed pages fall below it, concentrated in the exam family
// and the remaining country makers. The exact count is recorded in
// scripts/adsense-readiness-baseline.json rather than restated here, so the
// comment cannot drift out of date against the gate. That gap is the honest state of the content and the work still to
// do, and it is printed rather than hidden behind a passing gate. Raise the
// blocking floor as the number comes down; do not lower the target to match it.
const minimumUniqueWords = Number(process.env.MIN_UNIQUE_WORDS || 50);
const targetUniqueWords = Number(process.env.TARGET_UNIQUE_WORDS || 300);

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
/**
 * A normalised shingle appearing on at least this many pages is furniture.
 *
 * Two, not three. A threshold of three exempts pairwise duplication, which is
 * precisely the failure this project keeps hitting — Spain/Portugal,
 * Canada passport/visa, NDA/CDS, UGC-NET/CSIR-NET were all pairs. At three,
 * every page cleared the floor; at two, Spain, Portugal and Kuwait drop to
 * 37, 39 and 42 unshared words.
 */
const sharedPageThreshold = Number(process.env.SHARED_SENTENCE_PAGES || 2);

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

/**
 * Normalise the tokens that vary between otherwise identical template output.
 *
 * Comparing whole sentences for exact equality was too easy to defeat: swapping
 * an exam name or a KB figure made the same generated paragraph count as
 * original on both pages. Numbers collapse to #, and the page's own slug words
 * collapse to a placeholder, so "SSC is conducted by..." and "IBPS is conducted
 * by..." normalise to the same string.
 */
// Words that appear in almost every slug in a family. Replacing them would
// blank out ordinary prose ("visa photo requirements") rather than the
// distinguishing token, and they already match across templates on their own.
const GENERIC_SLUG_WORDS = new Set([
  "exam", "requirements", "photo", "photos", "visa", "maker", "passport",
  "tools", "blog", "size", "online", "free", "india", "indian",
]);

/**
 * Normalise tokens that vary between otherwise identical template output.
 *
 * Operates on TOKENS, not substrings. Replacing substrings meant a slug word
 * like "net" also rewrote the middle of "internet", corrupting unrelated prose
 * and inflating the shared count in a way nobody could trace.
 */
function normaliseTokens(text, route) {
  const slugWords = new Set(
    route
      .split("/")
      .filter(Boolean)
      .flatMap((segment) => segment.split("-"))
      .map((word) => word.toLowerCase())
      .filter((word) => word.length > 2 && !GENERIC_SLUG_WORDS.has(word)),
  );
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).map((token) =>
    slugWords.has(token) ? "@" : /^[\p{N}]+$/u.test(token) ? "#" : token,
  );
}

/**
 * Overlapping word windows rather than sentences.
 *
 * Sentence boundaries are themselves editable — splitting one templated
 * sentence in two made both halves look new. Shingles slide across the whole
 * page, so shared prose is detected wherever it sits.
 */
// 8 tested against 6 and 10: the below-target count moves 77 / 72 / 70 and the
// same families stay weakest (exam pages and Schengen-family makers), so the
// conclusion is not an artefact of the window size. 8 sits in the middle.
const SHINGLE = 8;

function shingles(words) {
  const out = [];
  for (let i = 0; i + SHINGLE <= words.length; i++) {
    out.push(words.slice(i, i + SHINGLE).join(" "));
  }
  return out;
}

const pages = routes.map((route) => {
  const file = htmlFile(route);
  if (!fs.existsSync(file)) return { route, missing: true, text: "" };
  return { route, missing: false, text: visibleMainText(fs.readFileSync(file, "utf8")) };
});

const tokenised = pages.map((page) => ({
  ...page,
  tokens: page.missing ? [] : normaliseTokens(page.text, page.route),
}));

// How many pages each normalised shingle appears on.
const shinglePages = new Map();
for (const page of tokenised) {
  for (const shingle of new Set(shingles(page.tokens))) {
    shinglePages.set(shingle, (shinglePages.get(shingle) || 0) + 1);
  }
}

const results = tokenised.map((page) => {
  if (page.missing) return { route: page.route, words: 0, unique: 0, missing: true };
  // A word is shared if any window covering it appears on enough other pages.
  const shared = new Array(page.tokens.length).fill(false);
  shingles(page.tokens).forEach((shingle, start) => {
    if ((shinglePages.get(shingle) || 0) >= sharedPageThreshold) {
      for (let i = start; i < start + SHINGLE; i++) shared[i] = true;
    }
  });
  return {
    route: page.route,
    words: wordCount(page.text),
    unique: shared.filter((isShared) => !isShared).length,
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

const belowTarget = results
  .filter((r) => !r.missing && r.unique < targetUniqueWords)
  .sort((a, b) => a.unique - b.unique);

console.log(
  `Scanned ${results.length} indexed pages; blocking floors: ${minimumWords} visible ` +
    `words, ${minimumUniqueWords} unshared (words outside ${SHINGLE}-word windows ` +
    `repeated on ${sharedPageThreshold}+ pages, exam names and figures normalised).`
);
console.log(
  `Below the ${targetUniqueWords}-unshared target (reported, not blocking): ` +
    `${belowTarget.length} of ${results.length} pages.` +
    (belowTarget.length
      ? ` Thinnest: ${belowTarget
          .slice(0, 3)
          .map((r) => `${r.route} ${r.unique}/${r.words}`)
          .join(", ")}`
      : "")
);
if (failures.length) {
  console.error("Pages below a floor (unshared / total):");
  for (const result of failures) {
    console.error(
      `${String(result.unique).padStart(4)} / ${String(result.words).padEnd(5)} ${result.route}`
    );
  }
  process.exit(1);
}

console.log("All indexed pages carry enough unshared body copy.");
