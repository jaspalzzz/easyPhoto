# Schema Markup Audit — easyphoto.in

**Audit date:** 2026-06-18
**Score:** 62 / 100

---

## Architecture Overview

EasyPhoto uses a centralised schema architecture built on three files:

- `lib/schema.ts` — all schema builder functions
- `components/seo/JsonLd.tsx` — the `@graph` render component
- `components/site/Faq.tsx` — secondary `FAQPage` emitter (inline, NOT using `JsonLd`)

No microdata (`itemscope`/`itemtype`) or RDFa was found anywhere. The codebase is JSON-LD only — correct approach.

---

## Schema Types Inventory

| Page / Component | Schema types emitted |
|---|---|
| `app/layout.tsx` (global, every page) | Organization + WebSite |
| `app/page.tsx` (homepage) | FAQPage (via `Faq`), howToSchema → null (dead) |
| `app/[maker]/page.tsx` (~20 country pages) | BreadcrumbList + SoftwareApplication + FAQPage |
| `components/blog/BlogPostLayout.tsx` (24 posts) | BreadcrumbList + BlogPosting |
| Blog posts with `<Faq>` (10 posts) | BreadcrumbList + BlogPosting + FAQPage (duplicate script) |
| `components/tools/ToolPage.tsx` (~20 tool + exam pages) | BreadcrumbList + SoftwareApplication + FAQPage |
| `components/tools/KbResizeLanding.tsx` | BreadcrumbList + SoftwareApplication + howToSchema → null |
| `components/tools/PdfKbLanding.tsx` | BreadcrumbList + SoftwareApplication + howToSchema → null |
| `components/tools/DocPhotoLanding.tsx` | BreadcrumbList + SoftwareApplication + howToSchema → null + FAQPage |
| `components/tools/DocPhotoResizerPage.tsx` (PAN, Voter ID, DL) | BreadcrumbList + SoftwareApplication + FAQPage |
| `components/tools/CategoryPage.tsx` (3 category hubs) | BreadcrumbList + CollectionPage |
| `app/exam-resizer/[exam]/page.tsx` | BreadcrumbList + SoftwareApplication + FAQPage |
| `app/exam-requirements/[exam]/page.tsx` (~30 spec pages) | BreadcrumbList + FAQPage |
| `app/exam-requirements/page.tsx` | BreadcrumbList only |
| `app/exam-photo-size/page.tsx` | BreadcrumbList + FAQPage |
| `app/exam-calendar/page.tsx` | BreadcrumbList + FAQPage |
| `app/blog/page.tsx` | BreadcrumbList only |
| `app/tools/page.tsx` | BreadcrumbList only |
| `app/convert/page.tsx` | BreadcrumbList only |
| `app/about/page.tsx` | BreadcrumbList + AboutPage |
| `app/contact/page.tsx` | BreadcrumbList + ContactPage |
| `app/disclaimer/page.tsx` | BreadcrumbList + WebPage |
| `app/aadhaar-photo/page.tsx` | BreadcrumbList + WebPage + FAQPage |
| `app/baby-passport-photo/page.tsx` | BreadcrumbList + SoftwareApplication + FAQPage |
| `app/unlock-aadhaar-pdf/page.tsx` | BreadcrumbList + SoftwareApplication |
| `app/privacy/page.tsx` | **NONE** |
| `app/terms/page.tsx` | **NONE** |

---

## Critical Issues

### CRIT-1 — BlogPosting `image` hardcoded to generic `/og.png` across all 24 posts

**File:** `components/blog/BlogPostLayout.tsx` (line ~46)

Every BlogPosting schema emits:
```json
"image": { "@type": "ImageObject", "url": "https://easyphoto.in/og.png", "width": 1200, "height": 630 }
```

Each of the 24 blog posts has its own dynamically generated OG image served at `/blog/[slug]/opengraph-image`. Google's rich results for BlogPosting (Discover, Top Stories, image carousels) rely on a unique, representative image per post. Pointing all 24 to the same generic fallback image:
- Disqualifies posts from image-carousel rich results
- Makes Discover thumbnails identical across all posts
- Fails Google's BlogPosting image uniqueness expectation

**Fix:** Derive the per-post OG image URL in the schema builder:
```ts
image: { "@type": "ImageObject", url: absoluteUrl(`/blog/${post.slug}/opengraph-image`), width: 1200, height: 630 }
```
This requires passing `post.slug` into the schema call — it is already available in `BlogPostLayout`.

---

## High Issues

### HIGH-1 — Duplicate FAQPage script tags on 10 blog posts

**Affected posts:** `indian-passport-photo-size-rules`, `how-to-reduce-passport-photo-size-for-online-forms`, `how-to-compress-pdf`, `resume-photo-size-and-rules`, `schengen-europe-visa-photo-size`, `baby-and-infant-passport-photo-guide`, `why-passport-photos-get-rejected`, `linkedin-profile-photo-size-and-tips`, `ibps-po-2026-photo-signature-checklist`, `exam-photo-signature-size-guide`

Each of these pages ends up with 3 `<script type="application/ld+json">` blocks:
1. Global layout `@graph` → Organization + WebSite
2. BlogPostLayout `@graph` → BreadcrumbList + BlogPosting
3. `<Faq>` component → standalone FAQPage (outside any `@graph`)

The standalone FAQPage has no `@id` linkage to the BlogPosting. Google can parse multiple JSON-LD blocks on a page, but this fragmented structure means:
- The FAQPage entity is orphaned (not connected to the BlogPosting via `mainEntity` or `@id`)
- Rich result eligibility is reduced compared to a consolidated `@graph`

**Fix:** Add a `faqItems` prop to `BlogPostLayout` and merge the FAQPage into the existing `@graph` alongside BreadcrumbList + BlogPosting. Remove the direct `<Faq>` schema emission from the individual blog page files.

---

### HIGH-2 — No `SearchAction` on WebSite schema (missing SiteLinks Searchbox)

**File:** `lib/schema.ts` — `websiteSchema()` function

The `WebSite` schema has no `potentialAction`. The site has a working tool search UI (`components/site/ToolSearch.tsx`). Without `potentialAction`, Google cannot surface a sitelinks searchbox in brand SERPs.

**Fix:**
```ts
potentialAction: {
  "@type": "SearchAction",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://easyphoto.in/tools/?q={search_term_string}"
  },
  "query-input": "required name=search_term_string"
}
```
Verify the `urlTemplate` matches the actual query parameter used by `ToolSearch`.

---

## Medium Issues

### MED-1 — `priceCurrency: "INR"` on SoftwareApplication for a global tool

**File:** `lib/schema.ts` line ~103

```ts
offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
```

The site serves users globally (US, UK, Canada, Australia). Google's structured data docs say: if `price` is `"0"` and `isAccessibleForFree` is `true`, omit `priceCurrency`. Using `"INR"` on a free global tool may signal to Google that the tool is India-only, suppressing rich results in non-India SERPs.

**Fix:** Remove `priceCurrency` entirely (the `Offer` price `"0"` + `isAccessibleForFree: true` on the parent is unambiguous), or change to `"USD"`.

---

### MED-2 — `privacy/` and `terms/` pages have zero schema

**Files:** `app/privacy/page.tsx`, `app/terms/page.tsx`

Every other static page (disclaimer, about, contact, aadhaar-photo) has at minimum a BreadcrumbList + WebPage. The two legal pages are inconsistent and emit nothing.

**Fix:** Add minimal `WebPage` schemas with `dateModified` to both pages, following the same pattern as `app/disclaimer/page.tsx`.

---

### MED-3 — Blog index, tools hub, and exam-requirements hub have only BreadcrumbList

**Files:** `app/blog/page.tsx`, `app/tools/page.tsx`, `app/exam-requirements/page.tsx`

These three directory pages list many child items but emit only a BreadcrumbList. The category tool hubs (`/tools/photo/`, `/tools/pdf/`, `/tools/signature/`) already use `CollectionPage` correctly. The main hubs are inconsistent.

**Fix:** Add `CollectionPage` schema (or `ItemList`) to these three pages, matching the existing pattern in `components/tools/CategoryPage.tsx`.

---

### MED-4 — Exam calendar missing `Event` schema

**File:** `app/exam-calendar/page.tsx`

The exam calendar page contains structured event data: exam names, application windows, exam dates, admit card release dates, and official source URLs. Each entry could be an `Event` schema with `startDate`, `endDate`, `name`, `organizer`, and `url`.

Google surfaces exam dates as rich results (especially for "[exam name] 2026 date" queries). The page already emits FAQPage but has no `Event` schema.

**Fix:** Map each calendar entry to an `Event` schema block (or an `ItemList` of Events) and emit them via `JsonLd`. Requires ISO date formatting of the exam dates.

---

## Low Issues

### LOW-1 — `howToSchema()` calls at 4 sites are dead code

**Files:** `app/page.tsx`, `components/tools/KbResizeLanding.tsx`, `components/tools/DocPhotoLanding.tsx`, `components/tools/PdfKbLanding.tsx`

`howToSchema()` returns `null` (by design — Google deprecated HowTo rich results in Sept 2023). All four call sites pass full step data that is never rendered. This is dead code that adds maintenance confusion.

**Fix:** Remove the `howToSchema()` calls from all four files. The function can remain as a documented no-op in `lib/schema.ts` for historical context.

---

### LOW-2 — `FaqJsonLd` in `Faq.tsx` duplicates logic from `faqSchema()` in `lib/schema.ts`

**File:** `components/site/Faq.tsx`

Two parallel FAQPage implementations exist:
1. `lib/schema.ts`: `faqSchema()` — returns a plain object for use in `@graph` via `JsonLd`
2. `components/site/Faq.tsx`: `FaqJsonLd` — renders its own standalone `<script>` tag

In practice the codebase uses `FaqJsonLd` everywhere, making `faqSchema()` appear unused. This split causes the FAQPage to always be a standalone block outside the `@graph`.

**Fix:** Either refactor `Faq.tsx` to call `faqSchema()` + `JsonLd` (so FAQ merges into the `@graph`), or keep `FaqJsonLd` but add a way to pass FAQ data into `JsonLd` directly — which is required to fix HIGH-1 anyway.

---

### LOW-3 — `Organization.sameAs` has only one entry (Pinterest)

**File:** `lib/schema.ts` lines ~49–51

```ts
sameAs: ["https://www.pinterest.com/easyphoto0604/"]
```

The code comment acknowledges more profiles should be added. A single Pinterest profile is weak for entity disambiguation. Google uses `sameAs` to connect the brand to Knowledge Graph nodes.

**Fix:** Add any verified social/business profiles as they are created: LinkedIn company page, Instagram, YouTube, X, Crunchbase, etc.

---

### LOW-4 — `AboutPage` not linked back to Organization entity

**File:** `app/about/page.tsx`

The AboutPage schema lacks an `about` property pointing to the Organization `@id`. This would explicitly tell Google "this page is about this organization."

**Fix:**
```ts
about: { "@id": "https://easyphoto.in/#organization" }
```

---

### LOW-5 — `SoftwareApplication` missing `aggregateRating`

**File:** `lib/schema.ts`

`aggregateRating` is an optional property for `SoftwareApplication` that unlocks star rating display in search results. The site does not currently collect user ratings. This is a future opportunity once a rating mechanism is in place.

---

## What Works Well

- **BreadcrumbList coverage is excellent** — present on all tool, blog, country, exam, and static pages except privacy and terms.
- **BlogPosting required fields** — `headline`, `datePublished`, `dateModified`, `author` (Person with `name`, `url`, `sameAs`, `image`, `jobTitle`, `knowsAbout`), `publisher` (via `@id` reference), `mainEntityOfPage` — all present and correctly structured.
- **FAQPage schema is valid everywhere it appears** — `mainEntity` array, `Question` + `acceptedAnswer.text` all correctly formatted.
- **SoftwareApplication schema** covers `applicationCategory`, `operatingSystem`, `offers`, and `@id` — meets Google's minimum requirements for app rich results.
- **Organization schema** is comprehensive — `name`, `alternateName`, `url`, `description`, `slogan`, `knowsAbout`, `logo` (ImageObject with dimensions), `sameAs`, stable `@id`.
- **No microdata or RDFa** — the codebase is 100% JSON-LD, the correct format.
- **Centralised architecture** — `lib/schema.ts` + `JsonLd.tsx` makes schema consistent and auditable across pages.
- **`@id` usage throughout** — entities reference each other via `@id` (e.g., BlogPosting `publisher` references Organization `@id`) enabling proper linked-data graph construction.
- **No conflicting or contradictory schema types** — no page has two competing `@type` values for the same content.

---

## Breadcrumb Coverage Map

| Status | Pages |
|---|---|
| Present | All tool pages, all blog posts, all country maker pages, all exam pages, category hubs, blog/tools/convert hubs, about, contact, disclaimer, aadhaar-photo, baby-passport-photo, unlock-aadhaar-pdf |
| Missing | `app/privacy/page.tsx`, `app/terms/page.tsx` |

Breadcrumb chains are correctly 1-indexed with absolute URLs via `absoluteUrl()`.

---

## Required Fields Validation Summary

### BlogPosting (Google Rich Results)

| Field | Status |
|---|---|
| `headline` | Pass |
| `image` (unique per post) | **Fail** — all 24 posts share `/og.png` |
| `datePublished` (ISO) | Pass |
| `dateModified` (ISO) | Pass |
| `author` (Person with name + url) | Pass |
| `publisher` (via @id) | Pass |

### SoftwareApplication (Google Rich Results)

| Field | Status |
|---|---|
| `name` | Pass |
| `applicationCategory` | Pass |
| `operatingSystem` | Pass |
| `offers` (Offer with price) | Pass (INR currency flag — see MED-1) |
| `aggregateRating` | Optional — missing |

### FAQPage (Google Rich Results)

| Field | Status |
|---|---|
| `mainEntity` array | Pass |
| Each `Question.name` | Pass |
| Each `acceptedAnswer.text` | Pass |

### BreadcrumbList (Google Rich Results)

| Field | Status |
|---|---|
| `itemListElement` array | Pass |
| 1-indexed `position` | Pass |
| `name` per item | Pass |
| Absolute `item` URL | Pass |

---

## Priority Action List

| Priority | Issue | Primary file(s) |
|---|---|---|
| P1 | Fix BlogPosting `image` — use per-post OG URL not `/og.png` | `components/blog/BlogPostLayout.tsx` |
| P1 | Merge blog FAQPage into `@graph` (fix duplicate script tags) | `BlogPostLayout.tsx`, 10 blog `page.tsx` files |
| P2 | Add `SearchAction` to `websiteSchema()` | `lib/schema.ts` |
| P2 | Add `WebPage` schema to `/privacy/` and `/terms/` | `app/privacy/page.tsx`, `app/terms/page.tsx` |
| P2 | Add `Event` schema to exam calendar entries | `app/exam-calendar/page.tsx` |
| P3 | Remove `priceCurrency: "INR"` from SoftwareApplication Offer | `lib/schema.ts` |
| P3 | Add `CollectionPage` to `/blog/`, `/tools/`, `/exam-requirements/` | Three hub pages |
| P3 | Remove dead `howToSchema()` call sites (4 files) | `app/page.tsx`, `KbResizeLanding.tsx`, `DocPhotoLanding.tsx`, `PdfKbLanding.tsx` |
| P4 | Expand `Organization.sameAs` array | `lib/schema.ts` |
| P4 | Add `about: { "@id": ORG_ID }` to AboutPage | `app/about/page.tsx` |
| P4 | Unify FAQPage emission — remove `FaqJsonLd` standalone emitter | `components/site/Faq.tsx` |
