# Editorial Calendar — Sept–Nov 2026

**Written:** 2026-08-22 · **Covers:** September–November, ending at the December
decision gate in [`easyphoto.in-audit/ACTION-PLAN.md`](../easyphoto.in-audit/ACTION-PLAN.md)

## The strategy in one paragraph

The blog is the only section Google did **not** demote on 25 July — its pages
hold 76% unique content against 36–44% on exam and maker pages, and they still
rank page-one while `/tools/` sits at position 70–80. So the blog is the only
working distribution channel the site currently has. But the answer is **not to
publish more**: 38 posts already draw 5,719 impressions at a **1.4% CTR**, and
adding content volume has already been measured and disproved as a lever for
this site. The plan below spends roughly **70% of effort on the impressions
already being earned and thrown away**, and only ~30% on new work.

## Cadence: 2 new posts per month (deliberately low)

Not a capacity limit — a strategic one. Evidence:

- Content volume was tested against the demotion and moved nothing (~204 words/page changed the below-target count by 2).
- Bing Webmaster reports **0 inbound links** for the domain. Authority, not post count, is the binding constraint.
- Publication frequency is not a ranking signal.

**Content mix, inverted from the usual template:**

| Work type | Share | Why |
|---|---|---|
| CTR / intent repair on existing posts | 50% | 5,719 impressions already earned at 1.4% |
| New posts | 30% | 2/month, only where there is a live window or a lost-tool query |
| Link-earning original research | 20% | The only lever that touches the actual constraint |

## Priority 1 — CTR repair (start here, ships before any new post)

These already rank. They are not being clicked. Ranked by impressions wasted:

| Post | Pos | Impr | CTR | Diagnosis |
|---|---|---|---|---|
| 5 Free Exam Photo & Signature Resizers Compared | **6.1** | 294 | **0.0%** | **Worst case.** Ranks top-10 and earns nothing. It answers "which tool?" for searchers asking "what size?" — a page-type mismatch, not a ranking problem. |
| Exam Photo Rejected? 6 Reasons SSC, IBPS & UPSC Say No | 9.6 | 409 | 0.5% | Title sells a diagnosis; query wants a spec |
| Indian Passport Photo Rules 2026: Adults vs Children Under 4 | 10.5 | 393 | 0.5% | Position explains much of this; test title before rewriting |
| Exam Photo & Signature Size 2026: SSC, UPSC, IBPS, RRB | 8.5 | 340 | 0.3% | Broadest-intent page, weakest conversion |
| PAN Card Photo Size: Exact Dimensions, KB Limit & Signature Spec | 9.6 | 318 | 1.6% | Closest to the working pattern |
| Why Passport Photos Get Rejected | 7.7 | 237 | 0.4% | Same diagnosis-vs-spec mismatch |
| Resume Photo: Size, Background & Rules | 8.2 | 234 | 0.9% | — |
| Passport Photo Background Color: White, Grey or Cream? | 9.4 | 231 | 0.4% | — |

**The control that proves it is fixable:** *Voter ID Photo Size & Requirements
2026 — NVSP Upload Spec* earns **3.8% CTR at position 6.9** — 42 of the blog's
78 clicks from a single post. It names the portal (NVSP), leads with "Photo
Size & Requirements", and promises the spec the searcher typed. Every post
above departs from that pattern in the same direction.

**Honest caveat:** positions 9–10 earn low CTR normally, so title rewriting will
not fix all of these. The one with no ambiguity is the resizer comparison at
position 6.1 with zero clicks. Start there and measure before doing the rest.

**Method:** rewrite title and meta description only. No body rewrites, no date
changes. Measure at 4 weeks against the pre-change CTR before touching more.

## Priority 2 — New posts (2/month, 6 total)

### September — the only live application window

| Week | Post | Template | Cluster | Target query | Why now |
|---|---|---|---|---|---|
| W1 | **SSC GD Constable 2027: Photo & Signature Spec Before You Apply** | how-to-guide | Exam applications | ssc gd constable photo size | Notification expected September 2026 — **recorded as `tentative`** in `lib/examCalendar.ts`, not confirmed by SSC. Nothing on the site targets SSC GD and it is one of India's largest recruitment drives, so it is worth preparing; **confirm against the official SSC notice before publishing**, and hold the draft if the window slips. |
| W3 | Signature on Photo: What Indian Forms Actually Accept | how-to-guide | Signature workflow | sign photo / add signature to photo | The evergreen query cluster that still draws impressions daily while `/tools/sign-image/` sits at position 70. The blog can rank where the tool currently cannot. |

### October

| Week | Post | Template | Cluster | Target query |
|---|---|---|---|---|
| W1 | Photo Size in KB vs Pixels: Why Portals Reject a Correct Photo | how-to-guide | Upload mechanics | photo size in kb |
| W3 | **Original research:** What 52 Indian Portals Actually Publish About Photo Specs | data-research | Authority | (link-earning, not query-led) |

### November

| Week | Post | Template | Cluster | Target query |
|---|---|---|---|---|
| W1 | Live Capture vs Upload: Which Indian Exams Photograph You | thought-leadership | Exam applications | ssc live photo capture |
| W3 | Passport Photo at Home: The Five Measurements That Decide Acceptance | how-to-guide | Passport | passport photo at home |

## Priority 3 — The link-earning piece (October W3)

This is the only item on the calendar aimed at the **actual** binding
constraint. Bing reports 0 inbound links; the audit named authority as the
ceiling; jsonviewer.stack.hu outranks better content on 17 years of links.

**Proposed:** publish the registry as original research — what 52 Indian
portals publish about photo specs, how many publish pixel dimensions vs KB only,
how many publish nothing, and how many contradict themselves. **You already own
this dataset and nobody else has assembled it.** It is citable by exam-prep
sites, journalists covering recruitment, and AI answer engines.

This is the one piece worth pitching directly rather than publishing and hoping.

## Material-change review (evidence-based, not date-based)

Dates are inventory metadata. Only these show a **confirmed material change**:

| Post | Material change | Priority | Action |
|---|---|---|---|
| `sir-enumeration-form-photo-2026` | The SIR enumeration window **closed 24 July 2026**. The post addresses a live task that no longer exists. | **High** | Reframe to past-cycle reference + point to the next revision, or note the window has closed. Do not delete — it holds position 1 on its query. |
| `ibps-po-2026-photo-signature-checklist` | IBPS PO 2026 exam sat **22–23 August 2026**; the application window is closed. | Medium | Add a dated note; re-point at the next IBPS cycle (Clerk, RRB). |

**Not flagged:** every other post. No confirmed source, fact or intent change —
so no update, and no `updatedISO` edit. Editing a date without substantive
change is exactly the pattern this review is designed to avoid.

## Seasonal anchors — and an important correction

From the site's own exam calendar:

| Date | Event | Usable for content? |
|---|---|---|
| **Sept 2026** *(tentative)* | **SSC GD Constable 2027 notification + application** | **Yes — the only live application window in range, but the date is unconfirmed** |
| 13 Sept 2026 | UPSC CDS II / NDA II **exam** | No — applications long closed |
| 10–11 Oct 2026 | IBPS Clerk **exam** | No — applications closed ~July |
| 21–22 Nov 2026 | IBPS RRB Officer **exam** | No — applications closed ~June |
| 6–13 Dec 2026 | IBPS RRB Clerk **exam** | No — applications closed |

**The correction that matters:** photo-upload demand peaks at the **application
window**, not the exam date. Four of the five dates above are exam dates whose
application windows have already passed, so they generate no photo demand.
Planning content against them would be planning against the wrong event.
Verify each board's notice before treating any of these as an opportunity —
including the SSC GD window, which is the one thing this quarter's plan leans
on and is recorded as tentative rather than announced.

## Distribution

Only for the two pieces that justify it — the SSC GD post (timed to a live
window) and the original research (aimed at links):

| Post | Publish | Same day | +2–3 days | Notes |
|---|---|---|---|---|
| SSC GD Constable spec | Sept W1 | — | Reddit r/SSC as a genuine answer, not a link drop | Timing beats promotion here |
| 52-portal research | Oct W3 | LinkedIn | Direct outreach to exam-prep sites | The only item worth pitching |

Everything else: publish and leave it. With 0 backlinks and near-zero traffic,
broad social distribution has no audience to reach yet.

## What this calendar deliberately does not do

- **No 8-posts-a-month schedule.** Volume was measured and disproved on this site.
- **No date-only refreshes.** Two posts have a confirmed material change; the other 36 do not.
- **No new topic clusters.** Existing clusters are not complete and authority is the constraint, not coverage.
- **No content aimed at the demoted `/tools/` pages' recovery.** That is a section-composition question, gated to December.

## Relationship to the index hold

Publishing blog posts is **safe during the hold**. The metric being tracked is
`/tools/sign-image/` position (baseline 75), which new blog pages do not
influence. The hold restricts deindexing, consolidation and redirects — none of
which appear here.

## Success measures

| Metric | Baseline (24 May–24 Jul) | Target by 30 Nov |
|---|---|---|
| Blog CTR | **1.4%** | 3.0%+ |
| Blog clicks | 78 / 2 months | 150+ / 2 months |
| Resizer-comparison post CTR | **0.0%** at pos 6.1 | any non-zero |
| Referring domains (Bing) | **0** | 1+ |

The last row is the one that matters most and the one least under your control.
