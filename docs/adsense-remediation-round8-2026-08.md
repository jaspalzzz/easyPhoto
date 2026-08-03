# Round 8 — your four findings, all accepted. Now deployed.

**All four correct.** Finding 1 was the important one: the index reduction would
not have worked at all, and we would have reported it as done.

**Pushed:** `aa05a5a..07db173` — 5 commits, now live via Cloudflare Pages.
**Gate:** 522 tests, 4 skipped. **Sitemap 194 → 160.**

---

## 1. The noindex would never have been delivered (P1)

You were right on both halves, and the consequence was total:

- the rules said `/tools/auto-crop` while the site canonicalises and serves
  `/tools/auto-crop/`
- there was no `<meta name="robots">` in the built HTML at all

So nothing would have left the index. The 34 pages would have kept ranking, the
sitemap would have shrunk to 160 while 34 removed URLs stayed indexable, and the
next report would have claimed a completed inventory reduction.

**Fixed at the source rather than in the header file.** `pageMetadata()` now
derives noindex from the same `lib/deindexed.ts` list, so the instruction ships
in each page's own HTML and does not depend on edge path matching:

```
deindexed pages carrying <meta name="robots" content="noindex, follow">: 34 / 34
/tools/sign-image/ (kept):  0
/contact/ (kept):           0
```

The `_headers` rules are corrected to the trailing-slash form and kept as a
second signal, not the only one.

New guard: `test/deindexed.test.ts` asserts `pageMetadata()` returns
`{index: false, follow: true}` for every deindexed path and `undefined` for kept
pages. Confirmed failing when the derivation is removed.

**Live verification — now done, on the deployed site.** The deploy completed
about three minutes after the push. Every one of the 34 was checked, not a
sample:

| Check | Result |
|---|---|
| Live `sitemap.xml` | **160** URLs (was 194) |
| All 34 deindexed pages carry BOTH the meta tag and `X-Robots-Tag` | **34 / 34** |
| Kept tools + trust pages wrongly noindexed (17 checked) | **0** |
| Deindexed URLs still present in the live sitemap | **0** |

One caveat worth recording. The first spot check reported `/tools/auto-crop/`
as missing the meta tag while its header was present. That was a stale edge copy
caught mid-propagation — a cache-busted request returned the tag, and the full
sweep confirms 34/34. Anyone re-checking within a few minutes of a deploy should
append a cache-busting query before concluding a page is wrong.

The meta tag is the load-bearing signal; the header is belt and braces. Both are
present on all 34.

## 2. `_headers` parser could borrow the next block (P2)

Correct. A fixed three-line window meant deleting one route's `X-Robots-Tag` let
the check read the *next* route's header and credit it to the wrong page — so
the guard passed on a page that had lost its rule. It now parses each block up
to the next unindented route. Confirmed failing when a single rule is deleted.

## 3. Store test covered only the manual path (P2)

Correct, and the Round 7 claim that both builders were covered was inaccurate.
`recomputeAuto()` is now exercised, asserting the digital preset receives the
exact size and the print preset does not. Confirmed failing when `exactOutput`
is removed from the **automatic** branch alone — the exact case that previously
left all 518 tests green.

## 4. Commit scope (accepted — the disclosure was wrong)

`09e0cf1` contained 1,913 lines across ten `docs/*.md` files and
`easyphoto.in-audit/QUORA-ANSWERS.md`. The Round 7 disclosure named only
`tsconfig.json`, which understated it.

Those files were **not** deliberately included — the same `git add -A`. They are
split out; the index-reduction commit (`d2d1627`) is now code-only, 11 files.
The documents are untracked again, which is where they were.

---

## Accepted without change

- Not removing eight more tools on a <500-impression line.
- Deindexing the five category hubs stands.

## Outstanding, per your recommendation — not started

1. `ToolDepth` material for the 11 thin-but-earning tools (335–467 words each,
   7,580 impressions between them). Only 17 of 51 tools have depth content.
2. `/exam-requirements/` vs `/tools/exam-package/` (0.6749) and UGC-NET vs
   CSIR-NET (0.6735). We agree that sitting just under a 0.70 line is not
   distinctness; the threshold flatters them.
3. Confirm the reduced inventory in Search Console before any resubmission.

The thin-content gate stays at 300 words until item 1 is done, since raising it
would fail those 11 pages. That is a known gap, not a pass.

## What to check next

1. **Live delivery is verified** (table above), so the open question is no longer
   whether it shipped but whether `noindex, follow` is the right instruction and
   whether Google acts on it. Worth a second opinion on the sweep method: pages
   were fetched with a cache-busting query, which is not what Googlebot does.
2. **Whether `follow` is right.** These pages link to indexed canonicals, so
   `noindex, follow` preserves equity — but they also link to each other.
3. **Whether 160 is still too many** given the 11 thin pages remain indexed
   pending depth content.
