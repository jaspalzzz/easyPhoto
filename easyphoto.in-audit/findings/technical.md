# Technical SEO Audit — easyphoto.in

**Date:** 2026-06-23
**Stack:** Next.js 15 static export, Cloudflare Pages
**Market:** India-primary, global tool pages
**Score: 63 / 100**

> This report supersedes the 2026-06-18 baseline (score: 74/100). Several issues flagged in the baseline have been confirmed fixed; the score adjusts downward because the updated PSI run (2026-06-23) exposed a far more severe mobile LCP than the earlier measurement (10,501 ms vs the 3,500 ms estimated on June 18), the /blog/ and /india/ indexation failures were confirmed by the URL Inspection API, and the www/non-www split is now confirmed by live GSC impression data rather than inferred from headers alone.

---

## Score Breakdown

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Crawlability (robots.txt, sitemap, noindex) | 15% | 85/100 | 12.8 |
| Indexability (canonicals, duplicate content, GSC coverage) | 20% | 55/100 | 11.0 |
| Security (HTTPS, headers) | 10% | 90/100 | 9.0 |
| URL Structure (clean URLs, redirects, www) | 10% | 65/100 | 6.5 |
| Mobile-Friendliness (viewport, touch targets, rendering) | 10% | 88/100 | 8.8 |
| Core Web Vitals — LCP (10,501 ms mobile — POOR) | 20% | 10/100 | 2.0 |
| Core Web Vitals — CLS / INP (both GOOD) | 5% | 95/100 | 4.75 |
| Structured Data | 5% | 65/100 | 3.25 |
| JavaScript Rendering | 5% | 98/100 | 4.9 |
| **Total** | **100%** | | **63.0** |

---

## 1. Crawlability

**Status: PASS**

### robots.txt

- `robots.txt` is present and valid at `https://easyphoto.in/robots.txt`.
- Sitemap is declared: `Sitemap: https://easyphoto.in/sitemap.xml`
- `Disallow: /_next/` is present — correctly prevents Googlebot from consuming crawl budget on Next.js build artefacts (confirmed FIXED since June 18 baseline; previously flagged as missing).
- All AI crawlers are explicitly allowed: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Anthropic-AI`, `Google-Extended`, `Bingbot`, `PerplexityBot`. Full open-web policy; no selective gating.
- Global `Allow: /` for all user-agents. No `Disallow` directives other than `/_next/`.
- No `Crawl-delay` directive — not required for Googlebot but worth noting for Bingbot/Yandex on shared Cloudflare infrastructure.
- `llms.txt` confirmed present and serving 200 OK — comprehensive AI access layer.

### XML Sitemap

- Present at `https://easyphoto.in/sitemap.xml`, valid XML, correct `http://www.sitemaps.org/schemas/sitemap/0.9` namespace.
- **258 URLs** across all site sections (up from 248 in the June 18 baseline).
- 258/258 URLs return HTTP 200. Zero 404s, zero redirects, zero errors.
- No `<changefreq>` or `<priority>` tags — correct modern practice; Google ignores both.
- No `<image:image>` extensions — missed Google Images discovery opportunity for a visual tool site.
- All URLs: HTTPS, no-www, trailing slash, lowercase — fully consistent.
- GSC Sitemaps report: 0 errors, 0 warnings (verified 2026-06-23).

**Issues:**

- MEDIUM: **163 of 258 URLs carry a build-stamp `lastmod`** — the majority of top-level and hub pages share `2026-06-23` regardless of whether content changed today. Googlebot learns to distrust `lastmod` when batch-stamped dates appear site-wide, reducing crawl priority signal accuracy. Blog posts and `exam-requirements/*` pages already use per-page dates — apply the same pattern (git commit date or CMS `updatedAt` field) to all remaining page types.
- LOW: No `<image:image>` extensions in sitemap. Country flag images, passport photo samples, and tool output examples are not discoverable via Google Images without image sitemap extensions.

### No-Index Status

No `<meta name="robots" content="noindex">` or `X-Robots-Tag: noindex` found on any sampled page, including legal pages (`/privacy/`, `/terms/`, `/disclaimer/`). All pages sampled are indexable. This is appropriate given the ongoing AdSense review where indexed legal pages signal site legitimacy.

---

## 2. Indexability

**Status: FAIL — two confirmed gaps**

### Canonical Tags

Self-referencing canonical tags are present and consistent on all sampled pages:

| Page | Declared Canonical |
|---|---|
| `/` | `https://easyphoto.in/` |
| `/passport-photo/` | `https://easyphoto.in/passport-photo/` |
| `/tools/signature-cleaner/` | `https://easyphoto.in/tools/signature-cleaner/` |
| `/blog/` | `https://easyphoto.in/blog/` |
| `/blog/indian-passport-photo-size-rules/` | `https://easyphoto.in/blog/indian-passport-photo-size-rules/` |

Google's URL Inspection API confirmed that the homepage canonical match is **true** — Google's chosen canonical (`https://easyphoto.in/`) agrees with the declared canonical. This confirms the www → non-www redirect issue is partially resolved but not complete (see section 4).

### GSC Indexation — Critical Gaps

URL Inspection API (verified 2026-06-23):

| Page | Verdict | Last Crawled | Notes |
|---|---|---|---|
| `https://easyphoto.in/` | PASS — Submitted and indexed | 2026-06-22 09:48 UTC | Breadcrumbs rich result passing |
| `https://easyphoto.in/passport-photo/` | PASS — Submitted and indexed | 2026-06-20 04:09 UTC | Breadcrumbs rich result passing |
| `https://easyphoto.in/india/` | FAIL — URL unknown to Google | Never | True 404 — page does not exist |
| `https://easyphoto.in/blog/` | FAIL — URL unknown to Google | Never | Page exists (200 OK in sitemap check) but never crawled by Googlebot |

**Critical finding — /blog/ never crawled:** The `/blog/` index page exists (returns 200, is in the sitemap), yet Google has never crawled it. Individual blog posts are appearing in GSC impressions (confirming Googlebot is reaching them via sitemaps), but the blog index itself — the page that cross-links all posts and enables hub-and-spoke authority consolidation — has never been crawled. This means Googlebot cannot discover new posts by crawling the blog hub. The root cause is almost certainly that `/blog/` has no inbound links from any page Googlebot regularly crawls (i.e., the main navigation does not include a "Blog" link). This must be fixed immediately.

**Note on /india/:** This is a true 404 — no page at that URL. The GSC finding of "URL unknown" is expected and is not a crawlability failure. Country-specific content is correctly served at `/india-passport-photo-maker/` which is in the sitemap and indexed.

### www vs Non-www Canonicalization

Live GSC data confirms the problem is active — Google is indexing `www.easyphoto.in` variants separately for at least three page families:

| Page | Non-www impressions | www impressions |
|---|---|---|
| `/malaysia-visa-photo-maker/` | 1 (pos 40) | 3 (pos 57.7) |
| `/upsc-photo-resizer/` | 0 | 7 (pos 48.3) |
| `/china-visa-photo-maker/` | 0 | 1 (pos 78) |

This splits link equity across both variants. The canonical tag prevents full duplicate content indexation but does not prevent Googlebot from crawling both or from splitting ranking signals. A server-level 301 redirect (Cloudflare Redirect Rule) from `www.easyphoto.in/*` to `https://easyphoto.in/*` is required to resolve this permanently.

### Programmatic Page Quality Gate

The sitemap contains 53 `/exam-requirements/[exam]/` pages and 52 `/tools/form-resizer/[exam]/` pages — 105 programmatically generated exam pages total. This exceeds the thin-content risk threshold for templated pages. Each page uses exam-specific metadata (photo dimensions, file size limits, pixel dimensions, format rules) which provides genuine differentiation at the metadata level. Full body-text uniqueness across all 105 pairs has not been verified — this is a deferred risk item for a dedicated content audit. If prose sections are templated with only the exam name swapped, AdSense re-review and organic ranking will both be impacted.

---

## 3. Security Headers

**Status: PASS (excellent)**

Response headers confirmed present (Cloudflare Pages `_headers` file):

| Header | Value | Rating |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Excellent — 2-year HSTS, preload-eligible |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ...` | Strong baseline, CSP weaknesses noted below |
| `X-Content-Type-Options` | `nosniff` | Pass |
| `Referrer-Policy` | `no-referrer` | Pass |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Pass |
| `Cross-Origin-Embedder-Policy` | `credentialless` | Pass |
| `Cross-Origin-Opener-Policy` | `same-origin` | Pass |

No `X-Frame-Options` header is needed — the equivalent `frame-ancestors 'none'` in CSP is the modern replacement and is present.

**Issues:**

- LOW: CSP `script-src` includes `'unsafe-inline'` and `'unsafe-eval'`. These are required by Next.js 15 hydration and by WASM (MediaPipe) execution. `wasm-unsafe-eval` is already separately declared. The presence of `unsafe-inline` means inline script injection is not blocked by the CSP — any XSS vector that injects a `<script>` tag or event handler executes unchallenged. Migration to nonce-based CSP is possible in Next.js App Router but requires server-side nonce generation (incompatible with static export). Note: no ranking impact; flagged for security hygiene only.
- LOW: Lighthouse Best Practices flags the `unsafe-inline` + `unsafe-eval` combination as High severity (score deduct contributing to 96/100 Best Practices rather than 100/100). No Trusted Types directive is present.
- LOW: Chrome DevTools Issues panel logs a "Blocked by cross-origin policy" error on all pages. Most likely caused by the Google Ads iframe conflicting with the `Cross-Origin-Embedder-Policy: credentialless` header. Identify the blocked resource and add appropriate `crossorigin` attribute or CORS header on the Cloudflare `_headers` file.

---

## 4. URL Structure and Redirect Chains

**Status: PARTIAL PASS**

### URL Format

- All URLs lowercase: PASS
- All URLs use trailing slashes (matches `trailingSlash: true` in Next.js config): PASS
- URL slugs are descriptive and keyword-bearing: `/india-passport-photo-maker/`, `/ssc-photo-resizer/`, `/photo-resize-to-50kb/` — PASS
- Hindi-transliterated URLs (`/photo-resize-kaise-kare/`, `/photo-ka-size-20kb-kaise-kare/`) use ASCII-safe slugs — correct, no encoding issues: PASS

### Redirect Chains

| Chain | Status |
|---|---|
| `http://easyphoto.in/` → `https://easyphoto.in/` | 301 — PASS |
| `https://www.easyphoto.in/` → `https://easyphoto.in/` | NOT IMPLEMENTED — www returns HTTP 200 with full page content |

The www problem is confirmed as partially unresolved. The homepage canonical is matched (Google chose non-www), but at least three other page families have `www.*` variants indexed in GSC with real impressions. The canonical tag alone is insufficient — it prevents Google from fully indexing www as a separate origin but does not prevent crawl budget consumption or link equity dilution.

**Implementation:** Add a Cloudflare Redirect Rule (Dashboard > Rules > Redirect Rules):
- Expression: `http.host eq "www.easyphoto.in"`
- Action: Dynamic redirect to `concat("https://easyphoto.in", http.request.uri.path)`, Status 301, Preserve query string

### Parallel URL Hierarchies (Cannibalisation Risk)

The same exam (e.g., SSC) has entries at four different URL trees:
- `/ssc-photo-resizer/` — standalone tool landing page
- `/exam-requirements/ssc/` — specification page
- `/tools/form-resizer/ssc/` — tool hub sub-page
- `/exam-resizer/ssc-cgl/` — variant-specific resizer

This creates internal cannibalisation risk for exam photo queries. GSC data shows queries like "cpo photo" and "ssc cpo image" both landing on `/exam-resizer/ssc-cpo/` at position 6–7. The multi-URL structure must be managed with strong cross-linking between the tiers so PageRank consolidates onto the strongest ranking URL per intent.

---

## 5. Mobile-Friendliness

**Status: PASS**

- Viewport meta tag present on all sampled pages: `content="width=device-width, initial-scale=1"` — no `user-scalable=no` that would break accessibility or pinch-zoom: PASS
- Tailwind CSS responsive utility classes throughout (`sm:`, `md:`, `lg:` breakpoints): PASS
- No fixed-width layouts observed that would force horizontal scroll: PASS
- All JS scripts carry `async` attribute — no render-blocking scripts on mobile: PASS
- `polyfills.js` uses `noModule` attribute — only loads in browsers without ES module support (legacy browsers), does not block modern mobile Chrome: PASS
- Google is confirmed using the **mobile crawler** (Smartphone Googlebot, via URL Inspection API). Mobile-first indexing is active.
- One touch target identified as undersized: a keyboard shortcut button measures 34x23px (minimum recommended: 44x44px). One button's accessible name does not match its visible label (desktop only). Both are minor.

**Issues:**

- MEDIUM: Flag SVGs lack explicit `width` and `height` attributes in some contexts. Without explicit dimensions the browser cannot reserve layout space before the SVG loads, contributing to CLS. However, measured CLS is 0.001 on mobile and 0.003 on desktop (both GOOD) — the impact is already being mitigated, possibly by CSS `aspect-ratio` or intrinsic SVG dimensions. Monitor during future design changes.

---

## 6. Core Web Vitals

**CrUX field data: NOT AVAILABLE** — insufficient Chrome traffic volume. All metrics are Lighthouse lab simulation (PSI, 2026-06-23). Google uses mobile crawler; all CWV decisions below prioritise the mobile figures.

### LCP — Largest Contentful Paint

| Device | Value | Threshold | Rating |
|---|---|---|---|
| Mobile | **10,501 ms** | Good <=2,500ms / Poor >4,000ms | POOR |
| Desktop | **1,921 ms** | Good <=2,500ms | GOOD |

**This is the most critical finding in the entire audit.** Mobile LCP is 4.2x above the Poor threshold. Google is evaluating the mobile figure for CWV signals. Desktop (1,921 ms — Good) demonstrates the site is technically capable of fast delivery; the mobile figure is caused by specific fixable issues, not architectural failure.

#### Root Cause Breakdown

**Cause 1 — Unoptimised hero PNG images (primary, est. impact: 5–7 s)**

Three raw PNG files are loaded above the fold on the homepage:

| File | Size | Wasted Bytes |
|---|---|---|
| `/images/sample2_before_1782052888740.png` | 800 KB | 788 KB |
| `/images/sample4_before_1782052955340.png` | 713 KB | 701 KB |
| `/images/sample4_after_1782052969219.png` | 563 KB | 551 KB |

Total above-fold image payload: **2,076 KB**. On a simulated mid-range Indian mobile connection (standard Lighthouse throttling: 150 Kbps downstream for mobile simulation) this alone accounts for ~110 seconds of transfer time — confirming the 10.5 s figure is image-transfer dominated. These images must be converted to WebP/AVIF and served at display-appropriate sizes. Using Next.js `<Image>` with correct `sizes` prop and Cloudflare Images automatic format negotiation would reduce this to under 150 KB total.

**Cause 2 — LCP image not preloaded (est. impact: 200–400 ms)**

The LCP element (the above-fold before/after image) is not linked from `<head>` with a `<link rel="preload">` hint. The browser discovers it only when parsing the `<body>` HTML, adding one full network round-trip to the discovery timeline. A `<link rel="preload" as="image" fetchpriority="high">` in `<head>` for the mobile-optimised version of the LCP image would advance discovery by 200–400 ms.

**Cause 3 — Render-blocking CSS (est. impact: 320–475 ms)**

Two CSS files block first paint on every page:
- `/_next/static/css/6f1f78d2e4581295.css` (17.8 KB, 317 ms blocked)
- `/_next/static/css/947194dd5522290f.css` (3.1 KB, 475 ms blocked)

These are the Next.js-compiled global stylesheets. They block the browser from rendering any pixel until they are fully downloaded and parsed.

**Cause 4 — Google AdSense blocking the main thread (est. impact: 103–156 ms main thread; secondary LCP delay)**

Google/Doubleclick Ads is the dominant third-party burden:
- `show_ads_impl_fy2021.js`: 130 KB wasted bytes, 103 ms long task
- `adsbygoogle.js`: 30 KB wasted bytes, 89 ms long task
- Total AdSense transfer: **229 KB** | Total main-thread time: **156 ms**

These scripts load synchronously alongside hydration, competing with the LCP image for both bandwidth and CPU. On desktop (faster CPU + faster connection in simulation) they clear before the LCP deadline; on mobile they push everything past 10 s.

**Cause 5 — Non-composited animation triggering forced reflow (est. impact: 650 ms style/layout cost)**

`.animate-scan-beam` uses an inline `background` style animation. This is not compositor-eligible (GPU-offloaded). The browser must recalculate style and layout on the main thread for every animation frame, contributing to the 650 ms style/layout cost measured in the mobile trace. Replace with a CSS `transform` or `opacity` animation to move it to the GPU compositor.

**Cause 6 — Legacy JavaScript polyfills (est. impact: 107–141 ms execution)**

`/_next/static/chunks/1255-426489508942ad19.js` (47 KB) contains 11.8 KB of polyfills for features baseline-compliant in all modern browsers. Updating the `browserslist` target in `package.json` to drop IE 11 and legacy Chrome eliminates this waste.

**Cause 7 — DOM size and main-thread load**

1,954 DOM elements; body has 148 direct children; max depth: 14. Main-thread breakdown on mobile: script evaluation 706 ms, style & layout 651 ms, rendering 420 ms, total **3.2 s of main-thread work** on top of image transfer.

#### Fix Priority for LCP

| Action | Est. LCP gain | Effort |
|---|---|---|
| Convert hero PNGs to WebP/AVIF at display size | 5–7 s | Medium |
| Add `<link rel="preload">` for LCP image | 200–400 ms | Low |
| Defer AdSense until after LCP fires | 100–200 ms | Medium |
| Inline critical CSS, async-load remainder | 320–475 ms | Medium |
| Fix `.animate-scan-beam` to use `transform` | 100–200 ms | Low |
| Update browserslist targets | 107–141 ms | Low |

**Expected outcome if all six are applied:** mobile LCP drops from 10,501 ms to approximately 2,000–2,500 ms (Good range). Fixing the PNG images alone is likely to drop it below 4,000 ms (out of Poor), making everything else incremental.

### INP — Interaction to Next Paint

**Lab proxy: TBT (Total Blocking Time)**

| Device | TBT | INP Rating Proxy |
|---|---|---|
| Mobile | 130 ms | GOOD (INP threshold proxy: <200 ms TBT → likely Good INP) |
| Desktop | 60 ms | GOOD |

TBT values suggest INP will be Good when CrUX field data becomes available. Tool pages (passport-photo, ssc-photo-resizer) show TBT of 40–60 ms in prior Lighthouse runs, confirming the WASM/ML model loading is correctly deferred off the critical interaction path. Note: TBT is not a direct substitute for INP — INP captures interaction latency to next paint whereas TBT measures main-thread blocking during load. Monitor with real-user data once CrUX eligibility is reached.

### CLS — Cumulative Layout Shift

| Device | Value | Rating |
|---|---|---|
| Mobile | **0.001** | GOOD |
| Desktop | **0.003** | GOOD |

CLS is excellent on both devices. No layout shift issues. This is a meaningful engineering achievement given the dynamic canvas rendering, WASM model loading, and country flag grid on the homepage.

---

## 7. JavaScript Rendering

**Status: PASS (SSG confirmed)**

- Next.js 15 static export — all pages are pre-rendered to complete HTML at build time.
- `<!--$-->` React Suspense boundaries are filled synchronously from static HTML — no content is deferred to client-side rendering.
- Critical SEO content (H1, meta description, structured data, canonical tag) is present in the raw HTML served without JavaScript execution.
- Google URL Inspection API confirmed the homepage is crawled and indexed as Mobile Smartphone. Full page content is available to Googlebot on first fetch — no second-wave JavaScript render is required.
- Tool interactivity (file upload, WASM model, canvas operations) is client-side but occurs after the indexable static markup — it does not affect indexability.
- `/_next/static/` assets correctly carry `Cache-Control: max-age=31536000, immutable`.
- HTML pages carry `Cache-Control: public, max-age=0, must-revalidate` — Cloudflare edge re-validates on every request but serves from Singapore edge (11–22 ms TTFB).

---

## 8. Structured Data

**Status: PARTIAL PASS**

Schema architecture is JSON-LD only (correct). A centralised `lib/schema.ts` + `components/seo/JsonLd.tsx` pattern is used for all schema emission.

### Schema Coverage by Page Type

| Page Type | Schemas Emitted |
|---|---|
| All pages (global layout) | Organization + WebSite |
| Homepage | FAQPage |
| Country maker pages (~20) | BreadcrumbList + SoftwareApplication + FAQPage |
| Blog posts (24) | BreadcrumbList + BlogPosting |
| Blog posts with FAQ component (10) | BreadcrumbList + BlogPosting + FAQPage |
| Tool pages (~20) | BreadcrumbList + SoftwareApplication + FAQPage |
| Exam resizer pages | BreadcrumbList + SoftwareApplication + FAQPage |
| Exam requirements pages | BreadcrumbList + FAQPage |
| Category hub pages | BreadcrumbList + CollectionPage |
| About page | BreadcrumbList + AboutPage |

### What Works

- Breadcrumbs rich result confirmed passing by Google URL Inspection API on `/passport-photo/`.
- FAQPage on tool and blog pages — eligible for FAQ rich results in SERPs.
- BlogPosting with `datePublished`, `dateModified`, `inLanguage: en-IN`, and `author` on all 24 blog posts.
- Organization schema includes `knowsAbout` array.
- OG image endpoint returns 200 with `image/png` — Twitter/LinkedIn shares render correctly.

### Issues

- HIGH: **BlogPosting `image` is hardcoded to generic `/og.png` across all 24 blog posts.** Google's Image guidelines for rich results require a unique, representative image per Article/BlogPosting. Using a generic site OG image for every post reduces eligibility for Top Stories / Article rich results. Each post needs a unique `image` property pointing to a post-specific image (even if it is a simple generated header image).
- MEDIUM: **WebSite schema missing `SearchAction` / Sitelinks Searchbox.** For a tool-heavy site with 258 indexed pages, a SearchAction pointing to an exam-package or search route would enable Sitelinks Searchbox on branded queries. Low effort, high visibility upside.
- MEDIUM: **`howToSchema` generates `null` on three page types** (`KbResizeLanding`, `PdfKbLanding`, `DocPhotoLanding`). The `lib/schema.ts` `howToSchema()` function returns `null` for these page types. The `JsonLd` component emits `<script type="application/ld+json">null</script>` — this is invalid structured data and will be ignored by Google but clutters the HTML. Either implement the HowTo schema properly or remove the emission.
- MEDIUM: **`sameAs` contains only Pinterest.** `organizationSchema.sameAs: ['https://www.pinterest.com/easyphoto0604/']`. A single social profile limits entity disambiguation in Google's Knowledge Graph. Add YouTube, LinkedIn, and X handles when accounts are created.
- LOW: **No `SearchAction` / `SoftwareApplication` on standalone tool pages** like `/tools/signature-cleaner/`. SoftwareApplication schema with `offers.price: '0'` is present on maker pages and exam tool pages but absent from some standalone tools. Consistent coverage enables star-rating rich results.

---

## 9. Internal Linking

**Status: PASS with gaps**

- Homepage has 109 unique internal link targets — good crawl depth and breadth.
- Blog posts link back to relevant tool pages.
- Blog index (`/blog/`) is in the sitemap and returns 200, but has never been crawled by Googlebot (see section 2). Root cause is absent navigation link.

**Issues:**

- CRITICAL: **No navigation link to `/blog/`.** The blog index page returns 200 and is in the sitemap, but Google has never crawled it. The only explanation is that no regularly-crawled page (homepage, nav, footer) carries an internal link to `/blog/`. Add a "Blog" link to the main navigation or at minimum to the site footer. This is a single code change with direct impact on Googlebot's ability to discover and index new blog posts through the site's link graph (not just through the sitemap).
- MEDIUM: Orphan risk on `/exam-resizer/*` pages. Twenty-plus pages are in the sitemap but incoming internal links from navigable hub pages are unverified. If they are reachable only via sitemap and not via link graph, they accumulate minimal PageRank. Verify that `/exam-requirements/ssc/` cross-links to `/exam-resizer/ssc-cgl/` and that the tools hub pages link both directions.
- MEDIUM: `/convert/*` hub (9 sub-pages) appears weakly cross-linked to the main tools section. Add cross-links from `/tools/format-converter/` to individual `/convert/*` pages.
- LOW: Hindi-language landing pages (`/photo-resize-kaise-kare/`, `/photo-ka-size-20kb-kaise-kare/` etc.) have no inbound links from navigation or tool pages. They depend entirely on sitemap discovery and organic search. A "Hindi" section link in the footer would provide PageRank flow and improve discoverability.

---

## 10. IndexNow Protocol

**Status: NOT IMPLEMENTED**

No IndexNow key file found at `/indexnow.txt` or `/.well-known/indexnow`. No IndexNow meta tag in `<head>`. IndexNow would enable instant ping to Bing, Yandex, and Naver when pages are published or updated. For a Cloudflare Pages static site, this can be implemented as a Cloudflare Pages Deploy Hook that calls `https://api.indexnow.org/indexnow` on each deployment with the list of changed URLs. Particularly valuable for the blog cluster where new posts currently wait for Googlebot to discover them via sitemap recrawl.

---

## 11. AI Crawler Management

**Status: PASS (best-in-class)**

All major AI crawlers explicitly allowed in `robots.txt`:
- `GPTBot` (ChatGPT / OpenAI web browsing)
- `OAI-SearchBot` (OpenAI SearchGPT)
- `ChatGPT-User` (ChatGPT live browsing)
- `ClaudeBot` (Anthropic Claude)
- `Anthropic-AI`
- `PerplexityBot`
- `Google-Extended` (Gemini training)

`llms.txt` is present and comprehensive (200 OK). This is ahead of most Indian tool competitors and is the correct approach for AI Search Readiness.

---

## Summary of All Issues by Priority

### Critical (address within 72 hours)

1. **Mobile LCP 10,501 ms — POOR.** Convert the three above-fold hero PNGs (`sample2_before` 800 KB, `sample4_before` 713 KB, `sample4_after` 563 KB) to WebP/AVIF at display-appropriate sizes. Total target: under 150 KB for all three on mobile. Use Next.js `<Image>` with `sizes` prop. This single fix is expected to move mobile LCP from Poor (10.5 s) to the Good/Needs Improvement boundary (~2.5 s).

2. **`/blog/` has never been crawled by Googlebot.** Add a "Blog" link to the main navigation or site footer. Without a link from a regularly-crawled page, Googlebot cannot discover new posts through the link graph — it relies entirely on the sitemap, which delays indexation of new posts significantly.

### High (address within 1 week)

3. **Add `<link rel="preload" as="image" fetchpriority="high">` for the LCP image.** The LCP candidate on mobile is not pre-announced in `<head>`. Browser discovers it late, adding ~300 ms to LCP. This is a one-line change in the homepage `<head>` section.

4. **Implement www → non-www 301 redirect.** Add a Cloudflare Redirect Rule: `www.easyphoto.in/*` → `https://easyphoto.in/*` (301). Live GSC data confirms Google is currently split-indexing at least 3 page families across www and non-www, diluting link equity.

5. **Defer Google AdSense loading until after LCP.** AdSense contributes 229 KB and 156 ms of main-thread time during the LCP window on mobile. Use IntersectionObserver or `requestIdleCallback` post-LCP to defer the `adsbygoogle.js` injection. Expected: 100–200 ms additional LCP improvement on top of image optimisation.

6. **Fix `.animate-scan-beam` animation.** Replace inline `background` style animation with CSS `transform` or `opacity` to move it to the GPU compositor. Currently triggers 650 ms of forced-reflow style/layout work on the mobile main thread.

7. **Fix BlogPosting `image` property.** Remove the hardcoded `/og.png` generic image from all 24 BlogPosting schemas. Add a unique representative image per post. Required for Article/Top Stories rich result eligibility.

### Medium (address within 2 weeks)

8. **Inline critical CSS, load global CSS non-blocking.** Two CSS files (`6f1f78d2e4581295.css`, `947194dd5522290f.css`) block first paint for 317–475 ms on mobile. Extract above-fold critical CSS and inline it. Load the full stylesheet with the `rel="preload"` + `onload` trick or a CSS-in-JS critical extraction step.

9. **Fix `lastmod` inflation in sitemap.** 163 of 258 URLs carry the build timestamp rather than per-page content dates. Implement per-page `lastmod` from git commit date or CMS `updatedAt` field to restore Googlebot's trust in the signal.

10. **Fix `howToSchema` null emission.** The three page types that call `howToSchema()` and get `null` should either implement the HowTo schema properly or remove the `JsonLd` emission entirely for those page types. Emitting `null` is invalid structured data.

11. **Add WebSite SearchAction schema.** Add `potentialAction: SearchAction` to the WebSite schema pointing to a tool search or exam-package route. Enables Sitelinks Searchbox on branded queries.

12. **Fix `<dl>` / `<dt>` / `<dd>` markup.** The homepage stats section uses an invalid `dl > div > dt + dd` nesting. This causes 12 accessibility violations and is invalid HTML. Each `<dt>/<dd>` pair must be a direct child of `<dl>` (or wrapped in a `<div>` only if consistently applied — HTML spec allows `div` wrappers inside `<dl>` since HTML5.1, but the current structure appears to violate even that pattern).

13. **Verify exam-page body-text uniqueness.** 105 programmatic exam pages (53 exam-requirements + 52 form-resizer) exceed the thin-content risk threshold. Audit 10 sampled pairs for prose uniqueness. If body text is templated beyond the exam name, add unique introductory paragraphs per exam covering the portal's specific requirements.

14. **Investigate cross-origin policy block.** Chrome DevTools flags a "Blocked by cross-origin policy" on all pages. Identify the resource and resolve the COEP/CORS conflict — this blocks future enablement of SharedArrayBuffer for WASM threading.

15. **Strengthen orphan-risk pages.** Verify `/exam-resizer/*` pages receive inbound links from their corresponding `/exam-requirements/*` pages and from tool hub nav. Verify `/convert/*` pages are linked from the tools hub.

### Low (address within 4 weeks)

16. **Implement IndexNow.** Cloudflare Pages Deploy Hook → `api.indexnow.org` ping for all updated URLs. Accelerates Bing/Yandex/Naver indexation of new blog posts and tool pages.

17. **Update `browserslist` targets.** Remove IE 11 and legacy Chrome from the target list to eliminate the 11.8 KB polyfill bundle in chunk `1255`. Low effort, 107–141 ms main-thread saving.

18. **Add `<image:image>` extensions to sitemap.** For country/tool pages with sample photo outputs. Enables Google Images discovery for a site where visual outputs are a core product differentiator.

19. **Add `sameAs` social profiles.** Expand `organizationSchema.sameAs` beyond Pinterest to include YouTube, LinkedIn, and X when accounts are created. Improves Knowledge Graph entity disambiguation.

20. **Link Hindi-language pages from footer.** Add a regional language section or "Hindi" footer link so PageRank flows to the transliterated landing pages rather than them depending entirely on sitemap.

21. **CSP Trusted Types.** Add `require-trusted-types-for 'script'` where `innerHTML` is not used. Long-term: migrate to nonce-based CSP when Next.js server-rendered mode is adopted.

---

## What Works Well

- Full HTTPS with 2-year HSTS preload (preload-eligible) — best practice.
- 258-URL sitemap: 258/258 URLs return 200, zero errors, zero warnings.
- `Disallow: /_next/` in robots.txt — correctly prevents crawl budget waste on JS build artefacts (fixed since June 18).
- All AI crawlers explicitly allowed — ahead of Indian tool site competitors.
- `llms.txt` present and comprehensive — best-in-class AI search readiness.
- All JS scripts carry `async` — no render-blocking scripts on any page.
- Next.js static export — Googlebot receives complete content on first fetch, no second-wave JS render required.
- CLS: 0.001 mobile / 0.003 desktop — excellent, no layout shift issues.
- Desktop LCP: 1,921 ms — GOOD. Desktop performance is strong (90/100 Lighthouse).
- `Cache-Control: max-age=31536000, immutable` on all `/_next/static/` assets.
- PSI SEO score: 100/100 on both mobile and desktop.
- Server TTFB: 11–22 ms — Cloudflare Singapore edge is not a bottleneck.
- Self-referencing canonicals correct on all sampled pages; homepage canonical confirmed matched by Google.
- FAQPage schema on tool and blog pages — eligible for FAQ rich results.
- BlogPosting with `datePublished`, `dateModified`, `inLanguage: en-IN`, `author` on all 24 blog posts.
- Breadcrumbs rich result confirmed passing by Google URL Inspection API.
- OG image endpoint returns 200 with `image/png` — social sharing renders correctly.
- Strong security header stack (7 headers) — all major headers present and correctly configured.
- Viewport meta tag correct on all pages — no `user-scalable=no`.
- HTTP → HTTPS redirect: clean 301.
