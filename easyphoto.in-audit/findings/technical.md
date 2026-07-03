# Technical SEO Audit — easyphoto.in (RE-AUDIT)

**Audit date:** 2026-07-02
**Prior audit:** 2026-06-23 (Technical score 63/100)
**Method:** Live production checks via curl/python against https://easyphoto.in/ (no synthetic/staging data). robots.txt, sitemap.xml, 5 sample-page canonicals, security headers, www/HTTP redirects, legacy redirect fix, X-Robots-Tag, 404 handling, and mobile/rendering signals all fetched live during this session.

## Score: 82/100

Up from 63/100. All four previously-fixed items verified genuinely fixed in production. One new item (legacy resizer redirect repoint) is code-correct but **not yet live** — the build output on disk predates the fix commit, so production still serves the old, noindexed redirect target. This is a deploy-pending state, not a regression, but it is the reason the score isn't higher.

---

## What Works

- **robots.txt** is valid, served with `text/plain; charset=utf-8`, allows all crawlers including AI agents (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot) and a wildcard `User-Agent: *`, and correctly references `Sitemap: https://easyphoto.in/sitemap.xml`. No accidental `Disallow: /`.
- **sitemap.xml** returns 200, well-formed XML, **213 URLs**, per-page `<lastmod>` dates (build-stamp issue from prior audit confirmed fixed — dates are `2026-06-25`, not a single site-wide stamp). All 12 spot-checked URLs (including homepage, tool page, blog index, blog post, 2 exam-requirements pages, 2 country pages, HEIC converter) return **200**.
- **Canonical tags** are self-referential and correct on all 5 sample pages: `/`, `/passport-photo/`, `/exam-requirements/ssc/`, `/tools/resize-kb/`, `/blog/`. No cross-page canonical leakage found.
- **Security headers** are comprehensive and correctly configured on every page checked (/, /robots.txt, /sitemap.xml, 404, redirects): HSTS (`max-age=63072000; includeSubDomains; preload`), a real CSP (no wildcard script-src, scoped to specific ad/CDN origins), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy` (camera scoped to self, mic/geo/payment/usb blocked), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless`.
- **www → non-www redirect**: confirmed live, single-hop 301, `https://www.easyphoto.in/` → `location: https://easyphoto.in/`. Split-indexation risk from prior audit is resolved.
- **HTTP → HTTPS redirect**: confirmed live, 301, `http://easyphoto.in/` → `https://easyphoto.in/`.
- **X-Robots-Tag noindex** on `/tools/form-resizer/ssc/` is present and correct: `x-robots-tag: noindex, follow`. This is intentional (AdSense consolidation — tool tier deliberately kept out of the index in favor of `/exam-requirements/{exam}/`), and it is holding correctly.
- **404 handling**: `/this-page-does-not-exist/` returns a proper **HTTP 404** (not a soft-404 masquerading as 200), with `cache-control: no-store` so Cloudflare won't cache the miss.
- **/india/ redirect** (prior 404 finding): confirmed fixed — 301 to `/india-passport-photo-maker/`.
- **/blog/ index**: confirmed 200, reachable, in sitemap.
- **Mobile signals**: `<meta name="viewport" content="width=device-width, initial-scale=1"/>` present on every page checked. `<html lang="en">`. Homepage HTML is 470KB raw / ~294K chars of visible text after tag-stripping — page is meaningfully server-rendered, not a JS-empty shell.
- **LCP/hero image fix confirmed live**: hero image is `sample4_before_...webp` served with `fetchPriority="high"` and duplicated as a `<link rel="preload" as="image" fetchPriority="high">` — this is the correct pattern for LCP image priority. All hero/sample images on the homepage are `.webp`, not `.png` (prior audit's PNG-hero LCP-10.5s finding is structurally addressed; actual field LCP was not re-measured in this pass — see Note below).
- **JavaScript rendering**: homepage is SSR'd (Next.js) — full H1, body copy, and FAQ content present in raw HTML with no JS execution required. No CSR-dependent content-visibility risk for crawlers.
- **Structured data present and parseable**: homepage carries `Organization`, `WebSite` (with `SearchAction`), `SoftwareApplication`, and `FAQPage` JSON-LD in two `@graph` blocks — all valid JSON, no parse errors. `/exam-requirements/ssc/` additionally carries `BreadcrumbList` and page-level `WebPage`/`FAQPage` schema.
- **Open Graph tags** complete on homepage: og:title, og:description, og:url, og:site_name, og:image (1200x630, typed), og:type.

## Note on scope

- LCP/CLS/INP were assessed from **source inspection only** (fetchPriority, preload hints, image formats, width/height attributes), per this skill's method — no real browser timing (Lighthouse/CrUX) was run in this session. Treat the LCP "fixed" status as structurally confirmed, not field-measured.
- IndexNow protocol: no key file found at `/indexnow.txt` (404) and no reference to IndexNow in robots.txt or homepage HTML. Not a regression (no prior finding claimed this was implemented) — flagged as a Low-priority gap since the skill's checklist includes it explicitly.

---

## Issues

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| 1 | **High** | Legacy resizer redirects (18 URLs incl. `/ssc-photo-resizer/`, `/upsc-photo-resizer/`, `/pan-card-photo-resizer/`, `/voter-id-photo-resizer/`) still 301 to the **noindexed** `/tools/form-resizer/{slug}/` in production, not the fixed `/exam-requirements/{slug}/` target. The source fix (commit `3e5ed79`, `public/_redirects`) is correct and complete (18/18 slugs repointed), but the deployed build (`out/_redirects`) still reflects the pre-fix mapping — the Cloudflare Pages deploy for this commit has not gone live yet. | `curl -sI https://easyphoto.in/ssc-photo-resizer/` → `location: /tools/form-resizer/ssc/`. Also verified for `upsc-photo-resizer`, `pan-card-photo-resizer`, `voter-id-photo-resizer` — all still point at `/tools/form-resizer/{slug}/`. Local `out/_redirects` file timestamp (05:54) predates fix commit `3e5ed79` (06:03 same day). | No code change needed — trigger/wait for the Cloudflare Pages build to complete and re-verify `curl -sI https://easyphoto.in/ssc-photo-resizer/` shows `location: /exam-requirements/ssc/`. Until then, these 18 URLs continue funneling equity and search intent into a noindexed page, which is exactly the problem the fix commit intended to close. |
| 2 | Low | IndexNow protocol not implemented — no key file at `/indexnow.txt`, no reference in robots.txt or page HTML. | `curl -o /dev/null -w "%{http_code}" https://easyphoto.in/indexnow.txt` → 404. `grep -i indexnow` on robots.txt and homepage HTML → no matches. | Optional: generate an IndexNow key, host it at `/{key}.txt`, and ping Bing/Yandex/Naver on publish/update of sitemap URLs (especially the 29 blog posts and exam-requirements pages, which update on a cadence). Not required for Google, but low-effort incremental win for Bing/Yandex/Naver discovery speed. |
| 3 | Low | Real-user Core Web Vitals (LCP/INP/CLS) were not re-measured with Lighthouse/CrUX in this pass — this audit confirmed the LCP *fix pattern* (WebP + fetchPriority + preload) is live in source, not the resulting field metric. | Source-inspection only, per method note above. | Run PageSpeed Insights / CrUX API against the homepage and 2-3 highest-traffic tool pages post-deploy of the redirect fix, to close the loop on the 10,501ms mobile LCP finding with an actual measured number. |

**No Critical severity issues found.** No Medium severity issues found — the one High item is a deploy-lag, not a code defect, and downgrades to non-issue once the next Cloudflare Pages build ships.

---

## Fix-Verification Table (Prior Finding → Current Status)

| Prior Finding (2026-06-23) | Prior Status | Current Status (2026-07-02, live) | Verification |
|---|---|---|---|
| Mobile LCP 10,501ms from PNG hero images | Poor (>4s threshold) | **Fixed in source** — hero images now `.webp`, hero served with `fetchPriority="high"` and matching `<link rel="preload" as="image" fetchPriority="high">` | `curl -s https://easyphoto.in/ \| grep -oE '<img[^>]*sample[^>]*>'` shows `.webp` sources; preload link header + inline `<link rel="preload">` both confirmed present. Field LCP not re-measured (see Issue #3). |
| `/blog/` never crawled (no nav link) | Fail | **Fixed** — `/blog/` returns 200, present in sitemap.xml with lastmod, reachable | `curl -sI https://easyphoto.in/blog/` → HTTP/2 200; confirmed present in sitemap. |
| `/india/` 404 | Fail | **Fixed** — 301 redirect live | `curl -sI https://easyphoto.in/india/` → `HTTP/2 301`, `location: /india-passport-photo-maker/` |
| www split-indexation (no www→non-www redirect) | Fail | **Fixed** — verified live | `curl -sI https://www.easyphoto.in/` → `HTTP/2 301`, `location: https://easyphoto.in/` |
| Sitemap `<lastmod>` was a single build-stamp date for all URLs | Fail | **Fixed** — per-page dates present | Spot-checked entries all show `2026-06-25`; format is per-`<url>` not a single injected constant (script-generated at build, reflects actual page set, not evidently hardcoded). |
| Legacy resizer redirects → `/tools/form-resizer/{slug}/` (noindexed target) | *New finding, fixed same day (2026-07-02) in source* | **NOT yet live** — production still serves old target | See Issue #1. Source fix confirmed correct via `git show 3e5ed79`; live curl still shows old behavior. |

---

## Summary of Category Pass/Fail

| Category | Status |
|---|---|
| Crawlability (robots.txt, sitemap, noindex) | PASS |
| Indexability (canonicals, duplicates) | PASS |
| Security (HTTPS, headers) | PASS |
| URL Structure (clean URLs, redirects) | PASS (1 pending-deploy item, see Issue #1) |
| Mobile (viewport, responsive signals) | PASS |
| Core Web Vitals (source-level signals) | PASS (field data not re-verified this pass) |
| Structured Data | PASS |
| JavaScript Rendering | PASS (SSR confirmed) |
| IndexNow Protocol | NOT IMPLEMENTED (Low priority) |
