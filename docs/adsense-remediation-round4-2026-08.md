# Round 4 — change record for review

**Context:** this round implements your second audit's "required before
submitting" list, then goes past it into the item you flagged as unfinished:
the 23 country records nobody had ever checked.

**Range:** `4e8d2c0..aa05a5a` — 8 commits, 11 files, +415/−114.
**Sitemap:** 194 (unchanged — no pages added or removed).
**Gate on every commit:** `npm run verify` (check:specs → tsc → vitest → build →
thin-content → TF-IDF similarity → adsense-export guard). Final: **501 tests
pass**, 4 skipped.

Two new guard tests. Both were confirmed to **fail** on each regression they
exist for, not merely to pass — the failures are listed under each.

---

## Part 1 — your required list

| # | Item | Status |
|---|---|---|
| 1 | `/uk-passport-photo/` + FAQ schema | done — old claim 0 occurrences site-wide |
| 2 | Canada claims in registry, renderer, guide | done — 5 locations, 0 remaining |
| 3 | Ireland print-only contradiction | done — see below, and it exposed a bug |
| 4 | Japan 45×35 vs 45×45 | **not resolved as stated** — see below |
| 5 | Scope-aware provenance replacing `verified:"gov"` | done, narrower than you proposed — see below |
| 6 | Unconditional "Prepared for the published requirements of…" | done — 14 pages keep it, 14 no longer assert it |
| 7 | Competitor claims unsourced | done — and two were **false**, not merely unsourced |
| 8 | Dead `embassy.passportindia.gov.in` | done — host has no DNS record; repointed |
| 9 | 23 un-audited country records | done — all 16 remaining audited, results in Part 2 |

### 4 — Japan: could not confirm your premise, and could not confirm ours

You reported the official MOFA visa form as 45×35. We could not verify that, and
we could not verify our own 45×45 either. `mofa.go.jp` and the Japanese missions
in India both return 403 to any automated fetch (Akamai).

What we could establish: **MOFA states the requirement varies by the mission you
apply at**, and missions genuinely differ — the Denver consulate publishes
35×45 or 2×2in. So "the official MOFA size" may not be a single fact.

The record keeps 45×45 as a default, is flagged `aggregator` (not `gov`), and
now carries a visible advisory saying the consulate's own page overrides it.
**If you have a primary source for 45×35, we will take it** — this is the one
item where we are defaulting rather than knowing.

### 5 — provenance: narrower than you asked, deliberately

You proposed replacing `verified:"gov"` with a scope-aware provenance model. We
did not add a taxonomy, because the existing three-value field was not actually
under-expressive — it was **mis-assigned and ignored by the renderer**:

- `CountrySpecificationProvenance` already downgraded non-`gov` records to a
  "Source needs review" badge. That part worked.
- The header line above it asserted "Prepared for the published requirements
  of…" unconditionally, so on 14 pages the header contradicted the badge a few
  lines below it. Now gated.
- **Italy was mis-assigned.** Marked `gov`, sourced to `italyvms.com` — the
  outsourced visa application centre operator, not an Italian government host.
  Reclassified to `aggregator`, which moves it to the caution wording.

Push back if you think the taxonomy is still needed; our read is that the
defect was assignment and rendering, not the type.

### 7 — the competitor claims were false, not just uncited

This is worth separating out because "unsourced" undersells it.

Two posts stated Visafoto's differentiator is a **human expert review**, one
describing "a trained reviewer checks your photo against the named authority's
published requirements", and a comparison table carried it as a
`Expert review · ✓ Included` column. Visafoto's own homepage advertises the
opposite — *"No manual work for you"* — and its pricing page describes automated
editing algorithms. There is no human review to credit them with.

The same FAQ dated the service to 2009. Their site says 2013.

Replaced with what those pages actually publish: a ₹600 one-time fee, a claimed
99.7% pass rate, and replacement/correction/refund if officials reject the
photo. That guarantee is a real advantage over a free browser tool and the
section still says so.

---

## Part 2 — the country audit (the item you flagged as never done)

All 16 previously unaudited records checked. **13 of 22 records examined across
both rounds had a defect.** The failures were not random; they fell into three
repeating shapes.

### Shape A — numbers copied between unrelated countries

11 records shared byte-identical values (35×45mm, head 32–36mm, 413×531px). For
the 6 Schengen states that is correct — same EU Visa Code. **Bahrain, Kuwait,
Qatar, Oman and Pakistan had inherited it without being Schengen.**

Checking them found no agreement in any published source:

| | Sizes found in circulation |
|---|---|
| Kuwait | 35×45, 40×60, 51×51 |
| Oman | 35×45 (eVisa), 40×60 (consular) |
| Qatar | 35×45, 38×48, 30×40 (e-visa) |

Every source is a commercial photo tool. No government page for any of the four
states a size we could read; Bahrain's NPRA host does not resolve at all.

**We did not delete these pages** — the owner's standing constraint is that the
index must not shrink. Instead each page now states that published figures
disagree, names the sizes in circulation, and tells the reader to use the figure
on their own application. 35×45mm is retained as a working default because the
tool must pick something. **Challenge this if you think removal is the right
call** — it is the one decision here made under a constraint rather than on the
merits.

Pakistan turned out fine: DGIP's own portal states 45mm × 35mm and a 5 MB cap.
Upgraded to `gov`. Nepal has consistent agreement across guides and no
government page, so it was left as-is rather than alarmed about.

### Shape B — one document's rule applied to other documents

This is the third round this exact shape has appeared (Canada in round 3, twice
more here):

- **Netherlands.** `/netherlands-visa-photo-maker/` was built from
  `netherlandsworldwide.nl`, which publishes **26–30mm chin-to-crown for the
  Dutch passport, ID card and driving licence** — the page says so. That is not
  the Schengen visa rule. The Netherlands is a Schengen state; a visa or MVV
  photo follows the EU Visa Code's 32–36mm, already used for Germany, France,
  Spain and Portugal. **Every Dutch visa photo we produced had a head ~6mm too
  small.** Rescoped, repointed to the Visa Code, warns against reusing the crop
  for a Dutch passport.
- **UAE.** Listed Emirates ID alongside the visas and applied 43×55mm to all
  three. Emirates ID / ICP follows ICAO 35×45mm. Additionally the cited source
  is ICP's **ICAO guide, which never states 43×55** — the citation was arguing
  against the number attached to it. Emirates ID removed from the document list;
  notes now say which figures that guide does and does not support.

### Shape C — a homepage cited as if it stated a measurement

9 of 16 records cited a bare domain root. A homepage cannot state a dimension,
so the citation was structurally unfalsifiable. Repointed where a real page
exists (Singapore, New Zealand, Oman, Qatar, China, India overseas portal);
where none does, the record now says so.

### Individually consequential findings

- **China — the worst one.** The spec publishes two ranges (horizontal 354–420,
  vertical 472–560). They had been transcribed as though each pair were one
  photo, giving a **354×420 minimum**. The real minimum is **354×472**. A photo
  built to our figure was 52px short of the accepted height and would be
  rejected on upload. Both correct pairs are exactly 3:4; the old pair was not,
  which is what surfaced it.
- **New Zealand.** INZ accepts only **512 KB – 3.14 MB**. We recorded no band at
  all, so the page said nothing and the ordinary instinct — compress it —yields
  a file INZ rejects for being *too small*. Recorded and stated.
- **Singapore.** We claimed uploads must be "60 KB or less". ICA's guidelines
  state an **8 MB** ceiling and five accepted formats. We were telling people to
  shrink files ~130× more than required.
- **Malaysia.** eVisa band is ~10–120 KB; we recorded none. Added, marked as
  guide-sourced.
- **Correct, no change:** Saudi eVisa, Nepal, Germany, France, India e-Visa.

**India e-Visa is worth flagging as a near-miss on our side.** Our research
suggested the cap should be 1 MB and we were about to "fix" it. The existing
note was better reasoned: the official VSS_IMAGE.pdf caps at 300 KB while the
live form allows 1 MB, so 300 satisfies both. Left alone.

---

## A regression we introduced and caught

The Ireland fix in `57b1bc9` suppressed the "what file size does the online
upload need?" FAQ when `fileSizeKb` was falsy. That conflated two different
states:

- `fileSizeKb: null` **+ pixel figures** → there *is* an upload, the authority
  just publishes no KB band (**17 countries**, incl. Germany, France,
  Netherlands, Japan)
- **no pixel figures at all** → genuinely print-only (Ireland alone)

So the fix silently stripped the question from 17 countries that do accept
uploads. Corrected via a single exported predicate `acceptsDigitalUpload()` so
the next caller cannot get it wrong differently.

## A second bug the Canada work exposed

`app/[maker]/page.tsx` dropped `advisory` on **every** visa page. That is right
for records that also describe a passport (Australia's advisory is about the
guarantor, India's about PSK capture) but it also deleted the advisories on
visa-only records — **including the Canada temporary-residence warning added
earlier in this same round, which therefore never reached a reader.** Now
conditional on the record describing a passport.

## Guard tests — and proof they fail

`test/countryAdvisoryScope.test.ts` — confirmed failing when:
1. Canada's advisory loses its scope wording
2. Japan is re-flagged as authority-confirmed
3. Canada regains a passport document (which would re-trigger the strip)

`test/countryDigitalUpload.test.ts` — confirmed failing when:
1. the old `fileSizeKb || pxMin` predicate is restored
2. New Zealand's 512 KB minimum is dropped

One of these guards then **caught a later change of ours**: the advisory test
pinned the visa-only set to exactly `["canada","japan"]` and failed when the
Gulf records gained advisories. It was rewritten to assert the property rather
than the membership, since a pinned list only produces failures fixed by editing
the test.

---

## What we want you to attack

1. **Japan.** We are defaulting, not knowing. Primary source welcome.
2. **The four Gulf pages.** Kept and labelled honestly rather than removed,
   under an index-preservation constraint. Is that the right call for a "low
   value content" resubmission, or is removal cleaner?
3. **Shape B has now recurred three times** (Canada, Netherlands, UAE). Is there
   a structural fix — e.g. requiring each record to name which document each
   figure came from — or is per-record review the only real answer?
4. **`headPercentOfFrame` was not systematically audited.** We checked sizes,
   head heights and file bands. Face-coverage percentages were only checked
   where a source volunteered them.
5. **5 records still cite a homepage** where we found no better page
   (Bahrain, Kuwait, Nepal, Malaysia, and the UAE ICAO PDF which does not state
   the size it is attached to). Is "source exists but does not support the
   figure" worse than no source at all?

## Still owner-side, unchanged from round 3

`canada.ca`, `passports.gov.au` and `npra.gov.bh` return no connection from this
network — not 404s. `irishimmigration.ie`, `dfa.ie`, `mofa.go.jp` and the
Japanese missions in India return 403 to automated fetching. Anything sourced to
those was reasoned from search indexes, not a direct read.
