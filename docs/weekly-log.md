# Weekly signal log

One row per week. The point is to watch the *content-page* position, not the
site-wide average (the homepage's brand traffic distorts the average — see the
traffic-collapse notes). This is the log the December decision gate reads.

**How to fill it** (Fridays):
- `sign-image pos` — `~/.claude/skills/blog-google/.venv/bin/python
  ~/.claude/skills/seo/scripts/gsc_query.py -p sc-domain:easyphoto.in
  --dimensions page --days 7 --json` → position of `/tools/sign-image/`.
  This is the recovery bellwether; baseline ~71 (was 6 before 25 July).
- `non-brand clicks / impr` — `--dimensions query`, sum every row whose query is
  not "easy photo" / "easyphoto".
- `indexed` — GSC Coverage → submitted-and-indexed count (sitemap has 123,
  frozen in `test/fixtures/sitemap-baseline.txt`). The URL Inspection API gives
  the exact figure: `~/.claude/skills/seo/scripts/gsc_inspect.py --batch`.
- `Bing clicks / impr` — Bing Webmaster API, Mon–Sun totals from
  `GetRankAndTrafficStats?siteUrl=https://easyphoto.in/&apikey=…` (key in
  `~/.config/claude-seo/backlinks-api.json`, never in the repo). Bing reports
  ~3 days behind, so a Friday fill covers through Tuesday — note it.
- `resize-kb pos G / B` — position of `/tools/resize-kb/` on Google (GSC page
  filter) and Bing (`GetPageStats`). The biggest gap between the engines
  (see docs/NEXT-RELEASE.md, item 6).
- `installs` — Play Console (once 1.4 is live).
- `yt→site` — sessions with `utm_source=youtube` (Cloudflare Web Analytics) once
  1.5 is live.
- `tool funnel` — from `scripts/usage-report.mjs` once the Analytics Engine
  binding is on (Phase 0.1): tool_view → tool_start → download.

| Week (Mon) | sign-image pos | non-brand clicks | non-brand impr | Bing clicks / impr | resize-kb pos G / B | indexed | installs | yt→site | notes |
|---|---|---|---|---|---|---|---|---|---|
| 2026-08-31 | ~71 | 0 | ~218 (28d) | 296 / 8,584 | — | 122 | — | — | Phase-1 baseline. Pre-change. |
| 2026-09-21 | 67.5 → **6.6** (25–26 Sep) | 36 | 2,397 | 435 / 15,013 | 7.6 / 8.0 | 119 / 123 | — | — | **Demotion lifted 25 Sep**, the day after Google's September spam update began (24 Sep); every non-brand click this week came on 25–26 Sep. Site 21–26 Sep: 110 clicks / 5,729 impr, avg pos 7.6; 26 Sep alone: 91 / 4,890. Top pages: voter-id 25, sign-image 17, photo-with-name-date 13, signature-cleaner 8. Not indexed: 2 blog posts crawled-not-indexed, 1 discovered-not-indexed, and `/tools/compliance-checker/` still marked noindex from Google's 14 Aug crawl (indexable again since 1 Sep — request indexing in GSC). 27 Sep not yet in GSC. On `dev` 29 Sep, not in production: #47 QA fixes, #48 operating rules (CLAUDE.md). |

## Releases

One row per production release, so a change in Search Console can be tied to it
(CLAUDE.md §5). Review GSC on the "check" date: 14 days after the release.

| Released (IST) | PR · commit | What shipped | SEO-visible | Check GSC |
|---|---|---|---|---|
| 2026-09-29 16:08 | #50 · `72391cd` | Bug-fix release: site search (404s, top queries), form fill in production, Driving Licence/CAT size caps, IBPS/RRB signature minimums, thin-stroke signature trimming (sign-image, signature-cleaner, all signature tools), no green verdict for a no-face photo, crop ratios, name/date wrapping, Exam Kit name/date prompt, restricted PDFs, compressor stale results. **Held:** print-sheet fix (changes page text; waits until 14 days after the Sept 2026 spam update ends). Verified live after deploy. | none (0 of 300 pages) | 2026-10-13 |
| 2026-10-01 12:26 | #57 · `157639f` | UPSC three-signature check and warning (#53). One breadcrumb trail on every page template (#54). Homepage: misleading "No measurable issues detected" lines removed or reworded, showcase cards rebalanced (#54–#56). **Held:** print-sheet fix. **Owner override of CLAUDE.md §2:** shipped during the Sept 2026 spam update rollout and as a many-page change, by the owner's explicit decision on 2026-10-01. Verified live: 72/72 browser tests pass on production. | ~100 indexed pages: breadcrumb text and links; `/`: 5 short labels. No title/meta/H1/H2/JSON-LD/sitemap change | 2026-10-15 |
