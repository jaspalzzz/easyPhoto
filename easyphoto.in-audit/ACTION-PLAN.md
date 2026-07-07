# EasyPhoto SEO Action Plan

**Updated:** 2026-07-07  
**Current score:** 82/100  
**Target:** 88+ after Phase 1–3  
**Evidence:** `live-crawl-2026-07-07.json`, `URL-INVENTORY-2026-07-07.md`

## Current State

The previous June criticals are resolved live:

- `www` to non-www redirect works.
- HTTP to HTTPS redirect works.
- `/india/` redirects to `/india-passport-photo-maker/`.
- `/blog/` is linked and included in sitemap.
- 214/214 sitemap URLs return 200.
- Titles, meta descriptions, canonicals and schema are present on sampled pages.
- Low-value duplicate tiers are `noindex, follow`.

The next growth bottleneck is content/source quality at scale.

## Phase 1: Technical & Trust Cleanup

| Task | Owner | Priority | Effort | Expected impact |
|---|---|---|---:|---|
| Canonical noindexed duplicate tiers to parent authority pages | Developer | P1 | 0.5 day | Cleaner canonical clustering |
| Add visible `Last verified` to all country maker pages | Developer/SEO | P1 | 1 day | Stronger E-E-A-T and AI citation trust |
| Add reusable official-source citation block | Developer/SEO | P1 | 1 day | Better regulated-page trust |
| Convert large blog PNGs to WebP/AVIF | Developer | P1 | 1 day | Better mobile performance |
| Add image size guard for new assets | Developer | P2 | 0.5 day | Prevents regression |

## Phase 2: High-Intent Page Upgrades

| Page/cluster | Action | Owner | Priority |
|---|---|---|---|
| `/exam-requirements/ssc/` | Expand with live capture, name/date, CGL/CHSL/GD examples, rejection fixes | Content/SEO | P1 |
| `/exam-requirements/army-agniveer/` | Expand with name/date workflow and source-backed upload steps | Content/SEO | P1 |
| `/passport-photo/` | Shorten meta, add output card and source card above fold | SEO/Developer | P1 |
| `/india-passport-photo-maker/` | Add domestic vs NRI/VFS distinction and visible source date | SEO/Content | P1 |
| `/tools/exam-package/` | Make H1/query alignment stronger and add supported exam table above fold | Developer/SEO | P1 |
| Top country maker pages | Add unique "good to know", output examples, and source freshness | Content/SEO | P2 |

## Phase 3: Programmatic SEO Foundation

Build only source-backed, tool-backed pages.

Required QA before indexing a new programmatic page:

- Official source URL and verification date.
- Unique requirement table.
- Working tool output for that exact requirement.
- Visible privacy/no-upload statement.
- "Acceptance not guaranteed" disclaimer.
- 1,200+ useful words or equivalent structured utility depth.
- Internal links to hub, related tools, and official-source guide.
- Schema: Breadcrumb + WebApplication/WebPage + FAQ only when visible.
- Not created only for ads.

First safe expansion candidates:

1. DV Lottery photo checker.
2. OCI photo/signature tool.
3. NEET/JEE sub-pages only if distinct enough from NTA parent.
4. Scanned certificate/PDF under KB workflows where the tool output is exact.

## Phase 4: Sitemap & Monitoring

Split sitemap when page count exceeds ~300 or before the next large programmatic launch:

- `sitemap-static.xml`
- `sitemap-tools.xml`
- `sitemap-passport-visa.xml`
- `sitemap-exam-requirements.xml`
- `sitemap-blog.xml`
- `sitemap-images.xml`
- `sitemap-index.xml`

Monitoring cadence:

- Weekly: GSC queries, CTR, index coverage, active exam pages.
- Monthly: PageSpeed Insights for homepage, passport, exam, tool, blog templates.
- Monthly: source freshness audit.
- After each deploy: run `node scripts/live-seo-audit.mjs --out easyphoto.in-audit/live-crawl-YYYY-MM-DD.json --inventory easyphoto.in-audit/URL-INVENTORY-YYYY-MM-DD.md`.

## Phase 5: GEO / AI Search

Add to every regulated page:

- Answer-first fact block.
- "Requirements used" source card.
- Extractable spec table.
- Output explanation.
- Rejection checklist.
- Short FAQ based on actual search phrasing.

Keep AI crawlers allowed for now; EasyPhoto benefits from discovery and citation while the brand is young.

## Phase 6: AdSense-Safe Growth

Rules:

- No ads inside upload, preview, result, or download zones.
- No ads on thin/new programmatic pages until quality gate passes.
- No deceptive "download" visuals near ads.
- Avoid ads on sensitive Aadhaar/PAN OCR/masking flows until layout is reviewed.
- Keep privacy, terms, disclaimer and contact links visible sitewide.

## Success Metrics

| Metric | Target |
|---|---:|
| Sitemap URL errors | 0 |
| Indexed duplicate/noindex pages | Trending down |
| Top 20 exam/country pages with visible source date | 100% |
| Large unoptimized images over 250 KB | 0 unless approved |
| Top exam/country page average word depth | 1,400+ useful words |
| GSC CTR for top impression pages | +25% |
| Organic clicks | Steady month-over-month growth |
| PSI mobile LCP on templates | Good or improving |
