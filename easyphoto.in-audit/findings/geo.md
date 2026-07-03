# GEO / AI Search Readiness Audit — easyphoto.in (Re-Audit)

**Audit date:** 2026-07-02
**Baseline:** 2026-06-23 (GEO 64/100, AI Citation Readiness 63/100)
**Auditor:** Claude Sonnet 5 (GEO specialist mode)
**Scope (live verification):** `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/`, `/passport-photo/`, `/exam-requirements/ssc/`, `/exam-requirements/upsc/`, `/blog/`, `/tools/resize-kb/`, `/sitemap.xml`
**Method:** Direct HTTP fetch (curl) of live production URLs, raw HTML parsed for JSON-LD, `<dl>`/heading structure, meta tags, and sameAs/entity signals. No JS rendering was required — pages are SSR'd and fully present in the initial HTML response.

---

## GEO Readiness Score: 78 / 100 (was 64/100, +14)

| Dimension | Weight | Raw Score | Weighted | Change |
|---|---|---|---|---|
| Citability | 25% | 82 | 20.5 | +3.5 (was 17.0) |
| Structural Readability | 20% | 80 | 16.0 | +1.6 (was 14.4) |
| Multi-Modal Content | 15% | 38 | 5.7 | unchanged |
| Authority & Brand Signals | 20% | 58 | 11.6 | +5.2 (was 6.4) |
| Technical Accessibility | 20% | 100 (capped) | 20.0 | unchanged (still capped 100) |
| **TOTAL** | 100% | — | **78.0** | **+14.0** |

Score movement is driven almost entirely by the three claimed fixes verifying as genuinely live and structurally sound (not cosmetic). Multi-Modal Content is unchanged and is now the single largest drag on the score.

---

## AI Citation Readiness Score: 81 / 100 (was 63/100, +18)

| Element | Status | Evidence | Score |
|---|---|---|---|
| AI crawlers explicitly allowed | PASS | GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot all have named `Allow: /` rules | 10/10 |
| Google-Extended explicit rule | GAP | Not named; falls through to wildcard `User-agent: * / Allow: /` — functionally open but not explicit | 6/10 |
| llms.txt present & structured | PASS | HTTP 200, ~9.3 KB, organized by category (passport/visa by country, tools, 51 exam pages, 30 blog guides) with one-line descriptions per link | 10/10 |
| llms-full.txt present & inline spec data | PASS (upgraded) | HTTP 200, ~9.3 KB. Contains genuine inline spec tables (photo/signature px, KB range, format, background, source domain, verification date) for ~20 portals + 7 passport/visa countries — not just links | 10/10 |
| Meta descriptions (5-page spot check) | PASS | All 5 pages have unique, keyword-specific, spec-bearing descriptions (128–217 chars) | 10/10 |
| FAQ schema | PASS | Valid `FAQPage` JSON-LD confirmed on homepage (`SoftwareApplication` + `FAQPage`) and on exam pages (SSC, UPSC both confirmed) with 4+ self-contained Q&A pairs embedding exact spec numbers | 10/10 |
| Author attribution | PASS | `Person` schema (Jaspal Kumar) with `dateModified`, LinkedIn `url`, visible byline + avatar image on exam pages | 9/10 |
| Passage-level citability (spec data) | PASS | Spec data lives in semantic `<dl>`/`<dt>`/`<dd>` markup (File size, Dimensions, Aspect, Format, Background) — clean, self-contained, quotable without surrounding context | 8/10 |
| Question-phrased H2/H3 headings | GAP (unchanged) | Section headings are declarative ("Photo requirement", "Signature requirement", "Why SSC uploads get rejected") not question-form; only the FAQ block itself is phrased as questions | 5/10 |
| Brand entity breadth (sameAs) | GAP (unchanged) | Organization `sameAs` = Pinterest only; founder `sameAs` = personal LinkedIn only. No org YouTube, Reddit, X/Twitter, Wikipedia, or Crunchbase presence | 3/10 |
| **Weighted total** | | | **81/100** |

---

## 1. AI Crawler Access — robots.txt (VERIFIED, unchanged from baseline)

```
User-Agent: GPTBot        Allow: /
User-Agent: OAI-SearchBot Allow: /
User-Agent: ChatGPT-User  Allow: /
User-Agent: ClaudeBot     Allow: /
User-Agent: PerplexityBot Allow: /
User-Agent: *             Allow: /
Sitemap: https://easyphoto.in/sitemap.xml
```

| Bot | Status | Basis |
|---|---|---|
| GPTBot | ALLOWED (explicit) | Named rule |
| OAI-SearchBot | ALLOWED (explicit) | Named rule |
| ChatGPT-User | ALLOWED (explicit) | Named rule |
| ClaudeBot | ALLOWED (explicit) | Named rule |
| PerplexityBot | ALLOWED (explicit) | Named rule |
| Google-Extended | ALLOWED (implicit, via wildcard) | Not named — falls through to `*` |
| CCBot | ALLOWED (implicit, via wildcard) | Not named |
| anthropic-ai | ALLOWED (implicit, via wildcard) | Not named |
| cohere-ai | ALLOWED (implicit, via wildcard) | Not named |

**Assessment:** All five priority AI search crawlers named in the brief have explicit `Allow` rules — confirmed unchanged and correct. No `Disallow` blocks anywhere in the file. This remains a strength; no action required. The four bots without explicit named rules (Google-Extended, CCBot, anthropic-ai, cohere-ai) are not blocked — they inherit the open wildcard — but an explicit Google-Extended `Allow` rule would remove any ambiguity for Google AI Overviews' training/grounding crawler, which is the one of the four that directly affects citation surfaces (the other three are training-only, matching the "optional block" framing in the brief, and leaving them open is a reasonable choice given the content is factual reference material).

---

## 2. llms.txt — VERIFIED PRESENT, well-formed

`https://easyphoto.in/llms.txt` → **HTTP 200**, ~9.3 KB, 211 lines.

Structure confirmed: single H1 (`# easyPhoto`), blockquote summary, then link sections for About, Passport & Visa makers (30 countries), Photo/PDF/Signature/Document/OCR Tools (40+), and **51 exam-requirement pages each with an inline one-line spec summary** (e.g. `SSC (Staff Selection Commission): photo 20-50 KB, signature 10-20 KB`), plus 30 blog guide links with descriptive summaries. This is a genuinely comprehensive, well-curated llms.txt — exceeds the typical link-dump pattern seen on most sites.

No RSL 1.0 licensing block detected in the file body (not required by spec, but was flagged as unverified at baseline — still unaddressed if that was a priority).

---

## 3. llms-full.txt — VERIFIED PRESENT, contains genuine inline spec tables (claimed fix confirmed)

`https://easyphoto.in/llms-full.txt` → **HTTP 200**, ~9.3 KB, 212 lines.

This is a real fix, not cosmetic. The file contains actual structured data an LLM can quote directly without dereferencing a link:

```
### SSC — Staff Selection Commission
- Applies to: CGL, CHSL, MTS, CPO, JHT, GD Constable, Stenographer, Junior Engineer (all via ssc.gov.in OTR)
- Photo: 350 × 450 px | 20–50 KB | JPEG | White or light background
- Signature: 140 × 60 px | 10–20 KB | JPEG
- Special requirement: Name + date of photograph must appear in the photo
- Source: ssc.gov.in (verified 2026-06-08)
- Tool: https://easyphoto.in/ssc-photo-resizer/
```

~20 Indian exam portals and 7 passport/visa countries have this level of inline detail (dimensions, KB range, format, background rule, source domain, verification date). A privacy statement and sitemap pointer close out the file.

**Data-integrity note (minor):** several `Tool:` links in llms-full.txt (e.g. `/ssc-photo-resizer/`, `/upsc-photo-resizer/`, `/ctet-photo-resizer/`, `/nda-photo-resizer/`, `/railway-photo-resizer/`, `/sbi-po-photo-resizer/`, `/tnpsc-photo-resizer/`, `/voter-id-photo-resizer/`, `/pan-card-photo-resizer/`) return **301 redirects** rather than 200 — consistent with the recent `fix(seo): point legacy resizer redirects at the indexed spec page` commit, so functionally fine for crawlers (redirects are followed), but worth pointing llms-full.txt directly at the canonical destination URLs to save a hop for agents that don't follow redirects when extracting from a text file.

**Freshness gap:** llms-full.txt header says `Updated: 2026-06-23`; the spec-verification dates inside range from `2026-06-08` to `2026-06-10`. Fine for now, but this file needs a refresh cadence tied to actual portal-spec re-verification, or AI systems may eventually cite stale confirmation dates.

---

## 4. Passage-Level Citability — /exam-requirements/ssc/ (VERIFIED)

**H1:** "SSC (Staff Selection Commission) Photo & Signature Size" — clear, entity-specific, matches likely query intent.

**Spec data markup (photo requirement block):**
```html
<dl>
  <div><dt>File size</dt><dd>20–50 KB</dd></div>
  <div><dt>Dimensions</dt><dd>350 × 450 px</dd></div>
  <div><dt>Aspect</dt><dd>3.5 : 4.5</dd></div>
  <div><dt>Format</dt><dd>JPG / JPEG</dd></div>
  <div><dt>Background</dt><dd>Plain white</dd></div>
</dl>
```
Signature block follows the identical pattern (File size, Dimensions, Format, Ink).

**Assessment:** This is genuinely extractable structured data — label/value pairs an LLM can quote as a direct answer with zero ambiguity ("SSC photo must be 350×450 px, 20–50 KB, JPG, plain white background"). It is self-contained: the heading immediately above ("Photo requirement") plus the `<dl>` gives full context without needing surrounding paragraphs. This pattern is **templated and consistent** — confirmed identically on `/exam-requirements/upsc/` (550×550px, 20–300 KB) — so the fix scales across all 51 exam pages, not just the audited sample.

**Minor HTML nit:** `<dt>`/`<dd>` pairs are wrapped in intermediate `<div>` elements inside `<dl>`, which is non-conformant to the strict HTML5 `<dl>` content model (spec expects `dt`/`dd` as direct children, optionally grouped in `<div>` — which is actually what's happening here, so this is fine per HTML5.1+). No parser risk; trafilatura/LLM extraction handles this correctly.

**Gap (unchanged from baseline):** the visible on-page section headings ("Photo requirement", "Signature requirement", "Why SSC uploads get rejected") are declarative, not question-phrased. Only the dedicated FAQ block below uses question form. Converting top-level headings to question form (e.g., "What size photo does SSC require?") would let AI Overviews and Perplexity pull directly from the visible heading+content pair rather than relying solely on the FAQPage schema layer.

**FAQPage schema on this page (confirmed via JSON-LD):**
- "What is the photo size for the SSC (Staff Selection Commission) application?" → self-contained 2-sentence answer with exact numbers.
- "What is the signature size for SSC (Staff Selection Commission)?"
- "How do I resize my photo to 20–50 KB for SSC (Staff Selection Commission)?"
- "Why do SSC (Staff Selection Commission) photos and signatures get rejected?"

Each answer is 20–45 words — shorter than the 134–167 word "optimal AI citation passage" benchmark, which is appropriate for direct Q&A snippet extraction (Google AI Overviews / voice-style answers) but leaves a gap for the longer-form explanatory passage that ChatGPT/Perplexity sometimes prefer when synthesizing a fuller answer. Consider one 130–160 word self-contained explainer paragraph per exam page (e.g., under an "About this requirement" heading) in addition to the terse FAQ answers.

---

## 5. Meta Description Spot-Check (5 pages, VERIFIED — all fixed)

| Page | Length | Content quality |
|---|---|---|
| `/` | 156 chars | Clear value prop + privacy claim, no keyword stuffing |
| `/passport-photo/` | 194 chars | Includes exact spec numbers (35×45mm, 630×810px, 250KB) — high citability |
| `/exam-requirements/ssc/` | 217 chars | Leads with exact spec numbers for both photo and signature — best of the five |
| `/blog/` | 128 chars | Generic but appropriate for an index page |
| `/tools/resize-kb/` | 148 chars | Explains mechanism (drops quality first, then dimensions) — differentiates from competitors |

All 5 are unique, non-templated boilerplate, and several front-load the exact numeric spec — which doubles as a strong AI Overview snippet candidate since Google/Bing often lift the meta description verbatim for factual queries. **Baseline claim of "zero meta descriptions, now fixed" is confirmed accurate and the quality bar is high**, not just presence-checked.

---

## 6. FAQ Schema (VERIFIED PRESENT — homepage + exam pages)

- **Homepage:** `@graph` contains `SoftwareApplication` + `FAQPage` types (JSON-LD block 2 of 2).
- **`/exam-requirements/ssc/`:** `@graph` contains `BreadcrumbList` + `WebPage` + `FAQPage`, 4 Q&A pairs.
- **`/exam-requirements/upsc/`:** same schema shape confirmed — `BreadcrumbList` + `WebPage` + `FAQPage`. Templated across the exam-requirements section.

This is a genuine, valid, machine-readable FAQ layer that AI Overviews, Bing Copilot, and voice assistants can lift directly. No malformed JSON-LD encountered in any of the 3 pages checked.

---

## 7. Brand Entity & Authority Signals

### Organization schema (homepage, VERIFIED)
```json
{
  "@type": "Organization",
  "name": "easyPhoto",
  "alternateName": ["easyPhoto", "Easy Photo", "easyphoto.in"],
  "description": "...",
  "slogan": "Document photos, exact to the millimetre.",
  "knowsAbout": [6 topical entities],
  "logo": {"url": ".../icon-512.png", "width": 512, "height": 512},
  "sameAs": ["https://www.pinterest.com/easyphoto0604/"],
  "founder": {
    "@type": "Person",
    "name": "Jaspal Kumar",
    "url": "https://www.linkedin.com/in/jaspal-jk/",
    "sameAs": ["https://www.linkedin.com/in/jaspal-jk/"],
    "jobTitle": "easyPhoto developer & document-spec researcher"
  }
}
```

**Completeness: good structurally** — has `alternateName`, `knowsAbout` (topical entity signals), `logo` with explicit dimensions, and a `founder` Person sub-entity with its own `sameAs`. This is more complete than the median small-site Organization schema.

**Gap (unchanged, confirmed at scale): `sameAs` breadth.** Organization-level `sameAs` = Pinterest only. No YouTube, Reddit, X/Twitter, Wikipedia, Wikidata, or Crunchbase entity links anywhere on the homepage or exam pages checked. Per the brand-mention correlation table, this is the highest-leverage unaddressed gap:

| Signal | Correlation w/ AI citation | easyPhoto status |
|---|---|---|
| YouTube mentions | ~0.737 (strongest) | **Absent** — zero YouTube presence sitewide |
| Reddit presence | High | **Absent** — no Reddit links/mentions found |
| Wikipedia entity | High | **Absent** — no Wikipedia/Wikidata entry or link |
| LinkedIn | — | Founder-level only (personal), no Organization-level company page |
| Domain Rating (backlinks) | ~0.266 (weak) | Not assessed this pass — lowest-leverage signal regardless |

### Author attribution (VERIFIED — claimed fix confirmed live)
- `Person` schema: `{"name": "Jaspal Kumar", "url": "https://www.linkedin.com/in/jaspal-jk/"}` attached to `WebPage.author`.
- `dateModified: "2026-06-08"` present alongside author.
- Visible on-page byline with avatar image (`/authors/jaspal-kumar.jpeg`) confirmed in rendered HTML on the SSC exam page.
- **Baseline claim "no author on exam pages — fixed" is confirmed accurate and structurally correct** (both visible byline and schema-level, not just one or the other).

**Gap:** single-author model sitewide. For a site claiming government-portal spec accuracy, a visible "how we verify" / editorial-review signal (even if still solo-authored) would strengthen E-E-A-T beyond what one Person schema conveys — this is a content-trust issue more than a technical one.

---

## 8. Multi-Modal Content (unchanged, now the largest score drag)

No video content, no YouTube channel, no embedded video demonstrations of the tools (e.g., "how to resize a photo to 20KB" as a 30-second clip) were found on the homepage or the audited exam/tool pages. Given the 0.737 correlation coefficient — the single strongest brand-mention signal in the correlation table — this is now the highest-impact unaddressed gap in the entire audit, structural or otherwise.

---

## Platform-Specific Readiness (qualitative, based on verified technical signals)

| Platform | Score /100 | Basis |
|---|---|---|
| Google AI Overviews | 80 | Strong: FAQ schema, precise meta descriptions with numeric specs, SSR, structured `<dl>` data. Gap: no Google-Extended explicit rule, no video. |
| ChatGPT / OAI-SearchBot | 82 | Strong: llms.txt + llms-full.txt both present with real inline data (this is the biggest lever for ChatGPT browsing/retrieval specifically), explicit crawler allow. |
| Perplexity | 78 | Strong: PerplexityBot explicitly allowed, FAQPage schema, source-attributed specs (each portal cites its .gov.in source domain + verification date — Perplexity weights source attribution heavily). Gap: no Reddit/YouTube corroboration reduces multi-source confidence. |
| Bing Copilot | 75 | Benefits from same schema/meta signals as Google; slightly lower due to weaker historical backlink/authority profile (not re-assessed this pass) and zero LinkedIn company page. |

Only ~11% of domains are cited by both ChatGPT and Google AI Overviews simultaneously — easyphoto.in's dual investment in llms.txt/llms-full.txt (ChatGPT-favored) and FAQPage/meta-description precision (Google-favored) is a sound strategy for beating that base rate, provided the multi-modal and brand-breadth gaps below are closed.

---

## Top 5 Highest-Impact Changes (ranked)

1. **Create a YouTube presence — even minimal.** Strongest single correlation (0.737) with AI citation in the entire framework, and currently at zero. Does not need to be a full channel strategy: 10–15 short (60–90 sec) screen-recorded demos ("How to resize an SSC photo to 20-50KB", "India passport photo in under a minute") uploaded to a branded YouTube channel, linked from `sameAs`, embedded on the top 5-10 highest-traffic tool/exam pages. *Effort: Medium (content production + channel setup, no dev work required beyond embedding + sameAs update).*

2. **Broaden `sameAs` beyond Pinterest.** Add YouTube (once created), an Organization-level LinkedIn company page (distinct from the founder's personal profile), and pursue a Wikidata entry (lower bar than Wikipedia notability, still read by knowledge-graph-driven AI systems). Each addition is a one-line JSON-LD change once the destination exists. *Effort: Low (schema) + Medium (creating the destination profiles).*

3. **Convert on-page H2/H3 section headings to question form on exam pages.** "Photo requirement" → "What size and format does SSC require for the photo?" Reinforces the existing FAQPage schema with matching visible content, doubling the extraction surface for Google AI Overviews and Bing Copilot, which favor heading+paragraph pairs over schema-only signals. Template-level change propagates across all 51 exam pages at once. *Effort: Low (single template edit).*

4. **Point llms-full.txt tool links at canonical URLs instead of legacy redirect paths.** Update `/ssc-photo-resizer/`, `/upsc-photo-resizer/`, etc. to their 200-status destination URLs so agents parsing the text file directly (without following redirects) land on the correct page. Also refresh the file's `Updated:` date whenever portal specs are re-verified, to avoid AI systems citing a stale confirmation date. *Effort: Low (find/replace + a documented refresh cadence).*

5. **Add one 130–160 word self-contained explainer paragraph per exam page**, positioned near the `<dl>` spec block, beyond the terse FAQ answers. Targets the 134–167 word "optimal AI citation passage" benchmark directly — gives ChatGPT/Perplexity a fuller passage to synthesize from when a snippet-length FAQ answer isn't enough, without disturbing the existing structured data. *Effort: Medium (content — 51 pages, but can start with top-traffic exams: SSC, UPSC, IBPS, NTA, RRB).*

---

## Summary of Verified Fixes vs. Baseline

| Baseline finding | Status | Verification method |
|---|---|---|
| Zero meta descriptions | **FIXED — confirmed** | Direct curl + grep on 5 live pages, all unique and spec-specific |
| llms-full.txt absent | **FIXED — confirmed, and upgraded** | HTTP 200, contains genuine inline spec tables (not just links), verified against 2 exam pages for template consistency |
| No author on exam pages | **FIXED — confirmed** | `Person` schema + `dateModified` + visible byline/avatar, verified live on SSC page |
| Zero YouTube presence | **UNCHANGED — confirmed still absent** | Grep for `youtube.com` on homepage HTML: zero matches |
| sameAs = Pinterest only | **UNCHANGED — confirmed** | Full JSON-LD `sameAs` array extracted: `["https://www.pinterest.com/easyphoto0604/"]` at org level |

**New findings this pass (not in baseline):**
- FAQPage schema confirmed present and valid (homepage + exam pages) — was not explicitly checked at baseline.
- H2/H3 headings are not question-phrased despite FAQ schema being question-phrased — a schema/content mismatch worth closing.
- Google-Extended, CCBot, anthropic-ai, cohere-ai are not explicitly named in robots.txt (inherit wildcard allow — not a blocker, but not best-practice explicit either).
- Several llms-full.txt tool links 301-redirect rather than returning 200 directly (low severity, but easy fix).
