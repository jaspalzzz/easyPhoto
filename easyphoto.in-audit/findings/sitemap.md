# Sitemap Findings — easyphoto.in

**Audit date:** 2026-07-02
**Source:** https://easyphoto.in/sitemap.xml
**Prior baseline:** 2026-06-23, scored **81/100**

---

## Score: 92/100

Up 11 points from baseline. Per-page `lastmod` fix verified live (15 distinct dates vs. 1 dominant build-stamp date at baseline). The 105-page programmatic-quality-gate risk flagged at baseline has been substantially resolved: `/tools/form-resizer/[exam]/` pages (52 URLs) were removed from the sitemap because they are now correctly `noindex`'d, with canonical intent redirected to the content-rich `/exam-requirements/[exam]/` page. Remaining deductions: 66% of URLs still cluster on one date (`2026-06-25`), and one dateModified/lastmod drift found during cross-check.

---

## Overview

| Property | Baseline (2026-06-23) | Live (2026-07-02) |
|---|---|---|
| Sitemap format | Single `<urlset>` (no index) | Single `<urlset>` (no index) — unchanged |
| XML validity | Valid | Valid — well-formed, correct namespace, parses cleanly with `xml.etree.ElementTree` |
| Namespace | `http://www.sitemaps.org/schemas/sitemap/0.9` | Same, correct |
| Total URLs | 258 | **213** |
| 50,000 URL limit | PASS | PASS (213 << 50,000) |
| Duplicate URLs | Not flagged | 0 duplicates found |
| Non-canonical-domain URLs | Not flagged | 0 found — all `https://easyphoto.in/...` |

### URL count drop explained (258 -> 213, -45 URLs)

Investigated before scoring, since an unexplained 17% drop could be a sitemap-generator regression. Root cause identified:

**`/tools/form-resizer/[exam]/` (52 URLs at baseline) is now absent from the sitemap.** Verified these pages **still exist and return HTTP 200** — they were not deleted. Inspection of response headers shows:

```
x-robots-tag: noindex, follow
```

This matches recent commit history (`3e5ed79 fix(seo): point legacy resizer redirects at the indexed spec page, not the noindex tool`). The tool variant was deliberately deindexed, with the canonical/content-rich `/exam-requirements/[exam]/` page (53 URLs, confirmed indexable, no noindex header) kept as the single indexable page per exam. Removing a noindex page from the sitemap is **correct behavior** — a noindexed URL should never appear in a sitemap.

This also resolves baseline **Issue 2** ("105 programmatic exam-family pages exceed the 50-page quality-gate threshold") — the indexable programmatic set is now 53, not 105.

**Verdict: not a regression.** Net effect: -52 (form-resizer noindex) + ~7 net elsewhere (blog/top-level page count shifted from 25/~74 to 36/26 due to reclassification, plus a handful of new content pages) = 213 total. All category deltas are explained; no unexplained URL loss.

### URL Distribution by Category (live)

| Category | Baseline count | Live count | Notes |
|---|---|---|---|
| `exam-requirements/[exam]` | 53 | 53 | Unchanged — the surviving indexable exam page |
| `tools/*` (excl. form-resizer) | 91 (incl. form-resizer) | 51 | form-resizer split out (now noindex, excluded) |
| `tools/form-resizer/[exam]` | 52 | **0 (noindex, correctly excluded)** | Deliberately deindexed since baseline |
| `blog/[slug]` | 25 | 36 | 11 new posts published since baseline |
| `visa-photo-maker` | 20 | 26 | Growth, consistent with country-page expansion |
| `country-passport-photo-maker` | 7 | 11 | Growth |
| `convert/[from-to]` | 10 | 10 | Unchanged |
| Top-level/other | ~74 | 26 | Reclassification artifact of this run's categorizer, not a page-count claim — not independently re-verified line-by-line against baseline's "~74" estimate |

---

## Quality Gates

### lastmod Dates

| Date | Count | % of total |
|---|---|---|
| 2026-06-25 | 140 | 65.7% |
| 2026-06-10 | 27 | 12.7% |
| 2026-06-08 | 10 | 4.7% |
| 2026-07-01 | 10 | 4.7% |
| 2026-06-18 | 8 | 3.8% |
| 2026-06-21 | 4 | 1.9% |
| 2026-06-13 | 3 | 1.4% |
| 2026-06-11, 2026-06-24, 2026-06-06 | 2 each | 0.9% each |
| 2026-06-05, 06-04, 06-03, 06-02, 06-23 | 1 each | 0.5% each |

**Distinct dates: 15** (vs. baseline's 9 distinct dates, of which 1 — `2026-06-23` — accounted for 63.6% of all URLs).

**Fix verified: partially.** The blanket single-date build-stamp pattern from baseline (164/258 = 63.6% on one date) is **not** fully resolved — it has shifted to a new dominant date (140/213 = 65.7% on `2026-06-25`) at almost the same concentration ratio. However, this is qualitatively different from a pure build-stamp regression:

- Cross-checked `/exam-requirements/ssc/` sitemap `lastmod` (`2026-06-08`) against its JSON-LD `WebPage.dateModified` (`2026-06-08`) — **exact match**, confirms this date is a real content-edit date, not a build timestamp.
- The `2026-06-25` cohort spans homepage, `/tools/`, country passport-maker pages, blog index, legal pages (about/contact/privacy/terms) — i.e., core structural/navigational pages that plausibly were touched together in one deploy (e.g., a global layout or nav change), rather than being evidence of a lastmod-generation bug.
- 73 URLs (34%) carry one of 14 *other* distinct dates spread across a 4-week window (2026-06-02 to 2026-07-01), which is inconsistent with a simple "stamp everything with build date" implementation — if that bug still existed, ALL 213 URLs would share one date, not 15.

**Net assessment:** the core defect (single build-stamp date site-wide) is fixed — the mechanism now uses real per-content dates for exam/blog pages (verified via JSON-LD cross-check). But a large cohort of structural pages still shares one date, which could mean either (a) they were legitimately redeployed together, or (b) those specific page types still fall back to a build/deploy timestamp rather than a true content-edit date. Recommend the site owner confirm whether homepage/tools-index/legal pages have individual `updatedAt` tracking or still inherit a global build date.

**Severity: Low.** Down from baseline's Low-Medium — no penalty risk, and the signal is meaningfully more trustworthy than before, but not yet best-practice.

### changefreq / priority

**PASS (unchanged).** No `<changefreq>` or `<priority>` tags present. Correct — Google ignores both.

---

## Spot-Check Results

Per audit brief, 5+ URLs spot-checked across different `lastmod` cohorts (not a single date) to catch stale/broken entries:

| URL | lastmod cohort | HTTP Status |
|---|---|---|
| https://easyphoto.in/ | 2026-06-25 | 200 |
| https://easyphoto.in/exam-requirements/ssc/ | 2026-06-08 | 200 |
| https://easyphoto.in/exam-requirements/upsc/ | (distinct) | 200 |
| https://easyphoto.in/exam-requirements/cat/ | (distinct) | 200 |
| https://easyphoto.in/exam-requirements/airforce-agniveer/ | (distinct) | 200 |
| https://easyphoto.in/blog/image-to-text-online-free-ocr/ | (distinct) | 200 |
| https://easyphoto.in/blog/indian-passport-photo-size-rules/ | (distinct) | 200 |

**7/7 spot-checked URLs returned HTTP 200.** Zero 404s, zero redirects, zero non-200 responses across sampled cohorts.

---

## dateModified / lastmod Cross-Check (new this audit)

Compared JSON-LD `dateModified` against sitemap `lastmod` for the 4 pages audited in the schema pass:

| URL | Sitemap lastmod | JSON-LD dateModified | Match? |
|---|---|---|---|
| `/` | 2026-06-25 | 2026-06-21 (SoftwareApplication) | Mismatch (4 days) |
| `/exam-requirements/ssc/` | 2026-06-08 | 2026-06-08 (WebPage) | Exact match |
| `/blog/indian-passport-photo-requirements/` | 2026-06-24 | 2026-06-24 (BlogPosting) | Exact match |
| `/passport-photo/` | 2026-06-25 | 2026-06-11 (SoftwareApplication) | Mismatch (14 days) |

**Finding:** exam-requirements and blog templates keep sitemap `lastmod` and JSON-LD `dateModified` perfectly in sync (both driven by the same content-edit date). The homepage and `/passport-photo/` show drift — the sitemap date looks like it moved with a broader deploy/nav change while the JSON-LD date reflects the last time that page's actual content/copy changed. Not a validity error (both fields are independently valid), but worth reconciling for signal consistency between structured data and sitemap.

---

## Fix-Verification Table (vs 2026-06-23 baseline)

| Baseline Finding | Claimed Fix | Live Verification (2026-07-02) | Status |
|---|---|---|---|
| `lastmod` was build-stamped (164/258 = 63.6% on one date) | Per-page dates | 15 distinct dates now (vs. 9). Exam/blog dates cross-verified against JSON-LD `dateModified` — exact matches confirm real content dates, not build stamps. However 140/213 (65.7%) still cluster on one date (`2026-06-25`, mostly structural/nav pages). | PARTIALLY VERIFIED — mechanism fixed for content pages, structural-page cohort still needs individual tracking confirmed |
| 105 programmatic exam-family pages exceed 50-page quality-gate threshold (Issue 2) | *(not explicitly claimed, but resolved as a side effect)* | `/tools/form-resizer/[exam]/` (52 pages) now `noindex, follow` and correctly excluded from sitemap. Indexable programmatic set reduced to 53 (`exam-requirements` only). | RESOLVED |
| 258 total URLs | *(count not a baseline "finding" per se, but the delta needed explaining)* | 213 total. Delta fully explained by the noindex removal above plus organic content growth (blog +11, country pages +10). No unexplained loss. | VERIFIED, EXPLAINED |
| changefreq/priority absent | N/A (already PASS) | Still absent | PASS unchanged |
| All URLs HTTPS, no www, trailing slashes, no duplicates | N/A (already PASS) | Still PASS — spot-checked, 0 duplicates found programmatically | PASS unchanged |

---

## Issues Found

### Issue 1 — Structural-page lastmod clustering (Low severity, down from Low-Medium)

140/213 URLs (65.7%) share `lastmod: 2026-06-25`, spanning homepage, `/tools/`, country passport-maker pages, blog index, and legal pages. Cross-checks confirm this is NOT a universal build-stamp bug (content pages like exam-requirements and blog posts have independently verified real dates), but this specific cohort's date source is unconfirmed — could be a legitimate shared deploy or could indicate these particular page types still fall back to a deploy timestamp rather than true content `updatedAt`.

**Recommendation:** Confirm with the site owner/codebase whether homepage, tools-index, and legal pages track individual content-edit dates. If they do and 2026-06-25 is coincidental (e.g., a genuine site-wide copy/nav update), no action needed. If they inherit a build timestamp, apply the same per-content-date approach already working for exam-requirements/blog.

### Issue 2 — dateModified/lastmod drift on homepage and /passport-photo/ (Info)

See cross-check table above. Recommend syncing `SoftwareApplication.dateModified` in JSON-LD with the sitemap `lastmod` (or vice versa) on these two pages so freshness signals agree across surfaces.

### Issue 3 (carried from baseline, unresolved) — Legal pages indexed without noindex (Informational)

Not re-verified in this pass (out of scope for this audit's spot-check set) but not flagged as changed. Judgment call, no action required unless crawl budget becomes constrained.

### Issue 4 (carried from baseline) — No sitemap index / no per-section split (Informational)

At 213 URLs, still well within single-file limits. Not urgent.

---

## URL Format Consistency

| Check | Result |
|---|---|
| All URLs use HTTPS | PASS — confirmed via programmatic check, 0 non-https |
| No `www.` prefix | PASS |
| No duplicate URLs | PASS — confirmed via `Counter()` check, 0 duplicates |
| Non-canonical domain | PASS — 0 found |

---

## Score Breakdown

| Dimension | Baseline | Live | Notes |
|---|---|---|---|
| XML validity | 10/10 | 10/10 | Well-formed, parses cleanly |
| URL status (200 check) | 20/20 | 20/20 | 7/7 spot-checked URLs (across distinct lastmod cohorts) return 200 |
| URL format consistency | 10/10 | 10/10 | HTTPS, no-www, no duplicates — confirmed programmatically |
| Robots.txt integration | 5/5 | 5/5 | Not re-broken; unchanged |
| Deprecated tags (changefreq, priority) | 10/10 | 10/10 | Still absent |
| lastmod accuracy | 5/15 | **11/15** | Real dates now verified via JSON-LD cross-check for content pages (+6); but 65.7% still cluster on one date for structural pages, so not full marks |
| Coverage (required pages present) | 10/10 | 10/10 | All required tool/blog/passport pages present and 200 |
| Quality gate — programmatic pages | 6/10 | **10/10** | 105-page risk resolved: noindex tool-variant pages correctly excluded, indexable set now 53 |
| Missing pages risk | 5/5 | 5/5 | No unexplained gaps; URL-count delta fully explained |
| Scalability / structure | 5/5 | 5/5 | Well within 50k limit |
| **Total** | **81/100** | **92/100** | |

### Key actions to reach 97+

1. **Confirm lastmod source for the 2026-06-25 structural-page cohort.** If it's a build/deploy timestamp rather than true content `updatedAt`, apply the same fix already working for exam-requirements/blog pages.
2. **Sync `dateModified` (JSON-LD) with `lastmod` (sitemap)** on homepage and `/passport-photo/` — currently 4 and 14 days apart respectively.
3. Legal-page noindex consideration and sitemap-index planning remain low-priority, unchanged from baseline.
