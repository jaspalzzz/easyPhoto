# SEO Action Plan — easyphoto.in
**Updated:** 2026-06-23 · **Score:** 61/100 → Target 74–78 after Phase 1 → 86–90 after Phase 4
**Note:** Prior plan (2026-06-21) used estimated PSI data (81/100). Live PSI run today revealed actual mobile LCP of 10,501 ms (POOR), causing a real score of 61/100. Phase 1 fixes address this directly.

---

## Phase 1: Critical Fixes — Week 1 (by 2026-06-30)
*Expected score after: 74–78/100. These 6 fixes address 80% of the gap.*

### P1.1 — Convert Hero PNG Images to WebP ⚡ HIGHEST IMPACT
**File:** `public/images/` + `components/site/HeroVisual.tsx`
**Effort:** 2–4 hours · **Impact:** Mobile LCP: 10,501 ms → ~2,200 ms (POOR → GOOD)

The three above-fold PNGs total 2,076 KB. WebP at display size: ~35–50 KB each.

```bash
# Offline conversion (simplest for static export)
cwebp -q 82 public/images/sample4_before_1782052955340.png -o public/images/sample4_before.webp
cwebp -q 82 public/images/sample4_after_1782052969219.png -o public/images/sample4_after.webp
cwebp -q 82 public/images/sample2_before.png -o public/images/sample2_before.webp
```
Update `HeroVisual.tsx` to reference `.webp` filenames.

### P1.2 — Add LCP Image Preload Hint
**File:** `app/layout.tsx` · **Effort:** 30 min · **Impact:** +~300 ms LCP gain

```html
<link rel="preload" as="image" href="/images/sample4_before.webp" fetchpriority="high" />
```

### P1.3 — Add /blog/ to Site Navigation
**File:** `components/site/Header.tsx` or `Footer.tsx` · **Effort:** 30 min
**Impact:** /blog/ hub indexed within 1–2 weeks; hub-and-spoke link flow restored

The `/blog/` page has **never been crawled** (confirmed: GSC URL Inspection). Cause: no inbound link from any regularly-crawled page. One `<a href="/blog/">Blog</a>` in the nav fixes this.

### P1.4 — 301 Redirect /india/ → /india-passport-photo-maker/
**File:** `next.config.js` · **Effort:** 30 min · **Impact:** Fixes hard 404, preserves link equity

```js
async redirects() {
  return [
    { source: '/india/', destination: '/india-passport-photo-maker/', permanent: true },
  ]
}
```

### P1.5 — Verify Exam Page Routing
**Files:** `next.config.js`, `app/tools/` directory · **Effort:** 1 hour
**Impact:** Restores exam keyword cluster (SXO score 14/100 → 60+/100)

SXO analysis: exam pages returning 404 make the entire exam keyword cluster invisible to Google. Verify and fix routing for:
- `/tools/exam-package/`
- `/tools/form-resizer/[exam]/`
- `/tools/exam-resizer/[exam]/`

### P1.6 — Add Meta Descriptions to Top 10 Pages
**Files:** `app/**/page.tsx` (metadata export) · **Effort:** 2–4 hours
**Impact:** CTR improvement + AI search citation quality

All 7 audited pages have zero meta descriptions. Add via Next.js metadata API. Priority:
1. `/` — "Free passport photo and document tools for India. Compliant photos for passport, visa, SSC, UPSC, and 50+ exams — everything runs in your browser, never uploaded."
2. `/passport-photo/` — "Make a compliant passport photo online. Correct size, white background, ICAO-compliant — processed in your browser. No upload required."
3. `/india-passport-photo-maker/` — "Indian passport photo: correct 51×51 mm size, white background, face guidelines met. Free online tool. Photo never leaves your device."
4. `/tools/` — "Free document tools for India: passport photos, exam photo resize, sign PDF, remove background, compress PDF — all processed in your browser."
5. `/blog/` — "Guides on Indian passport photos, exam photo requirements, and document compliance. Written by photo ID specialists."

---

## Phase 2: High-Impact SEO — Weeks 2–3 (by 2026-07-14)
*Expected score after: 78–82/100.*

### P2.1 — Cloudflare www → non-www Redirect (15 min)
Cloudflare Dashboard → Rules → Redirect Rules: `www.easyphoto.in/*` → `https://easyphoto.in/$1` (301).
GSC confirmed www-split indexation on at least 3 page families.

### P2.2 — Fix BlogPosting.image — Per-Post OG Image (1 hour)
All 24 blog posts use the generic site `/og.png`. Replace with per-post OG image URL in the BlogPosting schema. Blocks Article rich result eligibility for all 24 posts.

### P2.3 — Optimise Army Agniveer Page (2 hours)
GSC: 3 queries at positions 3–9, 6 impressions, **0 clicks**. Fastest path to first non-brand organic clicks.
- New title: `Army Agniveer Photo & Signature Size Requirements 2026 | easyPhoto`
- Add FAQPage schema with the 3 ranking queries as questions

### P2.4 — Optimise Voter ID Photo Resizer H1 (1 hour)
Highest impression count in pos 4–10 band: 6 impressions for "eci photo resize" at 6.5.
- New H1: `ECI Photo Resize for Voter ID — Free Online Tool`
- Add "eci photo resize" to meta description

### P2.5 — Defer AdSense via IntersectionObserver (2 hours)
AdSense loads 156 ms of main-thread work during the LCP window. Defer until ad slot enters viewport.

### P2.6 — Fix .animate-scan-beam to Composited Properties (1 hour)
`HeroVisual.tsx`: Replace background-color animation with `transform`/`opacity` (GPU compositor — eliminates 650 ms forced-reflow during page load).

---

## Phase 3: Content & Authority — Month 2 (by 2026-07-31)
*Expected score after: 82–86/100.*

| Action | File | Effort | Impact |
|---|---|---|---|
| Expand blog post to 1,800+ words | `content/blog/why-exam-photo-signature-rejected.mdx` | 3–4h | Meets blog minimum for exam queries |
| Create `/indian-passport-photo-requirements/` guide (2,500 words) | New page | 1 day | Unlocks second SERP intent (currently no page) |
| Author byline + last-verified date on all 53 exam pages | Exam page template | Half day | E-E-A-T consistency |
| Create `llms-full.txt` with inline spec tables | `public/llms-full.txt` | Half day | AI agents get specs without secondary fetches |
| Fix sitemap lastmod to use per-page `updatedAt` | Sitemap generator | 2h | Freshness signals accurate |
| Add SearchAction to WebSite schema | Homepage schema | 1h | Sitelinks Searchbox eligibility |
| Add 2+ inline images to top 5 blog posts | Blog MDX files | Half day | Media richness 4→9+/15 |

---

## Phase 4: Growth & Monitoring — Ongoing

| Action | Notes |
|---|---|
| Weekly GSC review | Track army-agniveer pos 3 → clicks conversion |
| Monthly PSI run | Verify mobile LCP stays GOOD after image fix |
| Product Hunt listing | Highest-ROI first backlink (single high-DA link) |
| Indie Hackers post | Privacy-first angle plays well |
| Indian travel/visa/exam blog outreach | 5–10 emails/month |
| YouTube channel — 3 core videos | Highest AI citation signal (correlation 0.737) |
| Add GA4 property ID to Claude SEO config | Unlocks organic traffic tracking |
| Run `/seo drift baseline` after Phase 1 deploy | Captures post-fix state as new baseline |

---

## Score Projection

| Milestone | Score | Key Driver |
|---|---|---|
| Current | 61/100 | Mobile LCP 10,501 ms POOR |
| After Phase 1 | 74–78/100 | LCP GOOD + blog indexed + meta descriptions |
| After Phase 2 | 78–82/100 | www fixed + schema + GSC quick wins |
| After Phase 3 | 82–86/100 | Content depth + authority signals |
| After Phase 4 (6 months) | 86–90/100 | Backlinks + YouTube + CrUX field data |

---

*Updated 2026-06-23 from 8 specialist agents. Supersedes 2026-06-21 plan.*

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
