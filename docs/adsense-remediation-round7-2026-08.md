# Round 7 — export fixes accepted, plus the index reduction you asked for

Two things in this round:

1. **Your five findings** — all accepted, all fixed. One was a defect we
   introduced in the fix you requested last round.
2. **The index reduction** — you said Round 6 did not improve AdSense readiness
   because it left 194 URLs, the 300-word gate and the 0.80 threshold untouched.
   That is now done and is the larger part of this review.

**Commits:** `953c174`, `0e8262a`, `513cdc7`, `09e0cf1`. **Unpushed.**
**Gate:** 518 tests, 4 skipped. **Sitemap 194 → 160.**

---

## Part 1 — your five findings

### 1. Exact output broke the crop geometry (P1) — confirmed, worse than reported

You were right, and the numbers are bad:

| | head % of frame | spec band |
|---|---|---|
| Saudi eVisa | **227.5%** | 70–80% |
| Singapore | 78.2% | 70–80% |

`geomDpi` now derives from the canvas actually being produced
(`outH / printMm.height × 25.4`) and drives every millimetre conversion — head
target and eye line. Both records land at **75.5%**.

This was ours, introduced in `0e8262a` — the commit that implemented your
previous finding. Fixing the export size while leaving the geometry on the
nominal DPI made the crop worse than the bug it replaced. Only Singapore was
wrong before; afterwards Saudi was cutting through the face.

### 2. China exceeded its own recorded maximum (P1) — confirmed

33×48mm at 300 DPI produced **390×567**, past the 560 the record itself stores,
and the print ratio (0.6875) cannot yield the required 3:4. Pinned to the
published maximum **420×560**; head lands at 63.6% inside its 58–69% band.

### 3. The exact-output test did not test the wiring (P2) — confirmed

Added `test/storeExactOutput.test.ts`, which drives the store with `@/lib/pipeline`
mocked and asserts the arguments both preset builders receive. Confirmed failing
when `rspec.digital?.px` is removed from the store call. It also asserts the
**print** preset is not forced to the upload size.

### 4. India mis-modelled as `pxMin` (P2) — accepted

Recorded as `px: 630×810`. Exact satisfies both readings — it is ≥ any floor and
matches an exact check — where the DPI path gave 631×811, over on both axes.

We did **not** re-verify against the overseas source; `passportindia.gov.in`
PDFs 403 here. If 630×810 is genuinely a floor rather than a specification, this
is still wrong in a new way.

### 5. India advisory assertion allowed a false pass (P2) — accepted

`expect(spec).not.toBeNull()` now precedes the advisory assertion.

---

## Part 2 — index reduction

We verified the external audit's figures before acting. Every one matched:
51 tool pages, median 379 words, 44 under 500, 30 under 400, and all five
similarity pairs to four decimals (0.7301 / 0.6794 / 0.6650 / 0.6451 / 0.6119).

### What was removed, and on what basis

**34 tool pages deindexed. Sitemap 194 → 160.** Live and linked from `/tools/`,
served `noindex, follow`.

Selected on **traffic, not length**: each is under 500 visible words AND drew
fewer than 100 impressions in the 90 days to 2026-08-02 (GSC, page dimension).
Together: **15 clicks, 465 impressions — 1.7% of site impressions** — against a
third of the indexed inventory.

**Cutting by word count would have been a serious mistake.**
`/tools/sign-image/` is 405 words and earns 178 clicks and 4,973 impressions:
more than half of all tool clicks and 13% of site impressions. A 500-word rule
deletes the best-performing page on the site. Eleven thin pages earn 7,580
impressions between them and were all kept.

The eight policy/trust pages (contact, terms, disclaimer, editorial-policy,
corrections-policy, source-methodology, authors, how-photo-checking-works) were
also kept despite being 306–362 words. They are short by nature and are the
E-E-A-T signals a reviewer looks for; removing them seemed actively harmful.

Worth noting: `/tools/` was already in `EXCLUDED_PREFIXES`, so none of these
pages ever carried ads. They were thin inventory, not low-value content wrapped
around ads.

### The gates

- **Similarity 0.80 → 0.70.** Its comment claimed 0.80 "catches the known
  NDA/CDS clone". That pair measured 0.7301, so the gate had never once
  evaluated the duplication it was written for. Worst pair is now 0.6749.
- **Repeated-paragraph detection added**, because cosine cannot see duplication
  inside one page. It immediately found two real cases: NDA and CDS each printed
  their whole authority paragraph twice (intro + embedded tool), and the tools
  hub repeated six descriptions its own catalog carried below.
- **NDA/CDS differentiated.** They had byte-identical descriptions. Rewritten on
  real distinctions — school-leaver tri-service entry vs the graduate
  IMA/INA/AFA/OTA route. Similarity **0.7301 → 0.6539**.
- **`lastmod` split per section.** One constant restamped all 194 URLs whenever
  any page changed.
- `test/deindexed.test.ts` fails if the sitemap and `_headers` disagree **in
  either direction**, and if a trust page or an earning tool enters the list.
  Confirmed failing when a header block is deleted.

### What we did NOT do

**The thin-content gate is still 300 words.** Raising it fails the 11
thin-but-earning tool pages (335–467 words), which need real depth content via
the existing `ToolDepth.tsx` pattern — only 17 of 51 tools have it. That is the
audit's item 4 and it is genuine writing, not a threshold change. Leaving the
gate at 300 is honest about the current state rather than a pass.

We also did not consolidate `/exam-requirements/` ↔ `/tools/exam-package/`
(0.6749), UGC-NET/CSIR-NET (0.6735) or Canada passport/visa (0.6630).

---

## What to attack

1. **Is 34 the right number, or too timid?** The audit said 25–40. We cut at
   "thin AND <100 impressions". A stricter line (<500 impressions) would remove
   ~8 more, including `resize-kb` and `dpi-converter`.
2. **The 5 category hubs** (`/tools/photo/`, `/pdf/`, `/signature/`,
   `/document/`, `/ocr/`) are in the cut. They are navigation, not articles.
   Deindexing them may be wrong even though they measure thin and earn nothing.
3. **China 420×560 vs 354×472.** We chose the published maximum for quality.
   With a 40–120 KB cap, is the minimum safer?
4. **India `px` change** — made without a readable primary source (see 1.4).
5. **Whether the geometry fix is complete.** `geomDpi` covers head and eye
   targets. `result.dpi` still reports the nominal DPI, and we have not audited
   every other consumer of `spec.dpiMin` in the render path.

## Disclosure

A `git add -A` in this round swept an unrelated pre-existing `tsconfig.json`
change into the deindex commit after we had said we would leave that file alone.
It was backed out; the commit was amended and the file is uncommitted again.

Environment limits unchanged: `canada.ca`, `mofa.go.jp`, `passportindia.gov.in`
PDFs, `passports.gov.au`, `npra.gov.bh`, `irishimmigration.ie`, `dfa.ie`,
`dgip.gov.pk` all 403 or fail to connect. The Japan and India figures in these
commits rest on your readings, not ours.
