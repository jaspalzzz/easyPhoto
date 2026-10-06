# Next release — plan

Status: **planned** (written 29 Sep 2026, dated 1 Oct 2026). Follows
`CLAUDE.md`; every item goes feature branch → PR into `dev` → verified → one
release PR `dev → master`.

## Schedule

| Date | Release | Contents | SEO-visible |
|---|---|---|---|
| any day | **Hotfix** | Wrong output, wrong spec or a crash: branch from `master`, test that fails on the old code, §6 gate, PR into `master` the same day, verify on easyphoto.in, back-merge into `dev`. | only if the fix itself is |
| Thu 15 Oct | GSC review + release | Morning: 14-day review of release #57 (Google + Bing). Then the JavaScript fixes: item 4 (#60–#64), signature format/DPI (#71), KB caps safe for 1000/1024-byte portals (#75), AI tools bounded (#76) — plus the Driving Licence JPG fix (#72) as a wrong-output hotfix (CLAUDE.md §5). Split by the owner on 6 Oct: the calendar and blog-image fixes wait for the window. | /exam-requirements/driving-licence/ only |
| 6–20 Oct | Prevention (no release) | Guard rules in CLAUDE.md + tests from the 6 Oct Google-guidelines audit (item 8) — started 6 Oct at the owner's request. No page changes. | none |
| Thu 22 Oct | UI polish release | Type scale option C (#65), card hierarchy option A (#66), FAQ/footer (#68), sign-image compact (#69), ToolCard (#70); the UPI support card (#79) is built but stays off until a merchant UPI account exists (on hold 6 Oct), both owner-approved from live-page mockups; any further approved polish (FAQ rows, footer) that is merged and verified by 20 Oct. Presentation only — SEO diff must show 0 pages changed. Ships alone so Search Console sees it separately from 15 Oct (fixes) and 29 Oct (content). | none |
| Thu 29 Oct | Content release | Items 1, 2 (incl. #74 past-entry hiding), 3 (first ≤ 3 pages) and 6, plus #73 (broken blog images removed). Item 9 starts here. | ~6 pages |
| Thu 12 Nov | Content release | Item 3, next ≤ 3 pages — only if the first batch held for 14 days. | ≤ 3 pages |

**29 Oct holds only if** Google marks the September 2026 spam update complete by
15 Oct (CLAUDE.md §2: 14 days after it ends) **and** the 15 Oct review of #57
shows no damage. Otherwise it moves to the update's end date + 14 days.

Release #57 (1 Oct) shipped SEO-visible changes during the rollout by the
owner's explicit override — recorded in `docs/weekly-log.md`.

**Earliest production date:** 14 days after Google marks the *September 2026 spam
update* complete (started 24 Sep; still rolling out on 29 Sep —
status.search.google.com). Items 1–3 change page text, so they wait for that
window (CLAUDE.md §2). Item 4 is JavaScript only and could ship earlier as a
hotfix if a user-facing bug is severe.

## 1. Print-sheet fix — held from release #50

- Commit `b877a16` is already on `dev`: photos print at exact millimetre sizes,
  35×45 mm / 2×2 in / fill-the-grid choice, 300 DPI JPG, corrected FAQ.
- SEO-visible: `/tools/print-sheet/` FAQ text. Ready — nothing to build.

## 2. Exam calendar refresh — `/exam-calendar/` (one page, already indexed)

Found on 29 Sep: 4 of 8 entries are in the past (SSC CHSL Tier 1 Jul–Sep,
IBPS PO prelims 22–23 Aug, UPSC NDA II and CDS II 13 Sep) and entries were last
verified in June–July. A stale calendar costs trust.

- Re-verify every upcoming entry against the official notice or annual calendar:
  IBPS Clerk prelims (10–11 Oct), IBPS RRB Officer Scale I (21–22 Nov),
  IBPS RRB Clerk (6, 12–13 Dec), SSC GD Constable 2027 notification.
- Move past events out of "upcoming"; bump `verifiedOn` only for entries
  actually re-checked.
- Add major Oct–Dec events **only** where an official calendar or notice gives
  the date (candidates to check: UPSC's 2027 calendar, SSC's 2026–27 calendar,
  RRB notices, CTET). No official source → no entry.
- Each entry links to its existing `/exam-requirements/<exam>/` page and tool.
  No new URLs.
- Test: calendar entries all carry a source URL and `verifiedOn`; none shown as
  upcoming after its date.

## 3. "This cycle" box on existing exam pages (staged)

A short box at the top of an `/exam-requirements/<exam>/` page: the current
application window, a link to the official notification, the photo and signature
rules from **that** notice, and the date we checked. Built from `examCalendar`
and `portalPresets` data — no hand-written copy per page.

- SEO-visible → **at most 3 pages per release**, then 14 days of GSC before the
  next batch (CLAUDE.md §2).
- First batch: exams whose window is open or opens next and that already have
  impressions (from the Oct–Dec calendar in item 2). Not `/exam-requirements/voter-id/`
  (the top page) until the pattern has proven itself elsewhere.
- Test: the box renders only with a current, sourced window; hidden when the
  window has passed.

## 4. Follow-ups from the 29 Sep review (JavaScript only, not SEO-visible)

- Compliance checker: a slow earlier check can overwrite a newer re-check; the
  exam dropdown re-checks a signature for exams without a signature field.
- Restricted (owner-locked) fillable PDFs dead-end: Form Fill sends them to
  Unlock PDF, which flattens away the fields.
- Exam Kit "Add name & date" re-compresses an already-compressed photo.
- Form-fill dropdowns aren't linked to their labels (screen readers).
- Optional: give sign-image the attached-strokes trim the other signature tools
  now use, so it also ignores dust specks.

## 5. Off-site — no pages, not part of the release

Timed to the windows in item 2: a reel per exam (IBPS Clerk, IBPS RRB, SSC GD)
using `reels/`, and share cards for Telegram/WhatsApp exam groups, each linking
to the exam page.

## 6. `/tools/resize-kb/` title/description experiment (one page)

Evidence (Bing Webmaster + GSC, 1 Oct): on Bing the page earned 637 clicks from
28,938 impressions since 14 Sep at position ~8 — "photo resizer in kb" alone
11,811 impressions, plus "image resizer in kb" 1,715 and "resize image in kb"
2,067. On Google the whole page had 150 impressions and 5 clicks in the week
from 25 Sep, and "photo resizer in kb" does not appear at all. It is the largest
gap between the engines and the largest single demand we serve.

- First, diagnose: compare our title, H1, first screen and internal links with
  the pages Google ranks for "photo resizer in kb" / "resize image in kb".
  Write up the finding before changing anything.
- Then **one variable**: the `<title>` and meta description of
  `/tools/resize-kb/` only. No H1, body or URL change in the same release.
  Copy reviewed by the owner (CLAUDE.md §3).
- Baseline to beat (record again on 28 Oct): Google — page impressions/week,
  position for the three queries above; Bing — CTR at position ~9 on
  "photo resizer in kb" (0.5%).
- Judge after 14 days on both engines; revert if clicks fall on either.

## 7. `/exam-requirements/voter-id/` — drop the "under 2048 KB" claim (one-page experiment)

Found in the 6 Oct sweep: ECI publishes no upload KB cap for Form 6 (CLAUDE.md
§3: "we claim none"), yet the page states "under 2048 KB" in five places — meta
description, the photo-requirement row, the tool label and two FAQ items (also
in FAQPage JSON-LD), e.g. "How do I resize my photo to under 2048 KB for Voter
ID?". It is the #2 Google page and gets "voter id photo size in kb" queries, so
the owner deferred it (6 Oct) to a measured change after the update window.

- Mark the 2 MB as a compatibility target in data (not a published cap) and
  render "No published limit" where the page states a requirement; keep the
  tool's working target.
- One page, one change; note the GSC baseline (page + "in kb" queries) the day
  before; judge after 14 days.

## 8. Prevention: guard rules and tests (after 15 Oct, before monetisation)

From the 6 Oct audit of the site against Google's current guidelines (Search
Essentials, spam policies, helpful-content and gen-AI guidance). The site breaks
no policy; the risk is quality: unpublished numbers shown as "the size",
templated exam pages (the same FAQ questions, name swapped, on 16–20 of 23 exam
pages) and internal jargon ("stored" ×241 on exam pages). Owner decision (6 Oct):
add the guards right after the 15 Oct release, before monetisation.

- CLAUDE.md additions: unpublished numbers are never "the size"; write for
  applicants (no internal vocabulary); no shared FAQ templates; static demos are
  labelled "Example"; AI-drafted text gets an owner read-aloud pass; template
  families have a similarity ceiling; visible dates, dateModified and lastmod
  agree; every PR answers a spam-policy checklist.
- Tests on the built HTML (no new dependencies): template similarity ratchet,
  FAQ-template ratchet, unpublished-spec claims, structured data matches visible
  text, date consistency, no history manipulation / UA sniffing, "Example" label
  on the homepage demo, jargon list in boundedClaims.
- Ratchets start at today's values and only move down; no page text changes.

## 9. Exam-page honesty and de-templating (after the window, ≤ 3 pages per release)

The 8 needs-review exam pages stop presenting unpublished numbers as the
requirement, the name-swapped FAQ is replaced by exam-specific Q&As, and
jargon/repeats go. Order: clat, up-police, tgpsc → passport-seva,
army-agniveer, rrb → ssc and voter-id (each its own 14-day experiment; Voter ID
is item 7). Owner reviews every rewritten page.

## Not doing

- **A new blog post per exam.** Breaks CLAUDE.md §1 (index frozen) and risks
  Google's scaled-content policy right after a demotion; blog posts earned 78
  clicks from 38 posts before the drop; exam-detail queries are held by official
  portals and large exam sites. Revisit only if GSC shows real demand for an
  exam we don't cover at all — then one researched page, with owner approval.

## Release checklist

The CLAUDE.md §6 gate on every PR; on the release PR: SEO diff vs production
lists exactly the pages from items 1–3 and 6, side-by-side on top traffic pages, smoke
test on easyphoto.in after deploy, a row in the Releases table of
`docs/weekly-log.md` with its GSC check date.
