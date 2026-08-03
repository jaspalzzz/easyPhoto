# Round 5 — response to your six findings

**All six accepted. No pushback on any of them.** Two were regressions we
shipped; one was a false statement we made about a source; one was a test that
guarded nothing.

**Commit:** `953c174` — 3 files, +144/−101. **Not pushed.** Held for your review
because the previous round's self-assessment was wrong twice, so it should not
be trusted a third time without a second read.

**Gate:** `npm run verify` passes — 503 tests, 4 skipped. Sitemap 194 (unchanged).

---

## The two regressions — and the pattern behind them

Both of our bad changes failed the **same way**: we verified against the
country's *general* photo page instead of the page for the *specific
application* the record serves.

That is the exact defect shape ("one document's rule applied to another") that
round 4 identified in the existing data and made a headline finding. We then
committed it twice while writing that finding up. Worth stating plainly: the
round-4 report's authority is reduced accordingly, and its remaining
unchallenged conclusions deserve the same suspicion.

### Singapore — you were right, our statement was false

Extracted verbatim from the ICA SAVE visa guide you linked:

> "Image file size must be less than 60Kbytes."
> "Image dimension must be 400 x 514 pixels"

Reverted to `fileSizeKb: {min: 10, max: 60}`, `formats: ["jpg"]`, source
repointed to the SAVE guide. The 8 MB / five-format figures come from
`ica.gov.sg/photo-guidelines`, which covers passports, ID cards and e-Services.
The record is `documents: ["Singapore visa (ICA)"]` serving
`/singapore-visa-photo-maker/`, so the visa figure governs.

The round-4 claim that 60 KB "matched no ICA figure" was **false**, not merely
unsupported. It is retracted in the commit message.

### Netherlands — you were right, and our change would have caused the error it claimed to fix

The Dutch Schengen visa checklist directs applicants to "a photo that meets
**Dutch requirements**". Reverted to 26–30mm chin-to-crown, 58–67% frame,
400 DPI, original document list and source.

One correction to the framing: `government.nl` does state its criteria are for
"passports, identity cards and driving licences", which is what we relied on.
But that page is not the binding instruction for a visa — the visa checklist is,
and it points back to the Dutch criteria. We read the narrower page and stopped.

The claim that "every previous Dutch visa photo had a head ~6mm too small" is
**retracted**. The record now carries a comment explaining why the Netherlands
differs from Germany/France so it is not "harmonised" again by someone noticing
the inconsistency.

## Japan

Accepted. `printMm` 45×45 → **35×45**, sourced to the MOFA application form
(`mofa.go.jp/files/000124525.pdf`) as you cited.

Disclosure: `mofa.go.jp` returns 403 to every request from this environment,
including that PDF, so **we did not read it** — this rests on your reading. If
the form's `45mm × 35mm` is width × height rather than height × width, the
change is wrong and we would want to know.

Record stays `aggregator`, and the advisory still says missions publish other
sizes (45×45 and 2×2in both appear), per your "or require mission selection".

## Canada

Accepted, and it does disprove the round-4 conclusion that provenance was only
an assignment/rendering problem. The record listed visitor/study/work while:

- `source` still pointed at `.../canadian-passports/photos.html`
- `verified: "gov"` drove "Exact" metadata and a "Verified" badge
- `fileSizeKb: {240, 5120}` carried our own `⚠ verify per IRCC portal` comment

Now: source repointed to the temporary-resident specification you linked;
`verified` → **`conditional`** (existing enum: values retained for a separately
scoped workflow, not to be presented as universal). That removes "Exact" and the
"Verified" badge — confirmed in built output: `Exact Canada` now 0 occurrences,
`Source needs review` present.

We could not read the IRCC page directly (canada.ca returns 403 here) so the
240 KB–5 MB band is **still unverified** — it is now labelled as such instead of
sitting behind a `gov` flag. If you can read that page, the band is the figure
we'd most like corrected.

## UAE

Accepted. Removed the positive "Emirates ID follows ICAO 35×45mm" claim. The
notes now state the ICP guide gives a 35–40mm width range with no fixed height,
and that Emirates ID is a separate specification this record does not reproduce.
Emirates ID remains out of `documents`.

## The tautological test

Accepted without qualification. The old test filtered by a re-implemented
predicate and then asserted that predicate — true by construction.

Fixed as you suggested (extract the shared transformation):

- `specForDocumentKind(spec, kind)` now lives in `lib/countrySpecs.ts`
- `app/[maker]/page.tsx` calls it instead of inlining the ternary
- the test asserts on the **returned spec**, not on a copy of the predicate

Confirmed it now fails on the exact case you said would slip through — restoring
the blanket `kind === "visa" ? {...spec, advisory: undefined} : spec`:

```
AssertionError: canada is visa-only; its advisory must survive onto the visa
page: expected undefined to be 'Not for the printed Canadian PASSPORT…'
```

It also now asserts the converse (passport-scoped advisories are withheld from
visa pages but shown on passport pages) and that the registry record is not
mutated.

---

## What we'd like you to check in this commit

1. **Japan direction.** We changed a size on your reading of a document we
   cannot fetch. Please confirm 45mm × 35mm is height × width on that form.
2. **Singapore scope.** 60 KB comes from a *family visa* SAVE guide. Does it
   hold for all Singapore visa channels, or is 60 KB itself
   application-specific — in which case we have repeated the original mistake in
   the opposite direction?
3. **Netherlands `dpiMin: 400`.** Restored with the rest of the revert. It came
   from the Dutch print guidance; we have not independently confirmed it applies
   to a visa submission.
4. **Canada `conditional` vs removing the band.** We kept 240 KB–5 MB and
   downgraded the flag. Removing the band entirely would emit "the limit varies
   by portal, check your form". Which is safer?
5. **Whether any other record has the general-page-vs-application-page defect.**
   We found it in Singapore and the Netherlands only after you pointed at it. We
   have not re-swept the other 25 records for it, and given we introduced it
   twice ourselves, we should not be the ones to certify that sweep.

## Standing environment limits (unchanged)

403 or no-connection from this network: `canada.ca`, `mofa.go.jp` and Japanese
missions, `passports.gov.au`, `npra.gov.bh`, `irishimmigration.ie`, `dfa.ie`,
`dgip.gov.pk`, `in.emb-japan.go.jp`. Anything sourced to those was reasoned from
search results or from your citations, not a direct read — including three of
the six fixes in this commit.
