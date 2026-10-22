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
- **Template families have a similarity ceiling.** `/exam-requirements/*`,
  `*-photo-maker/`, the US/UK/Canada/Schengen guides, `/tools/*` and `/blog/*`
  are measured with name- and number-normalised 5-word shingles
  (`npm run quality`). No pair may exceed the family's recorded maximum, no
  page may lose words of its own, and a new page needs ≥ 250 words not shared
  with its siblings. The baseline
  (`test/fixtures/quality/similarity-baseline.json`) only moves down.

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
- **Visible dates, `dateModified` and sitemap `lastmod` agree.** Move them
  together, and only when the content changed: if the SEO diff (§6.3) shows a
  page's text changed, its date moves too, and the reverse. Today's
  disagreements are listed in `test/fixtures/quality/date-exceptions.json`; the
  list only shrinks.
- No SEO-visible release while a Google core or spam update is rolling out
  (status.search.google.com), or in the 14 days after one finishes.
- Every production PR records the latest Google update's status (name, start,
  end or "rolling") from status.search.google.com. Owner overrides of the quiet
  window are logged in `docs/weekly-log.md`.

## 3. No AI slop

- Every spec number (KB, px, cm, DPI, format, background) comes from the
  **official source**, linked on the page with the date we checked it. If it
  isn't published, we say so and don't invent it (ECI publishes no upload KB
  cap for Form 6 → we claim none).
- **A number we did not find in the official source is never "the size".** If
  a preset is `needs-review` or the authority publishes no figure, the title,
  meta description, H1, first requirement card, FAQ answers and JSON-LD say
  what *is* published (e.g. "photo captured live", "4.5 × 3.5 cm print, no
  upload cap published") and show our value only as "easyPhoto default — not
  an official limit". `test/unpublishedSpecClaims.test.ts` and `npm run
  quality` enforce this.
- No filler, no keyword stuffing, no copy templated across pages, no text that
  exists for Google rather than the user. Every sentence helps someone finish
  their form.
- **Write for applicants, not for us.** No internal vocabulary in user-facing
  copy ("stored", "selected target", "preset", "registry",
  "compatibility-only", "in this review", "extracted"). Never state the same
  fact twice on one page. `test/internalJargon.test.ts` and `npm run quality`
  count these; the counts only fall.
- **No shared FAQ templates.** A FAQ question, after swapping out the
  exam/country name and numbers, may appear on at most 3 indexed pages, and
  every answer must answer the question asked. FAQ blocks are for readers.
  Enforced by `test/faqTemplate.test.ts` and `npm run quality`.
- **Static demos are labelled.** Any pass/fail, score or "checks passed"
  visual not produced from the user's own file carries a visible "Example"
  label (`test/exampleLabel.test.ts`).
- The owner reviews every user-facing copy change before it ships.
- **AI-drafted text gets a read-aloud pass** by the owner before merge,
  including titles, meta descriptions, alt text and JSON-LD.
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
   `npm run build` succeeds, then `npm run quality` passes on that build.
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
9. **Spam-policy checklist** — the PR description answers each question:
   1. New or changed indexable URL?
   2. Any text templated from another page, and did the name-swap test pass?
   3. Any number not in the cited official source?
   4. Any claim the tool can't back (accept, verified, compliant, AI,
      guarantee)?
   5. JSON-LD added or changed? Does it match visible text, with no Review or
      AggregateRating?
   6. Any date or `lastmod` moved, and did the content really change?
   7. Any outbound commercial link, and is it `rel="sponsored"` and disclosed?
   8. Any history manipulation, interstitial or new third-party script?
   9. Is a Google update rolling out, or did one end within the last 14 days?

A quality guard fails in both directions: on a new violation, and on a
recorded allowance that is no longer used. Fix the page; delete or lower the
entry it names. Never loosen a baseline in `test/fixtures/quality/` to make a
check pass — that needs the owner's approval in chat and the reason in the
commit message.

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
