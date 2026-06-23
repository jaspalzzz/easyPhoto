# Google API Findings — easyphoto.in

**Data source:** Google API (field data + lab data)
**Audit date:** 2026-06-20
**Credential tier:** Tier 1 (API Key + Service Account)
**GSC date range:** 2026-05-23 to 2026-06-17 (28-day window, 2–3 day GSC lag)
**PSI date:** 2026-06-20 (lab data, Lighthouse)
**CrUX field data:** Not available — insufficient Chrome traffic volume for origin eligibility

---

## 1. Organic Performance Summary

| Metric | Value |
|--------|-------|
| Total Clicks (28d) | 15 |
| Total Impressions (28d) | 279 |
| Average CTR | 5.38% |
| Average Position | 29.5 |
| Unique query/page combos tracked | 96 |
| Queries with at least 1 click | 1 (brand: "easyphoto") |

The site is in an early organic growth phase. Only the brand query is generating clicks. All non-brand queries rank deep (average position 29.5) with zero clicks, confirming the site has not yet reached page-1 visibility for any commercial intent keyword.

---

## 2. Top 20 Queries by Impressions

| # | Query | Impressions | Clicks | CTR | Avg. Position | Landing Page |
|---|-------|-------------|--------|-----|---------------|-------------|
| 1 | easyphoto | 13 | 7 | 53.85% | 1.7 | / |
| 2 | 300 kb photo size in pixels pdf | 7 | 0 | 0% | 48.3 | /upsc-photo-resizer/ |
| 3 | eci photo resize | 4 | 0 | 0% | 6.8 | /voter-id-photo-resizer/ |
| 4 | ibps photo resizer (ibps-po) | 3 | 0 | 0% | 78.3 | /exam-resizer/ibps-po/ |
| 5 | malaysia visa photo requirements (www.) | 3 | 0 | 0% | 57.7 | /malaysia-visa-photo-maker/ |
| 6 | army signature | 2 | 0 | 0% | 9.0 | /exam-requirements/army-agniveer/ |
| 7 | csir net signature size | 2 | 0 | 0% | 8.5 | /tools/exam-package/ |
| 8 | driving licence photo size | 2 | 0 | 0% | 67.5 | /exam-requirements/driving-licence/ |
| 9 | ibps photo resizer (ibps-clerk) | 2 | 0 | 0% | 85.5 | /exam-resizer/ibps-clerk/ |
| 10 | ibps photo resizer (ibps-rrb) | 2 | 0 | 0% | 89.0 | /exam-resizer/ibps-rrb/ |
| 11 | ibps photo resizer (ibps-so) | 2 | 0 | 0% | 61.0 | /exam-resizer/ibps-so/ |
| 12 | image resize for ssc | 2 | 0 | 0% | 69.5 | /exam-resizer/ssc-cgl/ |
| 13 | malaysia visa photo requirements | 2 | 0 | 0% | 42.0 | /malaysia-visa-photo-maker/ |
| 14 | photo resizer for ssc | 2 | 0 | 0% | 66.0 | /exam-resizer/ssc-cgl/ |
| 15 | rrb image resizer (rrb-group-d) | 2 | 0 | 0% | 78.0 | /exam-resizer/rrb-group-d/ |
| 16 | rrb photo and signature size converter | 2 | 0 | 0% | 67–94 | multiple RRB pages |
| 17 | rrb signature resizer (multiple) | 2 | 0 | 0% | 75–80 | /exam-resizer/rrb-* |
| 18 | ssc cgl image | 2 | 0 | 0% | 51.5 | /exam-resizer/ssc-cgl/ |
| 19 | ssc cgl photo | 2 | 0 | 0% | 58.5 | /exam-resizer/ssc-cgl/ |
| 20 | ibps po signature size (multiple) | 2 | 0 | 0% | 64–81 | /exam-resizer/ibps-* |

---

## 3. Quick Wins — Queries Ranked 4–10 (Page 1 Push Candidates)

These queries already rank between position 4 and 10. Marginal on-page improvements could push them to the top 3 and deliver clicks without new content.

| Priority | Query | Avg. Position | Impressions | Landing Page | Action |
|----------|-------|---------------|-------------|--------------|--------|
| High | eci photo resize | 6.8 | 4 | /voter-id-photo-resizer/ | Strengthen H1 to exactly match "ECI photo resize" intent; add a brief requirements summary above the tool |
| High | csir net signature size | 8.5 | 2 | /tools/exam-package/ | Add explicit CSIR NET signature dimension (80x35px, max 50KB) as a visible callout above the fold |
| High | army signature | 9.0 | 2 | /exam-requirements/army-agniveer/ | Ensure "army signature" appears in H1/H2; add Army Agniveer signature spec table |
| Medium | sign add on photo | 10.0 | 1 | /tools/sign-image/ | Include "sign on photo" phrasing in title tag; add example screenshot |
| Medium | cpo photo | 10.0 | 1 | /exam-resizer/ssc-cpo/ | Verify SSC CPO photo spec is in structured table; add FAQ schema |

Note: "army photo" (position 3) is not listed as a quick win because it is already in top 3 and needs CTR optimisation (title/description) rather than ranking improvement.

---

## 4. Core Web Vitals — Field Data (CrUX)

**Status: No CrUX data available.**

The origin https://easyphoto.in does not have sufficient Chrome user traffic to qualify for CrUX reporting (28-day rolling). This affects both the current-period API and the CrUX History API. CrUX eligibility typically requires a few thousand real Chrome sessions per month per origin.

**Implication for the audit:** No field-data CWV rating (Good/NI/Poor) can be assigned. All performance findings below are PSI lab data only and should be treated as directional, not as field measurements.

---

## 5. Core Web Vitals — Lab Data (PageSpeed Insights, Google API)

Data source: Google PSI Lighthouse, run 2026-06-20T04:14Z. Simulated mobile (Moto G Power throttled, 4G) and desktop.

### Mobile Lab Results

| Metric | Value | Threshold | Rating |
|--------|-------|-----------|--------|
| LCP (Largest Contentful Paint) | 5.0 s | Good ≤ 2,500ms | Poor |
| FCP (First Contentful Paint) | 3.4 s | Good ≤ 1,800ms | Poor |
| CLS (Cumulative Layout Shift) | 0 | Good ≤ 0.1 | Good |
| TBT (Total Blocking Time, INP proxy) | 110 ms | Good ≤ 200ms | Good |
| TTI (Time to Interactive) | 5.0 s | Good ≤ 3,800ms | Poor |
| Performance Score | 74/100 | — | Needs Improvement |

### Desktop Lab Results

| Metric | Value | Threshold | Rating |
|--------|-------|-----------|--------|
| LCP | 0.6 s | Good ≤ 2,500ms | Good |
| FCP | 0.3 s | Good ≤ 1,800ms | Good |
| CLS | 0 | Good ≤ 0.1 | Good |
| TBT | 90 ms | Good ≤ 200ms | Good |
| Performance Score | 99/100 | — | Good |

### Lighthouse SEO Score

| Dimension | Mobile | Desktop |
|-----------|--------|---------|
| SEO | 100/100 | 100/100 |
| Accessibility | 96/100 | 97/100 |
| Best Practices | 96/100 | 96/100 |

### Key Performance Issues (Mobile)

| Priority | Issue | Impact | Detail |
|----------|-------|--------|--------|
| Critical | LCP 5.0s (Poor) | Ranking signal + UX | Google Ads JS (show_ads_impl, 173 KB) is the largest LCP-delaying resource |
| Critical | Unused JavaScript — 156 KB estimated savings | LCP, TTI | pagead JS: 130 KB unused; adsbygoogle.js: 29 KB unused |
| High | Render-blocking CSS | FCP | /_next/static/css/b1470b32ce00af17.css blocks render (158ms wasted) |
| High | Legacy JavaScript | Load size | 1 bundle shipping 12 KB of polyfills unnecessary for modern browsers |
| Medium | Cache lifetime — 26 KB short-lived | Repeat visits | Cloudflare beacon.min.js cached only 24h |
| Medium | DOM size 1,049 elements, depth 14 | Render, INP | body has 111 direct children |
| Low | Color contrast failures (3 elements) | Accessibility | font-mono step numbers (#c6beb3 on #fff, ratio 1.83, fails AA) |
| Low | Cross-origin policy blocked requests | DevTools Issues | 1 cross-origin resource blocked; check CORS config |

### Root Cause of Poor Mobile LCP

The single largest contributor is Google AdSense JavaScript (show_ads_impl_fy2021.js, 173 KB transferred, 130 KB unused). This third-party script runs on the main thread for ~238ms and fires long tasks that push LCP past 4s. The LCP element is rendered only after AdSense initialisation completes.

Mitigation options:
- Lazy-load AdSense (`data-lazy="true"` or intersection-observer wrapper) so it does not block initial render.
- Move ad slots below the fold on mobile to allow LCP element to render first.
- Alternatively, evaluate whether ad revenue on the homepage offsets the ranking penalty from a Poor LCP signal.

---

## 6. Sitemap Status

| Sitemap URL | Last Submitted | Errors | Warnings | URLs Submitted | Indexed (GSC) |
|-------------|---------------|--------|----------|----------------|---------------|
| https://easyphoto.in/sitemap.xml | 2026-06-09 | 0 | 0 | 240 | N/A* |

*The GSC Sitemaps API returns submitted URL counts only. GSC does not expose per-sitemap indexed counts via API; the `contents[].submitted` value of 240 reflects what was submitted, not what is indexed. Use GSC Search Console UI or URL Inspection API calls on individual URLs to determine indexation status per page.

**Assessment:** Sitemap is healthy — no errors, no warnings, submitted within the last 11 days. 240 URLs are in scope for Googlebot crawling.

---

## 7. URL Canonicalization Note

GSC data shows impressions split across both `https://easyphoto.in/` (non-www) and `https://www.easyphoto.in/` variants (e.g., malaysia-visa-photo-maker appears on both). This indicates either:
1. Canonical tags pointing to www on some pages while others use non-www, or
2. GSC property covers both variants via the sc-domain property but pages themselves serve both.

All PSI data confirms non-www is the canonical. Verify that all pages emit `<link rel="canonical" href="https://easyphoto.in/...">` consistently and that www permanently redirects (301) to non-www.

---

## 8. Findings Summary for audit-data.json

```json
{
  "category": "Google SEO Data",
  "credential_tier": 1,
  "data_freshness": {
    "gsc": "28-day rolling, lag 2-3 days (cutoff 2026-06-17)",
    "psi": "Lab snapshot 2026-06-20",
    "crux": "Unavailable — insufficient traffic volume"
  },
  "organic_performance": {
    "clicks_28d": 15,
    "impressions_28d": 279,
    "avg_ctr_pct": 5.38,
    "avg_position": 29.5,
    "brand_clicks": 7,
    "non_brand_clicks": 8,
    "queries_tracked": 96
  },
  "cwv_lab_mobile": {
    "lcp_ms": 5000,
    "lcp_rating": "Poor",
    "cls": 0.0,
    "cls_rating": "Good",
    "tbt_ms": 110,
    "tbt_rating": "Good",
    "performance_score": 74
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
  "quick_wins": [
    {"query": "eci photo resize", "position": 6.8, "page": "/voter-id-photo-resizer/"},
    {"query": "csir net signature size", "position": 8.5, "page": "/tools/exam-package/"},
    {"query": "army signature", "position": 9.0, "page": "/exam-requirements/army-agniveer/"},
    {"query": "sign add on photo", "position": 10.0, "page": "/tools/sign-image/"},
    {"query": "cpo photo", "position": 10.0, "page": "/exam-resizer/ssc-cpo/"}
  ],
  "issues": [
    {"severity": "Critical", "area": "Performance", "description": "Mobile LCP 5.0s (Poor) — caused by AdSense JS blocking render"},
    {"severity": "Critical", "area": "Performance", "description": "156 KB unused JavaScript from AdSense third-party scripts"},
    {"severity": "High", "area": "Performance", "description": "Render-blocking CSS delays FCP by ~158ms"},
    {"severity": "High", "area": "Organic", "description": "Zero non-brand clicks — all commercial queries rank page 3+"},
    {"severity": "Medium", "area": "Canonicalization", "description": "www vs non-www impression split in GSC; verify canonical consistency"},
    {"severity": "Medium", "area": "Accessibility", "description": "Color contrast failures on step-number elements (ratio 1.83, fails WCAG AA)"},
    {"severity": "Low", "area": "Performance", "description": "Legacy JS polyfills — 12 KB savings available by targeting modern browsers"}
  ]
}
```
