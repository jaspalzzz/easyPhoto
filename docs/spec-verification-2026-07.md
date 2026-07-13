# Specification verification ledger — July 2026

This ledger records claim-level checks against live first-party sources. A
registry value is not treated as a universal requirement when the source applies
only to a particular applicant, country of application, service or filing path.

Verified date for the completed India review: **2026-07-13**.

## India passport, OCI and e-Visa review

| URL | Claim | Official source URL | Source title | Source date | Verified date | Confidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /blog/indian-passport-photo-requirements/, /blog/indian-passport-photo-size-rules/, India maker and shared registry consumers | Ordinary adult fresh/reissue applicants in India attend a PSK/POPSK so their photograph and biometrics can be obtained there; the visit guidance says a photograph is not required. | https://www.passportindia.gov.in/psp/GettingStarted | Passport Seva — Getting Started | Not stated on live page | 2026-07-13 | Confirmed | Corrected across article, maker, FAQ, comparison and registry copy. |
| Same domestic Passport Seva consumers | A minor applicant below four must carry a recent passport-size photograph measuring 4.5 × 3.5 cm (45 × 35 mm) with a white background. | https://www.passportindia.gov.in/psp/Apply | Passport Seva — Process to Apply for Fresh / Reissue Ordinary Passport | Not stated on live page | 2026-07-13 | Confirmed | Kept the 35 × 45 mm print dimension and scoped it to the below-four exception. |
| India country preset and below-four guidance | The below-four print is colour, 45 × 35 mm, white-background, frontal and centred, with open eyes, even lighting, no background shadow and 80–85% face coverage. | https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf | Guidelines for Capturing Photographs for Minors Below 4 Years | Version 2.1; publication date not stated | 2026-07-13 | Confirmed | Kept composition values but removed adult-counter inspection framing. |
| Overseas passport guidance consumers | Passport Seva at Indian Embassies and Consulates says ICAO-compliant photographs are required for overseas passport applications from 1 September 2025. | https://embassy.passportindia.gov.in/ | Passport Seva at Indian Embassies and Consulates | Notice effective 2025-09-01 | 2026-07-13 | Confirmed | Overseas workflow is now described separately from domestic PSK/POPSK processing. |
| India digital compatibility preset | Overseas ICAO guidance specifies a colour 630 × 810 px image, white background and 80–85% face coverage for photograph capture or upload. | https://embassy.passportindia.gov.in/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf | Guidelines for ICAO Compliant Photographs for Passport Applications | Publication date not stated | 2026-07-13 | Confirmed | 630 × 810 is retained and explicitly scoped to the overseas workflow. |
| countrySpecs.india.digital and portalPresets passport-seva | A 10–250 KB photo and the stored signature limits are ordinary domestic Passport Seva upload requirements. | https://www.passportindia.gov.in/psp/GettingStarted and https://www.passportindia.gov.in/psp/Apply | Passport Seva — Getting Started; Process to Apply for Fresh / Reissue Ordinary Passport | Not stated on live pages | 2026-07-13 | Unverified | No supporting live official source was located. Values remain only for backwards-compatible output; the country preset is conditional and the portal preset is needs-review. |
| OCI content and preset | OCI uses an uploaded square photo at least 51 × 51 mm, 200–900 px with equal height and width, JPEG/JPG up to 200 KB, on a plain light-coloured background that is not white. | https://ociservices.gov.in/onlineOCI/onlineOCI/faq | OCI Services — Frequently Asked Questions | Not stated on live page | 2026-07-13 | Confirmed | Kept separate from Indian passport and e-Visa workflows. |
| Indian e-Visa content and preset | The Indian e-Visa uses an uploaded square JPEG, 10 KB–1 MB, with a plain light-coloured or white background; the photo must be front-facing, centred, shadow-free and without spectacles. | https://indianvisaonline.gov.in/evisa/tvoa.html | Indian Visa Online — e-Visa | Page footer updated 2019-05-16 | 2026-07-13 | Confirmed | Kept separate from the Indian-citizen passport workflow. |

## Next-audit stubs

These entries still need their own claim-level rows with a live-source date,
precise source URL and verification result. Their presence here is a queue, not a
verification claim.

### Country and visa registry

- us, schengen, uk, canada, australia
- germany, france, italy, netherlands, ireland
- uae, saudi-evisa, bahrain, kuwait, qatar, oman
- pakistan, nepal, spain, portugal, china, singapore
- new-zealand, japan, malaysia

For each entry, audit print dimensions, digital dimensions, file-size range,
background, head/eye band, DPI, glasses/expression rules, document scope and the
precise first-party source currently stored in lib/countrySpecs.ts.

### Government and exam portal registry

- Core: ssc, upsc, rrb, ibps, sbi, nta, rbi, ctet
- National/admissions: gate, ugc-net, csir-net, cat, clat, cuet
- Defence: nda, cds, afcat, army-agniveer, airforce-agniveer, navy-agniveer
- State PSC: uppsc, bpsc, mpsc, rpsc, tnpsc, kpsc, appsc, tgpsc, wbpsc, gpsc, hpsc, kerala-psc
- Banking/insurance: nabard, lic, niacl, irdai
- Police/CAPF: up-police, bsf, crpf, cisf, itbp
- Services/other recruitment: pan, driving-licence, voter-id, ccc-nielit, dsssb, upsssc, epfo, fci
- Travel/document uploads: ds160; recheck oci and passport-seva on the normal review cadence

For each entry, audit photo/signature KB bands, pixel dimensions, aspect ratio,
format, DPI, name/date or slate rules, workflow context and the precise
notification URL currently stored in lib/portalPresets.ts.

## Confidence meanings

- **Confirmed** — the stated claim appears in a live first-party source and is
  scoped to the workflow that source describes.
- **Conditional** — a first-party claim applies only when a named workflow,
  mission, service or form requests it.
- **Historical** — a claim is supported by an older first-party source but no
  current-cycle source has yet replaced it.
- **Unverified** — no live first-party source was located for the claim; it must
  not be presented as a current requirement.
