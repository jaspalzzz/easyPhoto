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

## Phase 1 portal-preset audit

The nine presets below were rechecked on **2026-07-16**. “Needs-review” is
intentional where the public first-party source does not publish the stored
digital limits or where the available numeric notice belongs to an older
recruitment cycle.

| URL | Claim | Official source URL | Source title | Source date | Verified date | Confidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /exam-requirements/passport-seva/ | The overseas Indian-mission ICAO workflow specifies a 630×810 px colour photo on white with 80–85% face coverage. It does not publish the preset's 10–250 KB photo or 10–100 KB signature limits; ordinary domestic adult applications use PSK/POPSK capture instead. | https://embassy.passportindia.gov.in/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf | Guidelines for ICAO Compliant Photographs for Passport Applications | PDF undated; overseas notice effective 2025-09-01 | 2026-07-16 | Conditional | Kept needs-review. Pixel/composition scope is confirmed for overseas capture/upload; KB and signature fields remain explicitly unconfirmed. |
| /exam-requirements/clat/ | CLAT 2026 requires a front-facing recent passport-size photograph with a plain background and a candidate signature, but its public instructions give no KB, pixel, DPI, format, ink or name/date limits. | https://consortiumofnlus.ac.in/clat-2026/ug-instructions.html | CLAT 2026 UG Instructions | CLAT 2026 cycle; page undated | 2026-07-16 | Unverified | Kept needs-review. The inherited 20–50 KB / 200×230 px and 10–20 KB / 140×60 px values are labelled compatibility values pending confirmation in the current application screen. |
| /exam-requirements/army-agniveer/ | The Indian Army recruiting-year 2027 notice confirms an online application and a recent photograph upload, but gives no public KB, pixel, signature, format or name/date rule. The direct portal currently redirects public access to authentication. | https://www.telangana.gov.in/wp-content/uploads/2026/02/Recruitment-Notification-for-AGNIVEER-2027.pdf | Indian Army Agniveer Recruiting Year 2027 notification (Government of Telangana copy) | Registration opened 2026-02-13 | 2026-07-16 | Unverified | Kept needs-review. Removed the unsupported name/date flag; stored numeric values remain visibly unconfirmed pending the current candidate-portal validation rules. |
| /exam-requirements/airforce-agniveer/ | Agniveervayu Intake 01/2027 paragraphs 43.3.1–43.3.4 specify a recent colour photo at 100–200 KB, a candidate signature at 80–150 KB and a left-thumb impression at 50–100 KB, all in JPG/JPEG. The photo must show the candidate holding a black slate with their name and photography date in white chalk; the notice publishes no fixed pixel dimensions. | https://iafrecruitment.edcil.co.in/agniveervayu/pdffiles/Advt%20Agniveervayu%2001%20of%2027.pdf | Indian Air Force Agniveervayu Intake 01/2027 notice | Intake 01/2027; registration 2026-01-12–2026-02-01 | 2026-07-16 | Confirmed | Corrected the outdated 10–50 KB photo and signature values, updated the first-party source, retained the slate requirement and left pixel dimensions unset. The preset does not model the separate thumb-impression upload. |
| /exam-requirements/ccc-nielit/ | NIELIT's Version 1.11 guide specifies photo 5–50 KB, 132×170 px, 3.5×4.5 cm, 96–300 DPI, JPEG/JPG, recent colour on white; signature/LTI 5–20 KB, 170×132 px, 4.5×3.5 cm, 96–200 DPI, JPEG/JPG, black or blue ink on white. | https://nva.nielit.gov.in/ccc/CCC_ExamGuideLine.pdf | Guidelines and Instructions for Submission of Online Examination Application Form for DLC | Version 1.11 (2023); technical approvals dated 2021-10-20 and 2021-11-29 | 2026-07-16 | Confirmed | Upgraded to official and corrected both minima, both pixel dimensions, both aspect ratios, workflow copy and signature ink. No name/date rule is stated. |
| /exam-requirements/dsssb/ | DSSSB Advertisement 02/2026 confirms a recent clear colour photo on plain white/off-white and a legible signature, but publishes no numeric photo/signature upload limits. Archived 2012 OARS instructions list photo 25–100 KB at 3.5×4.5 cm and signature 10–50 KB at 3.5×1.5 cm. | https://dsssb.delhi.gov.in/sites/default/files/DSSSB/circulars-orders/final_advt_02-2026_1.pdf<br>https://dsssbonline.nic.in/AdvtDetailFiles/doc_dsssb_english.pdf | DSSSB Advertisement 02/2026; archived OARS upload instructions | 2026-02-25; archived instructions associated with Advertisement 02/2012 | 2026-07-16 | Historical | Kept needs-review. Historical numeric values remain, with current-notice scope and a prompt to check the live OARS upload screen. |
| /exam-requirements/bsf/ | SSC's 2026 Constable GD notice covers BSF and uses a live photograph capture with no photo KB/pixel upload. It specifies a 10–20 KB JPEG/JPG signature about 6×2 cm at 300 DPI. Those rules do not establish the stored 20–50 KB photo compatibility value for separate BSF HC/SI recruitment. | https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/notice_01122025.pdf | SSC Constable GD in CAPFs and SSF Examination 2026 notice | 2025-12-01 | 2026-07-16 | Conditional | Kept needs-review. The verified SSC-GD workflow is separated from BSF's post-specific recruitment portal and the unconfirmed photo value remains disclosed. |
| /exam-requirements/itbp/ | The public ITBP recruitment portal and accessible post notices do not publish the preset's 20–50 KB / 200×230 px photo or 10–20 KB / 140×60 px signature rules. ITBP also participates in SSC Constable GD, which uses a different live-photo workflow. | https://recruitment.itbpolice.nic.in/rect/index.php | ITBP Recruitment Portal | Live portal; no specification date | 2026-07-16 | Unverified | Kept needs-review. Removed the unsupported “standard CAPF pattern” rationale and direct users to the current post-specific upload screen. |
| /exam-requirements/epfo/ | EPFO's 2023 SSA advertisement specifies a 10–200 KB JPG photograph on a light-shade plain background with approximately 80% face coverage and no spectacles, plus a 4–30 KB JPG/JPEG running-hand signature. No newer SSA direct-recruitment notice is currently listed. | https://www.epfindia.gov.in/site_docs/PDFs/Recruitments_PDFs/Advertisement_for_SSA_24032023.pdf | Advertisement for the Post of Social Security Assistant in EPFO | Applications opened 2023-03-27 | 2026-07-16 | Historical | Kept needs-review because the values are cycle-bound. Scoped the preset to SSA rather than extending the 2023 values to Inspector recruitment. |
| /exam-requirements/fci/ | FCI Advertisement 01/2022 Category III specifies photo 20–50 KB, preferred 200×230 px, 4.5×3.5 cm, JPG/JPEG on a light/preferably white background; signature 10–20 KB, preferred 140×60 px, JPG/JPEG in black ink. No current direct-recruitment notice is listed. | https://fci.gov.in/fci-storage/storage/app/uploads/653f851f7c7ba1698661663.pdf | FCI Advertisement 01/2022, Category III | Applications opened 2022-09-06 | 2026-07-16 | Historical | Kept needs-review because the source is cycle-bound. Corrected the photo dimensions/aspect ratio and removed the false statement that the notice lacked a photo KB limit. |

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
- National/admissions: gate, ugc-net, csir-net, cat, cuet
- Defence: nda, cds, afcat, navy-agniveer
- State PSC: uppsc, bpsc, mpsc, rpsc, tnpsc, kpsc, appsc, tgpsc, wbpsc, gpsc, hpsc, kerala-psc
- Banking/insurance: nabard, lic, niacl, irdai
- Police/CAPF: up-police, crpf, cisf
- Services/other recruitment: pan, driving-licence, voter-id, upsssc
- Travel/document uploads: ds160; recheck oci on the normal review cadence

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
