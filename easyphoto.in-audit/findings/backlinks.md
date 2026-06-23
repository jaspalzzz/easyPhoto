# Backlink Profile — easyphoto.in

**Audit date:** 2026-06-20 (updated from 2026-06-18)
**Tier:** 0 (Common Crawl + Verification Crawler only)
**Score:** INSUFFICIENT DATA (0 of 7 scoring factors have usable data)
**Validator:** PASS (0 errors, 0 warnings)

---

## Data Source Coverage

| Source | Status | Confidence | Freshness |
|--------|--------|-----------|-----------|
| Common Crawl web graph (cc-main-2026-jan-feb-mar) | No data — domain absent | 0.50 | Quarterly (Jan–Mar 2026) |
| CC CDX — CC-MAIN-2025-51 | No captures found | 0.50 | Nov 2025 |
| CC CDX — CC-MAIN-2025-47 | No captures found | 0.50 | Oct 2025 |
| CC CDX — CC-MAIN-2025-43 | No captures found | 0.50 | Sep 2025 |
| Wayback Machine CDX | Found — 4 captures, all parking pages | 0.95 | Near-realtime |
| Backlink Verification Crawler | Not run — no links to verify | 0.95 | N/A |
| Moz Link Explorer | Not configured | — | ~3 days |
| Bing Webmaster Tools | Not configured | — | Near-realtime |
| DataForSEO | Not configured | — | Near-realtime |

---

## Domain History (Wayback Machine — confidence: 0.95)

| Snapshot Date | HTTP Status | Content Type |
|---------------|-------------|-------------|
| 2018-08-08 | 301 Redirect | Domain parking |
| 2018-08-28 | 200 OK | Domain parking (GoDaddy lander) |
| 2021-11-30 | 200 OK | Domain parking (GoDaddy/PW parking lander with Google AdSense) |
| 2023-03-08 | 200 OK | Domain parking (JS parking page) |

**Key conclusion:** All 4 archived snapshots confirm the domain was continuously parked between 2018 and at least March 2023 with no real site content. The current passport photo SaaS (launched ~2026-06-09) is this domain's first actual use. There is no legacy editorial backlink equity to inherit and no risk of toxic historical links carried over from a prior owner.

---

## Domain Metrics

| Metric | Value | Source | Rating |
|--------|-------|--------|--------|
| Referring domain count | 0 (not in graph) | CC (confidence: 0.50) | N/A |
| PageRank estimate | N/A | CC (confidence: 0.50) | N/A |
| Harmonic centrality | N/A | CC (confidence: 0.50) | N/A |
| Domain quality distribution | No data | — | N/A |
| Anchor text naturalness | No data | — | N/A |
| Toxic link ratio | No data | — | N/A |
| Link velocity trend | No data | — | N/A |
| Follow/nofollow ratio | No data | — | N/A |
| Geographic relevance | No data | — | N/A |

---

## Scoring

Fewer than 4 of 7 required factors have usable data (0 of 7 scored). Per Tier 0 rules, a numeric score is not reported. Reporting **INSUFFICIENT DATA** to avoid a misleading result.

| Factor (Weight) | Data Available | Score |
|----------------|---------------|-------|
| Referring domain count (20%) | No | — |
| Domain quality distribution (20%) | No | — |
| Anchor text naturalness (15%) | No | — |
| Toxic link ratio (20%) | No | — |
| Link velocity trend (10%) | No | — |
| Follow/nofollow ratio (5%) | No | — |
| Geographic relevance (10%) | No | — |

**Final score: INSUFFICIENT DATA**

---

## Findings

### What Was Confirmed

- Site is live and returns HTTP 200 (verified 2026-06-18).
- Platform: Next.js on Cloudflare (confirmed via `__next` HTML markers and `Server: cloudflare` response header).
- No external outbound links on the homepage (0 outbound `<a href>` tags pointing off-domain).
- Domain was parked from at least 2018 through March 2023. No real prior owner. No inherited backlinks — positive or toxic.

### Why CC Has No Data

easyphoto.in is absent from all checked Common Crawl data:

- The CC web graph release (cc-main-2026-jan-feb-mar) does not contain the domain. This graph covers pages crawled January–March 2026 — before the domain's June 2026 launch.
- CDX spot-checks of CC-MAIN-2025-51, -47, and -43 return "no captures found," which is consistent with the domain having been parked and not actively promoted in prior years.
- The domain will not appear in CC graph data until the next quarterly release, estimated September 2026.

This is a data gap caused by domain newness, not a signal of a problem. Absence from CC at day 11 is expected and normal.

---

## Issues

| Priority | Issue | Detail |
|----------|-------|--------|
| High | Domain absent from Common Crawl web graph | No PageRank, referring domain count, or top-linking domains available from any free source |
| High | 0 of 7 backlink health factors scoreable | Score cannot be computed; full analysis requires at least Moz API (Tier 1) |
| High | No Moz or Bing API configured | DA, PA, spam score, anchor text distribution, and link velocity data unavailable |
| Medium | No backlink profile established at day 11 | Expected for a new domain but requires proactive link-building to rank competitively |

---

## Recommendations

### Immediate (unlock real data)

1. **Add Moz API key (free tier: 2,500 rows/month)** — sign up at https://moz.com/products/api, then set `MOZ_API_KEY` env var. Re-run `/seo backlinks easyphoto.in` for DA, referring domain count, anchor text, and spam score within days of indexing.
2. **Add Bing Webmaster Tools API key (free)** — https://www.bing.com/webmasters. Provides near-realtime inbound link data and competitor gap analysis.
3. **DataForSEO extension** — for highest-fidelity data including link velocity: `./extensions/dataforseo/install.sh`.

### Link-Building Strategy

The domain targets Indian and global passport/document photo use cases. Priority vectors:

- **Government and exam portal references** — pages targeting Indian visa, UPSC, SSC, railway, and bank exam photo specs are natural candidates for links from government-adjacent education portals and coaching directories.
- **Travel and visa content sites** — travel blogs reviewing visa tools frequently link to photo utilities. ICAO compliance angle is differentiated.
- **Product Hunt / Indie Hackers listing** — free tool with strong privacy positioning (processed on-device) suits these communities and generates high-DA backlinks quickly.
- **Press / HARO outreach** — Indian tech press (Gadgets360, YourStory, Inc42) regularly covers free tools for common pain points. "Free ICAO-compliant passport photos without a studio visit" is a strong pitch.
- **Broken-link building** — identify Indian government and visa-guide sites that link to defunct passport photo services and pitch easyphoto.in as a replacement.
- **Technical content as link bait** — a page detailing exact photo specifications per document type (passport, Aadhaar, PAN, visa, exam admit card) attracts links from travel blogs, exam prep sites, and documentation portals.

### Cross-Skill Recommendations

- Run `/seo technical easyphoto.in` to check crawlability and indexability signals that affect how quickly CC and other crawlers discover the site.
- Run `/seo content easyphoto.in` for E-E-A-T signals — strong author/entity signals can accelerate trust-based link acquisition.

---

## Validator Output

```json
{
  "status": "PASS",
  "errors": 0,
  "warnings": 0,
  "checks_run": ["schema_claims", "verification_results", "h1_claims", "cc_claims", "reciprocal_links", "health_score"]
}
```

---

*Data sources: Common Crawl cc-main-2026-jan-feb-mar (domain-level, confidence: 0.50). CC CDX indexes CC-MAIN-2025-51/47/43 (confidence: 0.50). Wayback Machine CDX historical snapshots (confidence: 0.95). No Moz, Bing, or DataForSEO data available at this tier.*
