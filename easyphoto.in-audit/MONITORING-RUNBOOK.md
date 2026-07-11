# EasyPhoto SEO Monitoring Runbook

**Created:** 2026-07-10
**Purpose:** Turn the ad-hoc "share a GSC screenshot" checks into a repeatable cadence. These are the exact commands and the specific signals to read. Run them yourself, or ask me to run any of them and read the verdict.

> **Why not fully automated?** A scheduled cloud agent wouldn't have the local `~/claude-seo` scripts or the Google API credentials (`~/.config/claude-seo/google-api.json`), so an unattended job would fail silently. This runbook is the reliable path — assisted, not blind.

---

## The commands (all read-only, no site changes)

**GSC search performance (query × page × CTR × position):**
```bash
python3 ~/claude-seo/scripts/gsc_query.py --property sc-domain:easyphoto.in --days 28 --json
```

**Core Web Vitals field data (CrUX, real users):**
```bash
python3 ~/claude-seo/scripts/pagespeed_check.py "https://easyphoto.in/" --crux-only --json
```

**Rebuild the keyword map** (regenerates `KEYWORD-MAP-2026-07.md` from fresh GSC — the script is the small analysis block used to create it; ask me and I'll re-run it against a fresh pull).

**Live sitemap / redirect / indexability spot-check:**
```bash
curl -s https://easyphoto.in/sitemap.xml | grep -c "<loc>"        # URL count
curl -sI https://easyphoto.in/exam-requirements/voter-id/ | head  # status + headers
```

**Account note:** GitHub PR ops need the `jaspalzzz` gh account active (`gh auth switch --user jaspalzzz`) — a concurrent agent sometimes switches it to `Jaspal-Android`, which can't create PRs. Not needed for the read-only monitoring above.

---

## Cadence & what to read

| When | Do | Signal to watch |
|---|---|---|
| **After each deploy** | Re-pull GSC 28-day; refresh the keyword map | New page indexed? Any page's clicks drop to 0 (possible regression)? |
| **Weekly** | GSC clicks/impressions/CTR trend | Is the click curve still climbing (was 0→86→153→200→250→263)? Which cluster is driving it? |
| **Monthly** | CrUX pull for homepage + a tool page | LCP/CLS/INP staying "Good"? (Baseline 2026-07-09: LCP 1,881ms / CLS 0.00 / INP 125ms — all Good.) |
| **Monthly** | Keyword-map refresh | New page-1 zero-click pages (snippet opportunities)? Pages climbing out of pos 40-90 (authority working)? |

---

## Open items with specific review dates

### 1. Voter-ID title experiment — REVIEW ~2026-07-31
PR #35 changed `/exam-requirements/voter-id/`'s title to `Voter ID Photo Size & Resizer 2026 (Official)` (appended "& Resizer" to test the SXO tool-intent hypothesis). It's isolated to that one page.

- **Baseline (pre-change, 2026-07 GSC):** `/exam-requirements/voter-id/` = 14 clicks; the noindexed sibling `/tools/form-resizer/voter-id/` = 26 clicks; the 301'd `/voter-id-photo-resizer/` = 48 clicks. The canonical page ranked ~pos 6.2 for "voter id photo size in mb/kb" with low CTR.
- **How to read it:** pull GSC filtered to that page. **If** CTR / position on `/exam-requirements/voter-id/` improved → the "Resizer" framing works; consider templating it to other exam pages (one at a time). **If** flat or worse → revert the single line in `EXAM_REQUIREMENTS_TITLE_OVERRIDES` (`app/exam-requirements/[exam]/page.tsx`). The code comment there records this same plan.

### 2. Noindex migration (ongoing)
Several exam clusters still earn clicks on *noindexed* `/tools/form-resizer/*` pages (e.g. voter-id 26 clicks). As Google reprocesses the noindex, those should migrate to the embedded-resizer `/exam-requirements/*` canonicals (PR #26). **Watch:** the noindexed pages' clicks should trend toward 0 while the canonical's rise. If clicks vanish *without* the canonical picking them up, that's the signal the canonical needs the SXO title help (see item 1).

### 3. AdSense re-review (user-side)
The low-value-content cleanup is fully shipped. When you request re-review, watch the verdict — the audit's content/E-E-A-T work (outbound gov citations, verified specs incl. the Aadhaar accuracy fix) all strengthen that case.

---

## Quick health baseline (2026-07-10, for comparison)
- **Clicks:** 263 / 28 days (trajectory 0 → 86 → 153 → 200 → 250 → 263)
- **Impressions:** ~9K / 28 days (big runway — lots ranking deep, needs off-page authority to convert; see `OFF-PAGE-KIT.md`)
- **Sitemap:** 215 URLs, all 200 · **CWV:** all 3 ranking vitals Good · **Top clusters:** Voter ID (~88 combined), Sign Image (30, accelerating from 7)
- **Audit health score:** 72/100 (see `FULL-AUDIT-REPORT-2026-07-09.md`)
