# easyPhoto — operating rules

Read this before changing anything. These rules override convenience, speed and
"quick wins". If a request conflicts with a rule, say which rule and why, and let
the owner decide — never work around it silently.

**Where we are.** Google demoted the site on 25 Jul 2026 (non-brand clicks → 0)
and restored it on 25 Sep 2026 (91 clicks, 4,890 impressions on 26 Sep). The
recovery is fragile. **Target: ≥ 5,000 Google clicks per month**, earned by
better tools and better results on the pages we already have — not by more pages.

We build with AI. We do not publish AI slop.

---

## 1. The index is frozen

- The sitemap is **123 URLs**, listed in `test/fixtures/sitemap-baseline.txt`.
  `test/sitemap.test.ts` fails if a URL is added or removed. Never edit the
  baseline to make the test pass: changing the indexed set needs the owner's
  explicit approval in chat, and the reason goes in the commit message.
- No new routes. No programmatic or templated pages, no per-KB / per-exam /
  per-country variants, no thin or duplicate pages, no doorway landers.
- Retired routes stay retired. Don't touch `public/_redirects`,
  `public/_headers`, `lib/deindexed.ts`, `app/robots.ts` or `app/sitemap.ts`
  without approval. A link to a retired route gets repointed, never revived.
- New capability goes **inside an existing tool page** (an option, a preset, a
  step, a check) — not onto a new URL.

## 2. What Google sees changes rarely and on purpose

"SEO-visible" = title, meta description, canonical, robots, H1/H2, JSON-LD,
visible body text, internal links, sitemap `lastmod`.

- Tool behaviour (JavaScript) is invisible to Google. SEO-visible edits are not.
- Every PR states **"SEO-visible changes: none"** or lists each page and what
  changed — proven by comparing built HTML against production (§6.3).
- On a page that earns clicks, a title/meta/H1 change is an **experiment**: one
  variable, one page, a noted GSC baseline, ≥ 14 days before judging.
- No site-wide or many-page copy edits in one release.
- `lastmod` / "updated" dates move only when content really changed
  (see the per-section constants in `app/sitemap.ts`). Never fake freshness.
- No SEO-visible release while a Google core or spam update is rolling out
  (status.search.google.com), or in the 14 days after one finishes.

## 3. No AI slop

- Every spec number (KB, px, cm, DPI, format, background) comes from the
  **official source**, linked on the page with the date we checked it. If it
  isn't published, we say so and don't invent it (ECI publishes no upload KB
  cap for Form 6 → we claim none).
- No filler, no keyword stuffing, no copy templated across pages, no text that
  exists for Google rather than the user. Every sentence helps someone finish
  their form.
- The owner reviews every user-facing copy change before it ships.
- Examples, screenshots and sample outputs come from the real tool.
- No fake reviews, counts, testimonials or authority claims.

## 4. Correct output is the product

A result is correct only when **all** hold:
- file size inside the band (the minimum **and** the cap);
- exact pixel size when the portal publishes one; otherwise the right ratio;
- right format and declared DPI;
- the face and signature intact — no clipped strokes, no cropped hair, no
  unreadable name/date strip.

- **Never degrade silently.** If the tool can't meet the spec, it says so and
  tells the user what to do. If it had to lower quality, it says so.
- Every bug fix ships with a test that **fails on the old behaviour** — prove it
  by temporarily reverting the fix.
- Spec data changes (`lib/portalPresets.ts`) include the official source URL and
  date in the same commit.

## 5. Branches and releases

- `master` = production (Cloudflare Pages → easyphoto.in). `dev` = integration
  (Cloudflare preview). No direct pushes to either — everything through a PR.
- Flow: `feature branch → PR into dev → verify on the dev preview → release PR
  dev → master`.
- Releases are **planned batches** (default: every two weeks, weekday morning
  IST), each with release notes and a note in `docs/weekly-log.md`, so a change
  in Search Console can be tied to one release.
- **Hotfix exception:** a tool producing wrong output or crashing for users may
  go straight to `master` the same day — after the full gate (§6). A broken tool
  costs more than an extra deploy.
- Why we batch: deploy frequency itself isn't a Google signal; content churn and
  mass-produced pages are. Batching gives us clean measurement and proper QA.
- After a merge: delete the branch. Nothing sits on a branch for weeks.

## 6. The gate — every PR, no exceptions

1. `npx tsc --noEmit` clean · `npx vitest run` green · ESLint: no new warnings ·
   `npm run build` succeeds.
2. Every commit passes type-check and tests on its own (the branch must bisect).
3. **SEO diff:** build production (`master`) and the branch; compare title,
   meta, canonical, robots, H1/H2, JSON-LD and visible text of every page. Only
   the pages the PR says it changes may differ.
4. **Side-by-side:** the same files through the top traffic pages on production
   and on the preview (390 px mobile browser). Results the same or better, zero
   page errors.
5. New behaviour exercised in a real browser on the preview — not just unit tests.
6. First-load JS on top pages grows ≤ 2 KB gzipped, unless the PR justifies it.
7. No new dependency without the owner's approval.
8. The PR description covers: what changes for users, how it was verified,
   SEO-visible changes, rollback.

## 7. Before building a feature

Write a short plan first — no plan, no code:
- the user problem and its evidence (GSC query, Bing query, a real failure);
- which **existing** page hosts it (§1);
- SEO-visible impact (§2) and performance cost (§6.6);
- the official spec source (§3);
- the test plan (§4) and the rollback.

## 8. Measurement

- North star: **Google clicks / month ≥ 5,000**. Bing tracked separately.
- Weekly row in `docs/weekly-log.md`: clicks, impressions, average position,
  non-brand share, `/tools/sign-image/` position, top pages, indexed count.
- Look at GSC before a release and again 14 days after it.
- Growth levers, in order: tools that give the right file first time → higher
  CTR on pages already ranking 4–10 → Bing → off-site (YouTube, communities).

## 9. Security and hygiene

- No tokens or secrets in code, commits or git remotes; authenticate with
  `gh` / the keychain.
- Small, focused commits whose message explains the bug and why the fix works.
- Only stage files you changed; never sweep the owner's unrelated local edits
  into a commit.

## 10. How Claude works here

- Follow this file. When asked to break a rule, quote the rule, explain the
  risk, and wait for the owner's decision.
- Run the gate (§6) yourself before saying anything is done; report failures
  plainly.
- Keep the weekly log current and flag anything that threatens the recovery.
