# AdSense "Low Value Content" — Per-Tier Decision Map

**Date:** 2026-06-21
**Trigger:** AdSense approval status = "Needs attention" → "Low value content" (ads.txt = Authorized ✅)
**Method:** Code inspection of every templated/programmatic tier + GSC 28-day traffic (2026-05-23 → 2026-06-17)
**Constraint in play:** Standing rule "SEO 100% intact — no route/content/noindex/schema changes."

---

## The single most important fact

GSC 28-day window for the **entire site**:

- **15 clicks total. 279 impressions. 1 query with clicks (brand: "easyphoto").**
- Every non-brand query: **0 clicks**, average position **29.5** (deep).
- The thin programmatic tiers (exam-resizer, upsc/ibps/rrb resizers, makers) all show impressions but **0 clicks**, ranking positions **42–94**.

**Implication:** The "SEO 100% intact" rule is currently protecting pages that deliver ≈ **zero organic clicks**. The earlier worry ("these thin pages might be the traffic engine") is empirically false *today* — they aren't ranking. That makes noindex/consolidation of the thinnest tiers nearly free in real-traffic terms. Google already ranks them deep, which is itself the same "low value" verdict AdSense just gave.

**The root structural problem:** up to **4 separate pages target the same portal**. For SSC alone:
`/exam-requirements/ssc/` + `/tools/form-resizer/ssc/` + `/exam-resizer/ssc-cgl/` + `/ssc-photo-resizer/`.
That is simultaneously keyword cannibalization *and* the low-value-content signal. Collapsing to one canonical page per portal fixes both.

---

## Tier-by-tier map

Legend — **Risk** = AdSense low-value contribution. **Traffic cost** = real GSC clicks lost if noindexed (all ≈0 unless noted).

| # | Tier | Route | Count | Uniqueness | GSC reality | Risk | Recommendation |
|---|------|-------|-------|-----------|-------------|------|----------------|
| 1 | **Hinglish duplicates** | `/*-kaise-kare/`, `/photo-ka-size-*kb-*/` | ~15 | 16-line wrappers; Hindi-transliterated copies of existing English tool pages — same tool, same structure | None in top-20; ≈0 | 🔴 **Highest** | **NOINDEX** (reads as doorway pages: same intent twice). Traffic cost ≈ 0. |
| 2 | **KB-resize swaps** | `/photo-resize-to-{10,20,30,50,100,200}kb/`, `/signature-resize-to-{…}/`, `/compress-pdf-to-{…}/` | ~14 | Identical article from `KbResizeLanding`, only `{kb}` number swapped | 0 clicks | 🔴 **High** | **CONSOLIDATE** → one canonical "resize to any KB" page (number = a control). Keep 2 real-limit pages indexed (`20kb`, `100kb`); noindex the rest. |
| 3 | **exam-resizer** | `/exam-resizer/[exam]/` | 22 | Inherits parent portal spec; only per-sub-exam "About" note differs | Many impressions, **0 clicks**, pos 51–94 | 🔴 **High** | **NOINDEX or consolidate into `/exam-requirements/`** (duplicate of #5 intent). Traffic cost ≈ 0. |
| 4 | **form-resizer** | `/tools/form-resizer/[portal]/` | 52 | Tool widget + 8 blocks, per-portal spec; 3rd page per portal | Not ranking | 🟠 **Med-High** | Pick ONE canonical per portal. Keep #5 (richest); **noindex form-resizer** or merge tool into #5. |
| 5 | **exam-requirements** | `/exam-requirements/[exam]/` | 52 | **Richest tier** — unique spec table, sub-exam chips, rejection list, official-source provenance link, related portals, FAQ | army-agniveer pos 9.0, driving-licence ranking | 🟢 **Low** | **KEEP — this is your authority layer.** Protect it. Thicken only the sparsest entries. |
| 6 | **Dedicated resizers** | `/ssc-photo-resizer/`, `/upsc-photo-resizer/`, `/ibps-…/`, `/sbi-po-…/`, `/railway-…/` | ~10 | 4th overlapping page per portal | upsc-photo-resizer impressions, 0 clicks | 🟠 **Med-High** | Overlaps #3/#4/#5. **Consolidate** — keep at most one canonical per portal. |
| 7 | **Country makers** | `/[maker]/` | 27 | `DocPhotoLanding`, 15 blocks, genuine per-country intent | malaysia impressions, 0 clicks, pos 42–57 | 🟡 **Low-Med** | **KEEP** (distinct geo intent, "malaysia visa photo"). Thicken the thin ones over time. |
| 8 | **Convert pairs** | `/convert/[pair]/` | 9 | Templated, but real distinct queries ("heic to jpg") | Not in top-20 | 🟡 **Low-Med** | **KEEP + thicken** (each format genuinely differs). Low priority. |
| 9 | **Embed widgets** | `/embed/exam-spec/[id]` (route.ts) | 53 | Pure iframe HTML, **no editorial content**, not in sitemap, no `X-Robots-Tag` | n/a | 🔴 **Free fix** | **NOINDEX via `X-Robots-Tag: noindex` header.** Zero SEO cost — never meant to rank. |

---

## What clears AdSense (in priority order)

1. **Free, zero-conflict:** noindex the 53 embed widget routes (#9). Do immediately.
2. **Highest impact / lowest traffic cost:** noindex the Hinglish (#1) + exam-resizer (#3) tiers, consolidate KB-swaps (#2). ~50 thin URLs removed from the index for ≈0 click loss.
3. **Resolve the 4-pages-per-portal cannibalization:** keep `/exam-requirements/` (#5) as the canonical authority page per portal; noindex/redirect #3, #4, #6 duplicates. Biggest single structural win.
4. **Thicken the survivors:** homepage + #5 (richest entries) + #7/#8 — genuinely unique, substantial content so the reviewer's sample reads as high-value.
5. **Make About / Contact / Privacy / Disclaimer substantive** (AdSense explicitly checks these). *Pending verification.*
6. **Perf (separate but related):** the AdSense JS is already injected and is the mobile LCP killer (5.0s). Fine for content review, but fix before relying on ad revenue.

**Net:** removing ~50–110 thin/duplicate URLs costs essentially nothing in today's traffic and directly attacks the low-value-content ratio. The richest tier (#5, 52 pages) and genuine-intent tiers (#7, #8) stay indexed.

---

## Decision needed (per tier)

- **Aggressive (fastest approval):** noindex #1, #3, #9 + consolidate #2, #4, #6 → keep #5, #7, #8. ~80 URLs leave the index, ≈0 click cost.
- **Moderate:** noindex #1, #9 only + consolidate #2; leave the portal duplication for later.
- **Minimal:** #9 (embed) only + thicken top pages additively; no removals. Lowest risk, may not clear first re-review.

No code has been changed. Awaiting direction on aggressiveness before any edits.
