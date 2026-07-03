# Editorial Calendar: July 2026 — Revision 2 (Jul 3)

**Site:** easyphoto.in (blog: 35 published posts)
**Cadence assumption:** 2 posts/week (8 actions/month).
**What changed since Rev 1 (Jul 2):** full 3-month GSC data analyzed (645 queries, 72 clicks,
2.97K impressions, impressions growing 7.5× half-over-half since Jun 7); the AdSense low-value
cleanup fully shipped (all 52 exam pages + 14 KB pages de-boilerplated); snippet fixes for the
two worst zero-click pages (driving-licence, army-agniveer) went live; the DPI post gained a
PDF-DPI FAQ; sign-image got its first contextual internal link. Priorities below are re-ranked
against the 3-month numbers, not the 28-day sample Rev 1 used.

---

## Shipped since Rev 1 (no longer scheduled — done)

- ✅ Snippet fixes: `/exam-requirements/driving-licence/` (190 impr / 1 click) and
  `/exam-requirements/army-agniveer/` (110 impr / 0 clicks) — titles/descriptions now fit SERP
  budgets; a scheduled GSC check on **Jul 14** reports whether CTR responds.
- ✅ `what-is-dpi-and-how-to-change-it` gained a PDF-DPI FAQ targeting the live
  "pdf dpi should be 200 means" query cluster (49 DPI queries, 62 impr, 0 clicks).
- ✅ `/tools/sign-image/` first contextual internal link (from the sign-forms post).

**Follow-up housekeeping from those changes:** the DPI post and sign-forms post changed on
Jul 3 but their `updatedISO` in `lib/blog.ts` wasn't bumped — set both to `2026-07-03` so the
BlogPosting `dateModified` reflects the real freshness (same class of gap the content audit
flagged on the signature post).

---

## Content Decay Report (3-month GSC traffic × age)

| Post | Last Updated | Days Stale | 3-mo GSC | Priority | Why |
|---|---|---|---|---|---|
| `ibps-po-2026-photo-signature-checklist` | 2026-06-13 | 20 | 4 impr | **Critical — OVERDUE (was scheduled Jul 2)** | IBPS PO application window is live **now, closes 21 Jul** (6,715 vacancies). Post still hedges on dates instead of stating the confirmed 1–21 Jul window. Hard deadline. |
| `exam-photo-signature-size-guide` | 2026-06-21 | 12 | **184 impr** (top blog page) | High | Pillar of the Exam-Photo cluster; pos 9.8 with 1 click — a refresh + snippet tune-up compounds the strongest asset. Add RRB explicitly (no RRB spoke exists). |
| `ssc-cgl-chsl-photo-signature-guide-2026` | 2026-06-18 | 15 | 107 impr, pos 9.8 | Medium (demoted from Rev 1) | The SSC correction window closed Jul 3 — the time-sensitive hook expired. Still worth a freshness pass this month for its traffic. |
| `passport-photo-background-color` | 2026-06-02 | 31 | 8 impr | Medium | Oldest post site-wide, now past the 30-day mark. Light refresh. |
| `why-exam-photo-signature-rejected` | 2026-06-13 | 20 | 31 impr, pos 8.7, 0 clicks | Medium (new — surfaced by 3-mo data) | Near page 1 with zero clicks; check its snippet the same way the exam pages were fixed. |

---

## Topic Cluster Progress

| Cluster | Pillar | Coverage | Priority |
|---|---|---|---|
| **Exam Photo & Signature** | `exam-photo-signature-size-guide` | ~75% | Complete: RRB spoke is the one real gap |
| **Passport Photo** | `indian-passport-photo-requirements` | ~80% | Maintenance only |
| **Government ID Photos** (PAN/Voter ID/DL) | **None — the gap** | ~30% (3 spokes live) | **Build the pillar this month.** 3-mo data strengthens the case: voter-id pages pulled 336 impr/23 clicks combined (best CTR on the site), driving-licence 190 impr, PAN 44 impr — real demand, no hub. |
| **PDF & Document Tools** | None | ~20% | Hold (max-3-active rule) |

New signal worth a spoke (not a cluster): **`/tools/sign-image/`** is the site's highest
non-brand demand page (199 impr, pos 16.1, 17 query variants) with zero supporting content.
One supporting how-to post + internal links is the standard play to push a page-2 tool page
onto page 1.

---

## Monthly Calendar (remainder of July)

### Week 1 (now – Jul 8)

| Day | Type | Title | Template | Cluster | Target Keyword | Status |
|---|---|---|---|---|---|---|
| **Fri Jul 3 (today)** | **Refresh — overdue** | `ibps-po-2026-photo-signature-checklist`: state the confirmed 1–21 Jul window + verify prelims date | - | Exam Photo | ibps po 2026 photo size | **Do first** |
| Mon Jul 6 | New | Indian Government ID Photo Requirements: PAN, Voter ID, Driving Licence & Aadhaar (2026) | pillar-page | Gov ID (pillar) | indian government id photo size | Brief |

### Week 2 (Jul 9 – Jul 15)

| Day | Type | Title | Template | Cluster | Target Keyword | Status |
|---|---|---|---|---|---|---|
| Mon Jul 13 | New | How to Add a Signature to a Photo or Image Online (Free) | how-to-guide | Tools support (sign-image) | sign on image / add sign in photo | Brief |
| Tue Jul 14 | — | **Scheduled GSC check fires** — driving-licence & army-agniveer CTR verdict; fold findings into Week 3 | - | - | - | Automated |
| Thu Jul 16 | Refresh | `exam-photo-signature-size-guide` (top blog page, 184 impr) — freshness + snippet check + name RRB explicitly | - | Exam Photo | exam photo signature size | Refresh |

### Week 3 (Jul 16 – Jul 22)

| Day | Type | Title | Template | Cluster | Target Keyword | Status |
|---|---|---|---|---|---|---|
| Mon Jul 20 | New | RRB Photo & Signature Size 2026: NTPC, Group D, ALP — Full Guide | how-to-guide | Exam Photo (last gap) | rrb photo signature size | Brief |
| Thu Jul 23 | New | Aadhaar Card Photo: Size, Background & How to Update It Online | how-to-guide | Gov ID | aadhaar photo size | Brief |

### Week 4 (Jul 23 – Jul 31)

| Day | Type | Title | Template | Cluster | Target Keyword | Status |
|---|---|---|---|---|---|---|
| Mon Jul 27 | New | PAN Card vs Voter ID vs Driving Licence Photo: What's Actually Different? | comparison | Gov ID | pan vs voter id photo size | Brief |
| Thu Jul 30 | Refresh ×2 (light) | `ssc-cgl-chsl-photo-signature-guide-2026` + `passport-photo-background-color` | - | Exam / Passport | - | Refresh |

Dropped from Rev 1: the "Ration Card Photo Requirements by State" post (no spec data in the
registry to ground it — would violate the verified-facts-only bar that everything else this
month is built on) and the Week 4 repurposed-graphic item (capacity given the two added
refreshes). Sign-image support post added in their place — it has the strongest data case
of anything on this calendar.

## Content Mix This Month
5 new / 4 refreshes (1 overdue-urgent) / 0 repurposed — 9 actions. The mix runs
refresh-heavier than the 60/30/10 default because the 3-month data shows existing pages
sitting at positions 7–10 with zero clicks; converting those is cheaper than new content.

## Freshness Update Queue

| Post | Next Refresh | Priority | Reason |
|---|---|---|---|
| `ibps-po-2026-photo-signature-checklist` | **Jul 3 (today)** | Critical | Window closes Jul 21 |
| `exam-photo-signature-size-guide` | Jul 16 | High | Top blog page, 30-day cycle |
| `why-exam-photo-signature-rejected` | Jul 16 (piggyback) | Medium | 31 impr / 0 clicks at pos 8.7 — snippet check |
| `ssc-cgl-chsl-photo-signature-guide-2026` | Jul 30 | Medium | Hook expired; traffic still merits refresh |
| `passport-photo-background-color` | Jul 30 | Medium | Oldest post (31 days) |

## Distribution Schedule

| Post | Publish | LinkedIn | Reddit | Email | YouTube |
|---|---|---|---|---|---|
| IBPS PO refresh | Jul 3 | Same day (window closing) | +2d, r/IBPS | Next batch | - |
| Gov ID pillar | Jul 6 | Same day | +3d, r/IndianGovernmentJobs | Next batch | Yes (pillar) |
| Sign-image how-to | Jul 13 | Same day | +2d, value-first | Next batch | - |
| RRB guide | Jul 20 | Same day | +2d, r/RRB r/IndianRailways | Next batch | - |
| Aadhaar guide | Jul 23 | Same day | +2d, careful value-first | Next batch | - |
| PAN vs Voter ID vs DL | Jul 27 | Same day | +3d, r/IndianGovernmentJobs | Next batch | - |

## Seasonal Hooks (verified)

- **IBPS PO window: 1–21 July** — live now, hard deadline, drives today's refresh.
- **IBPS Clerk notification: expected August** — hold a slot in the August calendar.
- **SSC CGL Tier 1: Aug–Sep** — exam-day-adjacent content is a stretch goal, not core.
- ~~SSC CGL correction window (1–3 Jul)~~ — expired today; hook removed.

---

## Next Steps

1. **Today:** IBPS PO refresh (`/blog rewrite`), plus the two `updatedISO` bumps in `lib/blog.ts`.
2. `/blog brief indian-government-id-photo-requirements` for the pillar.
3. **Jul 14:** read the scheduled GSC check's verdict; if driving-licence CTR is still flat
   after re-crawl, the Week 3 slot flexes to an intent-level rework of that page's title.
4. Re-run `/blog calendar` early August (IBPS Clerk notification + first AdSense verdict
   should both have landed by then).
