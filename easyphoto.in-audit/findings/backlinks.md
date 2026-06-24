# Backlink Profile — easyphoto.in

**Audit date:** 2026-06-23 (refreshed from 2026-06-20)
**Tier:** 0 (Common Crawl + Verification Crawler only)
**Score:** INSUFFICIENT DATA (0 of 7 scoring factors have usable data)
**Validator:** PASS (0 errors, 0 warnings)

---

## Backlink Profile (Common Crawl)

### Data Coverage

| Source | Status | Confidence | Freshness |
|--------|--------|-----------|-----------|
| Common Crawl web graph (cc-main-2026-jan-feb-mar) | No data — domain absent from crawl | 0.50 | Quarterly (Jan–Mar 2026) |
| Backlink Verification Crawler | Not run — no known links to verify | 0.95 | N/A |
| Moz Link Explorer | Not configured | — | ~3 days |
| Bing Webmaster Tools | Not configured | — | Near-realtime |
| DataForSEO | Not configured | — | Near-realtime |

**Root cause of data gap:** easyphoto.in was registered 2026-06-06 (GoDaddy). The most recent CC graph release (Jan–Mar 2026) predates the domain's existence by three months. The domain will not appear in any CC release until the next quarterly crawl, estimated September 2026. This is expected and is not a negative signal.

### Domain Metrics

| Metric | Value | Source | Rating |
|--------|-------|--------|--------|
| Referring domain count | 0 (not in graph) | CC cc-main-2026-jan-feb-mar (confidence: 0.50) | N/A |
| PageRank estimate | N/A | CC (confidence: 0.50) | N/A |
| Harmonic centrality | N/A | CC (confidence: 0.50) | N/A |
| Domain quality distribution | No data | — | N/A |
| Anchor text naturalness | No data | — | N/A |
| Toxic link ratio | No data | — | N/A |
| Link velocity trend | No data | — | N/A |
| Follow/nofollow ratio | No data | — | N/A |
| Geographic relevance | No data | — | N/A |
| Domain age | 17 days (registered 2026-06-06) | WHOIS via domain_history.py (confidence: 0.95) | Context only |
| Registrar | GoDaddy | WHOIS (confidence: 0.95) | — |
| Prior domain use | None — parked 2018–2023 (4 archived snapshots) | Previously verified via Wayback CDX (confidence: 0.95) | Clean (no toxic legacy links) |

### Top Referring Domains (if available)

No referring domains found. Common Crawl confirms 0 in-degree. This is consistent with a 17-day-old domain that has not yet been crawled by CC's quarterly pipeline.

No Moz, Bing, or DataForSEO data is available at Tier 0.

### Note: Score INSUFFICIENT DATA (limited sources)

Fewer than 4 of 7 required scoring factors have usable data. A numeric Backlink Health Score is not reported at this tier — doing so would be misleading.

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

## Domain History

| Snapshot | Content | Source |
|----------|---------|--------|
| 2018-08-08 | 301 redirect — GoDaddy parking | Wayback CDX (confidence: 0.95) |
| 2018-08-28 | 200 OK — GoDaddy parking lander | Wayback CDX (confidence: 0.95) |
| 2021-11-30 | 200 OK — parking page with Google AdSense | Wayback CDX (confidence: 0.95) |
| 2023-03-08 | 200 OK — JS parking page | Wayback CDX (confidence: 0.95) |
| 2026-06-06 | Domain registered (new) | WHOIS (confidence: 0.95) |
| 2026-06-09 | Passport photo SaaS launched | Internal context |

The domain was parked and unused from at least 2018 through early 2023. No prior owner, no editorial backlinks, no toxic legacy link profile. The current easyphoto.in SaaS is the domain's first real use.

---

## Issues

| Priority | Issue | Detail |
|----------|-------|--------|
| High | Domain absent from Common Crawl web graph | No PageRank, referring domain count, or top-linking domains retrievable from any free source |
| High | 0 of 7 backlink health factors scoreable | Score cannot be computed; Tier 1 (Moz) is the minimum required for a meaningful result |
| High | No Moz or Bing API configured | DA, PA, spam score, anchor text, and link velocity all unavailable |
| Medium | No established backlink profile at day 17 | Expected for a new domain; requires proactive outreach to rank competitively in a crowded niche |

---

## Recommendations

### Immediate — unlock real data

1. **Add Moz API key (free tier: 2,500 rows/month).** Sign up at https://moz.com/products/api, then set `MOZ_API_KEY` in the environment or add it to `/Users/apple/.config/claude-seo/backlinks-api.json`. Re-run `/seo backlinks easyphoto.in` once the site has been indexed to get DA, referring domain count, anchor text distribution, and spam score.
2. **Add Bing Webmaster Tools API key (free).** https://www.bing.com/webmasters — provides near-realtime inbound link data and a competitor gap comparison tool that Moz does not replicate at free tier.
3. **DataForSEO extension** for highest-fidelity link velocity, follow/nofollow ratio, and geographic data: `./extensions/dataforseo/install.sh`.

### Link-building strategy

The domain targets Indian and global passport/document photo use cases. Priority acquisition vectors ranked by expected DA return and feasibility:

| Priority | Vector | Rationale |
|----------|--------|-----------|
| 1 | Product Hunt / Indie Hackers listing | Free tool with on-device privacy angle — strong fit, high-DA links quickly |
| 2 | Indian travel and visa blogs | Frequently link to photo utilities; ICAO compliance is a differentiator |
| 3 | Government-adjacent exam/coaching portals | UPSC, SSC, railway, bank exam photo specs are natural anchors |
| 4 | Press outreach — Gadgets360, YourStory, Inc42 | "Free ICAO passport photo without a studio visit" is a strong tech-press pitch |
| 5 | Broken-link building on visa/travel guides | Replace dead links to defunct photo tools with easyphoto.in |
| 6 | Technical spec pages as link bait | Per-document photo spec pages (passport, Aadhaar, PAN, DL, exam admit card) attract links from travel blogs and prep sites organically |

### Cross-skill recommendations

- Run `/seo technical easyphoto.in` to verify crawlability and indexation signals — these determine how quickly future crawlers (CC, Moz, Bing) discover and add the site to their graphs.
- Run `/seo content easyphoto.in` for E-E-A-T analysis — strong entity signals accelerate trust-based link acquisition from authoritative sites.

---

## Validator Output

```json
{
  "status": "PASS",
  "errors": 0,
  "warnings": 0,
  "checks_run": [
    "schema_claims",
    "verification_results",
    "h1_claims",
    "cc_claims",
    "reciprocal_links",
    "health_score"
  ]
}
```

---

*Data sources: Common Crawl cc-main-2026-jan-feb-mar (domain-level, confidence: 0.50). WHOIS via domain_history.py (confidence: 0.95). Wayback Machine CDX historical snapshots from prior audit run (confidence: 0.95). No Moz, Bing, or DataForSEO data available at Tier 0.*
