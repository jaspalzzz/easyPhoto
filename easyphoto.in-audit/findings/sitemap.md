# Sitemap Findings — easyphoto.in

**Audit date:** 2026-06-23
**Source:** https://easyphoto.in/sitemap.xml
**Auditor:** Sitemap Architecture Agent

---

## Overview

| Property | Value |
|---|---|
| Sitemap format | Single `<urlset>` file (no sitemap index) |
| XML validity | Valid — well-formed, correct namespace |
| Namespace | `http://www.sitemaps.org/schemas/sitemap/0.9` (correct) |
| Total URLs | 258 |
| 50,000 URL limit | PASS (258 << 50,000) |
| Sitemap index needed | No — single file is appropriate at this scale |
| Declared in robots.txt | YES — `Sitemap: https://easyphoto.in/sitemap.xml` |

### URL Distribution by Category

| Category | Count | Notes |
|---|---|---|
| `/tools/*` (all tool paths) | 91 | Includes sub-categories and form-resizer |
| `/exam-requirements/[exam]/` | 53 | Per-exam requirement detail pages |
| `/tools/form-resizer/[exam]/` | 52 | Per-exam photo+signature resizer tools |
| `/blog/[slug]/` | 25 | Blog post articles |
| `/convert/[from-to]/` | 10 | Format conversion pages |
| `[visa-photo-maker]/` | 20 | Country-specific visa photo maker pages |
| `[passport-photo-maker]/` | 7 | Country-specific passport photo maker pages |
| Top-level standalone pages | ~74 | Homepage, legal, category hubs, KB-resize, etc. |

---

## Quality Gates

### lastmod Dates

| Date | Count | Assessment |
|---|---|---|
| 2026-06-23 | 164 | Today's date — assigned to all top-level and recently touched pages |
| 2026-06-10 | 50 | Plausible wave date |
| 2026-06-08 | 19 | Plausible wave date |
| 2026-06-18 | 8 | Plausible wave date |
| 2026-06-21 | 4 | Plausible wave date |
| 2026-06-11 | 4 | Plausible wave date |
| 2026-06-13 | 3 | Plausible wave date |
| 2026-06-06 | 2 | Plausible wave date |
| 2026-06-05 to 2026-06-02 | 4 | Plausible for older blog posts |

**Finding:** 164 out of 258 URLs (63.6%) carry today's date `2026-06-23` as their `lastmod`. This includes pages that were clearly not all modified today — for example, the homepage, all legal pages, all KB-resize landing pages, and all category hub pages share the same date. This is a common anti-pattern caused by generating `lastmod` from the current build timestamp rather than per-page content change dates.

**Impact:** Google has stated it uses `lastmod` to prioritise recrawls. When the majority of pages share an identical build-stamp date, Googlebot learns to distrust the signal entirely and may reduce its weight in crawl scheduling. The `exam-requirements/*` and `blog/*` pages do use varied, realistic dates — those should be the model for the whole sitemap.

**Severity:** Low-Medium. No penalty risk, but wastes crawl budget signalling.

### changefreq

**Result: PASS** — No `<changefreq>` tags present anywhere in the sitemap. This is correct; Google ignores this tag entirely and its omission reduces noise.

### priority

**Result: PASS** — No `<priority>` tags present anywhere in the sitemap. This is correct; Google ignores this tag and its omission is the recommended modern practice.

---

## Spot-check Results (15 URLs sampled)

All 258 sitemap URLs were checked. Results from the complete bulk check:

| URL | Status |
|---|---|
| https://easyphoto.in/ | 200 |
| https://easyphoto.in/tools/ | 200 |
| https://easyphoto.in/passport-photo/ | 200 |
| https://easyphoto.in/blog/ | 200 |
| https://easyphoto.in/us-passport-photo/ | 200 |
| https://easyphoto.in/uk-passport-photo/ | 200 |
| https://easyphoto.in/canada-passport-photo/ | 200 |
| https://easyphoto.in/tools/sign-pdf/ | 200 |
| https://easyphoto.in/tools/pdf-to-jpg/ | 200 |
| https://easyphoto.in/tools/exam-package/ | 200 |
| https://easyphoto.in/exam-requirements/ssc/ | 200 |
| https://easyphoto.in/tools/form-resizer/ssc/ | 200 |
| https://easyphoto.in/blog/indian-passport-photo-size-rules/ | 200 |
| https://easyphoto.in/convert/heic-to-jpg/ | 200 |
| https://easyphoto.in/aadhaar-photo/ | 200 |

**Full bulk check: 258/258 URLs returned HTTP 200. Zero 404s, zero redirects, zero non-200 responses.**

No noindex meta tags or `X-Robots-Tag: noindex` headers were found on any sampled pages, including legal pages (privacy, terms, disclaimer).

---

## Missing Pages

### Pages requested in audit brief that are NOT in the sitemap

| URL | HTTP Status | Verdict |
|---|---|---|
| https://easyphoto.in/india/ | 404 | True 404 — no page exists. Not a sitemap gap. |
| https://easyphoto.in/usa/ | 404 | True 404 — no page exists. Not a sitemap gap. |
| https://easyphoto.in/uk/ | 404 | True 404 — no page exists. Not a sitemap gap. |
| https://easyphoto.in/canada/ | 404 | True 404 — no page exists. Not a sitemap gap. |

The country hub pages at `/{country}/` do not exist as live pages. The site uses country-specific URLs under different path patterns (`/india-passport-photo-maker/`, `/uk-passport-photo/`, etc.) which are correctly included in the sitemap.

### Pages requested that ARE correctly present in sitemap

| URL | In Sitemap | HTTP Status |
|---|---|---|
| /passport-photo/ | YES | 200 |
| /tools/ | YES | 200 |
| /blog/ | YES | 200 |
| /tools/exam-package/ | YES | 200 |
| /tools/sign-pdf/ | YES | 200 |
| /tools/pdf-to-jpg/ | YES | 200 |

### Potentially missing pages worth investigating

| URL | Notes |
|---|---|
| https://easyphoto.in/tools/form-resizer/ (index) | A parent hub for all form-resizer tools — not in sitemap. May be a noindex page or may not exist as a standalone page. Worth verifying. |
| https://easyphoto.in/exam-photo-size/ | IS in sitemap — confirmed 200 |
| https://easyphoto.in/exam-calendar/ | IS in sitemap — confirmed 200 |

---

## Issues Found

### Issue 1 — Inflated lastmod via build-stamp (Low-Medium severity)

164 of 258 URLs (63.6%) carry the current build/deploy date `2026-06-23` as `lastmod`, regardless of whether the page's content actually changed today. This makes `lastmod` an unreliable signal for Googlebot.

**Recommendation:** Generate `lastmod` per-page from the actual content's last-edit date (e.g., the `updatedAt` field in the data source, or git commit date for static pages). The blog posts and many exam-requirements pages already demonstrate the correct pattern with varied realistic dates — apply the same approach to all page types.

### Issue 2 — Parallel duplication between /exam-requirements/[exam]/ and /tools/form-resizer/[exam]/ (Quality Gate Warning)

The sitemap contains 53 `exam-requirements` pages and 52 `tools/form-resizer` pages — 105 programmatically generated pages covering the same set of exams. While the page titles and meta descriptions are distinct:

- `/exam-requirements/ssc/` → "SSC Photo & Signature Size 2026 (Official)" — focuses on specifications
- `/tools/form-resizer/ssc/` → "SSC Photo & Signature Resizer" — focuses on the tool

This is a legitimate two-page-per-exam pattern (information page + action tool) and is structurally defensible. However, this triggers the quality gate threshold:

**Total programmatic exam pages in sitemap: 105 (53 + 52)**

This is above the 50-page hard-stop threshold for templated pages. The quality gate requires explicit justification that each page contains meaningful unique content beyond the exam name being swapped.

**Observed content quality (sampled):**
- `exam-requirements` pages: unique photo dimensions, file size limits, pixel dimensions, and format rules per exam — genuinely differentiated data.
- `form-resizer` pages: unique tool configuration per exam (target KB, dimensions) with exam-specific descriptions. Titles and descriptions are unique.

**Verdict:** The differentiation appears real at the metadata level. A full content audit of body text uniqueness across 5+ pairs is recommended before expanding further. If the tool pages render the same generic resizer UI with only the exam name and preset values changing, and the body text is templated with minimal unique prose, there is thin-content exposure.

### Issue 3 — Legal pages (privacy, terms, disclaimer) indexed without noindex (Informational)

`/privacy/`, `/terms/`, and `/disclaimer/` are in the sitemap and are fully indexable (no noindex, no X-Robots-Tag). These pages have minimal SEO value and contribute to crawl budget consumption. Many sites noindex legal boilerplate pages.

**Recommendation:** This is a judgment call. If AdSense review is ongoing (as noted in project context), keeping these pages indexable and in the sitemap demonstrates site legitimacy. Leave as-is unless crawl budget becomes a concern.

### Issue 4 — robots.txt disallows /_next/ but sitemap is correctly declared (Informational — no action needed)

`Disallow: /_next/` in robots.txt is the standard Next.js pattern and is correct. The sitemap URL is properly declared. No conflict.

### Issue 5 — No sitemap index, no per-section sitemaps (Informational)

At 258 URLs, a sitemap index is not needed. However, as the site grows (more exam presets, more blog posts, more country pages), consider splitting into:
- `sitemap-core.xml` — homepage, tool hubs, category pages
- `sitemap-tools.xml` — all `/tools/*`
- `sitemap-exam.xml` — exam-requirements + form-resizer
- `sitemap-blog.xml` — blog posts
- `sitemap-convert.xml` — convert/* and compress/*

This makes it easier to submit per-section to GSC and diagnose indexing issues per content type.

---

## URL Format Consistency

| Check | Result |
|---|---|
| All URLs use HTTPS | PASS — all 258 use `https://` |
| No www. prefix | PASS — all use bare `easyphoto.in` |
| Trailing slashes | PASS — all 258 URLs have trailing slashes |
| No duplicate URLs | PASS — no duplicates observed |
| Consistent casing | PASS — all lowercase |

URL format is entirely consistent. This is a clean implementation.

---

## Score: 81/100

| Dimension | Score | Notes |
|---|---|---|
| XML validity | 10/10 | Well-formed, correct namespace, no syntax errors |
| URL status (200 check) | 20/20 | 258/258 URLs return 200 — perfect |
| URL format consistency | 10/10 | HTTPS, trailing slashes, no-www — fully consistent |
| Robots.txt integration | 5/5 | Sitemap declared, /_next/ correctly disallowed |
| Deprecated tags (changefreq, priority) | 10/10 | Neither present — clean |
| lastmod accuracy | 5/15 | 164/258 URLs use build-stamp date; only exam/blog pages have real dates |
| Coverage (required pages present) | 10/10 | All required tool, blog, and passport pages present |
| Quality gate — programmatic pages | 6/10 | 105 exam-family pages exceed 50-page threshold; content differentiation is present at metadata level but body-text uniqueness not fully verified |
| Missing pages risk | 5/5 | Country 404s are true non-pages, not sitemap gaps |
| Scalability / structure | 5/5 | Well within 50k limit; no index needed yet |

### Key actions to reach 90+

1. **Fix lastmod** — Generate per-page dates from content `updatedAt` or file commit timestamp. Target: all `lastmod` values reflect real content change dates.
2. **Audit exam-page body-text uniqueness** — Verify that the 105 exam-family pages (exam-requirements + form-resizer) contain exam-specific prose beyond the template shell. If they share identical body paragraphs with only the exam name swapped, add unique content or consolidate.
3. **Consider noindexing legal pages** — low priority; only matters once crawl budget is measurably constrained.
4. **Plan sitemap index** — not urgent now, but build the infrastructure before the URL count exceeds 500.
