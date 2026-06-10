# Antigravity Prompt — easyPhoto Design Improvement

> Paste everything below the line into Antigravity. It is self-contained.

---

## Your task

You are improving the **visual design and UX** of easyPhoto (easyphoto.in), a free,
privacy-first web app for passport/visa photos, exam photo & signature resizing, and
PDF/image tools. The codebase is **Next.js 15 (App Router), static export
(`output: "export"`), TypeScript, Tailwind**.

**The goal is NOT to copy iLovePDF or Smallpdf.** Those sites dominate Google for
PDF/photo-tool queries, so the goal is to **learn the proven UX patterns that make
them convert and rank, and apply those patterns to easyPhoto's own identity** so we
can compete for that same traffic and lead the category. Improve our product using
their best ideas — do not clone their look. easyPhoto must stay recognisably itself.

Before writing code, **read these files** for the existing design language and rules:
- `docs/DESIGN-BRIEF.md` — the detailed direction + HARD CONSTRAINTS + verification checklist (authoritative)
- `app/globals.css` — the "Passport Bureau" design tokens and component classes
- `CLAUDE.md` / any memory files — project rules

## Winning patterns to adopt (the "good things" that drive their traffic)

Apply these proven, conversion- and SEO-friendly patterns, expressed in OUR brand:

1. **Instant tool findability.** Turn tool *lists* into a **scannable card grid** —
   each tool a distinct, tappable tile with a clear icon, name, and one-line benefit.
   A user should spot their tool in ~2 seconds (this is the single biggest reason
   those sites convert).
2. **Color as a wayfinding tool.** Give tool icons **distinct category accent colors**
   in soft tinted badges (Photo, PDF, Signature, Privacy each its own hue) — like the
   way Smallpdf colors its tools — so the grid is fast to scan. Keep it a small,
   harmonious palette, not a rainbow.
3. **Tool-first, low friction.** The actual tool / drop zone should be the hero of a
   tool page — big, obvious, immediately usable above the fold. Minimise reading
   before the user can act.
4. **Clean, confident surfaces.** Move toward cleaner near-white surfaces with cards
   that "pop" (subtle border + soft shadow + gentle hover lift). Keep a hint of warmth
   — don't go sterile clinical white.
5. **One obvious primary action per view.** Big, friendly, rounded primary button.
6. **A predictable, repeatable tool-page template** (hero + tool + how-it-works + FAQ +
   related tools). Consistency aids both UX and SEO.

## Keep (this is our edge over them — do NOT remove)

- **Brand:** teal (`--brand`) for wordmark/links/active; orange (`--cta`) as the single
  primary "stamp" action.
- **Trust signals:** the TrustPills (100% private / free, no watermark / official
  sources), the "official source · verified {date}" provenance on exam pages, and the
  compliance-check messaging. These are why people trust us over generic tools — make
  them MORE prominent, not less.
- The **scanner loading motif** (`ProcessingState`, `ScanProgress`).
- The **compliance result card**, spec sheets, and the "exact to the millimetre"
  precision feel. Keep monospace for **spec/data** (sizes, DPI) only.

## HARD CONSTRAINTS — breaking any of these fails review

1. **NEVER edit `store/useToolStore.ts`** (the device/engine matrix — sacred). Its
   `git diff` must be exactly 0 lines.
2. **Visual layer only.** Do NOT change tool logic, pipelines, or `lib/*` algorithms
   (`pipeline.ts`, `imaging.ts`, `compress.ts`, `segmentation.ts`, `portalPresets.ts`,
   `complianceCard.ts`, etc.). No behaviour changes.
3. **Do not break SEO / structured data:** keep every page's `<title>`,
   `<meta description>`, canonical (via `pageMetadata`); keep ALL JSON-LD from
   `lib/schema.ts` (Organization, WebSite, BreadcrumbList, SoftwareApplication, HowTo,
   FAQPage, BlogPosting); keep one `<h1>` per page + logical heading order; keep
   `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt` output unchanged; keep image `alt`.
4. **Do not change routes, slugs, or folder names** (breaks rankings + sitemap).
5. **Keep the static export working** (`output: "export"`; `next/image` optimization is
   off; no server-only code, no runtime fetching).
6. **Accessibility (WCAG 2.1 AA):** text contrast ≥ 4.5:1, visible `:focus-visible`,
   touch targets ≥ 44px, respect `prefers-reduced-motion`; don't regress the skip link
   or MobileNav focus trap.
7. **Theme via tokens:** change the HSL design-token *values* in `app/globals.css` and
   component classes; do NOT scatter hardcoded hex colors across components.
8. **Performance:** no large illustration/image bloat; no heavy new styling deps; keep
   First-Load JS roughly where it is.

## How to work

- Work on a **new git branch** (e.g. `redesign`), never on `master` or `dev`.
- Make changes incrementally and keep `npm run build` + `npx tsc --noEmit` green at
  each step.
- Touch primarily: `app/globals.css`, `tailwind.config.*`, `components/site/*`
  (MainNav, Footer, TrustStrip, ToolIcon, HowItWorks), `components/tools/CategoryPage.tsx`,
  `app/tools/page.tsx`, `app/convert/page.tsx`, `app/exam-requirements/page.tsx`,
  `app/page.tsx`, `components/ui/button.tsx`.
- Do not introduce dark mode (the site is intentionally light-only).

## Definition of done

- `npm run build` passes (≈330 static pages), `npx tsc --noEmit` clean.
- `git diff store/useToolStore.ts` = 0.
- All SEO/JSON-LD, routes, sitemap, robots, llms.txt intact.
- The tool grids are card-based and color-coded; surfaces cleaner; brand teal/orange
  and all trust signals still present and prominent.
- Accessibility (contrast/focus/targets/reduced-motion) preserved.
- A short summary of what changed, per file.

Leave the branch for review — do not merge to master.
