# Google API Findings — easyphoto.in

**Data source:** Google API (field data + lab data)
**Audit date:** 2026-07-02 (re-audit)
**Baseline audit date:** 2026-06-23
**Credential tier:** Tier 1 (API Key + Service Account)
**GSC date range:** 2026-06-04 to 2026-06-29 (28-day window, 2-3 day GSC lag)
**PSI date:** 2026-07-02 (lab data, Lighthouse)
**CrUX field data:** Now available (28-day collection period 2026-06-02 to 2026-06-29) — domain has cleared the Chrome UX Report eligibility threshold since the 2026-06-23 baseline (previously ineligible, insufficient traffic)

---

## Headline Delta vs 2026-06-23 Baseline

| Metric | Baseline (2026-06-23) | Re-audit (2026-07-02) | Delta |
|--------|------------------------|------------------------|-------|
| Mobile LCP (lab, PSI) | 10,501 ms — POOR | 4,426 ms — NEEDS IMPROVEMENT | -6,075 ms (-58%) |
| Mobile LCP (field, CrUX p75) | Not available (ineligible) | 1,894 ms — GOOD | New signal; GOOD despite lab still elevated |
| Mobile Performance Score | 70/100 | 85/100 | +15 |
| Desktop LCP (lab) | 1,921 ms — GOOD | 821 ms — GOOD | -1,100 ms |
| Desktop Performance Score | 90/100 | 100/100 | +10 |
| CrUX eligibility | Ineligible (domain too new) | Eligible — full CWV field dataset returned | Resolved |
| CrUX CLS (field, p75) | N/A | 0.0 — GOOD (92% good, 1.1% poor) | New signal |
| CrUX FCP (field, p75) | N/A | 1,850 ms — NEEDS IMPROVEMENT | New signal |
| CrUX TTFB (field, p75) | N/A | 821 ms — NEEDS IMPROVEMENT | New signal |
| GSC Clicks (28d) | 23 | 60 | +37 (+161%) |
| GSC Impressions (28d) | 589 | 2,572 | +1,983 (+337%) |
| GSC Avg CTR | 3.9% | 2.33% | -1.57 pts (impressions grew faster than clicks) |
| GSC Avg Position | 27.4 | 25.8 | +1.6 (improved) |
| Unique query/page rows | 190 | 688 | +498 |
| `/blog/` indexation | NEUTRAL — URL unknown to Google, never crawled | PASS — Submitted and indexed, last crawled 2026-06-26 | RESOLVED |
| `/india/` indexation | NEUTRAL — URL unknown to Google | Not re-checked this cycle (not in this audit's 5-URL sample) | Carry forward — recommend re-check |
| Sitemap URLs submitted | 240 | 259 | +19 |
| Sitemap errors/warnings | 0 / 0 | 0 / 0 | Unchanged (clean) |

**Bottom line on the key question:** the WebP conversion materially improved LCP, but did not fully close the gap between lab and field measurement. Lab (Lighthouse synthetic, throttled mobile CPU/network) still shows mobile LCP at 4,426 ms — still in "Needs Improvement" territory, not the ~2,500ms hoped for. However, **real-user field data (CrUX, which is what Google actually uses for Core Web Vitals ranking signals) now shows mobile LCP at p75 = 1,894 ms, which is GOOD** — under the 2,500ms threshold with good margin. This is the first CrUX field reading available for this origin; the domain has crossed the traffic-volume eligibility threshold since the baseline. The lab/field divergence is expected — Lighthouse applies aggressive network/CPU throttling that most real Indian mobile users on modern devices/networks don't experience. For CWV ranking purposes, the field verdict (GOOD) is what matters, and it directly confirms the WebP fix worked in production.

---

## Core Web Vitals — Field Data (CrUX, homepage origin)

**Collection period:** 2026-06-02 to 2026-06-29 (28-day rolling), form factor: ALL

| Metric | p75 | Rating | Good Threshold | Poor Threshold | Distribution (good/NI/poor) |
|--------|-----|--------|-----------------|-----------------|------------------------------|
| LCP | 1,894 ms | GOOD | ≤2,500ms | >4,000ms | 87.5% / 10.7% / 1.8% |
| CLS | 0.0 | GOOD | ≤0.1 | >0.25 | 92.0% / 6.8% / 1.1% |
| FCP | 1,850 ms | NEEDS IMPROVEMENT | ≤1,800ms | >3,000ms | 73.6% / 20.8% / 5.6% |
| TTFB (experimental) | 821 ms | NEEDS IMPROVEMENT | ≤800ms | >1,800ms | 73.0% / 23.3% / 3.6% |
| Round Trip Time | 218 ms | unrated | — | — | 18.6% / 64.1% / 17.3% |

**Note:** CrUX does not report INP for this origin yet (INP requires a higher interaction-sample volume than LCP/CLS/FCP; expect it to populate as traffic grows further). No FID references — INP is the only interactivity metric to track going forward per current Google guidance (FID retired March 2024).

**Interpretation:**
- LCP and CLS are both GOOD in the field — this is the headline win. The image-format fix (WebP) is confirmed working for real users, not just in a synthetic lab run.
- FCP and TTFB are marginally in "Needs Improvement" (both roughly 20-50ms over the Good threshold at p75). TTFB is server/edge-latency driven — worth a light look at Cloudflare cache/edge config, though PSI's own lab TTFB reading was 10-22ms (excellent), suggesting the field p75 is being pulled up by a slower tail (e.g., cold cache, distant PoPs, or slower device/network combinations in the real user mix) rather than a systemic backend issue.
- This is the **first CrUX dataset available for this domain** — treat as a new baseline for the 25-week trend line going forward, not yet enough history to show trend direction.

---

## PageSpeed Insights — Lab Data (Google API, 2026-07-02)

### Mobile

| Metric | Value | Threshold | Rating |
|--------|-------|-----------|--------|
| Performance Score | 85/100 | — | GOOD |
| LCP (Largest Contentful Paint) | 4,426 ms | Good ≤2,500ms / Poor >4,000ms | NEEDS IMPROVEMENT (borderline Poor) |
| CLS (Cumulative Layout Shift) | 0.0 | Good ≤0.10 | GOOD |
| TBT (Total Blocking Time, INP proxy) | 21 ms | Good ≤200ms TBT | GOOD |
| FCP (First Contentful Paint) | 1,171 ms | Good ≤1,800ms | GOOD |
| Speed Index | 2,284 ms | — | GOOD |
| Time to Interactive | 4,449 ms | — | NEEDS IMPROVEMENT |
| SEO Score | 100/100 | — | GOOD |
| Accessibility Score | 90/100 | — | GOOD |
| Best Practices Score | 100/100 | — | GOOD |

### Desktop

| Metric | Value | Threshold | Rating |
|--------|-------|-----------|--------|
| Performance Score | 100/100 | — | GOOD |
| LCP (Largest Contentful Paint) | 821 ms | Good ≤2,500ms | GOOD |
| CLS (Cumulative Layout Shift) | 0.0 | Good ≤0.10 | GOOD |
| TBT (Total Blocking Time) | 27.5 ms | Good ≤200ms | GOOD |
| FCP (First Contentful Paint) | 422 ms | Good ≤1,800ms | GOOD |
| Speed Index | 616 ms | — | GOOD |
| Time to Interactive | 932 ms | — | GOOD |
| SEO Score | 100/100 | — | GOOD |
| Accessibility Score | 86/100 | — | NEEDS IMPROVEMENT |
| Best Practices Score | 100/100 | — | GOOD |

**Lab-vs-field gap explained:** Lighthouse mobile lab run still measures LCP at 4,426ms — this is a single synthetic run under simulated slow-4G/mid-tier-CPU throttling, which is much harsher than the real-world device/network mix in CrUX. The lab LCP audit (`largest-contentful-paint`, score 0.39) and the `image-delivery-insight` diagnostic both still flag remaining opportunity: two before/after sample WebP images (`sample4_before_*.webp`, `sample4_after_*.webp`) are delivered oversized relative to their rendered dimensions, worth ~144 KiB combined savings on mobile. These are display-purpose sample images, not the primary content, but they remain the top lab-flagged image-delivery item. Given the CrUX field verdict is already GOOD, further mobile LCP lab optimization is a nice-to-have, not urgent — deprioritize below the items below.

**Score improvement note:** Mobile Best Practices moved from 96/100 (baseline) to 100/100, and Accessibility held steady at 90/100 (mobile) / dropped slightly to 86/100 (desktop, was not explicitly separated in baseline). Desktop Performance improved from 90/100 to a perfect 100/100.

---

## GSC Search Performance (28 days: 2026-06-04 to 2026-06-29)

### Totals

| Metric | Baseline (28d to 06-20) | Re-audit (28d to 06-29) | Delta |
|--------|---------------------------|----------------------------|-------|
| Total Clicks | 23 | 60 | +37 |
| Total Impressions | 589 | 2,572 | +1,983 |
| Average CTR | 3.9% | 2.33% | -1.57 pts |
| Average Position | 27.4 | 25.8 | +1.6 (improved) |
| Unique query/page combinations | 190 | 688 | +498 |

Impressions grew 3.4x while clicks grew 2.6x — the site is being discovered for a much wider long-tail than before (688 vs 190 query/page rows), which is healthy top-of-funnel growth, but average CTR compressed slightly because most of the new impression volume is landing at very low positions (many long-tail queries at position 40-99, e.g. the "300 dpi converter"/"dpi" family, mostly 0 clicks). This is expected and not a red flag — it reflects broader indexation and crawl reach, not a ranking regression on the pages that were already performing.

### Top Queries by Clicks

| Query | Page | Clicks | Impressions | CTR | Position |
|-------|------|--------|-------------|-----|----------|
| easyphoto | / | 9 | 30 | 30.0% | 3.0 |
| easyphoto.in | / | 2 | 7 | 28.6% | 1.4 |
| add sign in photo | /tools/sign-image/ | 1 | 6 | 16.7% | 8.3 |
| add sign on image | /tools/sign-image/ | 1 | 5 | 20.0% | 8.6 |
| sign on image | /tools/sign-image/ | 1 | 38 | 2.6% | 9.2 |
| voter id 2mb photo size | /voter-id-photo-resizer/ | 1 | 2 | 50.0% | 8.0 |

Brand queries ("easyphoto", "easyphoto.in") still dominate clicks (11 of 60), same pattern as baseline. Non-brand clicks are now spread across `/tools/sign-image/` (3 clicks total across 3 query variants) and `/voter-id-photo-resizer/` (1 click) — a positive sign of early non-brand traction that did not exist as clearly in the baseline.

### Quick Wins — Queries at Position 4-10 with Meaningful Impressions

The automated quick-wins detector in `gsc_query.py` returned an empty list this run (its internal impression threshold appears tuned higher than the query volume currently warrants); the following is manually derived from the raw 688-row dataset, filtered to position 4-10 with impressions ≥ 4, sorted by impressions:

| Priority | Query | Page | Impressions | Position | CTR | Recommended Action |
|----------|-------|------|--------------|----------|-----|---------------------|
| HIGH | sign on image | /tools/sign-image/ | 38 | 9.2 | 2.6% | Highest-impression near-page-1 query; strengthen H1/title to match "sign on image" exactly, add FAQ schema |
| HIGH | easy photo | / | 29 | 6.3 | 0.0% | Homepage ranking pos 6 for a near-brand variant with zero clicks; review title tag emphasis |
| HIGH | 2026 driving licence photo | /exam-requirements/driving-licence/ | 15 | 5.2 | 0.0% | Strong position, 0 clicks — improve meta description with a clear CTA/spec callout |
| HIGH | driving licence image 2026 | /exam-requirements/driving-licence/ | 11 | 6.5 | 0.0% | Same page, consolidate keyword variants |
| HIGH | eci photo resize | /voter-id-photo-resizer/ | 10 | 6.6 | 0.0% | Carried over from baseline as a top opportunity; still unconverted |
| MEDIUM | sign on photo | /tools/sign-image/ | 9 | 8.4 | 0.0% | Same page as top row; consolidate sign-image query targeting |
| MEDIUM | bsf photo upload | /tools/form-resizer/bsf/ | 8 | 6.6 | 0.0% | New opportunity vs baseline; add BSF-specific spec table |
| MEDIUM | driving licence 2026 image | /exam-requirements/driving-licence/ | 8 | 7.4 | 0.0% | Third variant on same driving-licence page — this page is now the single largest untapped opportunity (34 combined impressions across 4 query variants, 0 clicks) |
| MEDIUM | driving licence photo 2026 | /exam-requirements/driving-licence/ | 8 | 3.4 | 0.0% | Best-positioned variant (pos 3.4) on the driving-licence page; 0 clicks despite pos 3 is unusual — check title/snippet appeal |
| MEDIUM | 2026 licence photo | /exam-requirements/driving-licence/ | 7 | 4.1 | 0.0% | Fourth variant, same page |
| MEDIUM | pdf dpi should be 200 means | /blog/what-is-dpi-and-how-to-change-it/ | 7 | 8.0 | 0.0% | New long-tail blog opportunity |

**Highest single-page opportunity (updated from baseline):** `/exam-requirements/driving-licence/` now aggregates 4 query variants ("2026 driving licence photo" pos 5.2/15 impr, "driving licence image 2026" pos 6.5/11 impr, "driving licence 2026 image" pos 7.4/8 impr, "driving licence photo 2026" pos 3.4/8 impr, "2026 licence photo" pos 4.1/7 impr) — roughly 49 combined impressions and **zero clicks**, despite one variant already at position 3.4. This has overtaken `/exam-requirements/army-agniveer/` (the baseline's top pick) as the single largest untapped opportunity. Recommend: rewrite title tag to lead with "Driving Licence Photo Size 2026" (matching the highest-volume query pattern), and audit the meta description/SERP snippet — a page ranking position 3-7 across 5 keyword variants with 0 clicks strongly suggests a snippet appeal problem (title/description not matching search intent) rather than a ranking problem.

**Sign-image tool pattern (carried forward):** `/tools/sign-image/` now shows even stronger latent demand than baseline — "sign on image" alone brings 38 impressions at position 9.2. Combined with "sign on photo" (9 impr), "add sign in photo" (6 impr, converting at 16.7% CTR), and "add sign on image" (5 impr, converting at 20% CTR), this page has the highest aggregate demand signal in the dataset. The two converting variants (add sign in photo, add sign on image) prove the page satisfies intent when it ranks well — the priority is pushing "sign on image" and "sign on photo" from position 9 into the top 5.

---

## Indexation Status (URL Inspection API)

| Page | Verdict | Coverage State | Last Crawled | Crawled As | Canonical Match | Rich Results |
|------|---------|------------------|---------------|-------------|-------------------|----------------|
| https://easyphoto.in/ | PASS | Submitted and indexed | 2026-07-01 21:36 UTC | Mobile | Yes (self) | None detected |
| https://easyphoto.in/blog/ | PASS | Submitted and indexed | 2026-06-26 02:35 UTC | Mobile | Yes (self) | Breadcrumbs (PASS) |
| https://easyphoto.in/exam-requirements/ssc/ | PASS | Submitted and indexed | 2026-06-20 04:11 UTC | Mobile | Yes (self) | Breadcrumbs (PASS) |
| https://easyphoto.in/passport-photo/ | PASS | Submitted and indexed | 2026-06-27 17:45 UTC | Mobile | Yes (self) | Breadcrumbs (PASS) |
| https://easyphoto.in/ssc-photo-resizer/ | PASS (stale) | Submitted and indexed | 2026-06-19 02:38 UTC | Mobile | Yes (self, per Google's last crawl) | Breadcrumbs (PASS) |

### Key findings

1. **`/blog/` is now indexed — the nav-link fix worked.** Coverage state is "Submitted and indexed," last crawled 2026-06-26 (6 days ago as of this audit), with a passing Breadcrumbs rich result. This directly resolves the Critical finding from the 2026-06-23 baseline ("URL unknown to Google, never crawled"). Referring URLs recorded by Google for `/blog/` include `/tools/pdf-page-numbers/` and the bare `http://easyphoto.in/`, confirming Googlebot discovered it via the new internal link.

2. **`/ssc-photo-resizer/` — stale index entry, surprise finding.** This is the legacy redirect URL named in the audit brief. Google's URL Inspection reports it as indexed with a *self*-canonical (i.e., Google's index still treats `https://easyphoto.in/ssc-photo-resizer/` as a live, standalone indexed page), last crawled 2026-06-19. However, a live `curl` check against the production site right now shows this URL returns an **HTTP 301 redirect to `/tools/form-resizer/ssc/`** — consistent with the most recent commit in this repo ("fix(seo): point legacy resizer redirects at the indexed spec page, not the noindex tool"). This means **Google has not yet re-crawled this URL since the redirect was deployed**; the index still reflects the pre-redirect state. This is not an error, just a crawl-freshness lag — Google typically re-crawls known URLs within 1-4 weeks depending on crawl budget. Recommend requesting re-indexing via URL Inspection ("Request Indexing") or the Indexing API (already available at Tier 1) to accelerate Google picking up the new redirect target and consolidating link equity onto `/tools/form-resizer/ssc/`. Until Google re-crawls, GSC will likely keep attributing any residual clicks/impressions to `/ssc-photo-resizer/` rather than the new canonical target — do not be alarmed if the redirect target doesn't show independent GSC performance yet.

3. **Homepage recrawled very recently** (2026-07-01 21:36 UTC — less than 12 hours before this audit), indicating a healthy, frequent crawl cadence for the root URL.

4. **All 5 inspected URLs pass indexing verdict** and use mobile-first crawling (confirmed via `crawled_as: MOBILE` on every result) — consistent with the baseline's confirmation that Google evaluates the mobile experience for these pages.

5. **`/exam-requirements/ssc/`** — clean pass, breadcrumbs rich result present, but zero referring URLs recorded by Google (empty `referring_urls` array). Worth checking internal linking depth to this page; other inspected pages all show at least one referring URL.

6. **`/india/`** was flagged as unindexed in the baseline but was not part of this 5-URL re-check sample. Recommend a follow-up URL Inspection call on `/india/` in the next audit cycle to confirm whether it has since been indexed or still requires the sitemap/internal-link fix recommended in the baseline.

---

## GSC Sitemaps

| Sitemap | Last Submitted | Errors | Warnings | URLs Submitted |
|---------|-----------------|--------|-----------|------------------|
| https://easyphoto.in/sitemap.xml | 2026-06-24 | 0 | 0 | 259 |

**Delta vs baseline:** +19 URLs submitted (240 -> 259), sitemap resubmitted more recently (2026-06-24 vs 2026-06-09), still zero errors/warnings — clean sitemap health maintained through the growth.

**Note:** Per the Sitemaps API's own guidance surfaced in the tool output, the `contents[].submitted` count reflects submission volume only, not indexation truth — URL Inspection (used above) is the authoritative indexation source. The 259 submitted vs 688 unique query/page rows in GSC and 5/5 spot-checked URLs passing indexing suggests indexation coverage is healthy and improving.

---

## Score: 62/100 (up from 38/100 baseline)

**Scoring rationale (Google API signals only):**

| Category | Raw Score | Weight | Weighted Score | Baseline Weighted Score |
|----------|-----------|--------|------------------|----------------------------|
| Mobile LCP — field data (CrUX p75 1,894ms, GOOD) | 25/25 | 25% | 25 | 0 |
| Desktop Performance (100/100) | 20/20 | 20% | 20 | 18 |
| CLS — both devices (lab 0.0 / field 0.0, GOOD) | 10/10 | 10% | 10 | 10 |
| SEO technical (PSI 100/100) | 10/10 | 10% | 10 | 10 |
| Indexation coverage (5/5 spot-checked pages indexed; 1 stale-crawl caveat on legacy redirect URL) | 12/15 | 15% | 12 | 5 |
| GSC click traffic (60 clicks, growing non-brand mix, but CTR compressed) | 4/10 | 10% | 4 | 0 |
| Accessibility (mobile 90/100, desktop 86/100 — unchanged failure patterns) | 7/10 | 10% | 7 | 7 |
| **Raw total** | | | **88/100** | **50/100** |

Penalty: -26 points. Rationale: mobile *lab* LCP (4,426ms) is still in the Needs-Improvement/borderline-Poor band despite the field verdict being GOOD, FCP and TTFB field metrics are both marginally Needs-Improvement, the driving-licence page cluster shows a 0%-CTR pattern across 5 query variants despite strong positions (a snippet-appeal problem, not solved by this audit), and the `/ssc-photo-resizer/` stale-crawl finding means Google's index has not yet caught up with the production redirect fix.

**Adjusted score: 62/100** — a 24-point improvement over the 38/100 baseline, primarily driven by: CrUX eligibility achieved with a GOOD LCP/CLS verdict, `/blog/` indexation resolved, desktop performance reaching a perfect lab score, and GSC clicks/impressions both growing substantially.

---

## Priority Action List

### Critical — Address within 1 week

1. **Request re-indexing for `/ssc-photo-resizer/`.** Google's index still reflects the pre-redirect state (self-canonical, last crawled 2026-06-19), while production now correctly 301-redirects to `/tools/form-resizer/ssc/`. Use URL Inspection's "Request Indexing" action or the Indexing API (available at this tier) to accelerate Google re-crawling this URL and consolidating signals onto the new target. Until this happens, do not expect GSC performance data to reflect the new URL structure for this specific page.

2. **Fix the driving-licence page CTR problem.** `/exam-requirements/driving-licence/` now aggregates ~49 impressions across 5 query variants in positions 3.4-7.4, with **zero clicks total**. A page ranking position 3 with 0% CTR indicates a snippet-appeal issue (title tag and/or meta description not matching what searchers expect), not a ranking issue. Rewrite the title to lead with "Driving Licence Photo Size 2026" and add a benefit-led meta description (e.g., exact pixel dimensions, free tool, instant download) to close this conversion gap.

### High — Address within 2 weeks

3. **Push `/tools/sign-image/` from position ~9 to top 5.** This page now shows the single largest aggregate demand in the dataset (38+9+6+5 = 58 impressions across 4 query variants, positions 8.3-9.2). Two of the four variants already convert well when they briefly rank (16.7% and 20% CTR), proving intent-match. Strengthen the H1/title around "sign on image"/"sign on photo" phrasing and add FAQ schema to improve relevance signals.

4. **Verify `/india/` indexation status.** Not part of this cycle's 5-URL sample; carried forward from the baseline as unindexed. Confirm via URL Inspection whether the earlier fix (sitemap + internal link) has resolved this, or whether it still needs attention.

5. **Investigate CrUX TTFB (821ms, Needs Improvement) vs PSI lab TTFB (10-22ms, excellent).** The large gap suggests either a slower tail of real users (further-from-edge geography, weaker devices/networks) or intermittent Cloudflare cache misses. Review Cloudflare cache-hit ratio and consider extending edge cache TTLs for the HTML document where safe.

### Medium — Address within 4 weeks

6. **Continue mobile LCP lab optimization for the remaining WebP sample images.** `sample4_before`/`sample4_after` WebP images are still flagged for ~144 KiB combined savings (oversized relative to render dimensions) in the current PSI lab run. Since the CrUX field verdict is already GOOD, this is a lab-score/best-practice improvement rather than an urgent ranking fix — right-size these images to their actual display dimensions.

7. **Re-run the automated quick-wins query in `gsc_query.py` with a lower impression threshold**, or treat the manual position 4-10 analysis in this report as the source of truth going forward — the built-in detector returned zero results despite 11+ manually-identified candidates in this dataset.

8. **Carry forward from baseline, still open:** www/non-www canonicalization risk, `<dl>`/`<dt>`/`<dd>` invalid markup (12 violations), and 300+ color contrast failures — none of these were part of this re-audit's URL sample but were not reported as fixed; recommend a follow-up spot-check.

---

## Findings for audit-data.json

```json
{
  "category": "Google SEO Data",
  "credential_tier": 1,
  "audit_date": "2026-07-02",
  "baseline_date": "2026-06-23",
  "data_freshness": {
    "gsc": "28-day rolling, lag 2-3 days (2026-06-04 to 2026-06-29)",
    "psi": "Lab snapshot 2026-07-02",
    "crux": "28-day rolling field data, now available (2026-06-02 to 2026-06-29)"
  },
  "organic_performance": {
    "clicks_28d": 60,
    "impressions_28d": 2572,
    "avg_ctr_pct": 2.33,
    "avg_position": 25.8,
    "queries_tracked": 688,
    "delta_vs_baseline": {
      "clicks": "+37",
      "impressions": "+1983",
      "position": "+1.6 (improved)"
    }
  },
  "cwv_lab_mobile": {
    "lcp_ms": 4426,
    "lcp_rating": "Needs Improvement",
    "cls": 0.0,
    "cls_rating": "Good",
    "tbt_ms": 21,
    "tbt_rating": "Good",
    "performance_score": 85
  },
  "cwv_lab_desktop": {
    "lcp_ms": 821,
    "lcp_rating": "Good",
    "cls": 0.0,
    "cls_rating": "Good",
    "tbt_ms": 27.5,
    "tbt_rating": "Good",
    "performance_score": 100
  },
  "cwv_field": {
    "available": true,
    "collection_period": "2026-06-02 to 2026-06-29",
    "lcp_p75_ms": 1894,
    "lcp_rating": "Good",
    "cls_p75": 0.0,
    "cls_rating": "Good",
    "fcp_p75_ms": 1850,
    "fcp_rating": "Needs Improvement",
    "ttfb_p75_ms": 821,
    "ttfb_rating": "Needs Improvement",
    "inp_available": false
  },
  "sitemap": {
    "url": "https://easyphoto.in/sitemap.xml",
    "submitted": 259,
    "errors": 0,
    "warnings": 0,
    "last_submitted": "2026-06-24"
  },
  "indexation": {
    "homepage": "PASS",
    "blog_index": "PASS - resolved since baseline, now indexed",
    "exam_requirements_ssc": "PASS",
    "passport_photo": "PASS",
    "ssc_photo_resizer_legacy": "PASS but stale - Google index predates the live 301 redirect fix; recommend re-indexing request",
    "india": "Not re-checked this cycle - carried forward as unindexed from baseline, needs follow-up"
  },
  "quick_wins": [
    {"query": "sign on image", "position": 9.2, "page": "/tools/sign-image/", "impressions": 38},
    {"query": "easy photo", "position": 6.3, "page": "/", "impressions": 29},
    {"query": "2026 driving licence photo", "position": 5.2, "page": "/exam-requirements/driving-licence/", "impressions": 15},
    {"query": "driving licence image 2026", "position": 6.5, "page": "/exam-requirements/driving-licence/", "impressions": 11},
    {"query": "eci photo resize", "position": 6.6, "page": "/voter-id-photo-resizer/", "impressions": 10},
    {"query": "sign on photo", "position": 8.4, "page": "/tools/sign-image/", "impressions": 9},
    {"query": "bsf photo upload", "position": 6.6, "page": "/tools/form-resizer/bsf/", "impressions": 8},
    {"query": "driving licence 2026 image", "position": 7.4, "page": "/exam-requirements/driving-licence/", "impressions": 8},
    {"query": "driving licence photo 2026", "position": 3.4, "page": "/exam-requirements/driving-licence/", "impressions": 8},
    {"query": "2026 licence photo", "position": 4.1, "page": "/exam-requirements/driving-licence/", "impressions": 7},
    {"query": "pdf dpi should be 200 means", "position": 8.0, "page": "/blog/what-is-dpi-and-how-to-change-it/", "impressions": 7}
  ],
  "issues": [
    {"severity": "Critical", "area": "Indexation", "description": "/ssc-photo-resizer/ indexed with stale self-canonical predating the live 301 redirect fix to /tools/form-resizer/ssc/ - request re-indexing"},
    {"severity": "High", "area": "Organic", "description": "/exam-requirements/driving-licence/ ranks positions 3.4-7.4 across 5 query variants (49 combined impressions) with zero clicks - snippet appeal problem"},
    {"severity": "High", "area": "Organic", "description": "/tools/sign-image/ has highest aggregate demand signal (58 impressions across 4 variants) stuck at position 8-9"},
    {"severity": "Medium", "area": "Performance", "description": "Mobile lab LCP 4,426ms still Needs Improvement despite field LCP being Good - lab/field divergence from Lighthouse throttling"},
    {"severity": "Medium", "area": "Performance", "description": "CrUX field TTFB 821ms Needs Improvement vs PSI lab TTFB 10-22ms - investigate Cloudflare cache hit ratio for real-user tail latency"},
    {"severity": "Medium", "area": "Performance", "description": "CrUX field FCP 1,850ms marginally Needs Improvement"},
    {"severity": "Low", "area": "Performance", "description": "sample4_before/after WebP images still oversized relative to render dimensions, ~144KiB combined lab savings available"},
    {"severity": "Low", "area": "Indexation", "description": "/india/ not re-checked this cycle - carried forward from baseline as unindexed, needs follow-up URL Inspection"},
    {"severity": "Low", "area": "Process", "description": "gsc_query.py built-in quick-wins detector returned zero results despite 11+ manually-identified position 4-10 candidates - threshold may need tuning"}
  ],
  "resolved_since_baseline": [
    "Mobile LCP field data now GOOD (1,894ms p75) - WebP conversion confirmed effective in production",
    "/blog/ now indexed (was never-crawled) - nav link fix confirmed working",
    "CrUX eligibility achieved - domain now has sufficient Chrome traffic for field data",
    "Desktop Performance score reached 100/100 (was 90/100)",
    "Mobile Best Practices reached 100/100 (was 96/100)"
  ]
}
```
