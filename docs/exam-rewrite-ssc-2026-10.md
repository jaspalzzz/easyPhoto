# SSC exam page rewrite — draft for owner review (8 Oct 2026)

Page: `/exam-requirements/ssc/` — the site's top exam page (≈10 Google clicks/day).
Status: **draft, not built.** Ships only after the September 2026 spam update is
marked complete + 14 days (CLAUDE.md §2), as the first page of the exam-page batch
(`docs/NEXT-RELEASE.md` item 9; AdSense readiness fix 1).

## Why

- **AdSense / Google quality.** About a quarter of this page's text is copied on
  most of the 23 exam pages (resizer box copy, "Can check / Cannot check" lists,
  "independent tool", "runs in your browser", "specs can change", the "free and
  private" FAQ). The FAQ questions are the name-swap template. The live-photo
  point is explained five times. Internal words leak into reader text ("selected
  stored target", "stored signature target").
- **Search demand (GSC, 25 Sep–7 Oct).** The page sits at position 8–9 for what
  people actually ask:

  | Query | Impressions | Clicks | Position |
  |---|---|---|---|
  | ssc signature size | 1,193 | 29 | 9.2 |
  | ssc photo and signature size | 424 | 21 | 8.0 |
  | ssc cpo signature size | 424 | 5 | 9.6 |
  | ssc signature dimensions | 158 | 3 | 8.6 |
  | ssc photo size | 145 | 3 | 8.0 |
  | is passport size photo required for ssc cgl | 2 | 0 | 11.0 |

  People also paste SSC's own form instruction into Google ("10 KB to 20 KB …
  about 6.0 cm × 2.0 cm at a resolution of 300 DPI … signature should be
  horizontally aligned"). Today's page doesn't answer that in its first screen.

## What does not change

Title, meta description, H1 and URL stay as they are — one variable at a time
(CLAUDE.md §2: a title/H1 change on a click-earning page is its own experiment).
The signature tool stays. GSC baseline is the table above.

## Facts (all from official SSC PDFs, read 8 Oct 2026)

Base URL `https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/`.

| Exam | Notice (upload date) | File | Photo | Signature |
|---|---|---|---|---|
| CGL 2026 | 21 May 2026 | `Notice_of_adv_cgl_2026.pdf` (paras 9.3–9.6; Annex-IV) | live | JPEG/JPG, 10–20 KB, ~6.0×2.0 cm (annexure says 4.0×2.0) |
| CHSL 2026 | 7 Sep 2026 | `Notice_of_adv_chsl_2026.pdf` (9.3–9.6; Annex-IV) | live | same (annexure 4.0×2.0) |
| CPO 2026 | 10 Sep 2026 | `Notice_of_adv_capf_2026.pdf` (8.3–8.6; Annex-II, IIB–IIE) | live | same; portal screenshot: 300 DPI; para 23(k) says 4.0 |
| GD 2026 | 1 Dec 2025 | `Notice_of_CTGD_2026.pdf` (8.3–8.7; Annex-II 20–21) | live | JPEG/JPG, 10–20 KB, ~6.0×2.0 cm at 300 DPI, horizontal |
| JE 2026 | 2 Sep 2026 | `Notice_of_adv_je_2026.pdf` (10.3–10.6) | live | JPEG, 10–20 KB, ~6.0×2.0 cm |
| Stenographer 2026 | 24 Apr 2026 | `Notice_of_adv_steno_2026.pdf` (9.5–9.9) | live | same |
| Selection Post XIV | 13 Apr 2026 | `Notice_of_RHQ_2026_phase_xiv.pdf` (11.6–11.10; 21.1) | live | same (annexure 4.0×2.0) |
| Hindi Translators 2026 | 23 Apr 2026 | `Notice_of_adv_cht_2026.pdf` (8.3–8.7) | live | same (annexure 4.0×2.0) |
| MTS | no 2026 notice yet; MTS 2025 (26 Jun 2025) `Notice_of_adv_mts_2025.pdf` | | live | JPEG, 10–20 KB, ~6.0×2.0 cm |
| All exams | Advisory, 15 Aug 2024 | `instructions_photo_signature_15_08_2024.pdf` | rejection reasons | sign inside a box, fill ≥ 80% |

Key quotes (verbatim):

- Live photo — CHT 8.4: "For applying, the candidate is not required to have a
  pre-existing photograph of himself/ herself. The application module has been
  designed to capture a photograph of the candidate filling up the application
  form." Capture rules: good light and plain background; camera at eye level;
  face fully inside the area the camera marks; "should not wear a cap, mask or
  glasses/spectacles". GD 20(g): "Do not wear earphones or any device while
  capturing Photos."
- Photo of a photo — CHT 8.5: "In no case should the candidate capture the
  photographs of his pre-existing photograph. All such applications … will be
  rejected. However, the application of candidates submitted through Aadhaar
  Based Authentication process will not be rejected on the aforesaid grounds."
  (GD 8.6 has no Aadhaar exception.)
- Photo rejection reasons — Advisory 2024: "(i) Photo without plain background.
  (ii) Candidates wearing caps (iii) Candidates taking photos without shirts.
  (iv) Photo not sufficiently bright. (v) Photo is blurred". CGL Annex-IV: "poor
  quality, miniature and blurred photo/ side facing photographs will be rejected."
- Webcam trouble — CGL Annex-IV 1a: candidates unable to capture through webcam
  or mobile "are advised to use QR code provided at Sl. No. 2 of Upload Documents
  page for downloading the app from play store".
- Signature — CHT 8.7: "JPEG/JPG format (10 to 20 KB). Image dimension of the
  signature should be about 6.0 cm (width) x 2.0 cm (height). Applications with
  inappropriate photographs or blurred/miniature signatures … will be rejected
  summarily." GD Annex-II 21: "About 6.0 cm (width) X 2.0 cm (height) at a
  resolution of 300 DPI … Signature should be horizontally aligned."
- Miniature signatures — Advisory 2024: "The major reasons for rejection of
  signatures are "miniature" signatures. Candidates are advised to cut the box
  and then sign within the box such that signature occupies at least 80% of the
  box."
- Thumb impression — CGL/CHT/SP-XIV annexures: "For the PwD(VH) candidates, the
  thumb impression is also allowed."
- Exam day — CGL 23(q): "there should not be any change in appearance of the
  candidate during the examination vis-à-vis the photograph in the application
  form." Notices also ask candidates to bring "two passport size recent colour
  photographs" to the venue.
- Not in any notice: a name/date on the photo; an ink colour; a pixel size.

Our own arithmetic (labelled as ours on the page, never as SSC's): 6.0 × 2.0 cm
at 300 DPI ≈ 709 × 236 pixels.

## Draft page (reader-facing copy — for owner read-aloud)

### Answer box (first screen, above the tool)

> **SSC signature:** JPEG/JPG, **10–20 KB**, about **6.0 cm wide × 2.0 cm
> high**. SSC's portal adds "at 300 DPI", which works out to about 709 × 236
> pixels (our conversion; SSC gives no pixel size).
> **SSC photo:** you don't upload one. The form takes your photo live through
> your phone or computer camera.
> Checked on 8 October 2026 against SSC's 2026 notices for CGL, CHSL, CPO, GD,
> JE, Stenographer, Selection Post Phase-XIV and Hindi Translators.

### Tool

Signature tool only, preset 10–20 KB, JPEG, 6:2. One line under it:

> Runs on your phone or computer; your signature is not uploaded.
> [How our checks work](/how-photo-checking-works/)

(Replaces the "Can check / Cannot check" lists, the "independent tool" line,
the "runs in your browser" line and the "specs can change" line — all of which
repeat on every exam page.)

### Same rule for CGL, CHSL, CPO, GD and the rest?

> Yes. Every SSC notice for 2026 asks for the same signature and takes the
> photo live:

Then the exam table (exam, notice date, link). This is the answer to "ssc cpo
signature size" and "ssc chsl signature size".

### 6.0 cm or 4.0 cm?

> Five SSC notices (CGL, CHSL, CPO, Selection Post and Hindi Translators) say
> 6.0 cm wide in the main instructions but 4.0 cm in an annexure. The main
> instructions, the GD notice and the form itself all say about 6.0 × 2.0 cm,
> so use that.

### A signature SSC won't reject

> - Draw a box about 6 cm wide and 2 cm high on white paper and sign inside it,
>   so your signature fills at least 80% of the box — SSC's own advice.
> - Sign straight across, not on a slant; the form asks for a horizontal
>   signature.
> - Keep it sharp: blurred or tiny signatures are rejected.
> - SSC doesn't specify an ink colour; dark ink on white paper scans clearest.
> - Candidates with visual disability (PwD-VH) may use a thumb impression
>   (CGL, Hindi Translators and Selection Post notices).

### The live photo

> When the form asks, sit facing the camera:
> - good light and a plain background;
> - camera at eye level, looking straight ahead;
> - your face fully inside the outline on screen;
> - no cap, mask, glasses or earphones.
>
> **Never point the camera at a printed photo.** SSC rejects applications where
> the photo is a picture of an existing photograph.
>
> SSC's most common photo rejections: no plain background, wearing a cap, no
> shirt, not bright enough, blurred.
>
> On exam day you should look like your photo.

### Applying with Aadhaar authentication

> SSC says applications made with Aadhaar-based authentication are not rejected
> because of the photo or signature format. The Constable (GD) notice does not
> repeat this exception for the photo, so don't rely on it there.

### FAQ (SSC-only questions, 3)

1. **Do I need a passport-size photo for the SSC form?** — Not for the form.
   You do need two recent passport-size colour photos on exam day.
2. **Does my SSC photo need my name and date on it?** — No. No SSC 2026 notice
   asks for a name or date on the photo (that rule belongs to some other exams).
3. **What if my webcam won't take the photo?** — The CGL notice says to use the
   QR code on the form's Upload Documents page to get SSC's app and take it on
   your phone.

Each fact appears once on the page (CLAUDE.md §3): signature size in the
answer box and exam table, the box method in the signature section, live-photo
rules in the photo section, exam-day photos and webcam help in the FAQ.

Removed: "Is this resizer free and private?" and "Where can I confirm the
official requirements?" (template questions; sources are linked in the exam
table instead).

## Data and code changes (when built)

- `lib/portalPresets.ts` `ssc`: source → CGL 2026 notice (most used), with the
  exam table carrying the rest; description rewritten from the facts above;
  `verification` → `verified` (dated 8 Oct 2026); same commit carries the source
  URLs and date (CLAUDE.md §4).
- **Owner decision needed:** drop the 20–50 KB "compatibility" photo target from
  this page. SSC takes no photo upload, so a photo resizer here invites the
  exact rejection SSC warns about (a picture of an existing photo). The page
  would offer the signature tool only.
- The shared "Can check / Cannot check" block and privacy FAQ are removed from
  the SSC page only in this batch; the other exam pages follow in their own
  batches (≤ 3 pages per release).
- Quality guards: similarity baseline and jargon counts should fall; the
  `unpublished numbers` record for SSC is removed with the compatibility target.

## Measure

14 days after release: GSC position and CTR for the six queries above, page
clicks/day vs ≈10 baseline, and the SSC page's shared-text share (target: no
block shared with more than 3 other exam pages).

## Owner decisions

1. Approve the copy above (read it aloud), or mark changes.
2. Drop the photo "compatibility" target from the SSC page — yes / no.
3. Keep title, meta and H1 unchanged in this batch — yes / no.
