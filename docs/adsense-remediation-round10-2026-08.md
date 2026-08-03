# Round 10 — your content list is complete. Live.

Both P-items from Round 9 are fixed and deployed, and the four content items you
listed as prerequisites for an AdSense resubmission are done.

**Live:** `e0b2450..dd0f292`. **Sitemap 159.** 523 tests, 4 skipped.

---

## Round 9's two findings

### 1. Redirects terminating on a noindexed page (P1) — fixed

The four retired PDF-compression URLs now 301 to `/blog/how-to-compress-pdf/`
— 1,272 words, indexed, and it already links onward to the tool with the
matching `?target=` preset for all four sizes, so the reader still reaches the
tool with their size selected. Those URLs carry 1 click and 16 impressions over
90 days, so nothing measurable was traded.

Verified live: all four return `location: /blog/how-to-compress-pdf/`, and that
target has no robots meta.

Guarded: `test/deindexed.test.ts` scans `_redirects` and fails on any
destination resolving to a deindexed path, comparing paths so a `?target=` query
cannot hide one. Confirmed failing on the exact case you found.

### 2. "All sitemap groups now filter" was false (P2) — accepted

You were right; the claim was wrong. Only the tool and category groups filtered.
Maker, trust, exam and blog groups did not — the list simply happened to contain
none of them.

There is now a single filter over the assembled list, which is the invariant
that survives someone adding a group. Confirmed by adding a **blog** path to the
deindex list and watching the sitemap drop to 158 — something the per-group
filters alone would never have done.

---

## Your four content prerequisites

### Depth for the 11 thin-but-earning tools — done

All eleven now carry copy written for them, and **every indexed tool clears 500
visible words**, up from six sitting under it. Each piece verified on the live
site.

The material is specific rather than padding — e.g. the DPI page explains that
DPI is a label and pixels are the photograph, with the arithmetic; PAN OCR gives
the five-letters/four-digits/one-letter shape so a bad read is self-evident;
Aadhaar OCR explains the checksum proves internal consistency and nothing about
whether the number exists or belongs to the holder.

`/tools/exam-package/` had no depth entry at all and now has one.

### `/exam-requirements/` vs `/tools/exam-package/` — resolved

**0.6749 → below 0.60** (no longer appears at a 0.60 scan). The overlap was
shared exam vocabulary, not purpose: one is a directory of recorded figures, the
other a guided flow. The tool page now explains what no other page does.

### UGC-NET vs CSIR-NET — differentiated, not consolidated

**0.6735 → 0.6148.** They are different examinations — UGC-NET covers the
humanities, social sciences, commerce, languages and education; Joint CSIR-UGC
NET covers the five science streams. Each page now states its subject scope and
*why* the upload figures are identical (NTA administers both), and the CSIR page
carries the stricter signature instruction.

We differentiated rather than merged because a candidate searching "UGC NET
photo size" should not land on CSIR-NET. Say if you disagree.

Worst remaining pair site-wide is **0.6644** (Canada passport/visa).

### Replace the 300-word readiness signal — done, and it is worth reading

The gate is **replaced, not raised**. It now counts *unique* editorial words:
words in sentences appearing on fewer than three indexed pages. Floor is 300 of
those, alongside the existing visible-words floor.

Proof it catches what the old one could not: stripping one tool's own paragraphs
leaves it at **403 total words — passing the old 300-word gate — and 280 unique,
failing the new one**.

What the measure exposes about the site as it stands:

| | pages | unique / total |
|---|---|---|
| `/exam-requirements/*` | 53 | 23,301 / 40,770 — **57% unique** |
| `/tools/*` | 17 | 8,767 / 10,900 — **80% unique** |

So the 53 exam pages are still 43% template by volume. They pass the floor, but
that is the honest number and we are not presenting it as solved.

The eight required disclosure pages (contact, terms, editorial-policy,
corrections-policy, disclaimer, source-methodology, authors, how-photo-checking-
works) are exempt from the *unique* floor and still held to the visible-words
floor. Padding a corrections policy would make it worse, and they stay indexed
deliberately because a reviewer looks for them. Flag if you think that exemption
is wrong.

---

## Note on our own copy

One paragraph we wrote was rejected by the repository's existing
`boundedClaims` guard for saying a photo could be "perfectly acceptable" — an
acceptance promise the project bans. Rephrased to bound it to the published
tolerance. The guard predates this work and caught us, which is the system
behaving correctly.

## What we would like checked

1. **Whether differentiating UGC-NET/CSIR-NET was right** versus consolidating.
   The same reasoning was applied to NDA/CDS earlier.
2. **The 43% template share on exam pages.** It passes the new floor, but is a
   53-page family at 57% unique acceptable for a resubmission, or is that the
   next thing to attack?
3. **The disclosure-page exemption** — eight pages excused from the unique floor.
4. **Whether the unique-words definition is right**: sentences appearing on
   fewer than three indexed pages. Two pages sharing a paragraph still counts as
   unique for both, which may be too lenient.
5. **Anything in the new copy that overclaims.** It is new prose about
   authorities' requirements, which is the category where this project has made
   its worst errors.

## Sequencing

Per your Round 9 verdict, we plan to request a Search recrawl now and hold the
AdSense resubmission. Your point that AdSense crawls separately and reviews the
whole site changed how we were thinking about the 35 deindexed pages — they are
still in the review surface, so the content work rather than the noindex is what
moves that verdict.
