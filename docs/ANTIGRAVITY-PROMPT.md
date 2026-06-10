# Antigravity Prompt v2 — easyPhoto Premium Redesign (DECISIVE spec)

> Paste everything below the line into Antigravity. It is self-contained and prescriptive.
> The previous attempt was TOO TIMID (10%-opacity icon tints, kept the dull cream
> background and hairline lists). This time, commit fully to the exact spec below.

---

## Mission

Make easyPhoto (easyphoto.in) look like a **premium, vibrant, confident product** — on
par with iLovePDF and Smallpdf, which dominate Google for PDF/photo-tool queries. We are
NOT cloning them; we are adopting the proven patterns that make them feel premium and
convert, and applying them in easyPhoto's own teal/orange identity.

Stack: **Next.js 15 App Router, static export (`output: "export"`), TypeScript, Tailwind.**

**The current site looks DULL. Fix these root causes decisively:**
- Muted cream background → looks washed out.
- Tool icons are faint ~10% tints → they read as monochrome/invisible.
- Tools shown as hairline-divided lists → looks like a wireframe, not a product.
- Monospace UPPERCASE labels everywhere → austere/technical, not friendly.

Read `docs/DESIGN-BRIEF.md` and `app/globals.css` first for context and existing tokens.

---

## EXACT design spec — implement this fully, do NOT water it down

### A. Canvas & surfaces (clean, high-contrast)
- **Page background:** very light warm white `hsl(40 30% 98.5%)` (almost white). NOT cream 97%.
- **Cards / surfaces:** pure white `hsl(0 0% 100%)` so cards visibly POP against the canvas.

### B. Tool cards (the #1 change — make them real cards, not lists)
- Convert EVERY tool list (`/tools/`, `/convert/`, homepage tool strips, exam hub,
  category pages) into a **grid of cards**:
  - `bg-white`, `rounded-xl`, 1px border `hsl(36 18% 90%)`, ~20px padding.
  - Resting shadow: `0 1px 2px rgb(0 0 0 / 0.04), 0 2px 8px rgb(0 0 0 / 0.04)`.
  - **Hover:** `translateY(-2px)` + shadow `0 6px 20px rgb(0 0 0 / 0.08)` + border tinted
    toward the tool's category color. 150ms transition.
  - Grid: 1 col mobile → 2 sm → 3 lg, ~16px gap.

### C. Colorful icon tiles (the HERO of each card — be BOLD)
- Each tool icon sits in a **vibrant rounded tile**, ~44–48px, `rounded-xl`.
- Tile bg = category color at **~14% opacity**; icon = the **full-saturation** category
  color, stroke ~1.75, size ~22–24px.
- The grid of icons must look **colorful and lively from across the room.** If it reads
  monochrome or faint, you under-did it — raise saturation/size.

### D. Category color SYSTEM (vibrant + accessible — use these exact hues)
| Category | Use for | Icon/text color (HSL) |
|---|---|---|
| Photo (brand) | passport, photo tools | `174 72% 32%` teal |
| PDF | all PDF tools | `8 78% 50%` coral-red |
| Signature | signature tools | `245 68% 58%` indigo |
| Privacy | mask Aadhaar, unlock | `150 60% 34%` green |
| Convert | format/convert | `210 80% 48%` blue |
| Exam/compliance | exam kit, checker | `32 90% 45%` amber |
- Icon colors must hit **WCAG AA (≥4.5:1)** on white — verify.
- Keep **teal `--brand`** as the primary brand, **orange `--cta` `22 89% 50%`** as the
  single primary action button. Category colors are for ICONS/wayfinding only — do NOT
  make buttons or links rainbow.

### E. Typography
- Hero headline: large, bold, confident (keep the teal accent word).
- **Soften the monospace UPPERCASE eyebrows** to clean normal-case section titles
  (semibold `text-ink`, ~14–15px). **Keep monospace ONLY for spec/data** (e.g.
  "35 × 45 MM · 300 DPI", KB sizes) where it signals precision.

### F. Buttons & spacing
- Primary (orange) button: larger, `rounded-lg`/`rounded-full`, confident padding, subtle
  shadow. One primary per view. Generous whitespace; consistent radii; 150ms transitions.

---

## KEEP — our edge over generic tools (do NOT remove or weaken)
- Brand **teal** (wordmark/links/active) + **orange** stamp CTA.
- **Trust signals** — TrustPills (100% private / free, no watermark / official sources),
  the "official source · verified {date}" provenance on exam pages, compliance messaging.
  Make these MORE prominent (clean pills/badges), not less.
- The **scanner loading motif** (`ProcessingState`, `ScanProgress`).
- The **compliance result card**, spec sheets, "exact to the millimetre" precision feel.

---

## HARD CONSTRAINTS — breaking ANY = rejected (tools & SEO MUST be unaffected)

1. **NEVER edit `store/useToolStore.ts`** (device/engine matrix — sacred). `git diff` = 0.
2. **VISUAL LAYER ONLY — do not change tool functionality or logic.** No edits to any
   `lib/*` algorithm (`pipeline.ts`, `imaging.ts`, `compress.ts`, `segmentation.ts`,
   `pdf*.ts`, `portalPresets.ts`, `compliance*.ts`, `signature.ts`) or to tool components'
   behaviour/handlers. Style + markup only. Every tool must work exactly as before.
3. **SEO MUST NOT BE AFFECTED:** keep every page's `<title>`, `<meta description>`,
   canonical (via `pageMetadata`/`lib/seo.ts`); keep ALL JSON-LD from `lib/schema.ts`
   (Organization, WebSite, BreadcrumbList, SoftwareApplication, HowTo, FAQPage,
   BlogPosting); keep exactly one `<h1>` per page + logical heading order; keep
   `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt` output unchanged; keep image `alt`
   and all internal links.
4. **Do not change routes, slugs, or file/folder names** (breaks rankings + sitemap).
5. **Keep static export working** (`output: "export"`, `next/image` optimization off, no
   server-only code, no runtime fetching).
6. **Accessibility (WCAG 2.1 AA):** contrast ≥ 4.5:1 (verify new colors), visible
   `:focus-visible`, touch targets ≥ 44px, respect `prefers-reduced-motion`; keep skip-link
   + MobileNav focus trap.
7. **Theme via tokens** in `app/globals.css` + `tailwind.config`; don't scatter raw hex.
8. **No dark mode** (light-only). No heavy image/illustration bloat; no big new deps; keep
   First-Load JS roughly where it is.

---

## How to work
- Work on a **dedicated git branch** (e.g. `redesign-v2`). NEVER touch `master` or `dev`,
  and do not stash/checkout/revert files in the shared working tree — work only on your branch.
- Keep `npm run build` (≈330 static pages) + `npx tsc --noEmit` green at every step.
- Primary files: `app/globals.css`, `tailwind.config.*`, `components/site/ToolIcon.tsx`
  (icon tiles + category colors), `components/site/*` (MainNav, Footer, TrustStrip,
  HowItWorks), `components/tools/CategoryPage.tsx`, `app/tools/page.tsx`,
  `app/convert/page.tsx`, `app/exam-requirements/page.tsx`, `app/page.tsx`,
  `components/ui/button.tsx`, `components/ui/card.tsx`.

## Definition of done
- Build passes (≈330 pages), `tsc` clean, `git diff store/useToolStore.ts` = 0.
- All SEO/JSON-LD/routes/sitemap/robots/llms.txt intact; every tool still works.
- Tool grids are vibrant color-coded CARDS on a clean white canvas; icons read as
  genuinely colorful; brand teal/orange + trust signals intact and prominent.
- Side-by-side it should look as premium as iLovePDF/Smallpdf — but still easyPhoto.
- A11y preserved. Leave the branch for review; DO NOT merge. Provide a per-file summary.
