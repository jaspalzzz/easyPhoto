# Codex prompts — spec re-verification (remaining homepage-only presets)

Context for whoever runs these: this continues the 2026-07 spec-accuracy pass.
`lib/portalPresets.ts` is the registry; a wrong number rejects a real
application. Re-verification this session already caught 5 application-rejecting
bugs (ccc-nielit, airforce-agniveer, nta fabricated pixels, afcat 100-200→10-50,
rpsc live-capture). 11 "official" presets still cite only a homepage.

## Hard rules (apply to every prompt below)
1. **Never change a value without primary-source evidence.** Quote the exact
   sentence/table cell from the official notice/manual. No quote → no change.
   Official = the authority's own domain or its official PDF. Coaching sites,
   Testbook, Jagran Josh, aggregators are NOT acceptable evidence.
2. **Owner must supply gated docs.** RBI docs / SSO-OTR portals / state-PSC
   registration are CAPTCHA/OTP-gated and cannot be fetched by a script. If the
   source is unreachable, DO NOT guess or use a search summary — report
   "cannot verify" and stop. "I don't know" is a correct answer.
3. **No fabricated pixels.** Several portals publish KB only. If the source
   states no pixel dimensions, the preset must have none — remove
   photoWidthPx/photoHeightPx/sigWidthPx/sigHeightPx and any aspect ratios.
   Copy must go through `photoDimsPx()`/`sigDimsPx()` (see lib/specRegistry.ts);
   `test/specCopy.test.ts` enforces this.
4. **Live-capture portals mirror SSC.** If the photo is captured live (webcam)
   during registration (SSC, BPSC, RPSC all do this), there is no photo upload —
   follow the exact structure of the `ssc` preset: photo value marked
   compatibility-only in a comment, `verification: "needs-review"`, description
   states the photo is live and lists the real uploads.
5. **needs-review requires** a source `{url,label}` AND a "confirm the current
   figures" disclosure in the description (enforced by `scripts/check-specs.mjs`).
6. **Full gate before every commit** (this is the review gate — do not skip any):
   `npx tsc --noEmit` (0) · `npx vitest run` (0) · `npm run build` (0) ·
   `npm run check:specs` (0) · `npm run check:links` (0) · sitemap `<loc>` count
   stays 207. Then verify the change in the BUILT html under `out/`.
7. **When a preset moves off homepage-only, or official→needs-review, lower**
   `UNDOCUMENTED_BASELINE` in `scripts/check-specs.mjs` to the new count.
8. Work on a review branch; commit as `jaspal <jaspalkumar006@gmail.com>`;
   **no AI attribution / Co-Authored-By**. One preset (or one cluster) per commit
   with the quoted evidence in the message. Report findings for review before
   merge — do not merge to master unreviewed.

---

## PROMPT 1 — State PSC OTR portals (tnpsc, kpsc, tgpsc, wbpsc, gpsc, uppsc)

These are SSO/OTR-style state portals. RPSC (same family) turned out to be
LIVE PHOTO CAPTURE with TWO signatures and fabricated pixels — so treat every
recorded pixel dimension here as suspect until the official OTR manual /
upload-step confirms it.

Currently recorded (verify each against the official OTR manual / upload page):
- tnpsc  — photo ≤50 KB, 350×400 px · sig ≤20 KB, 250×180 px   [pixels suspect]
- kpsc   — photo ≤200 KB, 150×150 px · sig ≤50 KB, 150×150 px  [150×150 square suspect]
- tgpsc  — photo 4-50 KB, no px · sig 1-30 KB, no px           [KB only, confirm]
- wbpsc  — photo ≤50 KB, no px · sig ≤50 KB, no px             [KB only, confirm]
- gpsc   — photo ≤15 KB, no px · sig ≤15 KB, no px             [KB only, confirm]
- uppsc  — photo ≤50 KB, no px · sig ≤30 KB, no px             [combined image? confirm]

For EACH, using ONLY the official OTR manual / registration upload page the
OWNER provides (attach PDF or paste the quoted spec):
- Confirm whether the photo is UPLOADED or CAPTURED LIVE. If live → mirror the
  `ssc` preset structure and set needs-review.
- Confirm the photo/signature KB bands and whether ANY pixel dimensions are
  published. Remove any pixel field not stated in the source.
- Note multi-signature requirements (RPSC needs English+Hindi; UPPSC historically
  uses one COMBINED photo+signature image — verify).
- Repoint `source` from the homepage to the claim-level manual/notice.
- Set `verifiedOn: "<date you verified>"`; keep official only if you verified a
  real upload spec, else needs-review.
Then run the full gate, lower the ratchet, commit per preset with quotes.

## PROMPT 2 — Banking cluster (lic, nabard, niacl, irdai)

All four record IBPS-style photo 20-50 KB / 200×230 px, sig 10-20 KB / 140×60 px.
They are usually IBPS-administered and reuse the IBPS upload spec. `ibps` in the
registry is already verified.

Task: for each, confirm from a current official recruitment notice (owner
supplies, since careers pages are JS/gated) that it (a) is IBPS-administered and
(b) uses the IBPS upload spec. If confirmed, repoint each `source` to that notice
(or to the IBPS notice it references) with a label naming it, set `verifiedOn`,
and keep the values (they already match IBPS). If a body publishes its OWN
different spec, correct to that with a quote. If no current recruitment exists to
cite, leave as-is and report — do NOT invent a source. Full gate, ratchet, commit.

## PROMPT 3 — OCI (fetchable; no owner doc needed)

Source PDF is machine-readable: https://ociservices.gov.in/Photo-Spec-FINAL.pdf
(confirms 2×2 inch / 51×51 mm SQUARE, "plain light coloured background (not
white)"). The numeric upload limits (photo max 200 KB, min 200×200 to max
900×900 px square) are on the online application form.

Currently recorded: photo ≤200 KB, 360×360 px · sig ≤200 KB, 600×200 px.
Issues to verify and fix with quotes:
- Photo is a SQUARE with a published RANGE (200×200–900×900), not a fixed
  360×360. Recording a single 360×360 misrepresents a range (same class as the
  GATE fix). Either record the min or drop the fixed pixels and note the range in
  the description.
- Background should be LIGHT-COLOURED, not white — check the preset's background.
- OCI is an identity document, not an exam; verify the signature (600×200) is
  actually part of the OCI photo upload and not carried over in error.
Repoint source to the Photo-Spec PDF, gate, commit. (No owner doc needed for the
photo spec; the online-form KB/px limits may need an owner screenshot.)

## PROMPT 4 — HPSC restore (owner-gated)

HPSC was downgraded to needs-review this session: its Advt 24/2026 (read in full)
lists "scanned photo" + "scanned signatures" but publishes NO KB/pixel spec — the
limits are only inside the OTP-gated registration portal (regn.hpsc.gov.in).

Task: IF the owner supplies the actual upload-step limits from the portal (a
screenshot or paste from the photo/signature upload page during registration),
verify them, correct the KB caps (the old 500 KB looked anomalous) and any
pixels, repoint the source to a citable page, and restore `verification:
"official"` with `verifiedOn`. Otherwise leave as needs-review. Full gate, commit.

---

## What NOT to touch
- The 11.5px text floor is PARKED owner work (branch
  `codex/hero-contrast-tiny-text-floor`) — do not disturb.
- Do not enable the AdSense script or add a CMP (owner decision; owner has
  pivoted off AdSense).
- Do not change titles/canonicals/paths/slugs or the sitemap `<loc>` set
  (locked SEO constraint).
- ds160, passport-seva, clat, army-agniveer, voter-id, dsssb, bsf, itbp, epfo,
  fci are already needs-review by design — leave unless re-verifying with a source.
