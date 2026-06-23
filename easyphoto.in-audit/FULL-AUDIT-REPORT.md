# SEO Audit Report — easyphoto.in
**Date:** 2026-06-21 (delta from 2026-06-18 baseline)  
**Auditor:** Claude Sonnet 4.6 · PSI + GSC + URL Inspection + live crawl  
**Stack:** Next.js 15 static export · Cloudflare Pages · India-primary market  
**Scope:** Live site · 277-URL sitemap · GSC + CrUX + PSI (mobile + desktop)

---

## SEO Health Score: **81 / 100** ▲ +10 from baseline (71)

| Category | Weight | Score | Weighted | vs Jun 18 |
|---|---|---|---|---|
| Technical SEO | 22% | 82 | 18.0 | ▲ +8 |
| Content Quality | 23% | 75 | 17.3 | ▲ +7 |
| On-Page SEO | 20% | 83 | 16.6 | ▲ +21 |
| Schema / Structured Data | 10% | 88 | 8.8 | ▲ +10 |
| Performance (CWV) | 10% | 78 | 7.8 | ▲ +6 |
| AI Search Readiness | 10% | 92 | 9.2 | ▲ +7 |
| Images | 5% | 82 | 4.1 | ▲ +22 |
| **Total** | 100% | — | **81** | ▲ **+10** |

---

## Executive Summary

In the three days since the baseline audit (Jun 18), the team has resolved **7 of 10 previously critical/high issues**, lifted the Lighthouse SEO score from ~85 to **100/100 on both mobile and desktop**, added a comprehensive `llms.txt`, implemented the missing `SoftwareApplication` schema on the homepage, and fixed the www duplicate-content problem.

The site is technically sound. The remaining gap between 81 and 90+ is concentrated in three areas:
1. **Accessibility / color contrast** — gold text `#A87E10` fails WCAG AA at 11–13px (7 elements)
2. **Mobile LCP 3.5s** — Google AdSense scripts are the primary culprit (+229 KB, +107ms main thread on mobile)
3. **Early-stage authority** — 7 total organic clicks, not yet in Common Crawl, only 129 GSC queries indexed. This is a time/content problem, not a technical one.

---

## Issues Fixed Since Jun 18 ✅

| # | Was | Fix Confirmed |
|---|---|---|
| 1 | www.easyphoto.in duplicate content (no redirect) | `www` → 301 → `https://easyphoto.in/` ✅ |
| 2 | `/_next/` not disallowed in robots.txt | `Disallow: /_next/` present in robots.txt ✅ |
| 3 | Homepage cannibalizes `/passport-photo/` via title | Title now: "easyPhoto — Document Photo & Form-Resize Tools for India" ✅ |
| 4 | Homepage missing `SoftwareApplication` schema | 3 JSON-LD blocks: Organization+WebSite, SoftwareApplication, FAQPage ✅ |
| 5 | AI crawler allowance implicit | robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot ✅ |
| 6 | llms.txt absent | `https://easyphoto.in/llms.txt` live and comprehensive (200 OK) ✅ |
| 7 | Lighthouse SEO score < 100 | Lighthouse SEO: **100/100** (mobile + desktop) ✅ |

---

## Current Issues

### 🟠 HIGH

#### 1. Color Contrast Failures — 7 Elements (Accessibility + Ranking Signal)
- Gold brand color `#A87E10` on `#fcfbf8` (warm cream): contrast ratio **3.58** — minimum 4.5 for normal text
- Gold on white: ratio **3.71** — same fail
- Affected: "THE RESULT" eyebrow, "AUTO-FIT" label, country card size text (`51×51 mm`), stat strip spans — all at 11–13px
- Lighthouse accessibility: **96/100 mobile, 97/100 desktop** (held back by this)
- Fix: Darken small-text gold to `#7a5c06` (ratio ~5.1) or `#6e5005` (ratio ~5.8). The large gold heading uses `font-bold` so contrast impact is less — this only affects `text-[11px]`, `text-[13px]` non-bold occurrences.

#### 2. Meta Description 184 Characters — Truncated in SERPs
- Current: "Free tools for Indian passport photos, visa photos, exam form resizing and government document images. Pick your country or exam —" (184 chars)
- Google truncates at ~160 chars — users see an incomplete sentence
- Fix: Rewrite to ~155 chars ending on a complete call to action

#### 3. Mobile LCP 3.5s — Needs Improvement (Target < 2.5s)
- Google AdSense is the primary offender: 229 KB transferred, 107ms main thread on mobile
- Render-blocking CSS adds 470ms on mobile (Next.js `/_next/static/css/*.css`)
- Desktop LCP: **0.7s (excellent)** — mobile is the only bottleneck
- Fix options: (a) load AdSense after user interaction (lazy), (b) defer `adsbygoogle.js` using `loading="lazy"` on ad units, (c) inline critical CSS to remove render-blocking

#### 4. Desktop Total Blocking Time 300ms (Target < 200ms)
- 6 long tasks on desktop main thread; AdSense contributes 125ms, webpack 141ms
- Script evaluation: 722ms total
- Fix: Same AdSense deferral as above would help; also consider route-based code splitting for heavy pages

---

### 🟡 MEDIUM

#### 5. CSP Uses `unsafe-inline` + `unsafe-eval`
- Required for Next.js hydration and WASM (MediaPipe face detection)
- Lighthouse flags as XSS risk (High severity in `csp-xss` audit)
- Mitigation: Use `require-trusted-types-for 'script'` where innerHTML is not used; migrate `unsafe-eval` to `wasm-unsafe-eval` explicitly (already partly done — `wasm-unsafe-eval` is present in CSP)
- `unsafe-inline` cannot be removed without nonce-based CSP in Next.js config

#### 6. Canonical Trailing Slash Mismatch
- Declared in `<link rel="canonical">`: `https://easyphoto.in/` (with slash)
- Google's selected canonical: `https://easyphoto.in` (without slash)
- GSC inspection: `match: false`
- Not causing indexing failure but indicates inconsistency Google may surface
- Fix: Consistent trailing slash handling site-wide (already using in pages — likely a Next.js/Cloudflare Pages normalisation difference)

#### 7. Content Clusters Still Need Editorial Support
From the prior audit, these remain open:
- **Signature cluster**: 7+ signature tool pages, zero blog posts about signature preparation
- **PDF cluster**: 8 PDF tools, no editorial hub
- **"Keep reading"**: not cluster-aware — shows same posts across all articles

#### 8. GSC: Low Click-Through Despite Good Positions
- "eci photo resize": **pos 6.5, 6 impressions, 0 clicks** → /voter-id-photo-resizer/
- "cpo photo": **pos 6.5, 2 impressions, 0 clicks** → /exam-resizer/ssc-cpo/
- "army signature": **pos 9, 2 impressions, 0 clicks** → /exam-requirements/army-agniveer/
- 0 CTR at pos 6–9 suggests title/meta aren't matching searcher intent on these pages
- Fix: Rewrite title tags for these pages to match exact query intent ("CPO Photo Size Requirements", "Army Agniveer Signature Format")

#### 9. No CrUX Field Data
- Google CrUX: "No data — insufficient Chrome traffic volume"
- No field-measured LCP/INP/CLS — Lighthouse lab estimates only
- Not fixable; resolves as traffic grows past ~1,000 users/28 days

---

### 🟢 LOW

#### 10. IndexNow Not Implemented
- Bing, Yandex, Naver receive no notification on deploy
- Add a Cloudflare Pages deploy hook → IndexNow ping

#### 11. No Image Sitemap Extensions
- Flag images and tool sample images have no `<image:image>` tags in sitemap
- Missed Google Images for a visual-output tool site

#### 12. `sameAs` Has Only Pinterest
- `organizationSchema()` → `sameAs: ["https://www.pinterest.com/easyphoto0604/"]`
- Add YouTube, LinkedIn, X when accounts are created

#### 13. `llms-full.txt` Not Present
- `llms.txt` is comprehensive at ~60 lines
- A `llms-full.txt` with complete spec tables would boost AI citation frequency

---

## Performance Deep-Dive (PSI — Lab Data, 2026-06-21)

| Metric | Mobile | Desktop |
|---|---|---|
| Performance Score | **90** | **87** |
| LCP | 3.5s ⚠️ | 0.7s ✅ |
| TBT | 30ms ✅ | 300ms ⚠️ |
| CLS | 0 ✅ | 0 ✅ |
| FCP | 1.6s ✅ | 0.6s ✅ |
| Speed Index | 2.6s ✅ | 1.2s ✅ |
| TTFB | 8ms ✅ | 7ms ✅ |

**Third-party budget:**
| Entity | Size | Main Thread |
|---|---|---|
| Google AdSense | 229 KB | 107ms (mobile) / 210ms (desktop) |
| Cloudflare Analytics | 23 KB | 18ms |
| ad traffic quality | 22 KB | 10ms |

**Recommendation priority:** AdSense deferral would drop mobile LCP below 2.5s and bring desktop TBT under 200ms simultaneously — highest ROI single change available.

---

## GSC Data (Last 28 Days)

- **Total clicks**: 7 (all branded "easyphoto", pos 1.9)
- **Total impressions**: ~200 across 129 queries
- **Quick wins** (pos 4–20, 2+ impressions):
  - `/voter-id-photo-resizer/` — "eci photo resize" pos 6.5 (6 impressions)
  - `/exam-resizer/ssc-cpo/` — "cpo photo" pos 6.5 (2 impressions)
  - `/exam-requirements/army-agniveer/` — "army photo" pos 3, "army signature" pos 9
  - `/tools/exam-package/` — "csir net signature size" pos 8.5

- **Note**: These quick wins all have 0 clicks. The title/meta copy on these pages isn't compelling searchers to click. Rewriting titles to match search intent is the fastest path to first real organic clicks.

---

## Schema Status (Homepage)

| Type | Present | Notes |
|---|---|---|
| Organization + WebSite | ✅ | In @graph block |
| SoftwareApplication | ✅ | Fixed since Jun 18 |
| FAQPage | ✅ | Homepage FAQ section |
| BreadcrumbList | ✅ | On all tool + blog pages |
| BlogPosting | ✅ | All 26+ blog posts |
| SearchAction | ❌ | Missing Sitelinks Searchbox |
| ImageObject | ❌ | No image schema |

---

## AI Search Readiness — 92/100 (Excellent)

| Signal | Status |
|---|---|
| `llms.txt` present + comprehensive | ✅ Excellent |
| All AI crawlers allowed in robots.txt | ✅ |
| Answer-first blog post formatting | ✅ |
| Official source citations in specs | ✅ |
| `inLanguage: en-IN` on all blog posts | ✅ |
| `Organization` with `knowsAbout` array | ✅ |
| `sameAs` depth | ⚠️ Only Pinterest |
| `llms-full.txt` | ❌ Missing |

---

## Indexation (GSC URL Inspection)

| Page | Status | Last Crawl |
|---|---|---|
| `https://easyphoto.in/` | ✅ Submitted & indexed | 2026-06-20 (yesterday) |
| Referring URLs | Blog internal + Pinterest | www.pinterest.com/easyphoto0604/ |
| Google canonical | `https://easyphoto.in` (no slash) | Minor mismatch vs declared |

---

## Action Plan

### Phase 1 — This Week (Quick Wins)

1. **Fix color contrast** — darken `#A87E10` → `#7a5c06` for text sizes ≤ 13px (CSS custom property change, affects eyebrow + stat text)
2. **Trim meta description** to ≤ 160 chars on homepage
3. **Rewrite title tags** for 4 quick-win pages (eci/cpo/army/csir) to exactly match the GSC query
4. **Defer AdSense loading** — add `data-lazy` or load after DOMContentLoaded to drop mobile LCP below 2.5s

### Phase 2 — This Month (Content Authority)

5. **Write "How to prepare signature for exam forms"** — pillar for signature cluster (7 tools have no editorial hub)
6. **Write PDF document tools hub** — `/blog/how-to-prepare-documents-for-exam-applications/`
7. **Add 1 process screenshot** to each blog post (before/after of tool, or sample output image)
8. **Make "Keep reading" cluster-aware** — group by topic tag

### Phase 3 — Ongoing

9. **IndexNow ping on deploy** — Cloudflare Pages hook → Bing IndexNow API
10. **Add `SearchAction` to WebSite schema** for Sitelinks Searchbox
11. **Add image sitemap extensions** for flag images + tool outputs
12. **Expand `sameAs`** when additional social profiles are created

---

*CrUX field data unavailable — site below Chrome traffic threshold. Backlinks: not yet in Common Crawl. Both will unlock as traffic grows.*
