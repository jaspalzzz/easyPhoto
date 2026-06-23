# Action Plan — easyphoto.in SEO Audit
**Date:** 2026-06-21  
**Score:** 81/100 → Target 88/100 after all phases  
**Prior score (2026-06-18):** 71/100 — ▲+10 already achieved

---

## Progress Since Last Audit

✅ www redirect fixed  
✅ `/_next/` disallowed in robots.txt  
✅ Homepage title updated (no longer cannibalizing /passport-photo/)  
✅ `SoftwareApplication` schema added to homepage  
✅ llms.txt created (comprehensive)  
✅ Lighthouse SEO: 100/100 (both mobile + desktop)  
✅ 277-URL sitemap (up from 248, 0 errors)

---

## Phase 1 — This Week (Impact: +3–4 points)

### 1. Fix Color Contrast — 7 Elements
**File:** `tailwind.config.ts` → `--color-brand-gold-text`  
**Change:** Darken gold text used at ≤13px from `#A87E10` → `#7a5c06`  
**Why:** WCAG AA requires 4.5:1 for normal text; current ratio is 3.58–3.71  
**Pages affected:** Homepage eyebrow, stat strip, country card dimension text  
**Test:** Lighthouse accessibility score should move from 96 → 99+

### 2. Trim Homepage Meta Description
**File:** `app/page.tsx` or wherever the metadata object is defined  
**Current:** 184 chars (truncated in SERPs mid-sentence)  
**Target:** 150–160 chars, ending on a complete CTA  
**Suggested:** "Free document photo tools for India — passport photos, visa photos, exam form resizing and government document images. Pick your country or exam and get started free."  
(158 chars)

### 3. Rewrite 4 Quick-Win Page Titles
These pages are at pos 4–10 in GSC with 0 clicks — the titles don't match searcher intent:

| Page | Query | Current Title (guessed) | Suggested Title |
|---|---|---|---|
| `/voter-id-photo-resizer/` | "eci photo resize" | Voter ID Photo Resizer | ECI Voter ID Photo Resizer — Resize to 100KB Online Free |
| `/exam-resizer/ssc-cpo/` | "cpo photo" | SSC CPO Exam Resizer | SSC CPO Photo Size & Resize Tool — 35×45mm, JPG, Online Free |
| `/exam-requirements/army-agniveer/` | "army photo / army signature" | Army Agniveer Requirements | Army Agniveer Photo & Signature Size — Exact Specs & Resize Tool |
| `/tools/exam-package/` | "csir net signature size" | Exam Package Tool | CSIR NET Exam Photo & Signature Resizer — All-in-One Tool |

**Expected impact:** First 1–3 organic clicks from non-branded queries

### 4. Defer AdSense Loading
**Why:** Google AdSense contributes 229 KB + 107ms mobile main thread → directly causing LCP 3.5s  
**Fix options (pick one):**  
(a) Lazy-load ad units: add `data-full-width-responsive="true"` and load after `DOMContentLoaded`  
(b) Move AdSense script `async` attribute + `defer` attribute combined  
(c) Load ad units only when they scroll into viewport (Intersection Observer)  
**Expected impact:** Mobile LCP drops from 3.5s → ~2.2s (Good range), performance score rises 90 → 95+

---

## Phase 2 — This Month (Impact: +4–5 points)

### 5. Write Signature Cluster Editorial Hub
**Gap:** 7 signature tool pages, ZERO blog editorial support  
**High-value queries this cluster is missing:**
- "how to prepare signature for ssb form"  
- "exam application signature requirements india"  
- "online signature format nta"  
**Create:** `/blog/how-to-sign-exam-application-forms-india/` (1,800–2,200 words)  
Covers: size requirements, color, on plain white, no borders, sample images, links to all 7 tools

### 6. Write PDF Document Tools Editorial Hub
**Gap:** 8 PDF tools, 2 blog posts, no cross-linking, no pillar page  
**Create:** `/blog/how-to-prepare-documents-for-exam-applications-india/` (2,000–2,500 words)  
Covers: file size limits (SSC 100KB, UPSC 300KB, NTA 100KB), JPG vs PDF, scanning tips  
Links to: resize-kb, compress-pdf, merge-pdf, pdf-to-jpg tools

### 7. Add 1 Image Per Blog Post (Priority: 6 posts)
**Why:** Zero inline images in all blog posts — Lighthouse E-E-A-T signal, dwell time impact  
**Start with top-6 by GSC impressions:** exam-photo-signature-size-guide, indian-passport-photo-size-rules, resume-photo-size-and-rules, best-free-passport-photo-maker, best-free-exam-photo-resizer, why-passport-photos-get-rejected  
**Image type:** Process screenshot or annotated sample output (before/after crop)  
**Format:** `next/image` with descriptive alt text and `width`/`height` for CLS prevention

### 8. Make "Keep Reading" Cluster-Aware
**File:** `components/blog/BlogExplorer.tsx` or `BlogPostLayout` "Keep reading" section  
**Current:** Shows same 2 array-position posts regardless of topic  
**Fix:** Add `cluster` tag to `BLOG_POSTS` array (passport / exam / signature / pdf / linkedin); filter "Keep reading" to same-cluster posts  
**Impact:** Users reading exam blog posts see exam posts (not passport posts) — reduces bounce, increases session depth

---

## Phase 3 — Next 3 Months (Impact: +3 points)

### 9. IndexNow on Deploy
**Tool:** Cloudflare Pages deploy hook  
**API:** `api.indexnow.org/indexnow` (Bing, Yandex, Naver)  
**Implementation:** Add a `_routes.json` post-deploy hook or Cloudflare Worker  
**Cost:** Free

### 10. Add `SearchAction` to WebSite Schema
**File:** `lib/schema.ts` organizationSchema or layoutSchema  
**Add:**
```json
"potentialAction": {
  "@type": "SearchAction",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://easyphoto.in/tools/exam-package/?q={search_term_string}"
  },
  "query-input": "required name=search_term_string"
}
```
**Impact:** Enables Google Sitelinks Searchbox for branded queries

### 11. Add Image Sitemap Extensions
**File:** `scripts/gen-sitemap.mjs` or equivalent  
**Add:** `<image:image>` tags for pages with OG images (country pages, tool pages)  
**Impact:** Discovered in Google Images — visual tool site is underrepresented

### 12. Expand `sameAs` When Profiles Exist
**File:** `lib/schema.ts` → `organizationSchema.sameAs`  
**Current:** `["https://www.pinterest.com/easyphoto0604/"]`  
**Add when ready:** YouTube channel, LinkedIn company page, X/Twitter account

---

## Score Forecast

| After Phase | Estimated Score |
|---|---|
| Baseline (Jun 18) | 71/100 |
| Current (Jun 21) | **81/100** |
| After Phase 1 | 84/100 |
| After Phase 2 | 87/100 |
| After Phase 3 | 90/100 |

---

## What NOT to Touch

- URL structure — GSC is actively indexing; URL changes reset crawl progress
- robots.txt AI bot entries — explicitly allows all major AI crawlers (keep)
- llms.txt — comprehensive and working
- Sitemap URLs — 277 pages submitted, 0 errors
- Homepage title — already updated (no longer cannibalizing /passport-photo/)
