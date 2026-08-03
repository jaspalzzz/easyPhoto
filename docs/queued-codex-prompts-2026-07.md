# Queued Codex prompts — cross-checked 2026-07-13

> Ready-to-run. All respect the LOCKED constraint: do not change slugs, canonicals,
> schema identity, routes, redirects, robots, headers, or the sitemap membership of
> existing URLs. One commit per prompt as `Atvantiq <Atvantiq@gmail.com>`, no AI
> attribution. Build gate (`npm run build` exit 0, sitemap `<loc>` = 221). Review
> each branch before merge. Master is at 7b6206f.

## Phase status (cross-checked against live master)
- **Phase 0 — Baseline:** PENDING, owner-side (GSC exports, rejection string, page
  register). Not a Codex task.
- **Phase 1 — Accuracy:** ❌ LARGELY PENDING / **URGENT**. Flagship article
  `/blog/indian-passport-photo-requirements/` still wrongly says ordinary adults
  upload 630×810 + carry two prints + counter inspection. Registries
  (`countrySpecs.ts` india, `portalPresets.ts` passport-seva) still wrong. → Prompt 1.
- **Phase 2 — Overclaims:** ❌ PENDING. "AI Compliance Engine"(×2), "Rejection
  Predictor"(×1), "Spec-checked/Spec-Checked"(×3), "All measurable checks pass"(×1)
  still live. → Prompt 2.
- **Phase 3 — Trust:** ✅ DONE & live (5 trust pages, provenance, author
  de-escalation, on-site byline). Gap: contact page missing operator/response-time/
  location. → Prompt 3.

## SHARED CONSTRAINTS (top of each prompt)
```
Branch off master; ONE commit as Atvantiq <Atvantiq@gmail.com>, no AI attribution.
Do NOT merge or push. Run `npm run build` (exit 0); confirm sitemap <loc> = 221.
Do NOT change slugs, canonicals, routes, redirects, robots, headers, or sitemap
membership. Verify every spec against the LIVE official source (link it). No
fabricated first-hand claims; no guaranteed-acceptance / "official tool" language.
```

## ⭐ Prompt 1 — Phase 1 ACCURACY (URGENT — live wrong instructions)
```
GOAL: Correct the VERIFIED error about the ordinary Indian passport photo workflow.
Confirmed vs passportindia.gov.in: ordinary ADULT fresh/reissue applicants' photo +
biometrics are CAPTURED AT THE PSK/POPSK — they do NOT upload a digital photo or
carry prints. Printed 35×45 mm white-bg photo is required ONLY for minors below 4.
The 35×45 mm print size is correct — keep it.

1. app/blog/indian-passport-photo-requirements/page.tsx — fix these wrong claims:
   - FAQ "Both. You upload the JPEG (630×810 px) … and you bring two printed
     45×35 mm physical photos to the PSK" (~line 27) — WRONG for ordinary adults.
   - "the PSK officer will reject the photo at the counter" / "The officer checks" /
     inkjet-rejected / "single failure at the PSK counter" (~lines 19,48,56,95,113)
     — remove counter photo-inspection framing for ordinary adults.
   - "630×810 online upload" as the blanket requirement (~lines 11,56,84).
   Rewrite separating workflows: ordinary domestic PSK/POPSK (photo taken at the
   centre — no upload/print) · children < 4 (carry a 35×45 mm white-bg print) ·
   overseas missions · OCI · e-Visa. Frame the tool honestly: it produces a
   compliant photo for the under-4 case, OCI/e-Visa, other countries and general
   prep — NOT a mandatory upload for every applicant.
2. Registries — stop framing the 630×810 online upload as the ordinary requirement:
   lib/countrySpecs.ts india NOTES/advisory (~lines 132,152–165) and
   lib/portalPresets.ts passport-seva description+context (~lines 143,148). VERIFY
   whether a genuine online photo-upload path exists for any Indian passport
   workflow; if yes, scope the 630×810 spec to THAT workflow with a cited source; if
   not confirmable, mark it Conditional/needs-review. Do NOT change the 35×45 mm
   print dimension.
3. Grep for every other page inheriting the framing; fix consistently.
4. Produce docs/spec-verification-2026-07.md: URL | claim | official source URL |
   source title | source date | verified date | confidence
   (Confirmed/Conditional/Historical/Unverified) | status — India done + stubs.
Report each file changed + the source URL backing each corrected claim.
```

## Prompt 2 — Phase 2 OVERCLAIMS (copy/label only)
```
GOAL: Replace acceptance/authority overclaims with bounded technical language.
Confirmed still present — replace ALL occurrences:
- "AI Compliance Engine" / "Compliance Engine" (HeroVisual.tsx + ComplianceEngine.tsx)
   → "Automated photo checks" (don't call resize/bg/rule-checks "AI" unless a model runs).
- "Rejection Predictor" (1 file) → "Photo issue checker".
- "Spec-checked" / "Spec-Checked" (3 files) → "Checked for measurable requirements".
- "All measurable checks pass" (1 file) → "No measurable issues detected".
Also where present: Compliance checker → Pre-submission photo check · Guaranteed
acceptance → Designed to help meet listed requirements · Official specifications →
Requirements published by the named authority · Will be accepted → May reduce common
submission problems · Perfect passport photo → Prepared to the selected dimensions.
Add a limitations notice near each tool's RESULTS/DOWNLOAD (not just footer):
"Checks measurable image properties (dimensions, file size, background uniformity,
approximate face position). It cannot guarantee acceptance — verify the current
application instructions on the official portal." Add a non-affiliation line near tools.
Add/point to a per-checker "can check / cannot check" split (reuse /how-photo-checking-works/).
IMPORTANT: if any term lives in a <title>, meta description, or OG alt (SEO surface),
soften it too but LIST every metadata string changed so it can be reviewed.
Report every string changed and its file.
```

## Prompt 3 — Phase 3 gap: finish the Contact page (small)
```
GOAL: Complete app/contact/page.tsx trust fields (additive; keep the existing email,
correction/bug route, and ContactPage schema). Add: named operator ("built and
maintained by Jaspal Kumar, easyPhoto developer" — link /authors/jaspal-kumar/), a
typical response time, a plain ownership statement, and a city/region-level location
(NOT a home address). No metadata/canonical/schema-identity change beyond additive
fields. Report the fields added.
```

## Later phases (see docs/adsense-remediation-plan-2026-07.md)
- Prompt 4: tiny-text floor in TOOL UIs (`components/tools/*`, `components/tool/*`, `BlogExplorer`).
- Prompt 5: thicken more ad/country pages, batch 2.
- Prompt 6: upgrade compliance diagrams (sharper illustration + head-band/crosshair/callout guides; component-only).
- Phase 9: GSC-driven consolidation — deferred while index preservation is locked.

## Owner's own to-dos
1. Confirm domain `easyphoto.in` auto-renew is ON.
2. EarnKaro → Testbook affiliate link → add to `lib/affiliates.ts`.
3. Send a UPI ID → build the "Support us" donate module.
4. Phase 0 GSC baseline + the index-reduction decision (with GSC data).
