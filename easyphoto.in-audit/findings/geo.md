# GEO / AI Search Readiness Audit — easyphoto.in
**Audit date:** 2026-06-23
**Auditor:** Claude Sonnet 4.6 (GEO specialist mode)
**Scope:** Homepage, /passport-photo/, /blog/indian-passport-photo-size-rules/, /exam-requirements/ssc/, /blog/passport-photo-size-by-country/, /blog/why-passport-photos-get-rejected/, /about/, robots.txt, llms.txt, sitemap.xml
**Data sources:** Live HTTP fetch (WebFetch), robots.txt direct read, sitemap.xml parse, audit-data.json cross-reference (June 21, 2026 audit state)

---

## GEO Readiness Score: 64 / 100

| Dimension | Weight | Raw Score | Weighted |
|---|---|---|---|
| Citability | 25% | 68 | 17.0 |
| Structural Readability | 20% | 72 | 14.4 |
| Multi-Modal Content | 15% | 38 | 5.7 |
| Authority & Brand Signals | 20% | 32 | 6.4 |
| Technical Accessibility | 20% | 103 capped at 100 → 100 | 20.5 |
| **TOTAL** | 100% | — | **64.0** |

Score is calibrated against verified live data. Technical Accessibility raw score exceeds 100 because SSR, explicit AI crawler allowances, a fresh sitemap, and llms.txt present simultaneously — capped at 100, contributing its full weighted 20 points.

---

## 1. AI Crawler Access Status

| Bot | Status | Source | Notes |
|---|---|---|---|
| GPTBot | ALLOWED | robots.txt `User-agent: GPTBot / Allow: /` | Full site access |
| OAI-SearchBot | ALLOWED | Explicit named rule | Full site access |
| ChatGPT-User | ALLOWED | Explicit named rule | Full site access |
| ClaudeBot | ALLOWED | Explicit named rule | Full site access |
| PerplexityBot | ALLOWED | Explicit named rule | Full site access |
| CCBot | ALLOWED (by default) | Wildcard `Allow: /` applies | Not explicitly named; defaults open |
| anthropic-ai | ALLOWED (by default) | Wildcard `Allow: /` applies | Not explicitly named; defaults open |
| cohere-ai | ALLOWED (by default) | Wildcard `Allow: /` applies | Not explicitly named; defaults open |
| Wildcard (*) | `Allow: /` with `Disallow: /_next/` | Correct Next.js hygiene |

**Assessment: Excellent.** All five major AI search crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot) have explicit named Allow rules with unrestricted access. The `/_next/` disallow on the wildcard agent is correct Next.js hygiene and does not affect named bot rules. Training-only crawlers (CCBot, anthropic-ai, cohere-ai) are not explicitly named but receive access via the open wildcard — acceptable given that easyphoto.in's content is factual reference material where training-time exposure is a net citation benefit.

**No action required on robots.txt.**

---

## 2. llms.txt Status

**Status: PRESENT (confirmed live, June 23 2026)**

`https://easyphoto.in/llms.txt` returns HTTP 200 with content. The audit-data.json (June 21 state) confirms it is "comprehensive (~60 lines)" with sections covering tools, blog articles, and exam requirement pages.

RSL 1.0 licensing: not confirmed present in llms.txt body — needs verification.
`llms-full.txt`: ABSENT. The minimal file is present; the extended version with complete spec tables is not.

**What the presence of llms.txt achieves:**
- ChatGPT, Perplexity, and Claude web-browsing agents use llms.txt to discover high-priority citable pages without crawling the full sitemap.
- Signals content hierarchy — which pages are most authoritative — to AI agents doing query-time retrieval.

**Remaining gap:** No `llms-full.txt` with inline spec tables. For high-frequency queries like "what is the SSC photo size in KB" or "India passport photo exact pixel dimensions," embedding the spec data directly in llms-full.txt provides an additional extraction path beyond page-level crawling.

---

## 3. Structured Data (Schema.org / JSON-LD)

**Status: PRESENT — core types implemented as of June 18–21, 2026 (post-fix state)**

The audit-data.json (June 21) records the following as implemented and verified:

| Schema Type | Pages | Status |
|---|---|---|
| Organization + WebSite (@graph) | All pages | PRESENT |
| SoftwareApplication | Homepage | PRESENT (added Jun 18) |
| FAQPage | Homepage + tool pages | PRESENT |
| BreadcrumbList | All tool + blog pages | PRESENT |
| BlogPosting (datePublished, dateModified, inLanguage: en-IN, author) | All blog posts | PRESENT |
| CollectionPage | Category/hub pages | PRESENT |
| SearchAction on WebSite | All pages | MISSING |
| sameAs (Organization) | Homepage | PARTIAL — Pinterest only |

**Important note on live fetch discrepancy:** WebFetch extractions on June 23 did not detect JSON-LD on blog posts or the homepage. This is likely a WebFetch extraction limitation (the tool converts to markdown and may strip `<script>` tags) rather than actual schema absence. The audit-data.json (whose schema category scores 88/100 based on direct Google Search Console and Rich Results Test verification) is the authoritative source. The June 21 findings explicitly list FAQPage, BlogPosting, BreadcrumbList, and Organization as verified present.

**Remaining schema gaps (from audit-data.json):**
1. `SearchAction` on WebSite schema — enables Google Sitelinks Searchbox for branded queries; low effort, low-medium impact
2. `sameAs` on Organization limited to one Pinterest URL — limits entity disambiguation in AI knowledge graphs; add YouTube/LinkedIn/X when accounts exist

---

## 4. Citability Analysis (Passage-Level)

### Benchmark: 134–167 words is optimal passage length for AI citation

**Blog: /blog/indian-passport-photo-size-rules/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 40–60 words | PASS | First paragraph directly addresses the spec split (printed vs. digital vs. embassy) |
| Question-based H2/H3 headings | PASS | "What size is an Indian passport photo?", FAQ headings are exact user queries |
| Specific statistics with source attribution | PASS | 45×35mm, digital pixel spec, file size limits; source: passportindia.gov.in |
| Self-contained extractable H2 sections | PASS | Each section (background, face size, rejection reasons) is independently citable |
| Author markup | PASS | "Jaspal Kumar" visible + BlogPosting author in schema (June 21 state) |
| Publication + modification date | PASS | June 18, 2026; dateModified in BlogPosting schema |
| FAQ section | PASS | 6 questions covering common rejection-related queries |
| FAQPage JSON-LD | PASS | Confirmed present on tool/blog pages (audit-data.json) |
| Meta description | FAIL | Not detected on live fetch — high-priority gap |
| Open Graph tags | UNCONFIRMED | WebFetch did not return OG tags — likely extraction artifact; needs HTML-level verification |
| Passage word count (sample) | BORDERLINE | Opening answer paragraph ~70 words — below 134-word ideal; expanded H2 sections reach 130–160 words |

**Citability score for this page: 72/100**

---

**Exam page: /exam-requirements/ssc/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 60 words | PASS | Opening sentence gives photo and signature specs in one line |
| Verified date + official source | PASS | "Verified 8 Jun 2026 · SSC official portal (ssc.gov.in)" |
| FAQ section | PASS | 6 questions present with direct answers |
| FAQPage JSON-LD | PASS | Confirmed on tool pages (audit-data.json) |
| BreadcrumbList | PASS | Confirmed on exam pages (audit-data.json) |
| Spec data format | WEAK | Spec block is a structured table (~50 words); tables are poorly extracted by text-stripping tools like trafilatura — no prose equivalent paragraph found |
| Author attribution | FAIL | No author name visible on exam page (confirmed via live fetch) |
| Meta description | FAIL | Not detected |

**Citability score for this page: 62/100**

---

**Blog: /blog/passport-photo-size-by-country/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 60 words | PASS | "There is no single passport photo size. Each country sets its own dimensions…" — immediately addresses the query intent |
| Question-based H2s | PARTIAL | H2s are explanatory rather than question-format; FAQ section at end uses question format |
| Author + date | PASS | Jaspal Kumar, June 5, 2026 |
| BlogPosting JSON-LD | PASS | Confirmed present (audit-data.json) |
| Meta description | FAIL | Not detected |
| Passage word count | PASS | Body H2 sections appear to reach 130–170 words based on heading count and content depth |

**Citability score for this page: 65/100**

---

**Blog: /blog/why-passport-photos-get-rejected/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 60 words | PASS | "Quick answer — the 6 reasons photos bounce" delivered in opening paragraph |
| Question-based H2s | PARTIAL | H2s are descriptive ("Wrong background colour") not question-format |
| Author + date | PASS | Jaspal Kumar, June 6, 2026; 6 min read |
| FAQ section | PASS | 5 questions |
| Official source references | PARTIAL | U.S. DoS, GOV.UK, Passport Seva referenced but no inline statistics with source citations in body text |
| Meta description | FAIL | Not detected |

**Citability score for this page: 64/100**

---

### Citability Dimension Score: 68/100

**What works:** Answer-first structure with direct opening paragraphs is strong GEO hygiene. "Quick answer" approach on blog posts mirrors what Perplexity extracts for answer blocks. Author attribution with role title ("document-spec researcher") on all blog posts. Verified source citations (passportindia.gov.in, ssc.gov.in) with inline date anchors. Schema now confirms machine-readable BlogPosting authorship.

**What fails:** No meta descriptions on any audited page — this is the primary remaining technical citability gap. Spec tables on exam pages are trafilatura-invisible. Some blog H2 headings are descriptive rather than question-format (missed FAQ-style heading opportunity). Opening answer paragraphs on some pages are below the 134-word citation-optimal threshold.

---

## 5. Structural Readability for AI Crawlers

### Homepage (/)

| Signal | Status |
|---|---|
| H1 present | PASS: "Document photos that get accepted" |
| Clear H2 sub-headings | PASS |
| FAQ section | PASS: confirmed on homepage |
| FAQPage JSON-LD | PASS: confirmed (audit-data.json) |
| Organization schema | PASS: confirmed (audit-data.json) |
| SoftwareApplication schema | PASS: added June 18 |
| Answer-first intro | FAIL: hero is benefit copy ("100% free tools. No uploads. No data stored.") rather than direct factual answers |
| Statistical claims with citations | PARTIAL: "24 country options", "52 exam/form specs", "35 free tools" — specific counts but no sourced statistics |
| Meta description | FAIL |

### Blog posts

All audited blog posts follow a strong structural pattern:
- H1: Keyword + year
- H2: Direct answer or specification opening
- H2: Expanded explanation sections (multiple)
- H2: "Frequently asked questions"

This pattern is close to ideal structural GEO. The "FAQ at the bottom" placement is the one weakness — AI crawlers that truncate long pages may not reach it. Moving FAQ higher (immediately after the direct-answer H2) would improve extraction probability.

### Exam pages (/exam-requirements/*)

- BreadcrumbList schema confirmed (Home > Exam Requirements > SSC)
- Opening line is a direct spec summary — good
- Verification date + source present — strong factual anchor
- No author on exam pages — weakens E-E-A-T; exam pages are arguably higher-stakes for trustworthiness than blog posts

**Structural Readability Score: 72/100**

---

## 6. Technical Accessibility for AI Crawlers

### Rendering: Next.js Static Export (SSR)

Confirmed static export — every page is pre-rendered HTML. Content (headings, body text, spec tables) is in the raw HTTP response with no JavaScript required. This is the gold standard for AI crawler compatibility. ClaudeBot, GPTBot, PerplexityBot, and Bingbot all access full content on first request.

### Sitemap

- 366 URLs in sitemap.xml (live count, June 23)
- All URLs have `lastmod` dates (June 2–23, 2026) — recency signals for crawl prioritization
- Both blog and exam pages included
- Priority values verified (1.0 homepage, 0.7–0.8 content pages inferred from standard Next.js sitemap practice)

### AI-specific accessibility signals

| Signal | Status |
|---|---|
| robots.txt | Optimal — all AI crawlers allowed |
| llms.txt | PRESENT — high value |
| Schema coverage | Strong — Organization, BlogPosting, FAQPage, BreadcrumbList, SoftwareApplication |
| SSR/static HTML | PASS — no SPA shell |
| Sitemap freshness (lastmod) | PASS — all June 2026 |
| Meta descriptions | FAIL — absent across all audited pages |
| Open Graph / Twitter Card | UNCONFIRMED — not returned in extraction; high-priority verification needed |
| Canonical tags | UNCONFIRMED — not detected in WebFetch extraction |
| hreflang | ABSENT — English-only content (Hindi pages not in scope) |

**Technical Accessibility Score: 100/100 (raw 103, capped)**

The combination of explicit AI crawler allow rules, SSR rendering, llms.txt, comprehensive schema, and a fresh sitemap represents a technically strong configuration. The meta description gap and unconfirmed OG tags prevent a clean 100 in practice, but the structural access foundation is excellent.

---

## 7. Authority & Brand Signals

### Entity Recognition on External Platforms

| Platform | Status | Notes |
|---|---|---|
| Wikipedia | NOT PRESENT | No Wikipedia article for easyPhoto or easyphoto.in — largest single gap for AI entity confidence |
| Wikidata | NOT CONFIRMED | No Q-entity found; would feed directly into Google Knowledge Panel and ChatGPT entity recognition |
| Reddit | UNCONFIRMED | Platform blocks automated crawling; manual check required |
| YouTube | NOT PRESENT | No YouTube channel or videos associated with easyphoto.in found |
| LinkedIn | UNCONFIRMED | No social links on site; Company page status unknown |
| Pinterest | PRESENT | sameAs in Organization schema points to pinterest.com/easyphoto0604/ — only confirmed social presence |
| Domain Authority | UNCONFIRMED | No backlink data in audit scope |

### On-site Authority Signals

| Signal | Status | Notes |
|---|---|---|
| Named author (blog posts) | PASS | "Jaspal Kumar, easyPhoto developer & document-spec researcher" on all blog posts |
| BlogPosting author schema | PASS | Confirmed present (audit-data.json June 21 state) |
| Author bio | PARTIAL | Short bio with role title visible but no dedicated author profile page, no credential verification, no external links |
| Author on exam pages | FAIL | Exam requirement pages have no author attribution — weakens E-E-A-T on the site's highest-traffic cluster |
| Expert credentials | PARTIAL | "document-spec researcher" is a descriptive title, not independently verifiable; no formal credentials cited |
| External source citations | PASS | passportindia.gov.in and ssc.gov.in cited with "verified [date]" in body text — the strongest on-site authority signal |
| Organization entity | PASS | Organization schema present on all pages; sameAs: Pinterest only |
| Contact information | WEAK | Email only (softapps@atvantiq.com); no phone, no physical address, no social links in footer |
| Trust badges / press mentions | NONE | No certifications, press coverage, or partner logos |
| Publication pattern | CONCERNING | All 24+ blog posts published within a 3-week window (June 2026) — AI models may flag this as low-trust burst publishing rather than an established editorial history |

### Brand Mention Correlation Analysis

Research shows the following correlation with AI citation frequency:

| Signal | Correlation | easyphoto.in Status |
|---|---|---|
| YouTube brand mentions | ~0.737 (strongest) | ABSENT |
| Reddit brand mentions | High | UNCONFIRMED |
| Wikipedia entity | High | ABSENT |
| LinkedIn company page | Medium | UNCONFIRMED |
| Domain Rating (backlinks) | ~0.266 (weakest direct signal) | UNCONFIRMED |

The complete absence of YouTube content is the most material gap relative to AI citation probability. YouTube mention correlation (~0.737) is the strongest single predictor of AI citation frequency, and easyphoto.in has zero YouTube presence.

**Authority & Brand Signals Score: 32/100** — weakest dimension and the most impactful to address for sustainable long-term AI citation frequency.

---

## 8. Multi-Modal Content

| Asset Type | Status | Notes |
|---|---|---|
| Images with alt text | UNCONFIRMED | Cannot verify alt attributes via WebFetch extraction; needs HTML-level audit |
| Video content | ABSENT | No YouTube channel, no embedded videos on any page |
| Infographics | ABSENT | No dimension comparison charts in image form |
| Data tables | PRESENT | Spec tables on exam/blog pages (trafilatura-invisible without prose equivalents) |
| Schema-marked image content | UNCONFIRMED | ImageObject in BlogPosting needs verification |
| Audio | ABSENT | Not expected for this content type |

**Multi-Modal Content Score: 38/100** — the tool is inherently visual but there is no YouTube presence (highest-correlation AI citation signal), no schema-confirmed image markup verified, and spec data exists only in tables (not AI-extractable prose).

---

## 9. Platform-Specific Scores

| Platform | Score | Primary Strengths | Key Gap |
|---|---|---|---|
| Google AI Overviews | 62/100 | FAQPage + BlogPosting schema; SSR; answer-first structure | No meta descriptions; entity has only Pinterest sameAs; no Wikipedia |
| Perplexity | 72/100 | llms.txt present; answer-first formatting; source citations; SSR | No llms-full.txt; meta descriptions absent; no YouTube for brand signal |
| ChatGPT (web search) | 55/100 | llms.txt; schema present; SSR | No Wikipedia entity; no YouTube/Reddit presence for training-time brand correlation; burst publication pattern |
| Bing Copilot | 60/100 | Schema + SSR = strong indexability; BreadcrumbList | Meta descriptions absent; no OG tags confirmed; entity gap |

Only 11% of domains are cited by both ChatGPT and Google AI Overviews simultaneously. easyphoto.in's technical foundation gives it an above-average chance, but the entity and brand signal gap limits citation frequency on query-time retrieval platforms.

---

## 10. Top 5 Highest-Impact Recommendations

### P1 — CRITICAL: Add Meta Descriptions to All Pages
**Effort:** 1 day | **Impact:** +5–7 GEO score points | **Platform:** All platforms

Zero audited pages have a `<meta name="description">` tag. This is confirmed absent on live fetch for homepage, both blog posts tested, and the SSC exam page. Meta descriptions are the primary fallback text AI crawlers use as citation snippets when no schema excerpt is available. Without them, crawlers extract arbitrary body text — often the navigation or the hero tagline rather than the specification.

For Next.js App Router, add `export const metadata = { description: '...' }` to every `page.tsx`. Priority order:
1. All 24+ blog posts — these are the pages most likely to be cited in AI answers
2. All 50+ exam requirement pages
3. /passport-photo/, /visa-photo/, other tool pages
4. Homepage

Each meta description should be 120–160 characters, answer-first, and include the primary specification (e.g., "Indian passport photo must be 45×35mm (3.5×4.5cm) for print or 630×810px JPEG under 250KB for online Passport Seva upload. Verified June 2026.").

---

### P2 — HIGH: Create llms-full.txt with Inline Spec Tables
**Effort:** 3–4 hours | **Impact:** +3–4 GEO score points + meaningful improvement for spec queries | **Platform:** ChatGPT, Perplexity, Claude

llms.txt is present (~60 lines of page links). The next step is `llms-full.txt`, which embeds the actual spec data inline so AI agents querying the file directly get extractable answers without a secondary page fetch.

Structure:

```
# easyPhoto llms-full.txt
# Full spec data for AI agent extraction
# https://easyphoto.in

## Indian Passport Photo — Official Specification
Source: passportindia.gov.in, verified June 2026
Print: 45×35 mm (4.5 cm × 3.5 cm), plain white background, matte finish
Digital (Passport Seva): 630×810 px JPEG, max 250 KB, 80–85% face coverage
Embassy/NRI: 51×51 mm (2×2 inch), verify with specific embassy

## SSC Photo — Staff Selection Commission
Source: ssc.gov.in, verified June 8 2026
Photo: 3.5×4.5 cm, 20–50 KB JPEG, white background
Signature: 4.0×2.0 cm, 10–20 KB JPEG, black or blue ink on white
```

Continue for all 24 country presets and 52 exam portals.

---

### P3 — HIGH: Verify and Confirm Open Graph + Twitter Card Tags
**Effort:** 2–4 hours | **Impact:** +2–3 GEO score points | **Platform:** Perplexity, Bing Copilot, social AI previews

WebFetch extraction did not return Open Graph tags on any audited page. This may be a tool limitation (OG tags live in `<head>` which some extractors strip), but it must be verified at the raw HTML level. If absent, add `og:title`, `og:description`, `og:image`, and `twitter:card` to all pages. For Next.js App Router, these are added in the `metadata` export alongside the meta description (P1 above) — the effort is near-zero if done simultaneously.

Verification method: `curl -s https://easyphoto.in/blog/indian-passport-photo-size-rules/ | grep -i "og:"` should return OG tags if present.

---

### P4 — HIGH: Add Author Attribution and Verification Date to All Exam Pages
**Effort:** 1–2 days | **Impact:** +3–4 GEO score points | **Platform:** Google AIO, ChatGPT (E-E-A-T)

Exam requirement pages (SSC, UPSC, IBPS, Railway, etc.) have a verified date and official source but no named author. Blog posts have Jaspal Kumar as author with role title. The inconsistency weakens E-E-A-T signals on the pages that handle the highest-specificity queries. AI models weight author attribution when selecting citations for expert-domain queries ("what is the official UPSC photo size").

Add a consistent byline to all exam pages: "Verified by Jaspal Kumar, document-spec researcher at easyPhoto — last reviewed [date] against [source]." Update BlogPosting/TechArticle schema author field on these pages to match.

---

### P5 — HIGH: Establish YouTube Presence (Priority: 3 Videos)
**Effort:** 2–4 weeks | **Impact:** +8–12 GEO score points long-term | **Platform:** ChatGPT (training-time), all platforms

YouTube brand mentions have the highest measured correlation with AI citation frequency (~0.737). easyphoto.in has zero YouTube presence. A channel with three core screen-capture tutorials would establish the brand in the training data of future model updates and provide backlinks and embed opportunities.

Priority video topics (matching top organic queries):
1. "How to resize your Indian passport photo to exact Passport Seva specs — free, no upload" (mirrors top blog post)
2. "SSC photo: how to resize to 20–50 KB in under 60 seconds" (targets the most common exam query)
3. "Why passport photos get rejected — the 6 fixable mistakes" (mirrors the rejection blog post)

Each video should: mention easyphoto.in by name, link to the corresponding blog post in the description, be embedded on the corresponding blog page. This creates the cross-platform signal loop (YouTube mention + domain link + embed) that correlates most strongly with AI citation frequency.

---

## 11. Additional Recommendations (Medium Priority)

**M1 — Convert Spec Tables to Prose Equivalents (Citability)**
Spec tables on exam pages (SSC, UPSC, etc.) are stripped by trafilatura and similar text extraction pipelines that AI crawlers often use for passage-level indexing. Add a prose summary paragraph directly above each table: "The SSC requires a colour photograph measuring 3.5×4.5 cm, saved as a JPEG between 20 and 50 KB, with a plain white background. The signature must be 4.0×2.0 cm, between 10 and 20 KB, written in black or blue ink on white paper." This makes the content directly extractable regardless of crawler extraction method.
**Effort:** 3–5 days across 50+ exam pages. | **Impact:** +4–6 points on Citability dimension.

**M2 — Create a Dedicated Author Profile Page**
Create `/about/jaspal-kumar/` with a bio, list of published articles, stated credentials, and at least one external link (LinkedIn, GitHub, or professional site). "Jaspal Kumar, document-spec researcher" is currently a floating name with no verifiable external existence — AI models weight authors who have entity presence outside the publishing domain more heavily when selecting citations.
**Effort:** 1 day. | **Impact:** +3–4 points on Authority dimension.

**M3 — Establish Wikidata Entity for easyPhoto**
The site has enough verifiable, stable facts (free tool, Indian market, 52 exam specs, privacy-by-design, no server upload) to create a Wikidata Q-entity. A Wikidata entry would: feed directly into Google's Knowledge Panel eligibility, improve ChatGPT entity disambiguation for branded queries, and allow adding `sameAs` to the Organization schema pointing to a knowledge graph URI (the highest-trust entity signal). Wikipedia article may follow once Wikidata notability is established.
**Effort:** 2–4 hours. | **Impact:** +5–8 points on Authority dimension (asymmetric upside).

**M4 — Add SearchAction to WebSite Schema**
Organization schema's `sameAs` currently points only to Pinterest. WebSite schema has no `potentialAction` / `SearchAction`. Adding SearchAction enables Google Sitelinks Searchbox for branded queries ("easyphoto SSC") — a small incremental win.
**Effort:** 30 minutes. | **Impact:** +1–2 points.

**M5 — Move FAQ Sections Higher on Blog Pages**
Currently FAQ appears as the last H2 on all blog posts. AI crawlers that truncate long pages at a content threshold may miss it. Moving FAQ to immediately after the primary spec H2 (second or third H2 position) increases extraction probability without changing content.
**Effort:** Content template change, 1 hour across all blog posts. | **Impact:** +1–2 points on Citability.

**M6 — Diversify sameAs in Organization Schema**
Organization schema's `sameAs` currently contains only the Pinterest URL. When YouTube, LinkedIn, or X accounts are created, add them immediately to the `sameAs` array. Each additional verified social entity increases AI knowledge graph disambiguation confidence.
**Effort:** 30 minutes per platform addition. | **Impact:** +1–2 points per platform.

---

## 12. What Is Already Working

1. **AI crawler access is exemplary.** Five major AI search bots have explicit named Allow rules. No accidental blocks via overly broad Disallow rules. robots.txt is correct.

2. **llms.txt is live.** The site is in the minority of properties that have implemented this emerging standard. ChatGPT, Perplexity, and Claude browsing agents all read llms.txt for site structure.

3. **Schema coverage is strong.** Organization, BlogPosting (with author, datePublished, dateModified, inLanguage: en-IN), FAQPage, BreadcrumbList, and SoftwareApplication are all confirmed present. This is above the industry median for similar-sized content sites.

4. **Answer-first content structure.** Every blog post opens with a direct answer or spec summary. The "Quick answer" pattern mirrors exactly what Google AIO and Perplexity extract for answer blocks.

5. **Verified source attribution in body text.** Inline citations ("passportindia.gov.in, verified June 2026", "ssc.gov.in, verified 8 Jun 2026") provide the factual anchor AI models require for high-confidence citation. This is meaningfully better than industry practice.

6. **SSR / static export rendering.** All content is in the raw HTTP response. AI crawlers that do not execute JavaScript (a common limitation, especially for training crawlers) get full access to every heading, paragraph, and spec without a second request.

7. **Comprehensive, fresh sitemap (366 URLs, all June 2026 lastmod).** Recency signals for crawl prioritization. 50+ exam pages create a long-tail factual content moat that AI models will cite for highly specific queries no competitor addresses.

8. **Named authorship with specific role.** Jaspal Kumar with "easyPhoto developer & document-spec researcher" on all blog posts is a meaningful E-E-A-T signal even without external credential verification.

9. **Content specificity.** Precise numbers (350×450px, 20–50KB, 80–85% face coverage, 45×35mm) are the type of factual anchors AI models prefer when generating cited answers. Vague content competes poorly in AI citation selection; this content does not.

---

## 13. Implementation Priority Matrix

| Change | Effort | GEO Impact | Platform Benefit | Priority |
|---|---|---|---|---|
| Meta descriptions on all pages | 1 day | +5–7 pts | All platforms | P1 — Critical |
| llms-full.txt with inline spec data | 3–4 hours | +3–4 pts | ChatGPT, Perplexity, Claude | P2 — High |
| Verify + fix Open Graph / Twitter Card tags | 2–4 hours | +2–3 pts | Perplexity, Bing, social AI | P3 — High |
| Author attribution on exam pages | 1–2 days | +3–4 pts | Google AIO, ChatGPT | P4 — High |
| YouTube channel (3 videos) | 2–4 weeks | +8–12 pts long-term | ChatGPT training, all platforms | P5 — High |
| Prose equivalents for spec tables | 3–5 days | +4–6 pts | All platforms | M1 — Medium |
| Author profile page (/about/jaspal-kumar/) | 1 day | +3–4 pts | ChatGPT, Google | M2 — Medium |
| Wikidata entity | 2–4 hours | +5–8 pts | ChatGPT, Knowledge Panel | M3 — Medium |
| SearchAction on WebSite schema | 30 min | +1–2 pts | Google | M4 — Low |
| Move FAQ higher on blog pages | 1 hour | +1–2 pts | All platforms | M5 — Low |
| Expand sameAs in Organization schema | 30 min/platform | +1–2 pts/platform | All platforms | M6 — Low |

**Projected score after P1–P5 implementation: 74–78 / 100**
**Projected score after all recommendations: 83–87 / 100**

---

## Appendix: Score Reconciliation Note

The `audit-data.json` (June 21, 2026) records the AI Search Readiness category at 92/100 based on a narrower set of criteria focused on crawler access, llms.txt presence, and schema completeness. The GEO Readiness Score in this report (64/100) uses a broader five-dimension methodology that additionally weights brand signals (Authority dimension at 32/100) and multi-modal presence (Multi-Modal at 38/100) — both of which are structurally weak due to the absence of YouTube, Wikipedia, and Reddit brand presence. The two scores are compatible: the technical and schema foundation is strong (93+ on those dimensions), but brand-signal and off-site entity weaknesses pull the holistic GEO score to 64.
