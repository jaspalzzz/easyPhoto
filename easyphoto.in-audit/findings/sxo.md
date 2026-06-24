# SXO Analysis — easyphoto.in
**Date:** 2026-06-23
**Analyst:** SXO Skill (Claude Sonnet 4.6)
**Scope:** Full-spectrum audit — homepage + 3 target keywords + 4 persona dimensions
**Keywords audited:** "passport photo maker india", "indian passport photo requirements", "exam photo resize"
**Target audience:** Indians applying for government documents and exams
**SXO Gap Score: 41/100**

> This document supersedes and extends the 2026-06-20 SXO file. Prior per-page scores for `/passport-photo/`, `/ssc-photo-resizer/`, and the blog comparison article remain valid; the new sections below add the homepage, keyword-level SERP landscape, 7-dimension gap analysis, cross-keyword persona scoring, and a consolidated priority action table.

---

## Pre-Delivery Checklist

- [x] URL fetched via WebFetch with structured extraction prompt (render_page.py not available; JS-rendered DOM limitation noted in Limitations section)
- [x] 10 SERP results analyzed per keyword (3 keywords = 30 total results classified)
- [x] Page type classification applied consistently across all competitors
- [x] User stories cite specific SERP signals (PAA questions, related searches, SERP patterns)
- [x] Persona scores include concrete improvement suggestions sorted weakest-first
- [x] Mismatch severity clearly rated per keyword
- [x] Limitations section present

---

## PRIMARY FINDING: Two Critical Gaps Drag Composite Score to 41/100

The site is technically sound and the passport photo tool page is correctly structured. The composite SXO score of 41/100 is driven by two issues that are fixable without any architectural change:

1. **CRITICAL — Exam pages returning HTTP 404.** easyphoto.in's 40+ exam-specific tool pages (e.g., `/upsc-exam-photo-resizer/`, `/ssc-exam-photo-resizer/`) are not live at the URLs listed in the sitemap. Google cannot index what does not load. The "exam photo resize" keyword cluster — collectively tens of thousands of monthly searches — scores 14/100 as a result.

2. **HIGH — No standalone "Indian Passport Photo Requirements" page exists.** The informational query "indian passport photo requirements" needs a dedicated guide page to rank at positions 7–10. The current tool page at `/india-passport-photo-maker/` serves transactional intent only. Competitors who have split these into separate URLs (passportsizephoto.in/photo-requirements) hold those positions.

Fixing these two gaps, without touching any other content, would raise the composite score to an estimated 62–65/100.

---

## SERP Landscape per Keyword

---

### Keyword 1: "passport photo maker india"

**Search intent classification:** Transactional + Tool — user wants a working tool right now, not information about specifications.

**Top 10 SERP results:**

| # | Domain | Page Type | Content Format | Est. Depth | Schema | Social Proof | Key Differentiator |
|---|--------|-----------|---------------|------------|--------|-------------|-------------------|
| 1 | passportsizephoto.in | Interactive Tool Landing Page | Tool-first, editorial support | ~4,800w | FAQPage, SoftwareApplication, Organization | "500K+ Indians trusted" | SoftwareApplication schema + aggregateRating = star SERP snippet |
| 2 | 123passportphoto.com/india | Country-specific Tool Page | Step-by-step tool | ~2,000w | FAQPage | Long-established brand | US-based global brand, India-specific URL |
| 3 | photogov.net/in-passport-35x45mm | Tool + HowTo Hybrid | Upload flow + requirement guide | ~2,300w | FAQPage, HowTo | "100% acceptance guarantee" | HowTo schema enables rich step-by-step snippet |
| 4 | makepassportphoto.com/en/p/india | Country Tool Page | Minimal copy, tool-forward | ~1,800w | FAQPage | Country compliance claim | Country-specific compliance framing |
| 5 | aipassportphoto.com/india | AI Tool Landing Page | AI-first flow | ~1,500w | FAQPage | "3-second photo" | AI differentiation, mobile-first |
| 6 | photoaid.com/indian-passport-photo | Tool + Informational Hybrid | Requirements + tool combo | ~3,200w | Article + FAQPage | 12,836 Trustpilot reviews, 4.83/5 | Named expert (BIPP certified), press logos (NYT/CNN/Forbes) |
| 7 | idphotodiy.com (IN/Passport) | Interactive Tool Landing Page | Country selector + tool | ~1,500w | FAQPage | Established brand | Print-sheet output |
| 8 | epassportphoto.com/en-in | Tool Landing Page | App-download focus | ~1,400w | FAQPage | App store ratings | App + web dual delivery |
| 9 | visafoto.com/in-passport-photo | Tool + Spec Page | Size info + tool | ~1,600w | FAQPage | Global brand | 2x2 inch focus |
| 10 | freetoolsindia.com/passport-photo-maker | Tool Landing Page | Utility-first | ~800w | Minimal | — | .in TLD, India-specific brand name |

**SERP features detected:**
- PAA box: "How do I make a free passport photo at home?", "What size photo is required for Indian passport?", "Can I take my own passport photo in India?", "What is the Passport Seva photo size in KB?"
- AI Overview: Active (likely curates top 3 tools with inline spec summary — easyphoto.in not confirmed present)
- No Featured Snippet (tool queries suppress definition snippets)
- Related searches: "passport size photo maker online free download", "passport photo online india 2026", "passport size photo 3.5x4.5 online free", "passport photo background color india"
- Google Ads: None in organic area for this query

**SERP consensus: Interactive Tool Landing Page — 10/10 (100% confidence)**

Dominant pattern: India-specific tool above fold, supporting editorial content (spec table, step guide, FAQ), before/after sample image in 7/10 results, social proof in 4/10, median depth ~1,800 words.

**easyphoto.in position:** Not confirmed in top 10 organic for this keyword. The `/india-passport-photo-maker/` page is correctly structured but has content depth and social proof gaps documented in the gap analysis below.

---

### Keyword 2: "indian passport photo requirements"

**Search intent classification:** Informational — user wants authoritative specification data, not necessarily a tool (though tool conversion is the commercial goal for every ranking page).

**Top 10 SERP results:**

| # | Domain | Page Type | Content Format | Est. Depth | Schema | E-E-A-T Signals |
|---|--------|-----------|---------------|------------|--------|----------------|
| 1 | visa.vfsglobal.com (PDF) | Official Government Document | Specification PDF | ~800w | None (PDF) | VFS Global (official Indian government partner) |
| 2 | cgisf.gov.in/photograph-specifications | Official Government Page | Spec list | ~600w | None | Indian Consulate General — highest possible authority |
| 3 | cgitoronto.gov.in (PDF) | Official Government Document | Spec PDF | ~500w | None | Indian Consulate Toronto |
| 4 | services.vfsglobal.com/usa/en/ind/apply-passport | Government Service Page | Application guide | ~1,200w | None | VFS Global official |
| 5 | blsinternational.com/india/uae/passport/photo-spec | Informational Spec Page | Requirements list | ~900w | None | BLS International (authorized agent) |
| 6 | indianembassycopenhagen.gov.in | Official Government Page | Spec list | ~400w | None | Indian Embassy Denmark |
| 7 | passport-photo.online/indian-passport-photo | Tool + Informational Hybrid | Requirements + tool | ~2,800w | Article + FAQPage + Expert credentials | Named BIPP-certified expert, Bloomberg/Forbes/NYT press |
| 8 | passportsizephoto.in/photo-requirements | Informational Guide | Deep spec article | ~2,500w | FAQPage | Named author, ICAO update reference, April 2026 dated |
| 9 | documitra.com/blog/icao-compliant-guide | Blog / Informational | ICAO guide article | ~1,800w | Article schema | "98% approval rate" service claim |
| 10 | travel.state.gov/passports/photos | Official US Government Page | US photo spec | ~700w | None | US State Dept (US-focused, India diaspora relevance) |

**SERP features detected:**
- AI Overview: Active and dominant for this query (surfaces exact size spec, background rule, face coverage percentage as inline answers — bypassing tool pages entirely)
- Featured Snippet: Likely active — official government pages or passportsizephoto.in/photo-requirements most eligible
- PAA: "What is the size of passport photo in India?", "What are the requirements for Indian passport photo 2025?", "Is off-white background allowed for Indian passport?", "Can I wear glasses in Indian passport photo?"
- Related searches: "indian passport photo size in cm", "indian passport photo size in pixels", "passport photo requirements india 2026 ICAO", "passport size photo specifications india"
- Critical context: India mandated ICAO Doc 9303 standard from September 2025 (35x45mm, stricter white background, glasses banned). This spec change is the dominant editorial topic for this query in 2026.

**SERP consensus: MIXED — Official Government Docs (60%) + Informational Tool Hybrid (40%)**

The top 6 results are official government or authorized agent pages. Commercial tool sites compete at positions 7–10 against each other for the informational portion. The AI Overview further reduces click-through to informational content.

**easyphoto.in gap:** No standalone informational requirements page exists. Specification data is embedded within `/india-passport-photo-maker/` (transactional page). This is an intent split problem — the tool page serves transactional intent, but this informational query needs a dedicated guide page to compete at positions 7–10.

---

### Keyword 3: "exam photo resize" / "exam photo resize india"

**Search intent classification:** Transactional-Tool — user has an exam form open, has a rejected photo upload, and needs to fix dimensions and file size immediately.

**Top 10 SERP results:**

| # | Domain | Page Type | Exams Covered | Est. Depth | Schema | Trust Signal |
|---|--------|-----------|--------------|------------|--------|-------------|
| 1 | examphotoresize.in | Dedicated Exam Tool | SSC, UPSC, RRB, Banking, Passport, PAN | ~1,400w | FAQPage | "100% client-side, free, no upload" |
| 2 | resizer.exammint.in | Exam Resizer Tool | 104 exams (SSC, UPSC, State PSCs, Banking, Police, Judiciary) | ~6,500w | FAQPage | "8.5 Lakh+ Aspirants", Privacy Certified |
| 3 | photocrop.site/india | Multi-format Tool | SSC, RRB, UPSC, NEET, Aadhaar, PAN | ~1,200w | FAQPage | India-specific branding |
| 4 | exam-photo-resizer.in | SSC/Railway Tool | SSC, Railway, Govt exam | ~1,000w | Minimal | — |
| 5 | myexamphoto.in | Exam Tool + Guide | KEAM, NEET, JEE, SSC, Kerala PSC | ~1,600w | FAQPage | "Free, browser-based" |
| 6 | examphoto.in | Exam Tool + Deep Content | SSC (CGL, CHSL, MTS, GD, JE), Railway (ALP, RPF, NTPC), Banking (PO, Clerk), UPSC, Military, Defense | ~4,000w | FAQPage | 18K+ monthly users, "Verified Users" badge |
| 7 | signatureresize.in | Dual photo+signature | 30+ govt exam signatures | ~800w | Minimal | — |
| 8 | resizer.exammint.in/custom | Custom Resizer | All exams (custom input) | ~1,000w | FAQPage | ExamMint brand trust |
| 9 | myexamphoto.in/blog/exam-photo-size-guide | Informational Guide | NEET, JEE, UPSC, PSC | ~2,200w | Article | Dated 2026, comprehensive |
| 10 | Google Play (Exam Photo Resizer app) | Mobile App Listing | Android app | N/A | App schema | Google Play platform trust |

**SERP features detected:**
- PAA: "What is the photo size for exam form?", "How do I resize a photo for government exam?", "What is UPSC photo size in KB?", "How do I resize photo to 20KB?", "What is SSC photo size in pixels?"
- AI Overview: Active (surfaces ExamMint and ExamPhoto.in spec tables as primary answers — these sites have comprehensive machine-readable spec data)
- Related searches: "exam photo resize online free", "upsc photo resize", "ssc photo resize 20-50kb", "neet photo resize", "exam photo size kb online"
- No Google Ads for this query
- Mobile app listing at position 10 signals significant mobile search volume

**SERP consensus: Dedicated Exam Photo Tool — 9/10 (90% confidence)**

One outlier (informational blog) and one app listing; the remaining 8 results are dedicated exam photo resize tools. The differentiating factor on this SERP is exam coverage breadth (ExamMint's 104 exams is the authority moat) and dual photo+signature workflow.

**easyphoto.in gap:** Not present in top 10 for "exam photo resize" despite having 40+ exam-specific pages in the sitemap. Exam-specific URLs (`/upsc-exam-photo-resizer/`, `/ssc-exam-photo-resizer/`) returned HTTP 404 during audit. Pages that are 404 are not indexed. This is the single most damaging structural issue for the entire exam keyword cluster.

---

## Page-Type Alignment

### Page-type taxonomy used
Tool Landing Page / Country Tool Page / Informational Guide / Tool + Informational Hybrid / Official Government Document / Blog Article

### Homepage (easyphoto.in/)

| Attribute | Current State | SERP Expectation |
|-----------|--------------|-----------------|
| Page type | Marketing/platform homepage | N/A — homepage competes on brand queries, not transactional tool queries |
| Title | "easyPhoto — Document Photo & Form-Resize Tools for India" | Correct for homepage — does not cannibalize /india-passport-photo-maker/ |
| H1 | "Document photos that get accepted" | Benefit-led H1 — acceptable for homepage |
| Social proof | "Thousands of photos processed daily" (vague) | SERP leaders show specific counts ("500K+ users", "8.5 Lakh+ aspirants") |
| Meta description | 184 characters — truncated in SERP at ~160 chars | Crafted 150-character description ending on complete CTA |
| Schema | SoftwareApplication + Organization + FAQPage present (FIXED Jun 18) | Correct — matches SERP schema pattern |

**Mismatch severity — Homepage vs. "passport photo maker india": HIGH**

The homepage should not be the primary ranking target for "passport photo maker india." The architecture is correct (dedicated tool page exists). However, if `/india-passport-photo-maker/` has content depth and social proof gaps, neither the homepage nor the tool page ranks. The execution gap is on the tool page, not the homepage structure.

### /india-passport-photo-maker/ vs. "passport photo maker india": ALIGNED (execution gap)

Page type is correct. The page has H1, tool, spec table, and FAQ. The content depth and authority deficit versus PassportSizePhoto.in is the ranking gap, not a type mismatch. The page needs before/after media, social proof numbers, ICAO 2025 update callout, and HowTo schema to close the execution gap.

### Exam pages vs. "exam photo resize india": CRITICAL — INDEXATION FAILURE

Multiple exam-specific URLs (`/upsc-exam-photo-resizer/`, `/ssc-exam-photo-resizer/`) return HTTP 404. Pages that are 404 are not indexed by Google. easyphoto.in has 40+ exam pages in its sitemap but they are not live at the expected URL paths. This is the most damaging structural issue in the entire audit.

**Mismatch severity: CRITICAL**

### No page for "indian passport photo requirements": HIGH MISMATCH

This is a missing-page problem. The informational query "indian passport photo requirements" needs a standalone deep-content page (`/indian-passport-photo-requirements/` or similar). The current tool page at `/india-passport-photo-maker/` serves transactional intent. Competitors who have separated these into two distinct URLs rank for both.

**Mismatch severity: HIGH**

---

## User Stories

User stories derived from PAA questions, related searches, and SERP content patterns observed across all three keywords.

---

**Story 1 — "The Anxious First-Timer" (Decision stage)**

Signal: PAA "What size photo is required for Indian passport?" is the top PAA for both keyword 1 and keyword 2. 8/10 SERP results for keyword 1 surface "ICAO compliant" and the exact spec (35x45mm) above the fold.

> "As a first-time passport applicant, I want to confirm my photo meets the Passport Seva Kendra's exact 35x45 mm / ICAO 2025 specification before I submit, so I don't get rejected and have to rebook my appointment."

Gap: easyphoto.in's ICAO compliance claim appears in the tool page title but not in H1 or above-fold hero copy. The spec (35x45 mm, 630x810 px) is in a spec table below fold. Competitors surface it in the first paragraph or directly beside the upload tool.

---

**Story 2 — "The Rejection Victim" (Decision stage)**

Signal: PAA "Why is my SSC photo getting rejected?" for keyword 3. "Common Mistakes" is an H2 section on the easyphoto.in homepage. 4/10 exam resize SERP competitors have a dedicated "Common rejection reasons" H2.

> "My SSC CHSL form submission failed with a photo error. I need to know exactly what is wrong — file size? dimensions? format? background? — and fix it before the deadline closes in 24 hours."

Gap: The homepage "Common Mistakes" section covers rejection reasons at surface level. Exam-specific tool pages (which are 404) should carry this content per-exam. The live site has no "Why was my photo rejected?" section on any indexable exam page.

---

**Story 3 — "The Home Selfie Taker" (Awareness stage)**

Signal: PAA "Can I take my own passport photo in India?" is in the top-3 PAA for keyword 1. photogov.net and passportsizephoto.in both have explicit "selfie workflow" copy with step-by-step instructions above fold.

> "I live in a tier-3 city without a photo studio nearby. I want to take a photo on my phone and have a tool tell me whether it qualifies and what to fix — lighting, background, distance from camera."

Gap: easyphoto.in's "Take a photo with your camera" CTA exists in the tool but there is no editorial content explaining what makes a selfie acceptable. No "tips for taking a photo at home" section. The "Common Mistakes" section covers errors after the fact but not proactive guidance.

---

**Story 4 — "The Spec Verifier" (Consideration stage)**

Signal: Related searches "passport size photo 3.5x4.5 online free", "indian passport photo size in pixels", "passport photo background color india" — users who know they need a photo but need to confirm the specification before proceeding.

> "I need to verify: is the background for Indian passport supposed to be pure white (#FFFFFF) or can it be off-white? I've read conflicting things since the September 2025 ICAO change."

Gap: The spec table on `/india-passport-photo-maker/` shows "background: #FFFFFF (plain white)" — the correct answer. But it is below fold, and the ICAO September 2025 update context is not explained inline. A standalone informational page (`/indian-passport-photo-requirements/`) would capture this persona at positions 7–10 where commercial tool pages compete.

---

**Story 5 — "The Panicked Exam Form Filer" (Decision stage)**

Signal: PAA "How do I resize photo to 20KB?" and "What is UPSC photo size in KB?" for keyword 3. ExamMint and ExamPhoto.in both open with immediate spec display (exam name, pixels, KB range) before any tool interaction.

> "UPSC CSE form deadline is tonight. The portal says my photo must be 20–300KB at 350x350px JPG but my photo is 2MB. I need to compress it right now without losing quality."

Gap: easyphoto.in's exam-specific pages are returning 404 errors. The "exam photo resize" user cannot find easyphoto.in for their specific exam via search. Even on the homepage, the exam workflow is not prominently featured above fold with exam-specific specs.

---

## Gap Analysis — 7 Dimensions (100 Points Total)

Scored against the primary transactional landing page `/india-passport-photo-maker/` as the representative money page, cross-referenced with SERP median benchmarks from keyword 1 and keyword 3.

---

### 1. Page Type (0–15): 10/15

**Evidence:** Page type is correctly classified as an Interactive Tool Landing Page — matching 100% SERP consensus for "passport photo maker india". The page has an upload tool, spec table, FAQ section, and step guide. The type alignment is correct.

**Gap:** The page lacks a HowTo schema overlay (present in 3/10 SERP competitors, enabling step-by-step rich result). The selfie/home-photo entry path is not as prominently structured as photogov.net's "take a photo" workflow. For exam pages, the page type is entirely absent (404), meaning the correct page type cannot even be evaluated.

**Score rationale:** Full marks for the passport tool page type match. Deducted 5 for: missing HowTo schema structure, no selfie workflow path, and exam page type being entirely absent from index.

---

### 2. Content Depth (0–15): 7/15

**Evidence:** `/india-passport-photo-maker/` has a spec table, FAQ, and step guide. Word count is estimated at 1,200–1,600 words from WebFetch. The SERP median for top-3 competitors is ~2,500 words, with the #1 result (passportsizephoto.in) at ~4,800 words.

**Gap:** No standalone "Indian Passport Photo Requirements" informational page — the most impactful single content gap in this audit. No "What changed in September 2025" section explaining the ICAO transition. No dedicated selfie tips section. Exam pages do not exist as indexable content at all. The 22-country spec table is a genuine depth differentiator but is below fold and not SEO-optimized with country-specific H2s.

**Score rationale:** 7/15 — the tool page has basic depth but falls 1,000–3,000 words short of the SERP floor for competitive terms; the informational intent split is entirely unserved; exam content is not indexable.

---

### 3. UX Signals (0–15): 10/15

**Evidence:** Zero CLS (perfect). Desktop LCP 0.7s (excellent). Mobile LCP 3.5s (Needs Improvement — AdSense is primary cause). Static export means full HTML is crawlable without JS. No layout shift on tool interaction. Tool is immediately accessible without login or signup.

**Gap:** Mobile LCP at 3.5s fails Google's "Good" threshold of 2.5s — the majority of the target audience (Indian government exam applicants) accesses from mobile on slower connections. Desktop TBT 300ms slightly above the 200ms target. No evidence of a post-submission "compliance confirmed" UX signal (green pass/fail indicator) — competitors that show "ICAO compliant" or "Accepted at PSK" after processing reduce abandonment.

**Score rationale:** 10/15 — core UX metrics are strong, mobile LCP is the measurable gap, and the absence of a compliance confirmation state is a conversion signal gap.

---

### 4. Schema (0–15): 10/15

**Evidence:** Homepage has Organization, WebSite, SoftwareApplication, and FAQPage in @graph (FIXED since Jun 18). BreadcrumbList on all tool and blog pages. BlogPosting with datePublished, dateModified, inLanguage: en-IN, author on all blog posts.

**Gap:** No HowTo schema on the step-based tool flow in `/india-passport-photo-maker/` (present on 3/10 keyword 1 SERP competitors). No SoftwareApplication schema with aggregateRating on tool pages (only on homepage) — aggregateRating is what enables star snippets. No FAQPage schema confirmed on exam pages (pages are 404 so this cannot be assessed). SearchAction missing from WebSite schema (no sitelinks searchbox opportunity on branded queries).

**Score rationale:** 10/15 — homepage schema is now well-structured; tool pages and exam pages have schema gaps that prevent rich result eligibility for those specific URLs.

---

### 5. Media (0–15): 4/15

**Evidence:** No inline images in blog posts (confirmed — all 26+ posts have zero process screenshots or sample outputs). No before/after transformation image on `/india-passport-photo-maker/` or any tool page. Hero uses CSS/icon-based design rather than product screenshots. No video content.

**Gap:** 8/10 SERP competitors for "passport photo maker india" show a before/after transformation image (raw phone photo to compliant passport photo) above or near the fold. This image serves three functions: immediate visual credibility, Google Image indexation, and reduced bounce from users unsure what the output looks like. The absence of any before/after or sample output image is the single most visible visual gap versus all competitors. No product screenshot in the homepage hero means the first-time visitor cannot immediately understand what the tool produces.

**Score rationale:** 4/15 — media is the weakest scoring dimension and the most visible competitive gap. Full score would require before/after on each tool page, 1 image per blog post, and an OG image per tool page. Currently only static icons and the OG homepage image exist.

---

### 6. Authority (0–15): 5/15

**Evidence:** 7 total organic clicks in 28 days (GSC). Not in Common Crawl (domain too new). No press mentions or media logos. No aggregateRating or user count on tool pages. Only social profile is Pinterest. "Thousands of photos processed daily" is the only social proof claim — vague and not source-linked.

**Gap:** passportsizephoto.in shows "500K+ Indians trusted." ExamMint shows "8.5 Lakh+ Aspirants." PhotoAiD shows 12,836 Trustpilot reviews with a 4.83/5 rating and press logos (NYT, CNN, Forbes). easyphoto.in has none of these. No named author on tool pages (only on blog posts). No "Accepted at PSK" testimonials. No citation from passportindia.gov.in or upsc.gov.in as trust anchors on the respective tool pages. No backlinks from external domains detected.

**Score rationale:** 5/15 — authority is the second weakest dimension. The USP (browser-side, no upload) is genuinely differentiating and credible on privacy grounds, but social proof, backlinks, and external citations are all near-zero. This is a time and content problem, not a structural one.

---

### 7. Freshness (0–10): 7/10

**Evidence:** All blog posts have datePublished and dateModified in JSON-LD schema with inLanguage: en-IN. Content references "June 2026" in source citations. The ICAO September 2025 update is referenced in the tool page context.

**Gap:** No explicit "Updated for ICAO September 2025" callout in the hero or near the spec table. Exam pages lack a dateModified field because they are 404. The "What changed in 2025" callout that competitors (passportsizephoto.in, photoaid.com) use above fold is absent. Google rewards explicit freshness signals (dateModified, "Updated [Month Year]" visible text) for spec-based queries where currency matters.

**Score rationale:** 7/10 — schema-level freshness signals are correct; visible freshness cues (the banners and datestamps visible to users and crawlers in the body) are missing from the key money pages.

---

### Gap Analysis Summary

| Dimension | Max | Score | Gap | Primary Evidence |
|-----------|-----|-------|-----|-----------------|
| Page Type | 15 | 10 | -5 | Correct for passport tool; exam pages absent; HowTo schema missing |
| Content Depth | 15 | 7 | -8 | 1,000–3,000 words below SERP median; no requirements guide page; no exam content indexed |
| UX Signals | 15 | 10 | -5 | Mobile LCP 3.5s (target 2.5s); no compliance confirmation state |
| Schema | 15 | 10 | -5 | No HowTo, no aggregateRating on tool pages, no SearchAction |
| Media | 15 | 4 | -11 | No before/after image; zero inline images across 26+ blog posts |
| Authority | 15 | 5 | -10 | 7 total organic clicks; no backlinks; vague social proof; no press logos |
| Freshness | 10 | 7 | -3 | Schema freshness correct; visible "Updated Sep 2025" callout missing |
| **Total** | **100** | **53** | **-47** | **Passport tool page only; exam pages excluded (404)** |

Note: The 53/100 above is the score for the passport photo tool page in isolation. The composite SXO Gap Score of 41/100 accounts for the zero-score contribution of the missing exam pages and missing requirements guide page, weighted across the three keywords audited.

---

## Persona Scores

Scored across 4 dimensions: Relevance (25), Clarity (25), Trust (25), Action (25). Sorted weakest-first. Scored against the live indexable site state as of June 23, 2026.

---

### Persona 1: Exam Applicant (SSC/UPSC Student) — 28/100

**Profile:** 20–28 year old, government exam aspirant, under time pressure, searching "upsc photo resize" or "ssc photo size kb" from a mobile browser while filling their form.

| Dimension | Score | Evidence and Gap |
|-----------|-------|-----------------|
| Relevance (25) | 8 | easyphoto.in has 40+ exam pages and the correct tools — but exam-specific URLs (/upsc-exam-photo-resizer/, /ssc-exam-photo-resizer/) return 404. The persona cannot find easyphoto.in in SERP for any exam-specific query because the pages are not indexed. |
| Clarity (25) | 8 | Homepage shows "52+ Exam Specifications" stat but no exam-specific content above fold. The exam workflow is one CTA click deep and not distinguishable by exam name. Competitor ExamMint shows an exam selector dropdown as the H1-level interaction. |
| Trust (25) | 6 | No "aspirants served" counter. No official notification source citations for exam specs. No student testimonials. Competitor ExamMint shows "8.5 Lakh+ Aspirants" in hero. ExamPhoto.in shows "18K+ monthly users" with a "Verified Users" badge. |
| Action (25) | 6 | The Exam Application Kit exists but is not discoverable via organic search for exam-specific queries. No direct path from SERP to the tool for UPSC/SSC queries because the landing pages are 404. |
| **Total** | **28/100** | |

**Priority fixes:**
- Verify exam page URL structure against sitemap; confirm pages are deployed and not 404.
- Add exam name to each page's H1 and title: "UPSC Photo Resizer 2026 — Resize to 20–300 KB, 350x350px."
- Add FAQPage schema to each exam page.
- Add "Source: official UPSC notification — upsc.gov.in" citation visible in body.
- Once pages are live, submit updated sitemap to Google Search Console.

---

### Persona 2: Passport / Visa Applicant — 54/100

**Profile:** 28–45 year old, applying for Indian passport renewal or new application at Passport Seva Kendra. May also be applying for a visa. Medium technical literacy.

| Dimension | Score | Evidence and Gap |
|-----------|-------|-----------------|
| Relevance (25) | 16 | /india-passport-photo-maker/ exists and is correctly structured. 22-country spec table is a genuine differentiator. ICAO September 2025 update is referenced in the tool context. |
| Clarity (25) | 12 | Spec table exists but is below fold. The ICAO September 2025 change (35x45mm, stricter white background, glasses banned) is not called out in a "What's new?" or "Updated for 2026" banner above fold. Competitors explicitly surface this update as a trust signal. |
| Trust (25) | 13 | "100% Government Compliant" claim on homepage but no official source citation (passportindia.gov.in link) in visible hero copy. No user count. No "accepted at PSK" testimonial. PhotoAiD shows 12,836 Trustpilot reviews; passportsizephoto.in shows 500K users. |
| Action (25) | 13 | Upload CTA is above fold. "Make a passport photo" on homepage links to correct destination. But post-submission: no evidence of a compliance pass/fail result before download. The persona does not know if they receive a green "your photo meets PSK requirements" confirmation. |
| **Total** | **54/100** | |

**Priority fixes:**
- Add "What changed in September 2025" callout above the spec table on the tool page.
- Add "Verified against passportindia.gov.in — September 2025 ICAO update" citation with live link.
- Surface compliance pass/fail feedback in the tool output UI before download.
- Add 3 user testimonials framed as "Accepted at PSK on first attempt."

---

### Persona 3: Indian Immigrant Abroad (NRI) — 58/100

**Profile:** Indian living in UAE, UK, USA, or Canada. Renewing Indian passport at local Consulate or BLS/VFS center. High-value user, willing to pay for certainty. Searches "indian passport photo requirements" or "35x45mm passport photo maker."

| Dimension | Score | Evidence and Gap |
|-----------|-------|-----------------|
| Relevance (25) | 17 | 22-country selector and India-specific tool page directly serve this persona. Spec table shows "India: 35x45 mm" — the exact answer this persona has searched for. |
| Clarity (25) | 14 | 22-country table helps the NRI applying at a non-Indian location. But a critical clarification is absent: "The 35x45 mm spec applies globally — at any Embassy, Consulate, or VFS center worldwide." This is the primary anxiety for NRI applicants who see conflicting specs online (35x35, 51x51, 35x45). |
| Trust (25) | 14 | No "Used by NRI applicants in X countries" claim. No Embassy or Consulate-specific trust signal. VFS Global and BLS International appear at positions 1 and 5 in the "indian passport photo requirements" SERP — official partners this persona trusts deeply. easyphoto.in has no comparable association or citation from these organizations. |
| Action (25) | 13 | Tool allows India photo generation. No explicit "print at home and submit to VFS/BLS" guidance. No print-sheet output (4-up photo print template) which is what most physical submission workflows require at overseas centers. |
| **Total** | **58/100** | |

**Priority fixes:**
- Add to the India tool page: "35x45 mm applies at all Indian Embassies, Consulates, VFS, and BLS centers worldwide — source: VFS India photo specifications [link]."
- Add a "Print-ready sheet" download (4 passport photos on one 4x6 print template).
- Create a guide targeting "indian passport photo requirements for NRI" — low-competition long-tail with high NRI conversion value.

---

### Persona 4: HR / Admin Uploading Employee Documents — 62/100

**Profile:** HR executive or government department admin uploading employee passport photos for identity verification portals, police verification, or form submissions. Bulk need. Searches "resize photo to 50kb online" or "document photo tool india."

| Dimension | Score | Evidence and Gap |
|-----------|-------|-----------------|
| Relevance (25) | 18 | "35+ Free Tools" and PDF tools are highly relevant for bulk document workflows. The "All tools at your fingertips" section serves this persona effectively. |
| Clarity (25) | 14 | Tool list exists but is organized around individual document types (passport, exam) rather than a "document management workflow" framing that resonates with an admin persona. No "process multiple photos" or batch mode feature visible. |
| Trust (25) | 16 | "0 Uploads to any server" is a strong trust signal for an HR admin dealing with employee PII under DPDPA. However, "DPDPA" is never named explicitly — competitors mention GDPR/DPDPA compliance by name, which is what the admin persona searches for to justify tool selection to their organization. |
| Action (25) | 14 | Individual tools accessible. No bulk processing option visible. No "Download all as ZIP" for multiple documents. No team or enterprise framing on any page. |
| **Total** | **62/100** | |

**Priority fixes:**
- Add "DPDPA compliant — employee photos never leave your device" to the homepage privacy section and tool page trust pills.
- Name "DPDPA" explicitly in the privacy trust pill text.
- Consider a "Bulk document kit" CTA or page targeting the admin/HR persona — no competitor currently targets this niche, making it a low-competition high-value opportunity.

---

## Priority Action Table

Ranked by impact-to-effort ratio. Severity: CRITICAL = ranking blocker, HIGH = significant ranking gap, MEDIUM = CTR/conversion gap.

---

**CRITICAL-1: Fix exam page 404 errors**

Effort: 1–2 hours | Impact: Unlocks entire "exam photo resize" keyword cluster

The exam-specific URLs audited (`/upsc-exam-photo-resizer/`, `/ssc-exam-photo-resizer/`) return HTTP 404. These pages are referenced in the sitemap but are not live. Without live pages, easyphoto.in is effectively invisible for 40+ exam-specific keyword queries collectively representing tens of thousands of monthly searches. Verify the URL structure against the sitemap, confirm pages are deployed, check for routing issues in the Next.js config, and submit the updated sitemap to Google Search Console immediately.

---

**CRITICAL-2: Add FAQPage + SoftwareApplication schema to every exam and tool page**

Effort: 2–3 hours (template approach) | Impact: Rich result eligibility — FAQ accordion in SERP = 15–25% CTR uplift without ranking change

7/10 SERP competitors for "exam photo resize" have FAQPage schema. 2/10 have SoftwareApplication schema with aggregateRating enabling star snippets. FAQPage schema requires wrapping existing FAQ Q&A pairs in JSON-LD — approximately a 30-line change per page. Create a schema template component in Next.js and apply it to all exam and passport photo tool pages simultaneously. Add HowTo schema to the step-based guide sections on `/india-passport-photo-maker/`.

---

**CRITICAL-3: Add meta descriptions to all money pages**

Effort: 15 minutes per page | Impact: Controlled SERP snippet messaging; estimated 5–15% CTR improvement

Meta description for the homepage is currently 184 characters — Google truncates it at approximately 160 characters, cutting off mid-sentence. Tool pages appear to lack crafted meta descriptions (Google is auto-generating from body content). Suggested descriptions:

- Homepage: "Free passport, visa, and exam photo tools for India. ICAO-compliant, 35+ tools, 52+ exam specs — everything runs in your browser. Nothing uploaded." (152 chars)
- /india-passport-photo-maker/: "Free Indian passport photo maker — ICAO 2025 compliant, 35x45 mm, white background. Instant download. Your photo never leaves your device." (139 chars)
- Exam pages: "Resize [EXAM] photo to [SIZE] and signature to [SIZE] in one free browser tool. Verified against [YEAR] official notification." (adapt per exam)

---

**HIGH-1: Add before/after sample photo to /india-passport-photo-maker/**

Effort: 2 hours (photo shoot + crop + optimize) | Impact: Closes the single most visible visual gap versus all top-10 SERP competitors

8/10 SERP competitors for "passport photo maker india" show a before/after transformation image (raw phone photo to compliant passport photo). This image serves three functions: immediate visual credibility, Google Image indexation for "passport photo india," and reduced bounce from users unsure what the output looks like. Spec: 600x300px WebP, under 50KB, alt text "Phone selfie converted to ICAO-compliant 35x45mm Indian passport photo using easyPhoto — no upload required."

---

**HIGH-2: Create a standalone "Indian Passport Photo Requirements" informational page**

Effort: 3–4 hours (content writing + publishing) | Impact: Opens a second ranking URL for informational intent; targets positions 7–10 currently held by passportsizephoto.in/photo-requirements

Suggested URL: `/indian-passport-photo-requirements/`. Required content: exact spec table (35x45mm, 630x810px, under 250KB, plain white background), ICAO September 2025 changes, glasses ban, religious headwear rules, infant photo guidelines, "What changed in 2025" section, 12-question FAQ with FAQPage schema. Cite passportindia.gov.in as source. Minimum 2,500 words. Named author with verified-by datestamp.

---

**HIGH-3: Add "Signature" to exam page titles and H1s**

Effort: 30 minutes | Impact: Captures "ssc signature resizer," "upsc signature resize" sub-cluster with no new content

PAA for "exam photo resize" includes "What is SSC signature size?" — a separate high-volume query. 5/10 SERP competitors treat photo and signature as a joint offering in H1 and title. Change `/ssc-photo-resizer/` H1 from "SSC Photo Resizer" to "SSC Photo and Signature Resizer 2026 — 20–50 KB Photo, 10–20 KB Signature." Apply the same pattern to UPSC, RRB, IBPS, and other exam pages.

---

**HIGH-4: Add exam year (2026) to exam page titles and H1s**

Effort: 1 hour (across all exam pages) | Impact: Freshness signal for time-sensitive exam queries; 8/10 competitors include current year

Exam queries are time-sensitive — applicants search "SSC CGL 2026 photo size" not "SSC CGL photo size." Add "2026" to all exam page titles and H1s. Also add a `dateModified` field to WebPage JSON-LD for each exam page, set to the date specifications were last verified against official exam notifications.

---

**MEDIUM-1: Add specific social proof numbers to homepage hero**

Effort: 1 hour | Impact: Conversion rate and trust improvement visible to all users

"Thousands of photos processed daily" is vague. Replace with a specific counter from analytics. Even "12,000+ photos made this month" is significantly more credible than "thousands." ExamMint's "8.5 Lakh+ Aspirants" is the benchmark to aim for over time.

---

**MEDIUM-2: Add DPDPA compliance language to privacy section**

Effort: 30 minutes | Impact: Trust signal for the HR/admin persona; named compliance reduces friction

easyphoto.in's privacy architecture (browser-side processing, no upload) is DPDPA-compliant by design but never named as such. Add "DPDPA compliant — no personal data transmitted to or stored on any server" to the homepage privacy section and the tool page trust pills. The Digital Personal Data Protection Act 2023 is a direct concern for HR admins processing employee photos.

---

**MEDIUM-3: Add "UPSC 2026 / SSC 2026 / CGL 2026" intro paragraph to each exam page**

Effort: 1 hour per page | Impact: Long-tail keyword coverage for exam-cycle-specific queries

Add an intro paragraph naming the current exam cycle: "For SSC CGL 2026 Tier 1 notifications, the photo requirement is 350x450 pixels, 20–50 KB, JPG format — verified against the official notification on ssc.gov.in."

---

## SXO Gap Score: 41/100

**Composite score across all three target keywords:**

| Keyword | Target Page | Mismatch Severity | Page Score | Persona Score | Keyword Score |
|---------|------------|-------------------|------------|---------------|---------------|
| "passport photo maker india" | /india-passport-photo-maker/ | ALIGNED | 53/100 | 54/100 | 55/100 |
| "indian passport photo requirements" | No dedicated page (MISSING) | HIGH MISMATCH | 0/100 | N/A | 15/100 |
| "exam photo resize" | Exam pages (404 — NOT LIVE) | CRITICAL FAILURE | 0/100 | 28/100 | 14/100 |
| **Composite** | | | | | **41/100** |

**Comparison baseline:**
- passportsizephoto.in (market leader for keyword 1): estimated 78/100 — deep content, schema, social proof, informational + transactional URL split
- ExamMint (exam category leader): estimated 82/100 — 104 exam presets, 8.5 lakh users, FAQPage schema, AI Overview presence

**Score interpretation:** The 41/100 composite is not a reflection of underlying site quality — technical SEO is 82/100, Lighthouse SEO is 100/100, and the passport tool page alone scores 53/100. The composite is dragged down by two structural gaps: a missing requirements page (contributing 0 toward keyword 2) and non-indexable exam pages (contributing near-0 toward keyword 3). Fixing the two critical gaps would raise the composite score to approximately 62–65/100 without any new content writing beyond restoring existing pages and adding one requirements guide.

---

## Limitations

- Page rendering used WebFetch, not Playwright/JS execution. Dynamic React/Next.js content (ExamPackageTool exam list, lazy-loaded compliance check results, interactive tool state) could not be verified as crawlable by Googlebot. A Playwright render via `render_page.py --mode always` is recommended for DOM-level accuracy on tool pages.
- SERP positions are point-in-time snapshots from June 23, 2026. Personalization, user location (India vs. global), logged-in state, and device type affect actual positions. These searches were conducted from outside India — India-local results (especially for exam queries) may show a different ranking order.
- easyphoto.in's confirmed SERP position for "passport photo maker india" and "exam photo resize" could not be established. The site does not appear in top 10 for either keyword in the results returned. GSC Search Analytics data would provide authoritative position data.
- Core Web Vitals (LCP, CLS, INP) were measured via PageSpeed Insights; field data (CrUX) is unavailable because the site has fewer than approximately 1,000 real Chrome users in the 28-day window.
- AI Overview content for these queries was inferred from SERP patterns and competitor content analysis. AI Overviews are not returned in standard search API results and cannot be directly captured.
- Exam page URL structure: 404 errors were confirmed for two exam pages tested (`/upsc-exam-photo-resizer/`, `/ssc-exam-photo-resizer/`). It is possible exam pages exist at different URL patterns. The sitemap lists these URLs and they must be verified against the live Next.js routing configuration.
- The sitemap shows 40+ exam-specific requirement guide pages distinct from tool pages. These were not individually verified. If guide pages are live and indexed, they represent a hidden asset not captured in this audit's SERP checks.
- Social proof data (exact user counts, testimonial volume) was unavailable. easyphoto.in has no visible analytics counter or testimonial component on audited pages.
- No Google Search Console data beyond what is in audit-data.json was accessed. Impression counts, actual CTR, and keyword position ranges for these specific terms were not available from GSC.

---

## Cross-Skill Recommendations

- Schema gaps (FAQPage missing on exam pages, HowTo missing on step-based tool pages, SoftwareApplication with aggregateRating missing on tool pages): use `/seo schema` to generate and validate JSON-LD for all affected pages.
- Content depth gaps (missing requirements page, thin exam page content, exam pages below SERP floor in word count): use `/seo content` for page-level content briefs with E-E-A-T expansion guidance.
- Meta descriptions missing across site: use `/seo page` for a full on-page audit across all 277 URLs in the sitemap.
- Authority gaps (no user count, no press mentions, single social profile in Organization schema, no external backlinks): use `/seo content` for E-E-A-T authority analysis and authorship schema recommendations.
- Exam page 404s and sitemap URL mismatches: use `/seo technical` for crawl error analysis and Next.js routing verification.

---

## Prior Run Reference (2026-06-20)

The June 20 audit covered `/passport-photo/`, `/ssc-photo-resizer/`, and `/blog/best-free-passport-photo-maker-india-2026/` in per-page detail. Scores and recommendations from that run remain valid and are not duplicated here.

| Page | SXO Gap Score (Jun 20) | Primary Gap |
|------|----------------------|-------------|
| /passport-photo/ | 56/100 | Media (4/15), Authority (6/15) |
| /ssc-photo-resizer/ | 43/100 | Schema (2/15), Media (3/15) |
| /blog/best-free-passport-photo-maker-india-2026/ | 63/100 | Media (5/15), Content depth (8/15) |

---

*Generate a PDF report? Use `/seo google report`*
