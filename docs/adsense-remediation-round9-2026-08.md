# Round 9 — pre-crawl check. Please review before Google recrawls.

Round 8's four findings are all fixed and **verified on the live site**. This
round is a self-check we ran before requesting a recrawl, on the reasoning that
a wrong state is cheap to fix now and expensive once Google has indexed it.

It found a real problem we had introduced and not noticed.

**Live now:** `07db173..374596d`. **Sitemap 194 → 159.** 522 tests, 4 skipped.

---

## Verified live (deployed site, not the build)

| Check | Result |
|---|---|
| Live `sitemap.xml` | **159** URLs |
| All deindexed pages carrying meta tag AND `X-Robots-Tag` | **35 / 35** |
| Kept tools + trust pages wrongly noindexed (17 checked) | **0** |
| Deindexed URLs present in the live sitemap | **0** |
| Indexed pages canonicalising to a deindexed URL | **0** |
| Deindexed pages self-canonicalising | **35 / 35** |

## What the pre-crawl check found

### Breadcrumb schema pointed at pages we asked Google to drop

Deindexing the five category hubs (`/tools/photo/`, `/ocr/`, `/signature/`,
`/document/`, `/pdf/`) — which you reviewed as reasonable — left **14 indexed
tool pages publishing `BreadcrumbList` schema whose parent was a noindexed
page**. Every tool that stayed in the index was advertising a hierarchy
terminating on a page Google is instructed to drop.

We had not considered this when making the cut, and it would have been baked in
at recrawl.

Fixed in `ToolPage.tsx`: when a category hub is deindexed, both the visible
trail and the schema step straight from Tools to the tool. Verified: **0**
indexed pages now reference a deindexed URL in structured data, down from 14.

### One page over

That left `/unlock-aadhaar-pdf/` — a 372-word guide with **zero clicks and zero
impressions** in 90 days — whose schema pointed at the deindexed
`/tools/unlock-pdf/`. It met the same thin-and-no-traffic rule as the 34 and is
now deindexed with them. 34 → 35, sitemap 160 → 159.

### Two infrastructure gaps the above exposed

- `app/sitemap.ts` filtered only the tool and category groups. A deindexed path
  in `simpleRoutes` or `ogRoutes` would still have been listed — which is
  exactly what `/unlock-aadhaar-pdf/` is. All groups now filter.
- The `_headers` parity check only examined paths starting `/tools/`, so it
  would have silently skipped the new entry. It now reads any route.

---

## What we would like checked before we request a recrawl

1. **Is skipping the deindexed hub the right breadcrumb fix, or should the five
   hubs be re-indexed?** They are the natural parents of the 17 tools that
   stayed. We chose a flatter hierarchy over re-adding thin pages, but the
   opposite call is defensible and this is the moment to make it.
2. **`noindex, follow` vs `noindex, nofollow`.** The 35 link to indexed
   canonicals, so `follow` preserves equity — but they also link to each other,
   and to the hubs that are themselves noindexed.
3. **Anything else that assumes the old hierarchy.** We checked canonicals,
   `BreadcrumbList`, and sitemap membership. We did not audit `SoftwareApplication`
   or `ItemList` schema, internal anchor text, or the `_redirects` file for rules
   whose target is now deindexed.
4. **Whether the recrawl should be requested at all yet**, given the 11
   thin-but-earning tools still have no depth content and the two near-duplicate
   pairs (0.6749, 0.6735) are unresolved. If those are going to change, it may be
   better to land them first and recrawl once.

## Still outstanding — unchanged, not started

1. `ToolDepth` material for the 11 thin-but-earning tools.
2. `/exam-requirements/` vs `/tools/exam-package/`; UGC-NET vs CSIR-NET.
3. Thin-content gate stays at 300 words until item 1 lands. Known gap, not a
   pass.

## Method caveat

Live pages were fetched with a cache-busting query string, which is not what
Googlebot does. An early spot check reported one page missing its meta tag; that
was a stale edge copy caught mid-propagation, and the cache-busted full sweep
returned 35/35. If you re-check within a few minutes of a deploy, bust the cache
before concluding a page is wrong.
