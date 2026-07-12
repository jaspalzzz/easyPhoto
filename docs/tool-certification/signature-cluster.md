# Signature cluster — certification status

The signature tools are the site's evergreen, click-earning USP (GSC: "sign on
image", "add sign to photo", etc.). "Certified" here means an E2E test drives
the real upload → process → download flow and asserts on the **actual output
bytes/pixels**, not merely that a button appeared.

Harness: `e2e/*.spec.ts` via Playwright on a dedicated port (see
`playwright.config.ts`). Run: `npx playwright test`.

| Tool | Route | Certified behaviour | Spec |
|------|-------|---------------------|------|
| Sign image | `/tools/sign-image/` | Drag-rotate + `[`/`]` keys change the angle; a 90° rotation is baked into the exported JPEG pixels (not a CSS-only preview) | `e2e/sign-image-rotation.spec.ts` |
| Transparent signature | `/tools/transparent-signature/` | White paper → transparent; ink stays opaque + dark in the downloaded PNG | `e2e/signature-cluster.spec.ts` |
| Signature resize | `/tools/signature-resize/` | Output binds to the KB target — both the reported size and the downloaded bytes obey the cap | `e2e/signature-cluster.spec.ts` |
| Signature crop | `/tools/signature-crop/` | Auto-detect crops the output tighter than the input while preserving the ink | `e2e/signature-cluster.spec.ts` |
| Sign PDF | `/tools/sign-pdf/` | Places a signature and exports a **valid** PDF with every page preserved and the signature embedded | `e2e/signature-cluster.spec.ts` |

Shared-engine note: `signature-cleaner` and `signature-background-removal` are
the same `SignatureWorkflowTool` as transparent-signature / signature-resize,
so the transparent + resize tests exercise both branches (clean-to-PNG and KB
compression) of that engine.

## Resize-KB + voter-ID cluster (the other GSC click cluster)

| Tool | Route | Certified behaviour | Spec |
|------|-------|---------------------|------|
| Resize to KB | `/tools/resize-kb/` | Downloaded file genuinely stays under the target and decodes; a very tight 10 KB target still yields a valid, non-corrupt image | `e2e/resize-portal.spec.ts` |
| Voter-ID photo resizer | `/voter-id-photo-resizer/` | Surfaces the ECI Form 6 spec (~2 MB / 2048 KB — the "voter id photo size in mb" answer) and binds output to a set target | `e2e/resize-portal.spec.ts` |

Shared-engine note: the voter-ID resizer is `PortalResizer` → `ResizeKbTool`
wired with the ECI spec, so every `*-photo-resizer` / `form-resizer/{portal}`
page shares the same certified compressor.

## Exam application kit (the combined high-intent workflow)

| Tool | Route | Certified behaviour | Spec |
|------|-------|---------------------|------|
| Exam package | `/tools/exam-package/` | Full wizard: pick exam (SSC) → photo → signature → **valid ZIP** containing a real JPEG photo (magic bytes), a real PNG signature, and a README | `e2e/exam-package.spec.ts` |

This is the highest-intent workflow an applicant completes end-to-end; the test
asserts on the actual bundled ZIP contents, not just that a download fired.

## Tier-1 passport maker (the higher-RPM segment)

| Tool | Route | Certified behaviour | Spec |
|------|-------|---------------------|------|
| US passport maker | `/us-passport-photo-maker/` | Full ML pipeline (detect face → remove background → crop to spec) exports a **square** 2×2 photo ≥600px — proving the country spec drives output geometry | `e2e/passport-maker.spec.ts` |

Shared-engine note: every country maker is `PhotoTool` wired to a `CountrySpec`,
so the US test certifies the mechanism; UK/Canada/AU/EU differ only in spec data
(e.g. UK 35×45mm portrait). Extend by asserting each country's expected aspect.

## Not yet certified (next passes)
- Sign image: signature **placement accuracy** (lands where dropped) and resize.
- Multi-signature composition.
- HEIC-input path for signature upload (iOS scans).
