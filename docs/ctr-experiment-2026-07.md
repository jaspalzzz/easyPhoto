# CTR experiment log — batch 1 (2026-07-13)

Controlled title/description test on two indexed, zero-click blog pages. Change is
centralized in `lib/blog.ts` (title drives both SERP `<title>` and the visible H1).
Slug, canonical, route, schema and sitemap membership unchanged. Treat as hypotheses;
if position moves materially, do NOT attribute CTR change to the title.

**Deployment:** stamp the push date here after merge/push → __________ (2026-07-13).

## Baseline (GSC workbook 2026-07-13, last 3 months) vs new

### /blog/best-free-exam-photo-resizer-india/
- Baseline: 188 impressions · 0 clicks · position 5.98 · CTR 0%. Device split: site-wide
  64% mobile clicks / 59% mobile impr (per-page split not exported yet).
- OLD title: "Best Free Exam Photo & Signature Resizer India (2026)"
- NEW title: "5 Free Exam Photo & Signature Resizers Compared (2026)"
- OLD desc had "exact KB and px specs"; NEW desc: "the KB and pixel specs each portal
  lists". (Article genuinely compares 5 tools, so the title is accurate.)
- Hypothesis: transparent "5 … Compared" beats subjective "Best"; drops the "exact"
  overclaim.

### /blog/indian-passport-photo-requirements/
- Baseline: 156 impressions · 0 clicks · position 10.47 · CTR 0%.
- OLD title: "Indian Passport Photo Requirements 2026: Full Compliance Checklist"
- NEW title: "Indian Passport Photo Rules 2026: Adults vs Children Under 4"
- Description unchanged (already accurate/bounded).
- Hypothesis: the distinctive adult-vs-child hook (matching the corrected content) beats
  the generic "Full Compliance Checklist" overclaim.

## Measurement protocol
1. After deploy, request recrawl (GSC URL Inspection → Request Indexing) for both URLs.
2. Wait until Google displays the NEW title (check "site:" or URL Inspection rendered).
3. Compare 28 days before vs after — by page, and mobile-specifically.
4. Also compare average position over the same window. If position shifts materially,
   the CTR delta is confounded — extend the window / re-evaluate.
5. Low absolute volume: if impressions stay tiny, wait longer before concluding.
