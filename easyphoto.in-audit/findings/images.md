# Images SEO Audit — easyphoto.in (RE-AUDIT)

**Audit date:** 2026-07-02
**Baseline:** 2026-06-23, Images score **25/100** (worst category in the full-site audit at that time)
**Method:** Static codebase audit — grepped `app/`, `components/`, `public/images/` for every `<Image>` (next/image) and `<img>` usage, cross-referenced against actual file sizes in `public/images/` and the deployed `out/` static export, and read source for every homepage/blog/tool/exam-requirements image consumer. No live browser rendering in this pass (see Scope note).
**Cross-reference:** A separate Google API re-audit already flagged `sample4_before`/`sample4_after` (~144 KiB combined savings opportunity) as the top lab-flagged image-delivery item. That finding is **not re-derived here** — treated as known. This audit found additional, larger issues the lab tool didn't surface (see below).

## Score: 52/100

Up from 25/100, but well short of "fixed." The baseline's PNG-hero/no-lazy-loading problems on the **critical path (homepage LCP)** are genuinely resolved — WebP + `fetchPriority="high"` + preload for the hero, confirmed live elsewhere in this audit cycle (CrUX mobile LCP p75=1,894ms GOOD, CLS 0.0 GOOD). But the fix was scoped narrowly to the hero/LCP image pair and did not extend to the rest of the image inventory: **12 of 19 raster images actually referenced in live code are unconverted PNGs, 500–820 KB each**, including one on the homepage itself and seven across blog posts. Alt text and CLS-prevention patterns are otherwise solid site-wide.

---

## Fix-Verification Against What's Already Known-Fixed

| Baseline finding (2026-06-23) | Status now | Verification |
|---|---|---|
| PNG hero causing 10,501ms mobile LCP | **Fixed** — hero now WebP, `fetchPriority="high"`, `<link rel="preload">` in `app/layout.tsx:129` | `components/site/HeroVisual.tsx` serves `sample4_before/after...webp`; confirmed live in `technical.md` re-audit same cycle |
| CLS from unsized images | **Fixed for the hero** — parent containers use CSS `aspectRatio: "3/4"` to reserve space pre-load | `HeroVisual.tsx` lines 26, 94; CrUX field CLS = 0.0 (GOOD) corroborates |
| (Lab tool) sample4_before/after oversized, ~144 KiB savings | **Known, not re-derived** — carried forward from Google API re-audit | Per task instructions |

**What the baseline's 25/100 did NOT fully fix:** the baseline evidently treated "the hero image" as the whole Images problem. It wasn't — it was the LCP problem. The broader image inventory (blog cover images, a second homepage section, one blog post that skipped an available WebP) was out of scope for that fix and remains PNG-heavy.

---

## Detailed Findings

### 1. Alt text coverage — GOOD (no fix needed)

Sampled homepage, an exam-requirements page, a tool page, and multiple blog posts. Alt text is descriptive and specific throughout the content surfaces that matter for SEO:

- Homepage (`HeroVisual.tsx`): `"Example selfie — before AI processing"`, `"Compliant passport photo — after AI processing"` — specific, not generic.
- Homepage (`WhyRejected.tsx`): `"AI-corrected government-compliant passport photo"`.
- Blog (`indian-passport-photo-size-rules/page.tsx`): `"Indian passport photo size diagram showing 35×45 mm frame, face height zone of 25–35 mm, and compliance requirements"` — genuinely descriptive, includes real spec numbers, good for image-search intent.
- Blog posts using external Unsplash imagery (`pan-card-photo-size`, `driving-licence-photo-size-sarathi`, `how-to-remove-background-from-photo-free`, etc.): alt text is contextual, e.g. `"Hand signing on the signature line of an official document — PAN card signature requirement"`, not stock-photo boilerplate.
- `exam-requirements/[exam]/page.tsx` and `DocPhotoLanding.tsx` (used across maker/passport-photo landing pages): no raster images at all — content is SVG-diagram and text-driven, so no alt-text surface to fail on.
- Decorative images correctly use `alt=""` + `aria-hidden`: `components/site/Flag.tsx` (country flags, always paired with adjacent visible text) and `components/site/ScanProgress.tsx` (runtime scan animation of the user's own uploaded photo). These are correct implementations, not violations.

**One recurring weakness:** `components/site/RealTransformations.tsx` uses identical generic alt text `"Before transformation"` / `"After transformation"` repeated 4× — but this component is **dead code**, not imported anywhere in `app/`. Not a live SEO issue; flagged only so it isn't "fixed" by accident later without noticing it's unused. Same for `components/site/ComplianceEngine.tsx` (also unused, also has an image at `sample7_after`).

### 2. Image format — MAJOR GAP (primary score driver)

`public/images/` contains 26 PNGs. Only 6 have a WebP sibling. Cross-referencing against what's **actually imported in live, rendered code** (excluding the two dead components above):

**PNGs served raw in production, no WebP/AVIF equivalent, 500 KB+ each:**

| File | Size | Where it's used |
|---|---|---|
| `sample3_before_1782052921301.png` | 728 KB | `WhyRejected.tsx` (homepage) |
| `sample6_after_1782053037309.png` | 576 KB | `WhyRejected.tsx` (homepage) |
| `upsc-cse-ias-photo-signature-guide-2026.png` | 716 KB | Blog cover, `upsc-cse-ias-photo-signature-guide-2026` |
| `exam-photo-signature-size-guide.png` | 632 KB | Blog diagram, `exam-photo-signature-size-guide` |
| `passport-photo-background-color.png` | 632 KB | Blog diagram, `passport-photo-background-color` |
| `indian-passport-photo-size-rules.png` | 620 KB | Blog diagram, `indian-passport-photo-size-rules` |
| `add-name-date-on-exam-photo.png` | 596 KB | Blog diagram, `add-name-date-on-exam-photo` |
| `baby-and-infant-passport-photo-guide.png` | 572 KB | Blog cover, `baby-and-infant-passport-photo-guide` |
| `best-free-exam-photo-resizer-india.png` | 520 KB | Blog cover, `best-free-exam-photo-resizer-india` |

That's **9 distinct oversized PNGs across 8 pages** (one homepage section + 7 blog posts), all with zero format optimization, on top of the 2 already-known `sample4` samples.

**A ninth, separate bug — wrong asset picked despite an optimized one existing:** `app/blog/how-to-prepare-documents-for-exam-applications-india/page.tsx` (lines 89, 101) references `sample2_before_1782052888740.png` (819 KB) and `sample2_after_1782052904856.png` (573 KB) — but `sample2_before...webp` (125 KB) and `sample2_after...webp` (86 KB) **already exist in `public/images/`**, just unused on this page. This is the single highest-leverage fix in this audit: swapping two `src` strings recovers ~1.18 MB combined per page load with zero new asset work.

**Root cause:** `next.config.mjs` sets `images: { unoptimized: true }` because the app uses `output: "export"` (static export, required for the per-country SSG pages and the no-backend privacy model). This is architecturally correct and should not change — but it means Next.js's automatic image optimization is fully disabled, so **every** raster image must be pre-optimized at the source (manually converted to WebP before commit) or it ships raw. The WebP hero conversion proves the team knows this pattern; it just wasn't applied past the hero.

No AVIF anywhere in the codebase — WebP-only where conversion happened. Not flagged as a separate deduction (WebP is sufficient for the vast majority of current browser support and the marginal AVIF gain is small versus the PNG→WebP gap, which is the real problem).

### 3. Dimensions/CLS — GOOD (no fix needed)

- Hero images: parent containers set `style={{ aspectRatio: "3/4" }}` before the image loads, correctly reserving layout space. Matches the CrUX field CLS = 0.0 (GOOD) result.
- `next/image` usages (`WhyRejected.tsx`, blog diagram images) all pass explicit `width`/`height` props — even though `unoptimized: true` strips the optimization benefit, the width/height attributes still render into the HTML `<img>` tag and still prevent CLS, which is the mechanism that matters for this check.
- Blog posts using raw `<img>` with external Unsplash sources also set explicit `width={1200} height={630}`.
- No unsized raster images found in any content surface sampled.

### 4. Lazy loading — GOOD, one gap on homepage

- Blog post `<img>` tags (Unsplash-sourced, below-the-fold): `loading="lazy"` explicitly set — confirmed on 6 blog posts, 16 occurrences.
- Hero images (`HeroVisual.tsx`): correctly **not** lazy-loaded — `fetchPriority="high"` on the before-image, eager by omission on the after-image (both above the fold, both plausible LCP candidates depending on load order). Correct pattern.
- **Gap:** `WhyRejected.tsx`'s `sample6_after` image (homepage, likely below the hero fold) has no `loading="lazy"` attribute and no `fetchPriority` — it's a plain `next/image` with neither eager-priority nor explicit lazy hints, so it falls back to the browser/Next default. Low severity by itself, but combined with the 576 KB file size (see below) it's a below-the-fold image that should be trivially marked `loading="lazy"` and isn't.

### 5. File sizes — CRITICAL, largest deduction driver

Beyond the two already-known `sample4` images:

- **9 additional images >500 KB** actively served in production (list in Format section above) — all exceed the 500 KB critical threshold in this rubric, several by 40-60%.
- **2 images >800 KB** (`sample2_before` at 819 KB used on the exam-documents blog post instead of its own 125 KB WebP twin, and `sample3_before` at 728 KB on the homepage) are the worst offenders.
- Total avoidable payload across the 9 PNG-without-WebP items plus the sample2 misconfiguration is well over **4 MB** of unnecessary transfer across the pages that reference them — concentrated on 1 homepage section + 8 blog posts, i.e. ongoing organic-traffic surfaces, not edge cases.
- No image in the live inventory exceeds 1 MB, so there's no "critical-critical" outlier, but the sheer count of 500 KB+ files sitting on public-facing, indexed URLs is the main reason this category can't score higher yet.

---

## Scope Note

This audit is source/codebase-based (file sizes on disk + `out/` static export, which mirrors what Cloudflare serves since `output: "export"` produces a fully static site with no server-side re-compression). It does not include live Lighthouse/PageSpeed byte-transfer numbers (gzip/Brotli compression will reduce PNG-over-the-wire somewhat, but PNG doesn't compress like a photographic format compresses under WebP's actual re-encoding — the gap will remain large). Recommend a follow-up `seo-google` PageSpeed Insights pass on `/`, `/blog/how-to-prepare-documents-for-exam-applications-india/`, and `/blog/upsc-cse-ias-photo-signature-guide-2026/` post-fix to confirm the measured byte savings.

---

## Issues (Prioritized)

| # | Severity | Finding | Fix |
|---|----------|---------|-----|
| 1 | **Critical** | `sample2_before/after` PNGs (819 KB + 573 KB) used on `how-to-prepare-documents-for-exam-applications-india` blog post despite matching WebP versions (125 KB + 86 KB) already existing in `public/images/`. | One-line `src` swap ×2 in `app/blog/how-to-prepare-documents-for-exam-applications-india/page.tsx` (lines 89, 101). Zero new asset work, ~1.18 MB saved per page load. |
| 2 | **High** | 9 more PNGs (520–728 KB each) served with no WebP equivalent: `sample3_before`, `sample6_after` (homepage, `WhyRejected.tsx`) + 7 blog diagram/cover images. | Convert each to WebP (same pipeline already used for the `sample4`/`sample2`/`sample8` hero set — `cwebp` or `sharp` at ~85% quality), update `src` references. Expect 80-90% size reduction based on the existing WebP conversions' ratios (e.g. sample2_before 819KB→125KB = 85% reduction). |
| 3 | **Medium** | `WhyRejected.tsx`'s homepage image (`sample6_after`, 576 KB) has no `loading="lazy"` or `fetchPriority` — falls back to default behavior despite being a below-the-fold, non-LCP image. | Add `loading="lazy"` to the `next/image` usage at `components/site/WhyRejected.tsx:186`. |
| 4 | Low | Two components (`RealTransformations.tsx`, `ComplianceEngine.tsx`) reference more oversized PNGs (`sample3`, `sample6_before`, `sample7`, `sample8`) and use generic repeated alt text, but are dead code — not imported anywhere in `app/`. | No SEO action needed. Flagging so these aren't mistaken for live surfaces in a future pass, or clean up as dead code separately (not an SEO task). |
| 5 | Low | No AVIF format used anywhere; WebP-only. | Optional — WebP already captures the bulk of the win. Low priority relative to Issues #1-2. |

**No alt-text, dimension/CLS, or lazy-loading defects found on any live, indexed content surface** beyond Issue #3 above — the baseline's structural problems in those three sub-areas appear to have been addressed as a byproduct of the general Next.js `<Image>`/pattern discipline used across the codebase, not through targeted remediation, but the result holds up.

---

## Summary of Category Pass/Fail

| Sub-check | Status |
|---|---|
| Alt text coverage | PASS |
| Image format (WebP/AVIF adoption) | **FAIL** — 12 unconverted PNGs 500KB+ live in production, one with an unused WebP twin sitting right next to it |
| Dimensions/CLS prevention | PASS |
| Lazy loading (non-hero) | PASS (1 minor gap, Issue #3) |
| Hero/LCP priority handling | PASS (confirmed elsewhere this cycle) |
| File sizes (>200KB / >500KB thresholds) | **FAIL** — 9 additional images beyond the known `sample4` pair exceed 500KB |
