/**
 * Measurements of the built site for scripts/quality-gate.mjs. Each function
 * returns today's value in the same shape its fixture records, so the gate can
 * compare the two with the shared ratchet helpers.
 */
import { allHtmlFiles, readPage, readSitemap, typesOf } from "./html.mjs";
import { jaccard, nameWords, normalisedTokens, shingleKeys, unsharedWordCount, words } from "./shingles.mjs";
import fs from "node:fs";
import path from "node:path";

/**
 * Template families. Name normalisation is on where pages are one template
 * with a subject swapped in; blog posts and tools are written per page, so only
 * their numbers are masked.
 */
export const FAMILIES = {
  "exam-requirements": { matches: (route) => /^\/exam-requirements\/[^/]+\/$/.test(route), normaliseNames: true },
  "country-makers": { matches: (route) => /^\/[^/]+-photo-maker\/$/.test(route), normaliseNames: true },
  "country-guides": {
    matches: (route) =>
      ["/us-passport-photo/", "/uk-passport-photo/", "/canada-passport-photo/", "/schengen-visa-photo/"].includes(route),
    normaliseNames: true,
  },
  tools: { matches: (route) => /^\/tools\/[^/]+\/$/.test(route), normaliseNames: false },
  blog: { matches: (route) => /^\/blog\/[^/]+\/$/.test(route), normaliseNames: false },
};

/** Internal vocabulary counted in rendered copy (CLAUDE.md §3). */
export const RENDERED_JARGON = {
  stored: /\bstored\b/gi,
  "stored … target": /\bstored\s+(?:[\p{L}\p{N}×–-]+\s+){0,3}?targets?\b/giu,
  "selected stored": /\bselected\s+stored\b/gi,
  "selected target": /\bselected\s+target\b/gi,
  "compatibility-only": /\bcompatibility[-\s]only\b/gi,
  "compatibility target": /\bcompatibility\s+targets?\b/gi,
  "in this review": /\bin\s+this\s+review\b/gi,
  extracted: /\bextracted\b/gi,
  registry: /\bregistry\b/gi,
  preset: /\bpresets?\b/gi,
};

/** The most pages one FAQ question may appear on without a recorded entry. */
export const MAX_PAGES_PER_QUESTION = 3;

export function loadSite(exportRoot) {
  const sitemap = readSitemap(exportRoot);
  const pages = new Map(sitemap.map(({ route }) => [route, readPage(exportRoot, route)]));
  return { exportRoot, sitemap, pages };
}

function breadcrumbName(page) {
  const crumbs = page.jsonLd.find((node) => typesOf(node).includes("BreadcrumbList"));
  const items = crumbs?.itemListElement ?? [];
  return items.length ? String(items[items.length - 1].name ?? "") : page.h1;
}

/** Subject words: the breadcrumb name plus the URL slug ("us", "voter id"). */
function subjectOf(page) {
  const slug = page.route.split("/").filter(Boolean).pop() ?? "";
  return nameWords(`${breadcrumbName(page)} ${slug.replace(/-/g, " ")}`);
}

export function measureSimilarity(site) {
  const out = {};
  for (const [family, { matches, normaliseNames }] of Object.entries(FAMILIES)) {
    const routes = [...site.pages.keys()].filter(matches).sort();
    const tokens = new Map(
      routes.map((route) => {
        const page = site.pages.get(route);
        return [route, normalisedTokens(page.mainText, normaliseNames ? subjectOf(page) : new Set())];
      })
    );
    const shingles = new Map(routes.map((route) => [route, new Set(shingleKeys(tokens.get(route)))]));
    let max = { value: 0, pair: [] };
    for (let i = 0; i < routes.length; i += 1) {
      for (let j = i + 1; j < routes.length; j += 1) {
        const value = jaccard(shingles.get(routes[i]), shingles.get(routes[j]));
        if (value > max.value) max = { value, pair: [routes[i], routes[j]] };
      }
    }
    const unsharedWords = {};
    for (const route of routes) {
      const siblings = new Set();
      for (const other of routes) if (other !== route) for (const key of shingles.get(other)) siblings.add(key);
      unsharedWords[route] = unsharedWordCount(tokens.get(route), siblings);
    }
    out[family] = { pages: routes.length, maxJaccard: max.value, maxPair: max.pair, unsharedWords };
  }
  return out;
}

const faqQuestions = (page) =>
  page.jsonLd
    .filter((node) => typesOf(node).includes("FAQPage"))
    .flatMap((node) => [node.mainEntity ?? []].flat())
    .map((question) => String(question.name ?? ""));

/** Rendered FAQ questions (numbers masked) asked on more than the cap of indexed pages. */
export function measureSiteWideFaqDuplicates(site) {
  const routesByQuestion = new Map();
  for (const [route, page] of site.pages) {
    for (const question of faqQuestions(page)) {
      const key = question.toLowerCase().replace(/\d+(?:[.,]\d+)*/g, "#").replace(/\s+/g, " ").trim();
      if (!routesByQuestion.has(key)) routesByQuestion.set(key, new Set());
      routesByQuestion.get(key).add(route);
    }
  }
  return Object.fromEntries(
    [...routesByQuestion]
      .filter(([, routes]) => routes.size > MAX_PAGES_PER_QUESTION)
      .map(([question, routes]) => [question, routes.size])
  );
}

/** Text compared word-for-word, ignoring case, punctuation and spacing. */
const comparable = (text) => words(String(text ?? "").normalize("NFKC")).join(" ");

/** Structured-data policy breaches; there is no allowance for any of them. */
export function findStructuredDataProblems(site) {
  const problems = [];
  let checked = 0;
  for (const [route, page] of site.pages) {
    const visible = comparable(page.bodyText);
    const mustBeVisible = (kind, text) => {
      checked += 1;
      if (!visible.includes(comparable(text))) problems.push(`${route} — ${kind} in JSON-LD is not visible on the page: "${String(text).slice(0, 90)}"`);
    };
    for (const node of page.jsonLd) {
      const types = typesOf(node);
      if (types.includes("FAQPage")) {
        for (const question of [node.mainEntity ?? []].flat()) {
          mustBeVisible("FAQ question", question.name);
          mustBeVisible("FAQ answer", question.acceptedAnswer?.text);
        }
      }
      if (types.includes("BlogPosting") || types.includes("Article")) mustBeVisible("headline", node.headline);
      if (types.includes("BreadcrumbList")) for (const item of node.itemListElement ?? []) mustBeVisible("breadcrumb name", item.name);
      if (types.includes("SoftwareApplication") || types.includes("WebApplication")) {
        for (const offer of [node.offers ?? []].flat()) {
          if (String(offer.price) !== "0") problems.push(`${route} — ${types[0]} offer price is ${JSON.stringify(offer.price)}, not "0"`);
        }
      }
    }
  }
  for (const file of allHtmlFiles(site.exportRoot)) {
    const html = fs.readFileSync(file, "utf8");
    if (/"@type"\s*:\s*"(?:AggregateRating|Review|Rating)"|"(?:aggregateRating|reviewRating|ratingValue)"\s*:/.test(html)) {
      problems.push(`${path.relative(site.exportRoot, file)} — rating/review markup; easyPhoto has no reviews to mark up`);
    }
  }
  return { problems, checked };
}

/** Indexed pages whose JSON-LD dateModified is not their sitemap lastmod. */
export function measureDateModifiedVsLastmod(site) {
  const out = {};
  for (const { route, lastmod } of site.sitemap) {
    const modified = [...new Set(site.pages.get(route).jsonLd.map((node) => node.dateModified).filter(Boolean))].sort();
    if (modified.length && modified.some((date) => date !== lastmod)) {
      out[route] = { dateModified: modified.join(" / "), lastmod };
    }
  }
  return out;
}

/** `"<route> — <term>"` → uses in the page's title, meta description and main text. */
export function measureRenderedJargon(site) {
  const out = {};
  for (const [route, page] of site.pages) {
    const copy = [page.title, page.description, page.mainText].join("\n");
    for (const [term, pattern] of Object.entries(RENDERED_JARGON)) {
      const count = (copy.match(pattern) ?? []).length;
      if (count > 0) out[`${route} — ${term}`] = count;
    }
  }
  return out;
}

/**
 * Unverified exam pages whose "Photo requirement" card shows a KB figure
 * without saying it is our default. A verified page's provenance line reads
 * "Verified 16 Jul 2026"; any other exam page is unverified.
 */
export function measureUnverifiedRequirementCards(site) {
  const out = [];
  for (const [route, page] of site.pages) {
    const id = route.match(/^\/exam-requirements\/([^/]+)\/$/)?.[1];
    if (!id || /\bVerified \d{1,2} [A-Z][a-z]{2} \d{4}\b/.test(page.mainText)) continue;
    const card = page.mainText.match(/Photo requirement([\s\S]*?)(?:Signature requirement|$)/)?.[1] ?? "";
    if (/\d+\s*(?:KB|MB)\b/i.test(card) && !/easyPhoto default|not an? official limit/i.test(card)) {
      out.push(`${id}: requirementCard`);
    }
  }
  return out;
}
