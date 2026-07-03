# Schema.org / Structured Data Audit — easyphoto.in

**Audit date:** 2026-07-02
**Method:** Live fetch (curl, static/server-rendered HTML — Next.js emits JSON-LD server-side, confirmed no Playwright rendering needed) + Python `json.loads()` validation of every `<script type="application/ld+json">` block on 4 sampled pages.
**Prior baseline:** 2026-06-23, scored **62/100**.

## Score: 88/100

Up 26 points from the 2026-06-23 baseline. All three claimed baseline fixes verified live with zero JSON syntax errors across 8 blocks / 4 pages. Remaining deductions: `Organization.sameAs` still single-platform, no `AggregateRating`/`Review` anywhere on the site, and a thinner `author` object on exam-requirements pages vs blog posts.

---

## Fix-Verification Table (vs 2026-06-23 baseline)

| Baseline Finding | Claimed Fix | Live Verification (2026-07-02) | Status |
|---|---|---|---|
| `BlogPosting.image` was generic `/og.png` | Per-post `opengraph-image` URL | `/blog/indian-passport-photo-requirements/` → `image.url` = `https://easyphoto.in/blog/indian-passport-photo-requirements/opengraph-image` (ImageObject, 1200x630). Per-post, not generic. | VERIFIED |
| `WebSite.SearchAction` missing | Added `SearchAction` | Present on all 4 pages sampled, valid `EntryPoint` + `query-input: required name=search_term_string` | VERIFIED |
| `SearchAction.target.urlTemplate` missing slash (`easyphoto.intools/`) | Slash fix | `urlTemplate` = `https://easyphoto.in/tools/?q={search_term_string}`. Live-tested `https://easyphoto.in/tools/?q=test` → HTTP 200. | VERIFIED |
| `Organization.sameAs` only Pinterest | *(not claimed fixed — flagged "likely unchanged")* | `sameAs`: `["https://www.pinterest.com/easyphoto0604/"]` — still Pinterest-only across all 4 pages sampled | CONFIRMED UNCHANGED |

**New since baseline (not a fix, a genuine addition):** `exam-requirements/*` pages gained a `WebPage` block with `author` (Person: Jaspal Kumar) + `dateModified`. Confirmed present and valid on `/exam-requirements/ssc/`.

---

## Detection Results — Per Page

### 1. Homepage — `https://easyphoto.in/`

Two `<script type="application/ld+json">` blocks (both `@graph` arrays), both valid JSON. (Note: `application/ld+json` string appears 4 times in raw HTML — the other 2 occurrences are inside Next.js's serialized RSC flight-data payload, not real script tags; confirmed not a duplication defect.)

**Block 1 — `Organization` + `WebSite`**
- `Organization`: `@id`, `name`, `alternateName[3]`, `url`, `description`, `slogan`, `knowsAbout[6]`, `logo` (ImageObject, 512x512), `sameAs` (Pinterest only), `founder` (Person: Jaspal Kumar with `url`/`sameAs`/`jobTitle`)
- `WebSite`: `@id`, `name`, `alternateName`, `url`, `publisher` (references Organization `@id`), `inLanguage: en-IN`, `potentialAction.SearchAction`

**Block 2 — `SoftwareApplication` + `FAQPage`**
- `SoftwareApplication`: `name`, `description`, `url`, `applicationCategory: UtilitiesApplication`, `operatingSystem`, `offers` (Offer, price 0 USD), `isAccessibleForFree: true`, `dateModified: 2026-06-21` (ISO 8601)
- `FAQPage`: 6 `Question`/`Answer` pairs, well-formed

| Check | Result |
|---|---|
| `@context` = `https://schema.org` | PASS |
| `@type` valid, no deprecated types | PASS |
| Required properties present | PASS |
| Absolute URLs | PASS |
| ISO 8601 dates | PASS |
| No placeholder text | PASS |
| `SearchAction.target.urlTemplate` valid | PASS (slash-fix confirmed live) |
| `json.loads()` succeeds | PASS |

**FAQPage note (per standing rule):** Google retired FAQ rich results for all sites (2026-05-07). This is Info priority, not Critical — the markup still aids AI/LLM citation and entity resolution. No action required; do not recommend removal.

---

### 2. Blog post — `https://easyphoto.in/blog/indian-passport-photo-requirements/`

Two blocks: sitewide `Organization`+`WebSite` (identical to homepage) and `BreadcrumbList`+`BlogPosting`+`FAQPage`.

**`BlogPosting`:**

| Property | Value | Status |
|---|---|---|
| `headline` | "Indian Passport Photo Requirements 2026: Full Compliance Checklist" | PASS |
| `description` | Present, non-generic | PASS |
| `datePublished` | `2026-06-24` | PASS (ISO 8601) |
| `dateModified` | `2026-06-24` | PASS (ISO 8601) |
| `image` | ImageObject, `url: https://easyphoto.in/blog/indian-passport-photo-requirements/opengraph-image`, 1200x630 | PASS — **per-post, confirmed fixed** (was generic `/og.png` at baseline) |
| `author` | Person — name, url, sameAs, image, jobTitle, knowsAbout, worksFor (`@id` ref) | PASS — full author entity |
| `publisher` | References Organization `@id` | PASS |
| `mainEntityOfPage` | Absolute URL | PASS |
| `inLanguage` | `en-IN` | PASS |

`BreadcrumbList`: 3-level, correct `position`/`name`/`item`, all absolute URLs.
`FAQPage`: multiple Q&A pairs, well-formed (Info priority per FAQ rich-result retirement).

**Validation:** `json.loads()` succeeds. No required properties missing. No placeholder text.

---

### 3. Exam requirements — `https://easyphoto.in/exam-requirements/ssc/`

Two blocks: sitewide `Organization`+`WebSite`, and `BreadcrumbList`+`WebPage`+`FAQPage`.

**`WebPage` (new since baseline):**

```json
{
  "@type": "WebPage",
  "@id": "https://easyphoto.in/exam-requirements/ssc/#webpage",
  "name": "SSC (Staff Selection Commission) Photo & Signature Size",
  "description": "Staff Selection Commission photo (20-50 KB, 3.5x4.5cm) and signature (10-20 KB, 4.0x2.0cm).",
  "url": "https://easyphoto.in/exam-requirements/ssc/",
  "isPartOf": { "@id": "https://easyphoto.in/#website" },
  "dateModified": "2026-06-08",
  "author": {
    "@type": "Person",
    "name": "Jaspal Kumar",
    "url": "https://www.linkedin.com/in/jaspal-jk/"
  }
}
```

Confirmed: `WebPage` type present, `author` is a `Person` (Jaspal Kumar) as claimed, `dateModified` is ISO 8601 and matches the sitemap `lastmod` for this exact URL (`2026-06-08` in both) — good internal consistency, real per-page date, not build-stamped.

**Gap vs blog-post author object:** `WebPage.author` on exam pages carries only `name`+`url` — missing `sameAs`, `jobTitle`, `worksFor`, `image`, `knowsAbout` that `BlogPosting.author` carries on blog posts. Same Person entity, inconsistent completeness across templates (Info-level; doesn't break validation, but weakens entity-consistency signal).

`BreadcrumbList`: 3-level, correct. `FAQPage`: 4 Q&A pairs, well-formed.

**Validation:** `json.loads()` succeeds. All required properties present. No placeholders.

---

### 4. `https://easyphoto.in/passport-photo/`

Two blocks: sitewide `Organization`+`WebSite`, and `BreadcrumbList`+`SoftwareApplication`+`FAQPage`.

| Type | Notes |
|---|---|
| `BreadcrumbList` | 2-level (Home → tool page), valid |
| `SoftwareApplication` | `@id`, name, description, url, `applicationCategory`, `operatingSystem`, `offers` (Offer, 0 USD), `isAccessibleForFree: true`, `dateModified: 2026-06-11` |
| `FAQPage` | 5+ Q&A pairs, well-formed |

**Note:** sitemap `lastmod` for this URL is `2026-06-25`, but `SoftwareApplication.dateModified` in the JSON-LD is `2026-06-11` — a 14-day mismatch. Not a validation failure (both are independently valid ISO 8601 dates), but the two freshness signals should agree.

**Validation:** `json.loads()` succeeds. No missing required properties. No placeholders.

---

## Cross-Page Consistency

- `Organization`/`WebSite` block is byte-identical across all 4 pages sampled — correctly implemented as a shared/global schema partial. Reduces drift risk.
- No deprecated types found anywhere (`HowTo`, `SpecialAnnouncement`, `CourseInfo`, `EstimatedSalary`, `LearningVideo` — all absent, confirmed via grep across all 4 pages).
- No Microdata or RDFa detected on any sampled page (`itemscope` / `typeof=` both absent) — JSON-LD only.
- All `@context` values are `https://schema.org` (not `http://`) — correct.
- No `AggregateRating` or `Review` schema found anywhere sampled — not a defect, but a missing opportunity (see below).

---

## Outstanding Issues (by severity)

### Info (no SERP impact, entity/AI-signal only)
1. **FAQPage present on 4/4 sampled pages** — no Google rich-result benefit (retired 2026-05-07), but harmless and useful for AI/LLM citation. No action needed.
2. **`WebPage.author` on exam-requirements pages is a thinner Person object** than `BlogPosting.author` on blog pages (missing `sameAs`, `jobTitle`, `worksFor`, `image`, `knowsAbout`). Recommend aligning to the fuller author object already used on blog posts, for consistent entity resolution — same person, same URL, different completeness.
3. **`Organization.sameAs` still Pinterest-only.** Confirmed unchanged from baseline (flagged twice now). If the brand has other verifiable profiles (LinkedIn company page, X/Twitter, GitHub, YouTube), adding them strengthens entity disambiguation. Not required.
4. **`SoftwareApplication.dateModified` vs sitemap `lastmod` drift** on `/passport-photo/` (2026-06-11 vs 2026-06-25) — cosmetic inconsistency, recommend syncing.

### Missing Opportunities (not defects, additive)
- **No `AggregateRating`/`Review`** anywhere sampled. Legitimate rich-result opportunity on `SoftwareApplication` if the app has genuine user ratings — only with real aggregate data, never fabricated.
- **No `VideoObject`** — not applicable without evidence of video assets; not flagged as a gap.

---

## Recommended Fix — Align exam-page author object

Template-level change to `/exam-requirements/*` `WebPage.author` (applies to all exam-requirements pages, implement once in the shared partial):

```json
{
  "@type": "Person",
  "name": "Jaspal Kumar",
  "url": "https://www.linkedin.com/in/jaspal-jk/",
  "sameAs": ["https://www.linkedin.com/in/jaspal-jk/"],
  "jobTitle": "easyPhoto developer & document-spec researcher",
  "worksFor": { "@id": "https://easyphoto.in/#organization" }
}
```

---

## Score Breakdown

| Category | Points | Notes |
|---|---|---|
| Valid JSON-LD syntax (all pages) | 20/20 | Zero `json.loads()` failures across 4 pages / 8 blocks |
| Correct `@context`/`@type`, no deprecated types | 15/15 | Clean |
| Required properties present | 15/15 | All required props present on every type found |
| SearchAction fix verified live | 15/15 | URL bug confirmed fixed and functional (live HTTP 200 test) |
| BlogPosting.image per-post fix verified live | 15/15 | Confirmed on sampled post |
| New WebPage+author on exam pages | 8/10 | Present and valid; thinner author object than blog template (-2) |
| Organization.sameAs breadth | 0/5 | Still single-entry, unchanged from baseline (-5) |
| AggregateRating/Review opportunity | 0/5 | Not implemented (informational, no baseline regression) |
| **Total** | **88/100** | |
