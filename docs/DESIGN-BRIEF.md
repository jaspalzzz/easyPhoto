# easyPhoto — Redesign Brief (Hybrid: keep identity, add warmth)

**Goal:** close the "looks austere vs iLovePDF / Smallpdf" gap while KEEPING the
trust-building, distinctive brand. Competitive *and* still recognisably easyPhoto.
Do **not** turn it into a generic colorful clone.

**Audience:** people making passport/visa/exam photos & resizing documents — many
on mobile, in India. They expect the friendly, card-based feel of iLovePDF/Smallpdf,
but they also need to TRUST that the specs are official.

---

## Direction (what to change)

### 1. Tool listings → a card grid (highest-impact change)
- Convert the hairline-divided tool **lists** (the `.register` grid on `/tools/`,
  `/convert/`, homepage tool strips, exam hub) into a **grid of distinct cards**:
  rounded corners, subtle border + soft shadow, gentle hover lift (translateY -2px
  + shadow), comfortable padding.
- Each card = one tappable tile. On mobile, 1–2 cols; tablet 2; desktop 3.

### 2. Add color — per-category icon accents
- Give tool icons a **distinct accent color** by category (e.g. Photo = teal,
  PDF = a warm red/orange family, Signature = indigo/violet, Privacy/Aadhaar =
  green). Put each icon in a **soft tinted rounded-square badge** (icon color at
  ~12% bg, full-color stroke) — like Smallpdf's colored tool icons.
- Keep it tasteful: a small, harmonious palette, not a rainbow.

### 3. Cleaner surfaces
- Shift the page background from warm cream toward a **cleaner near-white**
  (a very subtle warm white is fine — don't go pure clinical white, keep a hint of
  warmth so it's not sterile). **Cards/surfaces = white.**
- Increase contrast between background and cards so tiles "pop".

### 4. Friendlier typography
- Soften the **monospace UPPERCASE eyebrows** ("MOST POPULAR", "PASSPORT, EXAM &
  DOCUMENT TOOLS") to normal-case, friendlier section headers.
- KEEP monospace only for **spec/data** (e.g. "35 × 45 MM · 300 DPI", KB sizes) —
  there it reinforces precision and trust. Don't kill it everywhere.

### 5. Buttons & CTAs
- Slightly larger, rounder primary buttons. Keep the orange "stamp" CTA as the
  single primary action per view; teal for secondary/links.

---

## KEEP (do NOT remove — these are the brand & the trust)
- **Brand colors:** teal (`--brand`) wordmark/links/active, orange (`--cta`) primary action.
- **Trust signals:** TrustPills ("100% private", "Free · no watermark", "Official
  sources"), the "official source · verified on {date}" provenance on exam pages,
  compliance-check messaging. These are the differentiator — keep them prominent.
- The **scanner loading motif** (`ProcessingState` / `ScanProgress`) — it's premium.
- The **compliance result card** look, the spec sheets, the passport precision feel.
- The mega-menu structure (3-column, no scroll).

---

## HARD CONSTRAINTS (must not break — these fail verification)

1. **NEVER touch `store/useToolStore.ts`** — the device/engine matrix (iOS→wasm/q8;
   f16 GPU→webgpu/fp16; else→wasm/fp32). This is sacred. `git diff` must be 0 lines.
2. **Do not change tool logic / pipelines / lib functions** — this is a *visual*
   redesign only. No changes to `lib/pipeline.ts`, `lib/imaging.ts`, `lib/compress.ts`,
   `lib/segmentation.ts`, `lib/portalPresets.ts`, etc.
3. **Do not break SEO/structured data:**
   - Keep every page's `<title>`, `<meta description>`, canonical (via `pageMetadata`).
   - Keep ALL JSON-LD (`lib/schema.ts` usage): Organization, WebSite, BreadcrumbList,
     SoftwareApplication, HowTo, FAQPage, BlogPosting. Do not drop any.
   - Keep one `<h1>` per page and logical h2/h3 order. Don't demote headings to divs.
   - Keep `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt` working and unchanged in output.
   - Keep image `alt` text.
4. **Do not change routes, slugs, or folder names** — breaks the sitemap & rankings.
5. **Keep the static export working** (`output: "export"`). No server-only features,
   no `next/image` optimization (it's disabled), no runtime data fetching.
6. **Accessibility (WCAG 2.1 AA):** text contrast ≥ 4.5:1, visible `:focus-visible`,
   touch targets ≥ 44px, respect `prefers-reduced-motion`. Don't regress the skip-link,
   focus traps (MobileNav), or aria attributes.
7. **Work through design tokens** in `app/globals.css` (the `--paper`, `--brand`,
   `--card`, `--hairline` … HSL vars) and Tailwind config — change token *values* and
   component classes; don't scatter hardcoded hex colors across components.
8. **Performance:** no heavy illustration/image bloat. Keep First-Load JS roughly where
   it is. No new large dependencies for styling.

---

## Suggested file touch-points (visual layer only)
- `app/globals.css` — token values (paper→whiter, add category accent tokens), `.tile`,
  `.register`, `.panel`, `.eyebrow`, button styles.
- `tailwind.config.*` — any new accent color tokens.
- `components/site/*` — MainNav, Footer, TrustStrip, ToolIcon (colored badges), HowItWorks.
- `components/tools/CategoryPage.tsx`, `app/tools/page.tsx`, `app/convert/page.tsx`,
  `app/exam-requirements/page.tsx` — the card grids.
- `app/page.tsx` — homepage hero + tool strips.
- `components/ui/button.tsx` — rounder/larger variants.

---

## Verification checklist (what the reviewer will run before approving)
1. `npm run build` passes, **330 static pages**, no errors; `npx tsc --noEmit` clean.
2. `git diff --stat store/useToolStore.ts` → **0 changes**.
3. SEO intact: spot-check built HTML for `<title>`, canonical, and the JSON-LD
   `@type`s on homepage / a tool page / an exam page / a blog post. `out/llms.txt`,
   `out/sitemap.xml`, `out/robots.txt` still emit correctly.
4. Functionality smoke test (in preview): compliance checker runs, a KB resizer runs,
   exam-package flow works, background remover loads.
5. Visual review (screenshots, desktop + mobile): homepage, `/tools/`, a tool page,
   a maker page, an exam page — confirm card-grid + color + cleaner surfaces, AND
   that teal/orange brand + trust signals are intact.
6. A11y: contrast AA on new colors, focus states visible, touch targets, reduced-motion.
7. No regression in: mega-menu (no scroll), loading states, the compliance result card.

**A redesign that breaks any HARD CONSTRAINT is rejected regardless of how good it looks.**
