# Content Quality & E-E-A-T Audit — easyphoto.in

**Audit date:** 2026-06-18  
**Auditor:** SEO-content agent  
**Scope:** All 24 blog posts + tool landing pages + About / Contact / Privacy  
**Overall score: 73 / 100**

---

## Executive Summary

easyphoto.in has a well-engineered content foundation. The 8 exam-guide pillar posts (SSC, UPSC, NDA/CDS, IBPS, etc.) are technically thorough, correctly cite official government sources, and use a consistent structure (Quick-answer box → spec table → body → FAQ → CTA). The author identity is real, linked to a public LinkedIn profile, and wired into BlogPosting schema.

Three issues drag the score: (1) four competitor-comparison posts are missing `export const metadata`, so those pages render the root layout's generic title and description in Google; (2) four future-dated posts create false freshness signals — three have dates in July 2026 while today is 18 June 2026; (3) the author credential presented everywhere is "Web & mobile developer", which is a technical title, not a domain authority title for a site that needs to establish expertise in government documentation requirements. These are fixable in a few hours.

---

## E-E-A-T Assessment

### Experience (8 / 10)
- The content demonstrates genuine product experience. Competitor comparisons include verified pricing, real AWS server retention periods, and explicit "transparency" disclosures that the author built easyPhoto — a strong differentiator from AI-generated comparison articles.
- The "How we keep this accurate" editorial aside on every post directly describes the verification process. This is more than most competitors show.
- Deduction: No screenshots, no first-person walkthroughs, no "I tested this" narrative. Claims about competitor tools (Cutout.pro AWS retention, BreachForums incident) are asserted in-text but not linked to primary sources, which undermines the experience signal precisely where it matters most.

### Expertise (7 / 10)
- Author Jaspal Kumar is named on every post with a byline, avatar, and LinkedIn link. Person schema is generated via `AUTHOR` constant in `lib/author.ts` with `jobTitle` and `knowsAbout` array.
- The `knowsAbout` array covers `"Passport and visa photo requirements"` and `"Document and image processing"` — appropriate for the domain.
- Deduction: The displayed title is `"Web & mobile developer"`. For a site targeting government documentation queries where YMYL (Your Money / Your Life) adjacency applies (wrong photo = failed visa application), the title undersells domain authority. A credential like "Document compliance specialist" or at minimum "Photo & document compliance researcher" would better match the editorial content.
- Deduction: No external author profile pages (e.g., a personal website beyond LinkedIn), no co-authorship with subject-matter experts, and no peer review signals.

### Authoritativeness (7 / 10)
- Organization schema includes `sameAs: ["https://www.pinterest.com/easyphoto0604/"]` — only one social profile. Google's entity graph relies on multiple verified profiles to establish site authority.
- The About page correctly sources claims to official government portals and explicitly states the accuracy promise.
- Internal linking is healthy: the blog index, all 24 posts, and tool landing pages are all linked from the homepage or category hubs — no orphan pages.
- Deduction: Only one domain-level social proof link. No mentions on external authoritative sites (e.g., government portals, journalism, press coverage).

### Trust (8 / 10)
- Privacy architecture is genuinely trust-positive: all processing runs client-side, no server uploads, no watermark, no paywall. This claim is verifiable by a technical user and is stated plainly rather than buried in legal text.
- Contact page is real (hello@easyphoto.in via Cloudflare Email Routing). Privacy policy is dated (June 11, 2026). Terms page exists.
- The editorial standards block on every post ("Spotted something out of date? Tell us") creates an accountability signal.
- Deduction: The Cutout.pro post references a "BreachForums" data set and "Cybernews researchers" but provides no linked source. Making a data breach allegation without a citation is a trust risk — it reads as unsubstantiated and could be a legal exposure.

---

## Content Quality Assessment

### Pillar Posts (8 exam guides) — Score: 82 / 100
**Files:** `upsc-cse-ias-photo-signature-guide-2026`, `ssc-cgl-chsl-photo-signature-guide-2026`, `nda-cds-photo-signature-guide-2026`, `ibps-po-2026-photo-signature-checklist`, `exam-photo-signature-size-guide`, `why-exam-photo-signature-rejected`, `add-name-date-on-exam-photo`, `best-free-exam-photo-resizer-india`

**Strengths:**
- Every post has a Quick-answer callout box at the top, answering the query in 3–4 bullets before the article begins. This is ideal for AI-citation (Perplexity/SGE passage extraction).
- Spec tables with exact KB ranges and pixel dimensions are directly scannable; they match official portal requirements.
- External government citations: `ssc.gov.in`, `ibps.in`, `upsconline.nic.in`, `nta.ac.in` — linked with `target="_blank" rel="noopener noreferrer"` on all exam guide posts that have them.
- H2 counts are healthy: 5–12 per post, creating sufficient heading hierarchy for query coverage.
- FAQ section present on all 8 exam guide posts.

**Issues:**
- `ibps-po-2026-photo-signature-checklist` and `ssc-cgl-chsl-photo-signature-guide-2026` contain future-dated exam information ("prelims are on 22–23 August") that is accurate but time-sensitive. These posts have no `updatedISO` field set, so `dateModified` in the BlogPosting schema will show the original publish date, not the date specs were verified.
- `best-free-exam-photo-resizer-india` — no external citations (`target="_blank"` absent). The post names competitor tools (ExamMint, myexamphoto.in, govtphotoresizer.com, SarkariResizer) without linking to them, which reads as less authoritative.
- `exam-photo-signature-size-guide` — no Quick-answer box despite being the main pillar. Uses an inline callout with a "Quick answer" label but the structure differs from the other 7 posts; inconsistent.

### Competitor Comparison Posts (4 posts) — Score: 65 / 100
**Files:** `best-free-passport-photo-maker-india-2026`, `cutout-pro-alternative-india`, `visafoto-alternative-india-free`, `best-free-exam-photo-resizer-india`

**Critical — missing page metadata (all 4 posts):**
These posts use `BlogPostLayout` but do NOT export `export const metadata`. Next.js falls back to the root layout's generic metadata:
- Title: `"Passport, Visa & Exam Photo Maker — Free, In-Browser"`
- Description: `"Create a compliant passport or visa photo for free..."`

This generic metadata will appear in Google search results for all four posts, regardless of their actual content. A user searching for "free Cutout Pro alternative India" will see the wrong page title in SERPs. All four posts have entries in `lib/blog.ts` — the fix is adding `export const metadata = pageMetadata({...})` to each page.

**Strengths:**
- All three include a "Transparency" disclosure at the top that names easyPhoto as the author's product. This follows YMYL best practice for editorial disclosure.
- Comparison tables are well-formatted with verified pricing and privacy data.
- `cutout-pro-alternative-india` and `best-free-passport-photo-maker-india-2026` include a "pricing verified June 2026" note below each table.

**Issues:**
- `cutout-pro-alternative-india` references a data breach: "Public reports (Cybernews researchers, 2023; Trustpilot user reviews referencing a data set posted to BreachForums in February 2024)". Zero links to these sources. This is the riskiest claim in the entire content inventory — either cite it or soften it.
- No FAQ on any of the 4 comparison posts. FAQ schema would help with AI citation and featured snippets, especially for "Is Cutout.pro safe?" type queries.
- No external links in `best-free-exam-photo-resizer-india` — competitor tools are listed but not linked.
- `visafoto-alternative-india-free` is 193 lines, the thinnest of the 4 comparison posts. The "easyPhoto" section is marked with italic `*This is our product.*` but the section itself is shorter than the sections for competitors, which may read as less credible.

### International Passport Posts (8 posts) — Score: 79 / 100
**Files:** `passport-photo-size-by-country`, `passport-photo-background-color`, `why-passport-photos-get-rejected`, `baby-and-infant-passport-photo-guide`, `how-to-take-a-passport-photo-at-home`, `schengen-europe-visa-photo-size`, `indian-passport-photo-size-rules`, `linkedin-profile-photo-size-and-tips`

**Strengths:**
- Strong external citation discipline: every government source (passportindia.gov.in, travel.state.gov, UKVI) is linked with rel="noopener".
- `indian-passport-photo-size-rules` correctly explains the 35×45 mm vs 45×35 mm confusion (portrait orientation), which is a real, common user error. High informational value.
- FAQ present on all 8 posts.
- H2 counts adequate (5–8 per post).

**Issues:**
- `schengen-europe-visa-photo-size` has only 3 H2s — the lowest of all posts. At ~75 lines, it is the shortest content post and offers less coverage than the query demands (Germany + France + Italy each have separate background color rules that could each warrant a heading).
- `baby-and-infant-passport-photo-guide` has no external citation to GOV.UK or US State Dept infant photo guidance, which are the authoritative sources for the country-specific rules mentioned.

### Utility / How-to Posts (4 posts) — Score: 78 / 100
**Files:** `how-to-reduce-passport-photo-size-for-online-forms`, `how-to-compress-pdf`, `how-to-merge-pdf-free`, `how-to-mask-aadhaar-before-sharing`

**Strengths:**
- All link to the relevant tool from within the post body (internal cross-sell).
- `how-to-mask-aadhaar-before-sharing` links to UIDAI.gov.in, which is essential for a post about a government ID document.
- FAQ present on all 4 posts.

**Issues:**
- `how-to-merge-pdf-free` and `how-to-compress-pdf` have no external citations. PDF compression and merging are not government-spec topics, so this is lower risk, but citing a tool comparison (e.g., linking to a PDF.js documentation page) would improve authority.
- `how-to-compress-pdf`: meta description is 236 characters — the worst in the inventory.

### Tool Landing Pages — Score: 70 / 100
**Files:** `app/photo-resize-to-{10,20,30,50,100,200}kb/page.tsx` and signature equivalents

**Pattern:** The 6 photo-resize-to-Xkb pages are only 13 lines each — they delegate entirely to the `KbResizeLanding` shared component. The component itself (`components/tools/KbResizeLanding.tsx`) is comprehensive: JSON-LD, FAQ, breadcrumbs, HowTo schema (deprecated but harmless), privacy badge, related tools links. So the rendered page is rich even though the route file is thin.

**Strengths:**
- `KbResizeLanding` generates contextual FAQs dynamically ("How do I resize a photo to {N} KB?") so each landing page has unique, query-specific FAQ content.
- Signature resize pages (e.g., `signature-resize-to-10kb/page.tsx`) have 114-line route files with inline FAQs, related tool links, and a privacy badge.
- `SoftwareApplication` schema is wired on all tool pages with `isAccessibleForFree: true` and `price: "0"`.

**Issues:**
- The `HowToSchema` function returns `null` (deprecated; Google removed HowTo rich results September 2023). The call sites still pass in HowTo data that is silently discarded. No immediate SEO harm, but dead code that could confuse future editors.
- Hindi landing pages (`/photo-ka-size-100kb-kaise-kare/` etc.) delegate to `HinglishLanding`. These pages have FAQ in Roman Hinglish but no external citations and minimal body content — they are primarily tool wrappers. For a mixed-language audience that is ~50% of India's search volume, the Hindi pages could benefit from a 2–3 sentence intro in Hinglish before the tool embed.

---

## Future-Dated Posts (Critical Trust Risk)

Four posts have publish dates in the future relative to today (2026-06-18):

| Slug | dateISO | Days in future |
|---|---|---|
| `indian-passport-photo-size-rules` | 2026-07-14 | +26 days |
| `upsc-cse-ias-photo-signature-guide-2026` | 2026-07-07 | +19 days |
| `nda-cds-photo-signature-guide-2026` | 2026-07-04 | +16 days |
| `ssc-cgl-chsl-photo-signature-guide-2026` | 2026-07-01 | +13 days |

These dates are set in `lib/blog.ts` and feed directly into BlogPosting schema `datePublished`. Google may:
- Delay indexing articles marked as not yet published.
- Show a future date in SERPs next to the article title, which can suppress CTR.
- Treat them as low-trust (future-dated content is a known spam signal in some contexts).

If these posts are live today (they are in the `BLOG_POSTS` array and linked from the blog index), their `dateISO` should reflect the actual publish date, not a planned date.

---

## Schema & Structured Data Review

| Schema type | Implementation | Status |
|---|---|---|
| `BlogPosting` | Via `BlogPostLayout` on all 24 posts | Good |
| `Person` (author) | Linked from `AUTHOR` constant; all fields populated | Good |
| `Organization` | `organizationSchema()` in root layout | Good |
| `WebSite` | `websiteSchema()` in root layout | Good |
| `BreadcrumbList` | On every blog post | Good |
| `FAQPage` | `faqSchema()` called on 20 of 24 blog posts | Gap: 4 missing |
| `SoftwareApplication` | On tool landing pages | Good |
| `HowTo` | Called but returns `null` — dead code | Low risk |
| `AboutPage` | On `/about/` | Good |
| `ContactPage` | On `/contact/` | Good |

**Missing FAQPage schema on 4 posts:**
`best-free-passport-photo-maker-india-2026`, `best-free-exam-photo-resizer-india`, `cutout-pro-alternative-india`, `visafoto-alternative-india-free` — all four competitor comparison posts. Adding a `<Faq>` component with a `JsonLd` call including `faqSchema()` would close this gap.

**OG image:** All 24 blog posts have per-post `opengraph-image.tsx` files that dynamically generate an OG card using `ogImage({ title, subtitle })`. The image is not post-specific artwork — it is a title card — but it is unique per post, which is better than using a single static `/og.png`.

---

## Internal Linking Audit

- Every blog post links to at least one tool page from within the body copy.
- `BlogPostLayout` renders 2 "Keep reading" posts at the bottom of every post (first 2 posts in `BLOG_POSTS` filtered to exclude current slug). This means the same 2 posts always appear in "Keep reading" for all but those 2 posts. A random or topic-related selection would distribute PageRank better.
- No orphan pages — all posts are in the blog index.
- Tool pages cross-link to related tools via "Related tools" chip rows.

---

## Content Freshness

- 3 posts have `updatedISO` set: `best-free-exam-photo-resizer-india`, `best-free-passport-photo-maker-india-2026`, `exam-photo-signature-size-guide` — all set to `2026-06-18`.
- 21 posts have no `updatedISO`, so their `dateModified` in schema equals `datePublished`. For evergreen posts (background color rules, baby photo guide) this is acceptable. For time-sensitive exam specs that change each cycle, missing `updatedISO` means Google cannot tell the content was re-verified.
- `ibps-po-2026-photo-signature-checklist` references specific 2026 exam dates but has no `updatedISO`. If specs change before the August 2026 prelims, the schema will still show the June 13 publish date.

---

## Duplicate / Cannibalization Risk

No cannibalization detected across the 24 posts. Each targets a distinct query cluster:
- Exam-specific guides (UPSC vs SSC vs IBPS vs NDA) differentiated by board-specific specs.
- Competitor comparison posts are differentiated by competitor (Cutout.pro vs Visafoto vs generic best-of).
- How-to posts are operation-specific (resize vs compress vs merge vs mask).

One mild overlap: `exam-photo-signature-size-guide` and `why-exam-photo-signature-rejected` both answer "what size does my exam photo need to be." The former is the pillar; the latter is a rejection-reason post. They serve different intent (spec lookup vs troubleshooting) and cross-link to each other, so the overlap is acceptable.

---

## Prioritized Action Queue

### Critical (do first)

**C1 — Add `export const metadata` to 4 competitor comparison posts**
These 4 posts are currently indexed with the root layout's generic title and description. Fix in each page.tsx:
```
// Add at top of each of these files:
import { pageMetadata } from "@/lib/seo";
import { getPost } from "@/lib/blog";
const post = getPost("<slug>")!;
export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});
```
Affected files:
- `app/blog/cutout-pro-alternative-india/page.tsx`
- `app/blog/best-free-exam-photo-resizer-india/page.tsx`
- `app/blog/best-free-passport-photo-maker-india-2026/page.tsx`
- `app/blog/visafoto-alternative-india-free/page.tsx`

**C2 — Fix future-dated posts to use actual publish dates**
In `lib/blog.ts`, change the 4 future-dated posts to use today's date or a past date when the content was actually written. Future `dateISO` feeds directly into `datePublished` in BlogPosting schema.
- `indian-passport-photo-size-rules`: change `2026-07-14` → `2026-06-18`
- `upsc-cse-ias-photo-signature-guide-2026`: change `2026-07-07` → `2026-06-18`
- `nda-cds-photo-signature-guide-2026`: change `2026-07-04` → `2026-06-18`
- `ssc-cgl-chsl-photo-signature-guide-2026`: change `2026-07-01` → `2026-06-18`

**C3 — Remove or properly source the BreachForums claim in cutout-pro-alternative-india**
The post states: _"Public reports (Cybernews researchers, 2023; Trustpilot user reviews referencing a data set posted to BreachForums in February 2024)"_ without a link. Either add a direct URL to the Cybernews article and a Trustpilot permalink, or soften to: _"Cutout.pro's own privacy policy confirms 24–48 hour AWS retention; independent review sites have noted user concerns about data security practices."_

### High Priority

**H1 — Add FAQ + FAQPage schema to 4 competitor comparison posts**
None of the 4 comparison posts (`cutout-pro-alternative-india`, `best-free-exam-photo-resizer-india`, `best-free-passport-photo-maker-india-2026`, `visafoto-alternative-india-free`) have a `<Faq>` component or `faqSchema()`. FAQ schema is the most reliable path to featured-snippet inclusion for comparison queries like "is Cutout.pro free?" or "best free passport photo tool India."

**H2 — Add external links to competitor names in best-free-exam-photo-resizer-india**
The post names ExamMint, myexamphoto.in, govtphotoresizer.com, and SarkariResizer without linking to them. Users who want to verify claims cannot follow through. Add `rel="noopener noreferrer"` links to each competitor's homepage.

**H3 — Upgrade author title credential**
Change `title: "Web & mobile developer"` in `lib/author.ts` to something that surfaces domain authority: `"Document compliance researcher and developer"` or `"Photo & document compliance specialist"`. The `jobTitle` in Person schema feeds AI citation engines that use this to assess expertise.

**H4 — Add external citations to baby-and-infant-passport-photo-guide**
Link to the US State Department's infant photo guidance (travel.state.gov) and UK HMPO guidance for the country-specific rules. The post makes country-specific claims without sources.

### Medium Priority

**M1 — Expand schengen-europe-visa-photo-size (only 3 H2s, thin content)**
The Schengen post is the shortest substantive post. Germany, France, Spain, Italy each have distinct background rules that deserve individual H2s. Target 6–8 H2s and 1000+ words for competitive Schengen visa photo queries.

**M2 — Set updatedISO on time-sensitive exam posts after each verification cycle**
When a new IBPS, SSC, or UPSC notification drops, update the post and set `updatedISO` in `lib/blog.ts`. This directly affects `dateModified` in BlogPosting schema and signals freshness to Google.

**M3 — Fix "Keep reading" to surface topically related posts**
`BlogPostLayout` always shows the first 2 posts in `BLOG_POSTS` (after filtering current). This means `indian-passport-photo-size-rules` and `cutout-pro-alternative-india` appear as "Keep reading" on unrelated posts like `how-to-compress-pdf`. A topically grouped version would reduce bounce and improve topical authority.

**M4 — Remove HowTo schema call sites**
`howToSchema()` was deprecated when Google removed HowTo rich results in September 2023. The function now returns `null`. The call sites in `KbResizeLanding`, `signature-resize-to-10kb`, and others pass complete `steps` data that is silently discarded. Remove the calls to reduce dead code confusion.

### Low Priority

**L1 — Expand Organization.sameAs to include more verified profiles**
Currently only Pinterest. Add LinkedIn company page (if one exists), X/Twitter handle, and YouTube if content is published there.

**L2 — Add 2–3 sentence Hinglish intro to Hindi landing pages**
Pages like `/photo-ka-size-100kb-kaise-kare/` embed a tool immediately with minimal body content. A 2-sentence Hinglish introduction before the tool would improve crawlability and user orientation.

**L3 — Add updatedISO to best-free-exam-photo-resizer-india, best-free-passport-photo-maker-india-2026**
Both have `updatedISO: "2026-06-18"` already set — good. Ensure these are re-updated after each pricing verification cycle (quarterly minimum for competitor pricing data).

---

## What Works Well

1. **Author identity implementation** — Named byline, avatar, LinkedIn link, Person schema with `knowsAbout`, and "About the author" card on every post. More complete than most Indian content sites at this scale.

2. **Editorial transparency** — Every post has an "How we keep this accurate" block. Every competitor comparison post has a "Transparency: easyPhoto is our product" disclosure at the top. This is a meaningful E-E-A-T differentiator.

3. **Quick-answer callout boxes** — Present on 20/24 posts. These boxes are optimally formatted for AI Overview and SGE passage extraction: short bullets, specific numbers, authority pointer at the end.

4. **Government source citations** — The exam guide posts link directly to `ssc.gov.in`, `upsc.gov.in`, `upsconline.nic.in`, `ibps.in`, `nta.ac.in`, `passportindia.gov.in`. These are primary sources, not secondary aggregators.

5. **On-device privacy as trust signal** — The privacy architecture (client-side processing, no server upload) is genuinely differentiated and is stated clearly on every tool page, the About page, and in the editorial block. Competitor tools (Cutout.pro, Visafoto) upload to servers — this differentiation is real and well-articulated.

6. **Internal linking saturation** — All 24 posts link to relevant tools. No orphan pages. Tool pages cross-link via related-tools chips.

7. **FAQ coverage** — 20/24 posts have FAQ sections with schema. For a site targeting high-volume informational queries, this is good coverage.

8. **BlogPosting schema completeness** — Every post has `datePublished`, `dateModified`, `headline`, `description`, `author` (Person), `publisher` (Organization/@id), `mainEntityOfPage`, `inLanguage: "en-IN"`. The schema is well above average for this site category.

---

## Scoring Breakdown

| Dimension | Score | Max | Notes |
|---|---|---|---|
| Content depth & accuracy | 19 | 25 | Pillar posts strong; comparison posts missing citations |
| E-E-A-T signals | 16 | 25 | Author signal good; title credential weak; single social proof |
| Structured data | 12 | 15 | BlogPosting comprehensive; 4 posts missing FAQPage; HowTo dead |
| Page metadata | 8 | 15 | 4 posts rendering generic root title/description |
| Freshness & dating | 10 | 12 | 4 future-dated posts; updatedISO gaps |
| Internal linking | 8 | 8 | Full coverage; no orphans |
| **Total** | **73** | **100** | |
