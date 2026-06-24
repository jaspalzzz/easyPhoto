# Google API Findings — easyphoto.in

**Data source:** Google API (field data + lab data)
**Audit date:** 2026-06-23
**Credential tier:** Tier 1 (API Key + Service Account)
**GSC date range:** 2026-05-26 to 2026-06-20 (28-day window, 2-3 day GSC lag)
**PSI date:** 2026-06-23 (lab data, Lighthouse)
**CrUX field data:** Not available — insufficient Chrome traffic volume for origin eligibility

---

## Core Web Vitals (Field Data — CrUX)

**CrUX field data is unavailable.** The origin `https://easyphoto.in/` does not meet Chrome UX Report eligibility thresholds — the site has insufficient real-user Chrome traffic to appear in the CrUX dataset (28-day rolling window). This applies to both the current-period CrUX API and the CrUX History API (25-week trend cannot be computed).

All CWV ratings below are derived from Lighthouse lab simulation (PSI), not field data. Note: CrUX eligibility typically requires several thousand real Chrome sessions per month. As organic traffic grows, field data will appear automatically.

---

## PageSpeed Insights — Lab Data (Google API, 2026-06-23)

### Mobile

| Metric | Value | Threshold | Rating |
|--------|-------|-----------|--------|
| Performance Score | 70/100 | — | NEEDS IMPROVEMENT |
| LCP (Largest Contentful Paint) | 10,501 ms | Good <=2,500ms / Poor >4,000ms | POOR |
| CLS (Cumulative Layout Shift) | 0.001 | Good <=0.10 | GOOD |
| TBT (Total Blocking Time, INP proxy) | 130 ms | Good <=200ms TBT | GOOD |
| FCP (First Contentful Paint) | 1,207 ms | Good <=1,800ms | GOOD |
| Speed Index | 5,300 ms | — | NEEDS IMPROVEMENT |
| Time to Interactive | 12,865 ms | — | POOR |
| SEO Score | 100/100 | — | GOOD |
| Accessibility Score | 90/100 | — | GOOD |
| Best Practices Score | 96/100 | — | GOOD |

### Desktop

| Metric | Value | Threshold | Rating |
|--------|-------|-----------|--------|
| Performance Score | 90/100 | — | GOOD |
| LCP (Largest Contentful Paint) | 1,921 ms | Good <=2,500ms | GOOD |
| CLS (Cumulative Layout Shift) | 0.003 | Good <=0.10 | GOOD |
| TBT (Total Blocking Time) | 60 ms | Good <=200ms | GOOD |
| FCP (First Contentful Paint) | 390 ms | Good <=1,800ms | GOOD |
| Speed Index | 1,263 ms | — | GOOD |
| Time to Interactive | 2,421 ms | — | GOOD |
| SEO Score | 100/100 | — | GOOD |
| Accessibility Score | 86/100 | — | NEEDS IMPROVEMENT |
| Best Practices Score | 96/100 | — | GOOD |

**Critical gap:** Mobile LCP of 10.5 s is 4.2x over the "Poor" threshold. The mobile/desktop delta (10.5 s vs 1.9 s) points to image delivery as the primary cause. Google is using the **mobile crawler** (confirmed via URL Inspection), so the 10.5 s figure is what matters for CWV rankings.

---

## CWV Trend (25-week)

Not available. CrUX History API returned no data for `https://easyphoto.in/` — same eligibility reason as current CrUX (insufficient Chrome traffic volume). A 25-week trend cannot be computed from field data.

**Recommendation:** Run PSI weekly and store performance scores to build a synthetic trend until CrUX eligibility is reached.

---

## Root-Cause Breakdown — Mobile LCP (Critical)

### 1. Unoptimized homepage images — est. 2,042 KiB wasted

| Image | Total Size | Wasted Bytes |
|-------|------------|--------------|
| /images/sample2_before_1782052888740.png | 800 KiB | 788 KiB |
| /images/sample4_before_1782052955340.png | 713 KiB | 701 KiB |
| /images/sample4_after_1782052969219.png | 563 KiB | 551 KiB |

All three are raw PNGs served at full resolution. Converting to WebP/AVIF and sizing to display dimensions would save ~2 MiB per mobile page load. Desktop image waste is even larger: 5 images totalling 3,170 KiB wasted.

### 2. Total page weight

- Mobile: 3,061 KiB (86 requests: 26 images, 39 scripts, 5 fonts)
- Desktop: 4,270 KiB (94 requests: 28 images, 42 scripts, 5 fonts)

### 3. Render-blocking CSS — est. 320 ms wasted (mobile)

- `/_next/static/css/6f1f78d2e4581295.css` (17.8 KiB, 317 ms blocked)
- `/_next/static/css/947194dd5522290f.css` (3.1 KiB, 475 ms blocked)

### 4. AdSense JavaScript — 160 KiB unused out of 172 KiB loaded

- `show_ads_impl_fy2021.js`: 130 KiB wasted bytes, 103 ms long task
- `adsbygoogle.js`: 30 KiB wasted bytes, 89 ms long task
- Third-party breakdown: Google/Doubleclick Ads = 229 KiB transferred, 156 ms main-thread time

### 5. LCP element not discoverable from HTML (desktop flag)

The LCP image is not preloaded — browser discovers it late in the rendering waterfall (confirmed by `lcp-discovery-insight` audit failure on desktop).

### 6. Non-composited animation on visible element

`.animate-scan-beam` uses inline styles (`background:#10b981`) and triggers forced reflow. This runs off the GPU compositor, contributing to style/layout main-thread time (650 ms mobile).

### 7. Legacy JavaScript

`/_next/static/chunks/1255-426489508942ad19.js` ships 12 KiB of polyfills unnecessary for modern browsers.

### 8. DOM size

1,954 elements; body has 148 direct children; max DOM depth: 14. Contributes to 3.2 s main-thread work on mobile (script evaluation 706 ms, style & layout 651 ms, rendering 420 ms).

### 9. Server TTFB

22 ms (mobile) / 11 ms (desktop) — excellent. Cloudflare edge is not a bottleneck.

---

## Accessibility Failures

| Issue | Severity | Count |
|-------|----------|-------|
| Color contrast insufficient (foreground/background) | High | 302 instances mobile, 298 desktop |
| `<dl>` contains invalid direct children (div > span, div > div) | Medium | 1 dl element (homepage stats) |
| `<dt>` / `<dd>` items not wrapped in `<dl>` parent | Medium | 12 instances |
| Touch targets too small (keyboard shortcut button 34x23px) | Low | 1 |
| Visible label does not match accessible name | Low | 1 button (desktop only) |

The 302 color contrast failures span UI badges and feature list items with green text on light green backgrounds (e.g., `#059669` on `#ecfdf5`, contrast ratio 3.57:1 vs required 4.5:1 for small text). These also directly impact Google's accessibility scoring and WCAG compliance.

**Security note:** CSP `script-src` uses host allowlists + `unsafe-inline` — XSS mitigations are ineffective. No Trusted Types directive present. Both flagged High severity by Lighthouse Best Practices.

---

## GSC Search Performance (28 days: 2026-05-26 to 2026-06-20)

### Totals

| Metric | Value |
|--------|-------|
| Total Clicks | 23 |
| Total Impressions | 589 |
| Average CTR | 3.9% |
| Average Position | 27.4 |
| Unique query/page combinations | 190 |

Only one query generated clicks. All 189 remaining query/page combinations recorded 0 clicks. The site is in an early-stage organic phase — indexed across many URLs but lacking page-1 visibility for commercial intent keywords.

### Top Queries by Clicks

| Query | Page | Clicks | Impressions | CTR | Position |
|-------|------|--------|-------------|-----|----------|
| easyphoto | / | 8 | 17 | 47.1% | 1.8 |

### www vs non-www Canonicalization Risk

GSC shows impressions split across both variants for the same pages:

| Page | non-www impressions | www impressions |
|------|--------------------|-----------------| 
| malaysia-visa-photo-maker/ | 1 (pos 40) | 3 (pos 57.7) |
| upsc-photo-resizer/ | — | 7 (pos 48.3) |
| china-visa-photo-maker/ | — | 1 (pos 78) |

This confirms Google is indexing `www.easyphoto.in` variants separately for some pages, splitting link equity. All `www` URLs must 301-redirect to non-www and canonical tags must consistently point to `https://easyphoto.in/`.

---

## Quick Wins from GSC — Queries at Position 4–10 with Impressions

These queries are ranking on page 1 or near it with 0 clicks. Ranking improvements or CTR optimisation could deliver first non-brand clicks quickly.

| Priority | Query | Page | Impressions | Position | Recommended Action |
|----------|-------|------|-------------|----------|--------------------|
| HIGH | army photo | /exam-requirements/army-agniveer/ | 1 | 3.0 | Already pos 3; add FAQ schema, update title to "Army Agniveer Photo Requirements 2026" |
| HIGH | eci photo resize | /voter-id-photo-resizer/ | 6 | 6.5 | Highest impression count in top-10; strengthen H1 to match "ECI photo resize" exactly |
| HIGH | cpo photo | /exam-resizer/ssc-cpo/ | 2 | 6.5 | Add "SSC CPO photo size 2026" to title; add spec table above fold |
| HIGH | ssc cpo image | /exam-resizer/ssc-cpo/ | 1 | 6.0 | Same page as above; consolidate keyword targeting |
| HIGH | ssc cgl live photo background | /blog/ssc-cgl-chsl-photo-signature-guide-2026/ | 1 | 6.0 | Pos 6 on blog post; add Article + FAQ structured data |
| MEDIUM | csir net signature size | /tools/exam-package/ | 2 | 8.5 | Add CSIR NET signature spec (80x35px, max 50KB) above fold |
| MEDIUM | cuet admit card photo size | /exam-requirements/cuet/ | 1 | 8.0 | Improve meta description specificity; add admit card example |
| MEDIUM | sign on picture online | /tools/sign-image/ | 1 | 8.0 | Add "sign on picture" phrasing to H1 |
| MEDIUM | indian army passport photo | /exam-requirements/army-agniveer/ | 2 | 9.0 | Same page as "army photo"; consolidate and strengthen with photo spec table |
| MEDIUM | army signature | /exam-requirements/army-agniveer/ | 3 | 9.0 | 3 impressions at pos 9; add Army Agniveer signature dimension table |
| MEDIUM | sign add on photo | /tools/sign-image/ | 1 | 10.0 | Borderline page 1; strengthen internal linking to this tool |

**Highest single-page opportunity:** `/exam-requirements/army-agniveer/` ranks for 3 separate queries in the 3-9 position band (army photo pos 3, army signature pos 9, indian army passport photo pos 9) with total 6 impressions and 0 clicks. Optimising this one page — FAQ schema, updated title, spec table — is the fastest path to first non-brand clicks.

**Sign-image tool pattern:** `/tools/sign-image/` appears for 10+ sign-related queries (sign on picture online pos 8, sign add on photo pos 10, add sign in image online pos 29, etc.). The page is competing with itself across variations. A consolidated H1 targeting "Add Signature to Photo Online" with FAQ content for each query variant would consolidate ranking signals.

---

## Indexation Status (URL Inspection API)

| Page | Verdict | Coverage State | Last Crawled | Crawled As | Rich Results |
|------|---------|----------------|--------------|------------|--------------|
| https://easyphoto.in/ | PASS | Submitted and indexed | 2026-06-22 09:48 UTC | Mobile | None |
| https://easyphoto.in/passport-photo/ | PASS | Submitted and indexed | 2026-06-20 04:09 UTC | Mobile | Breadcrumbs (PASS) |
| https://easyphoto.in/india/ | NEUTRAL | URL unknown to Google | Never | — | — |
| https://easyphoto.in/blog/ | NEUTRAL | URL unknown to Google | Never | — | — |

**Critical findings:**

1. `/india/` — Never crawled by Google. If this is a live country hub page intended to capture India-specific passport photo traffic, it must be linked from internal navigation and included in the sitemap.

2. `/blog/` — Never crawled. Individual blog posts are appearing in GSC impressions (GSC shows blog post URLs with impressions) but the blog index page itself is unknown to Google. Googlebot cannot discover new posts by crawling `/blog/` when the page doesn't exist in its index. Add a direct link to `/blog/` in the main navigation or footer immediately.

3. Canonical match confirmed for both indexed pages (Google canonical = user-declared canonical, non-www).

4. All crawls use the **Mobile crawler** — confirming mobile-first indexing is active. The 10.5 s mobile LCP is therefore the signal Google evaluates for CWV.

5. `/passport-photo/` has Breadcrumbs rich result passing — the only page with structured data confirmed by Google.

---

## GSC Sitemaps

| Sitemap | Last Submitted | Errors | Warnings | URLs Submitted |
|---------|---------------|--------|----------|----------------|
| https://easyphoto.in/sitemap.xml | 2026-06-09 | 0 | 0 | 240 |

**Observations:**

- Sitemap is clean: zero errors, zero warnings. 240 URLs submitted.
- Submitted 14 days ago. If new pages have been added since, resubmit.
- Cross-reference gap: 240 URLs in sitemap vs 190 query/page rows in GSC (most at 0 clicks) confirms many pages are submitted but not yet ranking.
- Verify that `/india/` and `/blog/` are present in sitemap.xml — both are unknown to Google despite being intended site pages.

---

## Score: 38/100

**Scoring rationale (Google API signals only):**

| Category | Raw Score | Weight | Weighted Score |
|----------|-----------|--------|---------------|
| Mobile LCP (10,501 ms — Poor) | 0/25 | 25% | 0 |
| Desktop Performance (90/100) | 18/20 | 20% | 18 |
| CLS — both devices (0.001 / 0.003) | 10/10 | 10% | 10 |
| SEO technical (PSI 100/100) | 10/10 | 10% | 10 |
| Indexation coverage (2/4 key pages indexed; /blog/ and /india/ unknown) | 5/15 | 15% | 5 |
| GSC click traffic (23 clicks, 1 query, no non-brand wins) | 0/10 | 10% | 0 |
| Accessibility (avg 88/100 but 302 contrast failures) | 7/10 | 10% | 7 |
| **Raw total** | | | **50/100** |

Penalty: -12 points for CrUX ineligibility. No field data means Google's own ranking systems have insufficient real-user signal for this origin, which correlates with low organic authority and compounds the mobile LCP risk.

**Adjusted score: 38/100**

---

## Priority Action List

### Critical — Address within 1 week

1. **Convert homepage hero images to WebP/AVIF.** The three PNG before/after images (`sample2_before`, `sample4_before`, `sample4_after`) account for 2+ MiB of wasted bytes and are the direct cause of the 10.5 s mobile LCP. Use Next.js `<Image>` component with correct `sizes` prop, or serve via Cloudflare Images with automatic format negotiation. Target: <200 KiB total for above-fold images on mobile.

2. **Add `<link rel="preload">` for the LCP image.** The LCP discovery audit flagged that the LCP element is not discoverable from HTML immediately. Add a `<link rel="preload" as="image">` in `<head>` for whichever image is the LCP candidate on mobile.

3. **Fix `/blog/` indexation.** Add a direct link to `/blog/` in the main navigation or footer. Ensure `/blog/` is included in `sitemap.xml`. The blog index has never been crawled; Googlebot cannot discover new posts through it.

4. **Fix `/india/` indexation.** Same action: add to sitemap, add internal link from homepage or navigation. Currently completely unknown to Google.

### High — Address within 2 weeks

5. **Optimise `/exam-requirements/army-agniveer/`.** Already ranking pos 3 for "army photo" with 0 clicks. Add FAQ structured data (schema.org/FAQPage), update title to "Army Agniveer Photo & Signature Requirements 2026", improve meta description with a clear CTA. This single page ranks for 3 queries in the 3-9 position range.

6. **Fix `<dl>` / `<dt>` / `<dd>` markup on homepage stats section.** The structure `dl > div > dt`, `dl > div > dd` is invalid HTML. Wrap each pair correctly or switch to a different semantic element. Currently causing 12 accessibility violations.

7. **Fix www/non-www canonicalization.** Confirm all `www.easyphoto.in` URLs 301-redirect to `easyphoto.in`. Verify canonical tags on all pages point to the non-www variant. Currently causing impression split in GSC for at least 3 page families.

### Medium — Address within 4 weeks

8. **Defer or lazy-load AdSense JavaScript.** The AdSense bundle (172 KiB, 130 KiB unused) loads on page init and blocks the main thread for 103 ms. Use intersection-observer to load ads after the LCP element paints. Evaluate whether homepage ad revenue offsets the ranking penalty from Poor mobile LCP.

9. **Fix color contrast failures.** 302+ instances of green text on green backgrounds failing WCAG AA (e.g., `#059669` on `#ecfdf5`, ratio 3.57:1 vs required 4.5:1). Primary fix: increase contrast on feature label chips ("BG Removed", "Face Aligned", status badges).

10. **Move `.animate-scan-beam` to compositor-eligible animation.** Replace inline `background` style animation with CSS `transform`/`opacity` so the animation runs on the GPU compositor and eliminates the forced-reflow penalty.

11. **Optimise `/tools/sign-image/` for sign-overlay queries.** Multiple queries in positions 8-35 show latent demand. Consolidate with a clear H1 ("Add Signature to Photo Online") and FAQ content addressing each query variant. Strengthen internal linking to this tool from exam resizer pages.

---

## Findings for audit-data.json

```json
{
  "category": "Google SEO Data",
  "credential_tier": 1,
  "data_freshness": {
    "gsc": "28-day rolling, lag 2-3 days (2026-05-26 to 2026-06-20)",
    "psi": "Lab snapshot 2026-06-23",
    "crux": "Unavailable — insufficient Chrome traffic volume"
  },
  "organic_performance": {
    "clicks_28d": 23,
    "impressions_28d": 589,
    "avg_ctr_pct": 3.9,
    "avg_position": 27.4,
    "brand_clicks": 8,
    "non_brand_clicks": 15,
    "queries_tracked": 190
  },
  "cwv_lab_mobile": {
    "lcp_ms": 10501,
    "lcp_rating": "Poor",
    "cls": 0.001,
    "cls_rating": "Good",
    "tbt_ms": 130,
    "tbt_rating": "Good",
    "performance_score": 70
  },
  "cwv_lab_desktop": {
    "lcp_ms": 1921,
    "lcp_rating": "Good",
    "cls": 0.003,
    "cls_rating": "Good",
    "tbt_ms": 60,
    "tbt_rating": "Good",
    "performance_score": 90
  },
  "cwv_field": {
    "available": false,
    "reason": "Insufficient Chrome traffic for CrUX eligibility"
  },
  "sitemap": {
    "url": "https://easyphoto.in/sitemap.xml",
    "submitted": 240,
    "errors": 0,
    "warnings": 0,
    "last_submitted": "2026-06-09"
  },
  "indexation": {
    "homepage": "PASS",
    "passport_photo": "PASS",
    "india": "NEUTRAL - URL unknown to Google",
    "blog_index": "NEUTRAL - URL unknown to Google"
  },
  "quick_wins": [
    {"query": "army photo", "position": 3.0, "page": "/exam-requirements/army-agniveer/", "impressions": 1},
    {"query": "eci photo resize", "position": 6.5, "page": "/voter-id-photo-resizer/", "impressions": 6},
    {"query": "cpo photo", "position": 6.5, "page": "/exam-resizer/ssc-cpo/", "impressions": 2},
    {"query": "ssc cpo image", "position": 6.0, "page": "/exam-resizer/ssc-cpo/", "impressions": 1},
    {"query": "ssc cgl live photo background", "position": 6.0, "page": "/blog/ssc-cgl-chsl-photo-signature-guide-2026/", "impressions": 1},
    {"query": "csir net signature size", "position": 8.5, "page": "/tools/exam-package/", "impressions": 2},
    {"query": "cuet admit card photo size", "position": 8.0, "page": "/exam-requirements/cuet/", "impressions": 1},
    {"query": "sign on picture online", "position": 8.0, "page": "/tools/sign-image/", "impressions": 1},
    {"query": "army signature", "position": 9.0, "page": "/exam-requirements/army-agniveer/", "impressions": 3},
    {"query": "indian army passport photo", "position": 9.0, "page": "/exam-requirements/army-agniveer/", "impressions": 2}
  ],
  "issues": [
    {"severity": "Critical", "area": "Performance", "description": "Mobile LCP 10,501ms (Poor) — unoptimised PNG images ~2MiB above fold"},
    {"severity": "Critical", "area": "Indexation", "description": "/blog/ URL unknown to Google — never crawled"},
    {"severity": "Critical", "area": "Indexation", "description": "/india/ URL unknown to Google — never crawled"},
    {"severity": "High", "area": "Performance", "description": "156 KiB unused JavaScript from AdSense third-party scripts blocking main thread"},
    {"severity": "High", "area": "Performance", "description": "Render-blocking CSS delays LCP by ~320ms on mobile"},
    {"severity": "High", "area": "Performance", "description": "LCP image not preloaded — late browser discovery"},
    {"severity": "High", "area": "Organic", "description": "Zero non-brand clicks — all commercial queries rank page 3+"},
    {"severity": "Medium", "area": "Canonicalization", "description": "www vs non-www impression split in GSC — at least 3 page families affected"},
    {"severity": "Medium", "area": "Accessibility", "description": "302 color contrast failures — green text on green backgrounds below WCAG AA"},
    {"severity": "Medium", "area": "Markup", "description": "<dl>/<dt>/<dd> invalid nesting on homepage stats section — 12 violations"},
    {"severity": "Low", "area": "Performance", "description": "Legacy JS polyfills — 12 KB savings available"},
    {"severity": "Low", "area": "Performance", "description": "Non-composited CSS animation (.animate-scan-beam) triggers forced reflow"}
  ]
}
```
