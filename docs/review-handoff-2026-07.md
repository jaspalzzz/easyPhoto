# Review handoff — workflow accuracy, bounded claims and contact trust

This branch combines three related trust and accuracy batches for review. The
review base is `master` at `7b6206f`.

## 1. Correct the Indian passport-photo workflow

- Separate ordinary domestic adult PSK/POPSK processing, the below-four printed
  photo exception, overseas Indian-mission guidance, OCI and Indian e-Visa.
- State that ordinary adult fresh/reissue applicants are photographed and have
  biometrics captured at the PSK/POPSK; they do not upload or carry a photo.
- Keep the confirmed 45 × 35 mm white-background print for children below four.
- Scope 630 × 810 px to the overseas Indian-mission ICAO workflow.
- Retain legacy KB/signature values only as conditional compatibility values and
  mark them needs-review where no live first-party source was located.
- Correct shared maker, FAQ, blog, comparison and related-page copy that inherited
  the former blanket upload/counter-inspection framing.
- Add `docs/spec-verification-2026-07.md` with claim-level sources, confidence and
  the next-audit queue.

Primary registry review points:

- `lib/countrySpecs.ts`
- `lib/portalPresets.ts`
- `lib/makerContent.ts`
- `lib/faqs.ts`
- `app/blog/indian-passport-photo-requirements/page.tsx`
- `app/blog/indian-passport-photo-size-rules/page.tsx`

Official sources used:

- https://www.passportindia.gov.in/psp/GettingStarted
- https://www.passportindia.gov.in/psp/Apply
- https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf
- https://embassy.passportindia.gov.in/
- https://embassy.passportindia.gov.in/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf
- https://ociservices.gov.in/onlineOCI/onlineOCI/faq
- https://indianvisaonline.gov.in/evisa/tvoa.html

## 2. Replace acceptance and authority overclaims

- Replace AI/compliance-engine labels with `Automated photo checks` where the UI
  describes cropping, resizing or deterministic rule checks.
- Replace spec-checked/pass guarantees with bounded results such as `Checked for
  measurable requirements` and `No measurable issues detected`.
- Rename the predictive tool presentation to `Photo Issue Checker` while keeping
  its existing route and internal component identifiers stable.
- Change checker verdicts and generated result-card labels so they report measured
  issues instead of predicting acceptance or rejection.
- Remove the unmeasured homepage `under 30 seconds` comparison.
- Add a shared `ToolLimitationsNotice` with:
  - measurable-property scope;
  - per-checker can-check/cannot-check lists;
  - no-acceptance-guarantee wording;
  - a visible non-affiliation statement; and
  - a link to `/how-photo-checking-works/`.
- Place the notice beside application-photo results/downloads in the photo export,
  exam package, validator, portal resizer and both checker workflows.

Intentional SEO-copy changes to review:

- `/tools/compliance-checker/` title and description now use bounded
  pre-submission language.
- `/tools/photo-rejection-check/` title and description now use `Photo Issue
  Checker` and measurable-property language.
- The photo-issue checker Open Graph image alt/title/subtitle were updated to
  match. No canonical, route or schema implementation was changed.

Primary component review points:

- `components/site/ToolLimitationsNotice.tsx`
- `components/tools/ComplianceCheckerTool.tsx`
- `components/tools/RejectionPredictorTool.tsx`
- `components/tool/ExportPanel.tsx`
- `lib/complianceCard.ts`
- `components/site/HeroVisual.tsx`
- `components/site/ComplianceEngine.tsx`

## 3. Add visible contact ownership fields

- Keep `hello@easyphoto.in`, the existing correction/bug path and ContactPage
  JSON-LD unchanged.
- Add the named operator with a link to `/authors/jaspal-kumar/`.
- Add plain independent-ownership wording.
- Add a typical response time of within two business days.
- Add only region-level location (`Punjab, India`) and explicitly avoid publishing
  a private residential address.

Review point: `app/contact/page.tsx`.

## Constraints and expected invariants

- No route, slug, canonical, redirect, robots, header or sitemap-membership edits.
- No new acceptance guarantees or government-affiliation language.
- No fabricated first-hand testing claims.
- Existing application files remain processed in the browser.
- The final sitemap is expected to contain 221 `<loc>` entries.

## Verification

Run from the repository root:

```sh
npm run build
grep -c "<loc>" out/sitemap.xml
git diff master...HEAD --check
```

Expected results:

- production build exits 0;
- sitemap count is 221; and
- no whitespace errors are reported.

Known non-fatal build warnings:

- MediaPipe's bundle reports a dynamic critical-dependency warning.
- Static generation may report a failed `fonts.gstatic.com` fetch for the rupee
  glyph when network access is unavailable; the export still completes.

## Suggested reviewer focus

1. Verify the domestic/under-four/overseas/OCI/e-Visa workflow boundaries.
2. Confirm conditional registry values cannot be presented as universal domestic
   Passport Seva requirements.
3. Check every checker verdict and share-card label remains descriptive rather
   than predictive.
4. Confirm each limitations notice accurately matches what its tool actually
   measures.
5. Confirm the contact fields are visible content only and do not alter identity
   in ContactPage JSON-LD.
