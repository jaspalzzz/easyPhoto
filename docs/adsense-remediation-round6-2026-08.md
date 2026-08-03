# Round 6 — response to your five findings

**All five accepted. No pushback.** Your central point was correct and is the
reason this round exists: fixing registry data does not fix the product. Two of
the five were live functional defects that no amount of data review would have
surfaced.

**Commits:** `953c174` + `0e8262a` — 9 files, +331/−117. **Still unpushed.**
**Gate:** `npm run verify` passes — 510 tests, 4 skipped. Sitemap 194.

Your four confirmations are accepted as given (Japan portrait orientation,
Singapore 60 KB not family-only, Dutch 400 DPI defensible, Canada band removal
safer than retention). All four are reflected below.

---

## 1. Singapore export pipeline — confirmed, and worse than reported

You were right that `recommendedDigitalDpi()` honours only `pxMin`. Measured
`computeCrop()` output before and after:

| Record | Was exporting | Authority requires |
|---|---|---|
| Singapore | **413 × 531** | 400 × 514 |
| Saudi eVisa | **602 × 602** | 200 × 200 |

The Saudi record was 3× oversized and was not in your report — the same root
cause, found by asking which other records use exact `digital.px`. Those two are
the only ones.

Fix: `ComputeCropOpts.exactOutput` overrides the mm×DPI calculation;
`buildPresetFromCrop` takes the same argument; `useToolStore` passes
`rspec.digital?.px` on **both** the automatic and the manual-crop paths. The
manual path had the identical bug and is not mentioned in your finding.

Aspect ratios match the print sizes (400/514 = 35/45), so this changes
resolution, not framing.

Guarded in `test/countryDigitalUpload.test.ts`; confirmed the guard fails when
`exactOutput` is ignored again:
```
expected { width: 413, height: 531 } to deeply equal { width: 400, height: 514 }
expected { width: 602, height: 602 } to deeply equal { width: 200, height: 200 }
```

## 2. Canada — band removed, not reflagged

Accepted exactly as recommended. You were right that `conditional` only moved a
badge while the page kept printing the range, emitting it in FAQ schema, and
compressing exports against a 5 MB cap.

`fileSizeKb: null`. The page now renders "varies by portal" and the FAQ falls
back to the generic answer. Confirmed in built output: `240–5120` now 0
occurrences.

`verified: "conditional"` and the temporary-resident source URL are retained
from round 5.

## 3. Japan — conversion completed

Accepted. `square: true` and `pxApprox300dpi: 531×531` had survived the move to
`printMm: 35×45`, so the page advertised a portrait print and a square upload
simultaneously while the tool produced a third figure.

Now `pxApprox300dpi: 413×531` (35×45mm at 300 DPI), no `square`, and `source`
points at `mofa.go.jp/files/000124525.pdf`.

**Correction to our round-5 report:** it stated Japan was "sourced to the
application form". It was not — the source field still held the MOFA homepage.
That statement was wrong when written.

We chose completing the portrait conversion over splitting mission/eVisa
workflows. If you think the split is warranted, say so — it is a larger change
we did not want to make unprompted.

## 4. Singapore 10 KB minimum — removed

Accepted. ICA states a ceiling only; the 10 KB was ours.

`FileSizeKb` now has an optional `min`. One helper, `formatFileSizeKb()`,
renders `under 60 KB` or `10–250 KB`, used at all three call sites (spec sheet,
body prose, FAQ generator). Confirmed: `10–60 KB` now 0 occurrences,
`under 60 KB` present.

## 5. The test could not detect the regression it claimed to prevent

Accepted without qualification, and empirically confirmed. Added
`test/makerAdvisoryRender.test.tsx`, which renders the maker server component
with `PhotoTool` stubbed and asserts on the props it receives.

Reverting `page.tsx` to the inline blanket removal while leaving the helper
intact — your exact scenario — now produces:

```
makerAdvisoryRender.test.tsx    Tests  2 failed | 2 passed
countryAdvisoryScope.test.ts    Tests  6 passed        <- still blind, as you said
```

The helper-only test is kept because it covers cases the render test does not
(registry non-mutation, the passport-page converse).

---

## Where this leaves the review

You have now found real defects in three consecutive rounds:

- **Round 4:** 6 issues, incl. 2 live regressions we shipped
- **Round 5:** 5 issues, incl. 3 incomplete remediations we reported as done
- **Round 6:** this response

The consistent failure is **ours in verification, not in fixing**. Specifically:

1. We twice verified against a country's general photo page instead of the page
   for the application the record serves.
2. We twice reported work as complete that was not (Japan's source; Canada's
   band still rendering).
3. We wrote two guard tests that could not fail on the regression they named.

We therefore do not regard our own sign-off as sufficient evidence, which is why
these commits are still unpushed.

## What we would like checked in these two commits

1. **`exactOutput` correctness.** It overrides output dimensions but leaves the
   crop geometry to the mm ratio. For Singapore (400/514 vs 35/45) and Saudi
   (square vs square) the ratios agree to within a rounding step. Is there a
   distortion risk we have not modelled, e.g. head-percentage warnings computed
   against the mm-derived height?
2. **Whether removing Canada's band is complete.** `printMm` is still 50×70
   (passport) with `visaPrintMm` 35×45. The record serves
   `/canada-visa-photo-maker/`. Does `effectivePrintMm()` pick the right one on
   that page, or is there a second Canada defect of the same shape?
3. **Other records with an exact-size requirement we have not modelled.** We
   checked for `digital.px` and found two. If an authority states an exact size
   that we stored as `pxMin`, it would still export wrong and no test would
   notice.
4. **Whether any other guard in `test/` is tautological or helper-only.** We
   wrote two such tests without noticing; we are not the right party to certify
   the rest.
5. **The general-page-vs-application-page sweep** from round 5 item 5 is still
   outstanding — we have not re-checked the other 25 records for it.

## Standing environment limits

403 or no connection from this network: `canada.ca`, `mofa.go.jp` and Japanese
missions, `ica.gov.sg` PDFs (extracted via raw stream decompression instead),
`passports.gov.au`, `npra.gov.bh`, `irishimmigration.ie`, `dfa.ie`,
`dgip.gov.pk`, `in.emb-japan.go.jp`. Japan's size change rests entirely on your
reading of the MOFA form; we still cannot fetch it.
