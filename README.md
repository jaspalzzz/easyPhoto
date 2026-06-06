# Passport & Visa Photo Maker

A free, **100% client-side** web tool that turns a normal photo into a
compliant passport/visa photo for a specific country. It auto-crops and scales
the face to the country's exact head-size band, replaces the background with the
country-correct colour, runs a compliance check, and exports print-ready and
online-upload files.

> **Privacy is the product.** No server, no uploads, ever. Every byte of the
> image is processed in the browser. Nothing is persisted to localStorage or
> IndexedDB. Only ML model assets (face detection, background removal) are
> fetched from a CDN — never your photo.

## Status

| Phase | Scope | State |
|------|-------|-------|
| 1 | US pipeline end-to-end + engine tests | ✅ Done |
| 2 | Background removal, mask-derived crownY, composite, manual fine-tune | ✅ Done |
| 3 | Multi-country SSG SEO pages | ✅ Done (US, Canada, Schengen, UK) |
| 4 | Print sheet (PDF), KB-cap compression, retake prompts | ✅ Done |
| 5 | India | ⏸️ **Gated** — specs unverified (see below) |

### Country notes

- **Canada** — printed passport is **not** supported (it requires a commercial
  photographer's certification + guarantor signature a DIY tool can't produce).
  The tool serves only Canada's visa/PR/online-renewal format (**35×45mm**).
- **India** — **blocked for production**. Its Passport Seva pixel/KB caps are
  reported inconsistently across sources and must be confirmed directly at
  [passportindia.gov.in](https://www.passportindia.gov.in/) before enabling. The
  page is built but shows a "specs pending verification" guard.
- **UK / Schengen** — background defaults to grey/cream, **not** white (a top
  rejection cause). Always driven by `spec.background.hex`.

## Tech stack

- **Next.js 15** (App Router, `output: 'export'` static export) · TypeScript ·
  Tailwind · ShadCN-style UI · **Zustand** (in-memory only)
- **MediaPipe Tasks Vision `FaceLandmarker`** — face landmarks (chin, eyes, face centre)
- **`@imgly/background-removal`** — client-side ONNX background removal; its alpha
  mask also yields the true `crownY`
- **Pica** — high-quality final downscale · **react-cropper** — manual fine-tune
- **jsPDF** — 4×6" multi-photo print sheet (lazy-loaded)
- **Vitest** — unit tests for the pure geometry engine

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm test           # Vitest (geometry + export logic)
```

## Architecture

```
upload (in-memory)
  → FaceLandmarker            → { chinY, eyeCenterY, faceCenterX }   lib/faceDetection.ts
  → @imgly background removal → cutout + alpha mask                  lib/segmentation.ts
      → crownY = topmost opaque pixel within the head's X-span (preferred)
  → computeCrop(...)          → exact crop + output px + warnings    lib/headPositioning.ts
  → composite over spec.background.hex                               lib/segmentation.ts
  → Pica resize to exact px                                          lib/pipeline.ts
  → CompliancePanel (warnings) · ExportPanel (print / digital / sheet)
```

### The sacred foundation

Two files are the **source of truth** and must not be "tidied" or regenerated —
every number was checked against an official government source. A wrong value
here means a rejected photo.

- [`lib/countrySpecs.ts`](lib/countrySpecs.ts) — per-country spec database
  (dimensions, head-height bands, background colours, digital/KB targets,
  `verified` flags, `LAUNCH_ORDER`). The original verified JS is preserved in
  [`reference/`](reference/).
- [`lib/headPositioning.ts`](lib/headPositioning.ts) — the pure geometry engine
  (`mmToPx`, `targetHeadMm`, `recommendedDigitalDpi`, `computeCrop`,
  `renderToCanvas`). It decides pass-vs-reject and is fully unit-tested.

`effectivePrintMm()` / `renderSpec()` are **derived** helpers (they don't mutate
the data) that route Canada to its supported 35×45mm visa size.

## Key constraints (do not break)

- No backend, no API route that receives image data, no uploads.
- No payments, accounts, or watermark — the tool is free.
- Never hardcode a white background — always read `spec.background.hex`.
- Never persist images to localStorage/IndexedDB.
- Don't enable India in production; don't claim printed Canadian passport support.
- Don't rewrite the spec numbers or the geometry engine.

## Project layout

```
app/                  home (country picker) + /[country] SSG pages
components/tool/       Uploader, Editor (react-cropper), CompliancePanel, ExportPanel, PhotoTool
components/ui/         button, card (ShadCN-style)
lib/                   countrySpecs, headPositioning, faceDetection, segmentation,
                       background, compress, printSheet, pipeline, utils
store/                 useToolStore (Zustand, in-memory)
test/                  Vitest — headPositioning, exports
reference/             original verified JS foundation files
```
