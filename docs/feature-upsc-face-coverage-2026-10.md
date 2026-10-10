# UPSC "75% face coverage" check — feature plan (CLAUDE.md §7)

Status: **approved by the owner, 10 Oct 2026**, with "Crop closer" as a button
the person presses (not automatic).

## 1. The user problem and the evidence

UPSC's form refuses photos where the face is too small, even when the file is
the right size. Our UPSC photo tool today checks only the file (JPG,
20–200 KB). A candidate can download a "correct" file from us and still see:

> "The face is unclear or doesn't meet the required 3/4th or 75% face coverage"

Evidence:

- **UPSC's own rule.** The form's note reads: "Face must cover at least 75% or
  3/4th of the area in the photo". Its sample table marks photos "Rejected
  because face coverage is less than 3/4th of the photo". The portal PDF
  (4 Feb 2026) also says about 75% face coverage.
- **Google Search Console** (1 Jul – 8 Oct 2026):
  - Searches about the rule: "upsc 75 face coverage photo" (49 impressions,
    3 clicks), "75 face coverage photo", "passport size photo with 75 face
    coverage", "75 face coverage photo for upsc" and "75 face passport size
    photo" bring about 90 more.
  - Searches quoting the form's errors: "face is unclear upsc" and "not as
    per prescribed human face upsc".
  - The UPSC page as a whole: 4,293 impressions, 61 clicks, average position
    8.7.
- These searchers have hit the rule or the refusal. A tool that fixes it on
  the page they land on is lever 1 in CLAUDE.md §8: "tools that give the
  right file first time".

## 2. What it does

The feature works in the **photo tab of the UPSC resizer**, after the person
uploads a photo:

1. **Find the face.** We use the face detector the site already uses in
   five tools. It runs on the device; no photo leaves the browser.
2. **Measure** how much of the photo the face covers, and show it in plain
   words, for example: *"Your face covers about 48% of the photo. UPSC asks
   for 75% or more."*
3. **If it's under 75%:** offer one button, **"Crop closer"**. It crops around
   the head, keeping the top of the head, the chin and both ears inside the
   frame, until coverage reaches UPSC's level. The person sees the result
   before downloading. They can keep their original if they prefer.
4. **Then** compress to 20–200 KB as today.
5. **If no face or more than one face is found,** say so, in the same terms
   as the form's "Unable to detect face in image" message, and say what to
   change (a front-facing photo, ears showing, no dark glasses).
6. **If the photo is already too tight to crop further,** or the face fills it
   but the head is cut off, say so. Never crop into the head.

Wording rules (CLAUDE.md §3, §4):
- We never say "UPSC will accept this". We report what we measured and what
  UPSC asks for.
- If the detector can't run (model download fails or times out), the tool
  says "We couldn't check the face size", and compression still works.

## 3. The one unknown, and how we settle it first

UPSC doesn't publish how it measures "face" (face only, or the whole head with
hair?). Its form says "of the area in the photo", so the measure is an area
ratio, but "face" needs pinning down.

**Calibration step (before any UI work):**
- Run our detector on UPSC's own sample photos from the form (the accepted
  ones, and the ones rejected for coverage).
- Pick the measure and threshold that put every UPSC "accepted" sample above
  the line and every coverage-rejected one below it.
- Record the measured numbers in a test fixture. The sample images stay out
  of the repository; they're UPSC's.

**If no measure separates UPSC's samples cleanly,** we stop there. I report
back, and we ship only clearer guidance instead of a number we can't stand
behind (§3: no invented figures).

### Calibration result (10 Oct 2026) — passed

The photos are from UPSC's form, `upsconline.nic.in/caf/assets/icons/`. We
measured them with the site's own face detector (MediaPipe FaceLandmarker
0.10.35): chin from the landmarks, hair top and ear-to-ear width from the
pixels against UPSC's white background.

| UPSC sample | UPSC's verdict | Head box ÷ photo area | Head height ÷ photo height | Ear-to-ear ÷ photo width | Face landmarks box ÷ photo area |
|---|---|---|---|---|---|
| akash_1 (1024 × 1024) | rejected, coverage | **38.6%** | 72.2% | 53.4% | 21.7% |
| akash_2 (808 × 861) | rejected, coverage | **58.0%** | 85.7% | 67.7% | 33.1% |
| akash_3 (619 × 775) | **accepted** | **84.3%** | 95.6% | 88.2% | 47.6% |

- **The measure:** "head box" = (hair top → chin) × (ear → ear), divided by
  the photo's area. It puts both coverage-rejected samples below UPSC's 75%
  and the accepted one above it, matching the form's wording ("75% … of the
  area in the photo"). We use UPSC's own 75% as the line; we don't invent a
  different one.
- **Hair may touch the top edge.** In the accepted akash_3 the hair touches the
  top of the frame and the ears sit 29 px from the sides. So the crop may take
  the hair to the edge, but must keep the forehead, the chin and both ears
  fully inside.
- **Too close is also refused.** UPSC's specimen list marks "Too Close"
  (forehead and ears cut off) as invalid. The tool must say so when the head
  is cut, and "Crop closer" must never cut it.
- **Small icons not used for the line.** UPSC's small 166 × 196 specimen
  icons sit inside a rounded card frame, so they can't be measured reliably:
  the acceptable icon reads 60% including the frame, about 72% excluding it.
- **Limitation:** only three full-size samples, with a wide gap (58% → 84%).
  The 75% line comes from UPSC's text; the samples confirm the measure, not
  the exact threshold.
- **On real photos** (any background), hair top and ear width will come from
  the person mask the passport tool already computes (`lib/segmentation.ts`)
  instead of the white-background scan. Tests pin the three numbers above
  (±2 points) on the white-background path and check that the two paths agree
  on a white-background photo.

## 4. Which existing page hosts it

- `/exam-requirements/upsc/`, in the existing photo tab. No new URL (§1).
- The same preset data covers NDA and CDS (same UPSC portal). Their old URLs
  redirect to the UPSC page, so there's nothing else to host it.
- It's switched on by a preset field (like `sigSidePx`), so no other exam
  changes.

## 5. SEO-visible impact and performance cost

- **SEO-visible: none.** The check appears only after a person uploads a
  photo. Google sees the same page. If we later want a line of page text
  mentioning it, that's a separate copy change for your review.
- **Page load:** no growth for visitors who don't upload (the code loads
  only on upload; budget ≤ 2 KB first-load JS, §6.6).
- **After upload:** the face model (a few MB, cached after first use)
  downloads once, as it already does on the auto-crop and LinkedIn tools.
  The security policy already allows its sources.
- On slow phones, detection takes 1–3 s. We show progress, and there's a
  timeout with the fallback in §2.

## 6. Official spec source

- UPSC portal PDF "Instructions for Uploading Photo and Signature" (4 Feb
  2026), already linked on the page as the official source.
- The application form's own note and sample table (read 10 Oct 2026).

## 7. Test plan

- **Unit tests** (pure functions):
  - the coverage measure;
  - the "crop closer" planner: it reaches the target, never cuts the head, and
    refuses when it can't;
  - the calibration numbers from §3 as a fixture, so a future change can't
    quietly move the line.
- **Browser tests** on the UPSC page, using the existing face test photo:
  - a wide shot gets the under-75% message, then "Crop closer" gives ≥ 75%
    and a 20–200 KB JPG;
  - a tight photo passes without changes;
  - a no-face image gets the "no face found" message;
  - a stalled model gets the "couldn't check" fallback, reusing the existing
    model-stall test pattern.
- **Real-phone check** on the dev preview: Android and iPhone, with a selfie
  and a scanned passport photo.
- The full gate (§6), including the SEO diff (expected: 0 pages changed).

## 8. Rollback

- Remove the preset field, or revert the PR. The photo tab returns to
  compress-only.
- No data, URLs or page text depend on it.

## 9. Timing

- About 2–3 days of work after approval. Calibration (§3) comes first and
  can stop the work early.
- JavaScript only, so it fits any release. Proposed: build after 22 Oct,
  ship with the first release after 29 Oct. That keeps the 29 Oct UPSC page
  rewrite and this tool change apart in Search Console.

## Owner decisions (10 Oct 2026)

1. Plan approved as written.
2. "Crop closer" is a button the person presses; the tool never crops on its
   own.
