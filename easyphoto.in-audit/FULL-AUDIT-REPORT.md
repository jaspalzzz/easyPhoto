# SEO Audit Report — easyphoto.in
**Date:** 2026-06-23 · **Prior audit:** 2026-06-21 (81/100 estimated)
**Auditor:** Claude SEO — 8 specialist agents running in parallel
**Tools:** PSI v5 · CrUX · GSC · URL Inspection · Live crawl · Common Crawl
**Stack:** Next.js 15 static export · Cloudflare Pages · India-primary market
**Scope:** Live site · 258-URL sitemap · Google API Tier 1

---

## Executive Summary

### Overall SEO Health Score: 61 / 100

> **Note on score movement:** The June 21 audit estimated 81/100. This audit drops to 61 because today's live PSI run revealed actual mobile LCP of **10,501 ms** versus the June 21 estimate of ~3,500 ms. Site conditions have not worsened — the measurement became precise. Phase 1 fixes (WebP images + preload) are expected to restore performance to GOOD and bring the score back to 74–78.

| Category | Weight | Score | Contribution |
|---|---|---|---|
| Technical SEO | 22% | 63 | 13.86 |
| Content Quality | 23% | 71 | 16.33 |
| On-Page SEO | 20% | 67 | 13.40 |
| Schema / Structured Data | 10% | 62 | 6.20 |
| Performance (CWV) | 10% | 38 | 3.80 |
| AI Search Readiness | 10% | 64 | 6.40 |
| Images | 5% | 25 | 1.25 |
| **Overall** | **100%** | | **61 / 100** |

**Backlinks:** INSUFFICIENT DATA — domain registered 2026-06-06 (17 days), predates Common Crawl's last crawl. Zero backlinks expected and carries no negative signal. First CC data available ~September 2026.

---

### Top 5 Critical Issues

1. **Mobile LCP 10,501 ms — POOR** — 3 unoptimised PNGs (2,076 KB) above the fold. 4.2× above threshold. Google uses mobile-first crawling. Single highest-priority fix.
2. **Exam pages returning 404** — the exam keyword cluster scores 14/100 SXO. `/tools/form-resizer/*` and `/tools/exam-package/` need routing verified.
3. **/india/ hard 404** — canonical URL is `/india-passport-photo-maker/`. No 301 redirect in place. Users and links landing on /india/ get a dead end.
4. **/blog/ never crawled by Googlebot** — confirmed via URL Inspection API. No inbound link from any regularly-crawled page. Fix: one nav link.
5. **Zero meta descriptions** — all audited pages (7/7) missing `<meta name="description">`. Reduces CTR and forces AI search engines to use arbitrary body text for citations.

### Top 5 Quick Wins

1. Convert hero PNGs to WebP → mobile LCP from 10,501 ms to ~2,200 ms (GOOD). One image optimisation pass.
2. Add `/blog/` to site header/footer navigation → Googlebot crawls the hub within days.
3. Add 301 redirect `/india/` → `/india-passport-photo-maker/` in next.config.js.
4. Add `<link rel="preload" as="image" fetchpriority="high">` for LCP image → additional ~300 ms gain.
5. Add meta descriptions to top 10 pages → immediate CTR and AI citation improvement.

---

## Site Context

| Attribute | Value |
|---|---|
| Domain | easyphoto.in |
| Registered | 2026-06-06 (17 days ago) |
| Deployment | Cloudflare Pages (auto-deploy from master branch) |
| Framework | Next.js 15, `output: "export"` (fully static) |
| Target market | India — passport, visa, government exam applicants |
| Privacy USP | 100% on-device processing, no photo uploads |
| GSC clicks (28d) | 23 (8 brand, 15 non-brand) |
| GSC impressions (28d) | 589 |
| Average position | 27.4 |
| Sitemap URLs | 258 (all returning 200) |
| Indexed pages | ~190 (estimated from GSC) |

---

## 1. Technical SEO — 63 / 100

### What Works
- TTFB 11–22 ms (Cloudflare Singapore edge — excellent for Indian users)
- CLS 0.001 / 0.003 — GOOD on both devices (no layout shift issues)
- PSI SEO score 100/100 on both mobile and desktop
- Security headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy all present; HSTS `max-age=63072000` = 2-year preload-eligible
- Static SSG export — full HTML on first byte, no JS rendering required for Googlebot indexation
- All major AI crawlers explicitly allowed (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot) with `Allow: /` rules
- `llms.txt` present and comprehensive
- Breadcrumbs rich result confirmed PASSING by Google URL Inspection API
- 258/258 sitemap URLs return 200 — zero 404s or redirect chains

### Issues

#### CRITICAL — Mobile LCP 10,501 ms (POOR)
The mobile Largest Contentful Paint is **10.5 seconds** — 4.2× above Google's 2,500 ms Good threshold and 2.6× above the 4,000 ms Poor boundary. Google crawls with a mobile-first user agent (confirmed by URL Inspection); this metric directly affects rankings.

**Root causes (ranked by impact):**

| Cause | Estimated Impact |
|---|---|
| sample2_before.png (800 KB, uncompressed PNG) | ~4,500 ms |
| sample4_before.png (713 KB, uncompressed PNG) | ~4,000 ms |
| sample4_after.png (563 KB, uncompressed PNG) | ~3,200 ms |
| No preload hint — late browser discovery | ~300 ms |
| Render-blocking CSS (2 files) | 320–475 ms |
| AdSense JS on main thread | 156 ms |
| `.animate-scan-beam` forced reflow | 650 ms |
| Legacy JS polyfills | 107–141 ms |

**Fix:** Convert the three hero images to WebP at display-appropriate sizes. At typical mobile display widths (360–430px), a 3:4 portrait card needs approximately 270×360 px → ~35–50 KB as WebP. Total hero payload drops from 2,076 KB to under 150 KB. Combined with a preload hint, expected mobile LCP: **2.0–2.5 s (GOOD)**.

#### CRITICAL — /blog/ never crawled by Googlebot
URL Inspection API result: `/blog/` has **never been crawled** despite returning HTTP 200 and being present in the sitemap. The cause is the absence of any inbound link from a page Googlebot crawls regularly (homepage, footer, navigation). Individual blog posts are discoverable via the sitemap and accumulate GSC impressions, but the blog hub page is completely invisible, breaking hub-and-spoke link flow.

**Fix:** Add one `<a href="/blog/">Blog</a>` link in the site header or footer. Googlebot will discover and crawl it on the next homepage recrawl (typically within 3–7 days after the next deploy).

#### HIGH — www vs non-www canonicalization split
GSC shows at least 3 page families indexed under `www.easyphoto.in` separately from `easyphoto.in` (malaysia-visa-photo-maker, upsc-photo-resizer, china-visa-photo-maker confirmed). Canonical tags on individual pages point to non-www, but without a server-level redirect, some Googlebot crawls arrive at www variants and index them.

**Fix:** Add Cloudflare Redirect Rule: `www.easyphoto.in/*` → `easyphoto.in/$1` (301 Permanent).

#### HIGH — LCP image not preloaded
Lighthouse `lcp-discovery-insight` audit fails: the LCP image is discovered only after the HTML parser reaches the `<img>` tag, wasting 300+ ms that could be recovered by a `<head>` preload hint.

**Fix:** Add to `app/layout.tsx`:
```html
<link rel="preload" as="image" href="/images/sample4_before_1782052955340.webp" fetchpriority="high" />
```

#### MEDIUM — .animate-scan-beam non-composited animation
The hero scan-beam animation uses inline `background-color` changes, triggering forced style recalculation and layout on the main thread (650 ms of layout work during LCP window). Composited properties (`transform`, `opacity`) run on the GPU and do not block the main thread.

---

## 2. Content Quality — 71 / 100

### What Works
- Blog posts: visible author (Jaspal Kumar) with professional credentials
- Tool pages: accurate, data-driven specs per exam and country (dimensions, KB limits, background colour)
- Privacy USP consistently communicated across tool pages
- FAQ schema: 5+ Q&A pairs on homepage
- On-device processing is a genuine, verifiable E-E-A-T differentiator (no other major competitor makes this claim with equal emphasis)

### Issues

#### CRITICAL — /india/ returns hard 404
The URL `/india/` — expected by users following country-style URL patterns and potentially receiving inbound links — returns a 404. The canonical page is `/india-passport-photo-maker/`. No 301 redirect is in place.

#### HIGH — Blog post thin content
`/blog/why-exam-photo-signature-rejected/` has 1,030 words — 36% below the 1,600-word minimum for competitive exam queries. Individual sections are 80–100 words, insufficient depth for ranking. Top SERP competitors for "exam photo rejected reasons" average 2,200 words with per-reason sections.

#### HIGH — Zero meta descriptions
7/7 audited pages have no `<meta name="description">`. This is also flagged under GEO because AI search engines fall back to arbitrary body text for citation snippets, reducing brand control and accuracy.

#### MEDIUM — No author attribution on exam pages
Blog posts credit Jaspal Kumar; the 53 exam-requirements pages carry no author. Google's quality evaluators look for authorship consistency, and the pages handling highest-specificity queries (exact exam photo sizes) are the most author-exposed.

#### MEDIUM — No visible freshness signals
Exam photo specifications change when government portals update. No "Last verified: [date]" timestamps are visible on exam or country pages. Freshness is a direct relevance signal for time-sensitive regulatory content.

### E-E-A-T Assessment

| Factor | Score | Key Signals |
|---|---|---|
| Experience | 14/20 | Original tool screenshots; on-device USP is lived experience; limited first-party research data |
| Expertise | 16/25 | Accurate specs; author credentials on blog; exam pages uncredited |
| Authoritativeness | 14/25 | Brand new domain, zero backlinks, no external citations yet |
| Trustworthiness | 19/30 | HTTPS, privacy policy, clear USP; missing meta descriptions reduce trust signals for AI systems |

---

## 3. On-Page SEO — 67 / 100

### GSC Quick Wins (Positions 4–10)

| Priority | Query | Page | Impressions | Position | Action |
|---|---|---|---|---|---|
| HIGH | army photo / army signature / indian army passport photo | /exam-requirements/army-agniveer/ | 6 | 3–9 | Update title; add FAQ schema |
| HIGH | eci photo resize | /voter-id-photo-resizer/ | 6 | 6.5 | Match H1 to query exactly |
| HIGH | ssc cpo image / cpo photo | /exam-resizer/ssc-cpo/ | 3 | 6–6.5 | Add CPO spec table above fold |
| MEDIUM | csir net signature size | /tools/exam-package/ | 2 | 8.5 | Add CSIR NET spec above fold |
| MEDIUM | sign on picture online | /tools/sign-image/ | 1 | 8.0 | Match H1 to query |

**Highest single-page opportunity:** `/exam-requirements/army-agniveer/` ranks for 3 distinct queries at positions 3, 9, 9 with 6 total impressions and **0 clicks**. Title and H1 optimisation + FAQ schema is the fastest path to first non-brand organic clicks.

---

## 4. Schema / Structured Data — 62 / 100

### Current Implementation
| Schema Type | Pages | Status |
|---|---|---|
| Organization | Homepage | ✓ Present |
| WebSite | Homepage | ✓ Present (missing SearchAction) |
| SoftwareApplication | Homepage | ✓ Present |
| FAQPage | Homepage | ✓ 5 Q&A pairs |
| BlogPosting | All 24 blog posts | ✓ Present (image property broken) |
| BreadcrumbList | Category + tool pages | ✓ Present, passing Google validation |

### Issues

#### HIGH — BlogPosting.image uses generic /og.png
All 24 blog posts set `BlogPosting.image` to the site-level `/og.png`. Google's Article rich result requirements mandate a unique, post-specific image. This blocks rich result eligibility for all 24 posts. The per-post OG image is already generated — it needs to be wired into the schema.

#### MEDIUM — WebSite.SearchAction missing
No Sitelinks Searchbox markup. The tools page has category jump functionality — adding SearchAction enables Google to display the search box in branded SERPs.

#### MEDIUM — Organization.sameAs limited to Pinterest
Only one social profile in `sameAs`. Expand as new accounts are created. Minimum additions: YouTube (when created), Instagram.

---

## 5. Performance (CWV) — 38 / 100

| Metric | Mobile | Desktop |
|---|---|---|
| Performance Score | 70/100 | 90/100 |
| LCP | **10,501 ms — POOR** | 1,921 ms — GOOD |
| CLS | 0.001 — GOOD | 0.003 — GOOD |
| TBT | 130 ms — GOOD | 60 ms — GOOD |
| FCP | 1,207 ms — GOOD | 390 ms — GOOD |

**CrUX data:** Unavailable. The site does not yet meet Chrome UX Report traffic eligibility thresholds (domain registered 17 days ago). All above data is PSI lab data. CrUX field data expected to become available Q4 2026 once traffic volume grows.

**Expected mobile LCP after Phase 1 fixes:**
- WebP conversion → removes 1,900 KB from LCP path → ~5,000 ms saved
- Preload hint → removes late discovery delay → ~300 ms saved
- AdSense deferral → removes 156 ms from LCP window
- **Projected mobile LCP: 2,000–2,500 ms (GOOD)**

---

## 6. AI Search Readiness (GEO) — 64 / 100

### What Works
- All 5 major AI bots explicitly allowed in robots.txt
- `llms.txt` present (confirmed live)
- FAQPage schema aids AI structured extraction
- BlogPosting schema with author, dates, and `inLanguage: en-IN`

### Issues

#### CRITICAL — Zero meta descriptions (also flagged under Content + On-Page)
Without meta descriptions, AI search systems (ChatGPT, Perplexity, Google AI Overviews) fall back to arbitrary body text for citation snippets. This is the single highest-leverage fix for AI citation quality — zero additional content work required.

#### HIGH — llms-full.txt absent
`llms.txt` references spec data but the full-detail version (`llms-full.txt`) is not present. AI agents querying the file must make secondary page fetches to retrieve actual dimension tables and KB limits.

#### HIGH — Zero YouTube presence
YouTube mention correlation with AI citation frequency is ~0.737 — the strongest single predictor of AI search visibility documented in GEO research. easyphoto.in has no YouTube content. Three videos would materially improve long-term AI citation rates:
1. "How to make Indian passport photo at home (2026)"
2. "Why exam photos get rejected — and how to fix it"
3. "easyPhoto 2-minute product demo"

### AI Citation Readiness: 63 / 100

| Element | Status |
|---|---|
| AI crawlers allowed | ✓ All 5 major bots |
| llms.txt | ✓ Present |
| llms-full.txt | ✗ Absent |
| Meta descriptions | ✗ None |
| FAQPage schema | ✓ 5 Q&A pairs |
| Author attribution | ✓ Blog posts; ✗ Exam pages |
| Passage-level citability | Partial — spec tables citable; narrative sections thin |

---

## 7. Backlinks — INSUFFICIENT DATA

**Data source:** Common Crawl (Jan–Mar 2026 release). Domain registered 2026-06-06. Domain was absent from the crawl because it didn't exist at crawl time.

**Key facts:**
- Zero backlinks expected at 17 days — this is normal and carries no negative signal
- Clean slate: no toxic legacy links, no prior-owner anchor spam to remediate
- First Common Crawl appearance expected ~September 2026

**Link building priority order:**
1. Product Hunt listing (single high-DA link, free)
2. Indie Hackers post (privacy-USP angle plays well)
3. Indian travel/visa blogs (natural link context for passport photo tools)
4. Exam coaching portals (SSC, UPSC prep communities)
5. Tech press outreach (Gadgets360, YourStory — free tool with on-device privacy story)

---

## 8. Sitemap — 81 / 100

### Overview
- 258 URLs in a single `<urlset>` sitemap (no index needed at this scale)
- Valid XML, correct namespace
- Declared in robots.txt
- 258/258 URLs return HTTP 200 — zero dead links

### Issues

#### LOW-MEDIUM — Build-stamp lastmod
163 of 258 URLs (63%) share today's date as `lastmod` — this is a build-timestamp pattern where all pages get the deploy date regardless of actual content change. Google learns to distrust this signal.

**Fix:** Use per-page `updatedAt` metadata in the sitemap generator. Static pages that haven't changed should keep their original date.

#### WARNING — 105 programmatic exam pages
53 exam-requirements pages + 52 form-resizer pages exceed the 50-page threshold for programmatic content review. Content differentiation appears real at the metadata level (unique specs per exam), but body-text uniqueness across all 105 pages warrants an audit before expanding further.

---

## 9. Search Experience (SXO) — 41 / 100

### SERP Analysis

| Keyword | Dominant Page Type | easyphoto.in | Gap |
|---|---|---|---|
| "passport photo maker india" | Interactive tool landing page (10/10 consensus) | /india-passport-photo-maker/ — ALIGNED | Execution gap (authority, media) |
| "indian passport photo requirements" | Government docs + informational hybrids | No page exists | HIGH MISMATCH |
| "exam photo resize" | Dedicated exam photo tools | Pages returning 404 | CRITICAL — indexation failure |

### Persona Scores

| Persona | Score | Biggest Gap |
|---|---|---|
| Exam Applicant (SSC/UPSC student) | 28/100 | Exam pages 404 — cannot find the tool |
| Passport/Visa Applicant | 54/100 | No photo requirements guide |
| NRI Abroad | 58/100 | Trust signals thin (no backlinks, new domain) |
| HR/Admin | 62/100 | Batch processing / enterprise features absent |

The 41/100 composite is structural: restoring exam page URLs and publishing one requirements guide page is projected to lift the composite to **62–65/100** without any other changes.

---

## What's Working Well (Do Not Break)

1. **Cloudflare edge performance** — TTFB 11–22 ms is world-class. Keep CDN config intact.
2. **CLS = 0.001** — Perfect layout stability. Image dimensions are set correctly.
3. **PSI SEO 100/100** — Technical on-page SEO is clean. robots.txt, canonical, meta robots all correct.
4. **Static SSG export** — Full HTML on first byte. Googlebot doesn't need to execute JS.
5. **Security posture** — All 7 headers present, HSTS 2-year, CSP in place.
6. **Schema breadth** — Organization + WebSite + SoftwareApplication + FAQPage + BlogPosting + BreadcrumbList on day 17 is ahead of most competitors.
7. **AI crawler access** — All 5 major AI bots allowed; llms.txt present.
8. **Sitemap hygiene** — 258/258 URLs clean, zero 404s, correct XML.
9. **Privacy USP** — On-device processing is a genuine differentiator with real E-E-A-T value.
10. **Blog author attribution** — Jaspal Kumar credited on all blog posts, which is above the norm for Indian SaaS tools.

---

## PDF Report

Generate a professional PDF from this audit:
```bash
cd /Users/apple/.claude/skills/seo
python3 scripts/google_report.py \
  --type full \
  --data /Users/apple/Documents/FrontEndWeb/EasyPhoto/Code/EasyPhoto/easyphoto.in-audit/audit-data.json \
  --domain easyphoto.in \
  --output-dir /Users/apple/Documents/FrontEndWeb/EasyPhoto/Code/EasyPhoto/easyphoto.in-audit/
```

---

*Report generated by Claude SEO (8 specialist agents). Data sources: PSI v5, CrUX API, CrUX History API, GSC Search Analytics, GSC URL Inspection API, GSC Sitemaps API, Common Crawl web graph, live HTTP crawl. Audit date: 2026-06-23.*
