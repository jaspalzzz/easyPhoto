# SEO plan, Nov 2026 – Feb 2027: grow the pages we have, then reopen hidden tools

Written 31 Oct 2026, using Google Search Console (25 Sep – 29 Oct 2026) and Bing Webmaster
(24 Jul – 30 Oct 2026). Every number below comes from those two exports. Traffic
estimates are rough ranges, worked out as impressions × a realistic CTR for the
position. They are not promises.

Rules this plan follows (CLAUDE.md): the index changes only with the owner's approval
in chat (§1). On a page that earns clicks, one title/meta change at a time, measured
for ≥ 14 days (§2). No SEO-visible release during a Google update or in the 14 days
after one (§2). Every spec number comes from the official source (§3).

## Where we are

- **Google:** about 283 clicks a day in the week after release #146 (23–29 Oct),
  up from 154. That's about 8,500 a month; the 5,000 goal is met. Without the RRB
  application-window surge it is about 233 a day.
- **Bing:** 1,111 clicks in 3 months, nearly all on 3 tool pages. Resize by KB gets
  1,785 Bing clicks, but it sits at position 12.7 on Google for the same searches.
  Authority (DR 0, almost no linking sites) holds Google back, not the page itself.
- **The 22 Oct release watch runs to 21 Nov** (`../gsc-watch/release_watch.py`,
  weekly Thursday task). If more pages change before then, its verdict is muddied.

## Phase 0 — now to 21 Nov: change nothing that Google sees

Let the release watch finish. Diwali (8 Nov) will move demand. The watch's control
group (unchanged pages) shows whether a dip is seasonal or caused by our changes.

The one exception is an exam board whose application window opens in this period
(see Phase 2). Missing a window means waiting a year, so the owner can approve that
page early.

## Phase 1 — late Nov: two snippet experiments on pages Google already ranks

These are the biggest gains for the least work. Neither adds a URL.

| Page | Searches (25 Sep – 29 Oct) | Now | Problem | Experiment | Rough gain |
|---|---|---|---|---|---|
| `/blog/pan-card-photo-size/` | ~850 impressions a day since 16 Oct: "pan card size", "pan card photo", "pan card photo size", "pan card signature size" | position ~8, CTR 0.7% | The title is 82 characters, so Google cuts it off before the numbers people want | A shorter title that leads with the official figures. Use #150's corrected Protean/UTIITSL numbers; no other change | +200 to +400 clicks a month |
| `/tools/signature-resize/` | "signature resize" 2,190 impr at position **4.1**, 6 clicks; "resize signature" 509 impr, 0 clicks | CTR 0.4% at position 4 (normal is 4–8%) | The title already matches the search, so the cause is in the results page itself. Check the live results (image pack? competitors showing "20 KB / 140×60"?) before writing | One title/meta change chosen from what the results page shows | +150 to +300 clicks a month |

Also watch the two PAN pages, which compete for "pan card photo size":
`/exam-requirements/pan/` ranks **3.0** with 617 impressions and 1 click, while the blog ranks 8.2.
Google probably answers the size in the results itself. Don't merge them now. If the
blog experiment works, the blog keeps the "size" searches and the exam page keeps
"upload".

## Phase 2 — Dec: reopen exam pages that already draw searches (up to 3 per release)

`lib/deindexed.ts` says these exam pages are "expected to be reversed when demand
appears". It has appeared: **Bing still lists four of them, despite noindex, and they
get clicks**:

| Page | Bing (Jul–Oct, while hidden) | Page today |
|---|---|---|
| `/exam-requirements/mpsc/` | 20 clicks, 142 impressions | 445 words |
| `/exam-requirements/ccc-nielit/` | 15 clicks, 185 impressions | 445 words |
| `/exam-requirements/tnpsc/` | 7 clicks, 116 impressions | 471 words |
| `/exam-requirements/ugc-net/` | 2 clicks, 71 impressions | 557 words |

Google usually brings as much as Bing or more, so expect roughly **+50 to +150 clicks a
month** for the four together. It's seasonal and peaks in each board's application
window. NIELIT CCC runs every month, so it is the steadiest.

What each page needs before it goes back into the sitemap:
1. Specs taken from the current official notice, linked, with the date checked (§3).
2. Notice-sourced `applicationNotes` and at least 250 words of its own (§1 quality
   ceiling; `npm run quality` passes).
3. Owner approval in chat to change the indexed set. Remove the page from
   `DEINDEXED_PATHS` and `public/_headers` in the same PR, and add it to the sitemap
   baseline, with the reason in the commit.
4. Order: CCC-NIELIT first (monthly demand), then MPSC and TNPSC. UGC-NET goes with
   its next notification.

## Phase 3 — Dec to Feb: reopen hidden tools, one a month

26 tools were hidden in the July recovery. Hidden pages show no Google searches, so
the evidence below is searches we already get on *other* pages, plus Bing.

| Order | Tool | Evidence | Why it can win | Work needed | Rough gain |
|---|---|---|---|---|---|
| 1 | `/tools/resize-dimensions/` (resize to exact px or cm) | **~2,600 Google impressions** for pixel/cm searches, landing on exam pages: "rrb signature size 60 140 pixels" (203 + 168), "2×4.5 cm signature" (197), "pan card size in cm" (151), "4.5 cm × 3.5 cm photo" (148). Bing: "photo resizer in pixel and kb" | Indian forms state sizes in px **and** cm. Resize by KB already wins on Bing; this is its pair | Page is 342 words. Add a cm ↔ px at DPI explainer, official exam examples, and FAQs of its own. Link from resize-kb and the exam pages | +100 to +300 clicks a month |
| 2 | `/tools/print-sheet/` (passport photos on A4 / 4×6) | Bing showed it 70 times **while hidden**. "how to print a photo at home for passport … 35 mm × 45 mm". The passport page already links it | People print at home or at a shop; competitors' sheets aren't India-sized | Page is 501 words. Add print sizes for PSK/exam forms, a printing guide, and paper and DPI advice | +50 to +200 clicks a month |
| 3 | `/tools/pdf-compress/` (PDF to 100 / 200 KB) | Little first-party evidence: no indexed PDF page exists to collect searches. Small signs: "pan card apply pdf size", "pdf … not more than 300 kb" | Exam and job portals ask for PDFs under a KB cap, which fits the audience. "compress pdf" alone belongs to iLovePDF and Smallpdf; we aim at "compress pdf to 100 kb for form" | Page is 381 words. Write it around portal PDF caps (official sources only) | Unknown: a test. Judge at 28 days |

After each one: 14 days, then the 28-day check. If it draws under 20 impressions a
month by day 28, it goes back to hidden. Never reopen two in the same month.

## Don't reopen (and why)

| Tools | Reason |
|---|---|
| pdf-merge, pdf-split, pdf-reorder, pdf-page-numbers, watermark-pdf, pdf-to-text, pdf-to-jpg, jpg-to-pdf, unlock-pdf, extract-pages | Generic searches owned by iLovePDF, Smallpdf and Adobe; nothing specific to Indian forms; they'd be template pages, the "low value" pattern AdSense rejected |
| transparent-signature | "signature png converter" (51) exists, but the signature-cleaner page already ranks for "image to signature converter" (852 impressions, 53 clicks). #132 just stopped two signature pages competing; a third would start it again. Give the cleaner a PNG option instead (§1: new capability goes inside an existing page) |
| straighten-photo | "face is tilted in uploaded image" (62 impressions) is a portal error message. Answer it on `/tools/face-centering/`, which already ranks for it (position 7), not on a new URL |
| ocr, image-to-text, red-eye-removal, linkedin-photo, format-converter, auto-crop, image-crop, camera-capture, mask-aadhaar, photo-validator, photo-rejection-check, sign-pdf, compress-document, the hub pages (/tools/pdf/, /tools/photo/, /tools/document/, /tools/signature/) | Under 70 impressions in 5 months of history, and nothing in current searches shows demand. Mask-aadhaar also involves ID documents, which raises AdSense and privacy risk |
| Hidden visa makers (Kuwait 112, Portugal 111 impressions in 5 months) | The keyword map's plan for this family stands: fix the indexed country pages one at a time first |

## Always on: authority and Bing

- **Links decide positions 2–6** (keyword map, "Ceiling"). Resize by KB shows it:
  Bing position ~9, Google 12.7, same page. The hand-over guide has the link
  work: editorial links, the cite box and the 404-link redirects.
- **Bing is about half the traffic.** Re-submit IndexNow for every page that
  changes (`scripts/indexnow.mjs`). Each reopened page needs a fresh IndexNow ping
  after it's removed from `public/_headers`.

## AdSense: what the 1 Nov 2026 rejection changes

AdSense rejected the site again on 1 Nov 2026 ("Low value content"; ads.txt
"Authorized"). That used up the review attempts: the next request is possible from
**8 Nov 2026**. The policy text now asks for three things: "substantial unique value",
"a consistent presence on the web" and "a level of user interest". The last two are
about authority and traffic, which page edits can't change in a week.

- **Don't request again on 8 Nov.** Nothing material has changed since the review
  that just failed, and every failed attempt brings another lock-out. Request again
  only after a visible change: Phases 1–3 done, traffic holding at or above today's
  level for 4+ weeks, and some links from other sites. That's about **January 2027 at
  the earliest**.
- **The hidden pages are still part of the site a reviewer sees.** The 6 Oct
  readiness audit measured only the 123 indexed pages. `/tools/` links to **46 of the
  72 hidden pages**: 350–550-word template pages, which is exactly the pattern
  "low value content" describes. Hiding a page from search hides it from Google
  Search, not from an AdSense reviewer. This is a likely cause, not a proven one.
  Two ways to deal with it (owner decision, CLAUDE.md §1):
  1. Give the pages this plan reopens (Phases 2 and 3) real text of their own. This
     fixes them for both Search and AdSense.
  2. For the hidden pages this plan says not to reopen, stop linking them from
     `/tools/` and the hub pages. Keep them working for anyone who has the link.
     This means changing the rule that the hidden pages stay linked, and needs the
     owner's approval.
- **Expectations:** at today's traffic, AdSense earns about ₹100–250 a month
  (`adsense-readiness-2026-10-06.md`). Traffic growth from this plan is what
  makes approval possible, and what makes it worth having.

## Calendar

| When | What | Measured by |
|---|---|---|
| to 21 Nov | No SEO-visible changes. Release watch every Thursday | `gsc-watch/reports/` |
| ~27 Nov | Release-watch final verdict. Then Phase 1: PAN blog title, signature-resize title (two pages, one variable each) | GSC page report at 14 and 28 days |
| Dec | Phase 2: CCC-NIELIT, MPSC, TNPSC back in the index (≤ 3 in one release) | GSC + Bing at 14 and 28 days |
| Dec | Phase 3 #1: resize-dimensions | 28-day keep/revert rule |
| Jan | Phase 3 #2: print-sheet | same |
| Feb | Phase 3 #3: pdf-compress | same |

Before each release, check status.search.google.com (§2). Every step needs someone to
build it, review it and release it. The October wrap-up plan has no one for that after
31 Oct, so the owner decides which steps go ahead.
