// AdSense "low value content" check: how much of each indexed page's main text
// is its own. Repeats the 6 Oct 2026 readiness method on a static export:
// 8-word shingles of the main content (nav, header, footer and scripts removed);
// a page's originality = share of its shingles found on no other indexed page.
// Reports each page family's median, the pages under 60%, and the phrases that
// repeat across most exam-requirements pages (the templated-copy signal).
//
//   npm run build && node scripts/audit/originality.mjs            # local export
//   CONTENT_EXPORT_DIR=../other/out node scripts/audit/originality.mjs
import path from "node:path";
import { loadSite } from "../quality/measure.mjs";

const N = 8;
const site = loadSite(path.resolve(process.env.CONTENT_EXPORT_DIR || "out"));
const pages = [...site.pages].map(([route, page]) => ({ route, mainText: page.mainText ?? "" })).filter((p) => p.mainText);

const tokens = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
const shingles = (text) => {
  const t = tokens(text);
  const out = new Set();
  for (let i = 0; i + N <= t.length; i++) out.add(t.slice(i, i + N).join(" "));
  return out;
};

const byPage = new Map(pages.map((p) => [p.route, shingles(p.mainText)]));
const owners = new Map();
for (const set of byPage.values()) for (const s of set) owners.set(s, (owners.get(s) ?? 0) + 1);

const family = (route) =>
  route.startsWith("/exam-requirements/") && route !== "/exam-requirements/"
    ? "exam-requirements"
    : /-photo-maker\/$/.test(route)
      ? "photo-makers"
      : route.startsWith("/blog/") && route !== "/blog/"
        ? "blog"
        : route.startsWith("/tools/") && route !== "/tools/"
          ? "tools"
          : "other";

const rows = [...byPage].map(([route, set]) => {
  const unique = [...set].filter((s) => owners.get(s) === 1).length;
  return { route, family: family(route), shingles: set.size, original: set.size ? unique / set.size : 1 };
});

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor((s.length - 1) / 2)] : 0;
};
const pct = (x) => `${Math.round(x * 100)}%`;

console.log(`Originality (share of 8-word phrases unique to the page), ${rows.length} indexed pages\n`);
for (const fam of ["exam-requirements", "photo-makers", "tools", "blog", "other"]) {
  const r = rows.filter((x) => x.family === fam);
  if (!r.length) continue;
  console.log(`${fam.padEnd(18)} ${String(r.length).padStart(3)} pages   median ${pct(median(r.map((x) => x.original)))}   lowest ${pct(Math.min(...r.map((x) => x.original)))}`);
}

const low = rows.filter((r) => r.original < 0.6).sort((a, b) => a.original - b.original);
console.log(`\nPages under 60% original: ${low.length}`);
for (const r of low) console.log(`  ${pct(r.original).padStart(4)}  ${r.route}`);

const exam = rows.filter((r) => r.family === "exam-requirements").map((r) => r.route);
const examSets = exam.map((route) => byPage.get(route));
const common = new Map();
for (const set of examSets) for (const s of set) common.set(s, (common.get(s) ?? 0) + 1);
const threshold = Math.ceil(exam.length * 0.7);
const widespread = [...common].filter(([, n]) => n >= threshold);
console.log(`\nPhrases on ≥70% of the ${exam.length} exam pages: ${widespread.length}`);
if (process.env.SHOW_PHRASES) for (const [s, n] of widespread.sort((a, b) => b[1] - a[1])) console.log(`  ${n}  ${s}`);
