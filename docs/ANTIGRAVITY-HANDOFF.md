# EasyPhoto — Build Brief for Antigravity

## Project
EasyPhoto is a 100% client-side "application document preparation platform" for Indian
exam / government / visa candidates. Next.js 15 (App Router, `output: "export"` static),
TypeScript, Tailwind, Zustand, deployed on Cloudflare Pages (easyphoto.in).
Mission: prepare application-ready photos/signatures/PDFs in <30s.

## Branch & workflow rules (MANDATORY)
- Work ONLY on branch `feature-seo-tools` (currently at the latest commit).
  Do NOT create new branches or switch branches mid-task.
- ONE feature per commit. No 1000-line mixed commits.
- Leave the working tree COMMITTED & CLEAN when done.
- For each feature, write a 2-line note: what it does + target keyword + official spec source URL.
- A human (Claude) will review and fix flow after each commit.

## Foundations already built — USE THESE, do not reinvent

### 1. Spec registry — `lib/specRegistry.ts` + `lib/portalPresets.ts`
The single source of truth for document specs WITH provenance.
```ts
import { PORTAL_PRESETS, PORTAL_KEYS, type PortalSpec } from "@/lib/portalPresets";
import { specProvenance, getPortalSpec } from "@/lib/specRegistry";

const spec = getPortalSpec("ssc");          // PortalSpec | undefined
const prov = specProvenance(spec);          // { verified, label, url, sourceLabel }
// Render prov.label as a trust signal, e.g. "Always confirm on the official source"
// with a link to prov.url. NEVER claim "verified" yourself — specProvenance decides.
```
`PortalSpec` fields: `id, name, photoLimitKb, photoMinKb?, sigLimitKb?, sigMinKb?,
photoWidthPx?, photoHeightPx?, sigWidthPx?, sigHeightPx?, photoAspectRatio?,
sigAspectRatio?, description, source?, verification?, verifiedOn?`.
Current portals: `ssc, upsc, ds160, passport-seva, oci`.
- Do NOT hardcode KB/dimension numbers in pages — read them from the registry.
- To add a new exam, add an entry to `PORTAL_PRESETS` with a `source` URL and
  `verification: "needs-review"`. `npm run check:specs` tracks unverified specs.

### 2. Analytics — `lib/analytics.ts`
Privacy-safe, anonymous-only. NEVER pass document data/file names/PII.
```ts
import { track, deviceClass } from "@/lib/analytics";
track({ name: "tool_start",   tool: "ssc-photo-resizer", device: deviceClass() });
track({ name: "tool_success", tool: "ssc-photo-resizer" });
track({ name: "tool_failure", tool: "ssc-photo-resizer", reason: "no-face" }); // reason = short CODE only
track({ name: "download",     tool: "ssc-photo-resizer", format: "jpg" });
```
Event names allowed: `tool_view | tool_start | tool_success | tool_failure | download`.
Props are enums/numbers only — do NOT add free-form string fields.

## Building blocks to REUSE (don't rebuild)
- **SEO metadata:** `pageMetadata({ title, description, path })` from `@/lib/seo`.
- **OG card:** add `opengraph-image.tsx` per route using `ogImage({ title, subtitle })`
  from `@/lib/og` (+ `export const dynamic="force-static"`, `size=OG_SIZE`,
  `contentType=OG_CONTENT_TYPE`). For dynamic routes add `generateStaticParams`.
- **Tool page shell:** `<ToolPage title slug blurb>{children}</ToolPage>` from
  `@/components/tools/ToolPage` (gives cross-links + structured data).
- **KB resizing UI:** `<PortalResizer portalId="ssc" />` or `<ResizeKbTool .../>`.
- **PDF ops (LOSSLESS):** `mergePdfs/splitPdf` from `@/lib/pdfMergeSplit`,
  `reorderPdf/signPdf` from `@/lib/pdfEdit`. These use pdf-lib.
- **Sitemap & tool listing:** auto-generated from `READY_TOOLS` in
  `@/lib/toolsCatalog` + `PORTAL_KEYS`. Add new tools to `toolsCatalog` (with
  `ready: true`, an `icon` from lucide, a `slug`, `name`, `blurb`) and they appear
  in `/tools`, search, and the sitemap automatically.

## HARD CONSTRAINTS (do not violate)
1. **Privacy:** processing is 100% in-browser. No uploads, no servers, no document
   data sent anywhere. Don't add network calls for user files.
2. **CSP:** do NOT use `fetch()` on `data:` URLs (our CSP blocks `data:` in
   connect-src) — decode base64 with `atob` instead. Don't add new external hosts
   without flagging it.
3. **PDFs:** NEVER rasterize a PDF to images to edit it (no pdfjs→canvas→jsPDF
   rebuild). Use pdf-lib (the lib functions above) so text stays selectable.
4. **Do NOT edit these foundation files:** `lib/specRegistry.ts`, `lib/analytics.ts`,
   `public/_headers`, `lib/seo.ts`, `lib/og.tsx`, `store/useToolStore.ts` privacy rules.
   If you think they need changes, leave a TODO comment and note it for review.
5. **Mobile-first**, works on low-end Android, no login.

## YOUR TASKS (this round)

### Task A — Per-exam SEO landing pages (highest priority)
For each exam, create keyword-rich routes that read specs from the registry:
- `/ssc-photo-resizer`, `/ssc-signature-resizer`, `/ssc-photo-with-name-date`
- `/upsc-photo-resizer`, `/upsc-signature-resizer`
- `/railway-photo-resizer`, `/ibps-photo-resizer`, `/sbi-po-photo-resizer`

For exams not yet in `PORTAL_PRESETS` (railway, ibps, sbi), add them to
`PORTAL_PRESETS` first with `source` URL + `verification: "needs-review"`.
Each page must:
- Use `pageMetadata()` + an `opengraph-image.tsx`.
- Wrap content in `<ToolPage>` and reuse `<PortalResizer>` / `<ResizeKbTool>`.
- Render the `specProvenance()` trust line linking to the official source.
- Read all numbers from the registry (no hardcoding).
- Call `track()` on start/success/failure/download.

### Task B — Photo with Name & Date generator
Route `/tools/photo-with-name-date` (+ exam variants like `/ssc-photo-with-name-date`).
- Upload photo → enter Name → pick Date → render a white strip with name+date below
  the photo → export. Pure canvas, mobile-first, client-side only.
- Add to `toolsCatalog` (ready:true) + `opengraph-image.tsx`.
- Call `track()`.

## Before you hand off (checklist)
- [ ] `npx tsc --noEmit` clean
- [ ] `npm test` green
- [ ] `npm run build` succeeds
- [ ] every new route has `opengraph-image.tsx` + appears in the sitemap
- [ ] no hardcoded spec numbers (read from registry)
- [ ] no `fetch(data:)`, no PDF rasterizing (EXCEPT the compressor — see Round 2), no uploads
- [ ] working tree committed & clean on `feature-seo-tools`

---

# ROUND 2 — next batch (Task A is done & shipped)

## What's already shipped (don't rebuild)
- Per-exam landing pages: SSC, UPSC, Railway, IBPS, SBI-PO (photo + signature resizers).
- DOP Maker (`/tools/photo-with-name-date`), Signature Cleaner (`/tools/signature-cleaner`).
- Spec registry verified: SSC, IBPS, SBI, DS-160, Passport Seva, OCI are
  `verification: "official"`. UPSC + RRB are still `needs-review` (don't mark them
  official without an official-notification source).
- **FAQ foundation:** `portalFaqItems(spec)` in `@/lib/faqs` → pass it to
  `ToolPage`'s `faqItems` prop on every exam page for FAQPage rich results.
  Use this pattern on any NEW exam/portal page you add.

## New building blocks available
- `portalFaqItems(spec)` — `@/lib/faqs` (registry-driven exam FAQ + JSON-LD).
- `specProvenance(spec)` / `getPortalSpec(id)` — `@/lib/specRegistry`.
- `track()` — `@/lib/analytics` (anonymous events only).

## Task C — Hindi / Hinglish SEO pages (highest priority)
The audience searches in Hinglish: "photo ka size 20kb kaise kare", "signature
resize kaise kare", "passport photo white background kaise banaye".
- **Do NOT add an i18n framework** (next-intl etc.) — overkill for a static export
  and it complicates the build. Instead create **dedicated Hinglish landing pages**
  with Hindi/Hinglish copy that point at the EXISTING tools.
- Suggested routes: `/photo-ka-size-20kb-kaise-kare/`, `/signature-resize-kaise-kare/`,
  `/passport-photo-white-background/` (one per top Hinglish query).
- Each: `pageMetadata()` (Hinglish title/description), `opengraph-image.tsx`,
  `<ToolPage>` + the matching existing tool (`ResizeKbTool` / `SignatureKbTool`),
  `portalFaqItems`-style Hindi FAQ (write Hindi Q&A as plain strings), `track()`.
  Set `<html lang>` appropriately if you add a Hindi section, and keep numbers
  from the registry.

## Task D — Exam Package Wizard
Route `/tools/exam-package` (+ per-exam like `/ssc-exam-kit`).
- Step 1: pick exam (from `PORTAL_KEYS`). Step 2: upload + fix PHOTO (reuse the
  photo/KB tools, driven by `getPortalSpec(id)`). Step 3: upload + fix SIGNATURE.
  Step 4: show both with ✅ compliance ("18 KB ✓ under 20 KB") and download both.
- 100% client-side, reuse existing tools/libs, `track()` each step.

## Task E — PDF Compressor
Route `/tools/pdf-compress`. Targets: 100 / 200 / 500 KB (marksheets, certificates).
- **IMPORTANT — this is the ONE place rasterizing is correct.** A size-compressor
  must resample: scanned PDFs can't be shrunk losslessly. Render pages with
  `pdfToCanvases` (`@/lib/pdfToImages`), then re-encode to JPEG at an **adaptive
  scale × quality** until total bytes ≤ target, and rebuild with `jspdf`. Be
  honest in the UI: "output is optimised to fit the size limit (text becomes
  images)". (Merge/split/reorder/sign stay LOSSLESS via `pdf-lib` — do not change them.)
- Client-side only, `track()`, OG image, add to `toolsCatalog`.

Same checklist + branch rules as above apply to Round 2.
