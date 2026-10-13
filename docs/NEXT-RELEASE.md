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
| Thu 22 Oct, **after 13:30 IST** | UI polish release | Type scale option C (#65), card hierarchy option A (#66), FAQ/footer (#68), sign-image compact (#69), ToolCard (#70); the support pop-up (#79, #83, #85, #86 — one "Help keep it free" button, any amount: UPI app on Android, QR on computers, razorpay.me on iPhone, plus a card under Download; on dev and owner-tested on Android and iPhone 7 Oct; the owner adds the three Production variables before release, see the 15 Oct runbook), all owner-approved from live-page mockups; any further approved polish (FAQ rows, footer) that is merged and verified by 20 Oct; plus three small page-text fixes: /terms/ refund rule (#88), /privacy/ ad-cookie disclosure and tips (#90), /tools/ "Coming soon" cards removed (#90); plus two UPSC fixes: the dead UPSC instruction-PDF link repointed to UPSC's current PDF (#97, on /exam-requirements/upsc/ and the UPSC CSE blog) and the signature tool fitting UPSC/NDA/CDS signatures to UPSC's 350–500 px per side (#99, JavaScript only; it used to export e.g. 384 × 534, which the form refuses). Released in the afternoon because the quiet window after the September spam update ends 22 Oct 01:00 PT = 13:30 IST (owner decision 10 Oct). Ships alone so Search Console sees it separately from 15 Oct (fixes) and 29 Oct (content). | /terms/, /privacy/, /tools/, /exam-requirements/upsc/ and the UPSC CSE blog (link only) |
| Thu 29 Oct | Content release | Items 1, 2 (incl. #74 past-entry hiding), 3 (first ≤ 3 pages) and 6, plus #73 (broken blog images removed). Item 9 starts here with the SSC page rewrite (#92, owner-approved 8 Oct; also changes the SSC row on /exam-photo-size/ and card on /exam-requirements/) and the UPSC page rewrite (#98, owner-approved 10 Oct, stacked on #92 — retarget to dev once #92 merges). Confirmed: the spam update ended before 15 Oct. | ~9 pages |
| Thu 12 Nov | Content release | Item 3, next ≤ 3 pages — only if the first batch held for 14 days. | ≤ 3 pages |

**Spam update finished.** Google marked the September 2026 spam update complete:
it ran 2026-09-24 09:15 → **2026-10-08 01:00 US/Pacific** (status.search.google.com,
checked 10 Oct). The 14-day quiet window (CLAUDE.md §2) ends **22 Oct 01:00 PT =
13:30 IST** — hence the 22 Oct release goes out in the afternoon. 29 Oct is
confirmed, subject only to the 15 Oct review of #57 showing no damage.

Release #57 (1 Oct) shipped SEO-visible changes during the rollout by the
owner's explicit override — recorded in `docs/weekly-log.md`.

**Earliest production date for page-text changes:** 22 Oct 13:30 IST, 14 days
after the September 2026 spam update completed (8 Oct). Items 1–3 change page
text, so they ship on 29 Oct (CLAUDE.md §2). Item 4 is JavaScript only and could ship earlier as a
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

## 10. Money: tips first, then traffic (owner decision 7 Oct)

- **Tips** go live with 22 Oct. Measure two weeks: pop-up views
  (`support_view`) and taps (`support_tap`, by route) against payments in the
  Razorpay dashboard (QR Codes for Android/desktop, Payments for razorpay.me).
- **Testbook affiliate on the site — parked.** Search Console 25 Sep–6 Oct:
  exam-intent visitors are mostly on `/exam-requirements/ssc/` (9.6 clicks/day,
  99% exam queries), `/upsc/` (4.0) and `/rrb/` (2.9). A Testbook Pass is ₹775 a
  year, so 5–10% is ₹40–₹78 a sale: roughly ₹50–₹200 a month at today's
  traffic — not worth a Google risk. Ready to build when traffic is 3–5×:
  one client-rendered "Sponsored" box after the tool on SSC/UPSC/RRB and the
  SSC guide, `rel="sponsored"`, disclosure line, never in a pop-up, switch-off
  variable. Compare EarnKaro with Testbook's own referral (10% to UPI, buyer
  gets up to 12% off, first purchase only) at that point.
- **The lever is traffic.** After the 15 Oct release: pages ranking 4–10 in
  Search Console first (CLAUDE.md §8). Off-site (item 5): exam-photo Shorts;
  once the channel has steady views, approach exam-prep brands (Testbook
  sponsors 300+ YouTube creators) for paid sponsorships.

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
