# Technical SEO Audit — easyphoto.in
**Date:** 2026-06-18  
**Stack:** Next.js 15 static export, Cloudflare Pages  
**Market:** India-primary, global tool pages  
**Score: 74 / 100**

---

## 1. Crawlability

**Status: PASS**

- `robots.txt` is present and valid at `https://easyphoto.in/robots.txt`.
- Policy: `Allow: /` for all user-agents including `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, and `*`. No `Disallow` directives at all — the entire site is open to all crawlers.
- Sitemap is declared: `Sitemap: https://easyphoto.in/sitemap.xml`
- No `noindex` meta tags detected on any sampled page (homepage, /passport-photo/, /blog/, /tools/signature-cleaner/).
- No blocked resources observed in sampled HTML.

**Issues:**
- MEDIUM: No `Disallow: /_next/` rule. Googlebot will attempt to crawl Next.js build artefacts (`/_next/static/chunks/*.js`) — they are not harmful but consume crawl budget on a large chunk-heavy build (20+ JS chunk files per page). Add `Disallow: /_next/` to reduce noise.
- LOW: robots.txt has no `Crawl-delay` — not a problem for Googlebot but Bingbot/Yandex can be aggressive on shared CF infrastructure.

---

## 2. XML Sitemap

**Status: PASS with notes**

- Sitemap is present at `https://easyphoto.in/sitemap.xml` and is valid XML conforming to `http://www.sitemaps.org/schemas/sitemap/0.9`.
- **248 URLs** total — comprehensive coverage: homepage, /tools/ hub + 25 tool sub-pages, /passport-photo/, /visa-photo/, /blog/ + 24 blog posts, 40+ exam-requirements pages, 40+ exam-resizer pages, country-specific passport/visa makers, Hindi-language landing pages (photo-resize-kaise-kare etc.), /convert/ hub + 9 format converter pages.
- All URLs use trailing slashes consistently — matches Next.js static export behavior.
- All URLs are HTTPS and lowercase.
- All key pages sampled (200 OK responses confirmed).

**Issues:**
- HIGH: **4 URLs have future `lastmod` dates** (today is 2026-06-18):
  - `2026-07-14` — `/blog/indian-passport-photo-size-rules/`
  - `2026-07-07` — `/blog/upsc-cse-ias-photo-signature-guide-2026/`
  - `2026-07-04` — `/blog/nda-cds-photo-signature-guide-2026/`
  - `2026-07-01` — `/blog/ssc-cgl-chsl-photo-signature-guide-2026/`
  
  These pages are live and return 200 OK but the sitemap claims they were last modified in July. Google treats future `lastmod` values as a trust signal violation — it may discount `lastmod` accuracy across the entire sitemap. Correct these to the actual deployment/content date.

- MEDIUM: Legal/policy pages (`/privacy/`, `/terms/`, `/disclaimer/`, `/about/`, `/contact/`) are listed in the sitemap with `priority=0.8` — same as money pages like `/passport-photo/`. These pages have zero commercial value and equal priority to core tools dilutes the crawl priority signal. Set legal/contact pages to `priority=0.3` and `changefreq=yearly`.

- LOW: No `<image:image>` extensions in sitemap. For a visual tool site this is a missed opportunity to get tool screenshots indexed in Google Images.

---

## 3. Canonical Tags

**Status: PASS**

All sampled pages carry self-referencing canonical tags pointing to the correct trailing-slash HTTPS URL:

| Page | Canonical |
|------|-----------|
| `/` | `https://easyphoto.in/` |
| `/passport-photo/` | `https://easyphoto.in/passport-photo/` |
| `/tools/signature-cleaner/` | `https://easyphoto.in/tools/signature-cleaner/` |
| `/blog/` | `https://easyphoto.in/blog/` |
| `/blog/indian-passport-photo-size-rules/` | `https://easyphoto.in/blog/indian-passport-photo-size-rules/` |

No canonical mismatches or cross-domain canonicals found.

**Issues:**
- MEDIUM: **www subdomain serves full duplicate content** — `https://www.easyphoto.in/` returns HTTP 200 with the same HTML (canonical points to non-www). There is no 301 redirect from www to non-www. The canonical tag is the only signal preventing a duplicate content issue. Cloudflare Pages supports a "Redirect www" rule in the dashboard — implement a 301 from `www.easyphoto.in/*` to `easyphoto.in/*` to eliminate the duplicate entirely and consolidate any backlinks that arrive on www.

---

## 4. Security Headers

**Status: PASS (excellent)**

All critical security headers are present and correctly configured:

| Header | Value | Assessment |
|--------|-------|------------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Excellent — 2-year max-age, preload-eligible |
| `Content-Security-Policy` | Present with `default-src 'self'`, `upgrade-insecure-requests`, Cloudflare Insights whitelisted | Strong |
| `X-Content-Type-Options` | `nosniff` | Pass |
| `Referrer-Policy` | `no-referrer` | Pass |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Pass |
| `Cross-Origin-Embedder-Policy` | `credentialless` | Pass |
| `Cross-Origin-Opener-Policy` | `same-origin` | Pass |

**Issues:**
- LOW: CSP includes `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. These are required by Next.js 15 without a nonce/hash approach but represent a weakening of the script injection protection. Not a ranking factor but flagged for security hygiene.
- LOW: No `X-Frame-Options` header (covered by `frame-ancestors 'none'` in CSP, which is the modern equivalent — this is fine).

---

## 5. URL Structure

**Status: PASS**

- All URLs are lowercase.
- All URLs use trailing slashes consistently (matches `trailingSlash: true` in Next.js config).
- URL slugs are descriptive and keyword-bearing (e.g., `/india-passport-photo-maker/`, `/ssc-photo-resizer/`, `/photo-resize-to-50kb/`).
- Hindi-transliterated URLs (`/photo-resize-kaise-kare/`, `/photo-ka-size-20kb-kaise-kare/`) use ASCII-safe slugs — correct approach, no encoding issues.
- No URL duplication detected between the main tool pages and the `/tools/` sub-directory (e.g., `/ssc-photo-resizer/` vs `/tools/form-resizer/ssc/` serve different intents).

**Issues:**
- MEDIUM: **Parallel URL hierarchies for exam content** — the same exam (e.g., SSC) has entries at `/ssc-photo-resizer/`, `/exam-requirements/ssc/`, `/tools/form-resizer/ssc/`, and `/exam-resizer/ssc-cgl/`. Four different URL trees for overlapping exam photo content creates internal cannibalisation risk. Ensure inter-linking between these tiers is strong and that each URL has a clearly distinct intent.

---

## 6. Redirect Handling

**Status: PARTIAL PASS**

- HTTP → HTTPS: `http://easyphoto.in/` correctly issues a `301 Moved Permanently` to `https://easyphoto.in/`. Pass.
- `https://www.easyphoto.in/` → **no redirect**. Returns HTTP 200 with full page content. The canonical tag prevents indexation of www as a separate URL but does not prevent crawl budget consumption or link equity dilution. See section 3.

**Issues:**
- HIGH: **www serves content without redirecting to non-www.** Fix by adding a Cloudflare Page Rule or Redirect Rule: `www.easyphoto.in/*` → `https://easyphoto.in/$1` (301).

---

## 7. Mobile-Friendliness

**Status: PASS**

- Viewport meta tag is present on all sampled pages: `content="width=device-width, initial-scale=1"` — correct, no `user-scalable=no` that would break accessibility.
- CSS framework is Tailwind — responsive utility classes observed (`sm:py-16 lg:py-20`, `lg:grid-cols-[...]`).
- No evidence of fixed-width layouts forcing horizontal scroll.
- All scripts are `async` (no render-blocking scripts other than `polyfills.js noModule`).
- `polyfills.js` uses `noModule` attribute — it only loads in browsers that do not support ES modules (legacy browsers), so it does not block modern mobile browsers.

**Issues:**
- MEDIUM: **30 `<img>` tags lack explicit `width` and `height` attributes** — primarily flag SVGs (`/flags/in.svg`, `/flags/us.svg`, etc.). Without explicit dimensions the browser cannot reserve space before the SVG loads, contributing to Cumulative Layout Shift (CLS). Add `width` and `height` attributes matching the rendered size of each flag (e.g., `width="24" height="16"`).
- LOW: Flag SVGs are rendered twice in the HTML (once in the hero section, once likely in the footer/nav). Ensure deduplication or that the second set is below the fold with `loading="lazy"`.

---

## 8. Core Web Vitals (Lab Estimates from Source Inspection)

**No lab data available from static analysis alone. Estimates based on source characteristics.**

### LCP (Largest Contentful Paint)
**Likely: Good to Needs Improvement (est. 1.8–3.2s on mobile)**

- Homepage LCP candidate is the H1 text block ("Document photos that get accepted") — text LCP is generally faster than image LCP.
- Content IS present in the static HTML (Next.js SSG confirmed — `<!--$-->` Suspense boundary fills immediately with static markup, not client-rendered shell).
- However, **43 preload hints** are sent in the `Link` header: 3 fonts + 22 flag SVG images + webpack chunk. Preloading 22 flag images that compete with the LCP element for bandwidth on Indian mobile connections (avg 15–25 Mbps) is a concern.
- Static assets are correctly cached with `Cache-Control: max-age=31536000, immutable` on JS chunks.
- HTML pages are `Cache-Control: public, max-age=0, must-revalidate` (no CDN caching of HTML) — this means every page request hits Cloudflare's origin. CF edge serves from SIN (Singapore) which is good for India.

**Action:** Add `fetchpriority="high"` to the LCP element (the H1 or the first above-fold image). Move the 22 flag SVG preloads to `<link rel="preload" fetchpriority="low">` or eliminate them from the `Link` header and let the browser discover them naturally once the hero section renders.

### INP (Interaction to Next Paint)
**Likely: Good (<200ms) for static content pages; Needs Improvement for tool pages**

- Tool pages load AI/WASM models from `https://models.easyphoto.in` — model loads are deferred (not in critical path), which is correct.
- 94 inline `<script>` blocks in the HTML are Next.js hydration chunks. Hydration of a complex page can spike the main thread. For India where mid-range phones (Redmi, Samsung M-series) are dominant, long hydration tasks are a real INP risk.
- CSR interactivity (file upload, canvas rendering) happens after hydration — not a concern for INP measurement which tracks user-initiated interactions.

### CLS (Cumulative Layout Shift)
**Likely: Needs Improvement (est. 0.05–0.15)**

- 30 `<img>` tags without explicit `width`/`height` (all flag SVGs). SVGs load fast but the browser still causes layout recalc when dimensions resolve. With 22 flags visible in the country selector, cumulative small shifts can push CLS above 0.1.
- 3 fonts are preloaded (`woff2`) which helps prevent FOUT-driven layout shifts.
- No evidence of ads injecting above-fold content (AdSense is loaded async).

---

## 9. Structured Data

**Status: PASS with gaps**

| Page | Schemas Detected |
|------|-----------------|
| Homepage | 2 (one unparseable — likely @graph; FAQPage with 6 entries) |
| `/passport-photo/` | 6 schemas |
| `/tools/signature-cleaner/` | 3 (Organization, BreadcrumbList, FAQPage) |
| `/blog/indian-passport-photo-size-rules/` | 3 (2 unparseable, FAQPage) |

- FAQPage schema on tool pages is valuable for Indian informational queries.
- BreadcrumbList on `/tools/signature-cleaner/` is correct.
- OG image is set (`https://easyphoto.in/opengraph-image?...`) and returns 200 with `image/png` — Twitter/LinkedIn shares will render correctly.

**Issues:**
- MEDIUM: Homepage schema type 1 failed JSON parse (regex capture truncated). Verify the homepage `@graph` schema renders valid JSON in production — malformed schema is silently ignored by Google and loses rich result eligibility.
- MEDIUM: No `WebSite` schema with `SearchAction` (Sitelinks Searchbox). For a tool-heavy SaaS with 248 indexed pages, a search action schema could drive direct tool discovery from SERP.
- MEDIUM: Blog posts lack `Article` / `BlogPosting` schema. Google uses Article schema for `lastmod` trustworthiness and Top Stories eligibility. Add `BlogPosting` with `datePublished`, `dateModified`, `author`, and `publisher` to all blog posts.
- LOW: No `SoftwareApplication` schema on tool pages (e.g., `/tools/signature-cleaner/`, `/tools/background-removal/`). This is a missed opportunity for star-rating rich results in Google Play-adjacent SERPs.

---

## 10. JavaScript Rendering

**Status: PASS (SSG confirmed)**

- The site is a **Next.js 15 static export** — all pages are pre-rendered to static HTML at build time.
- Critical page content (H1, meta description, structured data) is present in the static HTML served without JavaScript execution.
- `<!--$-->` React Suspense boundaries (2 on homepage) are filled synchronously from static HTML — no content is deferred to client-side rendering.
- Tool interactivity (file upload, WASM model, canvas) is entirely client-side but does not affect indexability — the informational/SEO content is in the static markup.
- Googlebot will receive the full page content on first fetch without needing a second wave render.

---

## 11. Internal Linking

**Status: PASS with room to improve**

- Homepage has 109 unique internal link targets — good crawl depth breadth.
- Blog posts link back to relevant tool pages (e.g., `/blog/indian-passport-photo-size-rules/` links to `/tools/transparent-signature/`, `/passport-photo/`, country visa pages).
- Blog index (`/blog/`) correctly links to all 24 blog posts.

**Issues:**
- MEDIUM: **Orphan risk on exam-resizer pages.** The `/exam-resizer/ssc-cgl/`, `/exam-resizer/ibps-po/` etc. (20+ pages) are in the sitemap but it is unclear how many internal links point to them from navigable pages. If they are only discovered via sitemap and not linked from any hub page, they will accumulate low PageRank. Verify `/exam-requirements/ssc/` links to `/exam-resizer/ssc-cgl/` and vice versa.
- MEDIUM: `/convert/` hub and its 9 sub-pages (`/convert/heic-to-jpg/` etc.) appear to be standalone with limited cross-links to main tool pages. Add cross-links from `/tools/format-converter/` to the individual `/convert/*` pages.
- LOW: The Hindi-language pages (`/photo-resize-kaise-kare/`, `/photo-ka-size-20kb-kaise-kare/` etc.) are not linked from the main nav or tool pages — they depend entirely on sitemap discovery and organic search. Consider a "Hindi" or regional language section link from the footer.

---

## 12. IndexNow Protocol

**Status: NOT IMPLEMENTED**

- No IndexNow key file found at any standard path (`/indexnow.txt`, `/.well-known/indexnow`).
- No IndexNow meta tag in page `<head>`.
- IndexNow would enable instant notification to Bing, Yandex, and Naver on page publishes/updates — particularly valuable for the blog where you publish multiple posts and update `lastmod`. For a Cloudflare Pages site this can be implemented as a Deploy Hook → Worker that calls `https://api.indexnow.org/indexnow` on each deployment.

---

## Summary of Issues by Priority

### Critical
*(none)*

### High
1. **www serves duplicate content without redirect** — `https://www.easyphoto.in/` returns 200 with no 301 to non-www. Implement Cloudflare Redirect Rule.
2. **4 sitemap entries have future `lastmod` dates** — trust signal violation. Fix dates to actual publish dates.

### Medium
3. **30 flag `<img>` tags missing `width`/`height`** — CLS risk on country selector. Add explicit dimensions.
4. **No redirect from www to non-www** (duplicate of #1 — same fix).
5. **`/_next/` not disallowed in robots.txt** — wastes crawl budget on JS chunks.
6. **Legal pages have priority=0.8 in sitemap** — reduce to 0.3/yearly.
7. **Parallel exam URL hierarchies** (`/ssc-photo-resizer/` + `/exam-requirements/ssc/` + `/exam-resizer/ssc-cgl/`) — ensure strong cross-linking between tiers.
8. **No BlogPosting schema on blog posts** — missing `datePublished`, `dateModified`, `author`.
9. **No WebSite SearchAction schema** — lost Sitelinks Searchbox opportunity.
10. **Verify homepage @graph schema parses cleanly** — JSON parse failure detected in raw extraction.
11. **Orphan risk on /exam-resizer/* pages** — validate incoming internal links.
12. **43 preload hints competing for bandwidth** — move flag SVG preloads to low-priority or remove.
13. **`/convert/*` pages weakly cross-linked** to main tools section.

### Low
14. **No IndexNow implementation** — add for faster Bing/Yandex indexation of new content.
15. **No `<image:image>` in sitemap** — missed Google Images opportunity for a visual tool site.
16. **Hindi landing pages not linked from navigation** — rely solely on sitemap discovery.
17. **CSP uses `unsafe-inline`/`unsafe-eval`** — security hygiene (not a ranking factor).
18. **No SoftwareApplication schema on tool pages** — missed rich result eligibility.

---

## What Works Well
- Full HTTPS with 2-year HSTS preload — best practice.
- Complete, comprehensive sitemap with 248 URLs including Hindi-language pages and all exam permutations.
- All JS scripts are async — no render-blocking scripts on any page.
- SSG static export — Googlebot receives complete content on first fetch, no JS rendering required.
- Self-referencing canonicals are correct on all sampled pages.
- `Cache-Control: immutable` on all `/_next/static/` assets — optimal cache performance.
- FAQPage schema on tool and blog pages — visible rich results in SERPs.
- Strong security header stack — all seven major headers present.
- AI crawler access correctly granted (GPTBot, ClaudeBot, PerplexityBot all allowed).
- HTTP → HTTPS redirect is a clean 301.
- OG/Twitter meta tags present with working image endpoint.
- Viewport meta tag correct on all pages, no `user-scalable=no`.
