# easyPhoto — Implementation Plan, September 2026 → March 2027

Companion to [`PRODUCT-DIAGNOSIS-2026-09-08.md`](PRODUCT-DIAGNOSIS-2026-09-08.md).
That document says *what is wrong*. This one says *what to do, in what order,
in which files, and how we will know it worked*.

**Governing rule:** the December decision gate in
[`easyphoto.in-audit/ACTION-PLAN.md`](../easyphoto.in-audit/ACTION-PLAN.md)
stands. Until then, **nothing changes the set of indexed URLs** — no new pages,
no noindex, no redirects. Everything in Phase 0 and Phase 1 respects that.

**Effort split rule:** for every hour of code, one hour of distribution
(video, Play Store, community). The diagnosis showed 670 commits against 0
links; this plan is structured so that cannot happen again — each phase has a
distribution deliverable that is *required* for the phase to be called done.

---

## Phase 0 — Instrumentation and decisions (week of 8 Sept)

Nothing else starts until the measurement exists. Three days.

### 0.1 Turn on the usage data that was built and never read
- Cloudflare dashboard → Pages project → Functions → Analytics Engine binding
  `ANALYTICS` → dataset `easyphoto_events` (steps already in `docs/ANALYTICS.md`).
- Confirm a `tool_success` row arrives via the SQL API.
- Add `scripts/usage-report.mjs`: weekly counts of `tool_view → tool_start →
  tool_success → download` per tool, per device. This is the funnel we have
  never seen. Token in `~/.config/claude-seo/`, never in the repo.
- **Why first:** Phase 1 changes conversion (homepage, exam-page opening). GSC
  cannot measure conversion; only this can.

### 0.2 Weekly baseline log
- `docs/weekly-log.md`, one row per week: `sign-image` position, non-brand
  clicks, non-brand impressions, sitemap-indexed count, Play Store installs,
  YouTube views → site clicks. Filled by `gsc_query.py` (already working) +
  0.1. Baseline row = week of 31 Aug: 7 clicks / 261 impressions / sign-image ~71.

### 0.3 Decisions the owner must make (blocking for the items marked)
| Decision | Blocks | Recommendation |
|---|---|---|
| Google Play developer account (one-time US$25, identity verification takes days) | 1.4 | Yes — start today, verification is the long pole |
| YouTube: new channel or a new playlist on an existing one | 1.5 | **New channel named easyPhoto**, Hindi, so the link/brand accrues to the product |
| Willing to spend ~30 min/week posting in exam Telegram/WhatsApp groups during windows | 1.6 | Yes — it is the only zero-cost channel that reaches aspirants this quarter |
| Hindi UI scope in Phase 2: tools only, or tools + exam pages | 2.2 | Tools + top-15 exam pages |

---

## Phase 1 — Convert what already ranks, and build distribution (Sept → Dec)

All items keep the same URLs. Ordered by expected value ÷ effort.

### 1.1 Exam pages: tool first, spec second, caveat last
**Problem measured:** pages with 68–295 impressions and 0 clicks; the SSC page's
opening paragraph tells users the number is "compatibility-only" and shows a
"Source needs review" warning above the fold.

**Files**
- `app/exam-requirements/[exam]/page.tsx` — reorder `<header>`: H1 → one-line
  answer (photo band, signature band, format) → **the resizer section
  (`#resizer`) moves up to directly under the header** → provenance line →
  `spec.description` → the rest. On mobile the tool is currently several
  screens down (the comment at line ~232 admits it).
- `lib/portalPresets.ts` — `description` fields. Write
  `scripts/audit-exam-openings.mjs` that prints the first sentence of all 52;
  rewrite every one that opens with a caveat ("compatibility-only", "not a
  current requirement", "does not use") so it opens with the answer and ends
  with the caveat. The facts do not change; the order does. The existing
  `test/specCopy.test.ts` and `test/checkerDocsMatchCode.test.tsx` guards stay
  green because no figure changes.
- `components/site/SpecificationProvenance.tsx` — `"Source needs review"` →
  `"Checked against {sourceLabel}; confirm the current notice before you submit"`.
  Same honesty, no alarm icon above the fold. `AlertTriangle` stays only when
  there is no source URL at all.

**Guard:** extend `scripts/audit-exam-openings.mjs` into
`test/examOpenings.test.ts` — fails if any description's first sentence
contains a caveat phrase. Bug-class fix, not a one-off.

**Measure:** CTR on `/exam-requirements/{cuet,pan,upsc,cat,up-police}/` in
GSC, 4 weeks after ship. Those five have impressions today and 0 clicks; any
click is signal.

**Rollback:** copy-only; revert the commit.

### 1.2 Homepage: the upload box is the hero
**Problem measured:** mobile above-the-fold today is eyebrow, H1, paragraph,
search box, seven chips, four pills. No file input. Every competitor in the
8 Sept SERP check leads with the drop zone.

**Files**
- `app/page.tsx` — replace the `ToolSearch` + chips block in the hero with
  `HeroStarter` (`components/site/HeroStarter.tsx`, already built, already used
  on `DocPhotoLanding.tsx`, already stashes the file and routes to the maker).
  Extend `HeroStarter` `kind` with `"home"`: a drop zone plus a single
  select — *"I need this for…"* listing the top 8 exams + "Just resize to KB"
  + "Sign on photo". Search moves below the fold.
- H1 stays (do not touch indexed titles), paragraph shortens to one line.
- Drop the four trust pills from the hero to one line under the drop zone.
  Privacy is a commodity (diagnosis L7); it stays visible, it stops being the
  headline.

**Measure:** `tool_start` events with `referrer = /` per session (0.1), and
homepage → tool click-through. Baseline is unknown today — that is why 0.1
ships first.

**Rollback:** single-file revert.

### 1.3 Park the dead weight in navigation (no URL changes)
**Problem measured:** ~60% of built surface earns nothing (diagnosis §4).
**Files**
- `components/site/MainNav.tsx` — `CATEGORY_CARDS`: remove the PDF card;
  replace with "Sign on Photo" (the proven cluster). Footer columns: PDF/OCR
  collapse into one "More tools" column.
- `app/page.tsx` — `POPULAR_SEARCHES`: remove "Compress PDF"; add "Photo
  resize 20 KB" and "Add signature to photo". `ToolsTabs`/`FeaturedTools`:
  reorder so Photo → Signature → Exam kits come first.
- `lib/toolsCatalog.ts` — no `ready:false` changes (that would alter routes).
- Country makers: `PopularDocs` shows US/UK/Canada/Schengen/UAE/Saudi only.
- Every parked route stays live and reachable from `/tools/`. Nothing is
  deleted; the sitemap is untouched.

### 1.4 Android app on Google Play (TWA of the existing PWA)
**Why:** Play Store search does not care about domain authority. The manifest,
icons, `display: standalone`, and `PwaInstallHint` already exist.

**Steps**
1. Play developer account (0.3).
2. `public/.well-known/assetlinks.json` — Digital Asset Links for the signing
   key (directory does not exist today). Add a `_headers` rule:
   `Content-Type: application/json`, `Cache-Control: max-age=3600`.
3. `public/site.webmanifest` — `start_url: "/?source=twa"` so 0.1 can
   attribute; add `screenshots[]` and `shortcuts[]` (Resize to 20 KB, Sign on
   photo, SSC photo) — Play and Chrome both surface shortcuts.
4. Bubblewrap (`@bubblewrap/cli`) in a separate repo `easyphoto-android`;
   never commit the keystore. Target API per current Play policy.
5. Listing copy in Hindi + English. Title candidates must be checked against
   Play's 30-char limit: *"easyPhoto: Photo Resize 20KB"*.
6. Offline: not required for TWA. Do **not** add a service worker in this
   phase — it changes caching behaviour on the web too and is its own risk.

**Measure:** installs/week, and `source=twa` sessions in 0.1.
**Rollback:** unpublish the listing; the web is unaffected.

### 1.5 YouTube: one Hindi Short per exam window and per KB target
**Why:** a YouTube video ranked #1 for "voter id photo resize" in the 8 Sept
check; aspirants search YouTube first; each video is a link and a brand
impression that the web demotion cannot touch.

**Production**
- Channel: easyPhoto (0.3). Language: Hindi with English keywords in titles.
- Format: 30–45 s screen recording on a phone, no face required. Hook →
  three taps → downloaded file shown in the portal's upload box → "link in
  description".
- Script template in `docs/video/short-template.md`; reuse the owner's
  existing script workflow. Titles follow the search phrasing: *"SSC GD photo
  20KB kaise banaye | 2027 form"*.
- **Batch 1 (Sept, matched to `lib/examCalendar.ts`):** SSC GD Constable
  (opened 1 Sept), NDA II & CDS II (13 Sept), IBPS Clerk (10 Oct). Plus the
  evergreen four: photo 20 KB, photo 50 KB, signature 20 KB, sign on photo.
- Every description: the exact tool URL with `?utm_source=youtube`, the
  official notice URL, the spec in one line.
- **Site side (no index change):** on each exam page, below the resizer, embed
  the matching Short with a lazy `lite-youtube` (CSP: allow
  `www.youtube-nocookie.com` frame-src in `public/_headers`; keep the
  Cloudflare insights origins). Field is `video?: { id: string }` on
  `PortalSpec`, rendered only when present.

**Cadence:** 2 Shorts/week through December = ~30 videos.
**Measure:** views, and `utm_source=youtube` sessions in 0.1 / Cloudflare
Web Analytics.

### 1.6 Community distribution during exam windows
- `scripts/share-cards.mjs`: for each calendar entry, generate a 1080×1080
  card (reuse the OG-image pipeline) with the exam, photo/signature spec,
  dates, and URL. Output to `artifacts/share-cards/`.
- `docs/community-calendar.md`: which Telegram/WhatsApp groups, which day
  (window open day and 3 days before close), what to post. Post as a person
  sharing a tool, with the official spec in the message — never a bare link.
- Result screen: add **"Share on WhatsApp"** next to Download in
  `ResizeKbTool` and `ExamPackageTool` (`shareFile()` in `lib/download.ts`
  exists; ExamPackageTool outputs a ZIP so share the *photo* not the ZIP).
  The shared file's name carries the brand: `easyphoto-ssc-photo-20kb.jpg`.

### 1.7 Prove the compliance checker on real photos
**Why:** it is the only asset no Indian competitor has, and today the tests
stub `detectFace` — nothing proves it measures a real head correctly.
- Build `test/fixtures/faces/`: 40–60 CC0/owner-provided photos with hand-
  measured head height, eye line, centering. Store measurements in a JSON
  manifest.
- `e2e/compliance-accuracy.spec.ts`: runs the real `FaceLandmarker` in
  Playwright against the fixtures; asserts each check's pass/fail matches the
  hand label; reports agreement %.
- Publish the number on `/how-photo-checking-works/` ("Agrees with manual
  measurement on N of M photos; fails on …"). An honest accuracy figure is a
  linkable claim — use it in 1.5 and in outreach.

### 1.8 Sign-on-photo: strengthen the one page (pages come in Phase 2)
- `/tools/sign-image/` already ranks for ~40 distinct phrasings. Add H2
  sections on the *same page* for the top three jobs ("overlap signature on
  photo", "add signature to photo for exam form", "photo to signature
  converter"), each with a two-line how-to and a jump link into the tool.
  No new URLs.

**Phase 1 done means:** 1.1–1.3 live; app listed; ≥12 Shorts published;
share cards used in ≥3 windows; accuracy number published; weekly log has
12 rows.

---

## Phase 2 — After the December gate (Dec → Mar)

The gate reads the weekly log. Two branches:

- **Sign-image has moved off ~70 →** the site-level demotion is lifting; new
  pages will be judged fairly. Ship 2.1–2.3.
- **Still ~70 →** reopen the diagnosis before adding any page. 2.1 waits; 2.2
  (locale on existing pages) can still ship because it adds no English URLs.

### 2.1 Per-KB destination pages as real tools
**Today:** `/tools/resize-kb/?target=20` — query-param, not indexable. The
per-target copy (`PHOTO_KB_USECASES`, `KbResizeLanding`) was written, then
the routes were consolidated into query URLs. Competitors run 15–23 indexable
KB pages; this is the highest-intent recurring cluster in the niche.

**Build:** static routes `/resize-photo-to-{10,20,30,50,100,200,500}kb/` and
`/resize-signature-to-{10,20,50}kb/` rendering `KbResizeLanding` with the
**drop zone first**, the tool locked to that default target, and the list of
portals that use that exact band (derived from `PORTAL_PRESETS`, so each page
lists different exams — that is the non-templated part). Query URLs keep
working (no 301s). Add to `app/sitemap.ts` with the `TOOLS_UPDATED` stamp.
Passes the charter's thin-page filter because each page has a different tool
default, different portal list, and the existing per-target prose.

**Guard:** extend `scripts/audit-content-similarity.mjs` threshold check to
the new family before merge.

### 2.2 Hindi locale on tool and top exam pages
**Not** the old Hinglish pages (thin duplicates, correctly noindexed). A real
locale switch.
- Architecture (respects `output: export`): `lib/i18n/` dictionary per tool
  (`en`, `hi`), `/hi/tools/{slug}/` routes rendering the same component with
  the `hi` dictionary, `hreflang` pairs in `lib/seo.ts`, language toggle in
  `MainNav`. No i18n library added — the site has no client-side routing need
  for one and adding a dependency needs approval.
- Scope: 10 tools (resize-kb, signature-resize, sign-image, exam-package,
  compliance-checker, white-background, photo-with-name-date,
  transparent-signature, face-centering, resume-photo) + top-15 exam pages.
- Native-speaker review before publish; machine Hindi on a trust-branded site
  is a reputational risk.

### 2.3 Signature intent pages
Split the proven cluster into distinct jobs, each its own tool preset:
`/add-signature-to-photo/` (overlay + position), `/photo-to-signature/`
(clean + crop, already `signature-cleaner`), `/signature-on-exam-form/`
(paired output). `sign-image` stays canonical for the head term.

### 2.4 Country pages — decide on gate data
Keep the six with impressions; the rest follow the `URL-RECOVERY-PLAN`
classifications. Not before the gate.

---

## Phase 3 — Retention (Q1 2027)
- Exam-window alerts with **no backend**: a public Telegram channel and a
  WhatsApp Channel fed from `lib/examCalendar.ts` via `scripts/share-cards.mjs`.
  Email needs a backend and consent flow — not worth it at this size.
- AdSense: resubmit only when non-brand clicks exceed ~100/day for four
  consecutive weeks. Below that the approval earns nothing and a third
  rejection has a cost.

---

## Testing strategy (per phase)
- **Unit:** `vitest` — new guards `test/examOpenings.test.ts`,
  `test/kbRoutes.test.ts` (Phase 2), existing spec/copy guards must stay green.
- **E2E:** `playwright` — `e2e/home-upload-routes.spec.ts` (drop a file on the
  homepage → lands on the right tool with the file loaded),
  `e2e/compliance-accuracy.spec.ts` (1.7), existing `resize-portal`,
  `signature-cluster`, `all-tools-smoke`.
- **Build gate:** full `next build` before "ready" (static export fails on
  things `tsc` passes — see `build-verify-gate` memory).
- **Live verify:** mobile + desktop screenshot of homepage and one exam page
  after each deploy; `curl -I` on every touched URL (200, no robots header).
- **Sitemap invariant:** `test/sitemap.test.ts` — count must not change in
  Phase 1.

## Risk register
| Risk | Likelihood | Mitigation |
|---|---|---|
| Homepage upload-first hurts the brand-query CTR | Low | H1/title unchanged; measure 4 weeks; single-file revert |
| Exam-opening rewrite reintroduces a false claim | Medium | Facts unchanged, only order; `specCopy` guard; audit script prints every first sentence for human review |
| Play listing rejected (policy, content rating) | Medium | Utilities category, no ads in app v1, privacy policy URL already exists |
| YouTube effort produces views but no clicks | Medium | Every video ends on the download in the portal's upload box; UTM measured weekly; stop after 12 videos if CTR < 1% |
| Phase 2 pages ship into an unrecovered site and are demoted on arrival | High if gate ignored | The gate is binding; 2.2 is the only Phase 2 item allowed on a "still ~70" reading |
| Owner reverts to code-only work | Historically high | Phase "done" definitions require the distribution deliverables |

## What is deliberately not in this plan
More blog posts · more country pages · PDF/OCR work · AI headshots · redesign
· service worker/offline · new dependencies · AdSense resubmission · buying
links · any index change before December.
