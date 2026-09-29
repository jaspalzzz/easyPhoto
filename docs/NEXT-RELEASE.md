# Next release — plan

Status: **planned** (written 29 Sep 2026). Follows `CLAUDE.md`; every item goes
feature branch → PR into `dev` → verified → one release PR `dev → master`.

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

## Not doing

- **A new blog post per exam.** Breaks CLAUDE.md §1 (index frozen) and risks
  Google's scaled-content policy right after a demotion; blog posts earned 78
  clicks from 38 posts before the drop; exam-detail queries are held by official
  portals and large exam sites. Revisit only if GSC shows real demand for an
  exam we don't cover at all — then one researched page, with owner approval.

## Release checklist

The CLAUDE.md §6 gate on every PR; on the release PR: SEO diff vs production
lists exactly the pages from items 1–3, side-by-side on top traffic pages, smoke
test on easyphoto.in after deploy, a row in the Releases table of
`docs/weekly-log.md` with its GSC check date.
