# Content Quality & E-E-A-T Audit — easyphoto.in

**Audit date:** 2026-07-02 (re-audit)
**Method:** Live fetch (curl, server-rendered HTML) of production URLs at `https://easyphoto.in/`, cross-checked against the local `dev` working tree (`git diff` / `git status`) to determine whether recently-shipped code fixes are actually deployed.
**Prior audit (same date, pre-fix):** 82/100
**Baseline audit (2026-06-23):** 71/100

---

## 0. Scope of This Re-Audit

Three code changes were reported as shipped since the prior 82/100 audit:

1. Hyperlink added to `passportindia.gov.in` citation on `/blog/indian-passport-photo-requirements/`.
2. Exam-requirements template: meta descriptions shortened, titles length-guarded, "why uploads get rejected" bullet list now conditionally omits the signature bullet on photo-only exams.
3. `lib/portalPresets.ts`: RRB spec name corrected from "Railway Recruitment Board (RRB)" to "RRB (Railway Recruitment Board)".

This audit verifies each against the **live production site**, not the local repo, per instructions.

---

## 1. Fix Verification — Live Production Check

| # | Fix claimed | Live URL checked | Status | Evidence |
|---|---|---|---|---|
| 1 | `passportindia.gov.in` hyperlinked | `/blog/indian-passport-photo-requirements/` | **NOT LIVE** | Both mentions of `passportindia.gov.in` (body copy + infographic caption) are still plain text — grepped full HTML for `<a href` containing `passportindia`, zero matches. Local working tree (`git diff app/blog/indian-passport-photo-requirements/page.tsx`) confirms the `<a href="https://www.passportindia.gov.in">` fix exists in code but is uncommitted/undeployed. |
| 2a | Meta descriptions shortened to 111–158 chars | `/exam-requirements/rrb/` | **NOT LIVE** | Live description is 220 chars: "Railway Recruitment Board (RRB): photo 20–50 KB (320 × 240 px)... Resize free, in your browser." — the old long-form template, not the shortened one. |
| 2a | Meta descriptions shortened | `/exam-requirements/driving-licence/` | **NOT LIVE** | Live description is 224 chars, same old template pattern. |
| 2a | Meta descriptions shortened | `/exam-requirements/ssc/`, `/exam-requirements/crpf/` | **NOT LIVE** | 221 and 199 chars respectively — consistent with old template, matches what the prior audit already flagged as too long. |
| 2b | Titles length-guarded | Same 4 exam pages | **NOT LIVE** | Titles unchanged from prior audit pattern (e.g. RRB title still 80 chars: "Railway Recruitment Board Photo & Signature Size 2026 (Official) — easyPhoto", well over the ~60-char budget the fix targets). |
| 2c | Signature bullet conditionally omitted | `/exam-requirements/driving-licence/` | **Not a useful test case** | Driving Licence does take a signature upload, so this page should show the signature bullet either way regardless of the fix. But the live HTML uses the old static `REJECTIONS` array pattern (not the new `rejectionReasons(hasSignature)` function per the local diff), confirming the template itself has not been redeployed. |
| 3 | RRB name order corrected | `/exam-requirements/rrb/` | **NOT LIVE** | H1 and body copy both still render "Railway Recruitment Board (RRB)" (reversed order), not "RRB (Railway Recruitment Board)". Confirms `lib/portalPresets.ts` change has not shipped. |

**Verdict: None of the three fixes are live on production.** All three exist correctly in the local `dev` working tree as **uncommitted changes** (`git status` shows `M app/blog/indian-passport-photo-requirements/page.tsx`, `M app/exam-requirements/[exam]/page.tsx`, `M lib/portalPresets.ts`) — confirmed by direct diff inspection, matching the described intent exactly. They have not been committed or deployed, so **this re-audit scores the live site as unchanged from the pre-fix 82/100 state** on every dimension these three fixes touch. No regressions were introduced by the undeployed code (it's irrelevant to the live score either way).

This is a deploy gap, not a code-quality gap. Based on the local diff, all three are correctly implemented and should resolve the corresponding findings the moment they ship — recommend committing and deploying, then a fast re-check rather than a full re-audit.

---

## 2. Everything Else — Confirmed Stable Since Prior Audit

Re-checked all previously-verified baseline fixes on live HTML; no regressions found:

| Signal | Status |
|---|---|
| Meta descriptions on non-exam pages (home, both blog posts) | Stable — unchanged, within/near 155–160 char guidance (Home 156, Sig-blog 156, Passport-blog 165) |
| Author byline + `Person` schema (Jaspal Kumar, LinkedIn `sameAs`) | Stable — present on both blog posts |
| Freshness dates (`Verified {date} · {source}` + `dateModified` in JSON-LD) | Stable — present, per-page |
| Blog word count (`/blog/why-exam-photo-signature-rejected/`) | Stable — 1,917 words in `<article>`, well above the 1,500-word floor |
| `/contact/` link in footer | **Newly confirmed this pass** — resolves the prior audit's flagged-but-unconfirmed Trustworthiness gap re: contact transparency (see Section 5) |

**Known unresolved issue, unchanged from prior audit:** `dateModified` on `/blog/why-exam-photo-signature-rejected/` is still `2026-06-13`, identical to `datePublished`, despite the article measuring 1,917 words live (vs. ~1,030 at the 2026-06-23 baseline). If the expansion happened after 2026-06-13, this timestamp is stale.

---

## 3. E-E-A-T Scoring (live production, this pass)

| Factor | Weight | Score /25 | Δ vs. prior 82/100 audit | Rationale |
|---|---|---|---|---|
| **Experience** | 20% | **17/25** | No change | Reviewer/developer framing present but expertise-adjacent, not first-hand narrative. No case studies or rejection-notice examples. Unaffected by the three pending (undeployed) fixes. |
| **Expertise** | 25% | **19/25** | **-1** | Named author, consistent bio, technically accurate spec data — same strengths as before. New deduction: the live RRB page's reversed spec name ("Railway Recruitment Board (RRB)" instead of the acronym-first "RRB (Railway Recruitment Board)") reads as slightly off relative to how the exam is actually branded and searched — a small consistency/polish signal, not a major accuracy error, but it is a real, live inconsistency this pass surfaced that wasn't separately scored before. |
| **Authoritativeness** | 25% | **16/25** | No change | Unchanged from prior audit: the passport blog post still names `passportindia.gov.in` without linking it (fix exists locally, not deployed), so the authoritativeness gap flagged last time remains live and unresolved. Sibling blog post's `ssc.gov.in`/`ibps.in` hyperlinks still present. `sameAs` still limited to one Pinterest link. |
| **Trustworthiness** | 30% | **23/25** | **+1** | Same strengths as before (privacy-first messaging, honest non-clickbait descriptions, per-page freshness dates, appropriately hedged FAQ claims). Upgrade: `/contact/` link confirmed present in the site footer this pass, closing the "contact/support transparency not confirmed" gap noted (but not resolved) in the prior audit. Still short of a full mark — no visible support email/phone or physical-address disclosure was found on the pages sampled, only a link to a presumed contact page (not fetched/verified in this pass). |

**E-E-A-T total (weighted, normalized to /100):**
20%×17 + 25%×19 + 25%×16 + 30%×23 = 3.4 + 4.75 + 4.0 + 6.9 = 19.05/25 → **76.2/100** (up from 75/100 in the prior audit — net +1.2, driven by the contact-link confirmation, partly offset by the RRB naming deduction; the exam-page meta-description and passportindia.gov.in-link issues remain exactly as scored before since neither fix is live).

---

## 4. Content Quality Score

**Overall Content Quality: 82/100 — unchanged from the prior audit.**

| Component | Score | Δ | Notes |
|---|---|---|---|
| E-E-A-T (weighted) | 76/100 | +1 | See Section 3 — net-neutral: contact-link confirmation offset by RRB-naming deduction; the two fixes with real scoring weight (passport link, exam meta descriptions) are not live |
| Word count / topical coverage | 90/100 | No change | All sampled pages still meet/exceed floor |
| Meta description coverage | 90/100 | No change | Still 100% present; exam-page descriptions (RRB 220, DL 224, SSC 221, CRPF 199 chars) remain over-length and will truncate in SERPs — the shortening fix is not deployed |
| Freshness signals | 90/100 | No change | Per-page dates still live; the same `dateModified` staleness flag on the signature blog persists |
| AI citation readiness | 85/100 | No change | See Section 6 |
| Keyword optimization | 80/100 | No change | Natural throughout; formulaic but not stuffed |
| Template-uniqueness risk (exam + KB pages) | 65/100 | No change | Still flagged for `seo-programmatic` follow-up; the signature-bullet accuracy fix (removing an inapplicable bullet on non-signature exams) is a genuine improvement to this dimension once deployed, but it isn't live yet |

**Net effect of this audit cycle: the score has not moved from 82/100**, because the three fixes that would move it (Authoritativeness link, meta-description length, and the smaller rejection-reasons accuracy fix) are all still sitting uncommitted in the local working tree rather than on production. The RRB naming issue found this pass is a new, small, separately-scored deduction that happens to roughly net out against the newly-confirmed `/contact/` link, holding the topline score flat rather than moving it either direction.

---

## 5. Additional Findings by Page (this pass)

### Homepage (`/`)
- 1,788 `<main>` words, well above the 500-word floor. Unchanged in substance from the prior audit.
- `/contact/` link confirmed present in the footer (grepped `href="/contact/"`). This closes the "contact transparency not confirmed" gap flagged as out-of-scope in the prior audit. Note: the contact page itself was not fetched/verified this pass (no phone/email/address content confirmed) — recommend a follow-up check on `/contact/` directly to fully close this out for Trustworthiness scoring.

### `/exam-requirements/rrb/` (new sample this pass, not in prior audit)
- **New finding:** live H1 and body copy render "Railway Recruitment Board (RRB) Photo & Signature Size" — the reversed, non-acronym-first name the code fix targets. This is a live accuracy/consistency issue not previously flagged (the prior audit sampled SSC and CRPF only, not RRB).
- Meta description 220 chars — will truncate significantly in SERPs (Google typically displays ~155–160 chars on desktop). Title 80 chars, also over budget for the ~60-char SERP title guidance the local fix targets.

### `/exam-requirements/driving-licence/` (new sample this pass, not in prior audit)
- Meta description 224 chars, same over-length pattern as RRB/SSC/CRPF — confirms the length issue is systemic across the exam-page template, not isolated to the two pages sampled in the prior audit.
- Signature bullet present (correctly, since DL does take a signature upload) — but rendered via the old static list, not the new per-exam conditional function, so this page doesn't independently prove the conditional logic works; it only shows the fix hasn't shipped either way.

### `/blog/indian-passport-photo-requirements/`
- No change from prior audit: `passportindia.gov.in` still named twice in plain text, never hyperlinked. The fix that would resolve this is written and correct in the local repo but not deployed.

### `/blog/why-exam-photo-signature-rejected/`
- No change from prior audit: 1,917 words, strong structure, `dateModified` still stuck at `2026-06-13` despite content growth since baseline.

---

## 6. AI Citation Readiness

Re-checked structural signals relevant to AI Overviews / LLM citation — unchanged from prior audit, no regressions or improvements observed on live production:

- Both blog posts retain clear H2/H3 hierarchies, numbered lists, and FAQ blocks — quotable, listicle-friendly structure.
- Exam pages remain lookup-table-friendly (spec table with photo/signature KB + pixel dimensions, official source badge) — good for featured-snippet and AI Overview extraction, though the over-length meta descriptions reduce SERP click-through quality even where the underlying content is citation-ready.
- `FAQPage`, `Person`, `WebPage`, and breadcrumb JSON-LD all present and well-formed on sampled pages (confirmed via grep on `sig-blog.html`, `passport-blog.html`).
- No new structured-data issues found this pass.

**AI Citation Readiness score: 85/100 — unchanged.**

---

## 7. New Issues Found This Pass (not in the 2026-07-02 82/100 audit)

1. **RRB page naming inconsistency confirmed live** — "Railway Recruitment Board (RRB)" instead of "RRB (Railway Recruitment Board)" renders in the H1, body copy, and title tag on `/exam-requirements/rrb/`. This wasn't sampled in the prior audit (which used SSC/CRPF); the fix exists locally but is undeployed. Minor Expertise-signal deduction applied this pass (see Section 3).
2. **Exam meta-description over-length confirmed systemic across 4 exams, not 2** — RRB (220), Driving Licence (224), SSC (221), CRPF (199) all exceed SERP display width. The prior audit had only directly measured SSC/CRPF; this pass adds RRB and DL as further evidence the issue is template-wide across the ~52-page exam-spec set, reinforcing (not changing) the prior recommendation.
3. **Deploy-gap risk itself is worth flagging as a process issue**, not just a content issue: three correctly-written, uncommitted fixes sitting in the working tree for an unspecified period is a shipping-cadence risk — recommend committing and deploying promptly so the next audit cycle can actually credit them.

No other new issues found. All previously-identified gaps (exam/KB-page template boilerplate ratio, `dateModified` staleness on the signature blog) persist unchanged and are not re-litigated in detail here — see the 2026-06-23 → 2026-07-02 audit trail for full detail on those.

---

## 8. Top Recommendations (updated)

1. **Commit and deploy the three pending fixes** — `passportindia.gov.in` hyperlink, exam-page meta-description/title shortening, and the RRB name-order correction in `lib/portalPresets.ts`. All three are verified correct in the local diff; none are live. This is the single highest-leverage action available — it would resolve the Authoritativeness gap, the meta-description truncation issue across at least 4 confirmed exam pages (likely all ~52), and the new RRB naming inconsistency in one deploy.
2. **After deploying, re-verify against production** (not local) before crediting score movement — re-run the same 7 URL checks used in this audit (`rrb`, `driving-licence`, `ssc`, `crpf`, both blog posts, homepage) to confirm the fixes actually render as expected once live, since template-level metadata fixes in Next.js can be sensitive to caching/ISR/build-time regeneration.
3. **Verify `/contact/` page content directly** — confirmed the link exists in the footer this pass, but the page's actual content (support email, physical address, response-time expectations) was not fetched/verified. Closing this would let Trustworthiness move from 23/25 toward a full score.
4. **Fix `dateModified` staleness** on `/blog/why-exam-photo-signature-rejected/` — unchanged finding, still open since the 2026-06-23 baseline cycle.
5. **Defer to `seo-programmatic`** for the full-pattern audit across all ~52 exam pages and the KB-variant pages — unchanged recommendation; the signature-bullet-omission fix (once deployed) is a good template for how to reduce genericness across the rest of the "why rejected" boilerplate, but the broader FAQ/rejection-reason duplication issue is untouched by any of the three fixes reviewed this pass.
