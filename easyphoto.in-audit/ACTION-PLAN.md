# EasyPhoto SEO Action Plan

**Updated:** 2026-07-09
**Current score:** 72/100 (skill's 7-category weighted formula — see methodology note in `FULL-AUDIT-REPORT-2026-07-09.md`; not comparable to the 07-07 report's 82/100, which used a different 17-category scheme)
**SXO Gap Score (separate):** 58/100 · **Cluster Health (separate):** 7/10
**Evidence:** `FULL-AUDIT-REPORT-2026-07-09.md`, `KEYWORD-MAP-2026-07.md`, live HTTP verification, fresh CrUX + 28-day GSC pull, 5 specialist re-audits (technical/content/SXO/cluster/visual)

## Current State

Most signals genuinely improved or held steady since 07-07: all redirects verified live, sitemap 215/215, all 3 ranking Core Web Vitals now confirmed **Good** on real field data (LCP 1,881ms / CLS 0.00 / INP 125ms), the exam-requirements resizer embed shipped and closed the CRITICAL SXO gap (now MEDIUM), and one prior baseline recommendation was found to be **wrong** (re-adding `Disallow: /_next/` to robots.txt — that removal was a deliberate, correct fix, not a regression).

The real open work is content/authority depth and SXO framing, not technical foundations.

## Phase 1: Cheap, high-confidence fixes (do now, no risk of repeating a known failure)

| Task | Owner | Priority | Effort | Expected impact |
|---|---|---|---:|---|
| Add outbound government-portal citation links to the 3 recent blog posts (voters.eci.gov.in, onlineservices.nsdl.com, sarathi.parivahan.gov.in) | Content | P1 | 0.5 day | E-E-A-T / Trustworthiness — currently 0 outbound gov citations despite claiming "verified" |
| Add back-links from `pan-card-photo-size` + `driving-licence-photo-size-sarathi` to the Government ID pillar | Developer | P1 | 0.5 day | Closes mandatory spoke→pillar gap (2 of 3 spokes currently fail it) |
| Register a `govId` entry in `lib/blog.ts` `CLUSTERS` map | Developer | P1 | 0.5 day | `relatedPosts()` currently surfaces unrelated content on the newest pillar |
| Add a before/after image to `/tools/sign-image/` | Content/Design | P1 | 1 day | Weakest SXO dimension on that page (Media 2/15); page has accelerating demand (257 impr) |
| Convert remaining 12 unconverted PNGs (500–820 KB) to WebP — homepage section image first, then top 3-4 blog posts | Developer | P1 | 1 day | Hero/LCP was already fixed; rest of image inventory wasn't in scope |

## Phase 2: Decisions needed before shipping (real evidence, real risk if mishandled)

| Decision | Context | Recommendation |
|---|---|---|
| Voter-ID title-vs-intent | SERP-backwards analysis: "voter id photo resizer" is won ~90% by Tool/Interactive pages; our title still reads "Photo Size" not "Resizer" even after embedding the tool. **But** this exact 50-page template had a documented failed title-override experiment (army-agniveer, no CTR movement). | Test on `voter-id` ALONE (most data, highest exam-page traffic), watch GSC 2-3 weeks, THEN decide on template-wide rollout. Do not pre-emptively change all 50. |
| Passport post duplication | `indian-passport-photo-requirements` vs `indian-passport-photo-size-rules` restate the identical spec, zero cross-links either direction — confirmed live, worse than any baseline finding. | Pick a canonical, cross-link the other as a companion angle, or merge. |
| `how-to-sign-on-image-online` depth | 661 words vs. the 1,500 blog-post floor — thin for its content type, though accurate and well-organized. | Either expand toward 800+ words with a troubleshooting section, or intentionally reclassify as a lighter tool-support page (300+ min, already clears that). |

## Phase 3: Backlog

- IndexNow implementation (`/indexnow.txt` / `/.well-known/indexnow` both still 404) — cheap, still not done.
- Build `/exam-requirements/aadhaar/` — Aadhaar is the only one of the 4 Gov-ID pillar's documents without a matching embedded-resizer page (`PORTAL_KEYS` doesn't include it).
- Author `jobTitle` wording refresh ("developer & document-spec researcher" → lead with research/verification).
- Full 50-page programmatic-duplication ratio check across `/exam-requirements/*` (only 3 pages spot-checked this cycle).
- Off-page / backlinks: still Tier 0 (no Moz key) — insufficient data. Biggest lever outside code; not actionable from this repo.

## Monitoring

- After each deploy: re-pull GSC 28-day data (`python3 ~/claude-seo/scripts/gsc_query.py --property sc-domain:easyphoto.in --days 28 --json`) and refresh `KEYWORD-MAP-2026-07.md`.
- Watch the voter-id title test (Phase 2) specifically for 2-3 weeks before any template-wide decision.
- Re-run CrUX pull monthly (`python3 ~/claude-seo/scripts/pagespeed_check.py <url> --crux-only --json`) — first real field data landed this cycle, worth an ongoing trend line.
