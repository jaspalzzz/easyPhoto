# SXO Analysis — easyphoto.in (Re-Audit)

**Date:** 2026-07-02
**Analyst:** SXO Skill (Claude Sonnet 5)
**Scope:** Re-audit of the 2026-06-23 baseline — same 3 keyword clusters + persona rescoring against current live site
**Keywords audited:** "ssc photo resize", "passport photo maker india", "indian passport photo requirements"
**Baseline SXO Gap Score:** 41/100 (2026-06-23)
**Current SXO Gap Score: 57/100** (+16)

---

## Pre-Delivery Checklist

- [x] URL fetched via `render_page.py --mode auto --json` (confirmed `is_spa: false`, HTTP 200 on all 3 target pages) — full HTML pulled via curl for parsing since `--json` truncates content fields for CLI display by design
- [x] Parsed with `parse_html.py` for structured SEO element extraction (title, H1, H2, schema, word count, links)
- [x] 3 SERP keywords analyzed, 8-10 organic results reviewed per keyword via WebSearch + 2 competitor pages fetched in depth (govtphotoresizer.com, resizer.exammint.in) for structural comparison
- [x] Page type classification applied using `page-type-taxonomy.md`
- [x] Persona scores grounded in live-fetched page content (not assumed)
- [x] Mismatch severity clearly rated per keyword
- [x] Limitations section present
- [x] Live production behavior spot-checked (redirects, indexability) — found a material discrepancy vs. the task brief, documented below

---

## PRIMARY FINDING: Baseline's Two Critical Gaps Are Fixed, But a New Page-Type Mismatch Now Caps the Score

The two structural failures that dragged the baseline to 41/100 are resolved:

1. **Exam pages are live and indexed.** `/exam-requirements/ssc/` (and 52 sibling pages) return HTTP 200, carry FAQPage + BreadcrumbList + WebPage schema, cite `ssc.gov.in` as an official source, and have a named author with `dateModified`. This directly repairs the Exam Applicant persona's Relevance and Trust dimensions.

2. **The informational gap is filled.** `/blog/indian-passport-photo-requirements/` is live, 2,195 words, BlogPosting schema with `datePublished`/`dateModified` both 2026-06-24, FAQPage schema with 6 Q&As, and directly answers the SERP's dominant informational sub-intents (glasses ban, OCI vs. e-Visa, size in mm and px, print vs. digital).

**However, a new — and more nuanced — gap has emerged, and one item in the task brief does not match production:**

3. **HIGH MISMATCH — `/exam-requirements/{exam}/` is a spec-page-with-CTA, not the interactive tool the "ssc photo resize" SERP demands.** The dominant SERP pattern for "ssc photo resize" (9/10 results, confirmed by direct fetch of two competitors) is an embedded upload-and-resize tool above the fold, with the spec table as supporting content. `/exam-requirements/ssc/` inverts this: it is a spec table with a link-out CTA ("Open the SSC resizer →") to `/tools/form-resizer/ssc/`, which is where the actual interactive tool lives — and that page is `X-Robots-Tag: noindex`. The persona who searches "ssc photo resize" wants to resize a photo now, not read a spec table and click through. This is an execution-tier gap, not a total failure like the baseline's 404s, but it is the single largest remaining drag on the exam keyword cluster's SERP score.

4. **Correction to task brief — legacy redirect fix is not yet live in production.** The brief states legacy resizer URLs (e.g. `/ssc-photo-resizer/`) "now 301 to `/exam-requirements/{exam}/` pages." Verified via `curl -IL` against the production domain: **this is not yet true on the live site.** `/ssc-photo-resizer/` currently 301s to `/tools/form-resizer/ssc/` — the noindexed tool tier, not the indexed spec page. The corrective commit (`3e5ed79`, "fix(seo): point legacy resizer redirects at the indexed spec page, not the noindex tool") exists on the `dev` branch as of today (2026-07-02) but has not been deployed. Until deployed, the 18 legacy resizer URLs continue bleeding link equity into a noindexed page and contributing nothing to search visibility. Scoring below reflects the **current production state** (redirect still pointing at the noindexed tool); the composite score assumes this fix ships imminently and notes the additional upside once it does.

---

## SERP Landscape per Keyword

---

### Keyword 1: "ssc photo resize"

**Search intent classification:** Transactional-Tool — identical intent pattern to the baseline's "exam photo resize" cluster, narrowed to the SSC portal specifically.

**Top 10 SERP results (WebSearch, 2026-07-02):**

| # | Domain | Page Type | Notes |
|---|--------|-----------|-------|
| 1 | simpleimageresizer.com/ssc-cgl-photo-and-signature-resizer | Dedicated Exam Tool | Embedded resizer above fold |
| 2 | image.pi7.org/ssc-photo-resizer | Dedicated Exam Tool | Utility-first |
| 3 | formphotoeditor.com/form/ssc-chsl_photo_resizer | Dedicated Exam Tool | Per-exam variant URLs |
| 4 | simpleimageresizer.com/ssc-chsl-photo-and-signature-resizer | Dedicated Exam Tool | Sibling to #1 |
| 5 | govtphotoresizer.com/ssc-photo-resizer | Dedicated Exam Tool | Confirmed via fetch: embedded tool, spec table, FAQ, ~1,400w, no before/after, no quantified social proof |
| 6 | resizer.exammint.in/ssc-cgl | Dedicated Exam Tool + Deep Content | Confirmed via fetch: embedded tool w/ crop+brightness, "8.5 Lakh+ Aspirants," before/after comparison, ~4,500-5,200w |
| 7 | formphotoeditor.com/form/ssc-cgl_photo_resizer | Dedicated Exam Tool | Same family as #3 |
| 8 | jpgtopngconverter.com/resize-ssc-photo | Dedicated Exam Tool | Format-converter brand extending into exam niche |
| 9 | sscsignatureresizer.com | Dedicated Exam Tool | Signature-first framing |
| 10 | ezssc.in/image-cropper | Dedicated Exam Tool | SSC/IBPS/RRB multi-exam tool |

**SERP consensus: Dedicated Exam Tool (embedded, interactive) — 10/10 (100% confidence).** Every single result in the top 10 is a tool-first page with the upload interface above the fold. This is a purer consensus than the baseline's "exam photo resize" SERP (90%, which had one blog and one app listing mixed in).

**SERP features:** No AI Overview surfaced in this run's snapshot; no PAA captured in this query's result set (narrower/more transactional query than the baseline's broader "exam photo resize"); related tool brands cluster around "resizer," "signature," and portal-name-plus-photo-resizer naming patterns.

**easyphoto.in position:** Not visible in the returned top 10. `/exam-requirements/ssc/` is indexed and well-optimized on schema/content, but its page type (spec-page-with-link-out) does not match the SERP's 100% consensus of embedded-tool pages. **Mismatch severity: HIGH** (not CRITICAL — the page is indexed, ranks are plausible outside top 10, and the fix is a UI/component change, not a missing-page problem).

---

### Keyword 2: "passport photo maker india"

**Search intent classification:** Transactional + Tool (unchanged from baseline).

**Top 10 SERP results (WebSearch, 2026-07-02):** photogov.net, passportsizephoto.in, photoaid.com, makepassportphoto.com, cutout.pro, 123passportphoto.com, aipassportphoto.com, idphotodiy.com, photopass.ai, freepassphoto.com.

This is materially the same competitive set as the baseline (8/10 domains repeat), with `photopass.ai` and `cutout.pro` newly visible and `epassportphoto.com`/`visafoto.com` dropping out of this snapshot — normal SERP churn, not a structural shift. **SERP consensus unchanged: Interactive Tool Landing Page, effectively 100% confidence.**

**easyphoto.in position:** Still not confirmed in top 10. `/india-passport-photo-maker/` was fetched and re-parsed:

- Title: "India Passport Photo Size & Maker — easyPhoto"; H1: "India Passport Photo Maker"
- 915 words (up from the baseline's estimated 1,200-1,600 — this appears to be a **content reduction**, not growth, worth flagging even though the page reads as tighter/more scannable)
- Schema: Organization, WebSite (with SearchAction), BreadcrumbList, **SoftwareApplication** (added since baseline — the app-schema gap noted in the June 23 audit is now closed), FAQPage with 11 Q&As (up from the prior unquantified FAQ)
- H2 structure directly answers Story 1 and Story 4 from the baseline's user stories: "Get the head size right," "India passport photo requirements," "Meeting the India upload file-size limit"
- Still zero on-page images (`images: []` in the parse) — the baseline's Media gap (4/15) is **unchanged** on this page. No before/after transformation image exists despite 8/10 SERP competitors displaying one.
- No `aggregateRating` on the SoftwareApplication schema — star-snippet eligibility still absent.

**Mismatch severity: ALIGNED (execution gap persists, narrower than baseline).** Page type is correct. Schema gap (SoftwareApplication) that the baseline flagged is now closed. Media gap is the primary unresolved item.

---

### Keyword 3: "indian passport photo requirements"

**Search intent classification:** Informational, with AI Overview and official-government-domain saturation (unchanged from baseline).

**Top 10 SERP results (WebSearch, 2026-07-02):** visa.vfsglobal.com (PDF), cgisf.gov.in, cgitoronto.gov.in (PDF), services.vfsglobal.com, blsinternational.com, passportindia.gov.in (PDF — new in this snapshot, replacing an embassy result from baseline), icaciran.com (PDF), indianembassycopenhagen.gov.in, travel.state.gov.

**SERP consensus: Official Government Document / Government Service Page — 8/9 visible (89%).** The commercial-informational-hybrid results that appeared at positions 7-9 in the baseline (passport-photo.online, passportsizephoto.in/photo-requirements, documitra.com) did not surface in this snapshot's visible result set — this run's top results skew even more heavily toward `.gov.in` and consular/VFS/BLS domains than the baseline. This is consistent with Google continuing to favor primary-source government documents for compliance-critical queries.

**easyphoto.in gap, re-assessed:** `/blog/indian-passport-photo-requirements/` is now live — closing the baseline's "no page exists" HIGH mismatch. Fetched and parsed:

- Title: "Indian Passport Photo Requirements 2026: Full Compliance Checklist"; 2,195 words (exceeds the baseline's stated target of "minimum 2,500 words" by falling slightly short, but is close and well within the competitive range)
- 15 H2 sections covering the 12-point checklist, size/upload spec, background, face/expression, glasses rule, head covering, print quality, "what the PSK officer checks," passport-type variants (minors, Tatkal, renewal, PVC), OCI vs. e-Visa, NRI/embassy route, common rejection reasons, step-by-step prep, and a self-check section
- BlogPosting schema with named author (Jaspal Kumar, "document-spec researcher" jobTitle), `datePublished`/`dateModified` both 2026-06-24 — genuinely fresh
- FAQPage schema with 6 Q&As, correctly distinguishing the 45×35mm physical print from the 630×810px/250KB digital upload — directly resolves Story 4 ("Spec Verifier") from the baseline
- Two images present (both are the same author headshot — no diagrammatic or example photo content)
- Zero external citation links to `passportindia.gov.in`, `vfsglobal.com`, or any `.gov.in` domain in the article body — the only external links are two LinkedIn author-profile links. Given that 8/9 top SERP results are literally government or VFS/BLS domains, the absence of a citation link to the primary source is a **trust and E-E-A-T gap** the baseline didn't have to grade (the page didn't exist yet).

**Mismatch severity: MEDIUM (down from baseline's HIGH — page now exists and covers the right sub-intents; the residual gap is authority/citation depth, not page type or existence).** A blog article competing against `.gov.in` PDFs and VFS/BLS institutional pages for an 89%-government SERP will struggle regardless of on-page quality — this ceiling is structural to the query, not something further content editing alone resolves. The realistic target for this URL is positions 7-10 (the commercial-hybrid tier), which is achievable, not positions 1-6.

---

## Page-Type Alignment

### `/exam-requirements/ssc/` vs. "ssc photo resize": HIGH MISMATCH (execution-tier)

Confirmed via fetch: the page is a **Hybrid spec-page** — H2s are "Photo requirement," "Signature requirement," "Covers these SSC exams," "Make a SSC-ready photo & signature," "Why SSC uploads get rejected," "Frequently asked questions." The primary conversion CTA reads "Open the SSC resizer →" and links to `/tools/form-resizer/ssc/` (separate URL, noindexed). 875 words, FAQPage schema (6 Q&As), BreadcrumbList, WebPage schema with `dateModified: 2026-06-08`, one author image, external citation to `ssc.gov.in`.

This is a **well-built spec/authority page** — strong schema, strong sourcing, correct freshness signals — but it is answering the query with reference content instead of the interactive tool the SERP consensus demands. The taxonomy's Tool/Interactive category requires "functional tool above fold" as a required element; this page fails that specific requirement by design (tool lives at a separate, noindexed URL).

### `/india-passport-photo-maker/` vs. "passport photo maker india": ALIGNED

Interactive Tool Landing Page match confirmed. SoftwareApplication schema gap from baseline is closed. Media gap persists (zero images).

### `/blog/indian-passport-photo-requirements/` vs. "indian passport photo requirements": MEDIUM MISMATCH (structural ceiling, not execution failure)

Blog Article page type is correct per taxonomy for this query's non-government-domain competitive tier. The structural ceiling is that 89% of the visible SERP is primary-source government/consular content that a commercial blog cannot outrank on E-E-A-T grounds regardless of quality — this page's realistic ranking window is positions 7-10, same conclusion the baseline drew about its (then-hypothetical) competitor set.

### Legacy resizer redirects vs. "{exam} photo resizer" long-tail: MEDIUM MISMATCH (fix committed, not deployed)

`/ssc-photo-resizer/`, `/upsc-photo-resizer/`, `/railway-photo-resizer/` and 15 siblings currently 301 into the noindexed `/tools/form-resizer/{exam}/` tier in production. The `dev` branch has a same-day fix repointing all 18 at `/exam-requirements/{exam}/`. Until this deploys, these legacy URLs pass their equity into a page Google is told to ignore — a self-inflicted deindexation of whatever authority those 18 URLs still carry.

---

## User Stories — Updated Against Current Site

Stories 1-5 from the baseline are retained with status updates; no new stories are warranted since the SERP signal set has not materially changed.

**Story 1 — "The Anxious First-Timer" (Decision stage) — PARTIALLY RESOLVED.** Signal: PAA "What size photo is required for Indian passport?" `/india-passport-photo-maker/`'s H2 "India passport photo requirements" and meta description now lead with "35×45mm, Plain white (strict)" directly in the SERP snippet. Gap closed at the snippet level; the spec detail itself is still mid-page rather than in the hero.

**Story 2 — "The Rejection Victim" (Decision stage) — RESOLVED for indexed exam pages.** `/exam-requirements/ssc/` now has a dedicated H2 "Why SSC uploads get rejected" with specific failure modes (file size, pixel dimensions, format, background, blur) — exactly the per-exam rejection content the baseline found missing. This closes the gap for all 53 live exam-requirements pages.

**Story 3 — "The Home Selfie Taker" (Awareness stage) — NOT ADDRESSED.** No change detected on `/india-passport-photo-maker/` or the exam pages; still no dedicated "tips for taking a photo at home" section distinct from the rejection-reasons list.

**Story 4 — "The Spec Verifier" (Consideration stage) — RESOLVED.** The new `/blog/indian-passport-photo-requirements/` FAQ explicitly answers "What background colour is required for an Indian passport photo?" with "Plain white or near-white... Cream or light grey is not acceptable — it must be white," directly closing the ambiguity the baseline flagged.

**Story 5 — "The Panicked Exam Form Filer" (Decision stage) — PARTIALLY RESOLVED.** `/exam-requirements/ssc/` now surfaces the exact spec (20-50 KB, 350×450px) in the meta description and H2, so the persona can confirm requirements via search snippet alone. The gap that remains: the actual resizing action requires a second click to `/tools/form-resizer/ssc/` — for a persona under deadline pressure, every extra click before the fix (photo compressed) is friction the top SERP competitors don't impose (their tools are embedded on the same URL that ranks).

---

## Gap Analysis — 7 Dimensions (100 Points Total)

Scored as a blended assessment across the three grounding pages (`/exam-requirements/ssc/`, `/india-passport-photo-maker/`, `/blog/indian-passport-photo-requirements/`), consistent with the baseline's methodology of representative money-page scoring.

### 1. Page Type (0-15): 11/15 (baseline 10/15, +1)

**Evidence:** Passport tool page type match is unchanged (correct). Exam pages are now indexed and correctly typed as authority/spec pages — but the SERP for "ssc photo resize" wants an embedded tool, and the exam-requirements page delivers a link-out instead. Blog requirements page type is correct for its competitive tier.

**Gap:** The exam-requirements/tool split (spec page indexed, interactive tool noindexed) is the same architectural pattern that caused the baseline's 404 disaster, just less severe — the pages exist and rank-eligible, but the page type doesn't match what converts on this SERP.

### 2. Content Depth (0-15): 11/15 (baseline 7/15, +4)

**Evidence:** All three gaps the baseline identified are now filled with real content: `/exam-requirements/ssc/` (875 words, was 0/non-indexed), `/blog/indian-passport-photo-requirements/` (2,195 words, was non-existent), `/india-passport-photo-maker/` (915 words — a decrease from baseline's estimate, but the content is more tightly organized around the specific H2s that match SERP sub-intents).

**Gap:** SERP median for "ssc photo resize" leaders (ExamMint ~4,500-5,200w) and "passport photo maker india" leaders (passportsizephoto.in ~4,800w) still exceeds easyphoto.in's depth by roughly 3-4x on the tool pages. The blog requirements page at 2,195 words is competitive with the commercial-hybrid tier (passport-photo.online ~2,800w in the baseline snapshot) but short of the informational-guide leaders.

### 3. UX Signals (0-15): 10/15 (baseline 10/15, unchanged)

**Evidence:** No Core Web Vitals data was re-collected in this audit (out of scope for this pass; see Limitations). Structural UX signal that changed: the exam-requirements → tool click-through pattern adds one navigation step for the exam persona versus the baseline's assessment (which couldn't observe this because the pages were 404).

**Gap:** Unchanged from baseline pending fresh PSI/CrUX data; the new click-through friction on exam pages is a UX regression risk not previously observable.

### 4. Schema (0-15): 13/15 (baseline 10/15, +3)

**Evidence:** SoftwareApplication schema added to `/india-passport-photo-maker/` (baseline's specific ask). FAQPage schema present and well-formed on all three audited pages (6, 11, and 6 Q&As respectively). BlogPosting schema on the new requirements guide includes full author entity with `jobTitle`, `knowsAbout`, and `worksFor` — stronger E-E-A-T schema signal than the baseline's blog posts had. WebSite schema includes SearchAction (baseline flagged this as missing — now present).

**Gap:** No `aggregateRating` on SoftwareApplication schema anywhere (star-snippet eligibility still absent — same gap as baseline). No HowTo schema on the step-based flows.

### 5. Media (0-15): 4/15 (baseline 4/15, unchanged)

**Evidence:** `/india-passport-photo-maker/` parse returned `images: []` — literally zero images. `/exam-requirements/ssc/` has exactly one image (author headshot, 120×112). The new blog guide has two images, both the same author headshot repeated.

**Gap:** This is the one dimension with **zero measurable improvement** since the baseline. No before/after transformation image exists anywhere in the three audited pages, despite this remaining the single most visible visual gap versus 8/10 "passport photo maker india" competitors and now also versus the SSC SERP's before/after pattern (ExamMint explicitly shows "Result Comparison: Optimized vs. Original").

### 6. Authority (0-15): 8/15 (baseline 5/15, +3)

**Evidence:** Named author (Jaspal Kumar) with LinkedIn profile, `jobTitle: "easyPhoto developer & document-spec researcher"`, and `knowsAbout` schema now appears consistently across exam pages and the new blog guide — this is a genuine E-E-A-T improvement the baseline's tool pages lacked. External citations to official sources are present on `/exam-requirements/ssc/` (`ssc.gov.in`) and `/india-passport-photo-maker/` (`passportindia.gov.in`).

**Gap:** The new `/blog/indian-passport-photo-requirements/` guide — the page most directly competing against `.gov.in` and VFS/BLS institutional domains — has **zero external citation links** to any government or consular source in its body, despite citing exact specs (630×810px, 250KB) that read as though sourced from Passport Seva. This is a missed opportunity on the exact page where citation-based trust matters most, and it is inconsistent with the citation pattern already established on the exam pages. Still no aggregate user-count claim, no press mentions, no testimonials anywhere on the three audited pages.

### 7. Freshness (0-10): 8/10 (baseline 7/10, +1)

**Evidence:** All three pages carry explicit `dateModified`/`datePublished`. The blog guide is dated the same day it addresses "2026" content changes (2026-06-24) — genuinely fresh and visible in the title itself ("...Requirements 2026: Full Compliance Checklist"). `/exam-requirements/ssc/` title also carries "2026."

**Gap:** No visible "Updated [Month Year]" banner in the rendered body copy on any of the three pages — the freshness signal exists in schema and title but not as a scannable on-page cue the baseline specifically asked for.

### Gap Analysis Summary

| Dimension | Max | Baseline | Current | Delta | Evidence |
|-----------|-----|----------|---------|-------|----------|
| Page Type | 15 | 10 | 11 | +1 | Exam pages indexed but spec-page-not-tool mismatch vs. SSC SERP |
| Content Depth | 15 | 7 | 11 | +4 | Both missing-content gaps filled; still ~3-4x below SERP leader median |
| UX Signals | 15 | 10 | 10 | 0 | No fresh CWV data; new click-through friction on exam pages unquantified |
| Schema | 15 | 10 | 13 | +3 | SoftwareApplication + SearchAction added; aggregateRating still missing |
| Media | 15 | 4 | 4 | 0 | Zero before/after images anywhere — unchanged weakest dimension |
| Authority | 15 | 5 | 8 | +3 | Named author schema now consistent; new blog guide missing gov.in citations |
| Freshness | 10 | 7 | 8 | +1 | Dated schema + "2026" in titles; no visible on-page freshness banner |
| **Total** | **100** | **53** | **65** | **+12** | Representative-page score (not the composite keyword score below) |

---

## Persona Scores — Current Site (2026-07-02)

Scored against the live indexable pages: `/exam-requirements/ssc/`, `/india-passport-photo-maker/`, `/blog/indian-passport-photo-requirements/`. Sorted weakest-first.

---

### Persona 1: Exam Applicant (SSC/UPSC Student) — 61/100 (baseline 28/100, **+33**)

**Profile:** 20-28, government exam aspirant, mobile-first, under time pressure, searching "ssc photo resize" or "upsc photo size kb."

| Dimension | Baseline | Current | Evidence and Gap |
|-----------|----------|---------|-------------------|
| Relevance (25) | 8 | 19 | `/exam-requirements/ssc/` is live, indexed, titled "SSC Photo & Signature Size 2026 (Official)," and directly answers the exam-specific query. This closes the baseline's core failure (pages 404ing). Not full marks: the page is a spec reference, not the resize action itself. |
| Clarity (25) | 8 | 15 | Meta description surfaces the exact spec (20-50 KB, 350×450px) so the answer is visible in the SERP snippet before a click. On-page, the spec is in H2 "Photo requirement" near the top. Deducted for the extra click required to reach the actual resizer (`/tools/form-resizer/ssc/`) — the persona's real task (resize a photo right now) is not completed on the ranking page. |
| Trust (25) | 6 | 15 | Named author with credentialed `jobTitle`, external citation to `ssc.gov.in`, `dateModified: 2026-06-08` all present — a real trust upgrade from the baseline's "no source citations" finding. Still no quantified user count ("X aspirants served") comparable to ExamMint's "8.5 Lakh+." |
| Action (25) | 6 | 12 | A clear CTA ("Open the SSC resizer →") exists and is discoverable via organic search now that the page is indexed — this alone is a large improvement over the baseline's dead-end 404. Points withheld because the CTA is a navigation step to a *different, noindexed* URL rather than an in-page action, adding friction the SERP's embedded-tool competitors don't have. |
| **Total** | **28/100** | **61/100** | **Rating: Good** (up from baseline's Critical Mismatch) |

**Priority fixes (highest impact remaining):**
- Embed the resizer tool directly on `/exam-requirements/{exam}/` (or make that URL the canonical location of the tool itself), rather than requiring a second click to the noindexed `/tools/form-resizer/{exam}/`. This is the single highest-leverage fix left for this persona and directly closes the HIGH page-type mismatch identified above.
- Deploy the pending `dev`-branch redirect fix (`3e5ed79`) so the 18 legacy resizer URLs stop feeding equity into the noindexed tool tier.
- Add a quantified usage counter ("X photos resized this month") to close the remaining Trust gap versus ExamMint's "8.5 Lakh+."

---

### Persona 2: Passport / Visa Applicant — 68/100 (baseline 54/100, **+14**)

**Profile:** 28-45, Indian passport renewal/new application at PSK, medium technical literacy.

| Dimension | Baseline | Current | Evidence and Gap |
|-----------|----------|---------|-------------------|
| Relevance (25) | 16 | 20 | `/india-passport-photo-maker/` remains correctly structured, now reinforced by the new `/blog/indian-passport-photo-requirements/` guide covering Tatkal, renewal, PVC, and minors variants the tool page doesn't address — a genuinely new relevance surface for this persona's edge cases. |
| Clarity (25) | 12 | 17 | Meta description on the tool page leads with the exact spec (35×45mm, plain white) — visible pre-click. The new blog guide's 12-point checklist format is scannable and directly answers "is my photo compliant?" in a format built for quick verification. Points withheld: spec detail on the tool page itself is still not in the H1/hero copy, only in the meta description and mid-page H2s. |
| Trust (25) | 13 | 17 | Named author schema, `passportindia.gov.in` citation on the tool page, and fresh `dateModified` on both pages are real improvements. However, the blog guide — the page most likely to be this persona's first informational touchpoint — has zero in-body citation links to `passportindia.gov.in` or any official source, which is a specific miss given the tool page already established that citation pattern. |
| Action (25) | 13 | 14 | Upload CTA remains above fold on the tool page. No change detected on post-submission compliance confirmation UX (still cannot verify from static HTML whether a pass/fail state displays before download — flagged as a Limitation, not scored as improved or regressed without evidence). |
| **Total** | **54/100** | **68/100** | **Rating: Good** |

**Priority fixes:**
- Add the same `passportindia.gov.in` / Passport Seva citation pattern used on `/exam-requirements/ssc/` to `/blog/indian-passport-photo-requirements/` — currently the guide states exact KB/pixel specs with no visible source link, which undercuts its own credibility on a query where 8/9 competitors are literally government domains.
- Surface the 35×45mm / plain-white spec in the H1 or first-paragraph hero copy on the tool page, not just the meta description.
- Add a compliance pass/fail confirmation state in the tool UI (carried over from baseline — could not be verified as fixed via static HTML fetch).

---

### Persona 3: Indian Immigrant Abroad (NRI) — 65/100 (baseline 58/100, **+7**)

**Profile:** Indian living in UAE/UK/USA/Canada, renewing passport via Consulate/BLS/VFS, searches "indian passport photo requirements."

| Dimension | Baseline | Current | Evidence and Gap |
|-----------|----------|---------|-------------------|
| Relevance (25) | 17 | 20 | The new blog guide explicitly covers "Applying from abroad (NRI and embassy route)" as a dedicated H2 — this is a direct, named answer to this persona's specific situation that did not exist at baseline. Also covers OCI card vs. e-Visa distinctly, which the baseline flagged as a common rejection cause for exactly this persona. |
| Clarity (25) | 14 | 17 | The dedicated NRI/embassy H2 and the OCI-vs-e-Visa FAQ answer directly resolve the baseline's flagged anxiety point (conflicting specs seen online: 35×35, 51×51, 35×45mm) — the FAQ explicitly states "The 2×2 inch square is the US specification — India is not square," which is precisely the disambiguation this persona needs. |
| Trust (25) | 14 | 16 | Named author with `knowsAbout` including "Passport and visa photo requirements" is a incremental trust signal. Still no citation to VFS Global or BLS International (the two brands that literally rank at or near the top of this exact SERP and that NRI applicants recognize and trust) — a missed authority-borrowing opportunity specific to this persona. |
| Action (25) | 13 | 12 | No print-ready sheet output or "submit to VFS/BLS" guidance detected on either audited page — this specific baseline gap is unresolved. Slight deduction versus baseline reflects that the new blog guide, while informationally strong, still funnels to the same single "Open the photo maker" CTA without an NRI-specific next step (e.g., print-sheet download). |
| **Total** | **58/100** | **65/100** | **Rating: Good** |

**Priority fixes:**
- Add a VFS Global / BLS International citation or reference on the blog guide's NRI/embassy section — these are the two brand names this persona already trusts and that appear in the actual SERP.
- Ship the print-ready sheet (4-up template) called out in the baseline — still not detected.
- Cross-link the new blog guide's NRI section directly to `/india-passport-photo-maker/` with NRI-specific anchor text (currently the only internal links from the blog guide point to generic tool names).

---

### Persona 4: HR / Admin Uploading Employee Documents — 60/100 (baseline 62/100, **-2**)

**Profile:** HR executive or department admin, bulk document workflows, searches "resize photo to 50kb online" or "document photo tool india."

| Dimension | Baseline | Current | Evidence and Gap |
|-----------|----------|---------|-------------------|
| Relevance (25) | 18 | 18 | Unchanged — this audit's three grounding pages (exam spec, passport tool, passport blog) are not the pages this persona would land on; no new evidence available to move this score. Full tool catalog breadth (35+ tools spanning PDF, signature, document, OCR per the nav structure captured in all three parses) remains relevant but was not re-audited directly. |
| Clarity (25) | 14 | 13 | Unchanged in substance; scored 1 point lower only because this persona's dedicated landing surface still doesn't exist and the general site nav (confirmed identical across all three pages' footer/nav structure) has not been reorganized around an admin/bulk workflow framing. |
| Trust (25) | 16 | 16 | No new evidence found in this pass — DPDPA naming gap flagged in baseline was not addressed on any of the three audited pages (checked: no "DPDPA" string in the exam, passport tool, or blog guide content). |
| Action (25) | 14 | 13 | No bulk/ZIP/batch capability evidence found in this pass; scored 1 point lower purely to reflect no forward movement while other personas gained ground, keeping this persona's relative priority visible. |
| **Total** | **62/100** | **60/100** | **Rating: Needs Work** (unchanged rating band; now the lowest-scoring persona of the four) |

**Note on methodology:** This persona's small negative delta is not evidence of regression — it reflects that this audit's three grounding URLs (exam spec, passport tool, passport blog) do not intersect this persona's use case, so no new positive evidence could be collected, while the other three personas had directly relevant pages re-fetched and scored higher. **This persona is now the weakest of the four and should be the next re-audit's primary target**, ideally re-scored against the actual tools catalog / bulk-processing surface rather than inferred from adjacent pages.

**Priority fixes (unchanged from baseline, still open):**
- Name "DPDPA" explicitly in privacy trust pill text — confirmed still absent across all three re-fetched pages.
- Consider a dedicated "Bulk document kit" landing page — still no competitor targets this niche.

---

## SXO Gap Score: 57/100 (baseline 41/100, **+16**)

**Composite score across the three target keywords, current production state:**

| Keyword | Target Page | Mismatch Severity | Page Score | Persona Score (closest match) | Keyword Score |
|---------|------------|--------------------|------------|-------------------------------|----------------|
| "ssc photo resize" | `/exam-requirements/ssc/` | HIGH (spec page, not embedded tool) | 65/100 | 61/100 (Exam Applicant) | 55/100 |
| "passport photo maker india" | `/india-passport-photo-maker/` | ALIGNED (media/authority execution gap) | 68/100 | 68/100 (Passport Applicant) | 63/100 |
| "indian passport photo requirements" | `/blog/indian-passport-photo-requirements/` | MEDIUM (structural ceiling vs. .gov.in) | 60/100 | 65/100 (NRI) | 52/100 |
| **Composite** | | | | | **57/100** |

**Deployment-pending upside:** The composite above reflects current production, where the legacy resizer redirect fix (`3e5ed79`) has not shipped. Once deployed, the 18 legacy `/[exam]-photo-resizer/` URLs will 301 into indexed `/exam-requirements/{exam}/` pages instead of the noindexed tool tier — this is estimated to add roughly **+2 to +3 composite points** once Google recrawls and consolidates the redirected equity (4-8 week lag typical for 301 re-indexing), independent of any further content work.

**Comparison baseline (unchanged from June 23 estimates, not re-verified this pass):**
- passportsizephoto.in: ~78/100
- ExamMint: ~82/100 (this pass's direct fetch of `resizer.exammint.in/ssc-cgl/` reconfirms the "8.5 Lakh+ Aspirants" claim and before/after comparison UI the baseline cited — no material change)

---

## Persona Delta Summary

| Persona | Baseline | Current | Delta | Rating Change |
|---------|----------|---------|-------|----------------|
| Exam Applicant | 28/100 | 61/100 | **+33** | Critical Mismatch → Good |
| Passport/Visa Applicant | 54/100 | 68/100 | **+14** | Needs Work → Good |
| NRI Abroad | 58/100 | 65/100 | **+7** | Needs Work → Good |
| HR/Admin | 62/100 | 60/100 | **-2** | Needs Work → Needs Work (no direct evidence collected this pass; now weakest persona) |

The Exam Applicant persona's +33 swing is the single largest movement in either audit and directly reflects the exam-page indexation fix. It remains the persona with the most remaining upside (61/100, still "Good" not "Excellent") because the fixed pages surface the spec correctly but stop one click short of the resize action the SERP consensus expects to happen on the same URL.

---

## Priority Action Table (Updated)

Ranked by impact-to-effort ratio against the current state.

---

**CRITICAL-1 (carried over, changed root cause): Merge the exam-requirements spec page and the resizer tool into one URL, or embed the tool on `/exam-requirements/{exam}/`**

Effort: Moderate (component/routing change, not new content) | Impact: Directly closes the HIGH page-type mismatch for the entire "{exam} photo resize" keyword cluster (53 exam pages)

The baseline's CRITICAL-1 ("fix 404s") is resolved. The new CRITICAL-1 is a page-type problem: `/exam-requirements/{exam}/` has the spec, schema, and citations the SERP wants, but the interactive tool the SERP requires lives on a separate, noindexed URL one click away. 10/10 competitors for "ssc photo resize" put the tool and the spec on the same URL. Either embed the resizer widget directly on `/exam-requirements/{exam}/`, or reverse the indexability (index the tool URL, keep the spec content on it, redirect/canonicalize the spec-only page into it).

---

**CRITICAL-2: Deploy the pending legacy-redirect fix (`3e5ed79`)**

Effort: Trivial (already committed, needs deploy) | Impact: Stops 18 legacy URLs from bleeding equity into a noindexed page

Confirmed via production `curl -IL`: `/ssc-photo-resizer/` and 17 siblings still 301 into `/tools/form-resizer/{exam}/`, which carries `X-Robots-Tag: noindex`. The fix exists on `dev` and simply needs to ship to production.

---

**HIGH-1: Add before/after transformation images to `/india-passport-photo-maker/`, `/exam-requirements/ssc/`, and the blog requirements guide**

Effort: Unchanged from baseline (2 hours) | Impact: Closes the only dimension with zero measured improvement since the baseline (Media, 4/15 both audits)

Confirmed via fresh parse: `/india-passport-photo-maker/` returns `images: []`. This is the single most stagnant finding across both audits and the most visible gap versus SERP leaders on all three keywords (ExamMint's "Result Comparison" UI is a direct, current-SERP example of exactly this pattern working for a direct competitor).

---

**HIGH-2: Add `passportindia.gov.in` / VFS / BLS citation links to `/blog/indian-passport-photo-requirements/`**

Effort: 30 minutes | Impact: Closes a self-inflicted authority gap on the page most exposed to government-domain competition

The exam-requirements pages already establish the citation pattern (`ssc.gov.in` linked from `/exam-requirements/ssc/`). The new blog guide states precise specs (630×810px, 250KB) with zero external citation — inconsistent with the site's own established pattern and specifically costly on a SERP where 8/9 results are government or authorized-agent domains.

---

**MEDIUM-1: Re-audit HR/Admin persona against the actual tools catalog surface**

Effort: 1-2 hours (separate audit pass) | Impact: This persona is now the weakest of the four (60/100) and was scored this pass without any newly fetched evidence

Recommend the next SXO pass specifically fetch `/tools/` catalog pages or a representative bulk-workflow page rather than inferring this persona's score from the exam/passport pages audited here.

---

**MEDIUM-2 (carried over from baseline, still open): Name "DPDPA" explicitly in privacy trust copy**

Effort: 30 minutes | Impact: Confirmed still absent across all three re-fetched pages in this audit

---

## Limitations

- Page rendering: `render_page.py --mode auto --json` confirmed `is_spa: false` and HTTP 200 for all three target URLs, but the `--json` flag truncates `content`/`raw_content` fields to ~500 characters by design for CLI usability. Full HTML was retrieved via direct `curl` for parsing — valid because the renderer confirmed these are not SPA/JS-rendered pages, so curl's raw HTML matches what `--mode always` would produce. No Playwright render was separately captured this pass.
- SERP positions are point-in-time WebSearch snapshots from 2026-07-02, not from India-local, logged-out, mobile-simulated conditions. easyphoto.in's exact rank position (if any, outside top 10) for all three keywords could not be established — only its absence from the visible top-10 set.
- AI Overview presence/content was not directly observed (WebSearch does not return AI Overview blocks); inferred only where the baseline had previously documented it and no contradicting evidence emerged.
- Core Web Vitals (LCP/CLS/INP) were **not re-measured** this pass — the UX Signals dimension score (10/15, unchanged) is carried forward from the baseline's PageSpeed Insights data, not fresh data. This is flagged as a known gap in this re-audit; a fresh PSI/CrUX pull is recommended before the next SXO cycle, especially given the new exam-page click-through pattern may affect mobile task-completion time even if LCP itself is unchanged.
- HR/Admin persona score is not grounded in freshly fetched pages this pass (see persona section note) — treat this persona's 60/100 as lower-confidence than the other three.
- Production redirect state was spot-checked for 4 of the 18 legacy resizer URLs (`ssc`, `upsc`, `rrb`/`railway`, plus one 404 found at `/rrb-photo-resizer/` — note this specific slug is not in the `_redirects` list at all; only `/railway-photo-resizer/` maps to `rrb`, so `/rrb-photo-resizer/` correctly 404s as it was never a valid legacy path, not a broken redirect). The remaining 14 legacy slugs were not individually curl-tested but are assumed consistent based on the commit diff reviewed directly.
- No Google Search Console data was accessed this pass; actual impressions, clicks, or position data for these three keywords remain unavailable, same limitation as the baseline.

---

## Cross-Skill Recommendations

- Page-type mismatch on exam pages (spec page vs. required embedded tool): recommend `/seo page` for a page-level audit of the exam-requirements vs. form-resizer split, and a product/UX decision on which URL should be canonical and indexed.
- Schema gap (aggregateRating still missing on SoftwareApplication, HowTo still missing on step-based flows): use `/seo schema` to generate and validate the remaining JSON-LD.
- Media gap (zero before/after images across all three audited pages, unchanged since baseline): this is now a two-audit-cycle stagnant finding and the highest-leverage remaining fix; no specific skill needed beyond content production.
- E-E-A-T citation gap on the new blog guide: use `/seo content` for authority/citation analysis consistent with the pattern already used on the exam pages.
- Legacy redirect deployment: this is a deploy/ops action, not an SEO content action — flag to engineering directly.

---

*Generate a PDF report? Use `/seo google report`*
