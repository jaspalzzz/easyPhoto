# Claude Code Kickoff — Passport & Visa Photo Maker

> Paste this as your opening message in Claude Code. Drop `countrySpecs.js` and
> `headPositioning.js` (provided separately) into the repo first — they are the
> **verified, tested foundation** and must not be regenerated or second-guessed.

---

## 1. What you are building

A **free, privacy-first, 100% client-side** web tool that turns a user's photo
into a compliant passport/visa photo for a specific country: auto-crops and
scales the face to that country's exact head-size band, replaces the background
with the country-correct colour, runs a compliance check, and exports
print-ready and online-upload files.

**Business model is fixed:** completely free, no watermark, no paywall, no
payment code. Monetisation later is ads + a print-delivery affiliate at the
download step — out of scope for this build. Do **not** add Stripe, accounts,
or a backend.

**The product is correctness.** A photo that gets rejected at a passport office
destroys the tool's reputation. Per-country accuracy is the entire value
proposition — treat the spec data as sacred.

---

## 2. Non-negotiable constraints

- **No server. No uploads. Ever.** All image processing happens in the browser.
  No image bytes touch the network. No backend, no API routes that receive
  images. The privacy guarantee ("your photo never leaves your device") is a
  core selling point and a hard rule.
- **No browser storage of images** — keep image data in memory (Zustand) only.
  No localStorage/IndexedDB for photos.
- **Background colour is per-country, never hardcoded white.** Always read
  `spec.background.hex`. (See gotchas — this is the #1 rejection cause.)
- **Drive head positioning off `headHeightMm`, not a generic crop.** The
  provided engine already does this; use it.

---

## 3. Tech stack

**Frontend:** Next.js 15 (App Router, `output: 'export'` static export — needed
for the per-country SEO pages), TypeScript, Tailwind CSS, ShadCN UI, Zustand.

**Image processing:** Canvas API (core compositing), **Pica** (high-quality
final downscale), **react-cropper** (manual fine-tune step only — auto-crop
comes from the engine).

**Face detection:** **MediaPipe Tasks Vision `FaceLandmarker`** — gives precise
chin (landmark 152), eye centres, and face oval to feed `computeCrop`. (Basic
Face Detection is not precise enough.)

**Background removal:** **`@imgly/background-removal`** — runs ONNX fully
client-side, good hair edges, and its alpha mask gives us `crownY` (topmost
opaque pixel of the head). Lazy-load the model so it doesn't block first paint.

**PDF:** **jsPDF** only — for the multi-photo print sheet (place images at exact
mm). Drop pdf-lib.

**File-size compression:** custom helper — binary-search JPEG quality via
`canvas.toBlob()` to land under each country's KB cap. No dependency.

**Testing:** Vitest — unit-test the pure geometry engine; it's deterministic.

---

## 4. Provided foundation (source of truth — do not regenerate)

Two files are in the repo. Port them to TypeScript (`.ts`) but keep the logic
and values identical:

- **`lib/countrySpecs.ts`** — verified per-country spec database (dimensions,
  head-height bands, background colours, digital pixel/KB targets, sources,
  `verified` flags, `LAUNCH_ORDER`). Each value was checked against official
  government sources; do not "tidy" the numbers.
- **`lib/headPositioning.ts`** — tested pure-geometry engine: `mmToPx`,
  `targetHeadMm`, `recommendedDigitalDpi`, `computeCrop`, `renderToCanvas`. It
  takes face measurements + a spec and returns the exact crop + output size,
  with built-in compliance warnings. This is the pass/reject math — treat it as
  correct and build around it.

---

## 5. Folder structure

```
/app
  /page.tsx                 # home: country picker + intro
  /[country]/page.tsx       # SSG SEO page per country: written spec + embedded tool
/components
  /tool/Uploader.tsx        # file/drop input (no upload to server)
  /tool/Editor.tsx          # auto-crop preview + react-cropper fine-tune
  /tool/CompliancePanel.tsx # checklist of pass/warn items
  /tool/ExportPanel.tsx     # print + digital + print-sheet downloads
  /ui/*                     # shadcn components
/lib
  countrySpecs.ts           # provided
  headPositioning.ts        # provided
  faceDetection.ts          # FaceLandmarker -> {chinY, crownY?, eyeCenterY, faceCenterX}
  segmentation.ts           # @imgly bg removal -> cutout + alpha mask + crownY
  background.ts             # composite cutout over spec.background.hex
  compress.ts               # JPEG KB-cap binary-search compressor
  printSheet.ts             # jsPDF 4x6" sheet with N copies
/store
  useToolStore.ts           # Zustand: source image, measurements, spec, result
/test
  headPositioning.test.ts   # Vitest
```

---

## 6. Processing pipeline (the core flow)

```
upload image (in-memory)
  → FaceLandmarker → { chinY, eyeCenterY, faceCenterX }
  → @imgly bg removal → { cutout, alphaMask }
      → crownY = topmost opaque pixel of alphaMask within head's X span  (PREFERRED)
  → computeCrop({ chinY, crownY, eyeCenterY, faceCenterX }, spec, { source, dpi })
  → composite cutout over spec.background.hex
  → renderToCanvas + Pica final resize to exact output px
  → CompliancePanel shows result.warnings
  → export:
       • print preset:   PNG/JPG at print DPI (~300)
       • digital preset:  JPG at recommendedDigitalDpi(spec), compressed under KB cap
       • print sheet:     jsPDF 4x6" with multiple copies (optional)
```

`crownY` is the hardest input — landmark models can't see through hair, so use
the segmentation alpha mask's topmost opaque pixel. Fallback only if no mask:
extrapolate above the forehead landmark. (The engine's footer notes document
this.)

---

## 7. Critical domain gotchas (these cause rejections)

1. **Background colour is per-country — never default to white:**
   - US / India / Canada → white / off-white (`#FFFFFF`)
   - **UK → light grey or cream, NOT white** (top UK rejection cause)
   - **Schengen → light grey is safest** (pure white risks France/Switzerland rejection)
   - Always read `spec.background.hex`. UK/Schengen defaults are already grey/cream in the data.

2. **Face size is larger than people expect and varies by country.** India needs
   a notably large face (36–38mm). Undersized faces are a leading rejection
   reason everywhere. The engine targets the centre of each band — don't override.

3. **India is BLOCKED for production** until its Passport Seva pixel/KB caps are
   confirmed at passportindia.gov.in. Its `verified` flag is `"aggregator"` and
   sources conflict (250/300/1024 KB) and its mm head-height yields ~82% of frame
   vs a stated 70–80% band (the engine will warn). Build the India page but gate
   it behind a "specs pending verification" guard; do not present it as ready.

4. **Canada printed passport is NOT supported** — official rules require a
   commercial photographer's certification + guarantor signature on the back,
   which a DIY tool cannot produce. Serve only Canada **visa/PR/online-renewal**
   (35×45mm digital). Do not advertise printed Canadian passport support.

5. **Print vs digital need different DPI.** Print preset ~300 DPI; the digital
   upload preset must use `recommendedDigitalDpi(spec)` so it meets the online
   pixel minimum (e.g. UK 600×750). Don't assume 300 for digital.

---

## 8. Build phases (ship incrementally — do not attempt everything at once)

**Phase 1 — Prove the pipeline on US only (gov-verified).**
Scaffold Next.js + Tailwind + ShadCN + Zustand. Port the two foundation files.
Implement upload → FaceLandmarker → computeCrop → white background fill →
renderToCanvas/Pica → export print + digital JPG. Target a clean end-to-end
result for the US spec. Add Vitest tests for `headPositioning` (assert head%
within band, output dimensions, warnings fire on tight/low-res sources).

**Phase 2 — Segmentation quality + crownY + manual fine-tune.**
Wire `@imgly/background-removal`, derive `crownY` from the alpha mask, composite
over the spec background colour. Add react-cropper for optional manual nudging.
Build the CompliancePanel surfacing `result.warnings`.

**Phase 3 — Multi-country + SEO pages.**
Add Canada (visa-scoped), Schengen (grey), UK (grey/cream). Build
`/[country]/page.tsx` with `generateStaticParams` from `LAUNCH_ORDER`, rendering
the human-readable spec from `countrySpecs` as page content + the tool preset.
Per-country `<title>`/metadata; link the official `source` URL on each page.

**Phase 4 — Export polish.**
File-size compressor to KB caps, jsPDF print sheet, final compliance checklist
UI, low-res/tight-frame retake prompts.

**Phase 5 — India, LAST.**
Only after primary-source verification. Until then keep it gated.

---

## 9. SEO structure

One tool, many static pages. Each `/[country]` route is statically generated and
targets the exact-match query ("US passport photo size", "Schengen visa photo
requirements"). The page leads with the written spec (genuinely useful content
that ranks AND proves correctness), then embeds the tool pre-set to that country.
This is the growth engine — every country added is another ranking page.

---

## 10. What NOT to do

- No backend, no image upload, no API route receiving image data.
- No payment, accounts, or watermark (model is free).
- Don't hardcode a white background — read `spec.background.hex`.
- Don't enable India in production; don't claim printed Canadian passport support.
- Don't rewrite or "improve" the spec numbers or the geometry engine.
- Don't store images in localStorage/IndexedDB.

Start with Phase 1. Confirm the US end-to-end result and passing Vitest tests
before moving on.
