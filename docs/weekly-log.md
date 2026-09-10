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
- `indexed` — GSC Coverage → submitted-and-indexed count (sitemap has 122).
- `installs` — Play Console (once 1.4 is live).
- `yt→site` — sessions with `utm_source=youtube` (Cloudflare Web Analytics) once
  1.5 is live.
- `tool funnel` — from `scripts/usage-report.mjs` once the Analytics Engine
  binding is on (Phase 0.1): tool_view → tool_start → download.

| Week (Mon) | sign-image pos | non-brand clicks | non-brand impr | indexed | installs | yt→site | notes |
|---|---|---|---|---|---|---|---|
| 2026-08-31 | ~71 | 0 | ~218 (28d) | 122 | — | — | Phase-1 baseline. Pre-change. |
