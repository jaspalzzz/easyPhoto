# Round 11 — all five accepted. One was site-wide and user-harming.

**Commit:** `f602c0c`. **Unpushed** pending this review. 523 tests, 4 skipped.

Your finding 3 changed the picture materially, and the honest number is worse
than anything we have reported so far. That is in section 3.

---

## 1. UK background guidance (P1) — correct, and it was in eleven places

HM Passport Office's standard: a photo may be taken *"against any plain
background that is any light colour (for example different shades of white
(cream, ivory or vanilla) and light grey)"*. White is acceptable.

This site asserted the opposite in **eleven** locations:

| Where | What it said |
|---|---|
| `lib/countrySpecs.ts` | background description: *"NOT white (top UK rejection cause)"* |
| `lib/countrySpecs.ts` notes | *"Do NOT default UK to a white background"* |
| `app/uk-passport-photo/page.tsx` | 4 places, incl. a heading *"The grey background rule — the most common rejection"* |
| `app/[maker]/page.tsx` | *"The UK rejects plain white backgrounds"* |
| `lib/makerContent.ts` | 2 places |
| 4 blog posts + `app/tools/page.tsx` | comparison rows and bullets |

Most predates this remediation; we then repeated it in new Round 10 copy. A
reader following it could have reshot or discarded a valid photo. All eleven
corrected.

Guarded in `test/boundedClaims.test.ts` as a pattern rather than a fixed string,
because it had been phrased differently almost every time. Confirmed failing on
reintroduction. It initially caught three of our own *refutations* — sentences
restating the myth in order to deny it — which we rewrote to assert the standard
positively instead.

**The unedited rule.** You were right that this matters and we had never stated
it. `passport.service.gov.uk` requires a photo that is *"unedited – you can't
'correct' your passport photo"*. A replaced background is an edit. The UK pages
now say the preset suits a printed application or a framing check, not the
online photo code.

## 2. UGC-NET disputed signature limit (P1) — disclosed

The page presented 10–50 KB as verified and called it NTA's common rule. The
bulletin gives **4–30 KB** in its application-procedure section and 10–50 KB
elsewhere. We record 10–50 KB, now with the conflict stated explicitly and the
instruction to take the figure from the live application screen. The bulletin's
new live-photograph step is mentioned.

We could not fetch the PDF from this network; this rests on your reading.

## 3. The unique-editorial audit could be defeated (P1) — and the fix reveals the real state

You were right on the mechanism: whole-sentence exact equality meant swapping an
exam name laundered template prose into "unique" on both pages.

Replaced with 8-word sliding shingles over text where figures collapse to `#`
and the page's own slug words collapse to `@`, so *"SSC is conducted by…"* and
*"IBPS is conducted by…"* normalise to the same string. A word counts as shared
if any window covering it appears on 3+ pages.

**The measurement we reported to you last round was produced by the weak
instrument and overstated the site substantially.** Median unshared words by
family:

| Family | pages | median unshared |
|---|---|---|
| `/blog/*` | 39 | **977** |
| `/tools/*` | 17 | **411** |
| `/exam-requirements/*` | 53 | **150** |
| country makers | 28 | **104** |

**65 of 159 indexed pages** hold fewer than 300 unshared words.
`/spain-visa-photo-maker/` shows 501 visible words of which **56** are its own.

Round 10's "57% unique" for exam pages was wrong in substance. The blog and the
tool pages are genuinely original; the 81 template-generated pages — 53 exam
plus 28 makers, **51% of the index** — are mostly shared prose with figures
swapped. That is the low-value-content problem stated properly, and it is not
addressed by anything we have done so far.

Renamed as you asked: the output says **"unshared"**, not "unique editorial".

**Judgement call we want challenged.** The blocking floor is **50**, not 300.
At 300 it fails 41% of the index and stops all work behind a gate nobody can
pass; that produces a bypassed gate, not better content. So 50 blocks (a page
with essentially nothing of its own) and the 300 target is **printed on every
run** with the count and the three thinnest pages named, so the gap is visible
rather than hidden behind a pass. Tell us if you would rather it hard-fail.

## 4 & 5. Unsupported claims (P2) — bounded or removed

- *"almost every Indian recruitment portal"* → scoped to the portals covered here
- *"candidates commonly sit UGC-NET more than once … the same stored image is
  reused"* → removed
- *"the detail most often corrected at the centre"* → removed; replaced with what
  the CSIR bulletin does support (it spells the signature rule out more fully
  than the UGC-NET one)
- masked Aadhaar *"most forms"* → *"some recipients"*, with the point that the
  requirement is set by the receiving form, not by UIDAI

## Test count

Our run reports 523 passed / 4 skipped (527). You measured 522 / 4. Probably
different commits; we are not disputing your number and have not chased it.

---

## What we want you to attack

1. **The blocking floor of 50 versus hard-failing at 300.** Most consequential
   decision here.
2. **Whether the 81 template-generated pages are now the blocking issue for
   AdSense.** They are 51% of the index at a median of 104–150 unshared words.
   Options seem to be: write per-page material for 81 pages, consolidate the
   families, or deindex more. We have no view we would defend without your read.
3. **Whether 8-word windows and a 3-page threshold are the right parameters.**
   Both were chosen by us without evidence.
4. **Whether normalising slug words to `@` is too aggressive** — it makes Spain
   and Portugal maker pages near-identical by construction, which is arguably
   the correct answer but does inflate the shared count.
5. **The rest of the new Round 10 copy.** You found four unsupported claims in
   it. We would not assume the remainder is clean.

## Environment

`cdnbbsr.s3waas.gov.in` (NTA/CSIR bulletins) could not be fetched from this
network. The UGC-NET and CSIR figures in this round rest on your readings.
