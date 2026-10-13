# Exam pages overhaul — for owner review (13 Oct 2026)

Ships with the **29 Oct** content release, together with the SSC (#92), UPSC
(#98) and UP Police (#107) rewrites. Purpose: clear the AdSense "low value
content" blocker and correct every exam page we re-checked this month.

## Why

AdSense rejected the site 12 times (Jul–Aug 2026) for "low value content".
The 6 Oct readiness review (`docs/adsense-readiness-2026-10-06.md`, local)
traced it to the 23 exam pages being one template with the name swapped:
about 35% of each page was identical text.

| Measure (`scripts/audit/originality.mjs`) | Before | After |
|---|---|---|
| Exam pages: share of each page's text unique to it (median) | 56% | **86%** |
| Exam pages: lowest | 46% | **71%** |
| Highest overlap between any two exam pages (quality gate) | 0.45 | **0.16** |
| Phrases repeated on ≥70% of exam pages | 303 | almost none |

## What is removed from every template exam page

(The SSC, UPSC and UP Police pages have their own rewritten text.)

- The resizer's built-in banner, the "Can check / Cannot check" lists, the
  privacy lines and the "Verify the current form before use" line — replaced
  by one link, **"What this resizer checks"**, to `/how-photo-checking-works/`,
  which explains all of it once.
- The heading "Prepare your … to the selected stored target" → "Resize your …
  photo & signature".
- "Prefer a guided flow? The photo + signature kit walks both documents
  through in one place."
- The generic "What to check before submitting … files" checklist.
- The five name-swapped FAQ questions ("What is the photo size for the …
  application?", "Is this … resizer free and private?", "Where can I confirm
  …?", etc.). They repeated the spec table or said the same thing on every
  page.

Each exam keeps its own content: the spec table, its notes and exam-specific
sections, the name/date warning where it applies, its guide links and related
exams.

**RRB** also now shows "Photo: Captured live in the form" instead of a photo
size (CEN 06/2026: no photo upload), and its search description says the photo
is captured live.

## Corrected pages — new text (every fact from the linked official source, read 13 Oct 2026)

### RRB — /exam-requirements/rrb/

Source: [RRB CEN 06/2026 (NTPC Graduate) notice of 7 Oct 2026, live photo and signature sections](https://rrb.indianrailways.gov.in/getdata?cennum=06/2026&loc=chennai&category=Notification), checked 2026-10-13.

**Intro:** RRB applications capture your photograph live inside the form, by webcam or the phone's front camera, so you never upload a photo file. The signature is the one image you prepare: JPG/JPEG, 30–49 KB, at least 140 × 60 pixels, scanned at 100 DPI or more.

**About this exam:** RRB recruits through Centralised Employment Notices (CENs), published on every regional RRB website. These rules are from CEN 06/2026 for the NTPC graduate posts (7 October 2026); CEN 05/2026 for paramedical posts gives the same signature rules.

**Notes:**
- Follow the capture screen's own instructions for lighting and framing; nothing prepared in advance substitutes for the live photo. RRB asks for a pure plain white background with no scenery or pictures behind you, and dark, non-white clothes that cover your shoulders and chest, so you stand out from the wall.
- Taking the live photo of a printed or digital copy of an old photo is not allowed; RRB summarily rejects such applications.
- The signature's size band is narrow — only 19 KB wide — so compress deliberately rather than aiming for the smallest file you can make.
- Sign in running handwriting (joined letters) with a black ink pen on white paper — not in block, capital or separated letters — and keep the signature centred in a 35 × 20 mm box, then scan just that box.
- RRB lists the signature faults that get an application rejected at any stage: someone else's signature, a non-white background, non-black ink, block or capital letters, a blurred or partly hidden signature, an image that isn't a signature, a blank, or a thumb impression in place of a signature.
- Because the photograph is captured live and only the signature is uploaded, the usual advice to prepare both files in advance does not apply here. Spend the preparation time on the signature — it is the only file you control and the only one that can be rejected for a size fault.
- The signature canvas of 140 x 60 pixels is close to 7:3. Keep the signature centred and use the available width without touching the edges, so the crop does not leave excessive empty margins or clip a stroke.

### TGPSC / TSPSC — /exam-requirements/tgpsc/

Source: [TGPSC One-Time Registration user manual (January 2026), Photograph and Signature step](https://otr.tgpsc.gov.in/pdf/NEW_OTR_USER_MANUAL.pdf), checked 2026-10-13.

**Intro:** Telangana PSC collects your photograph and signature once, in its One-Time Registration (OTR). The OTR form takes a photograph of 4–50 KB at 3.5 × 4.5 cm and a signature of 1–30 KB at 3.5 × 1.5 cm, each as a JPG, JPEG or PNG file.

**About this exam:** TGPSC was formerly named TSPSC, so both names appear in searches and older material. Registration happens on otr.tgpsc.gov.in; the OTR declaration makes clear that registering is not an application, and you still apply separately for each recruitment.

**Notes:**
- Have both images ready before you start: the manual asks candidates to keep a digital image of their photograph and signature before filling in the form, and both are uploaded, not taken live.
- Use your latest colour photograph, without a cap or goggles. Spectacles are allowed; Polaroid photos are not accepted.
- The signature is a separate image at 3.5 × 1.5 cm, a wide strip, so scan or photograph just the signature rather than reusing a crop of a larger page.
- PNG is accepted here as well as JPG and JPEG, which is unusual among Indian application forms; if another exam's form asks for JPG only, export again rather than renaming the file.
- The 1 KB signature minimum and 4 KB photo minimum are low, so the real limit is the upper one: keep the photo at or under 50 KB and the signature at or under 30 KB, and check both still look sharp after compression.

### Voter ID — /exam-requirements/voter-id/

Source: [ECI Voters' Service Portal, Form 6 photo upload field](https://voters.eci.gov.in/), checked 2026-10-13.

**Intro:** ECI Form 6 asks for a recent, unsigned colour passport-size photograph, 4.5 × 3.5 cm, showing the front of the full face on a white background, eyes open and both edges of the face visible. On the Voters' Service Portal, the Form 6 photo field accepts JPG or JPEG files up to 2 MB.

**About this exam:** Form 6 is the application to register as a new voter, filed online on voters.eci.gov.in or on paper. The online form asks for a photograph only; there is no separate signature image.

**Notes:**
- On the paper Form 6 the photograph is pasted in the box provided; online it is uploaded instead, and a sharp, well-lit file comfortably inside the limit is better than the smallest one you can make.
- The form asks for an UNSIGNED photograph. Several Indian applications want your name or signature across the image; this one specifically does not, and signing it is a reason for the form to come back.
- It states that both edges of the face must be clearly visible and the eyes open. A three-quarter angle, hair across the cheek, or a crop that clips an ear are the framing faults this wording is aimed at.

### CSIR-NET — /exam-requirements/csir-net/

Source: [Joint CSIR-UGC NET December 2026 Information Bulletin (NTA)](https://cdnbbsr.s3waas.gov.in/s3efdf562ce2fb0ad460fd8e9d33e57f57/uploads/2026/10/202610071407707951.pdf), checked 2026-10-13.

**Intro:** Joint CSIR-UGC NET covers the five science streams — Chemical, Earth Atmospheric Ocean and Planetary, Life, Mathematical and Physical Sciences — for Junior Research Fellowship and Lectureship. It is a different examination from UGC-NET with its own subject list, though NTA administers both. The December 2026 bulletin asks for a colour photograph of 10–200 KB and a signature of 10–50 KB, both JPG/JPEG, with no fixed pixel dimensions, plus a live photo taken during the application.

**About this exam:** The joint CSIR-UGC NET is conducted by NTA for eligibility in science and research fields; the December 2026 application window opened on 7 October 2026. Like UGC-NET, NTA specifies file size and format but no fixed pixel dimensions for the photo or signature.

**Notes:**
- You upload a scanned photograph and also take a live photo while filling in the form, through your webcam or by scanning a QR code with your phone. The uploaded photo needs 80% of the frame to be your face, ears included and no mask, against a white background; for the live photo, sit against a light-coloured background in good light.
- Bring two extra passport-size photographs to the exam, the same as the one uploaded on the form: one is pasted on the admit card and one on the attendance sheet in the exam hall. Print copies of the same image rather than a different sitting.
- Both files are JPG or JPEG and must be clearly legible: the photograph between 10 and 200 KB, the signature between 10 and 50 KB. If you apply without Aadhaar or DigiLocker, you also upload an identity proof (JPG/JPEG, 10–200 KB).

### CAT — /exam-requirements/cat/

Source: [CAT 2026 Registration Guide (iimcat.ac.in)](https://cdn.digialm.com/per/g06/pub/32842/EForms/image/CAT2026/CAT_2026_Registration_Guide.pdf), checked 2026-10-13.

**Intro:** CAT 2026 registration: a photo within 1200 × 1200 pixels and a signature within 80 × 35 mm, both JPG/JPEG of no more than 80 KB each, at a minimum of 150 pixels per inch. The photo must be on a white background and no more than six months old.

**About this exam:** CAT (Common Admission Test) is run by a different IIM each year for MBA admission to the IIMs and other participating institutes. CAT 2026 is on 29 November 2026, and candidates must bring printed copies of the uploaded photograph that day.

**Notes:**
- CAT wants a square photograph within 1200 x 1200 pixels and a signature within 80mm x 35mm, each as JPG or JPEG and each no larger than 80 KB, at a minimum of 150 pixels per inch. The square photograph is the unusual part: a standard 35x45mm passport crop is the wrong shape for this form.
- The photograph must be no more than six months old and on a white background. It is also affixed to your admit card on test day, and the instructions tell candidates to keep sufficient printed copies of the same image — so print spares of exactly what you upload.
- The square 1200x1200 requirement means you cannot start from a 35x45mm passport crop — the proportions are wrong and trimming one to a square leaves the head oversized in the frame. Crop square from your original photograph instead, then check the result is still at least 150 pixels per inch at the size CAT asks for.
- The signature is specified physically at 80 x 35 mm while the photograph is specified as a 1200 x 1200 square. Keep these as separate source files: converting the portrait canvas into the signature shape would discard the original proportions and add no useful signature detail.

### Driving Licence — /exam-requirements/driving-licence/

Source: [Sarathi Parivahan — Photo and Signature Scan & Upload Process](https://sarathi.parivahan.gov.in/sarathiservice/pdf/PhotoSign.pdf), checked 2026-10-13.

**Intro:** Driving licence / learner's licence application on the Sarathi Parivahan portal (sarathi.parivahan.gov.in). Photo 35×45 mm (420×525 px), 10-20 KB; signature 256×64 px, 10-20 KB, black pen on white paper. This is a single national spec document, not a state-specific one.

**About this exam:** Driving licence and learner's licence applications nationwide go through the single Sarathi Parivahan portal (sarathi.parivahan.gov.in) — this is one national spec document, not a state-by-state one, even though the RTO issuing the licence is run by the state.

**Notes:**
- Sarathi asks for camera photos or scans at a resolution of at least 300 DPI, in true colour, saved as JPG (for example image01.jpg).
- The photo should be in colour against a light-coloured, preferably white, background, taken within the last six months.
- Applicants who can't sign upload a thumb impression in place of the signature: the right thumb for women and the left thumb for men.
- Sarathi tells you to keep each file under 20 KB by adjusting the scanner settings or cropping and resizing; if a file is over 20 KB, reduce the scan resolution or crop closer rather than lowering quality until the face blurs.

### AFCAT — /exam-requirements/afcat/

Source: [AFCAT 02/2026 notification (IAF)](https://afcat.edcil.co.in/assets/images/news/AFCAT_02_2026/Notification%20for%20AFCAT%20Cycle%2002-2026.pdf), checked 2026-10-13.

**Intro:** Air Force Common Admission Test. Three uploads with DIFFERENT bands: photograph 100-200 KB, signature 80-150 KB, thumb impression 50-100 KB, all JPG/JPEG. AFCAT specifies file sizes and formats but no fixed pixel dimensions. Confirm the current notification before submitting.

**About this exam:** AFCAT (Air Force Common Admission Test) recruits for the Indian Air Force's Flying and Ground Duty branches. The 02/2026 notification sets a different band for each of the three uploads — photograph 100–200 KB on a light background, signature 80–150 KB, thumb impression 50–100 KB — with no fixed pixel dimensions, and the application also captures a live image through your device camera.

**Notes:**
- Three files, each with its own band and its own literal file name: Passport Photograph.jpg at 100-200 KB, Signature.jpg at 80-150 KB, and Thumb Impression.jpg at 50-100 KB. The published minimums are binding; a signature below 80 KB or thumb impression below 50 KB sits outside AFCAT's stated band.
- The thumb differs by candidate: male candidates upload the LEFT thumb and female candidates the RIGHT, pressed on an ink stamp pad and then onto plain blank paper.
- The signature is signed on white paper with a black ink pen, by the applicant and nobody else, and the notice asks you to scan the signature area only rather than the whole page.
- The notification states what each file name should be — Passport Photograph.jpg, Signature.jpg and Thumb Impression.jpg. It does not say what happens if you use a different name, so treat renaming as cheap insurance rather than as a stated rejection ground.
- The thumb impression is accepted as JPG, JPEG or PDF, which the photograph and signature are not — those are image formats only. Check the format as well as the size before uploading each of the three, because the rules differ file by file.

### Agniveervayu — /exam-requirements/airforce-agniveer/

Source: [IAF Agniveervayu Intake 02/2027 notice](https://iafrecruitment.edcil.co.in/agniveervayu/pdffiles/Advt%20Agniveervayu%2002%20of%2027.pdf), checked 2026-10-13.

**Intro:** Indian Air Force Agniveervayu Intake 02/2027 online application. Photo 100–200 KB in JPG/JPEG — a recent passport-size colour photo, front-facing on a light background without a mask, holding a black slate at chest level with the candidate's name and the date written in white chalk. Signature 80–150 KB in JPG/JPEG, signed in black ink on white paper. The notice publishes no fixed pixel dimensions.

**About this exam:** Agniveervayu Intake 02/2027 applications are submitted on iafrecruitment.edcil.co.in, which also captures a live image of the candidate during registration. The candidate must be photographed holding a black slate at chest level with their name and the photography date written clearly in white chalk, rather than adding the text digitally after the photo is taken. A left thumb impression of 50–100 KB is uploaded too.

### Indian Navy Agniveer — /exam-requirements/navy-agniveer/

Source: [Indian Navy Agniveer MR 01/2027 and 02/2027 notice, paragraph 34](https://www.joinindiannavy.gov.in/files/Advt_Agniveer_MR_01_27_and_02_27_English.pdf), checked 2026-10-13.

**Intro:** Indian Navy Agniveer SSR/MR recruitment. The notice requires a 10-50 KB recent colour passport-style photo with the candidate holding a black slate showing their name and the photograph date in white chalk, plus a separate webcam live photograph during the application. It publishes no photo pixel dimensions or separate signature upload.

**About this exam:** Indian Navy Agniveer applications require both the slate photograph upload and an additional live photograph taken through your webcam while you fill in the form. The slate is a physical one held in the photo, not a digital name/date strip; the notice lists no fixed pixels and no separate signature upload.

**Notes:**
- The photograph must be recent in a specific sense: the 2027 notices say the photograph must not have been taken before March 2026, so an image from an earlier application cycle is not reusable even if it still looks like you. Check the date named in the notification you are applying under.
- The upload can be as small as 10 KB. Compress carefully and check the face is still legible at that size rather than compressing to the number and submitting unseen.
- Agniveer entries run in batches with their own advertisement each cycle, and the photograph date rule is tied to that cycle rather than to a rolling number of months. Read the date named in the notification you are applying under before deciding an existing photograph is recent enough.


## Owner decisions

1. **Approve the corrected text above** (read aloud), or mark changes.
2. **Approve lowering 16 "words of its own" minimums** (CLAUDE.md §1). The
   words lost are the removed template blocks (above) and the statements that
   were wrong (e.g. TGPSC "manual no longer live", Voter ID "no size cap
   published", RRB "unconfirmed"). Every page is still at least 347 words.

   | Page | Recorded minimum | Now |
   |---|---|---|
   | afcat | 284 | 282 |
   | army-agniveer | 262 | 256 |
   | csir-net | 378 | 333 |
   | ctet | 301 | 293 |
   | driving-licence | 318 | 314 |
   | ibps | 284 | 254 |
   | navy-agniveer | 238 | 224 |
   | niacl | 364 | 353 |
   | oci | 278 | 265 |
   | pan | 277 | 276 |
   | passport-seva | 318 | 307 |
   | rrb | 523 | 399 |
   | sbi | 303 | 283 |
   | tgpsc | 322 | 238 |
   | uppsc | 262 | 255 |
   | voter-id | 260 | 219 |

3. **Approve the date rule** (CLAUDE.md §1, `app/sitemap.ts`): exam pages'
   sitemap date and structured "modified" date both become the later of the
   spec check and the template change (13 Oct 2026). The visible "Verified"
   date stays the spec check date.
