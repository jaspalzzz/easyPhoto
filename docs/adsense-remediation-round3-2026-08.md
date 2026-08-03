# AdSense remediation round 3 — change record for review

**Context:** easyphoto.in was rejected twice for "Low value content" (most recent
2026-07-30). This is everything changed in response. All on `master`, all
deployed.

**Range:** `c50d1f7~1..4e8d2c0` — 14 commits, 49 files, +900/−770.
**Sitemap:** 207 → **194**. **123** redirect rules. Aggregator-sourced country
specs: 14 → **12**.

**Gate on every commit:** `npm run verify` (check:specs → tsc → vitest → build →
thin-content audit → TF-IDF similarity audit → adsense-export guard).
Final: **493 tests pass**, 0 dead internal links, 0 retired-URL links on indexed
pages, 0 FAQPage without visible Q&A, ad boundary unchanged.

**This round incorporates a prior Codex audit.** Items it raised are marked
**[C]**. Two of its findings were errors we had introduced ourselves.

---

## 1. Factual corrections (highest severity — these could cost a user their application)

| # | Page | What was wrong | Now |
|---|---|---|---|
| 1 | `/ireland-visa-photo-maker/` **[C]** | Built on the DFA **passport** guidelines, so it described one digital upload. An Irish visa needs **two printed photographs** on photographic paper, 35×45mm–38×50mm, with the applicant's name and transaction number in block letters **on the back**. A reader following it would have had the application returned. | Visa-specific content added (3 sections, 4 FAQs); source repointed from the passport service to Immigration Service Delivery |
| 2 | `/uk-passport-photo-maker/` **[C]** | **Our own error, introduced in `39d7c51`.** We wrote that one photo serves the UK passport and the UK visa. UKVI requires the visa photo **not** be the one already in the passport — same spec, different image | Corrected; adds the digital band the guidance describes (JPG, ≥600×750, 50KB–6MB) |
| 3 | `/australia-passport-photo-maker/` **[C]** | **Also ours.** Claimed visitor, student, work and partner visas all use the passport's 35×45mm upload. No published rule covers those subclasses alike; several collect biometrics at a centre instead | Now states that visas are a separate Home Affairs process and declines to invent a universal spec |
| 4 | `/canada-visa-photo-maker/` **[C]** | Extended the 35×45mm temporary-resident spec to PR, Express Entry and passport renewal — separate processes | Scoped to visitor/study/work; the others named as things to check |
| 5 | `why-exam-photo-signature-rejected` | Title said "7 Reasons"; body listed **six** | "6 Reasons" |
| 6 | `rrb` preset | Cited CEN 03/2025 on `www.rrbcdg.gov.in` — fails TLS (cert doesn't cover the www host) **and 404s with verification disabled**, i.e. removed | Repointed to the central application portal; description no longer says "the current notice specifies" figures nobody can open |

## 2. Unsourced claims about named third parties

| Page | Claim | Resolution |
|---|---|---|
| `cutout-pro-alternative-india` | Alleged a **data breach** citing Cybernews, Trustpilot and BreachForums with **zero links**; quoted exact rupee prices from unlinkable sources | Both Cybernews reports located and linked, framed as what those reports state. Prices replaced with a link to Cutout.pro's own pricing page |
| `how-to-remove-background-from-photo-free` **[C]** | Alleged a named competitor "keeps a copy for model training" — in **three** places (body, comparison table, chart `<desc>`) | All three removed. The privacy argument stands on the fact that the image is sent to a server at all |
| `/[maker]/` metadata **[C]** | Generated `Exact {country} photo requirements` for **all** country records, including the 14 sourced from aggregators rather than the issuing authority | "Exact" now only where `verified === "gov"`; the rest describe what is recorded and say to confirm it |

## 3. Duplicate and near-duplicate pages removed

| Commit | Change | Pages | Traffic cost |
|---|---|---|---|
| `7c3e38b` | Retired `/tools/form-resizer/*` (52) + `/exam-resizer/*` (22) via 301 — previously `noindex` but live and crawlable | 74 | 0 (already noindexed) |
| `39d7c51` | Merged 4 country twin pairs (0.90–0.91 raw similarity) | 4 | 3 clicks / 90 days |
| `9eea86e` | 9 `/convert/{pair}/` pages → one format guide | 9 | 0 clicks, 87 impressions |
| `c50d1f7` | `indian-passport-photo-size-rules` (566w, **0 impressions**) merged into `indian-passport-photo-requirements` | 1 | 0 |

**Merge directions were chosen on evidence, not symmetry.** US/UK/Australia each
publish one photo size serving both applications, and the passport page survived
because the rest of the site linked to it (9, 8, 4 inbound vs 1, 0, 0). Canada
went the other way: its booklet photo is 50×70mm and requires a commercial
photographer's certification (the registry carries an explicit warning), so the
passport page could only ever emit the visa image under a passport title.

**Content was migrated, not deleted.** Surviving US/UK/AU pages gained the DS-160
limits and DV Lottery note, the UKVI rules, and the Australian guarantor
distinction; they are now 1,031–1,159 words. `/convert/` grew 321 → 719 words.

## 4. Structured data

- Two posts emitted **FAQPage schema with no FAQ visible** (`image-to-text-online-free-ocr`, `indian-passport-photo-requirements`) **[C]**. Both now render the questions. Verified site-wide: **0 pages** with FAQPage and no visible Q&A.
- A third such page (`indian-passport-photo-size-rules`) was removed in `c50d1f7`.
- No FAQPage was added anywhere.

## 5. Original content made discoverable

- **The homepage linked to zero of the 38 guides.** Added a "Guides to the rules" section showing the 6 most recent by publication date (`8d4dc53`).
- All **52** exam pages now link to a relevant guide, up from 4 — 60 links from ad-excluded pages into ad-eligible ones. New `lib/examGuides.ts` + guard `test/examGuides.test.ts` (`5f44374`).
- Fixed `relatedPosts()`: it sliced clusters without rotating, so every post in a cluster recommended the same first two. Distinct targets 19 → 38; posts with zero inbound 20 → 0 (`ea77c2f`).

## 6. Crawl hygiene and consistency

- Retired-URL links on indexed pages: **21 → 0**. The nav (`lib/toolMenu.ts`) pointed at retired routes, putting a redirect on every page (`22b79cf`).
- **`/exam-calendar/ics` was a live 404** — `trailingSlash: true` rewrites `next/link` hrefs but the route handler emits no trailing slash (`22b79cf`).
- Two buttons said "View all 34 tools" while the homepage said "45+"; catalog has 45. Both now read `READY_TOOLS.length` (`2e4ee0c`).
- Spain and Portugal cited consular pages returning **hard 404s**. Both are Schengen states, so the 35×45mm figure comes from the **EU Visa Code** (EUR-Lex, resolves 200) — which also makes them government-sourced rather than aggregator-backed (`a858ea7`).
- Sitemap `lastmod`: 151 pages refreshed. Exam pages now take the **later** of `verifiedOn` and a template-updated date, so a stale spec cannot hide a template change and a template change cannot claim the spec is fresher than it is (`fd32068`).
- 4 posts displayed a July "Last reviewed" date while schema said June — added `updatedISO` (`ea77c2f`).

## 7. Hub differentiation **[C]**

`/exam-requirements/` and `/exam-photo-size/` opened with nearly the same
sentence despite being built differently (52 cards vs comparison tables). Each
now states its own job and cross-references the other. The size page also
claimed "30+" while listing 52; that count now comes from the registry.

**TF-IDF similarity** (project's own `audit-content-similarity.mjs`):

| Pair | Before | After |
|---|---|---|
| `/exam-requirements/` ↔ `/tools/exam-package/` | 0.7506 | **0.6915** |
| `/exam-requirements/` ↔ `/exam-photo-size/` | 0.6678 | **0.6213** |

Every indexed pair is now **below 0.70** except NDA/CDS at 0.7298.

---

## Deliberately NOT done — please challenge these

1. **NDA/CDS (0.73) and UGC-NET/CSIR-NET (0.68) left separate.** Their specs are
   identical because each pair shares one portal (UPSC OTR, NTA). Both already
   carry custom sections and ~900 words; the residual is shared template
   furniture. Merging is semantically wrong — a candidate searching "NDA photo
   size" should not land on CDS. A prior Codex audit agreed; confirming that.
2. **17 presets remain `needs-review`**, each with a documented source and a
   current-instructions disclosure enforced by `check:specs`. Clearing them needs
   official notices, several CAPTCHA-gated.
3. **The 52-page exam-requirements family stays template-generated.** Average 773
   visible words, cited specs, uncertainty labels, embedded tool, ad-excluded,
   289 clicks/90d. A prior audit judged this acceptable; confirming that too.

## Known unverified — needs a human

- **Three country source URLs return no connection at all** from this network
  (browser UA, 45s timeout): `canada.ca` passport photos, `passports.gov.au`,
  `npra.gov.bh`. That is not the same as a 404, so they were deliberately left
  alone — unlike the RRB PDF, which 404'd with cert-checking disabled and was
  provably removed. **Please open all three.**
- `irishimmigration.ie` and `dfa.ie` return 403 to automated fetching. The Irish
  visa rules above came from a search index, not a direct read.

## Mistakes made and caught during this work

- A bulk find-and-replace silently rewrote `lib/adExclusions.ts`
  (`/exam-resizer/` → `/exam-requirements/` in `EXCLUDED_PREFIXES`), which would
  have changed where ads may appear, and rewrote `path:` canonicals on 18 retired
  pages. Both reverted; the guard test confirms the boundary is intact.
- `check:specs` blocked an RRB rewrite that dropped the required
  "confirm the current instructions" phrasing. Fixed before push.
- A commit was made before reading a failing `verify` result; amended so the
  broken state never entered history.
- Similarity was briefly measured with raw cosine and compared against a TF-IDF
  baseline — the wrong instrument. The numbers in section 7 are from the
  project's own TF-IDF audit.
