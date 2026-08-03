# easyPhoto — AdSense remediation & site-quality plan (updated 2026-07-13)

Master plan for the owner's return (~Sept 2026). Merges the 10-phase remediation
plan with review additions **A–H**. Ready-to-run Codex prompts live in
`docs/queued-codex-prompts-2026-07.md`.

## Framing (read first)
- **This is YMYL content.** Passport/visa/government-document pages are held to a
  higher E-E-A-T bar by Google. So Phases 1–3 (accuracy, overclaims, trust) are
  the *core requirement*, not polish.
- **The work pays off beyond AdSense.** Better accuracy + trust lifts organic
  rankings and affiliate conversions too. Worth doing even if AdSense never
  approves — it's durable quality, not an AdSense gamble.
- **LOCKED constraint (unchanged):** do not change slugs, canonicals, schema,
  routes, redirects, robots, headers, or the sitemap membership of the current 216
  URLs. Don't reduce GSC impressions. Index-reduction is DATA-driven (Phase 9),
  never by URL pattern.

## Status snapshot
- **Live on master:** affiliate CTA infra (dormant), SSC/UPSC rich copy (Phase 4 ×2),
  photo compliance diagrams (= the "unique annotated example" for Phase 4/5 — reuse
  the `PhotoComplianceDiagram` component), `AdSenseScript` already excludes `/tools/`
  + `/embed/` (Phase 8 partial).
- **Phase 1 STARTED:** `/blog/how-to-reduce-passport-photo-size-for-online-forms/`
  already corrected (ordinary adults' photo captured at PSK, no portrait upload).
  Still to do: `/blog/indian-passport-photo-requirements/` + the registries.
- **Parked, reviewed, not merged:** `codex/hero-contrast-tiny-text-floor`.

## 80/20 — do these first (most AdSense risk, least effort)
1. **Phase 1** — fix the Indian passport accuracy bug in the main article + registries.
2. **Phase 2** — soften overclaims sitewide.
3. **Phase 3** — ship the 5 trust pages.
4. **Phase 8-D** — close the ad-exclusion gap (Hinglish `*-kaise-kare`, `/exam-resizer/*`).
The full 216-page audit (Phase 4) is the long tail — sequence it **by GSC impressions**.

---

## What Google's policy actually says (verified 2026-07-13)
Sources: AdSense "account wasn't approved" (support.google.com/adsense/answer/81904),
"pages ready for AdSense" (…/adsense/answer/7299563), Google Publisher Policies
(…/publisherpolicies/answer/10502938), Confirmed Click (…/adsense/answer/10025624).

- **No minimum word count.** Google sets none — it rewards *unique, original, valuable*
  content over volume. Do NOT chase 1,500–2,500-word targets; that advice was wrong.
- **Rejection reasons that apply to easyPhoto → the fix:**
  - "Content quality issues — not enough original rich content of value" (Google's fix
    names auto-generated/templated pages AND **"thin affiliate content without added
    value"**) → Phase 4/5; affiliate links only on content-rich pages.
  - "Insufficient content — too little text" → thin tool pages → Phase 4, Phase 8.
  - "Doesn't comply with policies" = the Publisher Policies **misleading-representation**
    rule (misstates the publisher/creator/purpose/**content itself**) → the accuracy bug
    + overclaims → **Phase 1 + Phase 2 (URGENT — the clause we're closest to violating).**
  - "Difficult to navigate — broken links / redirects" → Phase 7.
- **Ad-placement rules** (Publisher Policies + Confirmed Click): no ads on low-value or
  control-only screens; no ads adjacent to/overlapping action buttons (Upload/Process/
  Download/nav) → Phase 8.
- **What WINS:** your OWN original material — specialist knowledge, reviews, before/after,
  screenshots, real portal error messages, diagrams (the compliance diagrams count) →
  Phase 5. This beats rephrased spec text.
- **⚠ Affiliate warning:** "thin affiliate content without added value" is a NAMED
  rejection reason. Thicken a page BEFORE adding the Testbook link — never put an
  affiliate link on a thin page.

## Phase 0 baseline DATA (GSC export 2026-07-13, last 3 months)
- **333 clicks · 12,109 impressions** · avg pos ~8–14 · **96% India** · 63% mobile. Small but growing from ~zero.
- **Winners (double down):** `/tools/sign-image/` (50c/1394i) and the **Voter-ID cluster** (~115 clicks across resizer + exam-req + form-resizer + blog — queries "voter id photo size in mb/kb", "eci photo size"). Plus SBI-PO / driving-licence resizers. Pattern that works = **ID-document photo/size resizers + sign-on-image.**
- **Underperformers:** country maker pages (35 pages → only 728 impr; India dominates, intl long tail is dead weight). High-impr/low-click pages (driving-licence 471i/2c, agniveer ~350i/2c at pos 7–8) = CTR-improvement opportunity (already ranking, not converting).
- **PHASE 9 ANSWER (data-backed):** the 12 exact-KB `-to-{X}kb` variants together earn **152 impressions / 2 clicks** — negligible. **Consolidating them (301 → parent tool) sacrifices ~zero traffic**, so the "don't reduce impressions" rule and the scaled-content fix DON'T conflict here. Safe to consolidate. (Country-maker long tail = next candidate, per-page.)

## Phase 0 — Baseline (before any change)
Record: exact AdSense rejection string + date; GSC indexed/excluded; per-URL 90-day
impressions/clicks/queries; top-50 landing pages; zero-impression pages; sitemap
count; noindex/canonical/redirect rules; ads.txt publisher ID.
Build the page register: `URL | type | GSC traffic | index status | source verified |
reviewer | claims safe | action`.
**[+B] Add a TECHNICAL baseline:** snapshot every 216 URL's canonical + noindex +
schema + H1 to a file. This is the regression tripwire for every later batch.

## Phase 1 — Accuracy remediation (CRITICAL; SEO-positive)
Fix `/blog/indian-passport-photo-requirements/` and separate the workflows (ordinary
domestic PSK/POPSK, children < 4, overseas missions, diplomatic, OCI, e-Visa,
non-PSK routes). For ordinary adults: photo captured at the centre — remove the
630×810 upload / two-photo / counter-inspection / inkjet-rejection claims.
**[+] Fix the source-of-truth too:** correct `lib/countrySpecs.ts` (india notes) and
`lib/portalPresets.ts` (passport-seva) so they don't frame the digital upload as the
ordinary requirement; keep the confirmed 35×45 mm print size. Grep for every page
that inherits the framing (india maker, size guides) and fix consistently.
Then audit EVERY official claim (not the page in general): dimensions, file size,
format, background, recency, name/date, signature dims, submission channel,
applicant exceptions — for all passport/visa/exam/govt-ID/tool-preset pages.
Upgrade the registry with: document, authority, country, applicant category,
submission channel, requirement, direct source URL, source title, source page/section,
verified date, verified by, confidence (Confirmed / Conditional / Historical /
Unverified), notes. **Completion rule:** no page may say "official/verified/exact/
compliant" unless every associated requirement has a direct authoritative source;
otherwise use the existing honest "needs-review" disclosure or noindex until verified.

## Phase 2 — Remove overclaims (CRITICAL; SEO-minimal)
Sitewide language swap: AI Compliance Engine→Automated photo checks · Compliance
checker→Pre-submission photo check · Rejection Predictor→Photo issue checker ·
Spec-checked→Checked for measurable requirements · All checks pass→No measurable
issues detected · Guaranteed acceptance→Designed to help meet listed requirements ·
Official specifications→Requirements published by the named authority · Perfect
passport photo→Prepared to the selected dimensions · Will be accepted→May reduce
common submission problems. Add a limitations notice near results/download (not just
footer). Add an explicit "tool CAN check / CANNOT check" block per checker.
**[+C] Watch the metadata line:** some overclaims live in titles/meta descriptions/OG
alt (SEO surface). Softening misleading metadata is worth it and won't cost
impressions — but it IS a metadata edit; do it consciously, not by accident.

## Phase 3 — Visible trust infrastructure (HIGH; SEO-positive; additive)
Create `/editorial-policy/`, `/source-methodology/`, `/corrections-policy/`,
`/authors/jaspal-kumar/`, `/how-photo-checking-works/`. Each spec page shows:
written/maintained by · reviewed by · last verified date · applicable workflow ·
direct official source · limitations · revision history · "Report outdated
information" link. **Solo-operator honesty:** do NOT invent a separate reviewer —
"Researched and maintained by Jaspal Kumar; requirements checked against the linked
primary source; corrections logged in the revision history." Consider a paid
independent factual review later for the most important govt pages.
**[+] Contact page:** named operator, city/region (not a home address — balance
trust vs privacy), domain email, correction route, response time, ownership statement.
Sitemap 216 → ~221 (additive; confirm no existing URL changed).

## Phase 4 — Strengthen existing pages (HIGH; SEO-positive; no URL changes)
Unique info per page, not word count. Country pages: authority + application type,
workflow, print vs digital, adult/child differences, background, head/expression,
file limits, exceptions, direct source + date, what easyPhoto checks / cannot check,
country-specific mistakes, a unique annotated example (**reuse the compliance
diagram**), change history. Exam pages: cycle, notification title + date, direct PDF
link + page number, photo/signature/other-doc requirements, live-photo/webcam,
name-date, cycle differences, portal-error troubleshooting, verified date. Tool pages:
what it does, when to use, formats, how processing works, privacy, limitations,
steps, output quality, troubleshooting, examples — kept close to the tool, not a
bottom SEO block. **[+H] Include the OCR/PDF tool pages** (pdf-compress ~260 words,
OCR pages are thin too). Sequence by GSC impressions.

## Phase 5 — Editorial differentiation (HIGH; no forced URL changes)
Cluster the blog (Indian passport workflows / visa-photo / exam applications / image
prep / PDF prep / privacy-identity). Per cluster: one definitive guide + supporting
articles + tool + reference pages. **Differentiate overlapping articles — do NOT
merge/delete indexed pages** (we deliberately kept Wave-2a differentiation; merging
would drop impressions). Add original evidence: annotated screenshots, comparison
tables, before/after, compression tests, **real portal error-message screenshots**
(high information-gain), tool methodology, dated change logs, diagrams, common user
problems. **Do not mass-publish** until existing pages are corrected.

## Phase 6 — Homepage without redesign (MEDIUM)
Keep nav, tool categories, popular countries/exams, privacy positioning, CTAs,
visual identity. Reduce duplicate *claims*, rename AI/compliance language, add a
"what we check" section + methodology/limitations links, show the named operator,
drop unverified numbers ("30 seconds", "100% source documented").
**[+E] Caution:** reduce repeated *claims*, NOT internal *links*. We restored
country/maker links this session because de-linking starves those pages of internal
equity — audit each removed link against whether it's a page's main internal source.

## Phase 7 — Technical & structured-data audit (MEDIUM; protective)
One canonical/page, correct destination, unique titles/descriptions, exactly one H1,
valid status codes, redirect chains, broken official-source links, soft 404s,
accidental indexation of tool states/query combos, mobile nav, CWV, JS rendering,
consent behavior, AdSense crawler access, accurate lastmod. JSON-LD: two blocks are
fine (sitewide Org/WebSite + page Article/FAQ/Breadcrumb); fix only genuine
duplication/inconsistency/schema-exceeds-visible-claims. **Sitemap rule:** don't
shrink automatically; remove only redirected/404/definitively-noindex URLs; no fake
lastmod; keep sitemap aligned with actual index directives.

## Phase 8 — Monetization readiness (HIGH before reapply)
Good ad candidates: editorial guides, comparison articles, long-form troubleshooting,
substantial verified country/exam guides. Poor: upload/editor/download screens, thin
converters, control-dominated pages, privacy-sensitive workflows, pages under review.
Placement: no ads beside Upload/Process/Download, none styled as a tool card, none
between a field and its submit, none over results/previews, no aggressive sticky/
interstitial, low density. **[+D] Close the known gap:** `AdSenseScript` excludes
`/tools/` but NOT Hinglish `*-kaise-kare` or `/exam-resizer/*` — derive the exclusion
list from the registries (single source of truth) so tool-like pages never serve ads.

## Phase 9 — GSC-driven consolidation (AFTER remediation; data-driven)
Do NOT decide by URL pattern. Per template family, examine 90-day impressions,
clicks, query uniqueness, position, backlinks, index status, distinct intent, whether
the parent tool satisfies the same query. Classify each page: keep-and-strengthen /
keep-and-correct / keep-functional-noindex / 301-into-parent / remove. A page earning
unique traffic is NOT consolidated casually; a zero-traffic no-content duplicate can
be 301'd (equity flows to the parent — not lost). **This phase stays deferred while
index preservation is locked** — revisit only with real GSC data.

## Phase 10 — Reapplication
Pre-reqs: accuracy fixed, registry audited, overclaims removed, trust visible, major
pages sourced, weak tool pages have publisher content, links/schema fixed, Google
recrawled, no GSC indexing/manual-action issue, ad placement conservative-or-absent,
ads.txt publisher ID matches the account. Maintain a change log with deploy dates +
affected URLs. Allow ~3–6 weeks recrawl. Do NOT reapply after cosmetic changes.

## [+F] Post-deploy verification loop (run after EVERY batch)
Re-crawl the affected URLs; diff canonical + noindex + schema + H1 against the Phase 0
baseline (must be unchanged unless intended); confirm sitemap membership unchanged;
watch impressions for those URLs 2–4 weeks before the next batch. Baseline + this loop
= the safety net for impressions.

## [+G] Success metrics & "rejected again" branch
Success = AdSense approval AND impressions stable-or-up AND no manual actions AND no
ranking drops on top-50 pages. If rejected a 6th time: request specific feedback, map
it to page families via the register, fix the named pattern — do NOT just add
paragraphs and resubmit.

## Suggested order (for the return; batch-by-batch with the Phase-F check)
- Wk1: passport accuracy + Indian-page/preset audit + strongest overclaims + tool limitations.
- Wk2: registry upgrade + trust/author/source/correction pages + template verifier fields.
- Wk3–4: page-family audits (passport/visa, exam, govt-ID, photo/sig tools, PDF/OCR).
- Wk5: original examples/screenshots + differentiation + schema/canonical/redirect/sitemap validation + mobile/perf.
- Wk6: anonymous first-visit review, pick content-rich ad surfaces, wait for recrawl, reapply.
