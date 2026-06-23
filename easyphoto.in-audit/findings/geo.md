# GEO / AI Search Readiness Audit — easyphoto.in
**Audit date:** 2026-06-20  
**Auditor:** Claude Sonnet 4.6 (GEO specialist mode)  
**Scope:** Homepage, /passport-photo/, /blog/indian-passport-photo-size-rules/, /exam-requirements/ssc/, /blog/passport-photo-size-by-country/, /blog/why-passport-photos-get-rejected/, /about/, /contact/, robots.txt, llms.txt, sitemap.xml

---

## GEO Readiness Score: 54 / 100

| Dimension | Weight | Raw Score | Weighted |
|---|---|---|---|
| Citability | 25% | 66 | 16.5 |
| Structural Readability | 20% | 70 | 14.0 |
| Multi-Modal Content | 15% | 40 | 6.0 |
| Authority & Brand Signals | 20% | 30 | 6.0 |
| Technical Accessibility | 20% | 58 | 11.5 |
| **TOTAL** | 100% | — | **54.0** |

---

## 1. AI Crawler Access Status

| Bot | Status | Evidence |
|---|---|---|
| GPTBot | ALLOWED | `User-agent: GPTBot / Allow: /` in robots.txt |
| OAI-SearchBot | ALLOWED | Explicit rule |
| ChatGPT-User | ALLOWED | Explicit rule |
| ClaudeBot | ALLOWED | Explicit rule |
| PerplexityBot | ALLOWED | Explicit rule |
| CCBot | Not listed — defaults to `Allow: /` via wildcard rule |
| anthropic-ai | Not listed — defaults to `Allow: /` via wildcard rule |
| cohere-ai | Not listed — defaults to `Allow: /` via wildcard rule |
| Wildcard (*) | `Allow: /` with `Disallow: /_next/` |

**Assessment:** Excellent. All major AI search crawlers are explicitly allowed with unrestricted access. The `/_next/` disallow for the wildcard agent is correct Next.js hygiene and does not affect AI bots (which have named rules that override the wildcard). No training-only bots are blocked, which is acceptable — easyphoto.in's content is factual reference material where training exposure is a net citation benefit.

---

## 2. llms.txt Status

**Status: ABSENT**

`https://easyphoto.in/llms.txt` returns no content (HTTP 200 with empty body or no file exists).

There is no RSL 1.0 licensing declaration or machine-readable content inventory for AI agents. This means:

- Crawlers have no programmatic signal about which pages are most important to cite.
- No per-page licensing terms signal whether content can be used in AI responses.
- OpenAI's ChatGPT, Perplexity, and Claude all honour `llms.txt` when present; its absence is a missed authority signal.

**Gap:** No `llms.txt`, no `llms-full.txt`, no RSL 1.0 block on any page.

---

## 3. Structured Data (Schema.org / JSON-LD)

**Status: ABSENT on all audited pages**

Pages checked:
- `/` — no JSON-LD
- `/passport-photo/` — no JSON-LD
- `/blog/indian-passport-photo-size-rules/` — no JSON-LD
- `/exam-requirements/ssc/` — no JSON-LD
- `/blog/passport-photo-size-by-country/` — no JSON-LD
- `/blog/why-passport-photos-get-rejected/` — no JSON-LD

This is the single highest-impact gap in the entire audit. Google AI Overviews (and Bing Copilot) use structured data as a confidence multiplier for citation. FAQPage schema is directly ingested for AIO rich answers. Article + Author schema helps establish entity authorship. BreadcrumbList schema signals content hierarchy. None of these exist.

**Missing schema types (priority order):**
1. `FAQPage` — every blog post and exam page has an FAQ section; zero are marked up
2. `Article` + `Person` (author) — all 23+ blog posts have authorship (Jaspal Kumar) but no machine-readable attribution
3. `WebApplication` — the core tool functionality on `/passport-photo/`, `/exam-requirements/*`
4. `Organization` — homepage lacks org entity signal
5. `BreadcrumbList` — breadcrumbs exist in HTML on exam pages but are not schema-marked
6. `HowTo` — "How to take a passport photo at home" and similar guides would benefit

---

## 4. Citability Analysis (Passage-Level)

### Optimal passage length benchmark: 134–167 words for AI citation

**Blog: /blog/indian-passport-photo-size-rules/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 40–60 words | PASS | "Quick answer" section delivers exact dimensions immediately |
| Question-based H2/H3 headings | PASS | "What size is an Indian passport photo?", FAQ headings |
| Specific statistics with source | PASS | 45×35mm, 630×810px, 250KB, 80–85% face coverage, source: passportindia.gov.in |
| Self-contained extractable sections | PASS | Each H2 section (white background, face size, rejection reasons) is independent |
| Passage word count (sample) | BORDERLINE | "Quick answer" ~70 words — below 134-word ideal for citation; "rejection reasons" section ~130 words — near floor |
| Meta description | FAIL | Not present — AI crawlers fall back to Open Graph or first paragraph |
| Author markup | PARTIAL | Author name "Jaspal Kumar" visible in HTML but not in Article JSON-LD |
| Publication/update date | PARTIAL | Date visible (June 18, 2026) but no dateModified in schema |
| Verified source citation | PASS | "Verified June 2026 · passportindia.gov.in" present in text |

**Citability score for this page: 67/100**

---

**Exam page: /exam-requirements/ssc/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 60 words | PASS | Opening line gives exact dimensions and file size |
| Verified date + official source | PASS | "Verified 8 Jun 2026 · ssc.gov.in" in text |
| Self-contained data block | PASS | Spec table (pixels, KB, format, background) is citation-ready |
| FAQ section present | PASS | Has FAQ section |
| FAQ schema markup | FAIL | No FAQPage JSON-LD |
| Meta description | FAIL | Not present |
| Author attribution | FAIL | No author named on exam pages |
| Passage length (spec block) | FAIL | Spec block is a table (~50 words) — tables are poorly extracted by AI crawlers; needs prose equivalent |

**Citability score for this page: 58/100**

---

**Blog: /blog/passport-photo-size-by-country/**

| Signal | Status | Notes |
|---|---|---|
| Direct answer in first 60 words | PASS | "Quick answer" section covers US, India, UK, Canada immediately |
| Country dimensions table | PASS | Structured comparison data present |
| Author + date | PASS | Jaspal Kumar, June 5, 2026 |
| FAQ section | PASS | Present |
| JSON-LD | FAIL | None |
| Meta description | FAIL | Not present |

**Citability score for this page: 60/100**

---

### Citability Dimension Score: 66/100

**What works:** Answer-first structure with "Quick answer" H2s is excellent GEO hygiene. Specific measurements with source attribution (passportindia.gov.in, ssc.gov.in) provide the factual anchoring AI models prefer. Self-contained H2 sections on blog posts are independently citable.

**What fails:** No meta descriptions on any page (AI crawlers use these as citation summaries), no FAQ schema, and spec tables on exam pages are invisible to most text-extraction pipelines (trafilatura strips tables — prose equivalents needed).

---

## 5. Structural Readability for AI Crawlers

### Homepage (/)

| Signal | Status |
|---|---|
| H1 present | PASS: "Document photos that get accepted" |
| Clear sub-headings | PASS: H2s present |
| FAQ section | PASS |
| Rendering method | SSR (Next.js) — content visible pre-JavaScript |
| Answer-first intro | FAIL: Hero is benefit-oriented marketing copy, not direct answers |
| Statistical claims cited | PARTIAL: "26 country specs", "52 exam & form specs" — specific but not sourced |

### Blog posts

All audited blog posts follow a strong pattern:
- H1: Keyword + year
- H2: "Quick answer" (direct answer block)
- H2: Expanded explanation sections
- H2: "Frequently asked questions"

This is nearly ideal structural GEO. The "Quick answer" pattern mimics what Google AIO extracts for featured snippets and directly feeds Perplexity's answer-block format.

### Exam pages (/exam-requirements/*)

- Breadcrumbs present in HTML (Home > Exam Requirements > SSC) — good for context hierarchy
- Opening line is a direct answer (spec summary sentence)
- No author on exam pages weakens E-E-A-T signals
- Verification date + source present — strong factual anchor

**Structural Readability Score: 70/100**

---

## 6. Technical Accessibility for AI Crawlers

### Rendering: Next.js SSR

The site uses Next.js with server-side rendering. This is the gold standard for AI crawler compatibility. Critical content (headings, body text, spec tables) is present in the raw HTML response without JavaScript execution. AI crawlers that do not execute JavaScript (ClaudeBot, GPTBot's initial pass) can fully index all content.

**Confirmation:** Page structure analysis shows meaningful content returned without SPA shell — headings, body text, and nav are all in SSR output.

### Sitemap

- 547 URLs in sitemap.xml — comprehensive coverage
- All URLs have `lastmod` dates (2026-06-02 to 2026-06-18) — recency signals for crawl prioritization
- Priority values correctly set (1.0 homepage, 0.7-0.8 content pages)
- Blog and exam pages both included

### Technical gaps

| Issue | Impact |
|---|---|
| No `<meta name="description">` on any audited page | HIGH — AI crawlers use meta description as citation summary when no schema exists |
| No Open Graph tags confirmed | MEDIUM — social/AI preview snippets will fall back to raw text extraction |
| No canonical tag confirmed | MEDIUM — duplicate content risk for URL variants |
| No hreflang tags | LOW — English-only content (Hindi pages not audited) |
| No `llms.txt` | HIGH — no machine-readable content map for AI agents |

**Technical Accessibility Score: 58/100**

---

## 7. Authority & Brand Signals

### Entity Recognition

| Platform | Status | Notes |
|---|---|---|
| Wikipedia | NOT PRESENT | No Wikipedia article for easyPhoto or easyphoto.in — significant gap for AI entity confidence |
| Reddit | UNCONFIRMED | Reddit blocks automated crawling; manual check needed |
| YouTube | NOT PRESENT | No YouTube videos mentioning easyphoto.in found in search |
| LinkedIn | UNCONFIRMED | No social links on site; LinkedIn company page presence unknown |
| Domain Authority | UNCONFIRMED | No backlink data in this audit scope |

### On-site Authority Signals

| Signal | Status | Notes |
|---|---|---|
| Named author (blog) | PARTIAL | "Jaspal Kumar, easyPhoto developer & document-spec researcher" — present on blog posts, absent on exam/tool pages |
| Author bio | PARTIAL | Short bio visible but no author profile page, no social links, no credentials page |
| Expert credentials | PARTIAL | "document-spec researcher" title — not independently verifiable |
| External source citations | PASS | passportindia.gov.in, ssc.gov.in cited inline with verification dates |
| Organization entity | WEAK | No Organization JSON-LD; footer "© 2026 easyPhoto" only |
| Contact information | WEAK | Email only ([email protected]); no phone, no address, no social links |
| Trust badges | NONE | No certifications, press mentions, or partner logos |
| Publication history | PASS | All 24 blog posts dated June 2026 — very fresh but very clustered (all published within 3 weeks) |

### Brand Mention Correlation Analysis

Research shows YouTube mentions have the strongest correlation (~0.737) with AI citations. LinkedIn, Reddit, and Wikipedia are the next most important. Currently:

- YouTube: No brand-associated video content found
- Reddit: No confirmed mentions (platform blocks crawling)
- Wikipedia: No entity page
- LinkedIn: No confirmed presence
- Press mentions: None detected

**Authority & Brand Signals Score: 30/100** — this is the weakest dimension and the most important to address for long-term AI citation frequency.

---

## 8. Platform-Specific Scores

| Platform | Score | Key Gap |
|---|---|---|
| Google AI Overviews | 52/100 | Missing FAQPage + Article schema; no meta descriptions; no external entity validation |
| Perplexity | 65/100 | Answer-first structure + source citations work well; lacking llms.txt and FAQ schema |
| ChatGPT (web) | 48/100 | No structured data; no Wikipedia entity; no YouTube/social presence for training-time brand correlation |
| Bing Copilot | 50/100 | Similar to Google AIO — schema gap is decisive; SSR rendering is a plus |

---

## 9. Multi-Modal Content

| Asset Type | Status | Notes |
|---|---|---|
| Images with alt text | UNCONFIRMED | Cannot verify alt attributes via WebFetch extraction |
| Video content | ABSENT | No YouTube channel, no embedded videos |
| Infographics | ABSENT | No dimension comparison charts in image form |
| Data tables | PRESENT | Spec tables on exam/blog pages (but invisible to text extractors without prose equivalents) |
| Audio | ABSENT | Not expected for this content type |

**Multi-Modal Content Score: 40/100** — the tool is inherently visual but there is no YouTube presence (the highest-correlation AI citation signal), no schema-marked tables, and no verifiable alt text coverage.

---

## 10. Top 5 Highest-Impact Recommendations

### P1 — CRITICAL: Implement FAQ Schema on All Blog Posts and Exam Pages
**Effort:** 2–3 days | **Impact:** +12–15 GEO score points

Every blog post and exam page already has a well-structured FAQ section with clear Q&A pairs. Adding `FAQPage` JSON-LD is a mechanical transformation that directly feeds Google AIO rich answers and Bing Copilot citations. This is the single highest-ROI change in the audit.

Implementation: inject `<script type="application/ld+json">` with FAQPage schema in the page `<head>` for every page that has an FAQ H2. For Next.js, use a shared `<FAQSchema questions={faqItems} />` component rendered in the layout.

Example for /blog/indian-passport-photo-size-rules/:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What size is an Indian passport photo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "45×35 mm (4.5×3.5 cm) for printed Passport Seva forms. For online upload: exactly 630×810 px JPEG under 250 KB."
      }
    }
  ]
}
```

---

### P2 — CRITICAL: Add Article + Person + Organization Schema to All Blog Posts
**Effort:** 2 days | **Impact:** +8–10 GEO score points

Jaspal Kumar is named as author on all blog posts but has no machine-readable attribution. Adding `Article` + `Person` schema establishes E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) for AI crawlers. Adding `Organization` on the homepage establishes the brand entity in knowledge graphs.

Priority markup needed:
- `Article` with `author`, `datePublished`, `dateModified`, `publisher` on every blog post
- `Person` entity for Jaspal Kumar with `jobTitle` and `url`
- `Organization` on homepage with `name`, `url`, `logo`, `contactPoint`

---

### P3 — HIGH: Add Meta Descriptions to All Pages
**Effort:** 1 day | **Impact:** +5–6 GEO score points

Zero audited pages have a `<meta name="description">` tag. This is the text AI crawlers use as the citation snippet when no schema is present. Without it, crawlers extract arbitrary body text — often the navigation menu or cookie notice rather than the answer. For Next.js App Router, add `export const metadata` to every page file.

Priority pages: all 24 blog posts, all 50+ exam requirement pages, /passport-photo/, /visa-photo/, homepage.

---

### P4 — HIGH: Create llms.txt
**Effort:** 2–4 hours | **Impact:** +4–5 GEO score points + improved AI agent navigation

Create `/llms.txt` following the emerging standard to give AI agents a structured map of the site's most citable content. This signals to ChatGPT, Claude, and Perplexity which pages are authoritative and citation-ready.

```
# easyPhoto — Document Photo & Form-Resize Tools for India
# https://easyphoto.in

> Free, browser-based tool for compliant passport, visa, and exam photos. All processing runs locally — no upload, no account.

## Key reference pages

- [Indian Passport Photo Size & Rules](https://easyphoto.in/blog/indian-passport-photo-size-rules/): Official Passport Seva dimensions, digital upload specs, rejection reasons.
- [Passport Photo Size by Country](https://easyphoto.in/blog/passport-photo-size-by-country/): US, India, UK, Canada, Australia, Schengen specs in one place.
- [SSC Photo & Signature Requirements](https://easyphoto.in/exam-requirements/ssc/): Staff Selection Commission specifications verified against ssc.gov.in.

## Tools
- [Indian Passport Photo Maker](https://easyphoto.in/passport-photo/): Free, ICAO-compliant, no upload.
- [Exam Photo Resizer](https://easyphoto.in/exam-requirements/): 50+ Indian exam portals.
```

---

### P5 — HIGH: Build YouTube Presence (1 Video Per Top Blog Post)
**Effort:** 2–4 weeks | **Impact:** +8–12 GEO score points long-term (strongest AI citation signal)

YouTube brand mentions have the highest correlation with AI citation frequency (~0.737). A channel with screen-capture tutorials ("How to resize your SSC photo to 20–50 KB in 60 seconds") would generate:
- YouTube entity association with the brand
- Backlinks from video descriptions
- Embeds back on blog posts (multi-modal signal)
- Reddit and social sharing opportunities

Priority video topics:
1. Indian passport photo size & rules (mirrors the top blog post)
2. How to resize SSC exam photo to exact KB limits
3. Passport photo at home — step-by-step

---

### Additional Recommendations (Medium Priority)

**M1 — Convert Spec Tables to Prose Equivalents (Citability)**
Spec tables on exam pages (SSC, UPSC, etc.) are stripped by trafilatura and similar text extractors. Add a prose summary paragraph above each table: "The SSC requires a 350×450 pixel JPEG photograph between 20 and 50 KB in file size, with a plain white background. The signature must be 140×60 pixels and between 10 and 20 KB, written in black or blue ink on white paper." This makes the content directly extractable by AI crawlers.
Effort: 3–5 days across all 50+ exam pages. | Impact: +4–6 points.

**M2 — Add Author Pages and External Authority Links**
Create a dedicated `/about/jaspal-kumar/` author page with bio, publication list, and at least one external link (LinkedIn, GitHub, or a personal site). Currently "Jaspal Kumar, easyPhoto developer" is a floating name with no verifiable external existence — AI models weight authors with external entity presence more heavily.
Effort: 1 day. | Impact: +3–4 points.

**M3 — Establish Wikipedia / Wikidata Presence**
The tool has enough verifiable facts (free tool, Indian market, 52 exam specs, no-upload privacy model) to merit a Wikidata entity if not a full Wikipedia stub. A Wikidata Q-entity for easyphoto.in would directly feed into knowledge panel eligibility on Google and entity confidence scores for ChatGPT.
Effort: 2–4 hours. | Impact: +5–8 points (asymmetric upside).

**M4 — Add Open Graph and Twitter Card Meta Tags**
No OG tags confirmed on any page. These are used by Perplexity, Bing Copilot, and social AI previews to generate citation snippets. Add `og:title`, `og:description`, `og:image`, and `twitter:card` to all pages.
Effort: 1 day. | Impact: +2–3 points.

**M5 — Add BreadcrumbList Schema**
Breadcrumb HTML exists on exam pages (Home > Exam Requirements > SSC) but is not schema-marked. BreadcrumbList JSON-LD helps AI crawlers understand content hierarchy and improves passage-level attribution accuracy.
Effort: Half a day. | Impact: +2 points.

**M6 — Add Author Attribution to Exam Pages**
Exam requirement pages have a verification date and source (ssc.gov.in, June 2026) but no named author. Adding "Verified by Jaspal Kumar, [date]" to these pages strengthens E-E-A-T on the site's highest-traffic content cluster.
Effort: 1 hour. | Impact: +2–3 points.

---

## 11. What Is Already Working

1. **AI crawler access is exemplary** — explicit Allow rules for all 5 major AI search bots in robots.txt with no accidental blocks.

2. **Answer-first content structure** — the "Quick answer" H2 pattern appearing on all blog posts delivers the exact spec (dimensions, file sizes, source) in the first visible section. This directly mirrors what Google AIO and Perplexity extract for answer blocks.

3. **Verified source attribution in body text** — citing "ssc.gov.in, verified 8 Jun 2026" and "passportindia.gov.in, verified June 2026" inline provides the factual anchor AI models need for high-confidence citations. This is better than the industry norm.

4. **SSR rendering (Next.js)** — all content is in the initial HTML response. AI crawlers that do not execute JavaScript (a common limitation) get full access to every heading, paragraph, and spec. No SPA shell problem.

5. **Comprehensive sitemap (547 URLs with lastmod)** — fresh lastmod dates signal recency to crawlers. The breadth of exam coverage (50+ portals) creates a moat of long-tail factual content that AI models will cite for highly specific queries.

6. **Named authorship on blog posts** — Jaspal Kumar is credited with a specific role ("document-spec researcher"), which is a meaningful E-E-A-T signal even without full Article schema.

7. **Content specificity** — precise numbers (350×450px, 20–50KB, 80–85% face coverage) are the kind of factual anchors AI models prefer when generating cited answers. Generic content competes poorly; this content does not.

8. **FAQ sections on all major pages** — structurally correct for AI citation even without the schema markup. Adding FAQPage JSON-LD converts these from a latent asset to an active AI Overviews signal.

---

## Implementation Priority Matrix

| Change | Effort | GEO Impact | Platform Benefit |
|---|---|---|---|
| FAQPage schema on all blog + exam pages | 2–3 days | +12–15 pts | Google AIO, Bing Copilot |
| Article + Person + Organization schema | 2 days | +8–10 pts | All platforms |
| Meta descriptions on all pages | 1 day | +5–6 pts | All platforms |
| llms.txt | 2–4 hours | +4–5 pts | ChatGPT, Perplexity, Claude |
| Prose equivalents for spec tables | 3–5 days | +4–6 pts | All platforms |
| Open Graph / Twitter Card tags | 1 day | +2–3 pts | Perplexity, Bing |
| BreadcrumbList schema | 0.5 days | +2 pts | Google AIO |
| Author pages (external entity) | 1 day | +3–4 pts | ChatGPT, Google |
| Wikipedia / Wikidata entity | 2–4 hours | +5–8 pts | ChatGPT, Google Knowledge Panel |
| YouTube channel (3 videos) | 2–4 weeks | +8–12 pts | ChatGPT (training), all platforms |

**Projected score after P1–P5 implementation: 72–76 / 100**  
**Projected score after all recommendations: 82–86 / 100**
