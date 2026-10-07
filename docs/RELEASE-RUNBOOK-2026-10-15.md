# Release runbook — Thu 15 Oct 2026

Bug-fix release, built from `master` by cherry-picking dev commits (never a
straight dev → master merge: dev also holds the 22 Oct UI polish, the held
print-sheet fix and the 29 Oct content fixes). Follows `CLAUDE.md` §5–§6.

Tools: `scripts/release/review.py` (Google + Bing review), `scripts/release/seodiff.py`
(SEO-visible diff of two builds), `playwright.remote.config.ts` (e2e against a
deployed URL), `npm run indexnow` (Bing notification).

## Scope (owner decisions, 6 Oct)

Split release: JavaScript fixes plus one wrong-output hotfix. The September 2026
spam update is still rolling out, so nothing else that changes page text ships.

| Commits (cherry-pick in this order) | What | PRs |
|---|---|---|
| `2ca029b 711417d` | sign-image ignores distant dust specks; faint-signature fallback | #60 |
| `69b9be1 4f8e5f9` | compliance checker: latest check wins; no signature check without a signature upload | #61 |
| `a182d2b` | Exam Kit: name/date stamped on the original, encoded once | #62 |
| `ef7f945` | Form Fill labels linked to controls | #63 |
| `8017d0b` | Form Fill: restricted PDFs filled when their permissions allow | #64 |
| `fa75d08` | signatures export in the preset's published format and DPI | #71 |
| `07a13ef` | Driving Licence: Sarathi JPG format (wrong-output hotfix, §5) | #72 |
| `31565d1` | KB caps safe for portals counting 1 KB as 1000 or 1024 bytes | #75 |
| `095f679 1e187db 4f6f48f 77cc9ab` | AI tools never hang: OCR/face model loads bounded, mirror on a stalled model host | #76 |

**Not in this release:** `7e29d71` (broken blog images, #73) and `03e089f`
(calendar past entries, #74) → 29 Oct; print-sheet `b877a16` (held); UI polish
#65 #66 #68 #69 #70 and the UPI card #79 → 22 Oct; guards #81 come to master
with the 22 Oct release.

**Dry runs (6 Oct):** all 14 commits apply cleanly on `master`; tsc clean;
794 unit tests; build OK; e2e for every fixed tool 35/35. The unsplit 16-commit
run also passed the full e2e suite (87/88 + the known white-background handoff
flake passing on rerun).

**Owner approvals already given (6 Oct):** Form Fill "issuer doesn't allow"
string (#64); the five AI-tool error strings (#76); the Driving Licence page
text change. AdSense switched off in Cloudflare (production env), effective on
this build.

## 15 Oct morning — go / no-go

- [ ] `~/.claude/skills/blog-google/.venv/bin/python scripts/release/review.py` —
      Google + Bing before/after release #57 (1 Oct). Exclude a partial last day
      when reading the "after" average. No-go if clicks/day or average position
      clearly worsened after #57.
- [ ] status.search.google.com → record the September 2026 spam update status
      (name, start, end or "rolling") — CLAUDE.md §2 requires it in the PR.
- [ ] GSC URL Inspection: `/tools/compliance-checker/` (owner requested
      indexing 6 Oct) — expect a crawl after 14 Aug and "Submitted and indexed".
- [ ] Go / no-go decision, told to the owner in plain words.

## Release

- [ ] `git worktree add -b release/2026-10-15 ../EasyPhoto-rel origin/master`
      (symlink `node_modules` from the main checkout); cherry-pick the commits
      above, in order.
- [ ] `git diff origin/dev --stat` lists ONLY: held print-sheet files, held
      #73/#74, the 22 Oct UI polish and UPI card, the guards (#81) and docs.
- [ ] Gate: `npx tsc --noEmit`, `npx vitest run`, `npm run build`.
- [ ] SEO diff: build `origin/master` in a temp worktree, then
      `python3 scripts/release/seodiff.py <master>/out out` — expect ONLY
      `exam-requirements/driving-licence` (+ the noindex copies
      `driving-licence-photo-resizer`, `tools/form-resizer/driving-licence`)
      and its sitemap lastmod. Anything else → stop.
- [ ] e2e on the release branch (local dev server, fresh `E2E_PORT`), then
      `git checkout -- tsconfig.json`.
- [ ] PR into `master` with: what changes for users, verification, SEO-visible
      changes, Google update status, the §6.9 spam-policy checklist, rollback.
      Merge only after the Cloudflare check is `completed:success`.
- [ ] Wait for easyphoto.in to serve the new build.

## After deploy

- [ ] e2e against production:
      `E2E_BASE_URL=https://easyphoto.in npx playwright test -c playwright.remote.config.ts`
      (ML specs need a reachable models.easyphoto.in; rerun a single flake once).
- [ ] AdSense gone: homepage and two blog posts load no `pagead2` /
      `adsbygoogle` / Funding Choices script.
- [ ] `npm run indexnow -- https://easyphoto.in/exam-requirements/driving-licence/`
- [ ] If the Analytics Engine binding is on: `/api/event` returns 204 and
      events appear.
- [ ] Back-merge `master` → `dev` (PR); then on dev
      `npm run build && npm run quality` stays green.
- [ ] `docs/weekly-log.md` Releases row: PR, commit, contents, SEO-visible pages
      (Driving Licence only), GSC check date 2026-10-29.
- [ ] Delete the release branches and worktrees.

## Rollback

Revert the release merge on `master`; Cloudflare redeploys the previous build.
No data, route or sitemap change besides the Driving Licence lastmod.

---

# 22 Oct (UI polish) — prep notes

- Contents: #65 type scale, #66 card hierarchy, #68 FAQ/footer, #69 sign-image
  compact, #70 ToolCard. Presentation only — SEO diff must show 0 pages changed.
- Rerun the combined UI check on the final dev preview before release: top
  pages at 390 and desktop, light and dark, page speed vs production.
- UPI support card (#79) is built and dormant until `NEXT_PUBLIC_UPI_VPA` is set
  in Cloudflare (production). On hold (6 Oct) until the owner has a merchant UPI
  account. Before enabling: add the QR to `public/` via PR and set
  `NEXT_PUBLIC_UPI_QR_SRC`; test a real ₹1 tap-to-pay on Android (GPay, PhonePe,
  Paytm) and a QR scan from a computer screen.
