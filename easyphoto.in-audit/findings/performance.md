# Core Web Vitals & Performance Audit — easyphoto.in

**Audit date:** 2026-06-20  
**Tool:** PageSpeed Insights (Lighthouse 13) — lab data only  
**CrUX field data:** Not available (insufficient Chrome traffic volume for origin eligibility)  
**Data source note:** All metrics below are Lighthouse lab measurements from a simulated mid-range mobile device unless noted. No 28-day field data is available, so CWV pass/fail cannot be determined from real-user experience — these are lab proxies.

---

## Lighthouse Scores Summary

| Page | Mobile Perf | Desktop Perf | Accessibility | SEO |
|------|-------------|--------------|---------------|-----|
| / (homepage) | **74** | 99 | 96 | 100 |
| /passport-photo/ | **96** | — | 100 | 100 |
| /ssc-photo-resizer/ | **96** | — | 97 | 100 |

---

## Core Web Vitals — Lab Data (Mobile)

### Homepage (/)

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | **5.0 s** | ≤2.5 s Good / >4.0 s Poor | FAIL — POOR |
| CLS | **0** | ≤0.1 | PASS |
| TBT (INP proxy) | **110 ms** | ≤200 ms Good | PASS |
| FCP | 3.4 s | — | Poor |
| TTI | 5.0 s | — | Needs work |
| TTFB | **7 ms** | ≤200 ms | Excellent |

### /passport-photo/

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | **2.8 s** | ≤2.5 s Good, ≤4.0 s NI | NEEDS IMPROVEMENT |
| CLS | **0** | ≤0.1 | PASS |
| TBT | **40 ms** | — | Excellent |
| FCP | 1.0 s | — | Excellent |
| TTI | 4.9 s | — | Elevated (ad scripts) |

### /ssc-photo-resizer/

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | **2.7 s** | ≤2.5 s Good, ≤4.0 s NI | NEEDS IMPROVEMENT |
| CLS | **0** | ≤0.1 | PASS |
| TBT | **60 ms** | — | Excellent |
| FCP | 0.9 s | — | Excellent |
| TTI | 5.0 s | — | Elevated (ad scripts) |

---

## Root Cause Analysis

### Finding 1 — Google Ads scripts are the primary LCP killer on the homepage (CRITICAL)

Google/Doubleclick Ads is the single largest third-party contributor:
- `show_ads_impl_fy2021.js` — **173 KB**, 238 ms JS execution, 102 ms scripting, 73 ms parse/compile; causes a **102 ms long task** at t=4,326 ms
- `adsbygoogle.js` — **56 KB**, contributes a **77 ms long task** at t=2,449 ms
- Total Google Ads main-thread time: **139 ms** on mobile
- Total transfer: **229 KB**
- Unused bytes in `show_ads_impl`: **130 KB** (75% dead weight on this page)
- Unused bytes in `adsbygoogle.js`: **29 KB** (53%)

The ads scripts load synchronously alongside page hydration, pushing the LCP element past 5 s on mobile. The same scripts appear on inner pages but, because those pages have lighter HTML, the LCP element (hero tool UI) renders earlier and is not blocked as severely.

### Finding 2 — Render-blocking CSS present on every page (HIGH)

`/_next/static/css/b1470b32ce00af17.css` (14 KB) is flagged as render-blocking on all three pages, wasting 150–160 ms before first paint. Next.js generates this as the global compiled stylesheet. It should either be inlined for critical rules or loaded with `media="print" onload="this.media='all'"` for non-critical styles.

### Finding 3 — Critical request chain / network dependency tree (HIGH)

Lighthouse flags a multi-level request chain on all pages. The chain is: HTML → CSS + JS bundles → web fonts (3 woff2 files totalling **108 KB**, loaded at t≈500 ms on homepage). The fonts are preloaded but still form a dependency chain that delays LCP text rendering.

Three fonts are loaded on every page:
- `36966cca54120369-s.p.woff2` — 24 KB  
- `558ca1a6aa3cb55e-s.p.woff2` — 33 KB  
- `e4af272ccee01ff0-s.p.woff2` — 50 KB ← largest, finishes last at t=823 ms on homepage

### Finding 4 — Legacy JavaScript polyfills in chunk 1255 (HIGH)

`_next/static/chunks/1255-426489508942ad19.js` (47 KB) contains **11.8 KB of legacy JavaScript polyfills** that are unnecessary for modern browsers (Baseline-compliant features being transpiled). This chunk also accounts for 107–141 ms of JS execution time on every page. Updating the Next.js `browserslist` / Babel targets to exclude IE 11 and legacy Chrome would eliminate this waste.

### Finding 5 — Forced reflow on /passport-photo/ and desktop homepage (HIGH)

Lighthouse flags a forced reflow audit failure on /passport-photo/ (mobile) and on the desktop homepage. This indicates JavaScript is reading geometric layout properties (`offsetWidth`, `getBoundingClientRect`, etc.) immediately after a DOM/style mutation, forcing the browser to synchronously recalculate layout. This pattern commonly appears in canvas measurement code, MediaPipe model setup, or responsive resize handlers. On tool pages with heavy canvas operations this compounds TTI delay.

### Finding 6 — Cloudflare Analytics beacon sub-optimal caching (MEDIUM)

`beacon.min.js` from `static.cloudflareinsights.com` has only a 1-day cache TTL (`86400000 ms`). While this is not user-controllable, the beacon fires on every page adding 11–12 KB of transfer on cache-miss. Consider verifying the CF Analytics load strategy (async, defer).

### Finding 7 — Large first-party JS chunks on homepage (MEDIUM)

Two first-party chunks are expensive on the homepage:
- `4bd1b696-100b9d70ed4e49c1.js` — **56 KB**, 122 ms execution, **107 ms long task** at t=4,068 ms
- `1255-426489508942ad19.js` — **47 KB**, 141 ms execution

These are the Next.js vendor and feature chunk bundles loaded for the homepage. The 107 ms long task from `4bd1b696` fires late (t=4,068 ms) and is the first-party contributor to the high TTI.

### Finding 8 — 108 KB web font payload on every page (MEDIUM)

Three font files total 108 KB on every page. The largest (`e4af272ccee01ff0`, 50 KB) is the bottleneck. With `font-display: swap` or `optional` and subsetting to the character sets actually used, this can be reduced significantly. The current configuration uses `font-display: swap` per Next.js defaults but all three files load on initial render rather than progressively.

### Finding 9 — DOM size 1,049 elements, body has 111 direct children (MEDIUM)

The homepage DOM has 1,049 total elements — well below the 1,500 danger threshold but notable. The `body` element has 111 direct children, which indicates flat structure (likely ad slots, script injections, and portal roots). Style & layout cost is 156 ms on mobile. As the mega-menu and tool presets grow, this will approach the warning zone.

### Finding 10 — Cross-origin policy block logged (MEDIUM)

Chrome DevTools Issues panel flags a "Blocked by cross-origin policy" error on all pages. This is most likely a CORS or COEP header conflict caused by the Google Ads iframe or a media/font resource. This surfaces as `inspector-issues` in Lighthouse. It does not directly affect CWV but indicates a misconfigured cross-origin isolation setup that should be resolved before enabling advanced APIs (SharedArrayBuffer for WASM threading).

### Finding 11 — Color contrast failures on homepage (LOW / ACCESSIBILITY)

Three `<span class="font-mono text-[28px] font-bold leading-none text-hairline-strong">` elements (the "01", "02", "03" step-number counters in the how-it-works section) fail WCAG AA contrast ratio requirements. Both mobile and desktop Lighthouse flag this. The `text-hairline-strong` token does not have sufficient contrast against its background.

### Finding 12 — `<dl>` structure invalid on /ssc-photo-resizer/ (LOW / ACCESSIBILITY)

The SSC resizer page contains a `<dl>` element that does not follow the required `<dt>/<dd>` group ordering, causing screen reader confusion. This is a markup issue in the metadata/specs section of the tool.

### Finding 13 — Identical links flagged in exams section (LOW)

Two `<a class="text-brand">` links in `section#exams` share identical accessible names but point to different destinations, flagged by Lighthouse. This is an accessibility pattern issue — links with the same text should have `aria-label` disambiguation.

---

## Third-Party Impact Table (Homepage Mobile)

| Entity | Transfer | Main Thread Time |
|--------|----------|-----------------|
| Google/Doubleclick Ads | 229 KB | 139 ms |
| adtrafficquality.google | 22 KB | 13 ms |
| Cloudflare Analytics | 24 KB | 21 ms |
| Other Google APIs | 1.6 KB | 2 ms |
| **Total third-party** | **~276 KB** | **~175 ms** |

Third-party code represents approximately **40% of total page transfer** and **~17% of main-thread time** on mobile. The Google Ads stack alone accounts for 36% of all transferred bytes.

---

## What Is Working Well

- **TTFB is excellent** — 7 ms server response time; Cloudflare CDN edge delivery is working perfectly
- **CLS is perfect (0)** across all pages — no layout shift issues whatsoever
- **TBT is excellent** on tool pages (40–60 ms) — main thread is not heavily blocked on inner pages
- **Desktop performance is outstanding** — 99/100 score, LCP 0.6 s
- **Total byte weight is well-controlled** — 659–679 KB total transfer on tool pages is reasonable given the ML model context
- **SEO is perfect (100)** across all three pages
- **Accessibility is strong on /passport-photo/** — 100/100
- **HTTP/2 used** throughout — parallel resource loading is active
- **No CLS issues** despite dynamic canvas rendering and model loading — excellent engineering discipline
- **WASM/ML deferral appears effective** on inner pages — TBT stays low meaning the heavy MediaPipe model loading is correctly deferred off the critical path

---

## Prioritized Recommendations

### P0 — Critical (estimated LCP improvement: 1.5–2.5 s on homepage mobile)

**1. Lazy-load Google Ads on the homepage below the fold**

The homepage LCP degrades from excellent (desktop: 0.6 s) to poor (mobile: 5.0 s) almost entirely due to Google Ads scripts loading synchronously during hydration. Implement ad lazy loading:

```js
// In the homepage ad component
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      loadAdScript(); // inject <script> tag here, not at parse time
    }
  }, { rootMargin: '200px' });
  observer.observe(adSlotRef.current);
}, []);
```

For AdSense specifically, use the `data-full-width-responsive` lazy attribute and ensure the `<script>` tag for `adsbygoogle.js` has `async` and is deferred until after LCP fires (use `requestIdleCallback` or `setTimeout(0)` post-LCP).

**2. Inline critical CSS, load global CSS asynchronously**

The 14 KB CSS file `b1470b32ce00af17.css` is render-blocking on all pages. Extract above-the-fold critical CSS and inline it in `<head>`. Load the full stylesheet non-blocking:

```html
<link rel="preload" href="/_next/static/css/b1470b32ce00af17.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/_next/static/css/b1470b32ce00af17.css"></noscript>
```

In Next.js App Router this requires a custom `_document` approach or a third-party critical CSS plugin.

### P1 — High (estimated LCP improvement: 200–400 ms)

**3. Update browserslist targets — eliminate legacy JS polyfills**

In `package.json` or `.browserslistrc`, set modern targets to stop transpiling Baseline features:

```json
"browserslist": [
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Safari versions",
  "last 2 Edge versions",
  "not dead",
  "> 0.5%"
]
```

This removes the 11.8 KB of polyfills in chunk `1255` that are being wasted on every page load.

**4. Fix forced reflow in canvas/tool initialization code**

Profile the /passport-photo/ page in Chrome DevTools Performance panel, specifically the "Layout" events triggered by JavaScript. Batch DOM reads before writes using patterns like:

```js
// BAD — triggers reflow on each read
elements.forEach(el => { el.style.height = el.offsetHeight + 'px'; });

// GOOD — read all, then write all
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => { el.style.height = heights[i] + 'px'; });
```

For canvas measurement code, use `ResizeObserver` instead of polling `offsetWidth`.

**5. Subset and optimize web fonts**

The three woff2 fonts total 108 KB. Actions:
- Subset to the Unicode ranges actually used (Latin + Devanagari if Hindi UI is planned, otherwise Latin only)
- Use `font-display: optional` for non-critical fonts to prevent FOUT from delaying LCP
- Consider dropping one of the three weights if the design system can accommodate the consolidation
- Ensure `<link rel="preload" as="font" crossorigin>` is present only for the font used in the LCP text element

### P2 — Medium (quality improvements)

**6. Investigate and resolve cross-origin policy block**

Enable `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` where possible. Currently a resource is being blocked. Identify which resource via Chrome DevTools Issues panel and either add `crossorigin="anonymous"` to the element, or add the appropriate CORS header on the Cloudflare Pages `_headers` file.

**7. Reduce body direct-child count**

Body has 111 direct children — likely a mix of ad portal roots, script tags, and toast/modal portals injected by Next.js. Audit and consolidate portal mount points. Target: fewer than 60 direct body children.

**8. Fix `<dl>` structure on /ssc-photo-resizer/**

Correct the definition list markup so each `<dt>` is immediately followed by its `<dd>`. This is a structural fix in the specs/metadata component of the SSC resizer tool.

### P3 — Low / Accessibility

**9. Fix color contrast on step-number counters**

The "01", "02", "03" counter spans use `text-hairline-strong` which is insufficiently contrasted against the background. Change the Tailwind token or add explicit color:

```diff
- <span className="font-mono text-[28px] font-bold leading-none text-hairline-strong">
+ <span className="font-mono text-[28px] font-bold leading-none text-muted-foreground">
```

Ensure the replacement token achieves at least 4.5:1 contrast ratio (WCAG AA).

**10. Disambiguate identical link text in exams section**

Add `aria-label` to the duplicate links in `section#exams`:

```jsx
<a href="/exam-1/" aria-label="View UPSC passport photo requirements" className="text-brand">
  View requirements
</a>
```

---

## Performance Characteristic Summary

The homepage performance profile is dominated by one root cause: Google Ads loading synchronously during the critical render path on mobile. The mobile/desktop performance divergence (74 vs 99) is almost entirely explained by this — desktop's faster CPU and network conditions allow ads to execute before the LCP deadline; mobile cannot. Inner pages (passport-photo, ssc-photo-resizer) are genuinely well-optimized at 96/100 mobile — the ML model and WASM loading is correctly deferred.

Fixing ad lazy loading alone is expected to bring homepage mobile LCP from 5.0 s into the 2.0–2.5 s range, moving it from POOR to GOOD in one change.

---

## Audit Scope Notes

- CrUX field data unavailable — the site does not yet have sufficient Chrome user volume (75th percentile data requires a meaningful number of real visits in the 28-day CrUX collection window). As traffic grows, monitor via `python3 scripts/crux_history.py https://easyphoto.in --json` or CrUX Vis (https://cruxvis.withgoogle.com).
- INP field data cannot be collected without CrUX eligibility. TBT (Total Blocking Time) is used as the lab proxy for INP. Current TBT values (40–110 ms) suggest INP will be Good when field data becomes available.
- Desktop performance is excellent across the board and requires no immediate action.
