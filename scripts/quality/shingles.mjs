/**
 * Name- and number-normalised 5-word shingles, ported from the 6 Oct 2026
 * guideline audit (sweep-guidelines/sim.py) and extended with the
 * normalisation it describes: two exam pages that differ only in the exam name
 * and the numbers are the same page to a reader, so they must measure as the
 * same page here.
 */

export const SHINGLE_SIZE = 5;
const NAME = "<name>";
const NUMBER = "<n>";

/**
 * Words that describe the document type rather than name the page's subject.
 * They are kept as ordinary words so "SSC Photo Size" and "CLAT Photo Size"
 * still share "photo size" — only the subject itself is masked.
 */
const GENERIC_NAME_WORDS = new Set([
  "a", "an", "and", "application", "card", "exam", "exams", "for", "form",
  "forms", "free", "guide", "in", "maker", "of", "on", "online", "passport",
  "photo", "photos", "requirement", "requirements", "resizer", "signature",
  "signatures", "size", "sizes", "the", "to", "tool", "visa",
]);

export function words(text) {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

/** The page's own subject words, taken from its breadcrumb or H1. */
export function nameWords(name) {
  return new Set(words(name).filter((word) => !GENERIC_NAME_WORDS.has(word) && !/\d/.test(word)));
}

/**
 * Tokens with the page subject collapsed to one `<name>` token (so "Staff
 * Selection Commission" and "SSC" align) and every number to `<n>`.
 */
export function normalisedTokens(text, subject) {
  const tokens = [];
  for (const word of words(text)) {
    const token = subject.has(word) ? NAME : /\d/.test(word) ? NUMBER : word;
    if (token === NAME && tokens[tokens.length - 1] === NAME) continue;
    tokens.push(token);
  }
  return tokens;
}

export function shingleKeys(tokens) {
  const keys = [];
  for (let i = 0; i + SHINGLE_SIZE <= tokens.length; i += 1) {
    keys.push(tokens.slice(i, i + SHINGLE_SIZE).join(" "));
  }
  return keys;
}

export function jaccard(a, b) {
  let shared = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const key of small) if (large.has(key)) shared += 1;
  const union = a.size + b.size - shared;
  return union === 0 ? 0 : shared / union;
}

/**
 * Words on a page that no shingle shared with a sibling covers — the text this
 * page says that its family does not.
 */
export function unsharedWordCount(tokens, siblingShingles) {
  const keys = shingleKeys(tokens);
  const covered = new Uint8Array(tokens.length);
  keys.forEach((key, start) => {
    if (!siblingShingles.has(key)) return;
    for (let i = start; i < start + SHINGLE_SIZE; i += 1) covered[i] = 1;
  });
  return covered.reduce((count, isCovered) => count + (isCovered ? 0 : 1), 0);
}
