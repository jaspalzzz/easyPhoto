# EasyPhoto SEO Audit — 2026-07-09

**Website:** https://easyphoto.in/
**Method:** 5 parallel specialist re-audits (technical, content/E-E-A-T, SXO, topic cluster, visual) against the 2026-06-18/06-23 baseline and 2026-07-02/07-07 refreshes, cross-verified with live HTTP checks, fresh CrUX field data, and a fresh 28-day GSC pull. Every specialist finding quoted below was independently re-verified (curl, git history, or direct file read) before inclusion — none taken on trust.
**Supersedes:** `FULL-AUDIT-REPORT.md` (2026-07-07, composite 82/100 under a different 17-category weighting scheme — see "Score methodology" below before comparing).

---

## Executive Summary

**SEO Health Score (skill's 7-category weighted formula): 72/100**

| Category | Score | Weight | Trend |
|---|---:|---:|---|
| Technical SEO | 82/100 | 22% | ▲ from 63 (baseline was stale; most gains pre-date this session) |
| Content Quality | 74/100 | 23% | ▲ from 71 |
| On-Page SEO | 64/100 | 20% | ▼ from 67 (methodology, not regression — see below) |
| Schema | 62/100 | 10% | — unchanged, carried forward, spot-verified live |
| Performance (CWV) | 85/100 | 10% | ▲ — first real field data; all 3 ranking vitals pass |
| AI Search Readiness (GEO) | 64/100 | 10% | — unchanged, carried forward, crawler access re-verified live |
| Images | 52/100 | 5% | ▲ from 25 (partial fix — hero only) |

**Two scores tracked separately per SXO methodology (not part of the weighted composite):**
- **SXO Gap Score: 58/100** (up from 41 for the exam cluster specifically)
- **Cluster Health: 7/10**

### Score methodology note (read before comparing to 82/100)
The 2026-07-07 report used a bespoke 17-category weighting (Indexing readiness, Sitemap quality, Programmatic SEO, Official-source authority, Internal linking, Regional SEO, AdSense readiness, etc. — several of which score 80-90 and aren't in this skill's 7-category formula). This audit uses the skill's standard weights (Technical 22% / Content 23% / On-Page 20% / Schema 10% / Performance 10% / AI-readiness 10% / Images 5%) for consistency across future runs. **The two numbers are not comparable** — most underlying signals genuinely improved or held steady since 07-07 (see below); the composite differs because of what's counted, not because the site got worse.

### Top 5 findings (verified)

1. **[Corrected]** A prior baseline recommendation ("re-add `Disallow: /_next/` to robots.txt") is **wrong and must not be applied** — that line was deliberately removed on 2026-06-26 with correct reasoning (Google needs CSS/JS access to render pages; blocking `/_next/` can hurt render-based indexing). Confirmed via `git log -p app/robots.ts`. No action needed; baseline was simply stale.
2. **High — Page-type framing gap on `/exam-requirements/{exam}/` (SXO).** SERP-backwards analysis confirms "voter id photo resizer" is won ~90% by Tool/Interactive pages. Our page now has the actual tool embedded (fixed 2026-07-08) but the title/H1 still read "Photo Size" (spec-first), not "Resizer" (tool-first) — SXO verdict moved from CRITICAL to MEDIUM mismatch, not ALIGNED. **Do not roll out a title change to all 50 pages without testing on voter-id first** — this exact template had a documented failed title-override experiment (army-agniveer, June) that didn't move CTR.
3. **High — Zero outbound government-portal citations** on all 3 recent/new blog posts despite each claiming "verified against the official source." No `href` to `.gov.in`/`nic.in`/`nsdl.com`/`eci.gov.in` found in rendered HTML. Cheap, high-leverage E-E-A-T fix.
4. **High — `/tools/sign-image/` has zero images** (296 words, 3 H2s) despite accelerating GSC demand (257 impressions, up from ~120) for "sign on image." Every Hybrid-type SERP competitor (Signeasy, SignWell) pairs the tool with a before/after visual.
5. **Medium — 12 of 19 raster images site-wide are still unconverted PNGs** (500–820 KB each, incl. one on the homepage and 7 in blog posts). The hero/LCP image was fixed (WebP, confirmed via fresh CrUX: mobile LCP p75 1,894ms GOOD); the rest of the inventory wasn't in scope of that fix and remains open.

### What's confirmed working (don't re-flag these)
- All 3 redirects (www→apex, http→https, legacy voter-id URL) — 301, single-hop, live.
- Sitemap: 215/215 URLs return 200, all consistent trailing-slash/HTTPS/lowercase; duplicate tool tiers correctly excluded.
- Duplicate tool tiers (`/tools/form-resizer/*`, `/exam-resizer/*`) correctly `noindex, follow`.
- All 3 ranking Core Web Vitals pass on real field data: **LCP 1,881ms (Good), CLS 0.00 (Good), INP 125ms (Good)**. FCP/TTFB are marginally over threshold but aren't ranking signals.
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User) explicitly allowed; `llms.txt` live (200).
- JSON-LD present on every sampled page (4 blocks: Organization/WebSite, Breadcrumb, WebApplication/Article, FAQ where applicable) — verified live today.
- SSR/SSG confirmed: full content in raw HTML, no client-only rendering dependency.
- The Government ID pillar ↔ Voter ID spoke relationship is a clean, non-cannibalizing hub-spoke (verified: distinct intent, bidirectional linking, no shared-query conflict).

---

## Category Detail

### 1. Technical SEO — 82/100
Full findings: see agent transcript; corrections applied above (item #1). Confirmed live: redirects, sitemap, noindex strategy, `howToSchema()` null-emission bug fixed, `BlogPosting.image` now per-post (not generic `/og.png`), `WebSite.SearchAction` present. Open, low-priority: IndexNow not implemented (`/indexnow.txt` and `/.well-known/indexnow` both 404, confirmed live) — still the cheapest available win for faster Bing/Yandex indexing.

### 2. Content Quality & E-E-A-T — 74/100
Pillar post (`indian-government-id-photo-requirements`) is the strongest content asset added this session: 1,601 words, 10 H2s, comparison table across 4 portals, FAQ schema, real freshness gap (published 06-25, modified 07-08). `how-to-sign-on-image-online` is thin for a blog post (661 words vs. the 1,500 floor) — reclassify as a tool-support how-to (300+ min, already clears that) or expand with a troubleshooting section. Author `jobTitle` ("developer & document-spec researcher") slightly undersells the research/verification angle — cosmetic, low priority. Exam-requirement sample pages (voter-id 634w, ssc 636w, driving-licence 686w) clear word-count floors even after the resizer embed; full duplication-ratio analysis across all 50 pages not yet done.

### 3. SXO — 58/100 (separate score)
See top findings #2 and #4. Full scoring table:

| Dimension (max 15, Freshness max 10) | `/exam-requirements/voter-id/` | `/tools/sign-image/` |
|---|---:|---:|
| Page Type | 9 | 13 |
| Content Depth | 10 | 6 |
| UX Signals | 11 | 12 |
| Schema | 10 | 8 |
| Media | 5 | 2 |
| Authority | 9 | 6 |
| Freshness | 9 | 5 |
| **Total /100** | **63** | **52** |

### 4. Topic Cluster Architecture — 7/10 (up from ~5.5)
Verified live: `pan-card-photo-size` and `driving-licence-photo-size-sarathi` do **not** link back to the new Government ID pillar (0 references each, confirmed via grep) — 2 of 3 spokes fail the mandatory spoke→pillar rule. The `indian-passport-photo-requirements` / `indian-passport-photo-size-rules` pair restates the identical core spec with **zero cross-links in either direction** (confirmed) — real cannibalization risk, worse than anything in the 06-18 baseline. `Aadhaar` is confirmed absent from `PORTAL_KEYS` — the pillar covers it editorially but there's no matching `/exam-requirements/aadhaar/` tool page, the only one of the 4 IDs without pattern parity. `lib/blog.ts`'s `CLUSTERS` map hasn't been updated to register the new Government ID cluster, so `relatedPosts()` still surfaces unrelated posts on the site's newest pillar.

### 5. Visual/Mobile — qualitative pass (not scored)
Direct screenshot review (not just agent claim) of `/exam-requirements/voter-id/` desktop: renders cleanly, correct H1, spec table, official-source citation, transactional resize box visible at fold — no layout defects. Mobile captures for `/tools/sign-image/` and the 2 new blog posts were not completed this cycle (the visual specialist correctly refused to report pass/fail without reviewing its own screenshots — honest incomplete result, not a fabricated one). Sign-image callout box, the pillar's SVG chart, and the how-to post's table were each already visually verified end-to-end in-browser at their respective PR merges this session (upload→compress→download tested live; chart bar proportions checked programmatically).

### 6. Schema — 62/100 (carried forward, spot-verified)
4 JSON-LD blocks confirmed live on every sampled page today (homepage, sign-image, voter-id, both new blog posts). No deep validation run this cycle — carried forward from 06-18 baseline.

### 7. Performance / CWV — 85/100 (first real field data)
| Metric | p75 | Rating |
|---|---:|---|
| LCP | 1,881 ms | Good |
| CLS | 0.00 | Good |
| INP | 125 ms | Good |
| FCP | 1,822 ms | Needs improvement (22ms over) |
| TTFB | 864 ms | Needs improvement (64ms over, hosting-level) |

All 3 ranking Core Web Vitals pass. Source: Google CrUX, homepage origin, pulled 2026-07-09.

### 8. AI Search Readiness (GEO) — 64/100 (carried forward, crawler access re-verified)
GPTBot/OAI-SearchBot/ChatGPT-User/ClaudeBot/PerplexityBot all explicitly allowed; `llms.txt` returns 200. No deep passage-citability re-audit run this cycle.

### 9. Images — 52/100
Hero/LCP fix (WebP, `fetchPriority="high"`, preload) confirmed via CrUX. 12 of 19 referenced raster images site-wide remain unconverted PNGs (500–820 KB), including one homepage section image and 7 across blog posts. Alt text and CLS-prevention otherwise solid.

---

## Prioritized Action Plan

### Do now (cheap, high-confidence, no risk of repeating a known failure)
1. Add 1-2 direct outbound links per recent/new blog post to the specific government portal cited (voters.eci.gov.in, onlineservices.nsdl.com, sarathi.parivahan.gov.in).
2. Fix the 2 missing pillar back-links: `pan-card-photo-size` → pillar, `driving-licence-photo-size-sarathi` → pillar.
3. Register a `govId` cluster entry in `lib/blog.ts`'s `CLUSTERS` map (pillar + 3 spokes) so `relatedPosts()` stops surfacing unrelated content on the pillar.
4. Add a before/after image to `/tools/sign-image/` (single biggest SXO gap on that page — Media dimension scored 2/15).
5. Complete the image-format conversion for the remaining 12 PNGs (WebP/AVIF), starting with the homepage one and the 3-4 highest-traffic blog posts.

### Needs a decision before shipping (real evidence, real risk if mishandled)
6. **Voter-ID title-vs-intent test.** SXO evidence says the title should signal "Resizer" not just "Size" to match SERP consensus — but this exact template has a documented failed title-override experiment. Recommend: test on `voter-id` alone (highest-traffic exam page, most data to read a verdict from) with a 2-3 week GSC watch window before considering a template-wide change. **Do not roll out to all 50 pages pre-emptively.**
7. Resolve the passport-post duplication (`indian-passport-photo-requirements` vs `indian-passport-photo-size-rules`) — pick a canonical, cross-link the other as a companion angle, or merge.
8. Decide on `how-to-sign-on-image-online`: expand to blog-post depth, or intentionally reclassify as a lighter tool-support page.

### Backlog / lower priority
9. IndexNow implementation (cheap, still not done).
10. Build `/exam-requirements/aadhaar/` for pattern parity with the other 3 IDs (Aadhaar isn't in `PORTAL_KEYS`).
11. Author `jobTitle` wording refresh.
12. Full 50-page programmatic-duplication ratio check (deferred from content audit).

---

## Limitations
No fresh Lighthouse/PSI lab run this cycle (CWV assessment is CrUX field data only, homepage-level). Schema and GEO categories carried forward from 06-18/06-23 baselines with only live presence re-verified, not deep validation. Backlinks remain Tier 0 (no Moz key) — insufficient data, unchanged. Visual audit incomplete for 3 of 5 pages (honest gap, not fabricated).
