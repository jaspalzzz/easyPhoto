# UP Police exam page rewrite — draft for owner review (10 Oct 2026)

Page: `/exam-requirements/up-police/`, almost no traffic (Google, 25 Sep –
9 Oct: 16 impressions, 0 clicks, average position 6.8).

Status: **approved by the owner on 10 Oct 2026** (copy, new meta, title/H1
unchanged); built in `feat/up-police-rewrite`. Third page of the exam-page rewrite, after SSC
(#92) and UPSC (#98), following the same pattern. Planned for the 29 Oct
release, which keeps that release at three exam pages, the maximum.

## Why

- **Our numbers are wrong.** The page and its search snippet show a 5–20 KB
  signature. The official notice says **30–50 KB**, JPG/JPEG, 140 × 60 pixels.
  The tool follows the page, so it makes files the form refuses (output audit,
  `docs/output-audit-findings-2026-10.md`).
- **The photo is taken live in the form.** The page still offers a 20–50 KB
  "photo size", which UPPBPB doesn't ask for.
- **The page says the notice couldn't be read.** It has now been read (pages
  23–24 of the scanned PDF).
- **Fixing the numbers inside the shared template isn't enough.** UP Police
  and RRB publish the same signature rules, and both take a live photo, so the
  two template pages would become near-copies. The quality check measured it:
  UP Police would keep only 200 words of its own, against 292 recorded now,
  and five other exam pages would lose some of theirs. A page of its own fixes
  both problems.

## What does not change

- Title, H1 and URL.
- **The meta description does change:** today's says "signature 5–20 KB",
  which is wrong. See the draft below.

## Facts (official notice, read 10 Oct 2026)

**Source:** UPPBPB notice "उ0प्र0 पुलिस में आरक्षी नागरिक पुलिस एवं समकक्ष पदों पर
सीधी भर्ती–2025" (Constable, Civil Police and equivalent posts, Direct
Recruitment 2025), no. PRPB-B (Constable PAC and other cadres)-07/2025, dated
31 Dec 2025, 35 pages, scanned:
`https://uppbpb.gov.in/FilesUploaded/Notice/CONSTABLE-VIGYAPTIc7be0cc8-3365-471e-9237-447c528d341a.pdf`.
It's the latest recruitment notice on uppbpb.gov.in. Later items, up to
8 Oct 2026, are PET and result notices for this same recruitment.

**Posts (§1):** Constable Civil Police (men and women), Constable PAC/Armed
Police, Constable Special Security Force, Women Constable for the women's
battalions, Constable Mounted Police, Jail Warder (men and women).

**Applying (§5.5–5.6):**
- One Time Registration on uppbpb.gov.in, verified with a DigiLocker account.
- Then log in by account ID and password, Aadhaar or DigiLocker.
- Candidates already in government service must upload a No Objection
  Certificate.

**Photograph (§5.7):** "आवेदन पत्र में अभ्यर्थियों की Real time (लाइव) फोटोग्राफ ली
जायेगी" (a real-time, live photograph will be taken in the application), by
webcam or another device. Conditions:
- **(b)** no cap: a photo with a cap is not accepted.
- **(c)** the face is not covered by a mask, hair, cloth, shadow, jewellery or
  anything else.
- **(d)** with spectacles, no reflection or glare on them; the eyes must be
  clearly visible.
- **(e)** not blurred.
- **(f)** not over-bright.
- **(g)** no uniform of any kind; an application with a uniform is not accepted.
- **(h)** no uniform at any stage of the recruitment, the written exam
  included, or the candidate is left out of the selection process.
- **(i)** if the live photo doesn't match the Aadhaar photo, a declaration in
  the online form is mandatory.
- **(j)** applying with another prescribed government ID instead of Aadhaar
  requires the form's self-declaration.

**Signature (§5.8):** scanned and uploaded.
1. Sign with a black-ink pen on white paper, inside a box 50 mm × 20 mm.
2. Running letters, not block letters.
3. The image must be JPG/JPEG.
4. Size "50mm X 20mm या 140 X 60 पिक्सल" (50 mm × 20 mm or 140 × 60 pixels).
5. File "30 KB से 50 KB के बीच" (between 30 KB and 50 KB).
6. The signature must be the candidate's own.

**Not in the notice:** any photo file size or format (the photo isn't a file
you upload), DPI, or a name/date strip.

## Draft page (reader-facing copy — for owner read-aloud)

### Answer box (first screen, above the tool)

> **UP Police signature:** a JPG or JPEG of **30–50 KB**, **140 × 60
> pixels** (the notice also gives the size as 50 × 20 mm).
> **UP Police photo:** you don't upload one. The form takes it live, through
> your webcam or phone camera, while you apply.

Button: **Make your UP Police signature file**

### Tool

The signature tool only; there's no photo to prepare. One line under it:

> Your signature is processed here in the browser and never sent to us.
> [How our checks work](/how-photo-checking-works/)

### Signing for the scan

> - Draw a box 50 mm wide and 20 mm high on white paper.
> - Sign inside it with a black pen, in your usual running hand, not in
>   separate block or capital letters.
> - Photograph or scan just the box; the tool removes the rest.

### The live photo

> When the form opens the camera:
> - no cap and no uniform of any kind (a uniform gets the application
>   refused);
> - nothing over your face: no mask, hair, cloth, shadow or jewellery;
> - if you wear spectacles, avoid glare so your eyes are clearly visible;
> - keep it sharp and not over-bright.
>
> If the live photo doesn't match your Aadhaar photo, the form asks you to
> fill a declaration.

### No uniform at any stage

> The notice warns against wearing any uniform at any stage of the
> recruitment, the written exam included. A candidate who does is left out of
> the selection.

### Which recruitment these rules are from

> UPPBPB's notice of 31 December 2025 for Constable (Civil Police) and
> equivalent posts: PAC/Armed Police, Special Security Force, women's
> battalions, Mounted Police and Jail Warder. Sub-Inspector and other
> recruitments have their own notices, so check the one you're applying to.

### FAQ (UP Police-only questions, 3)

1. **My signature file is only a few KB. Will the form refuse it?** — Yes. The
   notice sets a 30 KB minimum, and a 140 × 60 signature is naturally only a
   few KB. Our tool brings the file up to 30 KB without changing the picture.
2. **I'm a government employee. Do I upload anything else?** — Yes: a No
   Objection Certificate. The notice makes it mandatory for candidates already
   in government service.
3. **Can I apply without Aadhaar?** — Yes. You can log in with your account ID
   and password or DigiLocker. If you apply with another government ID instead
   of Aadhaar, the form asks you for a self-declaration.

**Removed:** the template FAQs ("What is the photo size for …", "How do I
resize my photo to …", "Is this … resizer free and private?", "Where can I
confirm …") and the template notes and checklist. **Each fact appears once:**
- size and format: in the answer box;
- how to sign: in "Signing for the scan";
- the live-photo rules: in "The live photo";
- the uniform warning: in its own section;
- the minimum-size explanation, the NOC and the ways to log in: in the FAQ.

### Meta description (replaces today's wrong one)

> UP Police signature: JPG/JPEG, 30–50 KB, 140 × 60 pixels, in running
> letters. Your photo is taken live while you apply, so the signature is the
> only image you prepare.

## Data and code changes (when built)

- **`lib/portalPresets.ts` `up-police`:**
  - signature 30–50 KB, 140 × 60 px, JPG/JPEG;
  - live photo with no photo upload (the SSC pattern);
  - verified 10 Oct 2026, with the source above.
- **Page body** via `EXAM_GUIDES` (from #92), with the signature tool in
  compact mode.
- **Other surfaces that show UP Police's sizes** change with it, as SSC's did:
  its row on `/exam-photo-size/`, its card on `/exam-requirements/`, the
  social preview image and `llms.txt`.
- **Built on top of the UPSC branch (#98)** and released with SSC and UPSC on
  29 Oct.
- **Already done locally:** the corrected exam data, the tightened quality
  lists, and a fix to the live-photo copy guard. The guard had read "UP" in
  every "sign-up" as a UP Police mention.

## Measure

14 days after release:
- the page's impressions and clicks (baseline: 16 impressions, 0 clicks in 15
  days);
- the page's own-words count and its overlap with RRB (target: no shared block
  beyond the site template).

## Owner decisions (10 Oct 2026)

1. Copy approved.
2. New meta description approved.
3. Title and H1 unchanged: yes.

## Wording changed after approval (to keep the page's own words)

The quality check found 5-word phrases shared with the SSC and SBI pages, so
five lines were reworded; the meaning is unchanged:

- "UP Police signature:" → "The UP Police signature file:"
- "UP Police photo: you don't upload one. The form takes it live, through your
  webcam or phone camera, while you apply." → "The photo: there's no photo
  file. The form takes your picture live, with a webcam or your phone camera,
  during the application."
- The button and tool heading "Make your UP Police signature file" →
  "Prepare the signature for UP Police".
- The heading "The live photo" and its lead-in "When the form opens the
  camera:" → the heading "Live-photo rules".
- The source label → "UPPBPB notice for Constable and equivalent posts,
  31 Dec 2025".
