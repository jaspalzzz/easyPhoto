# Keyword map — the 18 indexed tool pages (October 2026)

One page answers one group of searches. Two pages never chase the same
search. Every title and H1 uses the words people actually type.

- **Data:** Google Search Console, the 28 days to 13 Oct 2026 (position = average position). Bing figures are from the 14 Oct review.
- **Owner approval:** 15 Oct 2026 (review, then A + B).
- **Rules:** CLAUDE.md §1–§3. No new pages. Change a page only with evidence, and judge a change no sooner than 14 days after it ships.

## How to use this file (monthly 10-minute check)

1. In Search Console, open Performance → Pages, filter a page below, and look at Queries.
2. If a page's top searches are not its **main group** below, the page is answering the wrong question. Fix the wording first, never by adding a new page.
3. If the same search appears on two of our pages, pick the owner from the table and add one plain link from the other page to it.
4. Change one page at a time, write the date in `docs/weekly-log.md`, and check again after 14 days.

## The map

**Status:**
- **22 Oct** = rewritten in the 22 Oct 2026 release;
- **later** = left for after October (low impressions, or the fix needs a decision).

| Page | Main search group (owner of these searches) | Also covers | Google, 28 days | Title / H1 after 22 Oct | Status |
|---|---|---|---|---|---|
| `/tools/photo-with-name-date/` | photo with name and date; add name and date in passport size photo | photo with date, name and date on photo, …for TNPSC / PSC / SSC / UPSC / NEET, slate | 22,490 impr · 704 clicks · pos 7.2 | Photo with Name and Date — Add to Passport Size Photo Online / Photo with Name & Date Generator | 22 Oct (#115, #118, #129) |
| `/tools/sign-image/` | sign on photo, sign on image, add signature to photo | photo sign, sign in photo, sign across the photo, overlap signature on photo, type name as signature, e-sign on image | 7,510 · 253 · 6.2 | Sign on Photo or Image Online — Add Signature to Photo / Sign on Photo or Image Online | 22 Oct (#115, #124, #130) |
| `/tools/photo-signature-merge/` | merge photo and signature (one JPG) | photo sign merge, attach photo and signature, combine photo and signature, photo with signature | 4,936 · 56 · 7.1 | Merge Photo and Signature Online — One JPG, Free | 22 Oct (#115, #118, #124) |
| `/tools/signature-cleaner/` | photo to signature converter; image to signature converter | signature cleaner, signature converter, signature png converter | 1,555 · 93 · 6.5 (Bing pos 4, 493 clicks) | Photo to Signature Converter — Clean, Crop & Resize / Signature Cleaner & Resizer | 22 Oct (#132: intro and description only; title kept for Bing) |
| `/tools/white-background/` | white background maker (passport, exam) | background white maker, make background white for passport photo | 1,422 · 14 · 12.3 | White Background for Passport & Exam Photos | 22 Oct (#124) |
| `/tools/aadhaar-ocr/` | Aadhaar OCR (read number, name, DOB) | **what people actually type:** download / extract photo from Aadhaar card, Aadhaar JPG (answered with Unlock → PDF to JPG → Crop) | 1,404 · 66 · 6.7 | Aadhaar Card OCR — Read Aadhaar Number, Name & DOB Free | 22 Oct (this batch: photo/JPG section) |
| `/tools/resume-photo/` | resume photo maker, CV photo maker | passport size photo for resume / CV, resume photo size, biodata photo | 1,387 · 48 · 6.3 | Resume Photo Maker — Passport Size Photo for CV & Biodata / Resume & CV Photo Maker | 22 Oct (this batch) |
| `/tools/dpi-converter/` | change DPI to 200 / 300 | "dpi should be 200", 200 dpi jpg, dpi converter | 1,046 · 34 · 6.8 | Change Image DPI to 200 or 300 — Without Re-Compressing | 22 Oct (#115) |
| `/tools/face-centering/` | center your face in a photo | the form messages: "position your face in the center", "face is tilted in uploaded image", "align your face inside the circle", "place your face in the frame" | 919 · 32 · 5.4 | Center Your Face in a Photo — Check Position & Head Tilt / Center Your Face in the Photo | 22 Oct (this batch) |
| `/tools/signature-resize/` | resize signature, signature resize | signature resizer, 10 / 20 KB signature, pixel size signature | 670 · 15 · 8.7 ("resize signature" at 17.8) | Signature Resize Tool – Resize Signature Online Free / Resize Signature Online | 22 Oct (this batch) |
| `/tools/signature-crop/` | crop signature from image | crop signature, signature cropper, signature cut photo | 662 · 76 · 4.7 | Crop Signature from Image — Free, Auto-Detect | 22 Oct (#123) |
| `/tools/signature-background-removal/` | remove background from signature | signature background remover, signature white background, PAN card signature background | 638 · 15 · 9.4 | Remove Background from Signature — White or Transparent | 22 Oct (#132) |
| `/tools/resize-kb/` | photo resizer in KB, resize image in KB | KB resize, 20 / 50 / 100 / 200 KB, between 20 and 50 KB, make a photo bigger in KB | 624 · 14 · 8.6 (Bing: 15,487 impr at pos 9 for "photo resizer in kb") | Photo Resizer in KB — Resize Image to 20, 50, 100 KB | 22 Oct (#126, #131) |
| `/tools/pan-card-ocr/` | PAN card OCR | read PAN number, PAN card image | 483 · 13 · 5.7 (too few named searches to act on) | PAN Card OCR — Read PAN Number, Name & DOB Free | later |
| `/tools/document-scanner/` | scan photo / JPG online (document scanner) | image scanner online, convert JPG to scanned image | 210 · 4 · 23.7 | Document Scanner Online — Photo to Clean PDF, Free | later: the searches want "scan a JPG online"; reword when time allows |
| `/tools/exam-package/` | exam photo and signature kit | (mostly brand searches, "easyphoto") | 198 · 4 · 6.3 | Exam Photo & Signature Resizer — SSC UPSC IBPS NEET All-in-One | later |
| `/tools/background-removal/` | remove background from image / photo | background remover, transparent PNG | 124 · 0 · 78 (Google barely ranks it) | Remove Background from Image or Photo — Free, No Upload | 22 Oct (#132). Head terms belong to global brands; aim at Indian-intent long tails |
| `/tools/compliance-checker/` | exam photo checker, photo rejection reasons | check photo before upload | 64 · 4 · 4.0 | Exam Photo & Signature Checker — Common Rejection Reasons | later |

## Searches split between two of our pages (watch these)

| Search | Owner | The other page should… |
|---|---|---|
| photo signature add, signature photo, photo with signature | **merge** when they want both in one file; **sign-image** when they want the signature on the photo | sign-image links to merge (#124). Watch which page Google picks; if merge searches keep landing on sign-image, add a one-line link back from merge. |
| crop signature from image | **signature-crop** | signature-cleaner mentions cropping only as one step; don't add crop wording to the cleaner. |
| PAN card signature background remover | **signature-background-removal** | The cleaner links to it (#132). |
| remove background from signature | **signature-background-removal** | Its FAQ answer was removed from signature-resize and background-removal (#132, batch 2). |

## Tools hidden from Google (26)

These were taken out of the index in the July 2026 recovery and stay out
during October (CLAUDE.md §1). They still work and are linked from other
pages. Bringing one back is an owner decision, needs its own unique text
(no template), and should happen **at most one page a month**, measured for
14 days. The strongest candidates, because Indian forms ask for them:

1. `/tools/pdf-compress/`: "compress PDF to 100 KB / 200 KB" for exam and job document uploads.
2. `/tools/print-sheet/`: "passport size photo print sheet" / "8 photos on 4×6". The passport page already links it.
3. `/tools/resize-dimensions/`: "resize image to 200 × 230 pixels" and similar exam sizes.

## Ceiling

On-page work gets a page to answer the right search. **Positions 2–6** on
competitive searches also need links from other sites. In October 2026 our
Domain Rating is 0 and Bing sees 0 linking sites. See the link work in the
hand-over guide.
