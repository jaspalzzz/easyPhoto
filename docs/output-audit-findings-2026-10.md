# Exam output audit — findings, 10 Oct 2026

Plan: `docs/output-audit-plan-2026-10.md`.

- **Check A** (rule vs official source): the 23 indexed exams. SSC and UPSC
  were already checked this month; the other 21 were checked on 10 Oct.
- **Check B** (tool output vs rule): all 52 exams, 303 runs (`npm run
  audit:outputs`).

**Traffic figures** are Google clicks, 26 Sep – 8 Oct.

## Fixed the same day

| Exam | Problem | Fix |
|---|---|---|
| OCI (14 clicks) | OCI publishes 200–900 px per side ("will be rejected"); a phone photo came out 2168 × 2168 | Hotfix #103, live 10 Oct 14:02 IST; on dev via #104 |

## The form would refuse our file

| Exam | Indexed? | Traffic | Problem | Source |
|---|---|---|---|---|
| UP Police | yes | 0 clicks, 15 impr | Signature band is **30–50 KB**, 140 × 60 px, JPG/JPEG. We export **5–20 KB**, as a transparent PNG. The photo is now a live capture, but we treat it as an upload. | UPPBPB Constable notice, 31 Dec 2025, §5.7–5.8 |

UP Police has no real traffic, so under the hotfix rule this goes in the next
planned release, not a same-day fix.

## Probably refused, or at risk (tool behaviour; JavaScript only)

- **Signatures saved as transparent PNG** for every exam whose signature
  format we never recorded (13 exams):
  - Indexed: Army Agniveer, CLAT, Passport Seva, TGPSC, UP Police, UPPSC.
  - Not indexed: BSF, DSSSB, GPSC, HPSC, ITBP, UPSSSC, WBPSC.

  Indian portals almost always take JPG; TGPSC and CLAT also accept PNG.
  **Proposal:** when an exam names no format, export a white-background JPG
  (`signatureExportFormat` in `lib/signature.ts`).
- **UPPSC:** the signature should carry 200 DPI (UPPSC's 2022 instruction).
  As a PNG it carries none; the JPG change above fixes it.
- **DPI published but not set:**
  - RRB signature: "minimum resolution of 100 DPI" (CEN 06/2026).
  - Driving Licence: "300 dpi" (Sarathi PhotoSign.pdf).
  - CAT: "minimum resolution of 150px/inch" (CAT 2026 guide).

  Portals rarely read the DPI. Adding it also shows a "Scan DPI" row on the
  exam page, so it's a page-text change and goes in that batch.

## Wrong or outdated text on our pages (SEO-visible; batch, owner review)

- **UP Police:**
  - the signature numbers (above);
  - the line saying the notice was an image scan we couldn't read.
- **RRB:**
  - the description calls the signature rules "unconfirmed, from an offline
    CEN 03/2025". CEN 06/2026 (7 Oct 2026) confirms them, so the page can
    become **verified**;
  - cite CEN 06/2026 instead of the generic portal.
- **TGPSC:** the description says the OTR manual "is no longer live". It is
  live (Jan 2026) and publishes 4–50 KB and 1–30 KB, JPG/JPEG/PNG, so the page
  can become **verified**.
- **Voter ID:** ECI's portal Form 6 screen publishes "maximum 2MB, .jpg,
  .jpeg", so 2048 KB is published after all. That changes the meta for the
  Voter ID title experiment
  (`docs/experiment-voter-id-title-2026-11.md`): it can state 2 MB with the
  portal as a source, and the preset can become verified.
- **CSIR-NET:** the December 2026 bulletin (7 Oct 2026) replaces our
  December 2025 source. Its ink and "running hand" wording is gone, so our
  description is out of date.
- **Live photo not flagged:** AFCAT, Air Force Agniveer, Navy Agniveer, IBPS,
  SBI, NIACL, CSIR-NET and CUET all capture a live photo; some pages mention
  it only in passing.
- **Newer official notice, same numbers:**
  - AFCAT 02/2026; Air Force Agniveer 02/2027; Navy Agniveer MR/SSR 2027;
    CAT 2026 guide.
  - Passport Seva: portal4 PDF unreachable from outside India; the same
    document is on mission sites.
  - NIACL: no 2026 notice yet; AO 2025 is the latest.

## Numbers we show that the authority doesn't publish (keep labelled as ours, §3)

- **Army Agniveer:** KB bands. The JIA site is behind a CAPTCHA; already
  marked needs-review.
- **Passport Seva:** photo minimum 10 KB; signature 10–100 KB (no signature
  rules published).
- **CLAT:** KB bands (needs-review). CLAT's own portal code crops to 200 × 230
  and 140 × 60, which is not a published rule.
- **PAN:** 197 × 276 and 354 × 157 px are our conversion of Protean's cm at
  200 DPI.
  - Protean's e-Sign article says 50 KB, which conflicts with its own table.
  - Our outputs (≤ 20 KB and ≤ 10 KB) satisfy both.
- **CTET:** 350 × 450 and 280 × 120 px are our conversion. The bulletin gives
  cm only, and the two conversions use different scales.

## Correct as they are

Every KB band checked against a current official source matches:
- IBPS, SBI, NIACL, AFCAT, Air Force Agniveer, Navy Agniveer, OCI;
- CAT, CSIR-NET, CTET, CUET;
- Driving Licence, RRB (signature), TGPSC, UPPSC, Voter ID.

## Check B: the tool output, after the OCI hotfix

The failing runs, apart from those above:
- **UPPSC signature DPI** (covered above).
- **Intermittent React #418 (hydration mismatch) page errors** on 5 of 303
  runs, on random pages (Navy Agniveer, NIACL, PAN, RBI, SSC). 50 one-at-a-time
  plain page loads gave none, and waiting for the page to finish loading didn't
  remove them under parallel load. They don't affect the downloaded files
  (every one of those runs produced a correct file), but they are real page
  errors; investigate separately with a development build, which names the
  mismatching element.

The live-photo exams' photo runs had first timed out on a harness step; they
pass once it opens the photo tab.

## Proposed order

1. **22 Oct release** (tool behaviour only, invisible to Google):
   unknown-format signatures → JPG. This also gives UPPSC its 200 DPI.
2. **22 Oct release, one page of page text** (the 14-day quiet window ends
   that day): UP Police signature to 30–50 KB, 140 × 60, JPG, plus the live
   photo, with your review of the page wording. It's the only definite
   refusal left.
3. **Page-text corrections** (after 29 Oct, a few pages per release, your
   wording review):
   - RRB and TGPSC (to verified), Driving Licence and CAT (DPI), CSIR-NET;
   - the live-photo wording;
   - the newer notices.
   - Voter ID goes with its title experiment.
4. **Check A for the 29 tier-2 exams.**
5. **The harness becomes a gate:** a known-failures list that only shrinks,
   run before each release.
