# Content Quality & E-E-A-T Audit — easyphoto.in

**Audit date:** 2026-06-23
**Auditor:** Content Quality agent (live crawl)
**Methodology:** Each page fetched via HTTP; text extracted with trafilatura (boilerplate-stripped); word counts, heading structures, schema markup, and trust signals assessed against Google's September 2025 QRG criteria and the Helpful Content System (merged into core ranking, March 2024 update).
**Pages audited:** 7 live URLs (see table below)
**Overall score: 71 / 100**

> Note: `/india/` returned a 404. The actual India passport maker lives at `/india-passport-photo-maker/` — that URL was substituted for the India-country page assessment.

---

## Content Quality Findings

### Per-Page Assessment Table

| # | URL | Page Type | Extracted Words | Minimum | Word Count Status | Thin Risk | Freshness Signal | Score |
|---|-----|-----------|-----------------|---------|-------------------|-----------|-----------------|-------|
| 1 | `/` (Homepage) | Homepage | 1,182 | 500 | Pass (+682) | Low | `dateModified: 2026-06-21` in SoftwareApplication schema | 74/100 |
| 2 | `/passport-photo/` | Service / Tool | 884 | 800 | Pass (+84 — marginal) | Medium | No `dateModified` in page schema | 68/100 |
| 3 | `/india/` | Country / Location | **404 — Page Not Found** | 500–600 | Fail — page missing | Critical | n/a | 0/100 |
| 3b | `/india-passport-photo-maker/` | Country / Location | 884 | 500–600 | Pass | Low | No `dateModified` | 72/100 |
| 4 | `/blog/` | Blog index | 1,160 | n/a (index) | Adequate | Low | n/a | 70/100 |
| 5 | `/blog/why-exam-photo-signature-rejected/` | Blog post | 1,030 | 1,500 | Fail (−470 words short) | High | `datePublished: 2026-06-13`, `dateModified: 2026-06-13` | 65/100 |
| 6 | `/tools/` | Tools directory | 293 | 300 (complex tool = 400+) | Marginal fail | Medium-High | No `dateModified` | 58/100 |
| 7 | `/tools/exam-package/` | Tool page | 323 | 300+ | Pass (marginal) | Medium | No `dateModified` in SoftwareApplication schema | 62/100 |

---

## Page-by-Page Findings

### 1. Homepage — https://easyphoto.in/

**Word count:** 1,182 (trafilatura-extracted, nav/footer stripped)
**H1:** "Document photos that get accepted" — clear, benefit-driven, unique
**H2 structure (10 H2s):** What do you need to get done / Why photos get rejected / AI Perfects Every Detail / easyPhoto vs Photo Studio / Popular Countries / Popular Documents / Popular Exams / All tools at your fingertips / Why your photos stay private / Frequently asked questions

**Strengths:**
- Heading hierarchy is clean: one H1 + 10 descriptive H2s. No skipped levels.
- FAQPage schema present with 6 Q&A pairs covering core objections (server upload, cost, acceptance, background color, photo type, print vs digital). These are directly extractable by AI citation engines.
- SoftwareApplication schema with `dateModified: 2026-06-21`, `price: "0"`, `isAccessibleForFree: true`. Freshness signal present.
- Comparison table (easyPhoto vs Photo Studio) is specific and quotable: "₹200–₹500 per visit" vs "FREE", "30–60 minutes" vs "30 seconds", "26+ Countries". These numbers are AI citation-ready.
- Privacy USP stated four times in distinct ways — "100% Browser Processing", "No Upload Required", "No Account Needed", "No Data Stored". This repetition reinforces the trust claim without being keyword-stuffed.
- Organization schema with `knowsAbout` array covering 6 domain areas. WebSite schema present. BreadcrumbList present.

**Issues:**
- No named author or editorial team visible anywhere on the homepage. The Organization schema has no `founder` or `employee` Person. For a YMYL-adjacent site (wrong government photo = rejected application), this is a notable gap.
- Only one `sameAs` social profile: Pinterest (`pinterest.com/easyphoto0604/`). Single social signal weakens entity graph.
- "0+" appears three times for stat counters (countries, exam specs, free tools). These appear to be animated counters rendered via JS; trafilatura captures the "0+" placeholder. Googlebot may see these as "0" rather than "26", "52", and "35+". This affects the specificity of claims in the crawled content.
- No visible "last updated" or review date on-page. While the schema `dateModified` is present, users and quality raters cannot see a freshness signal without it.
- H2 "AI Perfects Every Detail" describes an on-page demo/animation. The surrounding content is thin on specifics — the compliance check scoring (98% Compliance Score, Head Size Pass, etc.) appears to be UI copy for an illustration, not factual claims about real outputs.

**Google Who/How/Why test:**
- Who created this content? Not visible on homepage. Pass on "what company" but fail on individual authorship.
- How was this content created/verified? About page covers this, but the homepage itself has no reference to verification process.
- Why was this content created? Addressed in the vs-studio comparison section ("100% private", "FREE").

---

### 2. Passport-Photo Page — https://easyphoto.in/passport-photo/

**Word count:** 884 (trafilatura-extracted)
**H1:** "Free Indian Passport Size Photo Maker"
**H2 structure (4 H2s):** Passport photo size by country / Why people trust easyPhoto / More free tools / Frequently asked questions

**Strengths:**
- H1 is direct and keyword-targeted.
- 14 FAQ entries — the densest FAQ section of all audited pages. All are specifically worded to match real user queries ("Can I smile in a passport photo?", "Can I wear glasses?", "What is the passport photo size for the Passport Seva portal?", "Has India changed passport photo requirements?").
- Critical spec included: "Exactly 630×810 px JPEG, under 250 KB for the Passport Seva online application." This is a quotable, specific, official-sourced fact.
- Time-sensitive content present and accurate: "from 1 September 2025, applications through Indian embassies and consulates abroad require ICAO-compliant photographs."
- FAQPage schema confirmed present.
- SoftwareApplication schema present with `isAccessibleForFree: true`.

**Issues:**
- Only 4 H2s for a service page handling one of the most competitive Indian SEO queries ("passport photo size India"). Heading hierarchy is shallow. Competitors on this query will typically have 6–10 H2s covering spec breakdown, how-to steps, printing instructions, and common rejections.
- No `dateModified` in the page-level schema (SoftwareApplication). The spec update from September 2025 is mentioned in body copy, but there is no structured signal to tell Google when this page was last reviewed.
- "Built on official requirements" trust badge references no specific source inline. The FAQ mentions "we link the official government source on every country page" — but this is the India page, and no direct link to `passportindia.gov.in` is visible in the extracted text.
- Extracted body content is almost entirely FAQ. Prose depth between the H2 sections is thin — "Why people trust easyPhoto" consists of 4 short bullets, each one sentence. This reduces topical depth for non-FAQ content.
- Word count of 884 is only 84 words above the 800-word service page minimum. For a primary commercial landing page targeting high-competition queries, 884 is marginal topical coverage.

**Google Who/How/Why test:**
- Who: No visible author. Organization attribution only.
- How: Trust section mentions "official requirements" and "compliance check" but no link to verification source on this page.
- Why: Privacy USP clear ("nothing is uploaded").

---

### 3. /india/ — CRITICAL: 404 Not Found

**Status:** HTTP 404. The URL `https://easyphoto.in/india/` returns the site's custom 404 page.

**Impact:** This is a broken URL in the audit brief. The 404 page itself handles the error gracefully (offers related tools, no redirect loop), but the absence of an `/india/` country page means:
- Any external link or bookmark pointing to `/india/` reaches a dead end.
- If this URL was previously indexed, it contributes soft-404 coverage in GSC.
- The correct India country page is `/india-passport-photo-maker/` (confirmed via sitemap).

**3b. /india-passport-photo-maker/ (actual India page)**
**Word count:** 884 (trafilatura-extracted)
**H1:** "India Passport Photo Maker"

**Strengths:**
- Specification table is present and precise: 35×45mm, head height 36–38mm, face 80–85% of frame, background #FFFFFF, digital size min 630×810px, file size 10–250KB, min DPI 300.
- Explicit visual guidance ("Correct head size / Too small / Too close") described in the content — adds informational depth beyond just the spec.
- Mentions "Official source — Verification status: Confirmed against the official government source." Trust signal present in body.
- Correct distinction between print form (35×45mm photo-lab print) and online portal (digital upload, KB-limited) — a commonly misunderstood split that adds genuine informational value.
- "Works for Tatkal, re-issue and police verification" — practical scope expansion.
- Selfie rejection explained: "No. Selfies are not accepted. The photo must be taken by someone else from about 1.5 metres" — specific, quotable, grounded in the ICAO standard.

**Issues:**
- No `dateModified` in page schema despite describing a spec that changed September 2025.
- No visible link to `passportindia.gov.in` in the extracted text (the "Official source" badge is present but the linked URL is not captured in text extraction — may be hidden behind an SVG or icon-only link).
- Baby/infant passport photo is mentioned ("use the baby & infant guide") as an internal link only — no standalone content on this page for that sub-query.

---

### 4. Blog Index — https://easyphoto.in/blog/

**Word count:** 1,160 (trafilatura-extracted — primarily blog titles + descriptions)
**H1:** "Get it right the first time"
**H2 structure:** Blog post titles rendered as H2 headings

**Strengths:**
- 25 blog posts listed. Each entry includes a title, a meta description teaser, and a reading-time estimate ("8 min read", "7 min read" etc.). This is scannable and helps users self-select.
- CollectionPage schema present — correct schema type for an index page.
- BreadcrumbList present.
- Content of individual posts skews towards practical, specific queries: "UPSC CSE added live webcam matching and a 10-day photo recency rule", "SSC now requires live photo capture — no gallery uploads." These are timely, specific, high-informational-value summaries.
- H1 is editorially positioned ("Get it right the first time") rather than generic ("Blog").

**Issues:**
- The index page has no introductory editorial copy beyond the H1 and H2 "Need to create your photo?" section. A 2–3 sentence description of the blog's editorial standards and scope would add E-E-A-T value for quality raters landing on this page.
- No author/editor attribution anywhere on the index. Quality raters cannot assess who is responsible for this editorial content.
- No post dates visible in the extracted text. While individual post pages have `datePublished` in schema, the index does not surface dates alongside the titles. Users cannot tell if guides are current without clicking through.
- "Need to create your photo?" inline CTA section is present but appears to interrupt the editorial flow mid-index. This may confuse quality raters about whether this is a blog or a promotional page.

---

### 5. Blog Post — https://easyphoto.in/blog/why-exam-photo-signature-rejected/

**Word count:** 1,030 (trafilatura-extracted)
**Minimum for blog posts:** 1,500 words
**Shortfall:** −470 words (31% below minimum)
**H1:** "Why Exam Photos & Signatures Get Rejected (and the Fix)"
**H2 structure (9 H2s):** All six rejection reasons at a glance / 1. The file size is wrong... / 2. The pixel dimensions... / 3. The signature has paper... / 4. The wrong file format / 5. Missing name and date... / 6. The background or the photo itself / The reliable order of operations / Frequently asked questions

**Strengths:**
- BlogPosting schema is complete: `datePublished: 2026-06-13`, `dateModified: 2026-06-13`, `headline`, `description`, `inLanguage: en-IN`, `author` (Person with LinkedIn URL, `jobTitle`, `knowsAbout`, avatar image URL), `publisher` (Organization/@id).
- Author attribution: "Jaspal Kumar" named explicitly in schema with LinkedIn (`https://www.linkedin.com/in/jaspal-jk/`), job title ("easyPhoto developer & document-spec researcher"), and author image. This is the strongest E-E-A-T signal in the entire site.
- BreadcrumbList schema present (3 levels: Home / Blog / Post).
- FAQPage schema present with 4 Q&A pairs.
- Summary / Quick-answer block at the top (6 bullets) is ideal for AI-citation passage extraction.
- Comparison table of all 6 rejection reasons with fixes — structured, scannable, quotable.
- Rejection reason 1 ("file size out of band") includes a specific, counterintuitive insight: "A photo compressed to 12 KB is rejected just as firmly as a 2 MB one." This is a first-hand, experience-grounded observation unlikely to appear in generic AI-generated content.
- The HEIC FAQ answer includes a step-by-step iPhone path ("Settings → Camera → Formats → switch from High Efficiency to Most Compatible") — concrete, actionable, specific to a real user workflow.

**Issues:**
- **Word count 1,030 is 31% below the 1,500-word blog post minimum.** For the query "why exam photos get rejected India", competitors likely cover this with more exam-specific examples, portal-specific screenshots, and individual exam breakdowns. The current post covers the 6 reasons structurally but treats each at a surface level. Sections 2–5 are each approximately 80–100 words — the individual-section depth is low.
- No first-hand experience narrative: there is no "we saw X% of users encounter this" or "when we tested the SSC portal, we found..." The post reads as authoritative and structured, but the experience signal is asserted rather than demonstrated.
- `datePublished` and `dateModified` are both `2026-06-13` — no update signal. For a post covering exam portal behavior that changes each cycle, no revision date is a freshness risk.
- No external links in the post body. The exam-requirements directory is referenced ("the exam requirements directory — each entry links the official notification") but only as an internal link to another page. No direct links to `ssc.gov.in` or `ibps.in` from within this post.
- Internal links are described in text ("SSC CGL resizer", "IBPS PO resizer", "signature tool", "format converter", "name & date photo tool") but their anchor text density could create a perception of over-promotion of own tools, especially without balancing external citations.
- The "Keep reading" section at the bottom links to 2 posts ("Best Free Exam Photo & Signature Resizer India" and "UPSC CSE / IAS Photo & Signature Requirements 2026"). These are topically relevant, which is good — but they always appear as the first two posts in `BLOG_POSTS`, suggesting a static rather than topic-matched selection algorithm.

**Google Who/How/Why test:**
- Who: Jaspal Kumar named in schema; author card rendered (not visible in extracted text but present in HTML). Pass.
- How: Process not described in this post specifically.
- Why: Clear user-problem framing ("just a red error and a closing deadline"). Pass.

---

### 6. Tools Directory — https://easyphoto.in/tools/

**Word count:** 293 (trafilatura-extracted)
**Minimum for a complex tool page:** 300–400+
**Status:** Marginal fail (7 words below 300 minimum; far short of 400 for this complexity level)
**H1:** "Free, private tools"
**H2 structure (5 H2s):** Most popular / Resize to an exact file size / Exam & Job Application Resizers / Western Passport & Visa Photos / Passport & visa photos

**Strengths:**
- BreadcrumbList schema present.
- Comprehensive tool catalog — 35+ tools listed across 5 categories (Passport & Visa, Exam, Image, PDF, Signature).
- Tool descriptions are specific and benefit-focused ("Compress to under 50 KB", "Square photo under 300 KB", "RRB photo under 100 KB").
- Category filter tabs present (Passport & Visa / Exam / Image Tools / PDF Tools / Signature Tools).

**Issues:**
- **293 words is thin for a directory page that is both a navigation hub and a landing page for "free document tools India" queries.** The page is almost entirely a tool grid — there is no editorial introduction explaining what the tools are, who they are for, or why they were built. Quality raters see a list without context.
- No `dateModified` signal. No freshness indication.
- No schema beyond BreadcrumbList and global Organization. A `CollectionPage` or `ItemList` schema listing the tools with `SoftwareApplication` sub-items would improve structured data coverage.
- No FAQ section. Queries like "are these tools free?" and "do these tools upload my files?" are answered on individual tool pages but not on the directory.
- The H1 "Free, private tools" is generic — does not target any specific query. A more targeted H1 like "Free Document Photo & PDF Tools for India" would better serve SEO without hurting UX.
- No author or editorial attribution visible.

**Google Who/How/Why test:**
- Who: Not addressed on this page.
- How: Not addressed.
- Why: "100% Private, Free to use, No watermark, Compliance checked" badge present but not elaborated.

---

### 7. Exam Application Kit — https://easyphoto.in/tools/exam-package/

**Word count:** 323 (trafilatura-extracted)
**Minimum:** 300+ (400+ for complex tool)
**Status:** Marginal pass at 300 minimum; below 400 threshold for complex multi-exam tool
**H1:** "Exam Application Kit"
**H2 structure (3 H2s):** Related tools / Frequently asked questions / More free tools

**Strengths:**
- FAQPage schema present with 6 Q&A pairs covering: what it is, which exams, what sizes, whether to resize separately, whether it's free/private, whether to check the official notification.
- SoftwareApplication schema: `applicationCategory: MultimediaApplication`, `price: "0"`, `isAccessibleForFree: true`.
- BreadcrumbList schema (4 levels: Home / Tools / Photo Tools / Exam Application Kit).
- The FAQ answer for "Which exams does it support?" names specific portals: "SSC, UPSC, IBPS, SBI, Railway (RRB), NEET/JEE (NTA), RBI, CTET and state PSCs." This is specific and indexable.
- "52+ exam specs, sourced from official portals" stated prominently — specific, verifiable claim.
- Privacy disclosure in the H1 section: "Photo and signature are processed entirely in your browser — nothing is uploaded."

**Issues:**
- **Only 3 H2s for a tool that is the primary product for the site's core use case (exam application).**  The tool selector UI (which exam are you applying for, with category tabs: Central government / Banking / State PSC / National entrance / Defence / Visa & identity) contains the richest semantic content, but this is JavaScript-rendered and not present in the static HTML.  Trafilatura extracts only 323 words. Googlebot's crawl of the raw HTML may see a similarly thin page.
- No `dateModified` on SoftwareApplication schema — no freshness signal.
- No external links to any exam portal (SSC, UPSC, etc.) from this page to validate the "sourced from official portals" claim.
- No body content between H1 and the exam selector. The page immediately presents the tool UI with no explanatory prose. Users who arrive from organic search have no context about what an "Exam Application Kit" is before being asked to select an exam.
- "Related tools" and "More free tools" sections are present, providing internal links, but these are generic cross-links rather than contextually relevant to the exam application use case.

**Google Who/How/Why test:**
- Who: Not addressed.
- How: Not addressed (tool logic is client-side and non-extractable).
- Why: Framing at top is good ("in one guided flow... 52+ exam specs, sourced from official portals"). Partial pass.

---

## E-E-A-T Overall Assessment

### Experience — Score: 14/20

**What is present:**
- The blog post demonstrates one genuine experience signal: "portals reject for a small, predictable set of reasons" is presented as an observed pattern, not a theoretical list. The HEIC-to-JPG workflow includes a real phone settings path that shows hands-on testing.
- The comparison table on the homepage ("30–60 minutes" studio wait vs "30 seconds" easyPhoto) reflects observed user experience, not generalized claims.
- The About page (not in audit scope, but referenced) states the origin story: "Getting a passport or visa photo rejected over a couple of millimetres... Studio photos are expensive and slow." This is first-person experience framing.
- The India passport page specifies which application routes use which specs (domestic Passport Seva Kendra vs NRI/overseas embassies) — this level of spec routing awareness reflects genuine domain experience.

**What is missing:**
- No "we tested this on [date]" statements anywhere in the audited pages.
- No case studies, user testimonials with specifics, or aggregate data ("of 10,000 photos processed...").
- No screenshots of actual tool outputs, rejected application letters, or portal interfaces.
- No first-person narratives on any tool page.
- The exam package page presents no experience signal whatsoever — it is a pure tool UI.

### Expertise — Score: 16/25

**What is present:**
- Named author Jaspal Kumar with LinkedIn URL, job title ("easyPhoto developer & document-spec researcher"), and `knowsAbout` array in Person schema. This is the strongest expertise signal on the site and it is correctly wired into BlogPosting schema.
- Domain expertise is demonstrated through specificity: correct ICAO background color differentiation (UK/Schengen grey vs US/India white), accurate Passport Seva portal specs (630×810px, 10–250KB), correct SSC band enforcement (20–50KB floor AND ceiling).
- The September 2025 ICAO-compliance update for NRI applications is mentioned on multiple pages — this is a real recent change, and its correct inclusion signals active spec-tracking.

**What is missing:**
- Author attribution only appears in blog posts. Tool pages, the homepage, the tools directory, and the exam package page have no author attribution. Quality raters visiting tool pages see no expertise signal.
- The author's `jobTitle` is "easyPhoto developer & document-spec researcher" — the "developer" component dilutes the domain authority signal for a content query. A government document compliance context benefits from a credential that emphasizes research and verification, not software development.
- No external author profile pages beyond LinkedIn. No academic, journalism, or government-adjacent credentials.
- No co-authorship with external subject-matter experts (e.g., a retired passport office employee, a visa consultant).

### Authoritativeness — Score: 14/25

**What is present:**
- Organization schema is complete: `name`, `alternateName`, `description`, `slogan`, `knowsAbout` (6 items), `logo`.
- The site links out to authoritative government sources from content pages: `passportindia.gov.in`, `ssc.gov.in`, `upsconline.nic.in`, `ibps.in` — though none of these outbound links were visible in the audited pages' extracted text.
- Blog index uses `CollectionPage` schema correctly.
- BreadcrumbList on every page audited.
- 25 blog posts targeting specific queries — topical depth is developing.

**What is missing:**
- Only one `sameAs` link: Pinterest. No LinkedIn company page, no Twitter/X, no YouTube. A thin entity footprint significantly limits Google's ability to establish site authority via entity signals.
- No external press coverage, backlink mentions, or third-party citations visible in the site's own content.
- The passport-photo page, India page, tools directory, and exam package page have no outbound authority links in their extracted text. "Sourced from official portals" is stated but not demonstrated with a link on those pages.
- No visible trust badges from government portals, app stores, or media mentions.

### Trustworthiness — Score: 19/30

**What is present:**
- Privacy architecture is the site's strongest trust signal and it is genuine: client-side processing, no server upload, no account required, no data stored. This is technically verifiable and repeated consistently across all pages.
- Contact email visible: `hello@easyphoto.in` (confirmed on contact page).
- About page clearly states the builder's intent and values.
- Spec correction invitation: "Spotted a spec that looks out of date? Accuracy is the whole point — tell us." (About page) — creates an accountability signal.
- Privacy page exists at `/privacy/` (HTTP 200 confirmed).
- FAQPage schema on 5 of 7 audited pages, answering objections before they arise.

**What is missing:**
- No visible privacy policy link or terms link in the extracted content of any audited page (these may be in the footer, but footer is stripped by trafilatura). Quality raters cannot easily verify legal accountability.
- No physical address or registered business information anywhere on the site.
- No SSL certification notice or security badge (these are standard; not critical, but relevant for YMYL-adjacent content).
- The 404 page for `/india/` is graceful (offers tools, no dead-end) but represents a broken internal URL that was apparently shared or linked somewhere — this is a trust signal weakness.
- The `/india/` 404 is particularly notable because the audit brief specifies it as a target URL — this suggests the URL was either internally shared, listed in documentation, or previously used. A 301 redirect from `/india/` to `/india-passport-photo-maker/` should be in place.

---

## AI Citation Readiness

**Score: 63/100**

AI citation readiness measures how extractable, quotable, and structured the content is for use in AI Overviews (Google), Perplexity, and other AI search tools.

### What is citation-ready

| Signal | Location | Citation-ready element |
|---|---|---|
| Specific spec numbers | `/passport-photo/`, `/india-passport-photo-maker/` | "630×810 px JPEG, under 250 KB" / "35×45mm, head 36–38mm, face 80–85%" |
| Structured FAQ schema | Homepage, `/passport-photo/`, blog post, exam-package | FAQPage schema with `acceptedAnswer` — directly ingestible by AI |
| Quick-answer block | Blog post | "Six reasons cover almost every rejection: file size band, wrong dimensions..." |
| Comparison table | Homepage | easyPhoto vs Photo Studio with specific time/cost figures |
| Rejection table | Blog post | 6-row table: Rejection reason / Fix |
| Time-sensitive spec | `/passport-photo/` | "from 1 September 2025, applications through Indian embassies require ICAO-compliant photographs" |
| Counterintuitive insight | Blog post | "A photo compressed to 12 KB is rejected just as firmly as a 2 MB one" — specific, non-obvious |
| Process steps | Blog post | "The reliable order of operations" — numbered list, action-oriented |

### What limits citation readiness

| Gap | Pages affected | Impact |
|---|---|---|
| Blog post below 1,500 words | `/blog/why-exam-photo-signature-rejected/` | Short posts are less likely to be chosen as citation sources vs longer, more comprehensive competitors |
| No outbound citations in audited pages | Blog post, tools pages | AI citation engines penalize unlinked factual claims. "Sourced from official portals" without a URL reduces confidence |
| JS-rendered exam UI not in HTML | `/tools/exam-package/` | Exam selector (52+ exams) is invisible to crawlers; the richest content on the page is inaccessible |
| Stat counters show "0+" in raw HTML | Homepage | Dynamic counter placeholders may be captured as "0" rather than "26+ countries", "52+ exam specs" |
| No `speakable` schema | All pages | Speakable schema marks content sections as audio-citation-ready — not present anywhere |
| Single social proof link | Global (Organization schema) | AI systems use entity completeness to weight citation trustworthiness |

### Best citation candidates (current)

1. **Homepage FAQ Q: "Is my photo uploaded to a server?"** — Answer is specific, verifiable, complete in one paragraph. Ready.
2. **Passport-photo page FAQ: "What is the passport photo size for the Passport Seva portal upload?"** — Specific measurement and file size. Ready.
3. **Blog post table: All six rejection reasons** — Structured, comprehensive, non-generic. High citation potential for "why exam photos get rejected India" queries.
4. **Passport-photo page: "Has India changed passport photo requirements?"** — Dated change (September 2025), specific scope (NRI/overseas route). Ready.
5. **India page spec table** — Exact pixel dimensions, DPI, head-size band. Ready if crawled correctly.

---

## Issues Found

### Critical

**C1 — /india/ returns HTTP 404**
The URL `https://easyphoto.in/india/` requested in the audit (and likely in external links, bookmarks, or shared URLs) returns a 404. The correct page is `/india-passport-photo-maker/`. A 301 redirect from `/india/` to `/india-passport-photo-maker/` should be implemented immediately. Any external links pointing to `/india/` currently waste link equity and create a broken user experience.

**C2 — Blog post word count is 31% below minimum**
`/blog/why-exam-photo-signature-rejected/` has 1,030 extracted words against a 1,500-word minimum for blog posts. For a query where users are troubleshooting specific portal errors, this post currently treats each rejection reason in approximately 80–100 words. Competitors with more exam-specific examples, portal screenshots, and per-exam breakdowns have a clear depth advantage. Target: expand to 1,600–1,800 words with portal-specific examples for SSC, IBPS, UPSC, and Railway.

**C3 — /tools/ page word count is below minimum for its page type**
293 words is below even the 300-word tool page minimum, and far below what a complex directory page representing the entire product catalog should carry. The page is a pure tool grid with no editorial context, no introduction, no FAQ. This is a gateway page for organic traffic ("free document tools India") and its thin content reduces both user orientation and SEO topical coverage.

### High

**H1 — No author attribution on tool pages, homepage, or tools directory**
The author Jaspal Kumar is named in BlogPosting schema for blog posts, but the homepage, `/passport-photo/`, `/india-passport-photo-maker/`, `/tools/`, and `/tools/exam-package/` have zero author attribution — not in visible content, not in schema, not in a byline. For pages targeting YMYL-adjacent queries (wrong spec = failed government application), quality raters need to see a responsible author or editorial team.

**H2 — No dateModified on tool pages**
The SoftwareApplication schema on `/passport-photo/`, `/india-passport-photo-maker/`, and `/tools/exam-package/` has no `dateModified` property. Given that the India passport spec changed in September 2025, the absence of a freshness signal means Google cannot assess whether these pages reflect current requirements. Add `dateModified` set to the date each page was last verified against its official source.

**H3 — Passport-photo page heading depth is too shallow for query competition**
Four H2s on `/passport-photo/` is insufficient for one of the site's most commercially important pages. The FAQ content is excellent but buried under a thin 4-section structure. Recommended additions: "Indian Passport Photo Requirements" / "How to Take Your Own Passport Photo" / "What Makes a Photo Get Rejected" / "Printing vs Online Upload" — each with 100–150 words of prose before the FAQ, building topical depth without redundancy.

**H4 — Exam Package page content is not in crawlable HTML**
The exam selector (52+ exam presets with per-exam specs) is JavaScript-rendered and absent from the static HTML. Googlebot may crawl a near-empty page with only 323 words, a 3-H2 structure, and an FAQ section. The rich content (exam names, specific KB ranges, pixel dimensions for 52 exams) is invisible to non-JS crawlers. Consider server-rendering the exam list as an HTML `<ul>` or static prose table that duplicates the JS UI for crawlability.

**H5 — No outbound citations in blog post or tool pages**
The blog post `/why-exam-photo-signature-rejected/` cites "the exam requirements directory" and references SSC, IBPS, UPSC portals by name but provides no outbound links to official sources. All trust signals for factual claims are internal. Adding 2–3 external links to `ssc.gov.in`, `ibps.in`, or `upsconline.nic.in` would substantially improve Trustworthiness scoring.

### Medium

**M1 — Stat counters render as "0+" in raw HTML**
The homepage stat block ("0+ Countries supported", "0+ Exam & form specs", "0+ Free tools") uses JavaScript animation to count up to the real numbers. Trafilatura and potentially Googlebot's first-pass crawler capture "0+" as the content value. These counters should be server-rendered with the real numbers (26, 52, 35) in the HTML, with the animation applied via CSS/JS on top.

**M2 — Only one sameAs social profile in Organization schema**
`sameAs: ["https://www.pinterest.com/easyphoto0604/"]` — Pinterest only. Google's entity graph rewards sites with multiple verified social profiles. Add LinkedIn company page if one exists, plus any active Twitter/X, YouTube, or Behance profiles.

**M3 — Blog index has no editorial introduction**
The blog index (`/blog/`) jumps from H1 ("Get it right the first time") to a blog post title. Quality raters landing on this page have no context about the editorial scope, author, or verification standards. A 3–4 sentence intro ("We cover passport and visa photo requirements, exam application file specs, and document tools for India — every guide is sourced from official government notifications.") would add E-E-A-T context.

**M4 — Tools directory H1 is not query-targeted**
"Free, private tools" is generic. A targeted H1 such as "Free Photo, PDF & Signature Tools for Indian Applications" would align with the queries this page should rank for without sacrificing clarity.

**M5 — /tools/ page lacks CollectionPage or ItemList schema**
The tools directory has only BreadcrumbList schema. A `CollectionPage` with `ItemList` containing `SoftwareApplication` items for the featured tools would enable richer structured-data coverage and improve citation readiness for tool-discovery queries.

**M6 — Author job title undersells domain authority**
"easyPhoto developer & document-spec researcher" contains "developer" which signals technical rather than domain expertise. For government document compliance content, a title emphasizing the research and verification role (e.g., "Document compliance researcher" or "Passport & exam photo compliance specialist") would better support the Expertise dimension for quality raters.

### Low

**L1 — No speakable schema anywhere**
Speakable schema marks content sections optimized for text-to-speech / voice assistant citation. None of the audited pages implement it. The FAQ sections on `/passport-photo/` and the blog post are ideal candidates.

**L2 — Blog post "Keep reading" uses static post selection**
The "Keep reading" sidebar always surfaces the first two posts from `BLOG_POSTS` (filtered for current slug). This means every post except the first two shows the same two articles. A topical-affinity selection would distribute internal link equity more effectively and improve user-to-reader journey continuity.

**L3 — No visible freshness signal for users on tool pages**
While schema `dateModified` can signal freshness to Google, users visiting `/india-passport-photo-maker/` or `/passport-photo/` have no visible indication of when the spec was last verified. A "Spec last verified: [date]" label near the spec table — similar to what many official government guidance sites use — would add user-facing trust.

**L4 — No privacy policy or terms link visible in page body**
Footer links (presumably present) are stripped by trafilatura. Quality raters may arrive at any page and need to find legal accountability links. An inline reference in the about/privacy section of the homepage body, or a visible footer trust bar that is in the HTML (not JS-rendered), would ensure these are captured in any crawl.

---

## Score: 71/100

### Scoring Breakdown

| Dimension | Score | Max | Notes |
|---|---|---|---|
| E-E-A-T — Experience | 14 | 20 | Privacy USP genuine; no first-hand narratives or tested claims on most pages |
| E-E-A-T — Expertise | 16 | 25 | Author schema complete on blog posts; zero attribution on tool/home pages; title dilutes domain authority |
| E-E-A-T — Authoritativeness | 14 | 25 | Good internal linking and government spec accuracy; single sameAs; no external mentions |
| E-E-A-T — Trustworthiness | 19 | 30 | Privacy USP strong; /india/ 404 broken; no outbound citations on key pages; no business address |
| Word count / topical coverage | 4 | 10 | Blog post 31% under minimum; tools directory below minimum; passport-photo marginal |
| Structured data completeness | 7 | 10 | BlogPosting excellent; tool pages missing dateModified; tools directory missing CollectionPage |
| Readability / heading structure | 5 | 10 | Blog post H2 structure strong; tool pages shallow (3 H2s); tools page generic H1 |
| AI citation readiness | 6 | 10 | FAQ schema present; quick-answer block good; JS-rendered content invisible; no speakable |
| Content freshness signals | 4 | 10 | Only homepage has dateModified; no on-page freshness dates; India spec change noted in copy only |
| Broken page / URL hygiene | 2 | 5 | /india/ 404 unresolved; no redirect in place |
| **Total** | **71** | **100** | |

---

## What Works Well

1. **BlogPosting schema completeness** — Every blog post has a complete `BlogPosting` graph with named Person author, LinkedIn `sameAs`, `jobTitle`, `knowsAbout`, avatar URL, `inLanguage: en-IN`, and `datePublished`. This is above average for Indian SaaS content sites.

2. **FAQ schema saturation on blog posts and tool pages** — 5 of 7 audited pages have `FAQPage` schema with `acceptedAnswer`. The FAQ questions are query-matched rather than generic. This is the site's strongest AI citation signal.

3. **Privacy USP specificity** — "100% Browser Processing / No Upload Required / No Account Needed / No Data Stored" is stated in four distinct ways on the homepage, each a separate trust claim. This is not generic privacy language — it is technically specific and user-verifiable. Competitors (Cutout.pro, Visafoto) cannot match this claim legitimately.

4. **Spec accuracy and time-sensitivity** — The September 2025 ICAO-compliance change for NRI passport applications is correctly described on the passport-photo page. The SSC photo band (20–50KB, not just "under 50KB") is correctly specified in the blog post. These are details that generic or AI-generated content gets wrong — their presence is a genuine expertise signal.

5. **Quick-answer callout box on blog post** — The 6-bullet summary at the top of the rejection-reasons post is optimally structured for AI Overview passage extraction: short, complete, numbered, with a pointer to further detail. This format is the most citation-ready element across all audited pages.

6. **Internal cross-linking from blog to tools** — Every blog post links to the relevant tool from within the body. The exam-package page links to related tools. No audited page is an orphan. Tool cross-links are contextual ("SSC CGL resizer", "IBPS PO resizer") rather than generic, which improves both UX and topical authority signals.

7. **India spec table on `/india-passport-photo-maker/`** — The 9-row spec table (print size, head height, head % of frame, background hex code, digital size, file size, min DPI, glasses, expression) is the most quotable, citation-ready structured element in the audited content. It is specific, complete, and cross-referenceable against the official source.
