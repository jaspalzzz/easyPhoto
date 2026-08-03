# Round 12 — all seven accepted. Please verify before this is pushed.

**Unpushed:** `f602c0c`, `4b37caa`, `0a681f4` (origin/master is still `dd0f292`).
23 files, +483/−81. 523 tests, 4 skipped. **Sitemap 156.**

The owner has asked that nothing here be taken on our word. Every claim below is
stated so you can check it directly.

---

## The pattern worth naming first

You have now found the same failure three rounds running: **we fix instances, not
the class.**

- Round 10 → UK claim corrected in 11 places. You found 8 more.
- The guard we wrote to prevent recurrence **passed all 8**, because it only
  encoded the phrasings we had already found.
- Broadening it surfaced **2 further live instances** that were in neither your
  list nor ours.

The guard is now written from the verb set rather than from observed strings.
`test/boundedClaims.test.ts` reports 0 matches site-wide. That is the check to
re-run rather than trusting this paragraph.

## 1. UK-white cleanup (P1) — 8 + 2 more fixed, guard rewritten

Fixed at every location you named: `components/site/Faq.tsx:23`,
`lib/faqs.ts:138,437`, `how-to-take-a-passport-photo-at-home:27`,
`passport-photo-background-color:18,85`, `why-passport-photos-get-rejected:36,188`.

Broadening the pattern then caught two you had not listed:
`how-to-remove-background-from-photo-free:190` and
`passport-photo-size-by-country:177`.

It also caught three of our own *refutations* — sentences restating the myth to
deny it — which we rewrote to assert the standard positively rather than
weakening the pattern.

## 2. The editing correction had swung too far (P1) — accepted

You are right, and our version was as wrong as the claim it replaced. All five
places now state both: the customer-facing online rules say the photo must be
unedited, while the examiner standard permits a digitally edited background where
the edit does not affect the image of the customer. Neither automatic acceptance
nor automatic rejection is asserted; an unedited capture is recommended.

**Also found while fixing this:** UK glasses were described as *"not permitted
(remove unless medically necessary)"* in four places. That is the US rule. HMPO
allows frames over the eye socket provided both eyes stay clearly visible and
glare does not hide them. Corrected — not in your list.

## 3. UGC-NET preset was cosmetic (P1) — accepted

Correct: disclosing the conflict changed no behaviour. `sigLimitKb` was still 50,
so the tool generated files the stricter section forbids.

Now `sigLimitKb: 30` — the safe intersection, since a file under 30 KB satisfies
both the 4–30 and 10–50 readings — and `verification: "disputed"`, a new status
`check-specs.mjs` enforces at the needs-review bar (readable source, label, and a
visible instruction to confirm). It can never render a "Verified" badge.

## 4. Threshold 3 → 2 (P1) — accepted, numbers reproduced exactly

Spain 37, Portugal 39, Kuwait 42, as you measured. All three deindexed: they earn
0, 0 and 2 clicks in 90 days and hold those figures inside ~500 visible words.
Sitemap 159 → **156**; deindexed list 35 → 38.

## 5. Slug normalisation (P2) — accepted

Token-based now, so `net` no longer rewrites the middle of `internet`. Generic
family terms (`exam`, `requirements`, `photo`, `visa`, `maker`, `passport`,
`size`, `india`…) are excluded, since blanking them removes ordinary prose rather
than the distinguishing token.

**Shingle sensitivity, as you asked.** 6 / 8 / 10 give below-target counts of
77 / 72 / 70, and the same families stay weakest (exam pages, then the remaining
Schengen-family makers). 8 retained; the reasoning is now a comment in the script
rather than an undocumented constant.

## 6. Other overstated copy (P2) — accepted

- UGC-NET *"every subject except"* → points to the current subject list instead
- CSIR/UGC figures *"identical"* → now says not to assume one number across the
  two, given the documented UGC conflict
- *"an inserted image is not evidence"* → *"carries none of that context"*
- 300 DPI *"almost always"* → describes the common case and says to check whether
  the portal reads the DPI field

## 7. Three conflicting counts (P2) — accepted

The script comment no longer states a figure at all; it points at
`scripts/adsense-readiness-baseline.json`, which is the single place the number
lives and is what the gate reads. It cannot drift again.

---

## Your gate decision — implemented as specified

`npm run verify` keeps **50** as the ordinary regression floor.

New `npm run audit:adsense-readiness` holds the remediation target and **fails
outright** while any page is below it:

```
AdSense readiness: 72 of 156 indexed pages hold fewer than 300 unshared words (baseline 72).
NOT READY for an AdSense review: 72 page(s) remain below the target.
A passing `npm run verify` does not mean otherwise.
exit 2
```

Backed by a checked-in baseline, so the count can only fall; a rise fails as a
regression separately from the absolute NOT-READY exit.

## What we have not done

The 81 → now 78 template-generated pages. You confirmed these are the main risk
and that filler would worsen quality. `/exam-requirements/niacl/` shows 745
visible words of which **54** are its own; 53 exam pages share one template.
Consolidating or deindexing on demand is the direction you recommended and we
have not started it — it is a content-architecture decision of a different size
from anything in this round.

## What to check

1. **Whether the UK class is actually closed this time.** We have said so twice
   and been wrong twice. `npx vitest run test/boundedClaims.test.ts`.
2. **Whether the balanced editing wording is now accurate in both directions** —
   we over-corrected once already.
3. **UGC-NET `sigLimitKb: 30`** — is the intersection the right call versus
   holding 50 and warning, given we cannot read the bulletin from here?
4. **The `disputed` status change to `check-specs.mjs`** — it loosens nothing we
   can see, but it is a change to the gate that guards the registry.
5. **Anything else in the Round 10 copy.** You have found six unsupported claims
   in it across two rounds. We would not assume the rest is clean.

## One addition since this document was first written

`0a681f4` adds `docs/VERIFICATION-DISCIPLINE.md` — docs only, no behaviour
change. It records the nine checks that were skipped across these rounds, each
against the incident that produced it, so they do not depend on anyone
remembering them. The three with the widest reach:

1. **A data change is not a behaviour change — find the consumer.** Your
   Singapore, UGC-NET and noindex-delivery findings were all this same shape:
   the fix was correct and had no effect.
2. **Write the guard from the rule, not from the instances just fixed.** The UK
   guard was assembled from eleven corrected phrasings and passed eight live
   ones.
3. **Break the code three ways before trusting a new test**, including one you
   did not have in mind. All three weak tests you found passed with the bug
   fully restored.

Applying its own rule 4 to itself changed one figure: "78 pages at roughly
100–150 unshared words" was an estimate, so it was counted — **53 exam pages at
median 134, 25 country makers at 105**.

If you think any rule is drawn from a misreading of what you actually found,
that is worth correcting now, while it is one file rather than a habit.

## Environment

`cdnbbsr.s3waas.gov.in` remains unreachable from this network. The UGC-NET and
CSIR figures rest on your readings, not ours.
