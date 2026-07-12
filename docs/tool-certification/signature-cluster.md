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

## Not yet certified (next passes)
- Sign image: signature **placement accuracy** (lands where dropped) and resize.
- Multi-signature composition.
- HEIC-input path for signature upload (iOS scans).
