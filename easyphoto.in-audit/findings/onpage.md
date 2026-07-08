# On-Page SEO Audit — easyphoto.in (RE-AUDIT)

**Audit date:** 2026-07-02
**Prior audit:** 2026-06-23 (On-Page SEO score 67/100) — this category has not been re-checked since baseline until now.
**Method:** Live fetch (`curl` + BeautifulSoup parse) of 7 URLs against production `https://easyphoto.in/`. Title tag, meta description, canonical, meta robots, H1/heading hierarchy (document order, skip-level detection), internal/external link inventory, and anchor-text quality extracted from raw server-rendered HTML (no JS execution required — confirms `technical.md`'s SSR finding holds for on-page elements too).
**Pages sampled:** `/`, `/passport-photo/`, `/exam-requirements/ssc/`, `/exam-requirements/driving-licence/`, `/exam-requirements/crpf/`, `/blog/indian-passport-photo-requirements/`, `/tools/resize-kb/`.

## Score: 64/100

Down slightly from 67/100. This is **not a regression** — no on-page element got worse since baseline. The score moved because this pass ran a template-level check the baseline didn't (title-length overflow across the exam-page title pattern) and layered in live GSC field data that turns a previously generic "meta descriptions run long" note into a confirmed, page-specific CTR failure. Net effect: same underlying defect class as baseline (title/meta-description length control), now proven to be costing real clicks on at least one page, plus a second page (`/exam-requirements/driving-licence/`) added to the affected set with a worse overflow than either page checked at baseline.

---

## Fix-Verification Table (Prior Finding → Current Status)

| Prior Finding (2026-06-23) | Prior Status | Current Status (2026-07-02, live) | Verification |
|---|---|---|---|
| Zero meta descriptions site-wide | Critical fail | **Fixed** — all 7 sampled pages carry a unique, keyword-relevant `<meta name="description">` | Confirmed again this pass; consistent with `content.md`'s independent confirmation on an overlapping page set. |
| Exam-page meta descriptions run long (SSC 217 / CRPF 195 chars, flagged in `content.md` sibling audit) | Flagged, not yet scored under On-Page | **Confirmed + worse than reported** — SSC still 217, CRPF still 195, and `/exam-requirements/driving-licence/` (not in the original sample) is **220 chars**, the longest of the three. Title tag on the same DL page is also 66 chars, over budget — a defect class the baseline's meta-description-only note didn't catch. | `curl` + char-count on live HTML, this session. |
| GSC quick-win pages at position 4–10 with low CTR (baseline flagged `/exam-requirements/army-agniveer/`) | Flagged as opportunity | **Superseded** — `google-api.md` (this audit cycle) shows `/exam-requirements/driving-licence/` has now overtaken army-agniveer as the top opportunity: 5 query variants, positions 3.4–7.4, ~49 combined impressions, **0 clicks**. This on-page pass diagnoses the root cause (see below). | Cross-referenced against `findings/google-api.md` lines 134–141, 215. |

---

## Driving-Licence Page: Snippet-Appeal Diagnosis (requested deep-dive)

**GSC field data (from `google-api.md`):** `/exam-requirements/driving-licence/` ranks position 3.4–7.4 across 5 keyword variants ("2026 driving licence photo," "driving licence image 2026," "driving licence 2026 image," "driving licence photo 2026," "2026 licence photo"), ~49 combined impressions, **zero clicks**. Best-positioned variant ("driving licence photo 2026") sits at position 3.4 — page-one, often above-the-fold — with 8 impressions and still 0 clicks. Zero clicks at position 3 is not a ranking problem; the page is winning the algorithmic contest and losing the human one.

**Root cause found in the live HTML:**

1. **Title tag is 66 characters** — `Driving Licence Photo & Signature Size 2026 (Official) — easyPhoto`. Google's practical display budget is ~55–60 characters (pixel-width based, roughly 600px on desktop). At 66 characters this **truncates mid-brand**, most likely rendering as:
   `Driving Licence Photo & Signature Size 2026 (Official) — …`
   The truncation point lands right before or inside "— easyPhoto," which is a minor loss on its own — but it also means none of the query-matching words after "Size" (there are none — the match terms "photo," "2026," "licence" are all front-loaded and *do* survive truncation). The bigger problem is what the title communicates once truncated: it reads as a spec-lookup page ("Size... Official"), not a task page. Searchers typing "driving licence photo 2026" are very likely trying to **make/resize a compliant photo**, not just read a dimension table — and nothing in the visible (pre-truncation) title signals "free tool" or "make one now."

2. **Meta description is 220 characters** — 60 characters over the ~160-char SERP display budget. Google will truncate it, and the cut lands here:
   > "Driving Licence (Sarathi Parivahan): photo 10–20 KB (420 × 525 px), signature 10–20 KB (256 × 64 px). The exact size, dimensions & format for the application fo…"
   Everything after "application fo[rm]" — including "with the official source. Resize free, in your browser." — is cut. That means **the two phrases most likely to drive a click** ("official source" as a trust signal, and "free, in your browser" as the tool's core differentiator/privacy USP used everywhere else on the site) **never render in the SERP snippet**. The visible portion is pure spec data (KB ranges, pixel dimensions) with no call to action and no differentiation from a government PDF or a competitor's spec page.

3. **Template-level cause, not a one-off typo.** The title pattern is `{Exam Name} Photo & Signature Size 2026 (Official) — easyPhoto`, confirmed identical in structure across SSC (54 chars), CRPF (55 chars), and DL (66 chars). "Driving Licence" (16 characters) is roughly 4x longer than "SSC" (3) or "CRPF" (4), so the same template that produces a compliant 54–55 char title for short exam names silently overflows for long ones. This means **every long-named exam page** in the ~52-page programmatic set (e.g., anything with a multi-word name) is at risk of the same truncation, not just this one page — worth a template-wide length check, not just a DL-specific edit.

**Verdict:** This is conclusively a **snippet-appeal problem, not a ranking problem**, exactly as the GSC pattern suggested. The page ranks fine; the SERP snippet gives searchers no reason to click over a government PDF result or a competitor tool page, and the two USP-carrying clauses ("official source," "free, resize in your browser") are precisely the content getting truncated off in both the title and the description.

**Recommended fix:**
- **Title** (target ≤60 chars): `Driving Licence Photo Size 2026 (Official) — easyPhoto` (56 chars) — drop "& Signature" from the title (it's still covered by the page content and can live in the meta description instead), lead with the exact phrase pattern GSC shows converting best ("driving licence photo 2026").
- **Meta description** (target ≤160 chars): front-load the free-tool CTA and official-source trust signal, push the KB/pixel specifics (which are already in the H2 "Photo requirement" section) later or drop from the description entirely: e.g. `"Driving Licence photo & signature size 2026 — official Sarathi Parivahan spec. Resize free in your browser, no upload. Verified against the official source."` (159 chars).
- Apply the same length audit to the title/description generation template for the full exam-requirements set (per `content.md`'s note that this is template-driven across ~52 pages), not just this one page.

---

## Title Tags

| Page | Title | Length | Verdict |
|---|---|---|---|
| Home | `easyPhoto — Document Photo & Form-Resize Tools for India` | 56 | Good — within budget, brand-suffixed, primary keyword ("document photo," "form-resize," "India") present. |
| `/passport-photo/` | `Free Indian Passport Photo Maker — ICAO Compliant, No Upload` | 60 | Good — at the edge of budget but not over. Strong keyword front-loading + differentiators (ICAO compliant, no upload). |
| `/exam-requirements/ssc/` | `SSC Photo & Signature Size 2026 (Official) — easyPhoto` | 54 | Good. |
| `/exam-requirements/driving-licence/` | `Driving Licence Photo & Signature Size 2026 (Official) — easyPhoto` | **66** | **Over budget — truncates.** See diagnosis above. |
| `/exam-requirements/crpf/` | `CRPF Photo & Signature Size 2026 (Official) — easyPhoto` | 55 | Good — confirms template consistency with SSC; both correctly under budget because the exam name is short. |
| `/blog/indian-passport-photo-requirements/` | `Indian Passport Photo Requirements 2026: Full Compliance Checklist` | 66 | **Over budget — truncates.** Will likely cut after "...Full Compliance" or similar; brand suffix (`— easyPhoto`) is dropped entirely for this post (inconsistent with every other sampled page, which all end `— easyPhoto`). |
| `/tools/resize-kb/` | `Resize Image by KB — Compress to an Exact File Size — easyPhoto` | 63 | Slightly over budget — minor truncation risk, low severity given the keyword ("Resize Image by KB") is fully visible before any likely cut point. |

**Uniqueness:** All 7 titles are unique — no duplication found. **Keyword placement:** consistently good, primary keyword leads in every case. **Pattern issue:** 3 of 7 sampled titles (DL, blog post, resize-kb) exceed the ~60-char practical budget; this is worse than the baseline On-Page pass reported (baseline's title-length findings centered on meta descriptions, not titles).

---

## Meta Descriptions

| Page | Length | Verdict |
|---|---|---|
| Home | 156 | Good — within range. |
| `/passport-photo/` | 194 | **Over budget by 34 chars** — will truncate. |
| `/exam-requirements/ssc/` | 217 | **Over budget by 57 chars** (confirms `content.md`'s finding). |
| `/exam-requirements/driving-licence/` | **220** | **Over budget by 60 chars — worst of the sample.** Truncation cuts the CTA/trust-signal clause. See diagnosis above. |
| `/exam-requirements/crpf/` | 195 | **Over budget by 35 chars** (confirms `content.md`'s finding). |
| `/blog/indian-passport-photo-requirements/` | 165 | Marginal — 5 chars over, low truncation risk. |
| `/tools/resize-kb/` | 148 | Good — within range. |

**Pattern confirmed:** 4 of 7 sampled pages (passport-photo, SSC, DL, CRPF) exceed 160 characters. The exam-requirements template is the most consistently broken — all 3 exam pages checked (SSC, DL, CRPF) are over budget, ranging from 195 to 220 characters, meaning this is a **template defect affecting the full ~52-page exam-requirements set**, not isolated pages. `/passport-photo/` shows the same failure mode outside the exam template, suggesting the description-length guardrail is missing site-wide in the CMS/generation layer, not just in one page type.

---

## H1 Tags

All 7 pages: **exactly one H1**, present, matching page intent, no missing or duplicate H1s.

| Page | H1 | Matches intent? |
|---|---|---|
| Home | "Document photos that get accepted" | Yes — outcome-led, matches brand promise. |
| `/passport-photo/` | "Free Indian Passport Size Photo Maker" | Yes — matches title/URL intent exactly. |
| `/exam-requirements/ssc/` | "SSC (Staff Selection Commission) Photo & Signature Size" | Yes. |
| `/exam-requirements/driving-licence/` | "Driving Licence (Sarathi Parivahan) Photo & Signature Size" | Yes, matches query intent — but note the H1 says "Photo & Signature Size" (spec-lookup framing) with no task-oriented language ("make," "resize," "free"), consistent with the same framing problem found in the title tag. |
| `/exam-requirements/crpf/` | "CRPF (Central Reserve Police) Photo & Signature Size" | Yes. |
| `/blog/indian-passport-photo-requirements/` | "Indian Passport Photo Requirements 2026: Full Compliance Checklist" | Yes. |
| `/tools/resize-kb/` | "Resize Image by KB" | Yes. |

No issues in this category.

---

## Heading Hierarchy (H2–H6)

Checked in document order on all 7 pages for skipped levels (e.g., H2 → H4 with no H3).

**Result: No skipped heading levels found on any of the 7 sampled pages.** Hierarchy is clean and logical throughout:
- Home: H1 → H2 (7 sections) → H3 → H4 (only under "AI Perfects Every Detail," correctly nested 4 levels deep for the Upload/Analyze/Verify/Download sub-steps).
- `/passport-photo/`: H1 → H2 (4 sections) → H3, clean.
- SSC / DL / CRPF (exam template): identical clean structure — H1 → H2 (6 sections) → H3 (FAQ category tabs only), confirming the heading-hierarchy portion of the template is consistent and correct across exam pages, unlike the title/description portion.
- Blog post: H1 → H2 (13 sections) → H3 (sub-cases under "Requirements for specific passport types" and "Keep reading"), well-organized for a long-form piece — 18 total headings, no skips.
- `/tools/resize-kb/`: H1 → H2 (4 sections) → H3 (FAQ tabs), clean.

This is a genuine strength — heading structure is a template-level pass across every page type sampled.

---

## Internal Linking

| Page | Internal links | Generic/empty anchor text | Notes |
|---|---|---|---|
| Home | 165 | 0 | Descriptive anchors throughout ("Passport & Visa Photo," "Exam Application Kit," etc.); several card-style links carry very long compound anchor text (full card copy, not just a label) — not a violation but not ideal anchor hygiene either (see note below). |
| `/passport-photo/` | 124 | 0 | Country-photo links use pattern `{Country}{Dimensions}Make photo` (e.g., "India35×45mmMake photo") — functional but visually-concatenated anchor text (no whitespace between the country name, dimension, and CTA in the extracted text), which is a markup/CSS artifact rather than a true accessibility defect since it likely renders as separate visual lines; still worth a spot-check with a screen reader given it collapses to one run-on string in the accessibility tree. |
| `/exam-requirements/ssc/` | 108 | 0 | Good — links to 7 sibling SSC-variant resizer pages with exact-match anchors ("SSC CGL resizer," "SSC CHSL resizer," etc.) plus a "Central government recruitment & more" related cluster. No orphan risk. |
| `/exam-requirements/driving-licence/` | 101 | 0 | Links to related identity-document pages (DS-160, Passport Seva, OCI, PAN, Voter ID, SSC) under "Visa & identity documents & more" — good topical relevance, correct cross-linking, no orphan risk (also independently confirmed reachable from SSC's page in the reverse direction). |
| `/exam-requirements/crpf/` | 101 | 0 | Links to defence-cluster siblings (NDA, CDS, AFCAT, Army Agniveer, Agniveervayu, BSF) — good intent-matched clustering, mirrors DL's pattern. |
| `/blog/indian-passport-photo-requirements/` | 102 | 0 | Good in-body contextual links ("free background replacer," "face centering checker," "photo compressor," "Rejection Predictor") — natural, descriptive anchor text embedded in prose, the strongest anchor-text quality of the sample. One related-post card link ("Keep reading") concatenates full card copy into a single anchor's accessible name (same run-on pattern as `/passport-photo/`'s country cards) — cosmetic/markup issue, not a ranking risk. |
| `/tools/resize-kb/` | 109 | 0 | Good — links to all 6 KB-preset sibling pages with exact anchors ("Resize to 10KB" etc.) plus tool-cluster links (Exam Application Kit, Compliance Checker). |

**No orphan-page risk detected** in this sample — every page sampled is reachable from at least 2 independent paths (global nav + contextual/related-cluster links), and every page sampled also appears in `sitemap.xml` per `technical.md`'s independent confirmation.

**No generic anchor text** ("click here," "read more," etc.) found anywhere in the 7-page sample — anchor quality is a genuine strength.

**Minor pattern worth flagging:** several card-style internal links (home page feature cards, passport-photo country cards, blog related-post cards) wrap an entire card's visible copy — heading + description + CTA — into a single `<a>` tag. This is a common, acceptable UX pattern (bigger click target) and not a violation of any on-page guideline, but it does mean the *accessible name* for these links is a long run-on string rather than a concise label. Not scored as a defect; noted for awareness only.

---

## External Linking

Present on the 3 exam-template pages (SSC, DL, CRPF) and the blog post — each links out to:
- Author's LinkedIn (`linkedin.com/in/jaspal-jk/`) — E-E-A-T signal, consistent with `content.md`'s author-bio findings.
- The specific official government source cited on that page (`ssc.gov.in`, `sarathi.parivahan.gov.in`, `recruitment.crpf.gov.in`) — correct, authoritative, exam-specific.

Home, `/passport-photo/`, and `/tools/resize-kb/` carry **zero external links** — expected and appropriate for these page types (tool/utility pages with no factual claims requiring citation).

One gap already documented in `content.md` and not re-litigated here: the sampled blog post names `passportindia.gov.in` in body text but does not hyperlink it (confirmed still present on this pass — `grep` for `passportindia.gov.in` in `blog.html` returns 0 `<a href>` matches, only plain-text mentions).

---

## URL Structure

All 7 URLs: lowercase, hyphenated, no query parameters, no session IDs, logical folder depth (`/exam-requirements/{exam}/`, `/tools/{tool}/`, `/blog/{slug}/`), trailing slash used consistently. No issues found. This matches `technical.md`'s independent confirmation of clean URL structure and correct redirect/canonical handling.

---

## Issues (Priority Order)

| # | Severity | Finding | Evidence | Fix |
|---|----------|---------|----------|-----|
| 1 | **High** | `/exam-requirements/driving-licence/` has both an over-length title (66 chars) and the longest over-length meta description in the sample (220 chars), and GSC field data confirms this is actively costing clicks: 5 keyword variants at position 3.4–7.4, ~49 impressions, **0 clicks**. Root cause: the exam-page title/description template doesn't account for long exam names, and the truncated portions are exactly the CTA/trust clauses ("free, in your browser," "official source"). | `curl` + char-count this session; cross-referenced against `google-api.md` lines 134–141. | Rewrite title to ≤60 chars leading with the exact converting query pattern ("Driving Licence Photo Size 2026"); rewrite description to ≤160 chars front-loading the free-tool CTA and trust signal before the spec numbers. See exact suggested copy above. |
| 2 | **High** | Exam-requirements meta-description template overflows 160 chars on every sampled instance (SSC 217, DL 220, CRPF 195) — a template-wide defect likely affecting a large share of the ~52-page exam-requirements set, not isolated pages. | Confirms and extends `content.md`'s SSC/CRPF finding with a third data point (DL) that is worse than either. | Shorten the template: drop or shorten the parenthetical official-source name, front-load size/dimension facts, target ≤160 chars total. Audit all ~52 exam pages for the same overflow once the template is fixed (this is `seo-programmatic`'s remit for full-set verification). |
| 3 | **Medium** | Exam-page title template (`{Exam Name} Photo & Signature Size 2026 (Official) — easyPhoto`) overflows 60 chars whenever the exam name is long — confirmed on Driving Licence (66 chars) vs. short-name exams like SSC (54) and CRPF (55) which stay under budget by accident of naming, not by design. | Title-length comparison across 3 sampled exam pages, this session. | Add a length-aware fallback to the title-generation template: for exam names over ~10 characters, drop "& Signature" from the title (keep it in the H1/body) to reclaim budget, matching the DL-specific fix above but applied programmatically. |
| 4 | Low | `/blog/indian-passport-photo-requirements/` title (66 chars) drops the `— easyPhoto` brand suffix present on every other sampled page, and also exceeds the 60-char budget. | Title extraction, this session. | Shorten to fit brand suffix within budget, e.g. `Indian Passport Photo Requirements 2026 — easyPhoto` (53 chars), or accept the brand-suffix omission as intentional for blog posts (if so, still trim to ≤60 chars to avoid mid-sentence truncation). |
| 5 | Low | `/passport-photo/` meta description (194 chars) and `/tools/resize-kb/` title (63 chars) both run slightly over budget — lower severity than Issues 1–3 but part of the same site-wide pattern of insufficient length guardrails at generation time. | Length extraction, this session. | Trim both to fit within budget; consider adding an automated length-lint check (CI or CMS-level) so new pages can't ship with titles >60 or descriptions >160 chars, closing this defect class permanently rather than fixing it page-by-page. |

**No Critical severity issues.** Heading hierarchy, H1 uniqueness, internal linking, anchor-text quality, and URL structure all pass cleanly — the entire point-loss in this category is concentrated in the title/meta-description length-control defect class (Issues 1–5), which is a single root cause (no automated length guardrail in the page/template generation layer) manifesting across multiple page types.

---

## Summary of Category Pass/Fail

| Element | Status |
|---|---|
| Title tags — uniqueness | PASS (7/7 unique) |
| Title tags — length (≤60 chars) | FAIL (3/7 over budget: driving-licence, blog post, resize-kb) |
| Title tags — keyword placement | PASS (7/7 keyword-led) |
| Meta descriptions — present | PASS (7/7) |
| Meta descriptions — length (≤160 chars) | FAIL (4/7 over budget: passport-photo, SSC, driving-licence, CRPF) |
| H1 — exactly one, matches intent | PASS (7/7) |
| Heading hierarchy — no skipped levels | PASS (7/7) |
| Internal linking — anchor quality | PASS (0 generic anchors found) |
| Internal linking — orphan risk | PASS (no orphans in sample; all reachable via 2+ paths + sitemap) |
| External linking — authoritative sources | PASS (present where factually needed, absent where not needed) |
| URL structure | PASS (7/7 clean, hyphenated, no params) |

**Category verdict:** Structural on-page elements (headings, H1, internal linking, URLs) are strong and template-consistent. The score is held down entirely by one recurring defect class — title and meta-description length control — which is systemic (template-level, affecting multiple page types) rather than incidental, and has now been shown via live GSC data to have a real, measurable cost on at least one page (`/exam-requirements/driving-licence/`: 49 impressions, 0 clicks).
