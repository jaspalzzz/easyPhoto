# UPSC exam page rewrite — draft for owner review (10 Oct 2026)

Page: `/exam-requirements/upsc/` (≈3–5 Google clicks/day, rising).
Status: **draft, not built.** Second page of the exam-page rewrite
(`docs/NEXT-RELEASE.md` item 9; AdSense readiness fix 1). It follows the SSC
pattern (`docs/exam-rewrite-ssc-2026-10.md`, PR #92). Earliest release: after
29 Oct, at most 3 pages per release.

## Why

- **Same template problems as SSC.** The live photo is explained three times. The
  FAQ is the name-swap template ("What is the photo size for the …", "Is this …
  resizer free and private?"). Internal words leak into the text ("selected stored
  target").
- **The official source link is broken on production.** The page cites
  `upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf`,
  which returns **404** (checked 10 Oct). UPSC moved the PDF.
- **Search demand (GSC, 25 Sep–9 Oct).** 3,155 impressions and 51 clicks at an
  average position of 8.3. People ask:

  | Query theme | Examples |
  |---|---|
  | Size and format | "upsc cse photo and signature size", "upsc cse photo size", "upsc ese photo and signature size", "upsc cse signature format" |
  | **75% face coverage** (many variants) | "upsc 75 face coverage photo", "passport size photo with 75 face coverage", "face must cover at least 75 or 3/4th of the area" |
  | The form's own text, pasted | "note 1:- allowed photo size: 20 kb to 200 kb, file format: jpg, jpeg note 2:- file name should be photo note 3:- face m…" |
  | **Error messages** | "face is unclear upsc", "not as per prescribed human face upsc" |
  | Live photo | "upsc live photo qr code scanner" |

  Today's page doesn't explain 75% coverage in practical terms, and it doesn't
  explain the error messages at all.

## Not overlapping the blog guide

`/blog/upsc-cse-ias-photo-signature-guide-2026/` already covers the long version:
the CSE specs, three signatures, the NDA/CDS comparison, rejection reasons and a
full workflow. It earns almost no search traffic today. The exam page takes a
different job: **the do-it-now page**. That means the current portal rules in the
first screen, the tool, and a fix for each message the form shows. It links to
the guide for the long version instead of repeating it.

## What does not change

- Title, meta description, H1 and URL. The meta can stay this time: UPSC's spec
  is already verified, and its numbers are UPSC's own.
- The photo and signature tools both stay, because UPSC takes an uploaded photo
  as well as a live one.

## Facts (all from official UPSC documents, read 10 Oct 2026)

**Controlling document:** "INSTRUCTIONS FOR UPLOADING PHOTO AND SIGNATURE" (UPSC
portal PDF, created 4 Feb 2026). The 2026 notices no longer print the
specifications; they point to it ("Instructions and FAQs > Instruction for
filling the form > Photos and Signature"). Current URL:
`https://upsconline.nic.in/candidate/resources/bzh30/login/upsc-candidates-portal/dist/assets/instruction-photo-signature-upload-upsc-CCLCIgId.pdf`
(the file name contains a build hash, so it may change again).

Verbatim quotes:

- **Photo (§1):** "Upload a photo named photo in jpg format with a file size
  between 20KB and 200KB." "the face must cover at least 75% of the area in the
  photo … looking directly at the camera, keeping the alignment of the face
  proper, straight with both ear lobes visible."
  - Dos: "Photo background shall be plain white." "Frontal view of the full face
    should be visible, head in the centre and both ears should be visible."
    "Expression of the face should be natural (no grinning, frowning, or raised
    eyebrows)."
  - Don'ts: "Photograph with dark background or in uniform, or with eyes hidden
    under coloured or dark glasses will not be accepted." "Glares on eyeglasses
    should be avoided." "Photograph is NOT to be signed."
- **Live photo (§2):** "Capture of live photograph shall be mandatory for
  submission of the application for any examination." It can be taken with the
  web camera or by scanning a QR code on a mobile. "The live photograph captured
  during the application process shall be matched with the passport-size
  photograph uploaded by the applicant. If a mismatch is detected between the two
  photographs, the applicant shall not be allowed to proceed further with the
  examination application process."
- **Signature (§3):** "Candidate should sign their own signature three times
  vertically (one below the other) on a plain white paper using a black ink."
  "Ensure there is adequate gap/space between each signature." "Scan all three
  signatures in a single image." It must "Contain exactly three signatures", be
  "On plain white paper (no lines or colours)", and be "File size: 20 KB –
  100 KB", "Image dimensions: 350 - 500 pixels". "Applications with signature
  files that do not meet the prescribed specifications will be rejected." The
  sample table marks these rejected: side by side, blue ink, a single signature,
  not a signature, too little gap, blurred, ruled paper, coloured paper, rotated.
- **Photo ID:** "Document name should be id_card in jpg format and sized between
  20KB-200KB" (portal Aadhaar/Photo ID guide). The CSE 2026 notice (para 2.2)
  says to carry that Photo ID "while appearing for Examination/Personality Test".
  The IFS 2026 notice also asks for a scanned copy upload.
- **Exam venue:** every 2026 notice (para 11): "all candidates will be required to
  undergo face authentication at the examination venue mandatorily."
- **Penalty:** CSE 2026 Rule 19(1)(e) lists "uploading irrelevant or incorrect
  photo/signature in the application form in place of actual photo/signature".
- **What the form says when a photo fails** (text on upsconline.nic.in):
  - "Unable to detect face in image"
  - "The face is unclear or doesn't meet the required 3/4th or 75% face coverage.
    Please upload another clear photo…"
  - "Live photo and uploaded photo do not match, please try again." (or "… do not
    match or doesn't meet the required N% face similarity …")
  - Live-photo screen: "Ensure you are in a well-lit room. Look straight into the
    camera. Do not wear cap, mask or dark glasses."
- **Not in any UPSC document:** a name or date on the photo (the photo must *not*
  be signed), photo pixel or cm dimensions, or an ink rule beyond black.

**Notices read** (`upsc.gov.in/sites/default/files/…`): CSE 2026 (No.
05/2026-CSE, 4 Feb 2026); IFS 2026 (06/2026, 4 Feb 2026); NDA & NA-I 2026 and
CDS-I 2026 (10 Dec 2025); NDA & NA-II and CDS-II 2026 (20 May 2026); CAPF (AC)
2026 (20 Feb 2026); CMS 2026 (11 Mar 2026); IES/ISS 2026 (11 Feb 2026); ESE 2026
(26 Sep 2025); ESE 2027 (16 Sep 2026); CGS 2027 (2 Sep 2026); Advt. 12/2026.

Differences between exams:
- **NDA-I and CDS-I 2026** (December 2025 notices) have no three-signature note;
  NDA-II and CDS-II 2026 do. Either way, the portal now asks every exam for three
  signatures.
- **ESE 2027** (16 Sep 2026) still prints "not exceed 300 KB … not … less than
  20 KB" in its appendix, while the portal enforces 20–200 KB (photo) and
  20–100 KB (signature). The page should say to follow the portal, because it's
  the form that accepts or refuses the file.
- **ESE 2026** alone asked for a photo "not … more than 10 days old" and for the
  same look (beard, spectacles) at every stage. Later notices dropped these
  lines. Not presented as current rules.

## Draft page (reader-facing copy — for owner read-aloud)

### Answer box (first screen, above the tools)

> **UPSC photo:** JPG, **20–200 KB**, saved with the file name **photo**. Plain
> white background, your face covering **at least 75%** of the photo, both ears
> visible.
> **UPSC signature:** sign **three times, one below the other**, in black ink on
> plain white unlined paper, and scan all three as one JPG of **20–100 KB**,
> 350–500 pixels.
> **Plus a live photo:** the form also takes your photo through the webcam or
> your phone (by scanning a QR code) and matches it to the photo you uploaded.

### Tools

The photo tool and the three-signature tool, with no repeated boilerplate. One
line under them:

> Runs on your phone or computer; your files are not uploaded.
> [How our checks work](/how-photo-checking-works/) ·
> [Full UPSC CSE guide](/blog/upsc-cse-ias-photo-signature-guide-2026/)

### What "75% face coverage" means

> UPSC wants your face to cover at least three-quarters of the photo's area.
> In practice, a normal passport photo with shoulders and lots of space above
> the head usually falls short. Crop in close around your head, keeping both
> ears in view, then check the file is still 20–200 KB.

### When the form refuses your photo

> **"The face is unclear or doesn't meet the required 3/4th or 75% face
> coverage"** — crop closer so the face fills the frame, and use a sharp,
> evenly lit photo.
> **"Unable to detect face in image"** — the face is too small, turned, in
> shadow or hidden. Use a front-facing photo with both ears showing, no dark
> glasses.
> **"Live photo and uploaded photo do not match"** — your uploaded photo must
> look like you today. Use a recent photo, remove cap, mask and dark glasses
> for the live photo, and sit in good light facing the camera.

### Three signatures on one sheet

> - Sign three times, one below the other, with clear space between them.
> - Black ink, plain white paper — no lines, no coloured paper.
> - One image, upright and sharp, with exactly three signatures.
>
> UPSC's sample sheet rejects signatures side by side, in blue ink, a single
> signature, cramped spacing, blurred or rotated scans, and ruled or coloured
> paper.

### On exam day

> Every 2026 UPSC notice says your face will be checked at the exam venue. Carry
> the Photo ID card whose details you entered in the form (for the Civil
> Services exam, also at the interview).

### NDA, CDS, CAPF, ESE — same rules?

> Yes. UPSC's application portal uses the same photo and signature rules for
> every exam. One difference to know: the ESE 2027 notice still prints an older
> 20–300 KB limit, but the portal accepts 20–200 KB for the photo and
> 20–100 KB for the signature, so prepare files to the portal's limits.

### FAQ (UPSC-only questions, 3)

1. **Does my UPSC photo need my name and date on it?** — No. UPSC's instructions
   say the photograph must not be signed, and no UPSC notice asks for a name or
   date on it.
2. **What should my files be called?** — UPSC asks for the photo to be saved as
   "photo". The Photo ID upload is named "id_card".
3. **How do I take the live photo if my computer has no webcam?** — Scan the QR
   code the form shows with your phone, and take the live photo on the phone.

Removed: the template questions ("What is the photo size for …", "How do I resize
my photo to 20–200 KB for …", "Is this … resizer free and private?", "Where can I
confirm …"). Each fact appears once on the page: the sizes and file name in the
answer box, how to crop for 75% in its section, the error fixes in theirs, the
signature rules in theirs.

## Data and code changes (when built)

- `lib/portalPresets.ts` `upsc`: source URL → the current portal PDF (above).
  Re-verified 10 Oct 2026; same commit (CLAUDE.md §4). Description rewritten from
  the facts above.
- Page body via `EXAM_GUIDES` (the SSC pattern from PR #92), with both tools in
  compact mode.
- **Fix now, separately?** The 404 source link is live on production today. It's
  one link change (SEO-visible), so it could ride the 22 Oct afternoon release on
  its own, ahead of the full rewrite.
- **Tool idea, not in this rewrite:** UPSC's form rejects photos below 75% face
  coverage. Our photo tool could check coverage and offer a one-tap "crop for
  75%" using the face detection the passport maker already has. That would make
  the page's advice actionable. It needs its own plan and tests (CLAUDE.md §7).

## Measure

14 days after release, compare against the baseline above:
- GSC position and CTR for the query themes above;
- page clicks/day (baseline ≈ 3–5);
- the page's shared-text share (target: no block shared with more than 3 other
  exam pages).

## Owner decisions

1. Approve the copy above (read it aloud), or mark changes.
2. Fix the broken UPSC source link on 22 Oct (one link), ahead of the rewrite — yes / no.
3. Keep title, meta and H1 unchanged in this batch — yes / no.
4. Plan the "75% face coverage" check as a tool feature afterwards — yes / no.
