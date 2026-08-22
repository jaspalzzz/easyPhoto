# Section composition plan — exam & maker templates

**Written:** 2026-08-15. **Do not ship any part of this before the December
2026 decision gate** ([ACTION-PLAN.md](ACTION-PLAN.md)). Two index changes
already shipped 12 days apart (2 Aug, 14 Aug); a third before the site has had
time to respond destroys the ability to tell what worked. This document is the
homework for that gate, not a queue to execute now.

## Why this exists

The 25 July demotion hit `/exam-requirements/` and the country maker pages
because they read as one template with the numbers swapped — not because any
individual page is bad. 27 zero-earning template pages were already removed on
14 Aug. This plan covers what's left: **69 template pages, of which 39 sit
under 50% unique content share** (the rest of the page is spec-table labels,
FAQ boilerplate and disclaimer text shared with every sibling page).

The rule from the August cut carries forward unchanged: **judge on earnings
and duplication, never on length.** Every page below clears the 300-unshared-
word floor. Length was never the problem.

## Re-run before acting

Numbers below are 90-day GSC clicks/impressions to 2026-08-19 and the current
unshared-word share. Both drift. Before shipping anything from this plan,
regenerate:

```
node scripts/audit-thin-content.mjs      # unshared-word share
```
```
"$HOME/.claude/skills/seo/bin/claude-seo" run gsc_query.py \
  --property sc-domain:easyphoto.in --days 90 --dimensions page --limit 1000 --json
```
```
CONTENT_SIMILARITY_LIMIT=0.40 node scripts/audit-content-similarity.mjs
```

## Bucket A — Keep exactly as is (18 pages)

These sit at 31–43% unique share, which looks identical to the pages already
cut. **They are not the same case.** Low share here is a template-overhead
artifact — the spec table and disclaimer are a bigger fraction of a shorter
page — not a duplication problem, and every one of them earns real clicks:

| Page | 90d clicks | 90d impressions |
|---|---|---|
| `/exam-requirements/voter-id/` | 166 | 4,762 |
| `/exam-requirements/rrb/` | 28 | 1,622 |
| `/exam-requirements/army-agniveer/` | 27 | 2,063 |
| `/exam-requirements/airforce-agniveer/` | 22 | 1,790 |
| `/exam-requirements/ibps/` | 14 | 765 |
| `/exam-requirements/upsc/` | 10 | 1,142 |
| `/exam-requirements/driving-licence/` | 8 | 994 |
| `/pakistan-passport-photo-maker/` | 7 | 179 |
| `/exam-requirements/niacl/` | 5 | 27 |
| `/malaysia-visa-photo-maker/` | 4 | 63 |
| `/new-zealand-visa-photo-maker/` | 2 | 138 |
| `/nepal-passport-photo-maker/` | 2 | 407 |
| `/exam-requirements/sbi/` | 2 | 335 |
| `/ireland-visa-photo-maker/` | 1 | 23 |
| `/australia-passport-photo-maker/` | 1 | 138 |
| `/canada-visa-photo-maker/` | 1 | 64 |
| `/uk-passport-photo-maker/` | 1 | 34 |
| `/india-passport-photo-maker/` | 1 | 55 |

**Do not touch these.** This is the same mistake the word-count rule would
have made on `/tools/sign-image/` — cutting on a proxy metric instead of on
whether the page earns. `/uk-passport-photo-maker/` and
`/india-passport-photo-maker/` are also existing 301 targets
(`/uk-visa-photo-maker/` and `/india/` in `public/_redirects`); removing
either would need that redirect repointed first, same discipline as the 14
August cut.

## Bucket B — Merge candidates (near-duplicate AND both weak)

Both conditions required: flagged by the similarity audit against a sibling
**and** zero or near-zero clicks on both sides. This is the only bucket where
merging is the right shape, because these pages are not just weak, they are
weak *and* redundant with each other.

| Pair | Similarity | Clicks (each, 90d) | Why |
|---|---|---|---|
| `/exam-requirements/clat/` + `/exam-requirements/cuet/` | 0.44 | 0 + 0 | Same entrance-exam template, no distinct content on either side |
| `/schengen-visa-photo-maker/` + `/france-visa-photo-maker/` + `/germany-visa-photo-maker/` | 0.47 / 0.41 | 0 / 0 / 0 | All three ARE the same spec — Schengen's ICAO standard applies uniformly, and France/Germany carry no country-specific figure that differs from it |

**Proposed shape:** fold France and Germany into the Schengen page as
member-state notes (the page already frames itself as "all 29 member
states"); the tool stays reachable by both country names via redirect, same
pattern as the December `cisf`/exam-resizer consolidation. CLAT and CUET:
pick whichever has the more complete registry entry as the survivor, redirect
the other.

**Explicitly rejected from this bucket:** `/exam-requirements/afcat/` is
0.51 similar to `airforce-agniveer` and `/exam-requirements/sbi/` is 0.45
similar to `niacl` — but in both cases the sibling is a Bucket A earner.
Merging a weak page into a working one risks the working one, and that is not
this bucket's job. If these need action, it's a cross-reference link, not a
merge.

## Bucket C — Deindex candidates (weak, no merge partner)

Zero clicks in 90 days, under 50% unique share, and no genuinely similar
sibling to merge into. Same rule as the 14 August cut, applied to what's left:

**Exam:** `afcat`, `cat`, `pan`, `up-police`, `navy-agniveer` (5)
**Maker:** `oman-visa-photo-maker`, `italy-visa-photo-maker`,
`china-visa-photo-maker`, `saudi-visa-photo-maker` (4)

9 pages. Same caveat as August: recruitment-board pages are seasonal, and 90
days cannot show a notification cycle — re-check before cutting in case a
window opened since this was written. `navy-agniveer` in particular sits
beside `army-agniveer` and `airforce-agniveer` (both real earners, Bucket A);
it earns 0 clicks against their combined 49, which argues it's a weak page in
a strong family rather than evidence the family itself is a problem.

## Bucket D — Watch, not composition (9 pages)

These have real impressions and only 1 click each — worth investigating
separately as a **ranking or snippet** question, not folded into this plan.
Consolidating them would not fix a low click-through rate, and two of them
(`oci`, `csir-net`) rank well enough to be earning something already:

| Page | 90d clicks | 90d impressions |
|---|---|---|
| `/exam-requirements/csir-net/` | 1 | 394 |
| `/exam-requirements/oci/` | 1 | 178 |
| `/exam-requirements/ssc/` | 1 | 176 |
| `/uae-visa-photo-maker/` | 1 | 176 |
| `/exam-requirements/tgpsc/` | 1 | 76 |
| `/netherlands-visa-photo-maker/` | 1 | 111 |
| `/exam-requirements/ctet/` | 1 | 53 |
| `/exam-requirements/uppsc/` | 1 | 27 |
| `/exam-requirements/passport-seva/` | 1 | 21 |

**Not part of this plan.** If the December gate shows these still converting
poorly, the next question is title/snippet quality on these specific pages,
not their existence.

## Net effect if executed as-is

- Bucket A: 18 pages, **0 changes**
- Bucket B: 5 pages → 2 survivors (3 fewer indexed pages)
- Bucket C: 9 pages removed
- Bucket D: 9 pages, **0 changes** — flagged for separate investigation, not this plan
- **Total: 12 fewer indexed pages**, sitemap 121 → ~109 if Buckets B and C ship in full

## What this is not

Not a word-count exercise — nothing here gets rewritten or padded. Not a
verdict on Bucket A or D — they stay. Not authorized to ship — that decision
belongs to the December gate in [ACTION-PLAN.md](ACTION-PLAN.md), after
`/tools/sign-image/` position and the sitemap-indexed count from the 14
August cut have had time to show whether that change worked.
