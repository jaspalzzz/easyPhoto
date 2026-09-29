/**
 * Site search index + matcher, shared by the inline ToolSearch box and the
 * ⌘K CommandPalette so the two can never drift apart again.
 *
 * Every path here must be a live, directly loadable URL — never a retired
 * route that only exists as a `public/_redirects` rule. Next's client router
 * fetches the RSC payload for the literal path it is given, which a host
 * redirect does not cover, so a retired path renders the 404 page in-app
 * (`/photo-resize-to-20kb/` did exactly that). test/toolSearch.test.ts guards
 * this against `_redirects`.
 */
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { MAKER_PAGES } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

export interface SearchItem {
  title: string;
  category: string;
  path: string;
  keywords: string[];
}

export interface SearchResult {
  results: SearchItem[];
  total: number;
}

/** KB targets offered as one-tap presets; the tools read them from `?target=`. */
export const PHOTO_KB_PRESETS = [10, 20, 30, 50, 100, 200] as const;
export const SIGNATURE_KB_PRESETS = [10, 20, 50, 100] as const;

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  MAKER_PAGES.forEach((maker) => {
    const spec = COUNTRY_SPECS[maker.countryId];
    if (!spec) return;
    const docType = maker.kind === "visa" ? "Visa" : "Passport";
    items.push({
      title: `${spec.label} ${docType} Photo Maker`,
      category: "Passport & Visa Specs",
      path: `/${maker.slug}/`,
      keywords: [spec.label, maker.kind, "photo", "spec", maker.countryId],
    });
  });

  TOOLS_CATALOG.forEach((group) => {
    group.tools.forEach((tool) => {
      if (!tool.ready) return;
      items.push({
        title: tool.title,
        category: group.group,
        path: `/tools/${tool.slug}/`,
        keywords: [tool.blurb, tool.slug],
      });
    });
  });

  // Every portal key has an /exam-requirements/<key>/ page with the resizer
  // embedded. The old /tools/form-resizer/<key>/ routes are host redirects —
  // several of them to the generic hub, which loses the exam the user asked for.
  Object.entries(PORTAL_PRESETS).forEach(([key, spec]) => {
    items.push({
      title: `${spec.name} Form Resizer`,
      category: "Government Portals",
      path: `/exam-requirements/${key}/`,
      keywords: [key, "form", "portal", "resizer", "exam", "photo", "signature"],
    });
  });

  PHOTO_KB_PRESETS.forEach((kb) => {
    items.push({
      title: `Resize Image to ${kb} KB`,
      category: "Image Compressors",
      path: `/tools/resize-kb/?target=${kb}`,
      keywords: ["photo", "image", "resize", "compress", `${kb}kb`, "size", "limit"],
    });
  });

  SIGNATURE_KB_PRESETS.forEach((kb) => {
    items.push({
      title: `Resize Signature to ${kb} KB`,
      category: "Signature Tools",
      path: `/tools/signature-resize/?target=${kb}`,
      keywords: ["signature", "sign", "resize", "compress", `${kb}kb`, "size", "limit", "transparent"],
    });
  });

  return items;
}

/**
 * Common misspellings and shorthand → one canonical word. Applied to both the
 * query and the index, so "jpeg" in a blurb and "jpg" in a query meet.
 */
const SYNONYMS: Readonly<Record<string, string>> = {
  aadhar: "aadhaar",
  adhar: "aadhaar",
  adhaar: "aadhaar",
  bg: "background",
  pic: "photo",
  pics: "photo",
  picture: "photo",
  pictures: "photo",
  photos: "photo",
  img: "image",
  images: "image",
  jpeg: "jpg",
  shrink: "compress",
  reduce: "compress",
  license: "licence",
};

/**
 * Filler words people type around the thing they want ("passport size photo",
 * "photo ka size kam kaise kare"). Dropped from the query so they can't veto a
 * match; the remaining words carry its meaning.
 */
const STOPWORDS = new Set([
  "a", "an", "the", "to", "for", "of", "in", "on", "and", "my", "me", "i",
  "how", "do", "online", "free", "maker", "tool", "tools", "size",
  "ka", "ki", "ke", "se", "kaise", "kare", "karein", "kam",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // "20 kb" / "20-kb" → "20kb" so a spaced size still matches its preset.
    .replace(/(\d+)\s*-?\s*kb\b/g, "$1kb")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((t) => SYNONYMS[t] ?? t);
}

/** Query → meaningful, canonicalised tokens. Exported for tests. */
export function queryTokens(query: string): string[] {
  return tokenize(query).filter((t) => !STOPWORDS.has(t));
}

interface PreparedItem {
  item: SearchItem;
  titleWords: string[];
  allWords: string[];
}

// Tokenise each index once, not on every keystroke.
const prepared = new WeakMap<readonly SearchItem[], PreparedItem[]>();

function prepare(index: readonly SearchItem[]): PreparedItem[] {
  let p = prepared.get(index);
  if (!p) {
    p = index.map((item) => {
      const titleWords = tokenize(item.title);
      return {
        item,
        titleWords,
        allWords: [...titleWords, ...tokenize(item.category), ...item.keywords.flatMap(tokenize)],
      };
    });
    prepared.set(index, p);
  }
  return p;
}

/**
 * A token matches a word when the word starts with it ("remov" → "remover"),
 * or — for tokens long enough not to cause noise — appears anywhere in it
 * ("resize" → "resizer"). Short tokens stay prefix-only so "pan" finds the PAN
 * card and not "japan".
 */
function tokenMatches(token: string, words: readonly string[]): boolean {
  return words.some((w) => w.startsWith(token) || (token.length >= 4 && w.includes(token)));
}

/**
 * Every query token must match somewhere in the item (AND semantics), so an
 * extra word narrows the list instead of emptying it. Title hits rank first.
 */
export function searchTools(index: readonly SearchItem[], query: string, limit: number): SearchResult {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return { results: [], total: 0 };

  const scored: { item: SearchItem; score: number; order: number }[] = [];
  prepare(index).forEach(({ item, titleWords, allWords }, order) => {
    if (!tokens.every((t) => tokenMatches(t, allWords))) return;
    const score = tokens.filter((t) => tokenMatches(t, titleWords)).length;
    scored.push({ item, score, order });
  });

  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return { results: scored.slice(0, limit).map((s) => s.item), total: scored.length };
}
