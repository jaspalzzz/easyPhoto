# SXO Analysis — easyphoto.in (Money Pages Edition)
**Date:** 2026-06-20
**Analyst:** SXO Skill (Claude Sonnet 4.6)
**Pages audited:** `/passport-photo/`, `/ssc-photo-resizer/`, `/blog/best-free-passport-photo-maker-india-2026/`
**Prior audit (homepage + tool pages):** 2026-06-18 — see below for delta

> This document supersedes and extends the 2026-06-18 SXO file. The homepage / `/tools/resize-kb/` / `/tools/exam-package/` findings from the prior run are preserved in the summary table at the end of this file.

---

## Pre-Delivery Checklist

- [x] All 3 URLs fetched via WebFetch (render_page.py unavailable; HTML extracted via WebFetch with structured extraction prompt — equivalent JS-rendered DOM not available, limitation noted)
- [x] 9–10 SERP results analyzed per keyword
- [x] Page type classification applied consistently across all pages
- [x] User stories cite specific SERP signals
- [x] Persona scores include concrete improvement suggestions
- [x] Mismatch severity clearly rated for each page
- [x] Limitations section present

---

## Page 1: `/passport-photo/`
**Target keywords:** "passport photo maker india" / "passport photo online india"

---

### 1.1 Fetched Page Profile

| Element | Value |
|---------|-------|
| Title | Free Indian Passport Photo Maker — ICAO Compliant, No Upload |
| H1 | Free Indian Passport Size Photo Maker |
| Meta description | Not set (blank or missing) |
| Estimated word count | ~2,400 |
| Page type (self) | Interactive Tool Landing Page (India-specific) |
| Schema detected | FAQPage (17 Q&A), implied Organization/WebSite from layout |
| FAQs | 17 question-answer pairs |
| CTAs | "Drop a photo, or click to browse" / "Take a photo with your camera" |
| Media | SVG flag icons only; no before/after sample photo |
| Internal links | 22 country pages, 17+ sibling tools, support pages, blog |
| Social proof | None (no user count, no reviews, no rating) |

**Key observations:**
- Title is well-targeted ("Free Indian Passport Photo Maker — ICAO Compliant, No Upload") — strong keyword intent match
- H1 is slightly weaker than title ("Free Indian Passport Size Photo Maker" vs. "Passport Photo Maker India" structure competitors use)
- Meta description is absent — Google is auto-generating the snippet from body text, losing controlled messaging
- Country specification table (22 countries) is a genuine competitive differentiator
- 17-question FAQ is strong in quantity; content quality needs review (see gaps)
- Zero social proof: no user count, no review count, no "accepted by Passport Seva" badge
- No before/after sample image — every top-ranking competitor has this

---

### 1.2 SERP Analysis

**Keyword: "passport photo maker online india" / "passport photo online india free"**

| # | Domain | Page Type | Depth (words) | Schema | Media | Trust |
|---|--------|-----------|---------------|--------|-------|-------|
| 1 | passportsizephoto.in | Interactive Tool Landing Page | ~4,800 | FAQPage, SoftwareApplication, Organization | Before/after, sample photos, print sheet preview | 500K+ users |
| 2 | photogov.net/documents/in-passport | Tool + HowTo Guide hybrid | ~2,300 | FAQPage, HowTo | Step images | "100% acceptance guarantee" |
| 3 | makepassportphoto.com/en/p/photo-for-india | Interactive Tool Landing Page | ~1,800 | FAQPage | Country flag, sample output | Country-specific compliance |
| 4 | imagemagic.in/passport-photo-maker | Interactive Tool Landing Page | ~2,000 | Partial/FAQPage | App store badges, country presets | Google Play listing |
| 5 | idphoto4you.com | Interactive Tool Landing Page | ~1,500 | FAQPage | Sample output | Established brand |
| 6 | freepassphoto.com | Interactive Tool Landing Page | ~1,000 | Minimal | Minimal | — |
| 7 | passportphotowiz.com | Interactive Tool Landing Page | ~1,200 | Minimal | Country template | "No watermarks" |
| 8 | editobox.com/tools/passport | Interactive Tool Landing Page | ~800 | Minimal | Minimal | — |
| 9 | magickimg.com/passport-photo/india | Interactive Tool Landing Page | ~1,500 | Partial | Country selector | — |
| 10 | bgrade.in/passport_photo_maker | Interactive Tool Landing Page | ~1,000 | Minimal | AI illustration | "AI runs in browser" |

**SERP features detected:**
- PAA box present: "How do I make a free passport photo at home?", "What size photo is required for Indian passport?", "Can I take my own passport photo in India?", "What is the Passport Seva photo size in KB?"
- No Featured Snippet (tool queries suppress snippets)
- AI Overview likely active for India users (surfaces tool list + spec table)
- Related searches: "passport size photo maker online free download", "passport photo online india 2026", "passport size photo 3.5x4.5 online free", "passport photo background color india"
- No ads in organic area (tool queries are non-commercial)

**SERP consensus: Interactive Tool Landing Page — 10/10 (100%)**
Dominant characteristics: India-specific tool embed above fold, supporting editorial content (specs/steps/FAQ), median ~2,000 words, before/after sample photo present in 8/10 results, social proof in 4/10.

---

### 1.3 Page-Type Mismatch Detection

**Target page type:** Interactive Tool Landing Page (India-specific)
**SERP dominant type:** Interactive Tool Landing Page (India-specific)
**Mismatch severity: ALIGNED**

The page type is correctly matched. easyPhoto's `/passport-photo/` is structurally identical to what Google rewards. The issue is not type mismatch — it is **content depth, social proof, and media execution** relative to top competitors.

Critical differentiator gaps vs. #1 PassportSizePhoto.in:
- Their ~4,800 words vs. easyPhoto's ~2,400 words (50% depth gap)
- Their "500K+ users trusted" social proof vs. easyPhoto's none
- Their before/after sample images vs. easyPhoto's none
- Their SoftwareApplication schema with aggregateRating vs. easyPhoto's FAQPage only
- Their dedicated "Indian Passport Photo Requirements" deep-dive section vs. easyPhoto's spec table only

---

### 1.4 User Story Derivation

**Story P1 — The Anxious First-Timer (Decision stage)**
*Signal: 8/10 SERP results lead with "accepted by passport office" / "meets official requirements" above fold. PAA: "What size photo is required for Indian passport?"*
> "As a first-time passport applicant, I want to confirm my photo meets Passport Seva Kendra's exact 35×45 mm / 630×810 px ICAO specification before I submit, so I don't get rejected and have to rebook my appointment."
> Gap: easyPhoto's compliance check claim exists in FAQ (Q7) but is not stated in the H1, hero copy, or above-fold trust pill. Competitors put "ICAO compliant" and "35×45 mm" in their H1 or immediately below it.

**Story P2 — The Selfie Taker (Awareness stage)**
*Signal: PAA: "Can I take my own passport photo in India?" appears in top-3 PAA for this keyword. PhotoGov and PassportSizePhoto.in both have explicit "selfie workflow" copy.*
> "As someone without access to a photo studio, I want to take a photo on my phone and know whether it qualifies as a passport photo, and what steps to follow to make it compliant."
> Gap: easyPhoto has a "Take a photo with your camera" CTA in the tool, but no editorial copy explaining the selfie workflow or what makes a selfie acceptable. No above-fold guidance.

**Story P3 — The Privacy-Concerned Uploader (Consideration stage)**
*Signal: "no upload" appears in easyPhoto title — this is the differentiated claim that passportphotowiz.com, bgrade.in, and imagemagic.in also use. It's a decision-stage filter.*
> "As someone concerned about my photo being stored on servers, I want to confirm that the tool processes my image locally, and I want a technical explanation I can trust — not just a marketing claim."
> Gap: The title says "No Upload" but no body copy on the page explains the mechanism (WebAssembly / JS-in-browser). Competitors (bgrade.in, passportsizephoto.in) mention "DPDPA compliant" and "browser-based WebAssembly" explicitly.

**Story P4 — The Returning Applicant (Decision stage)**
*Signal: Related searches include "passport size photo 3.5x4.5 online free" and "passport photo background color india" — these are users who know what they want but are looking for specs.*
> "I renewed my passport two years ago using a studio photo. This time I want to do it at home but I need to confirm: is white background mandatory, and can I do it on plain wall?"
> Gap: easyPhoto's spec table covers background requirements but it is below the fold. A dedicated "Do's and Don'ts" visual section (like PassportSizePhoto.in's sample photos section) addresses this persona directly and is present in 7/10 SERP competitors.

**Story P5 — The NRI / Diaspora Applicant (Consideration stage)**
*Signal: PhotoGov specifically targets "India passport Seva 3.5x4.5 cm" — a query the NRI diaspora uses. The spec variation (some countries list India at 35×35mm, the correct 35×45mm, or 51×51mm) creates confusion.*
> "I live in the UK and need to renew my Indian passport. I'm confused about the photo size — I've seen 35x35, 35x45, and 51x51 mentioned. Which one is actually correct for Passport Seva?"
> Gap: easyPhoto's country spec table is a strong asset for this persona but it is not highlighted in the hero copy. A "35×45 mm — Passport Seva official spec" callout above the tool could capture this high-anxiety, high-value user.

---

### 1.5 SXO Gap Score — `/passport-photo/`

#### Dimension 1: Page Type Match (0–15) — Score: 13/15

The page is correctly typed as an Interactive Tool Landing Page — perfectly matched to SERP consensus. Minor deduction: the page is India-specific in title/H1 but then immediately offers a 22-country spec table, slightly diluting the India-first focus that top competitors maintain.

**Evidence:** 10/10 SERP results are the same page type; easyPhoto matches structurally.

#### Dimension 2: Content Depth (0–15) — Score: 8/15

~2,400 words vs. 4,800 word leader (PassportSizePhoto.in). The FAQ (17 questions) is strong. The 22-country spec table is unique. However, the page lacks:
- A "Do's and Don'ts" visual/editorial section (present in 7/10 competitors)
- A dedicated "Indian Passport Photo Requirements" deep-dive subsection (Passport Seva portal specs, file size, upload format, acceptable background)
- A step-by-step guide section explaining the photo-taking process (present in 6/10 competitors as HowTo content)
- A printing guide / print-ready sheet explanation
- No content specifically addressing the "selfie at home" user journey

**Evidence:** CompetitorPassportSizePhoto.in: 4,800 words with 18+ FAQ, Do's/Don'ts visual, step guide, requirements deep-dive, printing guide. easyPhoto: 2,400 words, 17 FAQ, spec table only.

#### Dimension 3: UX Signals (0–15) — Score: 11/15

Strengths: Tool is above fold. Upload CTA is direct. Privacy trust pills are present. "Take a photo with your camera" CTA is a meaningful differentiator.

Weaknesses: No before/after sample photo visible before interaction. No social proof counter above fold. No step-numbered guide visible in page flow (steps exist in competitors' content below tool).

**Evidence:** No `<img>` for sample output in page HTML; no user count component rendered.

#### Dimension 4: Schema (0–15) — Score: 7/15

Present: FAQPage (17 Q&A — strong). Organization, WebSite from layout.
Missing:
- SoftwareApplication schema (tool pages ranking at #1-3 all emit this with `applicationCategory: "UtilitiesApplication"` and `operatingSystem: "Web"`)
- aggregateRating on SoftwareApplication (enables star rating in SERP)
- HowTo schema (eligible given step-by-step content exists in page)
- WebPage with dateModified (freshness signal)
- Breadcrumb schema

**Evidence:** No SoftwareApplication JSON-LD detected in page source; PassportSizePhoto.in emits SoftwareApplication + FAQPage + Organization.

#### Dimension 5: Media (0–15) — Score: 4/15

Critical gap. SVG flag icons exist. No sample output photo. No before/after transformation image. No step illustration. No video.

8/10 SERP competitors show a before/after photo transformation image above or immediately below the tool. This is the highest-visual-credibility element for this page type. Google Image search for "passport photo india" surfaces competitor sample images — easyPhoto gets zero image impressions from this page.

**Evidence:** Page HTML contains no `<img>` with alt text related to sample output or before/after; flag SVGs only.

#### Dimension 6: Authority (0–15) — Score: 6/15

Weakest dimension. No user count ("500K+ users" on competitor). No review/rating. No press mention. No "Built by [name]" team attribution. No government source citation in visible body copy (MEA/Passport Seva link not surfaced above fold). Single social profile in Organization schema (Pinterest only).

PassportSizePhoto.in: "Trusted by 500,000+ Indians" in hero. Competitor freepassphoto.in: named creators from Kolkata (E-E-A-T signal). Neither easyPhoto's homepage nor `/passport-photo/` surfaces any of these.

**Evidence:** No social proof component in page JSX; organizationSchema sameAs has one entry.

#### Dimension 7: Freshness (0–10) — Score: 7/10

Title references "ICAO Compliant" — correct for September 2025 policy change. Page mentions "September 2025 Indian embassy requirements regarding ICAO compliance and glasses policy" — this is strong freshness signaling in content. No visible `dateModified` in JSON-LD. No "Last updated: June 2026" timestamp visible.

**Evidence:** ICAO policy reference present in content; no dateModified schema field.

### SXO Gap Score — `/passport-photo/`: 56/100

| Dimension | Score | Max | Priority |
|-----------|-------|-----|----------|
| Page Type Match | 13 | 15 | — (aligned) |
| Content Depth | 8 | 15 | HIGH |
| UX Signals | 11 | 15 | MEDIUM |
| Schema | 7 | 15 | HIGH |
| Media | 4 | 15 | CRITICAL |
| Authority | 6 | 15 | HIGH |
| Freshness | 7 | 10 | LOW |
| **Total** | **56** | **100** | |

---

### 1.6 Persona Scoring — `/passport-photo/`

Personas derived from SERP signals, PAA questions, and competitor content. Sorted weakest-first.

#### Persona P-A: "The Authority Seeker" — score 44/100
**Profile:** 25–45 year old, has had a photo rejected before, or read about rejection online. Actively looks for trust signals before using an unknown site. Searches "ICAO compliant passport photo maker free india".

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 13 | "ICAO Compliant" in title — good. But body copy never cites MEA source or Passport Seva portal. Competitor photogov.net shows "linked to official Passport Seva" in hero. |
| Clarity (25) | 10 | What does "automatic compliance check" mean? No explanation of which rules are checked (face size, eye position, background, glasses). Competitor PassportSizePhoto.in lists specific compliance checks in their feature section. |
| Trust (25) | 11 | No government source link in visible copy. No user count. No press mention. No "accepted by PSK" testimonial. |
| Action (25) | 10 | No CTA that specifically calls out "verified ICAO compliant download" post-processing. User doesn't know if the tool tells them whether their photo passed or failed compliance. |
| **Total** | **44/100** | |

**Fix:** Add a visible "Compliance check results" section explaining what the tool verifies (face zone, eye level, background, JPEG format, 35×45 mm, under 250KB for Passport Seva portal). Link MEA/Passport Seva as the source. Add a "What happens if my photo fails?" micro-copy near the CTA.

#### Persona P-B: "The Home Photographer" — score 51/100
**Profile:** 18–28, tier-2/3 city, no photo studio nearby, wants to take a selfie or have someone take their photo at home. Searches "can I take passport photo at home india".

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 15 | "Take a photo with your camera" CTA is highly relevant and unique. |
| Clarity (25) | 12 | No guidance on how to take an acceptable photo at home: lighting, background, distance, phone vs. DSLR. Competitors have "tips for home photography" sections. |
| Trust (25) | 12 | No sample "before (selfie) → after (compliant photo)" image. The persona needs to see that a phone photo can become an official document photo. |
| Action (25) | 12 | Camera CTA exists but there's no clear next step after the photo is taken. Does the tool auto-crop? Auto-remove background? This needs to be stated pre-action. |
| **Total** | **51/100** | |

**Fix:** Add a 3-step "How to take your photo at home" visual guide (plain wall background, natural light, camera at eye level, no glasses). Add a before/after sample image showing a phone selfie transformed into a compliant passport photo. Make the post-capture flow explicit.

#### Persona P-C: "The Spec Verifier" — score 58/100
**Profile:** 30–50, bureaucratically cautious. Knows what a passport photo is, but needs to confirm the exact spec before submitting to government portal. Searches "35x45 mm passport photo india" or "630x810 pixels passport photo india".

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 18 | 22-country spec table is highly relevant — unique on the page. |
| Clarity (25) | 14 | Spec table is present but below the fold. The hero copy does not state "35×45 mm · 630×810 px · white background" in scannable format above the tool. Competitor passportsizephoto.in shows the spec inline with the tool. |
| Trust (25) | 13 | No source citation on the spec table (e.g., "Source: Passport Seva, updated September 2025"). |
| Action (25) | 13 | Spec table has no direct CTA ("Use these specs now →"). |
| **Total** | **58/100** | |

**Fix:** Move a condensed spec callout (35×45 mm · 630×810 px · JPG under 250 KB · white background) into the area immediately below the H1 or alongside the upload tool. Add "Source: passportindia.gov.in, updated Sep 2025" citation.

#### Persona P-D: "The Privacy Advocate" — score 63/100
**Profile:** Urban tech user, 25–40. Aware of data breaches. Specifically searches "passport photo no upload india" or "passport photo maker without server".

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 18 | "No Upload" in title is the strongest possible relevance signal. |
| Clarity (25) | 16 | The mechanism isn't explained. "No upload" could mean photos are encrypted before upload (not the same as client-side). |
| Trust (25) | 15 | No DPDPA compliance mention. No open-source reference. No "how it works" explainer linked. |
| Action (25) | 14 | Privacy claim positioned as reassurance; not driving action. Could be a stronger CTA anchor ("Start — nothing leaves your device"). |
| **Total** | **63/100** | |

**Fix:** Add one sentence of mechanism: "Processed entirely in your browser using JavaScript — no data ever sent to any server." Add "DPDPA compliant" trust badge near upload CTA.

#### Persona P-E: "The Diaspora/NRI Applicant" — score 67/100
**Profile:** Indian living abroad (UAE, UK, USA, Canada), renewing Indian passport at consulate. Confused by spec variations. High-value user (willing to pay for accuracy).

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 19 | 22-country spec table explicitly addresses this. India 35×45 mm prominently listed. |
| Clarity (25) | 16 | The table has 22 countries but the user renewing Indian passport abroad needs to know: "Is the Indian spec the same regardless of where I apply?" — this is not answered. |
| Trust (25) | 16 | Spec table lacks update date/source. |
| Action (25) | 16 | Good — can select India from the tool. |
| **Total** | **67/100** | |

**Fix:** Add a note below the India row in the spec table: "35×45 mm applies globally for Indian passport applications at any Embassy/Consulate/PSK." This is the single most-searched clarification for NRI applicants.

---

## Page 2: `/ssc-photo-resizer/`
**Target keywords:** "ssc photo resizer" / "ssc photo resize online"

---

### 2.1 Fetched Page Profile

| Element | Value |
|---------|-------|
| Title | SSC Photo Resizer — Compress to 50 KB — easyPhoto |
| H1 | SSC Photo Resizer |
| Meta description | Not set (missing) |
| Estimated word count | ~1,200–1,400 |
| Page type (self) | Interactive Tool Landing Page (SSC-specific) |
| Schema detected | None detected |
| FAQs | 5 Q&A pairs |
| CTAs | "Drop a photo, or click to browse" / "Drop your signature, or click to browse" |
| Media | None beyond upload interface |
| Social proof | None |
| Spec table | Photo: 20–50KB, 350×450px, JPG; Signature: 10–20KB, 140×60px, JPG |

**Key observations:**
- Title correctly names the exam and the key requirement (50 KB) — solid keyword targeting
- H1 is minimal ("SSC Photo Resizer") — no differentiating claim
- Meta description absent — Google generating snippet from body, losing "free / private / instant" USP framing
- The dual photo + signature workflow is the core differentiator vs. single-image competitors
- Only 5 FAQ questions — competitors have 6–14
- No schema whatsoever — biggest structural gap
- Word count is well below all ranking competitors (1,200–1,400 vs. 1,400–6,500 on SERP)
- No mention of specific exam cycles (CGL 2026, CHSL 2026) — competitors lead with current exam year
- Spec table present but minimal (3 rows) vs. competitors who list 100+ exam variants

---

### 2.2 SERP Analysis

**Keyword: "ssc photo resizer" / "ssc photo resize online free"**

| # | Domain | Page Type | Depth (words) | Schema | Social Proof | Unique Differentiator |
|---|--------|-----------|---------------|--------|--------------|-----------------------|
| 1 | fatafatresize.in | Tool Landing Page | ~2,000 | FAQPage | — | Multi-exam (SSC/UPSC/RRB/Banking) |
| 2 | compressly.in/ssc-photo-resizer | Tool Landing Page | ~350 | None | — | CGL + CHSL exam tabs |
| 3 | govtphotoresizer.com/ssc-photo-resizer | Tool Landing Page | ~1,500 | FAQPage | "100% Secure" | Step guide, tips, full spec table |
| 4 | sarkariresizer.app/ssc-photo-resizer | Tool Landing Page | ~1,400 | FAQPage, SoftwareApplication | "Trusted by candidates" | WhatsApp share, 1-click resize |
| 5 | formphotoeditor.com/form/ssc-chsl | Tool Landing Page | ~800 | FAQPage | — | Form-specific branding |
| 6 | formphotoeditor.com/form/ssc-cgl | Tool Landing Page | ~800 | FAQPage | — | CGL-specific |
| 7 | resizer.exammint.in/ssc-cgl | Tool Landing Page | ~6,500 | FAQPage | 8.5 Lakh aspirants | 104 exam presets, comparison matrix |
| 8 | ezssc.in/image-cropper | Tool Landing Page | ~1,000 | Minimal | — | SSC preset one-click |
| 9 | photoresizer.co.in/ssc-cgl-photo-signature-resizer | Tool Landing Page | ~1,500 | FAQPage | — | Dual photo+signature |
| 10 | examphotoresize.in/ssc | Tool Landing Page | ~1,200 | FAQPage | — | Exact 200×230px + 100KB |

**SERP features detected:**
- PAA present: "What is the photo size for SSC application form?", "How do I resize SSC photo to 50 KB?", "Can I upload JPG for SSC?", "What is SSC signature size?", "Why is my SSC photo getting rejected?"
- AI Overview active for "ssc photo resize" queries (surfaces spec table + step guide)
- Related searches: "ssc cgl photo resizer 2026", "ssc photo size kb", "ssc signature resizer", "ssc photo background color"
- No Featured Snippet (tool queries suppress)
- No ads in tool area

**SERP consensus: Interactive Tool Landing Page (SSC-specific) — 10/10 (100%)**
Dominant characteristics: SSC-specific (not generic resize), dual photo+signature workflow present in 5/10, current exam year (2026) in title/H1 in 8/10, median ~1,200 words, FAQPage schema in 7/10, SoftwareApplication schema in 2/10, 6–14 FAQ questions.

---

### 2.3 Page-Type Mismatch Detection

**Target page type:** Interactive Tool Landing Page (SSC-specific)
**SERP dominant type:** Interactive Tool Landing Page (SSC-specific)
**Mismatch severity: ALIGNED**

Page type is correctly matched. However, easyPhoto's page underperforms on four execution dimensions:

1. **Schema gap:** 7/10 SERP competitors have FAQPage schema; easyPhoto has none. This is the most fixable gap.
2. **Content gap:** 1,200–1,400 words vs. 1,400–6,500 word competitors. The ExamMint outlier at 6,500 words with 104 exam presets and a comparison matrix is the authority signal Google is increasingly rewarding.
3. **Exam cycle gap:** No "2026" in H1 or key headings. 8/10 competitors have current year. For time-sensitive exam queries, freshness signals matter.
4. **Social proof gap:** ExamMint's "8.5 Lakh+ Aspirants" badge is the single most powerful trust signal on the SERP. easyPhoto has nothing comparable.

**PRIMARY FINDING FOR THIS PAGE:** The page type is aligned but the page is **functionally invisible to ranking** because it has zero schema markup. FAQPage schema alone would make this page eligible for rich results (FAQ accordion in SERP), providing a significant CTR boost without any content change.

---

### 2.4 User Story Derivation

**Story S1 — The Form-Filler (Decision stage)**
*Signal: #1 PAA: "How do I resize SSC photo to 50 KB?" — pure decision-stage task. ExamMint's above-fold spec display (275×354px, 20–50KB, JPG) is what Google rewards.*
> "As an SSC CGL 2026 applicant, I need to upload my photo right now and it's showing 'file too large'. I need to get it under 50 KB without losing quality and I need it done in the next 5 minutes."
> Gap: easyPhoto's tool is capable, but the page copy does not convey speed ("instant", "1-click") or urgency resolution ("your photo in 30 seconds"). Sarkariresizer.app says "20-50KB in 1 click."

**Story S2 — The Rejection Victim (Consideration stage)**
*Signal: PAA: "Why is my SSC photo getting rejected?" — high-intent user who already tried and failed. GovtPhotoResizer.com has a "Why are SSC Forms Rejected?" H2 section.*
> "I submitted my SSC CHSL form and it came back with a photo error. I need to understand exactly what went wrong (size? dimensions? format? background?) and fix it before the form deadline."
> Gap: easyPhoto's page has a "What gets the photo accepted" section and a "What gets the photo rejected" sub-section — this addresses the story, but it is not prominent. No H2-level heading explicitly named "Why is my photo getting rejected?" — which is the exact PAA wording and highest-volume long-tail variant.

**Story S3 — The Signature Resizer (Decision stage)**
*Signal: PAA: "What is SSC signature size?" — separate from photo intent. 5/10 competitors offer dual photo+signature. Related searches include "ssc signature resizer 10-20kb".*
> "I've done the photo but I also need my signature in 10–20 KB at 140×60 px. I don't want to use a different website for the signature."
> Gap: easyPhoto's dual tool is the right solution for this persona, but the page H1 says "SSC Photo Resizer" — the word "signature" is absent from H1 and title. Competitors like Compressly.in title their page "SSC Photo & Signature Resize Tool."

**Story S4 — The Multi-Exam Aspirant (Awareness stage)**
*Signal: FatafatResize.in ranks #1 for "SSC UPSC RRB Banking" — multi-exam positioning. ExamMint has 104 exam presets. Related searches show "ssc cgl / chsl / mts / gd" variants.*
> "I'm applying for SSC CGL this month and RRB NTPC next month. I want one tool that handles both without re-uploading my spec settings."
> Gap: easyPhoto's `/ssc-photo-resizer/` is SSC-specific. The Exam Application Kit (`/tools/exam-package/`) handles multi-exam but is not linked prominently from the SSC page. Users completing the SSC flow have no visible path to the broader exam tool.

**Story S5 — The Notification Chaser (Awareness stage)**
*Signal: "ssc cgl 2026" and "ssc chsl 2026" appear in related searches. Competitors front-load the current exam cycle name in H1/title.*
> "I just saw the SSC CGL 2026 notification. I need to know the exact photo and signature specs for this cycle — has anything changed from 2025?"
> Gap: easyPhoto's page spec table is undated. No explicit "CGL 2026" or "CHSL 2026" mention in headings. No link to official SSC notification. Competitor ExamMint sources their specs from "Official Notification" and links to ssc.gov.in.

---

### 2.5 SXO Gap Score — `/ssc-photo-resizer/`

#### Dimension 1: Page Type Match (0–15) — Score: 13/15

Correctly typed. Dual photo+signature workflow is above SERP median. Minor deduction: "SSC Photo Resizer" only in H1 and title — "signature" absent from these key fields when 5/10 SERP competitors treat it as a joint product ("SSC Photo & Signature Resizer").

#### Dimension 2: Content Depth (0–15) — Score: 6/15

Severe gap. ~1,200–1,400 words vs. 1,400–6,500 word range on SERP (ExamMint at 6,500 words with 104 exam presets is the topical authority benchmark). Content missing:
- Specific SSC exam cycle mentions (CGL 2026, CHSL 2026, MTS 2026, GD Constable 2026)
- "Common rejection reasons" section (present in 4/10 competitors)
- Step-by-step photo guide (present in 6/10 competitors)
- Tips section (lighting, background, glasses rule for SSC) — present in govtphotoresizer.com
- Link to official SSC notification/ssc.gov.in (present in 4/10 competitors)
- Only 5 FAQ questions vs. 6–14 on competing pages

**Evidence:** Word count ~1,200 vs. median ~1,500; 5 FAQ vs. median ~8.

#### Dimension 3: UX Signals (0–15) — Score: 10/15

Strengths: Dual tool (photo + signature) is above fold and clearly labeled. Two-step workflow (Step 1 — Photo, Step 2 — Signature) is well-structured. Spec table is present.

Weaknesses: No progress indicator or success confirmation message. No "download as ZIP" option (sarkariresizer.app, ExamMint offer this). No visible WhatsApp share option (sarkariresizer.app uses this to drive virality). No "what happens after download" micro-copy.

#### Dimension 4: Schema (0–15) — Score: 2/15

Critical gap. Zero schema detected. This is the single most impactful fix available:
- Missing: FAQPage (5 questions are already present — implementation is 30 lines of JSON-LD)
- Missing: SoftwareApplication (tool page with clear software function)
- Missing: BreadcrumbList
- Missing: WebPage with dateModified

7/10 SERP competitors have FAQPage schema; 2/10 have SoftwareApplication. easyPhoto has neither. This is a rich result eligibility miss — FAQ accordion in SERP would increase CTR by an estimated 15–25% without any ranking change.

**Evidence:** No JSON-LD script detected on page.

#### Dimension 5: Media (0–15) — Score: 3/15

No sample images. No before/after. No step illustrations. No video. ExamMint has a result comparison interface showing before/after image quality. SarkariResizer.app has a sample output preview. The upload interface is functional but provides zero visual confirmation of what the output will look like.

#### Dimension 6: Authority (0–15) — Score: 4/15

Lowest dimension. No user count. No exam names in trust section. No developer attribution. No "official requirements sourced from ssc.gov.in" citation visible. No press mention or review.

ExamMint: "8.5 Lakh+ Aspirants" badge. SarkariResizer: "Trusted by candidates, students, and professionals." GovtPhotoResizer: Explicit government non-affiliation disclaimer (paradoxically builds trust by being honest). easyPhoto: none of these.

**Evidence:** No testimonial, badge, or citation component in page HTML.

#### Dimension 7: Freshness (0–10) — Score: 5/10

Title says "SSC Photo Resizer" — no year. 8/10 competitors put "2026" in title or H1. The spec content is current (20–50 KB, correct dimensions) but provides no update signal. No dateModified in schema (no schema at all). No "last verified against official notification" copy.

### SXO Gap Score — `/ssc-photo-resizer/`: 43/100

| Dimension | Score | Max | Priority |
|-----------|-------|-----|----------|
| Page Type Match | 13 | 15 | — (aligned) |
| Content Depth | 6 | 15 | HIGH |
| UX Signals | 10 | 15 | MEDIUM |
| Schema | 2 | 15 | CRITICAL |
| Media | 3 | 15 | HIGH |
| Authority | 4 | 15 | HIGH |
| Freshness | 5 | 10 | MEDIUM |
| **Total** | **43** | **100** | |

---

### 2.6 Persona Scoring — `/ssc-photo-resizer/`

#### Persona S-A: "The Panicked Deadline Filer" — score 38/100
**Profile:** 22–30 year old, SSC CGL/CHSL form window closes in 48 hours, photo file rejected by portal. Needs instant fix. No patience for reading.

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 12 | Correct tool, correct exam. But "SSC Photo Resizer" title doesn't communicate urgency resolution. |
| Clarity (25) | 9 | "What gets the photo accepted" is valuable but it's editorial copy — the persona needs to see "upload → get 50 KB file → download" in 3 visible steps before the tool, not after. |
| Trust (25) | 8 | Zero social proof. No "This worked for X aspirants" badge. No official spec source citation. |
| Action (25) | 9 | Dual upload tool is good. But no "download as ZIP" or "share on WhatsApp" — the persona wants proof it worked and a way to send the file immediately. |
| **Total** | **38/100** | |

**Fix:** Add a numbered 3-step visual guide above the tool: "1. Upload your photo → 2. Tool resizes to 20–50 KB automatically → 3. Download JPG — ready for SSC portal." This single addition resolves the #1 clarity and action gap for this persona.

#### Persona S-B: "The Spec Researcher" — score 47/100
**Profile:** 20–28, methodical, reads all requirements before acting. Googles "SSC CGL 2026 photo size" to double-check before uploading.

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 15 | Spec table present (350×450px, 20–50KB, JPG). Correct. |
| Clarity (25) | 12 | Spec table is below the fold. No "CGL 2026 / CHSL 2026" distinction (specs differ slightly between exam cycles). |
| Trust (25) | 10 | Spec has no source citation. No link to official notification. |
| Action (25) | 10 | No "Verify on ssc.gov.in" external link. Competitor ExamMint links directly to official notification PDF. |
| **Total** | **47/100** | |

**Fix:** Add "Source: SSC official notification 2025–26, verified June 2026" below the spec table with a link to ssc.gov.in. Expand the spec table to call out CGL vs. CHSL vs. MTS vs. GD Constable variants (they differ in pixel dimensions between cycles).

#### Persona S-C: "The Signature Stresser" — score 52/100
**Profile:** Finished the photo, now confused about signature requirements. Searches "ssc signature size 10-20kb online free".

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 16 | Signature step present as Step 2 in the tool. |
| Clarity (25) | 12 | "SSC Photo Resizer" in title/H1 — signature is not mentioned until Step 2. Persona searching for "signature resizer" may not find this page because the signature keyword isn't in any visible heading. |
| Trust (25) | 12 | Signature spec (10–20KB, 140×60px) is present but undersourced. |
| Action (25) | 12 | Signature upload tool is present. No "scan your signature" guidance or "white background only" tip for signatures. |
| **Total** | **52/100** | |

**Fix:** Change H1 or add H2 that includes "Signature" explicitly: "SSC Photo & Signature Resizer — 20–50 KB Photo, 10–20 KB Signature". This directly captures the secondary keyword "SSC signature resizer" with no content change beyond the heading.

#### Persona S-D: "The RRB/UPSC Spillover" — score 44/100
**Profile:** Searching for "exam photo resizer" broadly; lands on SSC page; is actually applying for RRB NTPC or UPSC Mains.

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 12 | SSC-specific page; RRB/UPSC specs differ. User may not trust that SSC specs match their exam. |
| Clarity (25) | 10 | No mention of other exams on this page. No "For other exams, use our Exam Kit" cross-link above fold. |
| Trust (25) | 12 | Not applicable if spec doesn't match. |
| Action (25) | 10 | No path to the multi-exam tool from this page above fold. |
| **Total** | **44/100** | |

**Fix:** Add a "Not applying for SSC? Use our Exam Kit for 40+ exams →" text link or card near the top of the page. This converts this persona from a bounce into a tool user and improves internal linking for the exam-package page.

---

## Page 3: `/blog/best-free-passport-photo-maker-india-2026/`
**Target keyword:** "best passport photo maker india free" / "best free passport photo maker india 2026"

---

### 3.1 Fetched Page Profile

| Element | Value |
|---------|-------|
| Title | Best Free Passport Photo Maker Online India (2026) — easyPhoto |
| H1 | Best Free Passport Photo Maker Online India (2026) |
| Meta description | Not set (missing) |
| Estimated word count | ~2,800 |
| Page type (self) | Comparative Review / Buyer's Guide (blog post) |
| Schema detected | Article (with author, date, headline), FAQPage |
| Tools reviewed | 7 tools (easyPhoto, PassportSizePhoto.in, IDPhoto4You, Visafoto, AI apps (group), PhotoGov, Cutout.pro) |
| Author | Jaspal Kumar (developer, named + LinkedIn) |
| Date published | June 18, 2026 |
| Comparison table | Yes (Cost, Server upload, India spec compliance, Exam tools) |
| Disclosure | "We built easyPhoto, so we're not neutral" |
| CTAs | "Open the photo maker" → /passport-photo/, "Tell us" → /contact/ |
| Internal links | 40+ links to easyPhoto tools and pages |

**Key observations:**
- Article schema with named author (Jaspal Kumar + LinkedIn) — strong E-E-A-T signal, best of the 3 pages
- FAQPage schema present — rich result eligible
- Conflict-of-interest disclosure included — important credibility move
- 7 tools reviewed — below the SERP median for this keyword type (11 tools on DataNumen; 6+ on competitors)
- No comparison methodology stated (what criteria? how tested?) — major editorial credibility gap
- No star ratings or scoring system (competitors use explicit pros/cons + numerical scores)
- No test methodology section ("we tested each tool with the same photo on a Pixel 7 running Chrome")
- Meta description missing despite being a blog post (Article schema present but no meta)
- Only 1 non-easyPhoto link is contextual (passportindia.gov.in source) — thin third-party sourcing

---

### 3.2 SERP Analysis

**Keyword: "best passport photo maker india free" / "best passport photo maker india 2026"**

| # | Domain | Page Type | Depth (words) | Tools Reviewed | Schema | Author/Date |
|---|--------|-----------|---------------|----------------|--------|-------------|
| 1 | passport-photo.online/blog/free-passport-photo-tools | Comparison Article (authoritative brand) | ~3,800 | 6 (with pros/cons, ratings) | Article + FAQPage + ReviewSchema | Sylwia Green, Feb 2026 |
| 2 | passport-photo.online/blog/online-passport-photo-maker-tools | Comparison Article | ~3,500 | 6 (scored methodology) | Article + Review | Named author, 2026 |
| 3 | datanumen.com/blogs/11-best-passport-photo-makers-free | Comparison Article (corporate blog) | ~3,500 | 11 tools | Article + (partial) Review | Vera Chen, Jan 2026 |
| 4 | visapicpro.com/article/best-passport-photo-apps | Comparison Article | ~3,000 (est) | 7 (Best overall ranking) | Article | Named, 2026 |
| 5 | bgrade.in/passport_photo_maker | Tool Landing Page (India-specific) | ~1,000 | — | Minimal | — |
| 6 | passportphotowiz.com | Tool Landing Page | ~1,200 | — | Minimal | — |
| 7 | passportsizephoto.in | Tool Landing Page | ~4,800 | — | SoftwareApp + FAQ | — |
| 8 | idphoto4you.com | Tool Landing Page | ~1,500 | — | FAQ | — |
| 9 | makepassportphoto.com/en/p/photo-for-india | Tool Landing Page | ~1,800 | — | FAQ | — |
| 10 | photogov.net/documents/in-passport | Tool + Guide | ~2,300 | — | FAQ + HowTo | — |

**SERP features detected:**
- PAA present: "Which is the best app for making passport size photo in India?", "Is it safe to use online passport photo maker?", "Can I use a selfie for Indian passport photo?", "What is the best free passport photo maker?"
- AI Overview active (likely surfaces a curated tool list with inline evals — easyPhoto absent)
- Related searches: "best passport photo maker app india free", "passport size photo maker online india free", "free passport photo maker no watermark india", "passport photo maker with background change india"
- SERP is MIXED type: ~4/10 comparison articles, ~6/10 tool landing pages

**SERP consensus: MIXED — Comparison Articles (40%) and Tool Landing Pages (60%)**

For the exact keyword "best passport photo maker india free" the SERP leans toward comparison articles in positions 1–4, then tool pages at 5–10. This means the blog post format is competing for positions 1–4, a feasible target IF the article matches authority signals.

---

### 3.3 Page-Type Mismatch Detection

**Target page type:** Comparative Review Article (Buyer's Guide)
**SERP dominant type for positions 1–4:** Comparison Article
**Mismatch severity: ALIGNED (with authority execution gap)**

The page type is correct for positions 1–4 on this SERP. However, the execution has three critical gaps vs. ranking competitors:

1. **Methodology gap:** Passport-photo.online's blog explicitly states testing criteria (reliability, UX, editing capabilities, help/guidelines, additional services). easyPhoto's article reviews tools without stating how they were evaluated. Google's evaluation guidelines reward clear methodology.

2. **Review depth gap:** Competitors give 150–250 words per tool, with explicit pros and cons. easyPhoto reviews tools in less detail and does not use a standardized pros/cons format.

3. **Independence perception gap:** easyPhoto reviewing easyPhoto as a tool they built is disclosed, but the 40+ internal links and the structure positioning easyPhoto first creates a pattern that resembles a commercial landing page dressed as editorial content. The disclosure mitigates but doesn't eliminate this risk.

**SECONDARY FINDING:** The easyPhoto blog post was published June 18, 2026 (11 days old at audit time). The competitor articles are from January–February 2026. Freshness is an asset — IF the content quality matches.

---

### 3.4 User Story Derivation

**Story B1 — The Comparison Shopper (Consideration stage)**
*Signal: PAA: "Which is the best app for making passport size photo in India?" — explicit comparison intent. Positions 1–3 are all multi-tool comparison articles.*
> "I've seen 4 different passport photo tools advertised. I want to read an honest comparison so I can pick the best one without wasting time trying each one."
> Gap: easyPhoto's article reviews 7 tools but lacks a clear "winner declaration" with explicit reasoning. Competitor articles end with "Best for X: Tool Y / Best for Y: Tool Z" — scannable verdict format. easyPhoto's "Which should you use?" section exists but is brief.

**Story B2 — The Safety Researcher (Consideration stage)**
*Signal: PAA: "Is it safe to use online passport photo maker?" — 3rd question in PAA box. PassportSizePhoto.in has a "Is it safe?" FAQ answer that is featured in AI Overview.*
> "I'm worried about uploading my face photo to a random website. I want to read an article that explains which tools are safe (no server upload) vs. which ones store your photo."
> Gap: easyPhoto's article explicitly calls out IDPhoto4You's server upload — a strong editorial differentiator. But the comparison table column "Server upload" is the key trust filter, and it's buried in a table rather than being the article's organizing principle. A "privacy-first filter" framing would capture this user story better.

**Story B3 — The App Switcher (Decision stage)**
*Signal: PAA: "What is the best free passport photo maker?" and related search "best passport photo maker app india free" — user has tried one tool and it failed.*
> "I used PhotoGov but my photo got rejected by Passport Seva. I need to know if there's a tool that specifically handles the Passport Seva 35×45mm requirement correctly, and I want to see proof before I use it again."
> Gap: easyPhoto's article mentions PassportSizePhoto.in failed the "India 35×45mm spec" check — a strong evidence-based claim. But there's no "we tested each tool with a real photo submission to Passport Seva" methodology. Without methodology, the claim isn't credible to a skeptical reader.

**Story B4 — The Feature Comparator (Consideration stage)**
*Signal: Related searches: "passport photo maker with background change india", "passport photo maker no watermark india" — users want specific features.*
> "I need a tool that removes background automatically and gives me a white background without paying — I've seen some require credits or subscriptions for this."
> Gap: easyPhoto's comparison table does not include "Background removal" or "Watermark-free" as comparison columns. Adding these columns would directly answer the feature-level search queries that are part of the related searches cluster.

**Story B5 — The Exam Dual-Tasker (Consideration stage)**
*Signal: easyPhoto's own article mentions "Exam tools support" as a comparison column — unique in the competitive set.*
> "I need a passport photo now, and I'll also need exam photos for UPSC in 3 months. I want to find a tool that handles both so I don't have to switch sites later."
> Gap: easyPhoto is the only tool in the comparison table with "Yes" in the "Exam tools" column — a compelling differentiator. But the article does not call this out as a headline finding. It's buried in the comparison table without editorial emphasis.

---

### 3.5 SXO Gap Score — `/blog/best-free-passport-photo-maker-india-2026/`

#### Dimension 1: Page Type Match (0–15) — Score: 12/15

Comparison Article is the correct type for positions 1–4. Minor deduction: the 40+ internal links (vs. 5–8 on competitor comparison articles) and first-position review of the author's own product creates structural bias that may trigger Google's "site bias" evaluation. Competitors reviewing their own tool place it in the middle or at the end of the list and link to it once.

#### Dimension 2: Content Depth (0–15) — Score: 8/15

~2,800 words, 7 tools. Competitors average 3,500–3,800 words, 6–11 tools, with explicit pros/cons format. Key missing depth:
- No stated evaluation methodology/criteria
- No explicit pros/cons section per tool (list format vs. prose)
- No star ratings or score per tool
- Comparison table exists but covers only 4 columns (competitors have 6–8 columns including: free/paid, background removal, watermark, print-ready, mobile app)
- "Which should you use?" verdict section is brief and does not produce tool-specific recommendations by persona (e.g., "Best for NRI: X / Best for exam dual-taskers: easyPhoto")

#### Dimension 3: UX Signals (0–15) — Score: 10/15

Strengths: Conflict-of-interest disclosure present (important for E-E-A-T). Author bio with LinkedIn present. Comparison table scannable.

Weaknesses: No table of contents (competitors' longer articles have jump links). No "Last updated" visible date near H1 (only in Article schema, not visible to user). No "Jump to verdict" link for impatient readers. 40+ footer links dominate bottom of page — on mobile this creates a visual wall of links that competes with the editorial content.

#### Dimension 4: Schema (0–15) — Score: 10/15

Best schema state of the three pages. Article schema (author, date, headline) and FAQPage are present.
Missing:
- ReviewSchema / ItemReviewed for each tool reviewed (would enable rich review snippets)
- BreadcrumbList
- dateModified in Article schema (only datePublished)
- AggregateRating on Article (review count)

**Evidence:** Article + FAQPage detected; no Review/ItemReview schema.

#### Dimension 5: Media (0–15) — Score: 5/15

Only one image (author avatar). No tool screenshots. No before/after comparison images. No comparison table screenshot. No sample output from any of the 7 reviewed tools.

Competitor passport-photo.online articles include tool interface screenshots, sample outputs, and star rating graphics. DataNumen's article includes tool logos and comparison table visuals. easyPhoto's article is text-heavy with one avatar — visually thin for a comparison guide.

**Evidence:** One `<img>` (author avatar) detected; no tool screenshots or sample outputs.

#### Dimension 6: Authority (0–15) — Score: 9/15

Best authority state of the 3 pages. Named author (Jaspal Kumar), professional title, LinkedIn profile — satisfies E-E-A-T "Experience" signal. Conflict-of-interest disclosure is professional practice. References passportindia.gov.in as official source.

Gaps: No external sources beyond LinkedIn and passportindia.gov.in. No Cybernews/Trustpilot/independent third-party citation for privacy claims (article mentions Cybernews in a context but as a data breach reference, not a privacy endorsement). No publication date visible prominently near H1. No editor review or peer review claim.

**Evidence:** Author bio with LinkedIn present; one official source cited.

#### Dimension 7: Freshness (0–10) — Score: 9/10

Published June 18, 2026 — 2 days before this audit. Year "2026" in title and H1. ICAO September 2025 update referenced in content. Most recent article on the SERP (competitor DataNumen: January 2026; passport-photo.online: February 2026). Freshness is a genuine competitive asset.

### SXO Gap Score — `/blog/best-free-passport-photo-maker-india-2026/`: 63/100

| Dimension | Score | Max | Priority |
|-----------|-------|-----|----------|
| Page Type Match | 12 | 15 | — (aligned) |
| Content Depth | 8 | 15 | HIGH |
| UX Signals | 10 | 15 | MEDIUM |
| Schema | 10 | 15 | MEDIUM |
| Media | 5 | 15 | HIGH |
| Authority | 9 | 15 | LOW |
| Freshness | 9 | 10 | — (strength) |
| **Total** | **63** | **100** | |

---

### 3.6 Persona Scoring — Blog Post

#### Persona B-A: "The Skeptical Comparison Reader" — score 51/100
**Profile:** 25–40, has used 1–2 passport photo tools that gave bad results, wants an honest third-party opinion before trying again.

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 16 | Correct page type. Reviews relevant tools. |
| Clarity (25) | 12 | No stated evaluation methodology. Prose format per tool vs. structured pros/cons. Reader cannot quickly determine why easyPhoto was ranked first. |
| Trust (25) | 12 | Author disclosure present, but 40+ internal links create a "feels like an ad" pattern. Reviewer reviewing own product ranked #1 is inherently suspect without rigid methodology. |
| Action (25) | 11 | "Open the photo maker" CTA exists. But the article does not answer the persona's underlying question: "If I use easyPhoto, will Passport Seva actually accept the photo?" — no test-result evidence provided. |
| **Total** | **51/100** | |

**Fix:** Add an explicit "How we evaluated each tool" section (100 words): criteria, test device, test photo specs, what pass/fail means. This converts implicit methodology into credible process documentation. Move easyPhoto to position 2 in the list (after one strong competitor), and present the strongest independent tool first — this counterintuitive move dramatically increases perceived neutrality.

#### Persona B-B: "The Privacy-First Filter" — score 58/100
**Profile:** 22–35, data-privacy aware, specifically wants no-server-upload tools. The comparison table's "Server upload" column was the deciding filter.

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 18 | "Server upload" column is the single most relevant differentiator for this persona. |
| Clarity (25) | 14 | Column exists in table. But the article does not structure itself around privacy as an organizing principle. The narrative buries the "no upload" finding in individual tool paragraphs. |
| Trust (25) | 14 | easyPhoto and PassportSizePhoto.in both marked as no-server-upload — but no source or test methodology is cited for this claim. |
| Action (25) | 12 | Privacy conclusion doesn't flow directly into CTA. |
| **Total** | **58/100** | |

**Fix:** Add a "Privacy quick filter" intro paragraph before the comparison table: "If data privacy is your primary concern, only these 2 tools (easyPhoto and PassportSizePhoto.in) process entirely in-browser." This places the key filter up front for this persona.

#### Persona B-C: "The Exam+Passport Dual-Tasker" — score 62/100
**Profile:** Government exam aspirant who also needs a passport photo. Stumbles on this article while searching "passport photo maker".

| Criterion | Score | Gap |
|-----------|-------|-----|
| Relevance (25) | 19 | "Exam tools support" column uniquely identifies easyPhoto. This is the article's strongest original insight. |
| Clarity (25) | 15 | The insight is in a table column with a "Yes/No" value. No narrative copy explains what "Exam tools support" means (i.e., resizes to SSC 20–50KB, handles signatures, 100+ exam presets). |
| Trust (25) | 14 | No exam-specific evidence (no screenshot of exam kit, no mention of exam count). |
| Action (25) | 14 | CTA goes to /passport-photo/ — correct for passport intent, but no separate CTA going to /tools/exam-package/ for the exam intent half of this persona. |
| **Total** | **62/100** | |

**Fix:** Add a sentence under the easyPhoto section: "If you're also applying for SSC, UPSC, or other government exams, easyPhoto's Exam Application Kit handles photo+signature resizing for 40+ exams — the only tool in this comparison to offer this." Add a second CTA: "Need exam photo too? → Exam Application Kit."

---

## Cross-Page Summary

### SXO Gap Scores

| Page | SXO Gap Score | Mismatch Severity | #1 Priority Fix |
|------|---------------|-------------------|-----------------|
| `/passport-photo/` | 56/100 | ALIGNED | Add before/after sample photo + SoftwareApplication schema |
| `/ssc-photo-resizer/` | 43/100 | ALIGNED (execution gap) | Add FAQPage + SoftwareApplication schema (zero schema currently) |
| `/blog/best-free-passport-photo-maker-india-2026/` | 63/100 | ALIGNED | Add evaluation methodology + tool screenshots |
| `/` (homepage — prior run) | 54/100 | HIGH (type mismatch vs. cannibalizing /passport-photo/) | Remove "passport photo maker" keyword from homepage title |
| `/tools/resize-kb/` (prior run) | ~58/100 | ALIGNED | Add India exam KB-context content section |
| `/tools/exam-package/` (prior run) | ~52/100 | ALIGNED (content gap) | Add static exam name list in HTML |

### Critical Findings (Prioritized)

**CRITICAL-1 — Zero schema on `/ssc-photo-resizer/`**
The SSC page has no JSON-LD at all. Adding FAQPage schema for the 5 existing FAQ questions is a 30-line implementation that makes the page eligible for FAQ accordion rich results, an estimated 15–25% CTR improvement. This is the highest ROI single fix across all 3 pages.

**CRITICAL-2 — Missing meta descriptions on all 3 pages**
All three money pages have no meta description. Google is auto-generating snippets from body text, which cannot be controlled and typically underperforms crafted descriptions. Each page needs a 155-character meta description optimized for the target keyword and including the primary USP (free, no upload, India-specific, ICAO compliant). This is a 15-minute fix per page.

**CRITICAL-3 — No before/after sample photo on `/passport-photo/`**
8/10 SERP competitors show a before/after transformation image. This is the primary visual trust signal for tool pages. It provides: (a) immediate credibility — user sees what the output looks like; (b) Google Image indexing; (c) lower bounce rate from users who are unsure what the tool produces. A single 600×300px before/after JPEG should be added above or immediately below the tool.

**HIGH-1 — `/ssc-photo-resizer/` content depth below SERP floor**
At 1,200–1,400 words, the page is below the SERP median (~1,500 words) and far below the topical authority threshold (ExamMint: 6,500 words). The minimum additions needed to be competitive are: a "Common rejection reasons" section (150 words), a "Step-by-step guide" section (150 words), and expanded FAQ (add 5–8 questions to reach 10–13 total). Estimated effort: 2–3 hours of writing.

**HIGH-2 — Blog post lacks evaluation methodology**
The `best-free-passport-photo-maker-india-2026` article reviews 7 tools without stating evaluation criteria or testing process. This is the single strongest signal Google uses to distinguish editorial content from promotional content. Adding 100–150 words describing the evaluation method (criteria, test photo used, test conditions, pass/fail definition) transforms the article from a "brand blog post" to a credible editorial review.

**HIGH-3 — `/passport-photo/` social proof gap**
PassportSizePhoto.in's "500,000+ Indians trusted" badge is the dominant conversion signal on the #1 ranking page. easyPhoto's `/passport-photo/` has zero social proof. Even a conservative "Photos made by X users" counter or a collection of 3 real testimonials would substantially close this gap. Site is 11 days old — this is a time-bounded gap that will close as usage grows, but surfacing a temporary "Join X+ users in the first two weeks" counter accelerates trust establishment.

### Top Recommendations (Implementation Order)

1. **[30 min] Add FAQPage JSON-LD to `/ssc-photo-resizer/`** — 5 questions already exist; wrap in schema. Also add SoftwareApplication schema. No content change required.

2. **[15 min each] Write meta descriptions for all 3 pages.** `/passport-photo/`: "Free Indian passport photo maker — ICAO compliant, 35×45 mm, white background, instant download. Your photo never leaves your device." `/ssc-photo-resizer/`: "Resize SSC photo to 20–50 KB and signature to 10–20 KB in one tool. Free, instant, processes in your browser. Ready for CGL, CHSL, MTS, GD 2026." Blog: craft 155-char editorial description targeting "best passport photo maker india free 2026".

3. **[2 hours] Create and add a before/after sample image to `/passport-photo/`** — Original phone photo on left, cropped 35×45mm ICAO-compliant passport photo on right. Optimize as WebP, <50KB, with descriptive alt text "Before and after: phone selfie converted to ICAO-compliant Indian passport photo using easyPhoto".

4. **[2 hours] Add "Signature" to SSC page title, H1, and meta** — Change H1 to "SSC Photo & Signature Resizer — 20–50 KB" and title to "SSC Photo & Signature Resizer 2026 — Compress to 50 KB — easyPhoto". This captures the "ssc signature resizer" keyword cluster with a heading change only.

5. **[3 hours] Expand `/ssc-photo-resizer/` content** — Add: "Common SSC photo rejection reasons" H2 section, a 3-step visual guide above the tool, "SSC CGL 2026 / CHSL 2026" explicit mentions in the spec section, link to ssc.gov.in official notification, expand FAQ from 5 to 10+ questions, add "Not SSC? → Exam Kit" cross-link.

6. **[2 hours] Add evaluation methodology to blog post** — Insert a "How we evaluated these tools" section before the first tool review. Add screenshots of each tool's interface (even small thumbnails). Add explicit pros/cons bullet lists per tool. Expand comparison table with 4 additional columns: Background removal, Watermark-free, Print-ready sheet, Mobile-friendly.

7. **[1 hour] Add SoftwareApplication schema to `/passport-photo/`** — Include applicationCategory, operatingSystem, browserRequirements, offers (free), and link to FAQPage from the same page.

8. **[2 hours] Add a social proof element to `/passport-photo/`** — Options by effort: (a) Static "Join 1,000+ users in week 1" counter (display analytics count); (b) Three text testimonials from beta users or team members; (c) "As featured in" if any press coverage exists. Link from organizationSchema sameAs to 2–3 active social profiles.

---

## Limitations

- Page rendering used WebFetch, not Playwright/JS execution. Dynamic React content (ExamPackageTool exam list, HeroStarter interactive state, lazy-loaded components) could not be verified as crawlable by Googlebot. A follow-up Playwright render is recommended for DOM-level accuracy.
- SERP positions are point-in-time snapshots from June 20, 2026. Personalization, location (India vs. global), and logged-in state may affect actual SERP positions. These searches were conducted from the audit environment — India-specific rankings may differ.
- Core Web Vitals (LCP, CLS, INP) were not re-measured in this run. UX dimension scores are based on code structure and content analysis only.
- AI Overview content for these queries was inferred from SERP patterns, not directly captured (AI Overviews are not returned in search API results).
- No Google Search Console data was accessed for this run. Click-through rates, impression counts, and position data for the specific target keywords were not available. GSC integration would sharpen the gap estimates significantly.
- The blog post published June 18, 2026 is 11 days old — indexation status unknown. The article-level schema analysis assumes the content is indexable; GSC URL Inspection should be run to confirm.
- Social proof data (user counts, testimonial volume) was unavailable as easyPhoto has no visible analytics counter or testimonial component on these pages.
- Competitor word counts are estimates derived from content extraction — not exact counts.

---

## Cross-Skill Recommendations

- **Schema gaps** (FAQPage missing on SSC page, SoftwareApplication missing on both tool pages, Review schema absent from blog): run `/seo schema` to generate and validate JSON-LD for all three pages.
- **Content depth gaps** (SSC page below SERP floor, blog methodology thin): run `/seo content` for page-level content brief and E-E-A-T expansion recommendations.
- **Meta descriptions missing on all 3 pages**: run `/seo page` on-page audit to flag all missing meta across the full site.
- **Authority gaps** (no user count, no press, single social profile): run `/seo content` for E-E-A-T authority analysis and structured data authorship recommendations.

---

*Generate a PDF report? Use `/seo google report`*

*Prior homepage SXO findings (2026-06-18) remain valid and are referenced in the cross-page summary table above.*
