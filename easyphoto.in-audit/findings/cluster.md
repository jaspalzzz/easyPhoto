# Semantic Topic Cluster Audit — easyphoto.in
**Date:** 2026-06-18
**Source data:** lib/blog.ts (24 posts), app/tools/ (30+ tool pages), app/passport-photo/page.tsx

---

## 1. Current Content Clusters

### Cluster A — Indian Passport Photo (strongest cluster)
**Hub:** `/passport-photo/` (tool page, transactional)
**Declared spokes:**
- `/blog/indian-passport-photo-size-rules/` — pillar blog post (Informational, 8 min)
- `/blog/passport-photo-size-by-country/` — Informational
- `/blog/passport-photo-background-color/` — Informational
- `/blog/how-to-take-a-passport-photo-at-home/` — Informational
- `/blog/why-passport-photos-get-rejected/` — Informational
- `/blog/baby-and-infant-passport-photo-guide/` — Informational
- `/blog/how-to-reduce-passport-photo-size-for-online-forms/` — Informational
- `/blog/schengen-europe-visa-photo-size/` — Informational (partial overlap)

**Supporting tool spokes (transactional):** `/tools/white-background/`, `/tools/background-removal/`, `/tools/resize-kb/`

**Assessment:** Healthiest cluster. All blog spokes link to `/passport-photo/` hub via inline CTAs. The pillar post `indian-passport-photo-size-rules` links to `passport-photo-background-color`, `how-to-take-a-passport-photo-at-home`, `why-passport-photos-get-rejected`, `baby-and-infant-passport-photo-guide`, `how-to-reduce-passport-photo-size-for-online-forms`, and `passport-photo-size-by-country`.

---

### Cluster B — Government Exam Photo & Signature (second strongest)
**Hub:** `/blog/exam-photo-signature-size-guide/` (pillar blog, Informational, 10 min)
**Spokes:**
- `/blog/ssc-cgl-chsl-photo-signature-guide-2026/` — Informational
- `/blog/ibps-po-2026-photo-signature-checklist/` — Informational
- `/blog/upsc-cse-ias-photo-signature-guide-2026/` — Informational
- `/blog/nda-cds-photo-signature-guide-2026/` — Informational
- `/blog/why-exam-photo-signature-rejected/` — Informational
- `/blog/add-name-date-on-exam-photo/` — Informational
- `/blog/best-free-exam-photo-resizer-india/` — Commercial

**Supporting tool spokes:** `/tools/exam-package/`, `/tools/form-resizer/` (SSC, IBPS, UPSC resizer paths)

**Assessment:** Hub links to all major exam spokes. Spokes link back to hub in-body. `why-exam-photo-signature-rejected` references `/exam-requirements/` and `/exam-resizer/ssc-cgl/` — these appear to be planned URL slugs that do not yet exist as pages (dead internal links). `add-name-date-on-exam-photo` links correctly to `nda-cds-photo-signature-guide-2026` and `why-exam-photo-signature-rejected`. No RRB-specific spoke exists despite the hub covering RRB NTPC/ALP/Group D in depth.

---

### Cluster C — Signature Tools (weakest cluster — no blog hub)
**Hub:** `/tools/signature-cleaner/` (tool page, transactional)
**Related tools (no dedicated blog spoke for any):**
- `/tools/signature/`
- `/tools/signature-background-removal/`
- `/tools/signature-crop/`
- `/tools/signature-resize/`
- `/tools/transparent-signature/`
- `/tools/sign-image/`
- `/tools/sign-pdf/`

**Blog support:** Zero dedicated blog spokes. The signature sub-topic is covered only as sections within the exam guide pillar. `exam-photo-signature-size-guide` links to `/signature-resize-to-20kb/` (a KB-target alias), not to `/tools/signature-cleaner/`.

**Assessment:** Critical gap. The signature tool cluster has no informational entry point. Users searching "how to make signature white background", "signature resize for exam", or "photo to signature converter" land on a tool page with no supporting editorial content and no hub-spoke architecture.

---

### Cluster D — LinkedIn & Professional Photo (partial cluster)
**Hub:** `/tools/linkedin-photo/` (tool page, transactional)
**Blog spoke:** `/blog/linkedin-profile-photo-size-and-tips/` — Informational

**Adjacent spokes:** `/blog/resume-photo-size-and-rules/` — Informational; `/tools/resume-photo/`

**Assessment:** Two-page cluster only. `linkedin-profile-photo-size-and-tips` correctly links to `/tools/linkedin-photo/`, `/tools/background-removal/`, `/tools/white-background/`, `/tools/resume-photo/`, and `resume-photo-size-and-rules`. `resume-photo-size-and-rules` links back to `linkedin-profile-photo-size-and-tips` and to `/tools/linkedin-photo/` and `/tools/resume-photo/`. Cross-linking between the two blog spokes is solid but the cluster is thin — only 2 blog posts.

---

### Cluster E — PDF & Document Tools (isolated, no editorial hub)
**Tool pages exist:** `/tools/pdf/`, `/tools/pdf-compress/`, `/tools/pdf-merge/`, `/tools/pdf-split/`, `/tools/pdf-to-jpg/`, `/tools/jpg-to-pdf/`, `/tools/pdf-page-numbers/`, `/tools/pdf-reorder/`, `/tools/unlock-pdf/`, `/tools/watermark-pdf/`

**Blog posts:** `/blog/how-to-compress-pdf/`, `/blog/how-to-merge-pdf-free/`

**Missing hub:** No pillar "PDF tools for exam applications" page exists. Two standalone how-to posts cover compress and merge. Eight tool pages have no blog support.

---

### Cluster F — Competitor/Alternative Content (orphaned)
**Posts:** `/blog/cutout-pro-alternative-india/`, `/blog/visafoto-alternative-india-free/`, `/blog/best-free-passport-photo-maker-india-2026/`, `/blog/best-free-exam-photo-resizer-india/`

**Assessment:** These four posts serve Commercial intent ("best free X") and comparison queries. They share SERP overlap with the passport photo and exam clusters but sit as orphans — `cutout-pro-alternative-india` and `visafoto-alternative-india-free` use `BlogPostLayout` without the full post metadata (`getPost()` call), meaning they will not appear in the `BLOG_POSTS` registry for the "Keep reading" sidebar. They also lack explicit spoke-to-pillar links for their respective clusters.

---

### Cluster G — Aadhaar / Identity Document (single orphan)
**Post:** `/blog/how-to-mask-aadhaar-before-sharing/` — Informational
**Tool:** `/tools/mask-aadhaar/`

**Assessment:** Standalone page. No cluster. No inbound links from other posts observed. Potential to expand into a "Government document privacy" micro-cluster.

---

## 2. Hub-and-Spoke Gaps

### Gap 1 — No RRB-specific exam spoke
The exam cluster hub (`exam-photo-signature-size-guide`) covers RRB NTPC, ALP and Group D in a dedicated section with specific specs (including thumb impression upload). No standalone `/blog/rrb-ntpc-alp-photo-signature-guide-2026/` post exists. RRB exams attract high search volume (Railway exams are the largest recruitment in India by applicant count).

### Gap 2 — No signature cluster blog hub
The signature tools cluster (7 tool pages) has zero blog support. Missing posts:
- "How to make a signature white background for exam forms" (Informational hub)
- "How to resize signature to 10 KB / 20 KB" (Informational spoke)
- "Digital signature vs scanned signature for government forms" (Informational spoke)

### Gap 3 — No NTA/NEET/JEE-specific exam spoke
The hub covers NTA (NEET and JEE Main) with distinct specs (10–200 KB, JPG or PNG, no live capture). No `/blog/neet-jee-photo-signature-guide-2026/` post exists despite this being a very high-volume segment (NTA processes 2M+ applicants per cycle).

### Gap 4 — No SBI-specific exam spoke
IBPS and SBI share near-identical specs. The hub covers both. A standalone `/blog/sbi-po-clerk-photo-signature-guide-2026/` would capture separate search queries for SBI applicants who may not find the IBPS post relevant to them.

### Gap 5 — No PDF cluster pillar
Eight PDF tool pages exist with only two how-to posts. A pillar "How to prepare documents for exam/visa applications" or "PDF tools for government applications" is missing. `how-to-compress-pdf` and `how-to-merge-pdf-free` do not link to each other.

### Gap 6 — No Aadhaar / document privacy cluster
`how-to-mask-aadhaar-before-sharing` is a standalone. Related missing posts: "Documents needed for passport application India", "How to scan documents for online forms".

### Gap 7 — No visa photo cluster hub
`schengen-europe-visa-photo-size` exists but there is no `/blog/visa-photo-requirements-by-country/` pillar. Tool pages exist for country-specific visa photos (`/germany-visa-photo-maker/`, `/france-visa-photo-maker/`, etc.) but no editorial hub connects them.

### Gap 8 — Baby passport photo is weakly connected
`baby-and-infant-passport-photo-guide` links to `/baby-passport-photo/` (a tool alias) but this tool page does not appear in the `app/tools/` directory listing, suggesting it may be a redirect alias rather than a full tool page. No inbound links from `indian-passport-photo-size-rules` to the baby guide exist (the Indian passport post does link to it in the rejection section, but the home page of the passport cluster does not).

---

## 3. Internal Linking Density

### BlogPostLayout auto-linking
The `BlogPostLayout` component adds:
- "All articles" back-link to `/blog/`
- "Keep reading" sidebar with the first 2 posts from `BLOG_POSTS` by array order (not topically related)
- Hardcoded closing CTA linking to `/passport-photo/` (same CTA on EVERY blog post, regardless of topic)

**Critical finding:** The "Keep reading" widget uses `BLOG_POSTS.filter(...).slice(0, 2)` — it always shows the top two posts in array order (currently `indian-passport-photo-size-rules` and `cutout-pro-alternative-india`) for every non-first post, and a slightly different pair for those early posts. This is not semantically related — an exam post reader sees passport alternative posts in the sidebar.

**Critical finding:** The closing CTA always links to `/passport-photo/` even on exam, signature, LinkedIn, or PDF posts. An IBPS applicant reading `ibps-po-2026-photo-signature-checklist` sees "Make your passport photo" as the CTA, not "Resize for IBPS".

### Spoke-to-pillar linking (manual, in-body)

| Spoke post | Links to cluster hub? | Inbound from hub? |
|---|---|---|
| `indian-passport-photo-size-rules` | Yes → `/passport-photo/` | Yes (via `how-to-reduce-passport-photo-size-for-online-forms` and `why-passport-photos-get-rejected`) |
| `passport-photo-background-color` | Yes → `/passport-photo/` | Yes (linked from `indian-passport-photo-size-rules`) |
| `passport-photo-size-by-country` | Yes → `/passport-photo/` | Yes (linked from `indian-passport-photo-size-rules`) |
| `how-to-take-a-passport-photo-at-home` | Yes → `/passport-photo/` | Yes (linked from `indian-passport-photo-size-rules`, `exam-photo-signature-size-guide`) |
| `why-passport-photos-get-rejected` | Yes → `/passport-photo/` | Yes (linked from `indian-passport-photo-size-rules`) |
| `baby-and-infant-passport-photo-guide` | Yes → `/baby-passport-photo/` (alias, not main hub) | Yes (linked from `indian-passport-photo-size-rules`) |
| `ssc-cgl-chsl-photo-signature-guide-2026` | Partial — links to exam tools, no explicit link to `exam-photo-signature-size-guide` | Yes (linked from hub) |
| `ibps-po-2026-photo-signature-checklist` | Needs review — likely links to IBPS resizer, may not link back to hub | Yes (linked from hub) |
| `upsc-cse-ias-photo-signature-guide-2026` | Partial | Yes (linked from hub) |
| `nda-cds-photo-signature-guide-2026` | Partial | Yes (linked from hub, and from `add-name-date-on-exam-photo`) |
| `why-exam-photo-signature-rejected` | No explicit link to hub observed; links to `/exam-requirements/` (non-existent page) | Yes (linked from hub and `add-name-date-on-exam-photo`) |
| `add-name-date-on-exam-photo` | Links to `/exam-requirements/` (non-existent), `/exam-resizer/upsc-cse/` and `/exam-resizer/upsc-nda/` (non-existent) | Yes (linked from hub) |
| `linkedin-profile-photo-size-and-tips` | Yes → `/tools/linkedin-photo/` | No inbound from tools hub or other posts except `resume-photo-size-and-rules` |
| `resume-photo-size-and-rules` | Yes → `/tools/resume-photo/`, `/tools/linkedin-photo/` | Yes (from `linkedin-profile-photo-size-and-tips`) |
| `schengen-europe-visa-photo-size` | Yes → `/visa-photo/` | Yes (from `passport-photo-size-by-country` via table) |
| `how-to-compress-pdf` | No links to `how-to-merge-pdf-free` | Isolated |
| `how-to-merge-pdf-free` | No links to `how-to-compress-pdf` | Isolated |
| `how-to-mask-aadhaar-before-sharing` | Yes → `/tools/mask-aadhaar/` | Isolated (no inbound links from other posts) |
| `cutout-pro-alternative-india` | Not registered in `BLOG_POSTS` — no `getPost()` call | Isolated |
| `visafoto-alternative-india-free` | Not registered in `BLOG_POSTS` — no `getPost()` call | Isolated |

### Dead internal links detected
- `/exam-requirements/` — referenced in `why-exam-photo-signature-rejected` and `add-name-date-on-exam-photo`. Page does not exist in `app/` directory.
- `/exam-resizer/ssc-cgl/`, `/exam-resizer/ibps-po/`, `/exam-resizer/upsc-cse/`, `/exam-resizer/upsc-nda/` — referenced in `why-exam-photo-signature-rejected` and `add-name-date-on-exam-photo`. These appear to be planned URL routes not yet built.
- `/ssc-photo-with-name-date/` — referenced in `add-name-date-on-exam-photo`. Not found in app directory listing.
- `/convert/` — referenced in `why-exam-photo-signature-rejected`. Not confirmed in app directory.

---

## 4. Keyword Cannibalization Risks

### Risk 1 — HIGH: "exam photo size India" / "photo size for govt exam"
Pages competing: `exam-photo-signature-size-guide` (hub, 10 min) vs `best-free-exam-photo-resizer-india` (Commercial comparison). Both target the same informational query space around exam photo specifications. The comparison post contains a full spec table that duplicates the hub's spec table almost verbatim. SERP overlap likely 7–9 out of 10.

**Recommendation:** Differentiate by intent. Hub = definitive spec guide (Informational). Comparison post = explicitly Commercial ("best tool for…"), with the spec table removed or heavily abbreviated and replaced by a single link to the hub's table. Currently both fight for the same featured snippet.

### Risk 2 — HIGH: "Indian passport photo size" vs "passport photo size India"
Pages competing: `indian-passport-photo-size-rules` vs `best-free-passport-photo-maker-india-2026`. Both contain the full India spec (35×45 mm, 630×810 px, 250 KB). The maker comparison post opens with "The Passport Seva portal specifies 35×45 mm JPG…" — nearly identical content to the pillar's quick-answer box. SERP overlap likely 7–8 out of 10.

**Recommendation:** Same fix — maker comparison post should reference the spec from `indian-passport-photo-size-rules` with a link rather than restating it.

### Risk 3 — MEDIUM: "how to take passport photo at home" vs "why passport photos get rejected"
Both posts contain background-colour tables for the same 6 countries with the same data. `how-to-take-a-passport-photo-at-home` goes further on setup/technique; `why-passport-photos-get-rejected` goes further on rejection reasons. Some SERP overlap expected (4–6 out of 10). Risk is manageable — distinct H1 intent — but the duplicated country tables create thin-content signals.

**Recommendation:** Keep tables but add `<link rel="canonical">` awareness; cross-link explicitly between the two. The `why-rejected` post should defer background detail to `background-color` post rather than restating a country table.

### Risk 4 — MEDIUM: "SSC photo signature" targeting
`exam-photo-signature-size-guide` (hub) has a full SSC section with spec table. `ssc-cgl-chsl-photo-signature-guide-2026` is the dedicated spoke. Both could rank for "SSC CGL photo size", "SSC CHSL signature size". The hub's SSC section explicitly links to the spoke as "for the full SSC spec table… see the dedicated SSC guide", which is the correct hub-to-spoke pattern. Risk is lower than it appears if Google correctly interprets hub-spoke hierarchy, but the hub section is substantive enough to compete.

**Recommendation:** Keep current pattern. Consider adding `<link rel="canonical">` signals or using HubPage/Article schema to declare the relationship explicitly.

### Risk 5 — LOW: "passport photo background color" vs "how to take passport photo at home"
Both posts contain background colour tables for the same countries. `passport-photo-background-color` is the authoritative page; `how-to-take-a-passport-photo-at-home` contains a near-duplicate table as supporting context. This is the correct hierarchy (spoke references authoritative spoke), but the tables create near-duplicate content.

**Recommendation:** In `how-to-take-a-passport-photo-at-home`, replace the inline country table with a 2-sentence summary + link to `passport-photo-background-color` as the canonical source.

### Risk 6 — LOW: "Cutout Pro alternative India" vs "best free passport photo maker India"
Both posts serve the "free alternative to paid passport photo tool" Commercial query. `cutout-pro-alternative-india` is product-specific; `best-free-passport-photo-maker-india-2026` is a broader roundup that includes Cutout.pro. SERP overlap is moderate (3–5 out of 10) since one is brand-specific. Risk is manageable.

---

## 5. Content Gap Opportunities (High-Volume Uncovered Topics)

### Gap A — RRB / Railway exam photo guide
**Target query:** "RRB NTPC photo size", "Railway exam photo signature spec 2026"
**Volume signal:** Railway exams attract the largest applicant pool in India. No dedicated spoke exists.
**Recommended post:** `/blog/rrb-ntpc-alp-group-d-photo-signature-guide-2026/`
**Cluster:** Exam cluster spoke under `exam-photo-signature-size-guide` hub.

### Gap B — Signature preparation hub
**Target queries:** "how to make signature for exam form", "signature white background for bank form", "how to scan signature for online form India"
**Volume signal:** Every Indian exam applicant needs a signature. "Signature background white" is a high-frequency query appearing in rejection reasons nationwide.
**Recommended post:** `/blog/how-to-prepare-signature-for-exam-forms/`
**Cluster:** New signature cluster hub, with `/tools/signature-cleaner/` as the tool hub.

### Gap C — NEET / JEE photo guide
**Target query:** "NEET 2026 photo size", "JEE Main photo upload requirements"
**Volume signal:** NTA processes 1.5M+ NEET applicants and 1M+ JEE applicants annually.
**Recommended post:** `/blog/neet-jee-photo-signature-requirements-2026/`
**Cluster:** Exam cluster spoke.

### Gap D — SBI PO / Clerk photo guide
**Target query:** "SBI PO photo size 2026", "SBI Clerk photo signature requirements"
**Volume signal:** SBI is the largest public bank recruitment; separate search intent from IBPS despite identical specs.
**Recommended post:** `/blog/sbi-po-clerk-photo-signature-guide-2026/`
**Cluster:** Exam cluster spoke.

### Gap E — Visa photo cluster pillar
**Target query:** "visa photo requirements by country", "how to make visa photo at home India"
**Volume signal:** India has the highest Schengen visa application volume in Asia. Country-specific visa tool pages exist but no editorial hub.
**Recommended post:** `/blog/visa-photo-requirements-india/` (pillar covering US, Schengen, UK, Canada visa photos from the Indian applicant perspective)
**Cluster:** New visa photo cluster with `/visa-photo/` as tool hub.

### Gap F — "Photo size in KB" how-to content
**Target query:** "how to reduce photo size to 50 KB", "resize photo to 20 KB for online form"
**Volume signal:** Extremely high frequency search from exam applicants. `/blog/how-to-reduce-passport-photo-size-for-online-forms/` partially covers this but is passport-framed. An exam-framed "how to compress photo to exact KB" post would capture exam-specific intent.
**Cluster:** Exam cluster spoke or KB tools cluster.

### Gap G — Aadhaar / KYC document cluster
**Target queries:** "documents for passport application India", "how to scan Aadhaar for online form"
**Volume signal:** Evergreen government form demand. `how-to-mask-aadhaar-before-sharing` is the only entry point.
**Recommended posts:** `/blog/documents-required-for-passport-india/`, `/blog/how-to-scan-documents-for-government-forms/`
**Cluster:** New document preparation cluster.

### Gap H — "Passport photo app India" (navigational-adjacent Commercial)
**Target query:** "best passport photo app India 2026", "free passport photo app no watermark"
**Volume signal:** App-intent searchers. `best-free-passport-photo-maker-india-2026` partially covers web tools. A post specifically targeting app-intent ("Why we chose browser over app and what that means for you") would capture this segment with a different angle.

---

## 6. Cross-Link Opportunities Between Existing Posts

### High-priority missing cross-links

| From | To | Rationale |
|---|---|---|
| `how-to-compress-pdf` | `how-to-merge-pdf-free` | Both target exam document preparation; no cross-link exists in either direction |
| `how-to-merge-pdf-free` | `how-to-compress-pdf` | Same — reciprocal link missing |
| `how-to-mask-aadhaar-before-sharing` | `how-to-compress-pdf` | Aadhaar is submitted as a PDF on most portals; natural cross-reference |
| `why-exam-photo-signature-rejected` | `exam-photo-signature-size-guide` | Current spoke does not link back to hub explicitly |
| `ssc-cgl-chsl-photo-signature-guide-2026` | `exam-photo-signature-size-guide` | No explicit back-link to hub detected |
| `ibps-po-2026-photo-signature-checklist` | `exam-photo-signature-size-guide` | Likely missing explicit hub back-link |
| `schengen-europe-visa-photo-size` | `passport-photo-background-color` | Both cover background colour by country; natural cross-reference |
| `passport-photo-background-color` | `schengen-europe-visa-photo-size` | Reciprocal — currently not linked |
| `how-to-reduce-passport-photo-size-for-online-forms` | `exam-photo-signature-size-guide` | Covers KB limits for exam portals; natural referral to exam pillar |
| `resume-photo-size-and-rules` | `indian-passport-photo-size-rules` | Resume size IS passport size in India — strong cross-reference opportunity |
| `cutout-pro-alternative-india` | `best-free-passport-photo-maker-india-2026` | Both are Commercial comparison posts on same topic cluster; no cross-link |
| `visafoto-alternative-india-free` | `best-free-passport-photo-maker-india-2026` | Same — missing cross-link between related Commercial posts |
| `baby-and-infant-passport-photo-guide` | `how-to-take-a-passport-photo-at-home` | Complementary how-to posts; baby guide should reference adult guide for shared technique context |

### Medium-priority cross-links

| From | To | Rationale |
|---|---|---|
| `add-name-date-on-exam-photo` | `upsc-cse-ias-photo-signature-guide-2026` | Links to `nda-cds` but not the UPSC CSE guide, which is the primary exam requiring name/date |
| `schengen-europe-visa-photo-size` | `indian-passport-photo-size-rules` | Indian applicants getting Schengen visa would benefit from comparison of their passport photo vs visa photo |
| `best-free-exam-photo-resizer-india` | `exam-photo-signature-size-guide` | Commercial comparison post should defer to the Informational pillar for spec detail |
| `best-free-passport-photo-maker-india-2026` | `indian-passport-photo-size-rules` | Commercial comparison post should defer to the spec pillar |

---

## 7. BlogPostLayout Structural Issues

### Issue 1 — Universal passport photo CTA is contextually wrong
Every blog post uses the same closing CTA: "Ready to make yours? — Open the photo maker → `/passport-photo/`". On exam-cluster posts this is irrelevant and reduces conversion. The CTA should be contextualised per post (exam posts → exam resizer, signature posts → signature cleaner, LinkedIn posts → LinkedIn photo maker).

### Issue 2 — "Keep reading" sidebar is not topically clustered
`BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2)` always returns the same 2 posts (approximately `indian-passport-photo-size-rules` and `cutout-pro-alternative-india`) as "Keep reading" suggestions for most posts. This wastes a high-visibility internal link slot. The widget should select posts from the same cluster (matching by topic tag or manually declared related slugs).

### Issue 3 — Competitor posts not in BLOG_POSTS registry
`cutout-pro-alternative-india` and `visafoto-alternative-india-free` use `BlogPostLayout` without calling `getPost()` to register in the `BLOG_POSTS` array. This means:
- They don't appear in the `/blog/` index page
- They are never suggested in "Keep reading" sidebars
- They won't generate sitemap entries if the sitemap is driven from `BLOG_POSTS`

---

## 8. Cannibalization Check Summary

| Pair | Overlap score (est.) | Action |
|---|---|---|
| `exam-photo-signature-size-guide` vs `best-free-exam-photo-resizer-india` | 8/10 | Differentiate — remove spec table from comparison post |
| `indian-passport-photo-size-rules` vs `best-free-passport-photo-maker-india-2026` | 7/10 | Differentiate — remove spec restatement from comparison post |
| `how-to-take-a-passport-photo-at-home` vs `why-passport-photos-get-rejected` | 5/10 | Acceptable — distinct H1 intent; remove duplicate country table from rejection post |
| `exam-photo-signature-size-guide` (SSC section) vs `ssc-cgl-chsl-photo-signature-guide-2026` | 5/10 | Acceptable — hub-spoke hierarchy; add explicit canonical signal |
| `passport-photo-background-color` vs `how-to-take-a-passport-photo-at-home` (table) | 4/10 | Fix — remove inline table from home-photo post, link to background-color post |
| `cutout-pro-alternative-india` vs `best-free-passport-photo-maker-india-2026` | 4/10 | Acceptable — brand-specific vs roundup |

---

## Priority Action List

**P1 — Fix immediately (dead links and registry gaps)**
1. Register `cutout-pro-alternative-india` and `visafoto-alternative-india-free` in `BLOG_POSTS` (add `getPost()` call and metadata entries)
2. Resolve dead links: `/exam-requirements/`, `/exam-resizer/ssc-cgl/`, `/exam-resizer/ibps-po/`, `/exam-resizer/upsc-cse/`, `/exam-resizer/upsc-nda/`, `/ssc-photo-with-name-date/` — either build the pages or update links to existing equivalents
3. Add `how-to-compress-pdf` ↔ `how-to-merge-pdf-free` cross-links

**P2 — Fix soon (linking and cannibalization)**
4. Update `BlogPostLayout` closing CTA to accept a configurable `ctaHref` and `ctaLabel` prop; set exam-cluster posts to point to `/tools/exam-package/`
5. Update "Keep reading" widget to use topically related posts (cluster-aware) rather than array-position
6. Remove or abbreviate spec tables in `best-free-exam-photo-resizer-india` and `best-free-passport-photo-maker-india-2026` to eliminate cannibalization, replacing with links to pillar posts
7. Remove country background table from `how-to-take-a-passport-photo-at-home` and replace with 2-sentence summary + link to `passport-photo-background-color`

**P3 — Create content gaps**
8. Write `/blog/rrb-ntpc-alp-group-d-photo-signature-guide-2026/` (exam cluster spoke)
9. Write `/blog/how-to-prepare-signature-for-exam-forms/` (new signature cluster hub)
10. Write `/blog/neet-jee-photo-signature-requirements-2026/` (exam cluster spoke)
11. Write `/blog/visa-photo-requirements-india/` (new visa cluster pillar)
12. Write `/blog/sbi-po-clerk-photo-signature-guide-2026/` (exam cluster spoke)
